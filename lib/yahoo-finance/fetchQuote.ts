import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import {
  getOfflineQuote,
  getOfflineQuotes,
} from "@/data/offlineQuotes"

import { fetchFmpQuote } from "@/lib/fmp/quotes"

import { yahooFinanceFetch } from "./client"

export function normalizeTicker(ticker: string | null | undefined): string {
  if (typeof ticker !== "string") {
    return ""
  }

  const trimmed = ticker.trim()

  if (!trimmed) {
    return ""
  }

  return trimmed.toUpperCase()
}

function createEmptyQuote(ticker: string): Quote {
  const symbol = normalizeTicker(ticker) || ticker

  return {
    symbol,
    shortName: symbol || ticker,
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
  })
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  return null
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  return null
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  return null
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  return null
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  return null
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  return null
}

export function normalizeYahooQuote(response: any): Quote {
  const regularMarketTime = response?.regularMarketTime

  const regularMarketPrice = asFiniteNumber(response?.regularMarketPrice)
  const trailingEps = asFiniteNumber(response?.trailingEps)

  let trailingPE = asFiniteNumber(response?.trailingPE)

  if (
    (!trailingPE || trailingPE <= 0) &&
    regularMarketPrice &&
    trailingEps &&
    trailingEps !== 0
  ) {
    const computedPe = regularMarketPrice / trailingEps

    if (Number.isFinite(computedPe) && computedPe > 0) {
      trailingPE = computedPe
    }
  }

  return {
    symbol: response?.symbol ?? "",
    shortName: response?.shortName ?? response?.symbol ?? "",
    regularMarketPrice,
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
    trailingEps,
    trailingPE,
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
  const normalizedSymbols = symbols
    .map((symbol) => normalizeTicker(symbol))
    .filter((symbol): symbol is string => symbol.length > 0)

  if (normalizedSymbols.length === 0) {
    return new Map()
  }

  try {
    const data = await yahooFinanceFetch<QuoteApiResponse>("v7/finance/quote", {
      symbols: normalizedSymbols.join(","),
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
    return getOfflineQuotes(normalizedSymbols)
  }
}

export async function fetchQuote(tickerSymbol: string): Promise<Quote> {
  noStore()

  const normalizedTicker = normalizeTicker(tickerSymbol)

  if (!normalizedTicker) {
    return createEmptyQuote(tickerSymbol)
  }

  const yahooQuotes = await fetchYahooQuotes([normalizedTicker])
  const yahooQuote = yahooQuotes.get(normalizedTicker)
  if (yahooQuote) {
    return yahooQuote
  }

  if (isFmpApiAvailable()) {
    try {
      const fmpQuote = await fetchFmpQuote(normalizedTicker)
      if (fmpQuote) {
        return fmpQuote
      }
    } catch (error) {
      console.warn(`FMP quote lookup failed for ${normalizedTicker}`, error)
    }
  } catch (error) {
    console.warn(`FMP quote lookup failed for ${normalizedTicker}`, error)
  }

  const offlineQuote = getOfflineQuote(normalizedTicker)
  if (offlineQuote) {
    return offlineQuote
  }

  return createEmptyQuote(normalizedTicker)
}

export async function loadQuotesForSymbols(
  tickers: string[]
): Promise<Map<string, Quote>> {
  const normalizedTickers = tickers
    .map((ticker) => normalizeTicker(ticker))
    .filter((ticker): ticker is string => ticker.length > 0)

  const uniqueTickers = Array.from(new Set(normalizedTickers))
  const quotes = await fetchYahooQuotes(uniqueTickers)

  const missingTickers = uniqueTickers.filter(
    (ticker) => !quotes.has(ticker)
  )

  for (const ticker of missingTickers) {
    try {
      const fallbackQuote = await fetchQuote(ticker)

      if (fallbackQuote) {
        const normalizedSymbol = normalizeTicker(fallbackQuote.symbol) || ticker
        quotes.set(normalizedSymbol, fallbackQuote)
      }
    } catch (error) {
      console.warn(`Failed to hydrate quote for ${ticker}`, error)
    }
  }

  const stillMissing = uniqueTickers.filter((ticker) => !quotes.has(ticker))

  if (stillMissing.length > 0) {
    const offlineQuotes = getOfflineQuotes(stillMissing)

    offlineQuotes.forEach((quote, symbol) => {
      quotes.set(symbol, quote)
    })
  }

  return quotes
}
