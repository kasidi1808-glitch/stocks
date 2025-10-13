import { unstable_noStore as noStore } from "next/cache"

import type {
  PredefinedScreenerModules,
  Quote,
  ScreenerQuote,
  ScreenerResult,
} from "@/types/yahoo-finance"

import { OFFLINE_SYMBOLS } from "@/data/offlineQuotes"
import { yahooFinanceFetch } from "./client"
import { loadQuotesForSymbols } from "./fetchQuote"
import { applyCompanyNameFallbacks } from "@/lib/company-names"

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

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  return trimmed
}

function normalizeName(value: unknown, symbol: string): string | null {
  const normalized = normalizeString(value)

  if (!normalized) {
    return null
  }

  if (normalized.toUpperCase() === symbol.toUpperCase()) {
    return null
  }

  return normalized
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

  const rawSymbol =
    normalizeString(rawQuote?.symbol) ?? normalizeString(rawQuote?.ticker) ?? ""
  const symbol = rawSymbol
  const shortNameCandidate = normalizeName(rawQuote?.shortName, symbol)
  const displayNameCandidate =
    normalizeName(rawQuote?.longName, symbol) ??
    normalizeName(rawQuote?.displayName, symbol)

  return applyCompanyNameFallbacks(
    {
      symbol,
      shortName: shortNameCandidate ?? symbol,
      longName: displayNameCandidate ?? shortNameCandidate ?? symbol,
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
    },
    rawQuote?.displayName
  )
}

const FALLBACK_SYMBOLS = OFFLINE_SYMBOLS

function createEmptyScreenerQuote(symbol: string): ScreenerQuote {
  return applyCompanyNameFallbacks({
    symbol,
    shortName: symbol,
    longName: symbol,
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
    trailingPE: null,
  })
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

  const resolvedSymbolRaw = normalizeString(quote.symbol)
  const resolvedSymbol = resolvedSymbolRaw ?? symbol
  const shortNameCandidate = normalizeName(quote.shortName, resolvedSymbol)
  const longNameCandidate = normalizeName(quote.longName, resolvedSymbol)

  return applyCompanyNameFallbacks({
    symbol: resolvedSymbol,
    shortName: shortNameCandidate ?? resolvedSymbol,
    longName: longNameCandidate ?? shortNameCandidate ?? resolvedSymbol,
    regularMarketPrice,
    regularMarketChange: toNumber(quote.regularMarketChange),
    regularMarketChangePercent: toNumber(quote.regularMarketChangePercent),
    regularMarketVolume: toNumber(quote.regularMarketVolume),
    averageDailyVolume3Month: toNumber(quote.averageDailyVolume3Month),
    marketCap: toNumber(quote.marketCap),
    epsTrailingTwelveMonths,
    trailingPE,
  })
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

    return buildScreenerResult(firstResponse, query, quotes, total)
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
