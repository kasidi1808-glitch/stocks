"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import type { ScreenerQuote } from "@/types/yahoo-finance"
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

const NA_VALUE = "N/A"

function toNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null
}

export const COMPANY_COLUMN_ID = "company"

function formatNumber(value: unknown, fractionDigits = 2): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return NA_VALUE
  }

  return numeric.toFixed(fractionDigits)
}

function formatVolume(value: unknown): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return NA_VALUE
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
    id: COMPANY_COLUMN_ID,
    accessorFn: (row) => {
      return (
        toNonEmptyString(row.longName) ??
        toNonEmptyString(row.shortName) ??
        row.symbol
      )
    },
    meta: "Company",
    header: "Company",
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const { longName, shortName, symbol } = row.original
      const displayName =
        toNonEmptyString(longName) ??
        toNonEmptyString(shortName) ??
        toNonEmptyString(symbol)

      if (displayName) {
        return displayName
      }

      return <span className="text-muted-foreground">{NA_VALUE}</span>
    },
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

      const price = toNumber(row.original.regularMarketPrice)
      const eps = toNumber(row.original.epsTrailingTwelveMonths)

      if (price === null || eps === null || eps <= 0) {
        return (
          <div className="text-right text-muted-foreground">{NA_VALUE}</div>
        )
      }

      const pe = price / eps

      if (!Number.isFinite(pe) || pe <= 0) {
        return (
          <div className="text-right text-muted-foreground">{NA_VALUE}</div>
        )
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
      const formattedPrice = formatNumber(row.getValue("regularMarketPrice"))

      return (
        <div
          className={cn(
            "text-right",
            formattedPrice === NA_VALUE && "text-muted-foreground"
          )}
        >
          {formattedPrice}
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketChange",
    meta: "Change ($)",
    header: () => <div className="text-right">Change</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const marketChange = toNumber(row.getValue("regularMarketChange"))

      if (marketChange === null) {
        return (
          <div className="text-right text-muted-foreground">{NA_VALUE}</div>
        )
      }

      const sign = marketChange > 0 ? "+" : ""
      return (
        <div className="flex justify-end">
          <div
            className={cn(
              "text-right",
              marketChange > 0
                ? "text-green-800 dark:text-green-400"
                : marketChange < 0
                  ? "text-red-800 dark:text-red-500"
                  : "text-muted-foreground"
            )}
          >
            {sign}
            {Math.abs(marketChange).toFixed(2)}
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
      const marketChangePercent = toNumber(
        row.getValue("regularMarketChangePercent")
      )

      if (marketChangePercent === null) {
        return (
          <div className="flex justify-end">
            <div className="w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right text-muted-foreground">
              {NA_VALUE}
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
              marketChangePercent > 0
                ? "bg-green-300 text-green-800 dark:bg-green-950 dark:text-green-400"
                : marketChangePercent < 0
                  ? "bg-red-300 text-red-800 dark:bg-red-950 dark:text-red-500"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {sign}
            {Math.abs(marketChangePercent).toFixed(2)}
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
            formattedVolume === NA_VALUE && "text-muted-foreground"
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
            formattedVolume === NA_VALUE && "text-muted-foreground"
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
            formattedMarketCap === NA_VALUE && "text-muted-foreground"
          )}
        >
          {formattedMarketCap}
        </div>
      )
    },
  },
]
