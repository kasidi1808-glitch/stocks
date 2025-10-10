export type PredefinedScreenerModules =
  | "aggressive_small_caps"
  | "conservative_foreign_funds"
  | "day_gainers"
  | "day_losers"
  | "growth_technology_stocks"
  | "high_yield_bond"
  | "most_actives"
  | "most_shorted_stocks"
  | "portfolio_anchors"
  | "small_cap_gainers"
  | "solid_large_growth_funds"
  | "solid_midcap_growth_funds"
  | "top_mutual_funds"
  | "undervalued_growth_stocks"
  | "undervalued_large_caps";

export type ScreenerQuote = {
  symbol: string
  shortName?: string | null
  regularMarketPrice?: number | null
  regularMarketChange?: number | null
  regularMarketChangePercent?: number | null
  regularMarketVolume?: number | null
  averageDailyVolume3Month?: number | null
  marketCap?: number | null
  epsTrailingTwelveMonths?: number | null
  trailingPE?: number | null
}

export type ScreenerResult = {
  id: string
  title: string
  description: string
  canonicalName: string
  quotes: ScreenerQuote[]
  start: number
  count: number
  total: number
}

export type Range = "1d" | "1w" | "1m" | "3m" | "1y";

export type Interval =
  | "1m"
  | "2m"
  | "5m"
  | "15m"
  | "30m"
  | "60m"
  | "90m"
  | "1h"
  | "1d"
  | "5d"
  | "1wk"
  | "1mo"
  | "3mo";

export type Quote = {
  symbol: string
  shortName?: string | null
  regularMarketPrice?: number | null
  regularMarketChange?: number | null
  regularMarketChangePercent?: number | null
  regularMarketDayLow?: number | null
  regularMarketDayHigh?: number | null
  fiftyTwoWeekLow?: number | null
  fiftyTwoWeekHigh?: number | null
  marketCap?: number | null
  regularMarketVolume?: number | null
  averageDailyVolume3Month?: number | null
  regularMarketOpen?: number | null
  regularMarketPreviousClose?: number | null
  trailingEps?: number | null
  trailingPE?: number | null
  fullExchangeName?: string | null
  currency?: string | null
  regularMarketTime?: number | null
  postMarketPrice?: number | null
  postMarketChange?: number | null
  postMarketChangePercent?: number | null
  preMarketPrice?: number | null
  preMarketChange?: number | null
  preMarketChangePercent?: number | null
  hasPrePostMarketData?: boolean
}

type QuoteSummarySection = Record<string, number | string | null | undefined>

type QuoteSummaryProfileSection = QuoteSummarySection & {
  longBusinessSummary?: string | null
  sector?: string | null
  industryDisp?: string | null
  country?: string | null
  fullTimeEmployees?: number | null
  website?: string | null
}

export type QuoteSummary = {
  summaryDetail?: QuoteSummarySection & {
    open?: number | null
    dayHigh?: number | null
    dayLow?: number | null
    volume?: number | null
    trailingPE?: number | null
    marketCap?: number | null
    fiftyTwoWeekHigh?: number | null
    fiftyTwoWeekLow?: number | null
    averageVolume?: number | null
    dividendYield?: number | null
    beta?: number | null
  }
  defaultKeyStatistics?: QuoteSummarySection & {
    trailingEps?: number | null
  }
  summaryProfile?: QuoteSummaryProfileSection
  [section: string]: QuoteSummarySection | QuoteSummaryProfileSection | undefined
}
