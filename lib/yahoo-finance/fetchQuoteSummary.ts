import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import type { QuoteSummary } from "@/types/yahoo-finance"

function createEmptyQuoteSummary(): QuoteSummary {
  return {
    summaryDetail: {},
    defaultKeyStatistics: {},
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

async function fetchQuoteSummaryFromYahoo(
  ticker: string
): Promise<QuoteSummary | null> {
  try {
    const response = (await yahooFinance.quoteSummary(ticker, {
      modules: ["summaryDetail", "defaultKeyStatistics", "summaryProfile"],
    })) as QuoteSummary

    return response
  } catch (error) {
    console.warn(`Failed to fetch quote summary for ${ticker}`, error)
    return null
  }
}

export async function fetchQuoteSummary(ticker: string): Promise<QuoteSummary> {
  noStore()

  const fmpQuoteSummary = await fetchQuoteSummaryFromFmp(ticker)
  if (fmpQuoteSummary) {
    return fmpQuoteSummary
  }

  const yahooQuoteSummary = await fetchQuoteSummaryFromYahoo(ticker)
  if (yahooQuoteSummary) {
    return yahooQuoteSummary
  }

  console.warn(`Returning empty quote summary for ${ticker}`)
  return createEmptyQuoteSummary()
}
