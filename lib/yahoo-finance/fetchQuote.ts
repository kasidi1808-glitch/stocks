import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"

import type { Quote } from "@/types/yahoo-finance"

function createEmptyQuote(ticker: string): Quote {
  return {
    symbol: ticker,
    shortName: ticker,
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketDayLow: null,
    regularMarketDayHigh: null,
    fiftyTwoWeekLow: null,
    fiftyTwoWeekHigh: null,
    marketCap: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    regularMarketOpen: null,
    regularMarketPreviousClose: null,
    trailingEps: null,
    trailingPE: null,
    fullExchangeName: null,
    currency: null,
    regularMarketTime: null,
    postMarketPrice: null,
    postMarketChange: null,
    postMarketChangePercent: null,
    preMarketPrice: null,
    preMarketChange: null,
    preMarketChangePercent: null,
    hasPrePostMarketData: false,
  }
}

function normalizeYahooQuote(response: any): Quote {
  const regularMarketTime = response?.regularMarketTime

  return {
    symbol: response?.symbol ?? "",
    shortName: response?.shortName ?? response?.symbol ?? "",
    regularMarketPrice: response?.regularMarketPrice ?? null,
    regularMarketChange: response?.regularMarketChange ?? null,
    regularMarketChangePercent: response?.regularMarketChangePercent ?? null,
    regularMarketDayLow: response?.regularMarketDayLow ?? null,
    regularMarketDayHigh: response?.regularMarketDayHigh ?? null,
    fiftyTwoWeekLow: response?.fiftyTwoWeekLow ?? null,
    fiftyTwoWeekHigh: response?.fiftyTwoWeekHigh ?? null,
    marketCap: response?.marketCap ?? null,
    regularMarketVolume: response?.regularMarketVolume ?? null,
    averageDailyVolume3Month: response?.averageDailyVolume3Month ?? null,
    regularMarketOpen: response?.regularMarketOpen ?? null,
    regularMarketPreviousClose: response?.regularMarketPreviousClose ?? null,
    trailingEps: response?.trailingEps ?? null,
    trailingPE: response?.trailingPE ?? null,
    fullExchangeName: response?.fullExchangeName ?? null,
    currency: response?.currency ?? null,
    regularMarketTime:
      regularMarketTime instanceof Date
        ? regularMarketTime.getTime()
        : regularMarketTime ?? null,
    postMarketPrice: response?.postMarketPrice ?? null,
    postMarketChange: response?.postMarketChange ?? null,
    postMarketChangePercent: response?.postMarketChangePercent ?? null,
    preMarketPrice: response?.preMarketPrice ?? null,
    preMarketChange: response?.preMarketChange ?? null,
    preMarketChangePercent: response?.preMarketChangePercent ?? null,
    hasPrePostMarketData:
      response?.postMarketPrice != null || response?.preMarketPrice != null,
  }
}

export async function fetchQuote(ticker: string): Promise<Quote> {
  noStore()

  try {
    const response = await yahooFinance.quote(ticker)

    return normalizeYahooQuote(response)
  } catch (error) {
    console.warn("Failed to fetch stock quote", error)

    const fallbackQuote = await (async () => {
      try {
        const { fetchFmpQuote } = await import("@/lib/fmp/quotes")

        return await fetchFmpQuote(ticker)
      } catch (fallbackError) {
        console.warn("Fallback quote fetch failed", fallbackError)
        return null
      }
    })()

    if (fallbackQuote) {
      return fallbackQuote
    }

    return createEmptyQuote(ticker)
  }
}
