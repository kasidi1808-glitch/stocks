"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Quote } from "@/types/yahoo-finance"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: (props) => {
      const { row } = props
      const symbol = row.original.symbol

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="font-semibold"
        >
          {symbol}
        </Link>
      )
    },
  },
  {
    accessorKey: "shortName",
    header: "Company",
    cell: (props) => {
      const { row } = props
      const symbol = row.original.symbol
      const companyName = row.original.longName ?? row.getValue("shortName")

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="font-medium"
        >
          {typeof companyName === "string" && companyName.trim().length > 0
            ? companyName
            : symbol}
        </Link>
      )
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: (props) => {
      const { row } = props
      const price = row.getValue("regularMarketPrice") as number | null

      if (typeof price === "number") {
        return <div className="text-right">{price.toFixed(2)}</div>
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketChange",
    header: () => <div className="text-right">$ Change</div>,
    cell: (props) => {
      const { row } = props
      const change = row.getValue("regularMarketChange") as number | null

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
      const changePercent = row.getValue(
        "regularMarketChangePercent"
      ) as number | null

      if (typeof changePercent === "number") {
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
      }

      return (
        <div className="flex justify-end">
          <div className="w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right text-muted-foreground">
            —
          </div>
        </div>
      )
    },
  },
]
