import type { Quote } from "@/node_modules/yahoo-finance2/dist/esm/src/modules/quote"
import { fmpFetch } from "./client"

interface FmpQuote {
  symbol: string
  name?: string
  price?: number
  change?: number
  changesPercentage?: number
  dayLow?: number
  dayHigh?: number
  yearLow?: number
  yearHigh?: number
  marketCap?: number
  volume?: number
  avgVolume?: number
  open?: number
  previousClose?: number
  eps?: number
  pe?: number
  exchange?: string
  currency?: string
  timestamp?: number
  postMarketPrice?: number
  postMarketChange?: number
  postMarketChangePercent?: number
  preMarketPrice?: number
  preMarketChange?: number
  preMarketChangePercent?: number
}

type FmpQuoteResponse = FmpQuote[]

function mapFmpQuoteToQuote(fmpQuote: FmpQuote): Quote {
  const {
    symbol,
    name,
    price,
    change,
    changesPercentage,
    dayLow,
    dayHigh,
    yearLow,
    yearHigh,
    marketCap,
    volume,
    avgVolume,
    open,
    previousClose,
    eps,
    pe,
    exchange,
    currency,
    timestamp,
    postMarketPrice,
    postMarketChange,
    postMarketChangePercent,
    preMarketPrice,
    preMarketChange,
    preMarketChangePercent,
  } = fmpQuote

  const mappedQuote: Quote = {
    symbol,
    shortName: name ?? symbol,
    regularMarketPrice: price,
    regularMarketChange: change,
    regularMarketChangePercent: changesPercentage,
    regularMarketDayLow: dayLow,
    regularMarketDayHigh: dayHigh,
    fiftyTwoWeekLow: yearLow,
    fiftyTwoWeekHigh: yearHigh,
    marketCap,
    regularMarketVolume: volume,
    averageDailyVolume3Month: avgVolume,
    regularMarketOpen: open,
    regularMarketPreviousClose: previousClose,
    trailingEps: eps,
    trailingPE: pe,
    fullExchangeName: exchange,
    currency,
    regularMarketTime: timestamp,
    postMarketPrice,
    postMarketChange,
    postMarketChangePercent,
    preMarketPrice,
    preMarketChange,
    preMarketChangePercent,
    hasPrePostMarketData:
      postMarketPrice !== undefined || preMarketPrice !== undefined,
  }

  return mappedQuote
}

export async function fetchFmpQuote(ticker: string): Promise<Quote> {
  const response = await fmpFetch<FmpQuoteResponse>(`quote/${ticker}`)

  if (!Array.isArray(response) || response.length === 0) {
    throw new Error(`No quote data returned for ticker ${ticker}`)
  }

  return mapFmpQuoteToQuote(response[0])
}
