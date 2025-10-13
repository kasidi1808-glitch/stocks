import { unstable_noStore as noStore } from "next/cache"

import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

import { loadQuotesForSymbols } from "../yahoo-finance/fetchQuote"
import { loadQuoteSummary } from "../yahoo-finance/fetchQuoteSummary"
import { getOfflineQuoteSummary } from "@/data/offlineQuoteSummaries"
import { getOfflineQuote } from "@/data/offlineQuotes"

import type { MarketInstrument } from "./types"

function normalizeString(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  return trimmed
}

function normalizeName(
  value: string | null | undefined,
  symbol: string
): string | null {
  const normalized = normalizeString(value)

  if (!normalized) {
    return null
  }

  if (normalized.toUpperCase() === symbol.toUpperCase()) {
    return null
  }

  return normalized
}

function createPlaceholderQuote(instrument: MarketInstrument): Quote {
  const symbol = normalizeString(instrument.symbol) ?? ""
  const fallbackName = normalizeName(instrument.shortName, symbol) ?? symbol

  return applyCompanyNameFallbacks({
    symbol,
    shortName: fallbackName,
    longName: fallbackName,
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
  }, instrument.shortName)
}

function applyInstrumentOverrides(
  quote: Quote,
  instrument: MarketInstrument
): Quote {
  const requestSymbol = normalizeString(instrument.symbol) ?? ""
  const quoteSymbol = normalizeString(quote.symbol) ?? requestSymbol
  const shortNameFromQuote = normalizeName(quote.shortName ?? null, quoteSymbol)
  const longNameFromQuote = normalizeName(quote.longName ?? null, quoteSymbol)
  const instrumentName = normalizeName(instrument.shortName, quoteSymbol)
  const fallbackSymbol = quoteSymbol || requestSymbol
  const fallbackName = instrumentName ?? shortNameFromQuote ?? fallbackSymbol

  return applyCompanyNameFallbacks(
    {
      ...quote,
      symbol: quoteSymbol,
      shortName: shortNameFromQuote ?? fallbackName,
      longName: longNameFromQuote ?? fallbackName,
    },
    instrument.shortName
  )
}

function mergeQuoteWithSummary(
  quote: Quote,
  summary?: QuoteSummary | null
): Quote {
  if (!summary) {
    return quote
  }

  const merged: Quote = { ...quote }

  const summaryPe = summary.summaryDetail?.trailingPE
  if (typeof summaryPe === "number" && Number.isFinite(summaryPe) && summaryPe > 0) {
    merged.trailingPE = summaryPe
  }

  const summaryEps = summary.defaultKeyStatistics?.trailingEps
  if (typeof summaryEps === "number" && Number.isFinite(summaryEps)) {
    merged.trailingEps = summaryEps
  }

  return merged
}

function mergeQuoteWithSummary(
  quote: Quote,
  summary?: QuoteSummary | null
): Quote {
  if (!summary) {
    return quote
  }

  const merged: Quote = { ...quote }

  const summaryPe = summary.summaryDetail?.trailingPE
  if (typeof summaryPe === "number" && Number.isFinite(summaryPe) && summaryPe > 0) {
    merged.trailingPE = summaryPe
  }

  const summaryEps = summary.defaultKeyStatistics?.trailingEps
  if (typeof summaryEps === "number" && Number.isFinite(summaryEps)) {
    merged.trailingEps = summaryEps
  }

  return merged
}

function mergeQuoteWithSummary(
  quote: Quote,
  summary?: QuoteSummary | null
): Quote {
  if (!summary) {
    return quote
  }

  const merged: Quote = { ...quote }

  const summaryPe = summary.summaryDetail?.trailingPE
  if (typeof summaryPe === "number" && Number.isFinite(summaryPe) && summaryPe > 0) {
    merged.trailingPE = summaryPe
  }

  const summaryEps = summary.defaultKeyStatistics?.trailingEps
  if (typeof summaryEps === "number" && Number.isFinite(summaryEps)) {
    merged.trailingEps = summaryEps
  }

  return merged
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function mergeQuoteWithSummary(
  quote: Quote,
  summary?: QuoteSummary | null
): Quote {
  if (!summary) {
    return quote
  }

  const merged: Quote = { ...quote }

  const summaryPe = summary.summaryDetail?.trailingPE
  if (typeof summaryPe === "number" && Number.isFinite(summaryPe) && summaryPe > 0) {
    merged.trailingPE = summaryPe
  }

  const summaryEps = summary.defaultKeyStatistics?.trailingEps
  if (typeof summaryEps === "number" && Number.isFinite(summaryEps)) {
    merged.trailingEps = summaryEps
  }

  return merged
}

function hydratePeFromOfflineData(symbol: string, quote: Quote): Quote {
  if (isFiniteNumber(quote.trailingPE) && quote.trailingPE > 0) {
    return quote
  }

  const offlineSummary = getOfflineQuoteSummary(symbol)
  const offlineQuote = getOfflineQuote(symbol)

  const merged: Quote = { ...quote }

  const offlinePe = offlineSummary?.summaryDetail?.trailingPE
  if (isFiniteNumber(offlinePe) && offlinePe > 0) {
    merged.trailingPE = offlinePe
  }

  const offlineEps = offlineSummary?.defaultKeyStatistics?.trailingEps
  if (isFiniteNumber(offlineEps)) {
    merged.trailingEps = offlineEps
  }

  if (
    (!isFiniteNumber(merged.trailingPE) || merged.trailingPE <= 0) &&
    merged.trailingEps &&
    merged.trailingEps !== 0
  ) {
    const priceSource = isFiniteNumber(merged.regularMarketPrice)
      ? merged.regularMarketPrice
      : offlineQuote?.regularMarketPrice ?? null

    if (isFiniteNumber(priceSource) && priceSource > 0) {
      const computedPe = priceSource / merged.trailingEps

      if (Number.isFinite(computedPe) && computedPe > 0) {
        merged.trailingPE = computedPe
      }
    }
  }

  return merged
}

export async function fetchMarketSnapshot(
  instruments: MarketInstrument[]
): Promise<Quote[]> {
  noStore()

  const symbols = instruments.map((instrument) => instrument.symbol)
  const [quotesBySymbol, summaries] = await Promise.all([
    loadQuotesForSymbols(symbols),
    Promise.all(
      instruments.map(async (instrument) => {
        try {
          const summary = await loadQuoteSummary(instrument.symbol)
          return [instrument.symbol, summary] as const
        } catch (error) {
          console.warn(
            `Failed to fetch quote summary for ${instrument.symbol}`,
            error
          )
          return [instrument.symbol, null] as const
        }
      })
    ),
  ])

  const summaryBySymbol = new Map(summaries)

  return instruments.map((instrument) => {
    const quote = quotesBySymbol.get(instrument.symbol)
    const summary = summaryBySymbol.get(instrument.symbol)

    if (quote) {
      const hydrated = hydratePeFromOfflineData(
        instrument.symbol,
        mergeQuoteWithSummary(quote, summary)
      )
      return applyInstrumentOverrides(hydrated, instrument)
    }

    const placeholder = createPlaceholderQuote(instrument)
    const hydratedPlaceholder = hydratePeFromOfflineData(
      instrument.symbol,
      mergeQuoteWithSummary(placeholder, summary)
    )
    return applyInstrumentOverrides(hydratedPlaceholder, instrument)
  })
}
