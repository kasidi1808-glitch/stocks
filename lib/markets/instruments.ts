import type { MarketInstrument } from "./types"

export const PRE_MARKET_INSTRUMENTS: MarketInstrument[] = [
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "Nasdaq Composite" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "^RUT", shortName: "Russell 2000" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "NG=F", shortName: "Natural Gas" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10-Yr Treasury" },
]

export const REGULAR_MARKET_INSTRUMENTS: MarketInstrument[] = [
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "Nasdaq Composite" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "^RUT", shortName: "Russell 2000" },
  { symbol: "^FTSE", shortName: "FTSE 100" },
  { symbol: "^GDAXI", shortName: "DAX" },
  { symbol: "^N225", shortName: "Nikkei 225" },
  { symbol: "^HSI", shortName: "Hang Seng" },
  { symbol: "^SSEC", shortName: "Shanghai Composite" },
  { symbol: "^STOXX50E", shortName: "Euro Stoxx 50" },
  { symbol: "^BVSP", shortName: "Bovespa" },
  { symbol: "^BSESN", shortName: "BSE Sensex" },
  { symbol: "^AXJO", shortName: "S&P/ASX 200" },
  { symbol: "^KS11", shortName: "KOSPI" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "SI=F", shortName: "Silver" },
  { symbol: "NG=F", shortName: "Natural Gas" },
  { symbol: "EURUSD=X", shortName: "EUR/USD" },
  { symbol: "^TNX", shortName: "10-Yr Treasury" },
]
