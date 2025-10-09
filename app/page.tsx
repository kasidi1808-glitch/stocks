import { DataTable } from "@/components/stocks/markets/data-table"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PRE_MARKET_INSTRUMENTS,
  REGULAR_MARKET_INSTRUMENTS,
  fetchMarketSnapshot,
} from "@/lib/markets"
import { DEFAULT_INTERVAL, DEFAULT_RANGE } from "@/lib/yahoo-finance/constants"
import type { Interval, Quote } from "@/types/yahoo-finance"
import { Suspense } from "react"
import MarketsChart from "@/components/chart/MarketsChart"
import Link from "next/link"
import { columns } from "@/components/stocks/markets/columns"
import SectorPerformance from "@/components/stocks/SectorPerformance"
import {
  validateInterval,
  validateRange,
} from "@/lib/yahoo-finance/fetchChartData"
import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

function isMarketOpen() {
  const now = new Date()

  // Convert to New York time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }
  const formatter = new Intl.DateTimeFormat([], options)

  const timeString = formatter.format(now)
  const [hour, minute] = timeString.split(":").map(Number)
  const timeInET = hour + minute / 60

  // Get the day of the week in New York time
  const dayInET = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  ).getDay()

  // Check if the current time is between 9:30 AM and 4:00 PM ET on a weekday
  if (dayInET >= 1 && dayInET <= 5 && timeInET >= 9.5 && timeInET < 16) {
    return true
  } else {
    return false
  }
}

function getMarketSentiment(changePercentage: number | undefined) {
  if (!changePercentage) {
    return "neutral"
  }
  if (changePercentage > 0.1) {
    return "bullish"
  } else if (changePercentage < -0.1) {
    return "bearish"
  } else {
    return "neutral"
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    ticker?: string
    range?: string
    interval?: string
  }
}) {
  const instruments = isMarketOpen()
    ? REGULAR_MARKET_INSTRUMENTS
    : PRE_MARKET_INSTRUMENTS

  const ticker = searchParams?.ticker || instruments[0].symbol
  const selectedInstrument = instruments.find(
    (instrument) => instrument.symbol === ticker
  )
  const range = validateRange(searchParams?.range || DEFAULT_RANGE)
  const interval = validateInterval(
    range,
    (searchParams?.interval as Interval) || DEFAULT_INTERVAL
  )
  const news = await fetchStockSearch("^DJI", 1)
  const firstNews = news.news?.[0]

  const marketQuotes: Quote[] = await fetchMarketSnapshot(instruments)

  const marketSentiment = getMarketSentiment(
    marketQuotes[0]?.regularMarketChangePercent ?? undefined
  )

  const sentimentColor =
    marketSentiment === "bullish"
      ? "text-green-500"
      : marketSentiment === "bearish"
        ? "text-red-500"
        : "text-neutral-500"

  const sentimentBackground =
    marketSentiment === "bullish"
      ? "bg-green-500/10"
      : marketSentiment === "bearish"
        ? "bg-red-300/50 dark:bg-red-950/50"
        : "bg-neutral-500/10"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <Card className="relative flex h-full min-h-[15rem] flex-col justify-between overflow-hidden">
            <CardHeader>
              <CardTitle className="z-50 w-fit rounded-full px-4  py-2 font-medium dark:bg-neutral-100/5">
                The markets are{" "}
                <strong className={sentimentColor}>{marketSentiment}</strong>
              </CardTitle>
            </CardHeader>
            {firstNews && firstNews.title && (
              <CardFooter className="flex-col items-start">
                <p className="mb-2 text-sm font-semibold text-neutral-500 dark:text-neutral-500">
                  What you need to know today
                </p>
                <Link
                  prefetch={false}
                  href={firstNews.link}
                  className="text-lg font-extrabold"
                >
                  {firstNews.title}
                </Link>
              </CardFooter>
            )}
            <div
              className={`pointer-events-none absolute inset-0 z-0 h-[65%] w-[65%] -translate-x-[10%] -translate-y-[30%] rounded-full blur-3xl ${sentimentBackground}`}
            />
          </Card>
        </div>
        <div className="w-full lg:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sector Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading...</div>}>
                <SectorPerformance />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <h2 className="py-4 text-xl font-medium">Markets</h2>
        <Card className="flex flex-col gap-4 p-6 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <DataTable columns={columns} data={marketQuotes} />
            </Suspense>
          </div>
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<div>Loading...</div>}>
              <MarketsChart
                ticker={ticker}
                range={range}
                interval={interval}
                displayName={selectedInstrument?.shortName}
              />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  )
}
