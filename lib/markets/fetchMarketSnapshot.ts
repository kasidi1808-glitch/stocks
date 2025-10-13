import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import { loadQuotesForSymbols } from "../yahoo-finance/fetchQuote"
import { applyCompanyNameFallbacks } from "@/lib/company-names"

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

export async function fetchMarketSnapshot(
  instruments: MarketInstrument[]
): Promise<Quote[]> {
  noStore()

  const symbols = instruments.map((instrument) => instrument.symbol)
  const quotesBySymbol = await loadQuotesForSymbols(symbols)

  return instruments.map((instrument) => {
    const quote = quotesBySymbol.get(instrument.symbol)

    if (quote) {
      return applyInstrumentOverrides(quote, instrument)
    }

    return createPlaceholderQuote(instrument)
  })
}
