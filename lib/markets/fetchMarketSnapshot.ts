import { fmpFetch } from "@/lib/fmp/client"
import { fetchFmpQuote, mapFmpQuoteToQuote, type FmpQuote } from "@/lib/fmp/quotes"
import type { Quote } from "@/types/yahoo-finance"

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

async function buildCollectionLookups(paths: Set<string>) {
  const lookups = new Map<string, Map<string, FmpQuote>>()

  await Promise.all(
    Array.from(paths).map(async (path) => {
      try {
        const response = await fmpFetch<FmpQuote[]>(path)
        const mapBySymbol = new Map(response.map((item) => [item.symbol, item]))

        lookups.set(path, mapBySymbol)
      } catch (error) {
        console.warn(`Failed to load FMP collection ${path}`, error)
        lookups.set(path, new Map())
      }
    })
  )

  return lookups
}

async function buildQuoteLookups(symbols: Set<string>) {
  const lookups = new Map<string, Quote>()

  await Promise.all(
    Array.from(symbols).map(async (symbol) => {
      try {
        const quote = await fetchFmpQuote(symbol)
        lookups.set(symbol, quote)
      } catch (error) {
        console.warn(`Failed to fetch FMP quote for ${symbol}`, error)
      }
    })
  )

  return lookups
}

export async function fetchMarketSnapshot(
  instruments: MarketInstrument[]
): Promise<Quote[]> {
  const collectionPaths = new Set<string>()
  const quoteSymbols = new Set<string>()

  instruments.forEach((instrument) => {
    instrument.sources.forEach((source) => {
      if (source.type === "collection") {
        collectionPaths.add(source.path)
      } else {
        quoteSymbols.add(source.symbol)
      }
    })
  })

  const [collectionLookups, quoteLookups] = await Promise.all([
    buildCollectionLookups(collectionPaths),
    buildQuoteLookups(quoteSymbols),
  ])

  return instruments.map((instrument) => {
    for (const source of instrument.sources) {
      if (source.type === "collection") {
        const lookup = collectionLookups.get(source.path)
        const raw = lookup?.get(source.symbol)

        if (raw) {
          const mapped = mapFmpQuoteToQuote(raw)
          return applyInstrumentOverrides(mapped, instrument)
        }
      } else {
        const quote = quoteLookups.get(source.symbol)

        if (quote) {
          return applyInstrumentOverrides(quote, instrument)
        }
      }
    }

    return createPlaceholderQuote(instrument)
  })
}
