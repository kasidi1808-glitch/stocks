import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import { getOfflineQuote } from "@/data/offlineQuotes"
import { loadQuotesForSymbols, normalizeTicker } from "../yahoo-finance/fetchQuote"
import { applyDisplayMetrics } from "./displayMetrics"

import type { MarketInstrument } from "./types"

function normalizeName(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function createPlaceholderQuote(instrument: MarketInstrument): Quote {
  const normalizedSymbol = normalizeTicker(instrument.symbol)
  const fallbackSymbol = normalizedSymbol || instrument.symbol
  const offlineQuote = getOfflineQuote(fallbackSymbol)

  if (offlineQuote) {
    return applyDisplayMetrics(applyInstrumentOverrides(offlineQuote, instrument))
  }

  const placeholderQuote: Quote = {
    symbol: fallbackSymbol,
    shortName: instrument.shortName,
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
  }

  return applyDisplayMetrics(applyInstrumentOverrides(placeholderQuote, instrument))
}

function applyInstrumentOverrides(
  quote: Quote,
  instrument: MarketInstrument
): Quote {
  const normalizedInstrumentSymbol = normalizeTicker(instrument.symbol)
  const fallbackSymbol = normalizedInstrumentSymbol || instrument.symbol
  const normalizedQuoteSymbol = normalizeTicker(quote.symbol)
  const normalizedQuoteName = normalizeName(quote.shortName)
  const normalizedInstrumentName = normalizeName(instrument.shortName)

  return {
    ...quote,
    symbol: normalizedQuoteSymbol || fallbackSymbol,
    shortName: normalizedQuoteName ?? normalizedInstrumentName ?? (normalizedQuoteSymbol || fallbackSymbol),
  }
}

export async function fetchMarketSnapshot(
  instruments: MarketInstrument[]
): Promise<Quote[]> {
  noStore()

  const symbols = instruments.map((instrument) => normalizeTicker(instrument.symbol) || instrument.symbol)
  const quotesBySymbol = await loadQuotesForSymbols(symbols)

  return instruments.map((instrument) => {
    const normalizedSymbol = normalizeTicker(instrument.symbol)
    const lookupSymbol = normalizedSymbol || instrument.symbol
    const quote =
      quotesBySymbol.get(lookupSymbol) ??
      (normalizedSymbol ? quotesBySymbol.get(instrument.symbol) : undefined)

    if (quote) {
      return applyDisplayMetrics(applyInstrumentOverrides(quote, instrument))
    }

    return createPlaceholderQuote(instrument)
  })
}
