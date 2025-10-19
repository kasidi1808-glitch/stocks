import { unstable_noStore as noStore } from "next/cache"

import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

import { getOfflineQuote } from "@/data/offlineQuotes"
import {
  loadQuotesForSymbols,
  normalizeTicker,
} from "../yahoo-finance/fetchQuote"

import type { MarketInstrument } from "./types"

function normalizeName(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

function createPlaceholderQuote(instrument: MarketInstrument): Quote {
  return {
    symbol: normalizeTicker(instrument.symbol),
    shortName: instrument.shortName ?? instrument.symbol,
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
  const symbol = normalizeTicker(instrument.symbol)

  return {
    ...quote,
    symbol,
    shortName: instrument.shortName ?? quote.shortName ?? symbol,
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

  const symbols = instruments.map((instrument) => normalizeTicker(instrument.symbol))
  const quotesBySymbol = await loadQuotesForSymbols(symbols)

  return instruments.map((instrument) => {
    const symbol = normalizeTicker(instrument.symbol)
    const quote = quotesBySymbol.get(symbol)

    if (quote) {
      return applyDisplayMetrics(applyInstrumentOverrides(quote, instrument))
    }

    const offlineQuote = getOfflineQuote(symbol)
    if (offlineQuote) {
      return applyInstrumentOverrides(offlineQuote, instrument)
    }

    return applyInstrumentOverrides(createPlaceholderQuote(instrument), instrument)
  })
}
