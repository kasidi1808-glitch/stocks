import { unstable_noStore as noStore } from "next/cache"

import type { Quote } from "@/types/yahoo-finance"

import { loadQuotesForSymbols } from "../yahoo-finance/fetchQuote"

import type { MarketInstrument } from "./types"

function createPlaceholderQuote(instrument: MarketInstrument): Quote {
  return {
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
  }
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
