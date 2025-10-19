"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
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

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: (props) => {
      const { row } = props
      const symbol = row.original.symbol
      const name =
        (typeof row.original.shortName === "string" &&
        row.original.shortName.trim() !== ""
          ? row.original.shortName
          : symbol) ?? symbol

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="flex flex-col font-medium"
        >
          <span>{name}</span>
          {symbol && (
            <span className="text-xs text-muted-foreground">{symbol}</span>
          )}
        </Link>
      )
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: (props) => {
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
    header: () => <div className="text-right">$ Change</div>,
    cell: (props) => {
      const { row } = props
      const { change } = resolveDisplayMetrics(row.original)

      if (typeof change === "number") {
        return (
          <div
            className={cn(
              "text-right",
              change < 0 ? "text-red-500" : "text-green-500"
            )}
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(2)}
          </div>
        )
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketChangePercent",
    header: () => <div className="text-right">% Change</div>,
    cell: (props) => {
      const { row } = props
      const { changePercent } = resolveDisplayMetrics(row.original)

      if (changePercent === null) {
        return (
          <div className="flex justify-end">
            <div className="w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right text-muted-foreground">
              {NA_VALUE}
            </div>
          </div>
        )
      }

      return (
        <div className="flex justify-end">
          <div
            className={cn(
              "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right",
              changePercent < 0
                ? "bg-red-300 text-red-800 dark:bg-red-950 dark:text-red-500"
                : "bg-green-300 text-green-800 dark:bg-green-950 dark:text-green-400"
            )}
          >
            {changePercent.toFixed(2)}%
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketVolume",
    header: () => <div className="text-right">Volume</div>,
    cell: ({ row }) => {
      const display = formatLargeNumber(row.original.regularMarketVolume)

      return (
        <div
          className={cn(
            "text-right",
            display === NA_VALUE && "text-muted-foreground"
          )}
        >
          {display}
        </div>
      )
    },
  },
  {
    accessorKey: "averageDailyVolume3Month",
    header: () => <div className="text-right">Avg Volume</div>,
    cell: ({ row }) => {
      const display = formatLargeNumber(row.original.averageDailyVolume3Month)

      return (
        <div
          className={cn(
            "text-right",
            display === NA_VALUE && "text-muted-foreground"
          )}
        >
          {display}
        </div>
      )
    },
  },
]
