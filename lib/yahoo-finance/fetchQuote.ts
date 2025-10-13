import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import { fetchFmpQuote } from "@/lib/fmp/quotes"
import { isFmpApiAvailable } from "@/lib/fmp/client"
import { getOfflineQuote, getOfflineQuotes } from "@/data/offlineQuotes"

import { yahooFinanceFetch } from "./client"
import yahooFinance from "yahoo-finance2"

function createEmptyQuote(ticker: string): Quote {
  const symbol = typeof ticker === "string" ? ticker.trim() : ticker

  return applyCompanyNameFallbacks({
    symbol: symbol || ticker,
    shortName: symbol || ticker,
    longName: null,
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

async function fetchWithYahooFinanceLibrary(
  symbols: string[]
): Promise<Map<string, Quote>> {
  if (symbols.length === 0) {
    return new Map()
  }

  try {
    const response = await yahooFinance.quote(symbols, { return: "array" })

    const quotesArray = Array.isArray(response) ? response : [response]

    return new Map(
      quotesArray
        .map((item) => normalizeYahooQuote(item))
        .filter((quote) => quote.symbol)
        .map((quote) => [quote.symbol, quote] as const)
    )
  } catch (error) {
    console.warn("yahoo-finance2 batch quote lookup failed", error)

    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const single = await yahooFinance.quote(symbol)

          return normalizeYahooQuote(single)
        } catch (singleError) {
          console.warn(
            `yahoo-finance2 quote lookup failed for ${symbol}`,
            singleError
          )
          return null
        }
      })
    )

    return new Map(
      quotes
        .filter((quote): quote is Quote => quote !== null && Boolean(quote.symbol))
        .map((quote) => [quote.symbol, quote] as const)
    )
  }
}

async function fetchYahooQuotes(symbols: string[]): Promise<Map<string, Quote>> {
  if (symbols.length === 0) {
    return new Map()
  }

  try {
    const data = await yahooFinanceFetch<QuoteApiResponse>("v7/finance/quote", {
      symbols: symbols.join(","),
      region: "US",
      lang: "en-US",
    })

    const results = Array.isArray(data.quoteResponse?.result)
      ? data.quoteResponse?.result
      : []

    const quoteMap = new Map(
      results
        .map((item) => normalizeYahooQuote(item))
        .filter((quote) => quote.symbol)
        .map((quote) => [quote.symbol, quote] as const)
    )

    if (quoteMap.size > 0) {
      return quoteMap
    }
  } catch (error) {
    console.warn("Failed to fetch Yahoo quotes", error)
  }

  const libraryQuotes = await fetchWithYahooFinanceLibrary(symbols)

  if (libraryQuotes.size > 0) {
    return libraryQuotes
  }

  return new Map()
}

export const fetchQuote = async (tickerSymbol: string): Promise<Quote> => {
  noStore()

  const yahooQuotes = await fetchYahooQuotes([tickerSymbol])
  const yahooQuote = yahooQuotes.get(tickerSymbol)
  if (yahooQuote) {
    return yahooQuote
  }

  if (isFmpApiAvailable()) {
    try {
      const fmpQuote = await fetchFmpQuote(tickerSymbol)
      if (fmpQuote) {
        return fmpQuote
      }
    } catch (error) {
      console.warn(`FMP quote lookup failed for ${tickerSymbol}`, error)
    }
  }

  const offlineQuote = getOfflineQuote(tickerSymbol)
  if (offlineQuote) {
    return offlineQuote
  }

  return createEmptyQuote(tickerSymbol)
}

export const loadQuotesForSymbols = async (
  tickers: string[]
): Promise<Map<string, Quote>> => {
  const uniqueTickers = Array.from(new Set(tickers))
  const quotes = await fetchYahooQuotes(uniqueTickers)

  const unresolvedTickers = uniqueTickers.filter((ticker) => !quotes.has(ticker))

  for (const ticker of unresolvedTickers) {
    try {
      const fallbackQuote = await fetchQuote(ticker)

      if (fallbackQuote) {
        quotes.set(ticker, fallbackQuote)
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
