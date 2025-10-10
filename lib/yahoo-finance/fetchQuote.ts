import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import {
  getOfflineQuote,
  getOfflineQuotes,
} from "@/data/offlineQuotes"

import { fetchFmpQuote } from "@/lib/fmp/quotes"

import { yahooFinanceFetch } from "./client"

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

export function normalizeYahooQuote(response: any): Quote {
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

type QuoteApiResponse = {
  quoteResponse?: {
    result?: any[]
  }
}

async function fetchYahooQuotes(symbols: string[]): Promise<Map<string, Quote>> {
  if (symbols.length === 0) {
    return new Map()
  }

  const yahooQuotes = await fetchYahooQuotes([ticker])
  const yahooQuote = yahooQuotes.get(ticker)
  if (yahooQuote) {
    return yahooQuote
  }

  const fmpQuote = await loadQuoteFromFmp(ticker)
  if (fmpQuote) {
    return fmpQuote
  }

  const offlineQuote = getOfflineQuote(ticker)
  if (offlineQuote) {
    return offlineQuote
  }

  return createEmptyQuote(ticker)
}

export async function fetchQuotesBatch(
  tickers: string[]
): Promise<Map<string, Quote>> {
  const uniqueTickers = Array.from(new Set(tickers))
  const quotes = await fetchYahooQuotes(uniqueTickers)

  const missingTickers = uniqueTickers.filter(
    (ticker) => !quotes.has(ticker)
  )

  for (const ticker of missingTickers) {
    try {
      const fallbackQuote = await fetchQuote(ticker)

      if (fallbackQuote) {
        quotes.set(ticker, fallbackQuote)
      }
    } catch (error) {
      console.warn(`Failed to hydrate quote for ${ticker}`, error)
    }
  }

  return quotes
}

async function loadQuoteFromFmp(ticker: string): Promise<Quote | null> {
  try {
    const data = await yahooFinanceFetch<QuoteApiResponse>("v7/finance/quote", {
      symbols: symbols.join(","),
      region: "US",
      lang: "en-US",
    })

    const results = Array.isArray(data.quoteResponse?.result)
      ? data.quoteResponse?.result
      : []

    return new Map(
      results
        .map((item) => normalizeYahooQuote(item))
        .filter((quote) => quote.symbol)
        .map((quote) => [quote.symbol, quote] as const)
    )
  } catch (error) {
    console.warn("Failed to fetch Yahoo quotes", error)
    return getOfflineQuotes(symbols)
  }
}

export async function fetchQuote(ticker: string): Promise<Quote> {
  noStore()

  const yahooQuotes = await fetchYahooQuotes([ticker])
  const yahooQuote = yahooQuotes.get(ticker)
  if (yahooQuote) {
    return yahooQuote
  }

  try {
    const fmpQuote = await fetchFmpQuote(ticker)
    if (fmpQuote) {
      return fmpQuote
    }
  } catch (error) {
    console.warn(`FMP quote lookup failed for ${ticker}`, error)
  }

  const offlineQuote = getOfflineQuote(ticker)
  if (offlineQuote) {
    return offlineQuote
  }

  return createEmptyQuote(ticker)
}

export async function fetchQuotesBatch(
  tickers: string[]
): Promise<Map<string, Quote>> {
  const uniqueTickers = Array.from(new Set(tickers))
  const quotes = await fetchYahooQuotes(uniqueTickers)

  const missingTickers = uniqueTickers.filter(
    (ticker) => !quotes.has(ticker)
  )

  for (const ticker of missingTickers) {
    try {
      const fallbackQuote = await fetchQuote(ticker)

      if (fallbackQuote) {
        quotes.set(ticker, fallbackQuote)
      }
    } catch (error) {
      console.warn(`Failed to hydrate quote for ${ticker}`, error)
    }
  }

  return quotes
}
