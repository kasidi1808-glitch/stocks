"use client"

import { CellContext, ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { resolveCompanyName } from "@/lib/company-names"
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

function formatVolume(value: unknown): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return "N/A"
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
      const symbol = toNonEmptyString(row.symbol)
      const longName = toNonEmptyString(row.longName)
      const shortName = toNonEmptyString(row.shortName)

      return (
        resolveCompanyName(symbol, longName, shortName) ??
        longName ??
        shortName ??
        symbol ??
        row.symbol
      )
    },
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

      if (
        regularMarketPrice === null ||
        epsTrailingTwelveMonths === null ||
        epsTrailingTwelveMonths === 0
      ) {
        return <div className="text-right">N/A</div>
      }

      const pe = regularMarketPrice / epsTrailingTwelveMonths
      if (!Number.isFinite(pe) || pe < 0) {
        return <div className="text-right">N/A</div>
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
      const price = toNumber(row.getValue("regularMarketPrice"))

      if (price === null) {
        return <div className="text-right">N/A</div>
      }

      return <div className="text-right">{price.toFixed(2)}</div>
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
          <div className="flex justify-end">
            <div className="text-right text-muted-foreground">N/A</div>
          </div>
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
      const marketChangePercent = toNumber(
        row.getValue("regularMarketChangePercent")
      )

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

      return <div className="text-right">{formattedVolume}</div>
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

      return <div className="text-right">{formattedVolume}</div>
    },
  },
  {
    accessorKey: "marketCap",
    meta: "Market Cap",
    header: () => <div className="text-right">Market Cap</div>,
    cell: (props: CellContext<ScreenerQuote, unknown>) => {
      const { row } = props
      const formattedMarketCap = formatVolume(row.getValue("marketCap"))

      return <div className="text-right">{formattedMarketCap}</div>
    },
  },
]
