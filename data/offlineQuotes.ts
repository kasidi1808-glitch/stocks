import type { Quote } from "@/types/yahoo-finance"
import { applyCompanyNameFallbacks } from "@/lib/company-names"
import rawOfflineQuoteData from "@/data/yahoo-offline-quotes.json"

const BASE_TIMESTAMP = Date.UTC(2024, 0, 5, 20, 0, 0) / 1000

export type OfflineQuoteSeed = Omit<Quote, "regularMarketTime" | "currency"> & {
  regularMarketTime?: number | null
  currency?: string | null
}

const offlineQuoteSeeds = rawOfflineQuoteData as Record<string, OfflineQuoteSeed>

function buildQuote(symbol: string, seed: OfflineQuoteSeed): Quote {
  const resolvedSymbol =
    typeof seed.symbol === "string" && seed.symbol.trim() !== ""
      ? seed.symbol
      : symbol

  const normalizedQuote: Quote = {
    ...seed,
    symbol: resolvedSymbol,
    regularMarketTime: seed.regularMarketTime ?? BASE_TIMESTAMP,
    currency: seed.currency ?? "USD",
  }

  return applyCompanyNameFallbacks(
    normalizedQuote,
    seed.longName,
    seed.shortName
  )
}

const OFFLINE_QUOTES: Record<string, Quote> = Object.fromEntries(
  Object.entries(offlineQuoteSeeds).map(([symbol, seed]) => [
    symbol,
    buildQuote(symbol, seed),
  ])
)

export function getOfflineQuote(symbol: string): Quote | null {
  const quote = OFFLINE_QUOTES[symbol]

  if (!quote) {
    return null
  }

  return { ...quote }
}

export function getOfflineQuotes(symbols: string[]): Map<string, Quote> {
  const entries = symbols
    .map((symbol) => [symbol, getOfflineQuote(symbol)] as const)
    .filter(([, quote]) => quote !== null) as Array<[string, Quote]>

  return new Map(entries)
}

export function hasOfflineQuote(symbol: string): boolean {
  return Boolean(OFFLINE_QUOTES[symbol])
}

export const OFFLINE_SYMBOLS = Object.keys(OFFLINE_QUOTES)
