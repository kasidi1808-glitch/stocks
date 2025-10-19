"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { resolveCompanyName } from "@/lib/company-names"
import type { ScreenerQuote } from "@/types/yahoo-finance"
import {
  type QuoteDisplayMetrics,
  getDisplayMetrics as resolveQuoteMetrics,
} from "@/lib/markets/displayMetrics"
import Link from "next/link"

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return null
}

function formatNumber(value: unknown, fractionDigits = 2): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return "—"
  }

  return numeric.toFixed(fractionDigits)
}

function formatVolume(value: unknown): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return "—"
  }

  if (numeric >= 1_000_000_000_000) {
    return `${(numeric / 1_000_000_000_000).toFixed(3)}T`
  }

  if (numeric >= 1_000_000_000) {
    return `${(numeric / 1_000_000_000).toFixed(3)}B`
  }

  if (numeric >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(3)}M`
  }

  return numeric.toLocaleString()
}

function resolveDisplayMetrics(quote: ScreenerQuote): QuoteDisplayMetrics {
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

  return {
    ...resolveQuoteMetrics({
      symbol: quote.symbol,
      regularMarketPrice: toNumber(quote.regularMarketPrice),
      regularMarketChange: toNumber(quote.regularMarketChange),
      regularMarketChangePercent: toNumber(quote.regularMarketChangePercent),
      postMarketPrice: null,
      postMarketChange: null,
      postMarketChangePercent: null,
      preMarketPrice: null,
      preMarketChange: null,
      preMarketChangePercent: null,
      hasPrePostMarketData: false,
    }),
  }
}

export const columns: ColumnDef<ScreenerQuote>[] = [
  {
    accessorKey: "symbol",
    meta: "Symbol",
    header: "Symbol",
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const symbol: string = row.getValue("symbol")
      return (
        <Link
          prefetch={false}
          href={`/stocks/${symbol}`}
          className="font-bold text-blue-500 hover:underline"
        >
          {symbol}
        </Link>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "shortName",
    meta: "Company",
    header: "Company",
  },
  {
    accessorKey: "P/E",
    meta: "P/E",
    sortUndefined: -1,
    header: ({ column }) => {
      return <div className="text-right">P/E</div>
    },
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props

      const trailingPe = toNumber(row.original.trailingPE)
      if (trailingPe !== null && trailingPe > 0) {
        return <div className="text-right">{trailingPe.toFixed(2)}</div>
      }

      const regularMarketPrice = toNumber(row.original.regularMarketPrice)
      const epsTrailingTwelveMonths = toNumber(
        row.original.epsTrailingTwelveMonths
      )

      if (price === null || eps === null || eps <= 0) {
        return <div className="text-right text-muted-foreground">—</div>
      }

      const pe = price / eps

      if (!Number.isFinite(pe) || pe <= 0) {
        return <div className="text-right text-muted-foreground">—</div>
      }

      return <div className="text-right">{pe.toFixed(2)}</div>
    },
  },
  {
    accessorKey: "regularMarketPrice",
    meta: "Price",
    header: () => <div className="text-right">Price</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const metrics = resolveDisplayMetrics(row.original)
      const { price, source } = metrics

      if (typeof price === "number") {
        return (
          <div className="text-right">
            {price.toFixed(2)}
            {source !== "regular" && (
              <span className="ml-1 text-xs uppercase text-muted-foreground">
                {source === "post" ? "Post" : "Pre"}
              </span>
            )}
          </div>
        )
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketChange",
    meta: "Change ($)",
    header: () => <div className="text-right">Change</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const { change: marketChange } = resolveDisplayMetrics(row.original)

      if (marketChange === null) {
        return (
          <div className="text-right text-muted-foreground">—</div>
        )
      }

      return (
        <div className="flex justify-end">
          <div
            className={cn(
              "text-right",
              marketChange > 0
                ? "text-green-800 dark:text-green-400"
                : "text-red-800 dark:text-red-500"
            )}
          >
            {marketChange > 0 ? "+" : ""}
            {marketChange.toFixed(2)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketChangePercent",
    meta: "Change (%)",
    header: () => <div className="text-right">% Change</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const { changePercent: marketChangePercent } = resolveDisplayMetrics(
        row.original
      )

      if (marketChangePercent === null) {
        return (
          <div className="flex justify-end">
            <div className="w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right text-muted-foreground">
              —
            </div>
          </div>
        )
      }

      const sign = marketChangePercent > 0 ? "+" : ""
      return (
        <div className="flex justify-end">
          <div
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right",
              marketChangePercent === null
                ? "bg-muted text-muted-foreground"
                : marketChangePercent > 0
                  ? "bg-green-300 text-green-800 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-300 text-red-800 dark:bg-red-950 dark:text-red-500"
            )}
          >
            {marketChangePercent !== null && marketChangePercent > 0 ? "+" : ""}
            {marketChangePercent !== null
              ? marketChangePercent.toFixed(2)
              : "N/A"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketVolume",
    meta: "Volume",
    header: () => <div className="text-right">Volume</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const formattedVolume = formatVolume(row.getValue("regularMarketVolume"))

      return (
        <div
          className={cn(
            "text-right",
            formattedVolume === "—" && "text-muted-foreground"
          )}
        >
          {formattedVolume}
        </div>
      )
    },
  },
  {
    accessorKey: "averageDailyVolume3Month",
    meta: "Avg Volume",
    header: () => <div className="text-right">Avg Volume</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const formattedVolume = formatVolume(
        row.getValue("averageDailyVolume3Month")
      )

      return (
        <div
          className={cn(
            "text-right",
            formattedVolume === "—" && "text-muted-foreground"
          )}
        >
          {formattedVolume}
        </div>
      )
    },
  },
  {
    accessorKey: "marketCap",
    meta: "Market Cap",
    header: () => <div className="text-right">Market Cap</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const formattedMarketCap = formatVolume(row.getValue("marketCap"))

      return (
        <div
          className={cn(
            "text-right",
            formattedMarketCap === "—" && "text-muted-foreground"
          )}
        >
          {formattedMarketCap}
        </div>
      )
    },
  },
]
