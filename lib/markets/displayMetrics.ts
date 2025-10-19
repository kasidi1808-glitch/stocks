import type { Quote } from "@/types/yahoo-finance"

export type QuoteDisplaySource = "regular" | "pre" | "post"

export type QuoteDisplayMetrics = {
  price: number | null
  change: number | null
  changePercent: number | null
  source: QuoteDisplaySource
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function normalizeState(state: string | null | undefined): string | null {
  if (typeof state !== "string") {
    return null
  }

  const trimmed = state.trim()

  return trimmed.length > 0 ? trimmed.toUpperCase() : null
}

function isFresh(timestamp: number | null | undefined, maxAgeSeconds = 60 * 60 * 8) {
  if (!isFiniteNumber(timestamp)) {
    return false
  }

  const nowSeconds = Date.now() / 1000

  return nowSeconds - timestamp <= maxAgeSeconds
}

function computeChange(
  preferredChange: number | null,
  price: number | null,
  referencePrice: number | null
): number | null {
  if (preferredChange !== null) {
    return preferredChange
  }

  if (price === null || referencePrice === null) {
    return null
  }

  return price - referencePrice
}

function computePercent(
  preferredPercent: number | null,
  change: number | null,
  referencePrice: number | null
): number | null {
  if (preferredPercent !== null) {
    return preferredPercent
  }

  if (change === null || referencePrice === null || referencePrice === 0) {
    return null
  }

  return (change / referencePrice) * 100
}

export function getDisplayMetrics(quote: Quote): QuoteDisplayMetrics {
  const state = normalizeState(quote.marketState)

  const regularPrice = isFiniteNumber(quote.regularMarketPrice)
    ? quote.regularMarketPrice
    : null
  const regularChange = isFiniteNumber(quote.regularMarketChange)
    ? quote.regularMarketChange
    : null
  const regularPercent = isFiniteNumber(quote.regularMarketChangePercent)
    ? quote.regularMarketChangePercent
    : null

  const postPrice = isFiniteNumber(quote.postMarketPrice)
    ? quote.postMarketPrice
    : null
  const postChange = isFiniteNumber(quote.postMarketChange)
    ? quote.postMarketChange
    : null
  const postPercent = isFiniteNumber(quote.postMarketChangePercent)
    ? quote.postMarketChangePercent
    : null
  const postTime = isFiniteNumber(quote.postMarketTime) ? quote.postMarketTime : null

  const prePrice = isFiniteNumber(quote.preMarketPrice)
    ? quote.preMarketPrice
    : null
  const preChange = isFiniteNumber(quote.preMarketChange)
    ? quote.preMarketChange
    : null
  const prePercent = isFiniteNumber(quote.preMarketChangePercent)
    ? quote.preMarketChangePercent
    : null
  const preTime = isFiniteNumber(quote.preMarketTime) ? quote.preMarketTime : null

  const prefersPost =
    (state !== null && (state.startsWith("POST") || state.startsWith("AFTER"))) ||
    (state === null && postPrice !== null && isFresh(postTime))

  const prefersPre =
    (state !== null && state.startsWith("PRE")) ||
    (state === null && prePrice !== null && isFresh(preTime))

  if (postPrice !== null && prefersPost) {
    const change = computeChange(postChange, postPrice, regularPrice)
    const percent = computePercent(postPercent, change, regularPrice)

    return {
      price: postPrice,
      change,
      changePercent: percent,
      source: "post",
    }
  }

  if (prePrice !== null && prefersPre) {
    const change = computeChange(preChange, prePrice, regularPrice)
    const percent = computePercent(prePercent, change, regularPrice)

    return {
      price: prePrice,
      change,
      changePercent: percent,
      source: "pre",
    }
  }

  if (regularPrice !== null) {
    return {
      price: regularPrice,
      change: regularChange,
      changePercent: regularPercent,
      source: "regular",
    }
  }

  if (postPrice !== null) {
    const change = computeChange(postChange, postPrice, prePrice ?? regularPrice)
    const percent = computePercent(postPercent, change, prePrice ?? regularPrice)

    return {
      price: postPrice,
      change,
      changePercent: percent,
      source: "post",
    }
  }

  if (prePrice !== null) {
    const change = computeChange(preChange, prePrice, regularPrice)
    const percent = computePercent(prePercent, change, regularPrice)

    return {
      price: prePrice,
      change,
      changePercent: percent,
      source: "pre",
    }
  }

  return {
    price: null,
    change: null,
    changePercent: null,
    source: "regular",
  }
}
