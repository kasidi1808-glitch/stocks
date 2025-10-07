import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import { fetchFmpQuote } from "@/lib/fmp/quotes"

import { fetchFmpQuote } from "@/lib/fmp/quotes"
import type { Quote } from "@/types/yahoo-finance"

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
    console.log("Failed to fetch stock quote", error)

    try {
      return await fetchFmpQuote(ticker)
    } catch (fallbackError) {
      console.log("Fallback quote fetch failed", fallbackError)
      throw new Error("Failed to fetch stock quote.")
    }
  }
}
