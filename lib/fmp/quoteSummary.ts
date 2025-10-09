import { fmpFetch } from "./client"
import { fetchFmpQuote } from "./quotes"
import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

interface FmpProfile {
  symbol: string
  beta?: number
  lastDiv?: number
  website?: string
  description?: string
  sector?: string
  industry?: string
  country?: string
  fullTimeEmployees?: number
}

type FmpProfileResponse = FmpProfile[]

function buildSummaryDetail(quote: Quote, profile?: FmpProfile) {
  const price = quote.regularMarketPrice
  const lastDividend = profile?.lastDiv

  return {
    open: quote.regularMarketOpen,
    dayHigh: quote.regularMarketDayHigh,
    dayLow: quote.regularMarketDayLow,
    volume: quote.regularMarketVolume,
    trailingPE: quote.trailingPE,
    marketCap: quote.marketCap,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
    averageVolume: quote.averageDailyVolume3Month,
    dividendYield: price && lastDividend ? lastDividend / price : undefined,
    beta: profile?.beta,
  }
}

function buildDefaultKeyStatistics(quote: Quote) {
  return {
    trailingEps: quote.trailingEps,
  }
}

function buildSummaryProfile(profile?: FmpProfile) {
  if (!profile) {
    return undefined
  }

  return {
    longBusinessSummary: profile.description,
    sector: profile.sector,
    industryDisp: profile.industry,
    country: profile.country,
    fullTimeEmployees: profile.fullTimeEmployees,
    website: profile.website,
  }
}

export async function fetchFmpQuoteSummary(ticker: string): Promise<QuoteSummary> {
  const encodedTicker = encodeURIComponent(ticker)

  const [quote, profileResponse] = await Promise.all([
    fetchFmpQuote(ticker),
    fmpFetch<FmpProfileResponse>(`profile/${encodedTicker}`).catch(() => []),
  ])

  const profile = Array.isArray(profileResponse) ? profileResponse[0] : undefined

  return {
    summaryDetail: buildSummaryDetail(quote, profile),
    defaultKeyStatistics: buildDefaultKeyStatistics(quote),
    summaryProfile: buildSummaryProfile(profile),
  }
}
