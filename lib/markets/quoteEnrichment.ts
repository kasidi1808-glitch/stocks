import { getOfflineQuoteSummary } from "@/data/offlineQuoteSummaries"
import { getOfflineQuote } from "@/data/offlineQuotes"
import { asFiniteNumber, isFiniteNumber } from "@/lib/utils/numbers"
import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

function assignNumberIfMissing(
  target: Quote,
  key: keyof Quote,
  value: unknown
) {
  const numericValue = asFiniteNumber(value)

  if (!isFiniteNumber(numericValue)) {
    return
  }

  const current = target[key] as unknown

  if (!isFiniteNumber(current)) {
    ;(target as Record<string, unknown>)[key as string] = numericValue
  }
}

function assignStringIfMissing(
  target: Quote,
  key: keyof Quote,
  value: unknown
) {
  if (typeof value !== "string") {
    return
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return
  }

  const current = target[key]

  if (typeof current !== "string" || !current.trim()) {
    ;(target as Record<string, unknown>)[key as string] = trimmed
  }
}

export function mergeQuoteWithSummary(
  quote: Quote,
  summary?: QuoteSummary | null
): Quote {
  if (!summary) {
    return quote
  }

  const merged: Quote = { ...quote }

  assignNumberIfMissing(
    merged,
    "regularMarketOpen",
    summary.summaryDetail?.open
  )
  assignNumberIfMissing(
    merged,
    "regularMarketDayHigh",
    summary.summaryDetail?.dayHigh
  )
  assignNumberIfMissing(
    merged,
    "regularMarketDayLow",
    summary.summaryDetail?.dayLow
  )
  assignNumberIfMissing(
    merged,
    "regularMarketVolume",
    summary.summaryDetail?.volume
  )
  assignNumberIfMissing(
    merged,
    "averageDailyVolume3Month",
    summary.summaryDetail?.averageVolume
  )
  assignNumberIfMissing(
    merged,
    "fiftyTwoWeekHigh",
    summary.summaryDetail?.fiftyTwoWeekHigh
  )
  assignNumberIfMissing(
    merged,
    "fiftyTwoWeekLow",
    summary.summaryDetail?.fiftyTwoWeekLow
  )
  assignNumberIfMissing(
    merged,
    "marketCap",
    summary.summaryDetail?.marketCap
  )

  const summaryPe = asFiniteNumber(summary.summaryDetail?.trailingPE)
  if (isFiniteNumber(summaryPe) && summaryPe > 0) {
    merged.trailingPE = summaryPe
  }

  const summaryEps = asFiniteNumber(summary.defaultKeyStatistics?.trailingEps)
  if (isFiniteNumber(summaryEps)) {
    merged.trailingEps = summaryEps
  }

  return merged
}

export function hydrateQuoteFromOfflineData(symbol: string, quote: Quote): Quote {
  let hydrated: Quote = { ...quote }

  const offlineQuote = getOfflineQuote(symbol)

  if (offlineQuote) {
    assignStringIfMissing(hydrated, "shortName", offlineQuote.shortName)
    assignStringIfMissing(hydrated, "fullExchangeName", offlineQuote.fullExchangeName)
    assignStringIfMissing(hydrated, "currency", offlineQuote.currency)

    assignNumberIfMissing(
      hydrated,
      "regularMarketPrice",
      offlineQuote.regularMarketPrice
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketChange",
      offlineQuote.regularMarketChange
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketChangePercent",
      offlineQuote.regularMarketChangePercent
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketDayHigh",
      offlineQuote.regularMarketDayHigh
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketDayLow",
      offlineQuote.regularMarketDayLow
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketOpen",
      offlineQuote.regularMarketOpen
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketPreviousClose",
      offlineQuote.regularMarketPreviousClose
    )
    assignNumberIfMissing(
      hydrated,
      "regularMarketVolume",
      offlineQuote.regularMarketVolume
    )
    assignNumberIfMissing(
      hydrated,
      "averageDailyVolume3Month",
      offlineQuote.averageDailyVolume3Month
    )
    assignNumberIfMissing(hydrated, "marketCap", offlineQuote.marketCap)
    assignNumberIfMissing(
      hydrated,
      "fiftyTwoWeekHigh",
      offlineQuote.fiftyTwoWeekHigh
    )
    assignNumberIfMissing(
      hydrated,
      "fiftyTwoWeekLow",
      offlineQuote.fiftyTwoWeekLow
    )
  }

  const offlineSummary = getOfflineQuoteSummary(symbol)
  if (offlineSummary) {
    hydrated = mergeQuoteWithSummary(hydrated, offlineSummary)
  }

  const hasValidPe = () =>
    isFiniteNumber(hydrated.trailingPE) && (hydrated.trailingPE as number) > 0
  const hasValidEps = () =>
    isFiniteNumber(hydrated.trailingEps) && (hydrated.trailingEps as number) !== 0

  if (!hasValidEps() && offlineQuote) {
    assignNumberIfMissing(hydrated, "trailingEps", offlineQuote.trailingEps)
  }

  if (!hasValidPe() && offlineQuote) {
    assignNumberIfMissing(hydrated, "trailingPE", offlineQuote.trailingPE)
  }

  if (hasValidPe() && hasValidEps()) {
    return hydrated
  }

  const priceSource = asFiniteNumber(hydrated.regularMarketPrice)
    ?? asFiniteNumber(offlineQuote?.regularMarketPrice)

  if (!isFiniteNumber(priceSource) || priceSource <= 0 || !hasValidEps()) {
    return hydrated
  }

  const computedPe = priceSource / (hydrated.trailingEps as number)

  if (Number.isFinite(computedPe) && computedPe > 0) {
    hydrated = { ...hydrated, trailingPE: computedPe }
  }

  return hydrated
}
