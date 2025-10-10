import type { Metadata } from "next"
import AutoRefresh from "@/components/AutoRefresh"
import { columns } from "@/app/screener/components/columns"
import { DataTable } from "@/app/screener/components/data-table"
import { DEFAULT_SCREENER } from "@/lib/yahoo-finance/constants"
import { fetchScreenerResults } from "@/lib/yahoo-finance/fetchScreenerStocks"

export const metadata: Metadata = {
  title: "Finly: Stock screener",
  description: "Find the best stocks to buy now with the Finly stock screener.",
}
export default async function ScreenerPage({
  searchParams,
}: {
  searchParams?: {
    screener?: string
  }
}) {
  const screener = searchParams?.screener || DEFAULT_SCREENER

  const screenerDataResults = await fetchScreenerResults(screener)

  return (
    <div>
      <AutoRefresh intervalMs={45_000} />
      <DataTable columns={columns} data={screenerDataResults.quotes} />
    </div>
  )
}
