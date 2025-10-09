import { cn } from "@/lib/utils"

interface Sector {
  sector: string
  changesPercentage: string
}

const FALLBACK_SECTOR_PERFORMANCE: Sector[] = [
  { sector: "Communication Services", changesPercentage: "0" },
  { sector: "Consumer Cyclical", changesPercentage: "0" },
  { sector: "Consumer Defensive", changesPercentage: "0" },
  { sector: "Energy", changesPercentage: "0" },
  { sector: "Financial Services", changesPercentage: "0" },
  { sector: "Healthcare", changesPercentage: "0" },
  { sector: "Industrials", changesPercentage: "0" },
  { sector: "Real Estate", changesPercentage: "0" },
  { sector: "Technology", changesPercentage: "0" },
  { sector: "Utilities", changesPercentage: "0" },
]

async function fetchSectorPerformance(): Promise<Sector[] | null> {
  const apiKey = process.env.FMP_API_KEY

  if (!apiKey) {
    console.warn(
      "FMP_API_KEY is not configured; using neutral sector performance data"
    )
    return FALLBACK_SECTOR_PERFORMANCE
  }

  const url = `https://financialmodelingprep.com/api/v3/sector-performance?apikey=${apiKey}`
  const options = {
    method: "GET",
    next: {
      revalidate: 3600,
    },
  }

  try {
    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error(`FMP sector performance request failed: ${res.status}`)
    }

    const data = (await res.json()) as Sector[]

    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_SECTOR_PERFORMANCE
    }

    return data
  } catch (error) {
    console.warn("Failed to fetch sector performance", error)
    return FALLBACK_SECTOR_PERFORMANCE
  }
}

export default async function SectorPerformance() {
  const data = await fetchSectorPerformance()

  if (!data || data.length === 0) {
    return null
  }

  const parsedChanges = data
    .map((sector) => Number.parseFloat(sector.changesPercentage))
    .filter((value) => Number.isFinite(value))

  const totalChangePercentage = parsedChanges.reduce((total, value) => {
    return total + value
  }, 0)

  const averageChangePercentage =
    parsedChanges.length > 0
      ? (totalChangePercentage / parsedChanges.length).toFixed(2) + "%"
      : "0.00%"

  const allSectors = {
    sector: "All sectors",
    changesPercentage: averageChangePercentage,
  }
  const sectorsWithAggregate = [allSectors, ...data]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {sectorsWithAggregate.map((sector: Sector) => {
        const numericChange = Number.parseFloat(sector.changesPercentage)
        const isFiniteChange = Number.isFinite(numericChange)
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
