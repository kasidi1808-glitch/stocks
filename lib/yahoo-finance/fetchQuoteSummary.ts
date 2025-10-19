import { unstable_noStore as noStore } from "next/cache"

import type { QuoteSummary } from "@/types/yahoo-finance"

import { fetchQuote } from "./fetchQuote"
import { yahooFinanceFetch } from "./client"

function createEmptyQuoteSummary(): QuoteSummary {
  return {
    summaryDetail: {},
    defaultKeyStatistics: {},
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

async function fetchQuoteSummaryFromFmp(
  ticker: string
): Promise<QuoteSummary | null> {
  if (!isFmpApiAvailable()) {
    return null
  }

  try {
    const { fetchFmpQuoteSummary } = await import("@/lib/fmp/quoteSummary")

    return await fetchFmpQuoteSummary(ticker)
  } catch (error) {
    console.warn(`FMP quote summary lookup failed for ${ticker}`, error)
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
