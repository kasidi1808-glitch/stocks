import { unstable_noStore as noStore } from "next/cache"

import type {
  PredefinedScreenerModules,
  Quote,
  ScreenerQuote,
  ScreenerResult,
} from "@/types/yahoo-finance"

import { OFFLINE_SYMBOLS } from "@/data/offlineQuotes"
import { hydratePeFromOfflineData } from "@/lib/markets/quoteEnrichment"
import { yahooFinanceFetch } from "./client"
import { loadQuotesForSymbols } from "./fetchQuote"

const ITEMS_PER_PAGE = 40
const MAX_PAGES = 25

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

function calculatePe(price: number | null, eps: number | null): number | null {
  if (price === null || eps === null || eps <= 0) {
    return null
  }

  const ratio = price / eps

  if (!Number.isFinite(ratio) || ratio <= 0) {
    return null
  }

  return ratio
}

function normalizeScreenerQuote(rawQuote: any): ScreenerQuote {
  const regularMarketPrice = toNumber(rawQuote?.regularMarketPrice)
  const epsTrailingTwelveMonths = toNumber(
    rawQuote?.epsTrailingTwelveMonths
  )
  const trailingPE =
    toNumber(rawQuote?.trailingPE) ??
    calculatePe(regularMarketPrice, epsTrailingTwelveMonths)

  return {
    symbol: typeof rawQuote?.symbol === "string" ? rawQuote.symbol : "",
    shortName:
      rawQuote?.shortName ?? rawQuote?.longName ?? rawQuote?.symbol ?? "",
    regularMarketPrice,
    regularMarketChange: toNumber(rawQuote?.regularMarketChange),
    regularMarketChangePercent: toNumber(
      rawQuote?.regularMarketChangePercent
    ),
    regularMarketVolume: toNumber(rawQuote?.regularMarketVolume),
    averageDailyVolume3Month: toNumber(rawQuote?.averageDailyVolume3Month),
    marketCap: toNumber(rawQuote?.marketCap),
    epsTrailingTwelveMonths,
    trailingPE,
  }
}

const FALLBACK_SYMBOLS = OFFLINE_SYMBOLS

function createEmptyScreenerQuote(symbol: string): ScreenerQuote {
  return {
    symbol,
    shortName: symbol,
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
    trailingPE: null,
  }
}

function quoteToScreenerQuote(symbol: string, quote: Quote | null): ScreenerQuote {
  if (!quote) {
    return createEmptyScreenerQuote(symbol)
  }

  const regularMarketPrice = toNumber(quote.regularMarketPrice)
  const epsTrailingTwelveMonths = toNumber(quote.trailingEps)
  const trailingPE =
    toNumber(quote.trailingPE) ??
    calculatePe(regularMarketPrice, epsTrailingTwelveMonths)

  return {
    symbol: quote.symbol ?? symbol,
    shortName: quote.shortName ?? quote.symbol ?? symbol,
    regularMarketPrice,
    regularMarketChange: toNumber(quote.regularMarketChange),
    regularMarketChangePercent: toNumber(quote.regularMarketChangePercent),
    regularMarketVolume: toNumber(quote.regularMarketVolume),
    averageDailyVolume3Month: toNumber(quote.averageDailyVolume3Month),
    marketCap: toNumber(quote.marketCap),
    epsTrailingTwelveMonths,
    trailingPE,
  }
}

function preferSymbol(
  primary: string | null | undefined,
  fallback: string
): string {
  if (typeof primary === "string" && primary.trim() !== "") {
    return primary
  }

  return fallback
}

function preferOptionalString(
  primary: string | null | undefined,
  fallback: string | null | undefined
): string | null {
  if (typeof primary === "string" && primary.trim() !== "") {
    return primary
  }

  if (typeof fallback === "string" && fallback.trim() !== "") {
    return fallback
  }

  if (typeof primary === "string") {
    return primary
  }

  if (typeof fallback === "string") {
    return fallback
  }

  return null
}

function preferNumber(
  primary: number | null | undefined,
  fallback: number | null | undefined
): number | null {
  if (primary !== null && primary !== undefined) {
    return primary
  }

  if (fallback !== null && fallback !== undefined) {
    return fallback
  }

  return null
}

function mergeScreenerQuote(
  base: ScreenerQuote,
  quote: Quote | null | undefined
): ScreenerQuote {
  if (!quote) {
    return base
  }

  const hydrated = hydratePeFromOfflineData(base.symbol, quote)
  const normalized = quoteToScreenerQuote(base.symbol, hydrated)

  return {
    symbol: preferSymbol(normalized.symbol, base.symbol),
    shortName: preferOptionalString(normalized.shortName, base.shortName),
    regularMarketPrice: preferNumber(
      normalized.regularMarketPrice,
      base.regularMarketPrice
    ),
    regularMarketChange: preferNumber(
      normalized.regularMarketChange,
      base.regularMarketChange
    ),
    regularMarketChangePercent: preferNumber(
      normalized.regularMarketChangePercent,
      base.regularMarketChangePercent
    ),
    regularMarketVolume: preferNumber(
      normalized.regularMarketVolume,
      base.regularMarketVolume
    ),
    averageDailyVolume3Month: preferNumber(
      normalized.averageDailyVolume3Month,
      base.averageDailyVolume3Month
    ),
    marketCap: preferNumber(normalized.marketCap, base.marketCap),
    epsTrailingTwelveMonths: preferNumber(
      normalized.epsTrailingTwelveMonths,
      base.epsTrailingTwelveMonths
    ),
    trailingPE: preferNumber(normalized.trailingPE, base.trailingPE),
  }
}

async function enrichScreenerQuotes(
  quotes: ScreenerQuote[]
): Promise<ScreenerQuote[]> {
  const symbols = Array.from(
    new Set(
      quotes
        .map((quote) => quote.symbol)
        .filter(
          (symbol): symbol is string =>
            typeof symbol === "string" && symbol.trim() !== ""
        )
    )
  )

  if (symbols.length === 0) {
    return quotes
  }

  try {
    const quotesBySymbol = await loadQuotesForSymbols(symbols)

    return quotes.map((quote) =>
      mergeScreenerQuote(quote, quotesBySymbol.get(quote.symbol))
    )
  } catch (error) {
    console.warn("Failed to enrich screener quotes", error)
    return quotes
  }
}

async function createFallbackResult(
  query: string,
  limit: number,
  description: string
): Promise<ScreenerResult> {
  const fallbackSymbols = FALLBACK_SYMBOLS.slice(0, limit)

  try {
    const quotesBySymbol = await loadQuotesForSymbols(fallbackSymbols)

    const quotes = fallbackSymbols.map((symbol) =>
      quoteToScreenerQuote(symbol, quotesBySymbol.get(symbol) ?? null)
    )

    return {
      id: query,
      title: "Live screener data temporarily unavailable",
      description,
      canonicalName: query,
      quotes,
      start: 0,
      count: quotes.length,
      total: quotes.length,
    }
  } catch (error) {
    console.warn("Failed to hydrate live fallback screener quotes", error)

    const quotes = fallbackSymbols.map((symbol) =>
      createEmptyScreenerQuote(symbol)
    )

    return {
      id: query,
      title: "Market data unavailable",
      description,
      canonicalName: query,
      quotes,
      start: 0,
      count: quotes.length,
      total: quotes.length,
    }
  }
}

type ScreenerApiResponse = {
  finance?: {
    result?: Array<{
      id?: string
      title?: string
      description?: string
      canonicalName?: string
      start?: number
      count?: number
      total?: number
      quotes?: any[]
    }>
  }
}

function buildScreenerResult(
  response: any,
  query: string,
  quotes: ScreenerQuote[],
  total: number
): ScreenerResult {
  return {
    id: typeof response?.id === "string" ? response.id : query,
    title:
      typeof response?.title === "string"
        ? response.title
        : "Market data unavailable",
    description:
      typeof response?.description === "string" ? response.description : "",
    canonicalName:
      typeof response?.canonicalName === "string"
        ? response.canonicalName
        : query,
    quotes,
    start: 0,
    count: quotes.length,
    total,
  }
}

async function fetchScreenerPage(
  query: string,
  start: number,
  limit: number
): Promise<any> {
  const data = await yahooFinanceFetch<ScreenerApiResponse>(
    "v1/finance/screener/predefined/saved",
    {
      scrIds: query as PredefinedScreenerModules,
      count: limit,
      start,
      region: "US",
      lang: "en-US",
    }
  )

  const response = data.finance?.result?.[0]

  if (!response) {
    throw new Error("No screener results returned")
  }

  return response
}

export const fetchScreenerResults = async (
  query: string,
  count?: number
): Promise<ScreenerResult> => {
  noStore()

  const desiredTotal = count ?? Number.POSITIVE_INFINITY

  try {
    const quotes: ScreenerQuote[] = []
    const seenSymbols = new Set<string>()

    let pageIndex = 0
    let start = 0
    let totalAvailable: number | null = null
    let firstResponse: any | null = null

    while (
      quotes.length < desiredTotal &&
      pageIndex < MAX_PAGES &&
      (totalAvailable === null || start < totalAvailable)
    ) {
      const remaining =
        desiredTotal === Number.POSITIVE_INFINITY
          ? ITEMS_PER_PAGE
          : Math.max(
              0,
              Math.min(ITEMS_PER_PAGE, desiredTotal - quotes.length)
            )

      if (remaining === 0) {
        break
      }

      const response = await fetchScreenerPage(query, start, remaining)

      if (!firstResponse) {
        firstResponse = response
      }

      const rawQuotes = Array.isArray(response?.quotes) ? response.quotes : []
      const normalizedQuotes = rawQuotes.map(normalizeScreenerQuote)

      for (const quote of normalizedQuotes) {
        if (!quote.symbol || seenSymbols.has(quote.symbol)) {
          continue
        }

        quotes.push(quote)
        seenSymbols.add(quote.symbol)

        if (quotes.length >= desiredTotal) {
          break
        }
      }

      const received = normalizedQuotes.length

      if (Number.isFinite(response?.total)) {
        totalAvailable = response.total as number
      } else if (totalAvailable === null) {
        totalAvailable = received
      }

      if (received <= 0) {
        break
      }

      start += received
      pageIndex += 1
    }

    if (!firstResponse || quotes.length === 0) {
      throw new Error("No screener quotes returned")
    }

    const total = Math.max(
      quotes.length,
      totalAvailable !== null ? totalAvailable : quotes.length
    )

    const enrichedQuotes = await enrichScreenerQuotes(quotes)

    return buildScreenerResult(firstResponse, query, enrichedQuotes, total)
  } catch (error) {
    console.warn("Failed to fetch screener stocks", error)

    return await createFallbackResult(
      query,
      Math.min(
        typeof desiredTotal === "number" && Number.isFinite(desiredTotal)
          ? desiredTotal
          : FALLBACK_SYMBOLS.length,
        FALLBACK_SYMBOLS.length
      ),
      "Live screener results are currently unavailable. Showing placeholder symbols instead."
    )
  }
}
