#!/usr/bin/env node
const { existsSync, readFileSync, writeFileSync } = require("node:fs")
const path = require("node:path")

const yahooFinance = require("yahoo-finance2").default

const rootDir = path.resolve(__dirname, "..")
const targetPath = path.join(rootDir, "data/yahoo-offline-quotes.json")
const tickersPath = path.join(rootDir, "data/tickers.json")

function loadExistingSymbols() {
  if (!existsSync(targetPath)) {
    return []
  }

  try {
    const existing = JSON.parse(readFileSync(targetPath, "utf8"))
    return Object.keys(existing)
  } catch (error) {
    console.warn("Unable to parse existing offline quotes:", error)
    return []
  }
}

function loadTickerSymbols() {
  if (!existsSync(tickersPath)) {
    return []
  }

  try {
    const tickers = JSON.parse(readFileSync(tickersPath, "utf8"))
    return tickers.map((entry) => entry.ticker).filter(Boolean)
  } catch (error) {
    console.warn("Unable to parse tickers list:", error)
    return []
  }
}

async function fetchQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol)

    return {
      symbol: quote.symbol ?? symbol,
      shortName: quote.shortName ?? null,
      longName: quote.longName ?? null,
      regularMarketPrice: quote.regularMarketPrice ?? null,
      regularMarketChange: quote.regularMarketChange ?? null,
      regularMarketChangePercent: quote.regularMarketChangePercent ?? null,
      regularMarketDayLow: quote.regularMarketDayLow ?? null,
      regularMarketDayHigh: quote.regularMarketDayHigh ?? null,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow ?? null,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh ?? null,
      marketCap: quote.marketCap ?? null,
      regularMarketVolume: quote.regularMarketVolume ?? null,
      averageDailyVolume3Month: quote.averageDailyVolume3Month ?? null,
      regularMarketOpen: quote.regularMarketOpen ?? null,
      regularMarketPreviousClose: quote.regularMarketPreviousClose ?? null,
      trailingEps: quote.trailingEps ?? null,
      trailingPE: quote.trailingPE ?? null,
      currency: quote.currency ?? null,
      regularMarketTime: quote.regularMarketTime ?? null,
    }
  } catch (error) {
    console.warn(`Failed to fetch quote for ${symbol}:`, error.message)
    return null
  }
}

async function main() {
  const symbols = Array.from(
    new Set([...loadExistingSymbols(), ...loadTickerSymbols()])
  ).sort()

  if (symbols.length === 0) {
    console.error("No symbols available to export")
    process.exitCode = 1
    return
  }

  const results = {}

  for (const symbol of symbols) {
    const quote = await fetchQuote(symbol)

    if (quote) {
      results[symbol] = quote
    }
  }

  writeFileSync(targetPath, `${JSON.stringify(results, null, 2)}\n`)
  console.log(`Exported ${Object.keys(results).length} quotes to ${targetPath}`)
}

main().catch((error) => {
  console.error("Unhandled error while exporting offline quotes:", error)
  process.exitCode = 1
})
