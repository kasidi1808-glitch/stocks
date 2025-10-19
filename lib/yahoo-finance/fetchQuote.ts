import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import {
  getOfflineQuote,
  getOfflineQuotes,
} from "@/data/offlineQuotes"

import { fetchFmpQuote } from "@/lib/fmp/quotes"
import { isFmpApiAvailable } from "@/lib/fmp/client"
import { applyDisplayMetrics } from "@/lib/markets/displayMetrics"

import yahooFinance from "yahoo-finance2"

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

  const emptyQuote: Quote = {
    symbol,
    shortName: symbol || ticker,
    marketState: null,
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
    postMarketTime: null,
    preMarketPrice: null,
    preMarketChange: null,
    preMarketChangePercent: null,
    preMarketTime: null,
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

  return applyDisplayMetrics(emptyQuote)
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
    marketState: typeof response?.marketState === "string" ? response.marketState : null,
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
    postMarketTime:
      typeof response?.postMarketTime === "number" && Number.isFinite(response.postMarketTime)
        ? response.postMarketTime
        : null,
    preMarketPrice: response?.preMarketPrice ?? null,
    preMarketChange: response?.preMarketChange ?? null,
    preMarketChangePercent: response?.preMarketChangePercent ?? null,
    preMarketTime:
      typeof response?.preMarketTime === "number" && Number.isFinite(response.preMarketTime)
        ? response.preMarketTime
        : null,
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

  const populateMissingQuotes = async (
    existing: Map<string, Quote>,
    remainingSymbols: string[]
  ) => {
    if (remainingSymbols.length === 0) {
      return existing
    }

    const additionalEntries = await Promise.all(
      remainingSymbols.map(async (symbol) => {
        try {
          const result = await yahooFinance.quote(symbol, {}, { validateResult: false })

          if (!result) {
            return null
          }

          const normalized = applyDisplayMetrics(normalizeYahooQuote(result))

          if (!normalized.symbol) {
            return null
          }

          return [normalized.symbol, normalized] as const
        } catch (error) {
          console.warn(`Failed to fetch Yahoo quote for ${symbol}`, error)
          return null
        }
      })
    )

    for (const entry of additionalEntries) {
      if (!entry) {
        continue
      }

      const [symbol, quote] = entry
      existing.set(symbol, quote)
    }

    return existing
  }

  try {
    const data = await yahooFinanceFetch<QuoteApiResponse>("v7/finance/quote", {
      symbols: normalizedSymbols.join(","),
      region: "US",
      lang: "en-US",
      includePrePost: true,
    })

    const results = Array.isArray(data.quoteResponse?.result)
      ? data.quoteResponse?.result
      : []

    const quotes = new Map(
      results
        .map((item) => applyDisplayMetrics(normalizeYahooQuote(item)))
        .filter((quote) => quote.symbol)
        .map((quote) => [quote.symbol, quote] as const)
    )

    const missingSymbols = normalizedSymbols.filter((symbol) => !quotes.has(symbol))

    return await populateMissingQuotes(quotes, missingSymbols)
  } catch (error) {
    console.warn("Failed to fetch Yahoo quotes", error)
    const quotes = await populateMissingQuotes(new Map(), normalizedSymbols)

    if (quotes.size > 0) {
      return quotes
    }

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

  try {
    const directYahooQuote = await yahooFinance.quote(
      normalizedTicker,
      undefined,
      { validateResult: false }
    )

    if (directYahooQuote) {
      const normalizedQuote = applyDisplayMetrics(
        normalizeYahooQuote(directYahooQuote)
      )

      if (normalizedQuote.symbol) {
        return normalizedQuote
      }
    }
  } catch (error) {
    console.warn(`Direct Yahoo quote lookup failed for ${normalizedTicker}`, error)
  }

  if (isFmpApiAvailable()) {
    try {
      const fmpQuote = await fetchFmpQuote(normalizedTicker)
      if (fmpQuote) {
        return applyDisplayMetrics(fmpQuote)
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

  const offlineQuote = getOfflineQuote(normalizedTicker)
  if (offlineQuote) {
    return offlineQuote
  }

  const offlineQuote = getOfflineQuote(normalizedTicker)
  if (offlineQuote) {
    return offlineQuote
  }

  const offlineQuote = getOfflineQuote(normalizedTicker)
  if (offlineQuote) {
    return applyDisplayMetrics(offlineQuote)
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

  const missingTickers = uniqueTickers.filter((ticker) => !quotes.has(ticker))

  if (missingTickers.length === 0) {
    return quotes
  }

  const fallbackEntries = await Promise.all(
    missingTickers.map(async (ticker) => {
      try {
        const fallbackQuote = await fetchQuote(ticker)
        const normalizedSymbol = normalizeTicker(fallbackQuote.symbol) || ticker

        return [normalizedSymbol, fallbackQuote] as const
      } catch (error) {
        console.warn(`Failed to hydrate quote for ${ticker}`, error)
        const offlineQuote = getOfflineQuote(ticker)

        if (offlineQuote) {
          return [
            normalizeTicker(offlineQuote.symbol) || ticker,
            applyDisplayMetrics(offlineQuote),
          ] as const
        }

        return null
      }
    })
  )

  for (const entry of fallbackEntries) {
    if (!entry) {
      continue
    }

    const [symbol, quote] = entry
    quotes.set(symbol, quote)
  }

  return quotes
}
