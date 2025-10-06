import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import { fetchFmpQuote } from "@/lib/fmp/quotes"

export async function fetchQuote(ticker: string) {
  noStore()

  try {
    const response = await yahooFinance.quote(ticker)

    return response
  } catch (error) {
    console.log("Failed to fetch stock quote", error)

    try {
      return await fetchFmpQuote(ticker)
    } catch (fallbackError) {
      console.log("Fallback quote fetch failed", fallbackError)
      throw new Error("Failed to fetch stock quote.")
    }
  }
}
