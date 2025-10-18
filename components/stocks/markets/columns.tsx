"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Quote } from "@/types/yahoo-finance"
import { cn } from "@/lib/utils"
import Link from "next/link"

const NA_VALUE = "N/A"

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

function formatPrice(value: unknown): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return NA_VALUE
  }

  const fractionDigits = Math.abs(numeric) >= 1 ? 2 : 4

  return numeric.toFixed(fractionDigits)
}

function formatPe(price: unknown, eps: unknown, directPe: unknown): string {
  const trailingPe = toNumber(directPe)

  if (trailingPe !== null && trailingPe > 0) {
    return trailingPe.toFixed(2)
  }

  const priceNumber = toNumber(price)
  const epsNumber = toNumber(eps)

  if (
    priceNumber === null ||
    epsNumber === null ||
    epsNumber === 0 ||
    !Number.isFinite(priceNumber / epsNumber) ||
    priceNumber / epsNumber <= 0
  ) {
    return NA_VALUE
  }

  return (priceNumber / epsNumber).toFixed(2)
}

function formatLargeNumber(value: unknown): string {
  const numeric = toNumber(value)

  if (numeric === null) {
    return NA_VALUE
  }

  const absValue = Math.abs(numeric)

  if (absValue >= 1_000_000_000_000) {
    return `${(numeric / 1_000_000_000_000).toFixed(2)}T`
  }

  if (absValue >= 1_000_000_000) {
    return `${(numeric / 1_000_000_000).toFixed(2)}B`
  }

  if (absValue >= 1_000_000) {
    return `${(numeric / 1_000_000).toFixed(2)}M`
  }

  return numeric.toLocaleString()
}

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "shortName",
    header: "Title",
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
    accessorKey: "trailingPE",
    header: () => <div className="text-right">P/E</div>,
    cell: ({ row }) => {
      const display = formatPe(
        row.original.regularMarketPrice,
        row.original.trailingEps,
        row.original.trailingPE
      )

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
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const display = formatPrice(row.original.regularMarketPrice)

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
    accessorKey: "regularMarketChangePercent",
    header: () => <div className="text-right">% Change</div>,
    cell: ({ row }) => {
      const changePercent = toNumber(row.original.regularMarketChangePercent)

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
  {
    accessorKey: "marketCap",
    header: () => <div className="text-right">Market Cap</div>,
    cell: ({ row }) => {
      const display = formatLargeNumber(row.original.marketCap)

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
