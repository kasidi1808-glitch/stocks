import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import yahooFinance from "yahoo-finance2"

export function normalizeTicker(ticker: string): string {
  if (typeof ticker !== "string") {
    return ""
  }

  return ticker.trim().toUpperCase()
}

function createEmptyQuote(ticker: string): Quote {
  const normalizedTicker = normalizeTicker(ticker) || ticker

  return {
    symbol: normalizedTicker,
    shortName: normalizedTicker,
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
  const symbol = normalizeTicker(response?.symbol ?? "")

  return {
    symbol,
    shortName: response?.shortName ?? response?.symbol ?? symbol,
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

async function fetchYahooQuotes(
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

    const fallbackMap = new Map<string, Quote>()

    for (const symbol of symbols) {
      try {
        const single = await yahooFinance.quote(symbol)
        const quote = normalizeYahooQuote(single)

        if (quote.symbol) {
          fallbackMap.set(quote.symbol, quote)
        }
      } catch (singleError) {
        console.warn(
          `yahoo-finance2 quote lookup failed for ${symbol}`,
          singleError
        )
      }
    }

    return fallbackMap
  }
}

export const fetchQuote = async (tickerSymbol: string): Promise<Quote> => {
  noStore()

  const normalizedTicker = normalizeTicker(tickerSymbol)
  const lookupSymbols = Array.from(
    new Set(
      [normalizedTicker, tickerSymbol]
        .map((value) => normalizeTicker(value))
        .filter((value) => value)
    )
  )

  const yahooQuotes = await fetchYahooQuotes(lookupSymbols)
  const yahooQuote = lookupSymbols
    .map((symbol) => yahooQuotes.get(symbol))
    .find((quote): quote is Quote => Boolean(quote))

  if (yahooQuote) {
    return yahooQuote
  }

  return createEmptyQuote(normalizedTicker || tickerSymbol)
}

export const loadQuotesForSymbols = async (
  tickers: string[]
): Promise<Map<string, Quote>> => {
  const uniqueNormalizedTickers = Array.from(
    new Set(
      tickers
        .map((ticker) => normalizeTicker(ticker))
        .filter((ticker) => ticker)
    )
  )

  const quotes = await fetchYahooQuotes(uniqueNormalizedTickers)

  const resolvedQuotes = new Map<string, Quote>()

  const registerQuote = (key: string, quote: Quote) => {
    if (!key || resolvedQuotes.has(key)) {
      return
    }

    resolvedQuotes.set(key, quote)
  }

  quotes.forEach((quote, key) => {
    registerQuote(key, quote)
    registerQuote(normalizeTicker(key), quote)
  })

  for (const ticker of tickers) {
    const normalized = normalizeTicker(ticker)
    const quote = quotes.get(normalized)

    if (quote) {
      registerQuote(ticker, quote)
      registerQuote(normalized, quote)
    }
  }

  return resolvedQuotes
}
