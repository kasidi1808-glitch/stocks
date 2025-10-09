import type { MarketInstrument } from "./types"

const FUTURES_SOURCES = [
  { type: "collection" as const, path: "quotes/futures" },
  { type: "quote" as const },
]

const COMMODITY_SOURCES = [
  { type: "collection" as const, path: "quotes/commodity" },
  { type: "quote" as const },
]

const FOREX_SOURCES = [
  { type: "collection" as const, path: "quotes/forex" },
  { type: "quote" as const },
]

const TREASURY_SOURCES = [
  { type: "collection" as const, path: "quotes/treasury" },
  { type: "quote" as const },
]

const CRYPTO_SOURCES = [
  { type: "collection" as const, path: "quotes/crypto" },
  { type: "quote" as const },
]

const INDEX_SOURCES = [
  { type: "collection" as const, path: "quotes/index" },
  { type: "quote" as const },
]

function buildSources(
  base:
    | typeof FUTURES_SOURCES
    | typeof COMMODITY_SOURCES
    | typeof FOREX_SOURCES
    | typeof TREASURY_SOURCES
    | typeof CRYPTO_SOURCES
    | typeof INDEX_SOURCES,
  symbol: string
) {
  return base.map((source) =>
    source.type === "collection"
      ? { ...source, symbol }
      : { type: source.type, symbol }
  )
}

export const PRE_MARKET_INSTRUMENTS: MarketInstrument[] = [
  {
    symbol: "ES=F",
    shortName: "S&P 500 Futures",
    sources: buildSources(FUTURES_SOURCES, "ES=F"),
  },
  {
    symbol: "NQ=F",
    shortName: "NASDAQ Futures",
    sources: buildSources(FUTURES_SOURCES, "NQ=F"),
  },
  {
    symbol: "YM=F",
    shortName: "Dow Jones Futures",
    sources: buildSources(FUTURES_SOURCES, "YM=F"),
  },
  {
    symbol: "RTY=F",
    shortName: "Russell 2000 Futures",
    sources: buildSources(FUTURES_SOURCES, "RTY=F"),
  },
  {
    symbol: "CL=F",
    shortName: "Crude Oil",
    sources: buildSources(COMMODITY_SOURCES, "CL=F"),
  },
  {
    symbol: "GC=F",
    shortName: "Gold",
    sources: buildSources(COMMODITY_SOURCES, "GC=F"),
  },
  {
    symbol: "SI=F",
    shortName: "Silver",
    sources: buildSources(COMMODITY_SOURCES, "SI=F"),
  },
  {
    symbol: "EURUSD=X",
    shortName: "EUR/USD",
    sources: buildSources(FOREX_SOURCES, "EURUSD"),
  },
  {
    symbol: "^TNX",
    shortName: "10 Year Bond",
    sources: buildSources(TREASURY_SOURCES, "^TNX"),
  },
  {
    symbol: "BTC-USD",
    shortName: "Bitcoin",
    sources: buildSources(CRYPTO_SOURCES, "BTCUSD"),
  },
]

export const REGULAR_MARKET_INSTRUMENTS: MarketInstrument[] = [
  {
    symbol: "^GSPC",
    shortName: "S&P 500",
    sources: buildSources(INDEX_SOURCES, "^GSPC"),
  },
  {
    symbol: "^IXIC",
    shortName: "NASDAQ",
    sources: buildSources(INDEX_SOURCES, "^IXIC"),
  },
  {
    symbol: "^DJI",
    shortName: "Dow Jones",
    sources: buildSources(INDEX_SOURCES, "^DJI"),
  },
  {
    symbol: "^RUT",
    shortName: "Russell 2000",
    sources: buildSources(INDEX_SOURCES, "^RUT"),
  },
  {
    symbol: "CL=F",
    shortName: "Crude Oil",
    sources: buildSources(COMMODITY_SOURCES, "CL=F"),
  },
  {
    symbol: "GC=F",
    shortName: "Gold",
    sources: buildSources(COMMODITY_SOURCES, "GC=F"),
  },
  {
    symbol: "SI=F",
    shortName: "Silver",
    sources: buildSources(COMMODITY_SOURCES, "SI=F"),
  },
  {
    symbol: "EURUSD=X",
    shortName: "EUR/USD",
    sources: buildSources(FOREX_SOURCES, "EURUSD"),
  },
  {
    symbol: "^TNX",
    shortName: "10 Year Bond",
    sources: buildSources(TREASURY_SOURCES, "^TNX"),
  },
  {
    symbol: "BTC-USD",
    shortName: "Bitcoin",
    sources: buildSources(CRYPTO_SOURCES, "BTCUSD"),
  },
]
