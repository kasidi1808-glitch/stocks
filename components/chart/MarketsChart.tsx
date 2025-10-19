import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData"
import type { Interval, Range } from "@/types/yahoo-finance"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

export default async function MarketsChart({
  ticker,
  range,
  interval,
  displayName,
}: {
  ticker: string
  range: Range
  interval: Interval
  displayName?: string
}) {
  const [chart, quote] = await Promise.all([
    fetchChartData(ticker, range, interval),
    fetchQuote(ticker),
  ])

  type ChartPoint = {
    date: Date | string | number
    close: number
  }

  const stockQuotes: ChartPoint[] = []

  if (Array.isArray(chart.quotes)) {
    for (const chartQuote of chart.quotes) {
      if (chartQuote.date == null || typeof chartQuote.close !== "number") {
        continue
      }

      stockQuotes.push({
        date: chartQuote.date,
        close: Number(chartQuote.close.toFixed(2)),
      })
    }
  }

  const normalizedMarketPrice =
    typeof quote.regularMarketPrice === "number"
      ? Number(quote.regularMarketPrice.toFixed(2))
      : null

  if (
    normalizedMarketPrice !== null &&
    (stockQuotes.length === 0 ||
      Math.abs(stockQuotes[stockQuotes.length - 1].close - normalizedMarketPrice) >= 0.01)
  ) {
    const timestamp =
      typeof quote.regularMarketTime === "number"
        ? new Date(quote.regularMarketTime * 1000)
        : new Date()

    stockQuotes.push({
      date: timestamp,
      close: normalizedMarketPrice,
    })
  }

  const displayPrice =
    normalizedMarketPrice ?? stockQuotes[stockQuotes.length - 1]?.close ?? null

  return (
    <>
      <div className="mb-0.5 font-medium">
        {displayName ?? quote.shortName} ({quote.symbol}){" "}
        {displayPrice !== null
          ? displayPrice.toLocaleString(undefined, {
              style: "currency",
              currency: quote.currency ?? undefined,
            })
          : "N/A"}
      </div>
      {stockQuotes.length > 0 ? (
        <AreaClosedChart chartQuotes={stockQuotes} range={range} />
      ) : (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available
        </div>
      )}
    </>
  )
}
