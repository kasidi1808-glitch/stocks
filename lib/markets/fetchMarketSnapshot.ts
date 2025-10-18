import { unstable_noStore as noStore } from "next/cache"

import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

import { getOfflineQuote } from "@/data/offlineQuotes"

import { loadQuotesForSymbols } from "../yahoo-finance/fetchQuote"
import { loadQuoteSummary } from "../yahoo-finance/fetchQuoteSummary"
import { hydratePeFromOfflineData } from "./quoteEnrichment"

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
  const offlineQuote = getOfflineQuote(instrument.symbol)
  if (offlineQuote) {
    return applyInstrumentOverrides(offlineQuote, instrument)
  }

  return applyInstrumentOverrides(
    {
      symbol: instrument.symbol,
      shortName: instrument.shortName,
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
    },
    instrument
  )
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

async function loadSummariesForSymbols(
  symbols: string[]
): Promise<Map<string, QuoteSummary | null>> {
  if (symbols.length === 0) {
    return new Map()
  }

  const uniqueSymbols = Array.from(new Set(symbols))

  const entries = await Promise.all(
    uniqueSymbols.map(async (symbol): Promise<[string, QuoteSummary | null]> => {
      try {
        const summary = await loadQuoteSummary(symbol)
        return [symbol, summary]
      } catch (error) {
        console.warn(`Failed to load quote summary for ${symbol}`, error)
        return [symbol, null]
      }
    })
  )

  return new Map(entries)
}

async function loadSummariesForSymbols(
  symbols: string[]
): Promise<Map<string, QuoteSummary | null>> {
  if (symbols.length === 0) {
    return new Map()
  }

  const uniqueSymbols = Array.from(new Set(symbols))

  const entries = await Promise.all(
    uniqueSymbols.map(async (symbol): Promise<[string, QuoteSummary | null]> => {
      try {
        const summary = await loadQuoteSummary(symbol)
        return [symbol, summary]
      } catch (error) {
        console.warn(`Failed to load quote summary for ${symbol}`, error)
        return [symbol, null]
      }
    })
  )

  return new Map(entries)
}

async function loadSummariesForSymbols(
  symbols: string[]
): Promise<Map<string, QuoteSummary | null>> {
  if (symbols.length === 0) {
    return new Map()
  }

  const uniqueSymbols = Array.from(new Set(symbols))

  const entries = await Promise.all(
    uniqueSymbols.map(async (symbol): Promise<[string, QuoteSummary | null]> => {
      try {
        const summary = await loadQuoteSummary(symbol)
        return [symbol, summary]
      } catch (error) {
        console.warn(`Failed to load quote summary for ${symbol}`, error)
        return [symbol, null]
      }
    })
  )

  return new Map(entries)
}

export async function fetchMarketSnapshot(
  instruments: MarketInstrument[]
): Promise<Quote[]> {
  noStore()

  const symbols = instruments.map((instrument) => instrument.symbol)
  const [quotesBySymbol, summariesBySymbol] = await Promise.all([
    loadQuotesForSymbols(symbols),
    loadSummariesForSymbols(symbols),
  ])

  return instruments.map((instrument) => {
    const quote = quotesBySymbol.get(instrument.symbol)
    const summary = summariesBySymbol.get(instrument.symbol) ?? null

    const baseQuote = quote
      ? applyInstrumentOverrides(quote, instrument)
      : createPlaceholderQuote(instrument)

    return hydratePeFromOfflineData(
      instrument.symbol,
      baseQuote,
      summary
    )
  })
}
