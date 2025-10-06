import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import { fetchFmpQuoteSummary } from "@/lib/fmp/quoteSummary"

export async function fetchQuoteSummary(ticker: string) {
  noStore()

  try {
    const response = await yahooFinance.quoteSummary(ticker, {
      modules: ["summaryDetail", "defaultKeyStatistics", "summaryProfile"],
    })

    return response
  } catch (error) {
    console.log("Failed to fetch quote summary", error)

    try {
      return await fetchFmpQuoteSummary(ticker)
    } catch (fallbackError) {
      console.log("Fallback quote summary fetch failed", fallbackError)
      throw new Error("Failed to fetch quote summary.")
    }
  }
}
