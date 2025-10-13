import type {
  ChartResultArray,
  ChartResultArrayQuote,
  ChartMeta,
} from "@/node_modules/yahoo-finance2/dist/esm/src/modules/chart"
import { getOfflineQuote } from "@/data/offlineQuotes"
import type { Interval, Range } from "@/types/yahoo-finance"

const RANGE_CONFIG: Record<Range, { days: number; points: number }> = {
  "1d": { days: 1, points: 78 },
  "1w": { days: 7, points: 70 },
  "1m": { days: 30, points: 90 },
  "3m": { days: 90, points: 100 },
  "1y": { days: 365, points: 120 },
}

const INTERVAL_TO_MINUTES: Record<Interval, number> = {
  "1m": 1,
  "2m": 2,
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "60m": 60,
  "90m": 90,
  "1h": 60,
  "1d": 60 * 24,
  "5d": 60 * 24 * 5,
  "1wk": 60 * 24 * 7,
  "1mo": 60 * 24 * 30,
  "3mo": 60 * 24 * 90,
}

function createSeed(ticker: string, range: Range): number {
  let hash = 0
  const key = `${ticker}|${range}`
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(index)
    hash |= 0
  }

  return (hash >>> 0) || 1
}

function createRandom(seed: number): () => number {
  let current = seed
  return () => {
    current = (current * 1664525 + 1013904223) % 0x100000000
    return current / 0x100000000
  }
}

function clamp(value: number, min: number): number {
  return Math.max(value, min)
}

function resolveRangeConfig(range: Range) {
  return RANGE_CONFIG[range] ?? RANGE_CONFIG["1m"]
}

function resolveDurationMs(range: Range): number {
  const config = resolveRangeConfig(range)
  return config.days * 24 * 60 * 60 * 1000
}

function resolveStepMs(range: Range, points: number): number {
  if (points <= 1) {
    return 0
  }

  const duration = resolveDurationMs(range)
  return duration / (points - 1)
}

function resolveInterval(interval: Interval): Interval {
  return interval in INTERVAL_TO_MINUTES ? interval : "1d"
}

function buildQuote(
  basePrice: number,
  volatility: number,
  drift: number,
  random: () => number,
  timestamp: number,
  volumeBase: number
): ChartResultArrayQuote {
  const noise = (random() - 0.5) * volatility
  const move = drift + noise
  const close = clamp(basePrice * (1 + move), 0.01)
  const spread = Math.abs((random() - 0.5) * volatility)
  const open = clamp(close * (1 - spread / 2), 0.01)
  const high = clamp(Math.max(close, open) * (1 + spread), 0.01)
  const low = clamp(Math.min(close, open) * (1 - spread), 0.01)
  const volumeMultiplier = 0.8 + random() * 0.4
  const volume = Math.round(Math.max(volumeBase * volumeMultiplier, 0))

  return {
    date: new Date(timestamp),
    open,
    high,
    low,
    close,
    volume,
  }
}

export function createOfflineChart(
  ticker: string,
  range: Range,
  interval: Interval
): ChartResultArray {
  const resolvedInterval = resolveInterval(interval)
  const config = resolveRangeConfig(range)
  const points = Math.max(config.points, 16)
  const stepMs = resolveStepMs(range, points)
  const endTime = Date.now()
  const startTime = endTime - resolveDurationMs(range)

  const offlineQuote = getOfflineQuote(ticker)
  const basePriceCandidate =
    offlineQuote?.regularMarketPrice ??
    offlineQuote?.regularMarketPreviousClose ??
    100
  const basePrice = clamp(basePriceCandidate, 1)
  const volumeBaseCandidate =
    offlineQuote?.regularMarketVolume ??
    offlineQuote?.averageDailyVolume3Month ??
    1_000_000
  const volumeBase = Math.max(volumeBaseCandidate / points, 1000)

  const seed = createSeed(ticker, range)
  const random = createRandom(seed)
  const volatility = 0.015
  const driftBase = (offlineQuote?.regularMarketChangePercent ?? 0) / 100

  const quotes: ChartResultArrayQuote[] = []

  for (let index = 0; index < points; index += 1) {
    const progress = points > 1 ? index / (points - 1) : 1
    const timestamp = startTime + stepMs * index
    const seasonal = Math.sin(progress * Math.PI * 2) * 0.005
    const drift = driftBase * progress + seasonal
    quotes.push(
      buildQuote(basePrice, volatility, drift, random, timestamp, volumeBase)
    )
  }

  const lastQuote = quotes[quotes.length - 1]
  const firstQuote = quotes[0]
  const currentTradingPeriod = {
    timezone: "UTC",
    start: new Date(startTime),
    end: new Date(endTime),
    gmtoffset: 0,
  }

  const meta: ChartMeta = {
    currency: offlineQuote?.currency ?? "USD",
    symbol: ticker,
    exchangeName: offlineQuote?.fullExchangeName ?? "Offline",
    instrumentType: "EQUITY",
    firstTradeDate: null,
    regularMarketTime: lastQuote?.date ?? new Date(endTime),
    gmtoffset: 0,
    timezone: "UTC",
    exchangeTimezoneName: "UTC",
    regularMarketPrice: lastQuote?.close ?? basePrice,
    chartPreviousClose: firstQuote?.close ?? basePrice,
    priceHint: 2,
    currentTradingPeriod: {
      pre: currentTradingPeriod,
      regular: currentTradingPeriod,
      post: currentTradingPeriod,
    },
    dataGranularity: resolvedInterval,
    range,
    validRanges: Object.keys(RANGE_CONFIG) as Range[],
  }

  return {
    meta,
    events: [],
    quotes,
  }
}
