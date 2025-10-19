import { cn } from "@/lib/utils"
import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData"
import type { Interval, Quote, Range } from "@/types/yahoo-finance"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"
import {
  getDisplayMetrics,
  type QuoteDisplayMetrics,
} from "@/lib/markets/displayMetrics"

function resolveDisplayMetrics(quote: Quote): QuoteDisplayMetrics {
  if (
    Object.prototype.hasOwnProperty.call(quote, "displayPrice") &&
    quote.displayPrice !== undefined
  ) {
    return {
      price: quote.displayPrice ?? null,
      change: quote.displayChange ?? null,
      changePercent: quote.displayChangePercent ?? null,
      source: quote.displaySource ?? "regular",
    }
  }

  return getDisplayMetrics(quote)
}

interface StockGraphProps {
  ticker: string
  range: Range
  interval: Interval
}

const rangeTextMapping = {
  "1d": "",
  "1w": "Past Week",
  "1m": "Past Month",
  "3m": "Past 3 Months",
  "1y": "Past Year",
}

function calculatePriceChange(
  quoteClose: number | null,
  currentPrice: number | null
): number | null {
  if (quoteClose === null || quoteClose === 0 || currentPrice === null) {
    return null
  }

  return ((currentPrice - quoteClose) / quoteClose) * 100
}

export default async function StockChart({
  ticker,
  range,
  interval,
}: StockGraphProps) {
  const [chart, quote] = await Promise.all([
    fetchChartData(ticker, range, interval),
    fetchQuote(ticker),
  ])

  const displayMetrics = resolveDisplayMetrics(quote)
  const displayPrice = displayMetrics.price

  const priceChange =
    chart.quotes.length > 0
      ? calculatePriceChange(
          Number.isFinite(chart.quotes[0].close)
            ? Number(chart.quotes[0].close)
            : null,
          displayPrice ??
            (Number.isFinite(chart.meta.regularMarketPrice)
              ? Number(chart.meta.regularMarketPrice)
              : null)
        )
      : null

  const ChartQuotes = chart.quotes
    .map((quote) => ({
      date: quote.date,
      close: quote.close?.toFixed(2),
    }))
    .filter((quote) => quote.close !== undefined && quote.date !== null)

  return (
    <div className="h-[27.5rem] w-full">
      <div>
        <div className="space-x-1 text-muted-foreground">
          <span className="font-bold text-primary">{quote.symbol}</span>
          <span>·</span>
          <span>
            {quote.fullExchangeName === "NasdaqGS"
              ? "NASDAQ"
              : quote.fullExchangeName}
          </span>
          <span>{quote.shortName}</span>
        </div>

        <div className="flex flex-row items-end justify-between">
          <div className="space-x-1">
            <span className="text-nowrap">
              <span className="text-xl font-bold">
                {quote.currency === "USD" ? "$" : ""}
                {typeof displayPrice === "number"
                  ? displayPrice.toFixed(2)
                  : "N/A"}
              </span>
              {displayMetrics.source !== "regular" && (
                <span className="ml-2 text-xs uppercase text-muted-foreground">
                  {displayMetrics.source === "post" ? "Post-Market" : "Pre-Market"}
                </span>
              )}
              <span className="font-semibold">
                {displayMetrics.change != null && displayMetrics.changePercent != null ? (
                  displayMetrics.change > 0 ? (
                    <span className="text-green-800 dark:text-green-400">
                      +{displayMetrics.change.toFixed(2)} (+
                      {displayMetrics.changePercent.toFixed(2)}%)
                    </span>
                  ) : (
                    <span className="text-red-800 dark:text-red-500">
                      {displayMetrics.change.toFixed(2)} (
                      {displayMetrics.changePercent.toFixed(2)}%)
                    </span>
                  )
                ) : null}
              </span>
            </span>
            <span className="inline space-x-1 font-semibold text-muted-foreground">
              {quote.hasPrePostMarketData && quote.postMarketPrice != null && (
                <>
                  <span>·</span>
                  <span>
                    Post-Market: {quote.currency === "USD" ? "$" : ""}
                    {quote.postMarketPrice.toFixed(2)}
                  </span>
                  <span>
                    {quote.postMarketChange != null &&
                    quote.postMarketChangePercent != null ? (
                      quote.postMarketChange > 0 ? (
                        <span className="text-green-800 dark:text-green-400">
                          +{quote.postMarketChange.toFixed(2)} (+
                          {quote.postMarketChangePercent.toFixed(2)}%)
                        </span>
                      ) : (
                        <span className="text-red-800 dark:text-red-500">
                          {quote.postMarketChange.toFixed(2)} (
                          {quote.postMarketChangePercent.toFixed(2)}%)
                        </span>
                      )
                    ) : null}
                  </span>
                </>
              )}
              {quote.hasPrePostMarketData && quote.preMarketPrice != null && (
                <>
                  <span>·</span>
                  <span>
                    Pre-Market: {quote.currency === "USD" ? "$" : ""}
                    {quote.preMarketPrice.toFixed(2)}
                  </span>
                  <span>
                    {quote.preMarketChange != null &&
                    quote.preMarketChangePercent != null ? (
                      quote.preMarketChange > 0 ? (
                        <span className="text-green-800 dark:text-green-400">
                          +{quote.preMarketChange.toFixed(2)} (+
                          {quote.preMarketChangePercent.toFixed(2)}%)
                        </span>
                      ) : (
                        <span className="text-red-800 dark:text-red-500">
                          {quote.preMarketChange.toFixed(2)} (
                          {quote.preMarketChangePercent.toFixed(2)}%)
                        </span>
                      )
                    ) : null}
                  </span>
                </>
              )}
            </span>
          </div>
          <span className="space-x-1 whitespace-nowrap font-semibold">
            {priceChange !== null && priceChange !== 0 && rangeTextMapping[range] !== "" && (
              <span
                className={cn(
                  priceChange > 0
                    ? "text-green-800 dark:text-green-400"
                    : "text-red-800 dark:text-red-500"
                )}
              >
                {priceChange > 0
                  ? `+${priceChange.toFixed(2)}%`
                  : `${priceChange.toFixed(2)}%`}
              </span>
            )}
            <span className="text-muted-foreground">
              {rangeTextMapping[range]}
            </span>
          </span>
        </div>
      </div>
      {chart.quotes.length === 0 && (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available
        </div>
      )}
      {chart.quotes.length > 0 && (
        <AreaClosedChart chartQuotes={ChartQuotes} range={range} />
      )}
    </div>
  )
}
