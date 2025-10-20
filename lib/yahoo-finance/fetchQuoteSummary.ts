import { unstable_noStore as noStore } from "next/cache"

import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

import { fetchQuote } from "./fetchQuote"
import { yahooFinanceFetch } from "./client"

function createEmptyQuoteSummary(): QuoteSummary {
  return {
    summaryDetail: {},
    defaultKeyStatistics: {},
  }
}

function pruneSection<T extends Record<string, unknown>>(section: T): T | undefined {
  const entries = Object.entries(section).filter(([, value]) => value != null)

  if (entries.length === 0) {
    return undefined
  }

  return Object.fromEntries(entries) as T
}

function buildSummaryFromQuote(quote: Quote): QuoteSummary | null {
  const summaryDetail = pruneSection({
    open: quote.regularMarketOpen ?? null,
    dayHigh: quote.regularMarketDayHigh ?? null,
    dayLow: quote.regularMarketDayLow ?? null,
    volume: quote.regularMarketVolume ?? null,
    trailingPE: quote.trailingPE ?? null,
    marketCap: quote.marketCap ?? null,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,
    averageVolume: quote.averageDailyVolume3Month ?? null,
  })

  const defaultKeyStatistics = pruneSection({
    trailingEps: quote.trailingEps ?? null,
  })

  if (!summaryDetail && !defaultKeyStatistics) {
    return null
  }

  return {
    summaryDetail,
    defaultKeyStatistics,
  }
}

type QuoteSummaryApiResponse = {
  quoteSummary?: {
    result?: Array<Record<string, unknown>>
  }
}

function normalizeQuoteSummary(raw: any): QuoteSummary {
  if (!raw || typeof raw !== "object") {
    return createEmptyQuoteSummary()
  }

  return {
    summaryDetail: (raw.summaryDetail ?? {}) as QuoteSummary["summaryDetail"],
    defaultKeyStatistics: (raw.defaultKeyStatistics ?? {}) as QuoteSummary["defaultKeyStatistics"],
    summaryProfile: raw.summaryProfile ?? undefined,
  }
}

async function fetchQuoteSummaryFromYahoo(
  ticker: string
): Promise<QuoteSummary | null> {
  try {
    const data = await yahooFinanceFetch<QuoteSummaryApiResponse>(
      `v10/finance/quoteSummary/${encodeURIComponent(ticker)}`,
      {
        modules: [
          "summaryDetail",
          "defaultKeyStatistics",
          "summaryProfile",
        ].join(","),
        region: "US",
        lang: "en-US",
      }
    )

    const rawResult = data.quoteSummary?.result?.[0]

    if (!rawResult) {
      return null
    }

    return normalizeQuoteSummary(rawResult)
  } catch (error) {
    console.warn(`Failed to fetch quote summary for ${ticker}`, error)
    return null
  }
}

export const loadQuoteSummary = async (
  ticker: string
): Promise<QuoteSummary> => {
  noStore()

  const yahooQuoteSummary = await fetchQuoteSummaryFromYahoo(ticker)
  if (yahooQuoteSummary) {
    return yahooQuoteSummary
  }

  try {
    const quote = await fetchQuote(ticker)
    const generatedSummary = buildSummaryFromQuote(quote)
    if (generatedSummary) {
      return generatedSummary
    }
  } catch (error) {
    console.warn(
      `Unable to derive quote summary from live quote for ${ticker}`,
      error
    )
  }

  console.warn(`Returning empty quote summary for ${ticker}`)
  return createEmptyQuoteSummary()
}
