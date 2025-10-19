import { unstable_noStore as noStore } from "next/cache"

import type {
  PredefinedScreenerModules,
  ScreenerQuote,
  ScreenerResult,
} from "@/types/yahoo-finance"

import { getOfflineQuote } from "@/data/offlineQuotes"

import { yahooFinanceFetch } from "./client"

const ITEMS_PER_PAGE = 40

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

const FALLBACK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"] as const

function toScreenerQuote(symbol: string): ScreenerQuote {
  const offlineQuote = getOfflineQuote(symbol)

  if (!offlineQuote) {
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

  const regularMarketPrice = toNumber(offlineQuote.regularMarketPrice)
  const epsTrailingTwelveMonths = toNumber(offlineQuote.trailingEps)
  const trailingPE =
    toNumber(offlineQuote.trailingPE) ??
    calculatePe(regularMarketPrice, epsTrailingTwelveMonths)

  return {
    symbol: offlineQuote.symbol,
    shortName: offlineQuote.shortName ?? offlineQuote.symbol,
    regularMarketPrice,
    regularMarketChange: toNumber(offlineQuote.regularMarketChange),
    regularMarketChangePercent: toNumber(
      offlineQuote.regularMarketChangePercent
    ),
    regularMarketVolume: toNumber(offlineQuote.regularMarketVolume),
    averageDailyVolume3Month: toNumber(
      offlineQuote.averageDailyVolume3Month
    ),
    marketCap: toNumber(offlineQuote.marketCap),
    epsTrailingTwelveMonths,
    trailingPE,
  })
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

const FALLBACK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"] as const

function toScreenerQuote(symbol: string): ScreenerQuote {
  const offlineQuote = getOfflineQuote(symbol)

  if (!offlineQuote) {
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

  const regularMarketPrice = toNumber(offlineQuote.regularMarketPrice)
  const epsTrailingTwelveMonths = toNumber(offlineQuote.trailingEps)
  const trailingPE =
    toNumber(offlineQuote.trailingPE) ??
    calculatePe(regularMarketPrice, epsTrailingTwelveMonths)

  return {
    symbol: offlineQuote.symbol,
    shortName: offlineQuote.shortName ?? offlineQuote.symbol,
    regularMarketPrice,
    regularMarketChange: toNumber(offlineQuote.regularMarketChange),
    regularMarketChangePercent: toNumber(
      offlineQuote.regularMarketChangePercent
    ),
    regularMarketVolume: toNumber(offlineQuote.regularMarketVolume),
    averageDailyVolume3Month: toNumber(
      offlineQuote.averageDailyVolume3Month
    ),
    marketCap: toNumber(offlineQuote.marketCap),
    epsTrailingTwelveMonths,
    trailingPE,
  }
}

function createFallbackResult(
  query: string,
  limit: number,
  description: string
): ScreenerResult {
  const quotes = FALLBACK_SYMBOLS.slice(0, limit).map((symbol) =>
    toScreenerQuote(symbol)
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

function normalizeScreenerResult(
  response: any,
  query: string,
  limit: number
): ScreenerResult {
  const rawQuotes = Array.isArray(response?.quotes) ? response.quotes : []
  const quotes = rawQuotes.map(normalizeScreenerQuote).slice(0, limit)

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
    start: Number.isFinite(response?.start) ? response.start : 0,
    count: Number.isFinite(response?.count) ? response.count : quotes.length,
    total: Number.isFinite(response?.total) ? response.total : quotes.length,
  }
}

export async function fetchScreenerStocks(
  query: string,
  count?: number
): Promise<ScreenerResult> {
  noStore()

  const limit = count ?? ITEMS_PER_PAGE

  try {
    const data = await yahooFinanceFetch<ScreenerApiResponse>(
      "v1/finance/screener/predefined/saved",
      {
        scrIds: query as PredefinedScreenerModules,
        count: limit,
        region: "US",
        lang: "en-US",
      }
    )

    const response = data.finance?.result?.[0]

    if (!response) {
      throw new Error("No screener results returned")
    }

    return normalizeScreenerResult(response, query, limit)
  } catch (error) {
    console.warn("Failed to fetch screener stocks", error)

    return createFallbackResult(
      query,
      limit,
      "Live screener results are currently unavailable. Showing placeholder symbols instead."
    )
  }
}
