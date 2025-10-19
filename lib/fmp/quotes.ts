import type { Quote } from "@/types/yahoo-finance"
import { asFiniteNumber, isFiniteNumber } from "@/lib/utils/numbers"
import { fmpFetch } from "./client"

export interface FmpQuote {
  symbol: string
  name?: string
  price?: number
  change?: number
  changesPercentage?: number
  dayLow?: number
  dayHigh?: number
  yearLow?: number
  yearHigh?: number
  marketCap?: number
  volume?: number
  avgVolume?: number
  open?: number
  previousClose?: number
  eps?: number
  pe?: number
  exchange?: string
  currency?: string
  timestamp?: number
  postMarketPrice?: number
  postMarketChange?: number
  postMarketChangePercent?: number
  preMarketPrice?: number
  preMarketChange?: number
  preMarketChangePercent?: number
}

type FmpQuoteResponse = FmpQuote[]

export function mapFmpQuoteToQuote(fmpQuote: FmpQuote): Quote {
  const {
    symbol,
    name,
    price,
    change,
    changesPercentage,
    dayLow,
    dayHigh,
    yearLow,
    yearHigh,
    marketCap,
    volume,
    avgVolume,
    open,
    previousClose,
    eps,
    pe,
    exchange,
    currency,
    timestamp,
    postMarketPrice,
    postMarketChange,
    postMarketChangePercent,
    preMarketPrice,
    preMarketChange,
    preMarketChangePercent,
  } = fmpQuote

  const normalizedPrice = asFiniteNumber(price)
  const normalizedEps = asFiniteNumber(eps)

  let normalizedPe = asFiniteNumber(pe)

  if (
    (!isFiniteNumber(normalizedPe) || normalizedPe <= 0) &&
    isFiniteNumber(normalizedPrice) &&
    isFiniteNumber(normalizedEps) &&
    normalizedEps !== 0
  ) {
    const computedPe = normalizedPrice / normalizedEps

    if (Number.isFinite(computedPe) && computedPe > 0) {
      normalizedPe = computedPe
    }
  }

  const mappedQuote: Quote = {
    symbol,
    shortName: name ?? symbol,
    regularMarketPrice: normalizedPrice,
    regularMarketChange: change,
    regularMarketChangePercent: changesPercentage,
    regularMarketDayLow: dayLow,
    regularMarketDayHigh: dayHigh,
    fiftyTwoWeekLow: yearLow,
    fiftyTwoWeekHigh: yearHigh,
    marketCap,
    regularMarketVolume: volume,
    averageDailyVolume3Month: avgVolume,
    regularMarketOpen: open,
    regularMarketPreviousClose: previousClose,
    trailingEps: normalizedEps,
    trailingPE: normalizedPe,
    fullExchangeName: exchange,
    currency,
    regularMarketTime: timestamp,
    postMarketPrice,
    postMarketChange,
    postMarketChangePercent,
    preMarketPrice,
    preMarketChange,
    preMarketChangePercent,
    hasPrePostMarketData:
      postMarketPrice != null || preMarketPrice != null,
  }

  return mappedQuote
}

export async function fetchFmpQuote(ticker: string): Promise<Quote> {
  const encodedTicker = encodeURIComponent(ticker)
  const response = await fmpFetch<FmpQuoteResponse>(`quote/${encodedTicker}`)

  if (!Array.isArray(response) || response.length === 0) {
    throw new Error(`No quote data returned for ticker ${ticker}`)
  }

  return mapFmpQuoteToQuote(response[0])
}
