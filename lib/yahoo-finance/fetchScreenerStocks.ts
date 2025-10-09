import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"

import type {
  PredefinedScreenerModules,
  ScreenerQuote,
  ScreenerResult,
} from "@/types/yahoo-finance"

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

function normalizeScreenerQuote(rawQuote: any): ScreenerQuote {
  return {
    symbol: typeof rawQuote?.symbol === "string" ? rawQuote.symbol : "",
    shortName:
      rawQuote?.shortName ?? rawQuote?.longName ?? rawQuote?.symbol ?? "",
    regularMarketPrice: toNumber(rawQuote?.regularMarketPrice),
    regularMarketChange: toNumber(rawQuote?.regularMarketChange),
    regularMarketChangePercent: toNumber(
      rawQuote?.regularMarketChangePercent
    ),
    regularMarketVolume: toNumber(rawQuote?.regularMarketVolume),
    averageDailyVolume3Month: toNumber(rawQuote?.averageDailyVolume3Month),
    marketCap: toNumber(rawQuote?.marketCap),
    epsTrailingTwelveMonths: toNumber(rawQuote?.epsTrailingTwelveMonths),
  }
}

const FALLBACK_QUOTES: ScreenerQuote[] = [
  {
    symbol: "AAPL",
    shortName: "Apple Inc.",
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
  },
  {
    symbol: "MSFT",
    shortName: "Microsoft Corporation",
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
  },
  {
    symbol: "GOOGL",
    shortName: "Alphabet Inc.",
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
  },
  {
    symbol: "AMZN",
    shortName: "Amazon.com, Inc.",
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
  },
  {
    symbol: "TSLA",
    shortName: "Tesla, Inc.",
    regularMarketPrice: null,
    regularMarketChange: null,
    regularMarketChangePercent: null,
    regularMarketVolume: null,
    averageDailyVolume3Month: null,
    marketCap: null,
    epsTrailingTwelveMonths: null,
  },
]

function createFallbackResult(
  query: string,
  limit: number,
  description: string
): ScreenerResult {
  const quotes = FALLBACK_QUOTES.slice(0, limit)

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

  // PAGINATION IS HANDLED BY TENSTACK TABLE

  const limit = count ?? ITEMS_PER_PAGE

  const queryOptions = {
    scrIds: query as PredefinedScreenerModules,
    count: limit,
    region: "US",
    lang: "en-US",
  }

  try {
    const response = await yahooFinance.screener(queryOptions, {
      validateResult: false,
    })

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
