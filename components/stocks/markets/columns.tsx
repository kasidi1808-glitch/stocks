"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Quote } from "@/types/yahoo-finance"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getDisplayMetrics } from "@/lib/markets/displayMetrics"

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "shortName",
    header: "Title",
    cell: (props) => {
      const { row } = props
      const title = row.getValue("shortName") as string
      const symbol = row.original.symbol

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="font-medium"
        >
          {title}
        </Link>
      )
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: (props) => {
      const { row } = props
      const metrics = getDisplayMetrics(row.original)
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
      const { change } = getDisplayMetrics(row.original)

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
      const { changePercent } = getDisplayMetrics(row.original)

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
