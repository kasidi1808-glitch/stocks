import { unstable_noStore as noStore } from "next/cache"

import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

import { getOfflineQuote } from "@/data/offlineQuotes"

import { loadQuotesForSymbols } from "../yahoo-finance/fetchQuote"
import { loadQuoteSummary } from "../yahoo-finance/fetchQuoteSummary"
import { hydratePeFromOfflineData, mergeQuoteWithSummary } from "./quoteEnrichment"

import type { MarketInstrument } from "./types"

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
  return {
    ...quote,
    symbol: instrument.symbol,
    shortName: instrument.shortName ?? quote.shortName ?? instrument.symbol,
  }
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

    const summaryHydrated = mergeQuoteWithSummary(baseQuote, summary)

    return hydratePeFromOfflineData(instrument.symbol, summaryHydrated)
  })
}
