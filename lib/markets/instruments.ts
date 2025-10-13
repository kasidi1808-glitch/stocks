import type { MarketInstrument } from "./types"

export const PRE_MARKET_INSTRUMENTS: MarketInstrument[] = [
  { symbol: "ES=F", shortName: "S&P 500", newsSymbol: "^GSPC" },
  { symbol: "NQ=F", shortName: "NASDAQ", newsSymbol: "^IXIC" },
  { symbol: "YM=F", shortName: "Dow Jones", newsSymbol: "^DJI" },
  { symbol: "RTY=F", shortName: "Russell 2000", newsSymbol: "^RUT" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10 Year Bond" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]

export const REGULAR_MARKET_INSTRUMENTS: MarketInstrument[] = [
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "NASDAQ" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "^RUT", shortName: "Russell 2000" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10 Year Bond" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]
