import { fetchQuotesBatch } from "@/lib/yahoo-finance/fetchQuote"
import { cn } from "@/lib/utils"

interface Sector {
  sector: string
  changesPercentage: number | null
}

const SECTOR_ETFS = [
  { sector: "Communication Services", symbol: "XLC" },
  { sector: "Consumer Cyclical", symbol: "XLY" },
  { sector: "Consumer Defensive", symbol: "XLP" },
  { sector: "Energy", symbol: "XLE" },
  { sector: "Financial Services", symbol: "XLF" },
  { sector: "Healthcare", symbol: "XLV" },
  { sector: "Industrials", symbol: "XLI" },
  { sector: "Real Estate", symbol: "XLRE" },
  { sector: "Technology", symbol: "XLK" },
  { sector: "Utilities", symbol: "XLU" },
]

const FALLBACK_SECTOR_PERFORMANCE: Sector[] = SECTOR_ETFS.map((sector) => ({
  sector: sector.sector,
  changesPercentage: null,
}))

async function fetchSectorPerformance(): Promise<Sector[]> {
  try {
    const symbols = SECTOR_ETFS.map((item) => item.symbol)
    const quotes = await fetchQuotesBatch(symbols)

    const sectors = SECTOR_ETFS.map(({ sector, symbol }) => {
      const quote = quotes.get(symbol)
      const changePercent =
        typeof quote?.regularMarketChangePercent === "number"
          ? quote.regularMarketChangePercent
          : null

      return {
        sector,
        changesPercentage: changePercent,
      }
    })

    const hasLiveData = sectors.some(
      (item) => typeof item.changesPercentage === "number"
    )

    if (!hasLiveData) {
      return FALLBACK_SECTOR_PERFORMANCE
    }

    return sectors
  } catch (error) {
    console.warn("Failed to load Yahoo Finance sector performance", error)
    return FALLBACK_SECTOR_PERFORMANCE
  }
}

export default async function SectorPerformance() {
  const data = await fetchSectorPerformance()

  if (!data || data.length === 0) {
    return null
  }

  const parsedChanges = data
    .map((sector) => sector.changesPercentage)
    .filter((value): value is number => typeof value === "number")

  const totalChangePercentage = parsedChanges.reduce((total, value) => {
    return total + value
  }, 0)

  const averageChangePercentage =
    parsedChanges.length > 0
      ? totalChangePercentage / parsedChanges.length
      : null

  const allSectors = {
    sector: "All sectors",
    changesPercentage: averageChangePercentage,
  }
  const sectorsWithAggregate = [allSectors, ...data]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sectorsWithAggregate.map((sector: Sector) => {
        const numericChange = sector.changesPercentage
        const isFiniteChange = typeof numericChange === "number"
        const formattedChange = isFiniteChange
          ? `${numericChange.toFixed(2)}%`
          : "—"
        const isPositive = isFiniteChange && numericChange > 0
        const isNegative = isFiniteChange && numericChange < 0

        return (
          <div
            key={sector.sector}
            className="flex w-full flex-row items-center justify-between text-sm"
          >
            <span className="font-medium">{sector.sector}</span>
            <span
              className={cn(
                "w-[4rem] min-w-fit rounded-md px-2 py-0.5 text-right transition-colors",
                isPositive
                  ? "bg-gradient-to-l from-green-300 text-green-800 dark:from-green-950 dark:text-green-400"
                  : isNegative
                    ? "bg-gradient-to-l from-red-300 text-red-800 dark:from-red-950 dark:text-red-500"
                    : "bg-muted text-muted-foreground dark:bg-muted/30"
              )}
            >
              {formattedChange}
            </span>
          </div>
        )
      })}
    </div>
  )
}
