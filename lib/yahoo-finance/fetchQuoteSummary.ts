import { unstable_noStore as noStore } from "next/cache"

import type { QuoteSummary } from "@/types/yahoo-finance"

import { getOfflineQuoteSummary } from "@/data/offlineQuoteSummaries"

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
  try {
    const { fetchFmpQuoteSummary } = await import("@/lib/fmp/quoteSummary")

    return await fetchFmpQuoteSummary(ticker)
  } catch (error) {
    console.warn(`FMP quote summary lookup failed for ${ticker}`, error)
    return null
  }
}

export async function loadQuoteSummary(ticker: string): Promise<QuoteSummary> {
  noStore()

  const yahooQuoteSummary = await fetchQuoteSummaryFromYahoo(ticker)
  if (yahooQuoteSummary) {
    return yahooQuoteSummary
  }

  const fmpQuoteSummary = await fetchQuoteSummaryFromFmp(ticker)
  if (fmpQuoteSummary) {
    return fmpQuoteSummary
  }

  const offlineSummary = getOfflineQuoteSummary(ticker)
  if (offlineSummary) {
    return offlineSummary
  }

  console.warn(`Returning empty quote summary for ${ticker}`)
  return createEmptyQuoteSummary()
}

