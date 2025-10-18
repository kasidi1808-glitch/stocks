import { getOfflineQuoteSummary } from "@/data/offlineQuoteSummaries"
import { getOfflineQuote } from "@/data/offlineQuotes"
import { asFiniteNumber, isFiniteNumber } from "@/lib/utils/numbers"
import type { Quote, QuoteSummary } from "@/types/yahoo-finance"

export function mergeQuoteWithSummary(
  quote: Quote,
  summary?: QuoteSummary | null
): Quote {
  if (!summary) {
    return quote
  }

  const merged: Quote = { ...quote }

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

export function hydratePeFromOfflineData(symbol: string, quote: Quote): Quote {
  let hydrated = quote

  const hasValidPe = () => isFiniteNumber(hydrated.trailingPE) && hydrated.trailingPE > 0
  const hasValidEps = () => isFiniteNumber(hydrated.trailingEps) && hydrated.trailingEps !== 0

  if (hasValidPe() && hasValidEps()) {
    return hydrated
  }

  const offlineSummary = getOfflineQuoteSummary(symbol)
  if (offlineSummary) {
    hydrated = mergeQuoteWithSummary(hydrated, offlineSummary)

    if (hasValidPe() && hasValidEps()) {
      return hydrated
    }
  }

  if (!hasValidEps()) {
    return hydrated
  }

  const offlineQuote = getOfflineQuote(symbol)
  const priceSource = isFiniteNumber(hydrated.regularMarketPrice)
    ? hydrated.regularMarketPrice
    : asFiniteNumber(offlineQuote?.regularMarketPrice)

  if (!isFiniteNumber(priceSource) || priceSource <= 0) {
    return hydrated
  }

  const computedPe = priceSource / (hydrated.trailingEps as number)

  if (Number.isFinite(computedPe) && computedPe > 0) {
    hydrated = { ...hydrated, trailingPE: computedPe }
  }

  return hydrated
}
