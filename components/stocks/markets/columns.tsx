"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

export const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: (props) => {
      const { row } = props
      const symbol = row.getValue("symbol") as string

      return (
        <Link
          prefetch={false}
          href={{
            pathname: "/",
            query: { ticker: symbol },
          }}
          className="font-medium"
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
          {symbol}
        </Link>
      )
    },
  },
  {
    accessorKey: "trailingPE",
    header: () => <div className="text-right">P/E</div>,
    cell: (props) => {
      const { row } = props

      const trailingPe = row.original.trailingPE
      if (isFiniteNumber(trailingPe) && trailingPe > 0) {
        return <div className="text-right">{trailingPe.toFixed(2)}</div>
      }

      const price = row.original.regularMarketPrice
      const trailingEps = row.original.trailingEps

      if (
        isFiniteNumber(price) &&
        isFiniteNumber(trailingEps) &&
        trailingEps !== 0
      ) {
        const computed = price / trailingEps

        if (Number.isFinite(computed) && computed > 0) {
          return <div className="text-right">{computed.toFixed(2)}</div>
        }
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: (props) => {
      const { row } = props

      const trailingPe = row.original.trailingPE
      if (isFiniteNumber(trailingPe) && trailingPe > 0) {
        return <div className="text-right">{trailingPe.toFixed(2)}</div>
      }

      const price = row.original.regularMarketPrice
      const trailingEps = row.original.trailingEps

      if (
        isFiniteNumber(price) &&
        isFiniteNumber(trailingEps) &&
        trailingEps !== 0
      ) {
        const computed = price / trailingEps

        if (Number.isFinite(computed) && computed > 0) {
          return <div className="text-right">{computed.toFixed(2)}</div>
        }
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketPrice",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = row.getValue("regularMarketPrice") as number | null

      if (typeof price === "number") {
        return <div className="text-right">{decimalFormatter.format(price)}</div>
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "trailingPE",
    header: () => <div className="text-right">P/E</div>,
    cell: (props) => {
      const { row } = props

      const trailingPe = row.original.trailingPE
      if (isFiniteNumber(trailingPe) && trailingPe > 0) {
        return <div className="text-right">{trailingPe.toFixed(2)}</div>
      }

      const price = row.original.regularMarketPrice
      const trailingEps = row.original.trailingEps

      if (
        isFiniteNumber(price) &&
        isFiniteNumber(trailingEps) &&
        trailingEps !== 0
      ) {
        const computed = price / trailingEps

        if (Number.isFinite(computed) && computed > 0) {
          return <div className="text-right">{computed.toFixed(2)}</div>
        }
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketChange",
    header: () => <div className="text-right">Change</div>,
    cell: ({ row }) => {
      const change = row.getValue("regularMarketChange") as number | null

      if (typeof change === "number") {
        const formattedChange = decimalFormatter.format(Math.abs(change))

        return (
          <div
            className={cn(
              "text-right",
              change < 0 ? "text-red-500" : "text-green-500"
            )}
          >
            {change > 0 ? "+" : change < 0 ? "-" : ""}
            {formattedChange}
          </div>
        )
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "regularMarketChangePercent",
    header: () => <div className="text-right">% Change</div>,
    cell: ({ row }) => {
      const changePercent = row.getValue(
        "regularMarketChangePercent"
      ) as number | null

      if (typeof changePercent === "number") {
        return (
          <div className="flex justify-end">
            <div
              className={cn(
                "w-[4.5rem] min-w-fit rounded-md px-2 py-0.5 text-right",
                changePercent < 0
                  ? "bg-red-300 text-red-800 dark:bg-red-950 dark:text-red-500"
                  : "bg-green-300 text-green-800 dark:bg-green-950 dark:text-green-400"
              )}
            >
              {decimalFormatter.format(changePercent)}%
            </div>
          </div>
        )
      }

      return (
        <div className="flex justify-end">
          <div className="w-[4.5rem] min-w-fit rounded-md px-2 py-0.5 text-right text-muted-foreground">
            —
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "regularMarketVolume",
    header: () => <div className="text-right">Volume</div>,
    cell: ({ row }) => {
      const volume = row.getValue("regularMarketVolume") as number | null

      if (typeof volume === "number") {
        return (
          <div className="text-right">
            {compactNumberFormatter.format(volume)}
          </div>
        )
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "averageDailyVolume3Month",
    header: () => <div className="text-right">Avg Volume</div>,
    cell: ({ row }) => {
      const averageVolume = row.getValue(
        "averageDailyVolume3Month"
      ) as number | null

      if (typeof averageVolume === "number") {
        return (
          <div className="text-right">
            {compactNumberFormatter.format(averageVolume)}
          </div>
        )
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
  {
    accessorKey: "marketCap",
    header: () => <div className="text-right">Market Cap</div>,
    cell: ({ row }) => {
      const marketCap = row.getValue("marketCap") as number | null

      if (typeof marketCap === "number") {
        return (
          <div className="text-right">
            {compactNumberFormatter.format(marketCap)}
          </div>
        )
      }

      return <div className="text-right text-muted-foreground">—</div>
    },
  },
]
