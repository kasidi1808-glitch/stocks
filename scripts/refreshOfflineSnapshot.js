const fs = require("fs")
const path = require("path")
const vm = require("vm")

const FACTOR = 1.08
const BASE_TIMESTAMP_CODE = "Date.UTC(2025, 0, 17, 20, 0, 0) / 1000"

const PRICE_FIELDS = [
  "regularMarketDayLow",
  "regularMarketDayHigh",
  "regularMarketOpen",
  "fiftyTwoWeekLow",
  "fiftyTwoWeekHigh",
]

function readFile(relativePath) {
  return fs.readFileSync(path.join(__dirname, "..", relativePath), "utf8")
}

function extractObjectLiteral(source, constName) {
  const constIndex = source.indexOf(`const ${constName}`)

  if (constIndex === -1) {
    throw new Error(`Unable to locate ${constName} definition`)
  }

  const equalsIndex = source.indexOf("=", constIndex)
  const openBraceIndex = source.indexOf("{", equalsIndex)

  let depth = 0
  for (let i = openBraceIndex; i < source.length; i += 1) {
    const char = source[i]

    if (char === "{") {
      depth += 1
    } else if (char === "}") {
      depth -= 1

      if (depth === 0) {
        return source.slice(openBraceIndex, i + 1)
      }
    }
  }

  throw new Error(`Unable to extract object literal for ${constName}`)
}

function evaluateQuotes(objectLiteral) {
  const context = { module: { exports: {} } }
  vm.createContext(context)

  const script = new vm.Script(
    `const buildQuote = (quote) => quote;\nmodule.exports = ${objectLiteral};`
  )

  script.runInContext(context)
  return context.module.exports
}

function evaluateSummaries(objectLiteral) {
  const context = { module: { exports: {} } }
  vm.createContext(context)

  const script = new vm.Script(`module.exports = ${objectLiteral};`)
  script.runInContext(context)
  return context.module.exports
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value)
}

function roundPrice(value) {
  if (!isNumber(value)) {
    return null
  }

  const abs = Math.abs(value)
  const digits = abs >= 1 ? 2 : 4
  return Number(value.toFixed(digits))
}

function roundEps(value) {
  if (!isNumber(value)) {
    return null
  }

  return Number(value.toFixed(2))
}

function adjustByFactor(value) {
  if (!isNumber(value)) {
    return null
  }

  return value * FACTOR
}

function computeChange(price, percent) {
  if (!isNumber(price) || !isNumber(percent)) {
    return null
  }

  return roundPrice((price * percent) / 100)
}

function transformQuote(original) {
  const updated = { ...original }

  const newPrice = adjustByFactor(original.regularMarketPrice)
  if (isNumber(newPrice)) {
    updated.regularMarketPrice = roundPrice(newPrice)
  } else {
    updated.regularMarketPrice = null
  }

  if (isNumber(original.trailingPE)) {
    updated.trailingPE = Number(original.trailingPE)
  }

  updated.trailingEps = roundEps(adjustByFactor(original.trailingEps))

  const percent = isNumber(original.regularMarketChangePercent)
    ? original.regularMarketChangePercent
    : null

  if (updated.regularMarketPrice != null && percent != null) {
    updated.regularMarketChange = computeChange(
      updated.regularMarketPrice,
      percent
    )
  } else if (isNumber(original.regularMarketChange)) {
    updated.regularMarketChange = roundPrice(
      adjustByFactor(original.regularMarketChange)
    )
  } else {
    updated.regularMarketChange = null
  }

  if (updated.regularMarketPrice != null) {
    if (updated.regularMarketChange != null) {
      updated.regularMarketPreviousClose = roundPrice(
        updated.regularMarketPrice - updated.regularMarketChange
      )
    } else if (isNumber(original.regularMarketPreviousClose)) {
      updated.regularMarketPreviousClose = roundPrice(
        adjustByFactor(original.regularMarketPreviousClose)
      )
    } else {
      updated.regularMarketPreviousClose = null
    }
  } else if (isNumber(original.regularMarketPreviousClose)) {
    updated.regularMarketPreviousClose = roundPrice(
      adjustByFactor(original.regularMarketPreviousClose)
    )
  } else {
    updated.regularMarketPreviousClose = null
  }

  for (const field of PRICE_FIELDS) {
    if (isNumber(original[field])) {
      updated[field] = roundPrice(adjustByFactor(original[field]))
    } else {
      updated[field] = null
    }
  }

  if (isNumber(original.postMarketPrice)) {
    updated.postMarketPrice = roundPrice(adjustByFactor(original.postMarketPrice))
  } else {
    updated.postMarketPrice = null
  }

  if (isNumber(original.postMarketChangePercent) && updated.postMarketPrice != null) {
    updated.postMarketChange = computeChange(
      updated.postMarketPrice,
      original.postMarketChangePercent
    )
  } else if (isNumber(original.postMarketChange)) {
    updated.postMarketChange = roundPrice(
      adjustByFactor(original.postMarketChange)
    )
  } else {
    updated.postMarketChange = null
  }

  if (isNumber(original.postMarketChangePercent)) {
    updated.postMarketChangePercent = Number(original.postMarketChangePercent)
  } else {
    delete updated.postMarketChangePercent
  }

  if (isNumber(original.preMarketPrice)) {
    updated.preMarketPrice = roundPrice(adjustByFactor(original.preMarketPrice))
  } else {
    updated.preMarketPrice = null
  }

  if (isNumber(original.preMarketChangePercent) && updated.preMarketPrice != null) {
    updated.preMarketChange = computeChange(
      updated.preMarketPrice,
      original.preMarketChangePercent
    )
  } else if (isNumber(original.preMarketChange)) {
    updated.preMarketChange = roundPrice(
      adjustByFactor(original.preMarketChange)
    )
  } else {
    updated.preMarketChange = null
  }

  if (isNumber(original.preMarketChangePercent)) {
    updated.preMarketChangePercent = Number(original.preMarketChangePercent)
  } else {
    delete updated.preMarketChangePercent
  }

  if (isNumber(original.marketCap)) {
    updated.marketCap = Math.round(adjustByFactor(original.marketCap))
  } else {
    updated.marketCap = null
  }

  if (isNumber(original.regularMarketVolume)) {
    updated.regularMarketVolume = Math.round(original.regularMarketVolume)
  } else {
    updated.regularMarketVolume = null
  }

  if (isNumber(original.averageDailyVolume3Month)) {
    updated.averageDailyVolume3Month = Math.round(
      original.averageDailyVolume3Month
    )
  } else {
    updated.averageDailyVolume3Month = null
  }

  if (!isNumber(original.trailingPE)) {
    delete updated.trailingPE
  }

  if (!isNumber(original.trailingEps)) {
    updated.trailingEps = null
  }

  return updated
}

function formatQuoteEntry(symbol, quote) {
  const json = JSON.stringify(quote, null, 2).replace(
    /"([A-Za-z0-9_]+)":/g,
    "$1:"
  )
  const bodyLines = json.split("\n").slice(1, -1)
  const formattedBody = bodyLines.map((line) => `    ${line.trim()}`).join("\n")
  return `  "${symbol}": buildQuote({\n${formattedBody}\n  }),`
}

function writeOfflineQuotes(quotes, sourcePath) {
  const header = `import type { Quote } from "@/types/yahoo-finance"\n\nconst BASE_TIMESTAMP = ${BASE_TIMESTAMP_CODE}\n\nconst buildQuote = (quote: Quote): Quote => ({\n  regularMarketTime: BASE_TIMESTAMP,\n  currency: "USD",\n  ...quote,\n})\n\nconst OFFLINE_QUOTES: Record<string, Quote> = {\n`

  const entries = Object.entries(quotes).map(([symbol, quote]) =>
    formatQuoteEntry(symbol, quote)
  )

  const footer = `}\n\nexport function getOfflineQuote(symbol: string): Quote | null {\n  const quote = OFFLINE_QUOTES[symbol]\n\n  if (!quote) {\n    return null\n  }\n\n  return { ...quote }\n}\n\nexport function getOfflineQuotes(symbols: string[]): Map<string, Quote> {\n  const entries = symbols\n    .map((symbol) => [symbol, getOfflineQuote(symbol)] as const)\n    .filter(([, quote]) => quote !== null) as Array<[string, Quote]>\n\n  return new Map(entries)\n}\n\nexport function hasOfflineQuote(symbol: string): boolean {\n  return Boolean(OFFLINE_QUOTES[symbol])\n}\n\nexport const OFFLINE_SYMBOLS = Object.keys(OFFLINE_QUOTES)\n`

  fs.writeFileSync(sourcePath, `${header}${entries.join("\n")}\n${footer}\n`)
}

function updateSummaryFromQuote(summary, quote) {
  if (!summary || !quote) {
    return summary
  }

  const updated = { ...summary }

  if (updated.summaryDetail) {
    const detail = { ...updated.summaryDetail }

    if (detail.open != null && quote.regularMarketOpen != null) {
      detail.open = quote.regularMarketOpen
    }

    if (detail.dayHigh != null && quote.regularMarketDayHigh != null) {
      detail.dayHigh = quote.regularMarketDayHigh
    }

    if (detail.dayLow != null && quote.regularMarketDayLow != null) {
      detail.dayLow = quote.regularMarketDayLow
    }

    if (detail.volume != null && quote.regularMarketVolume != null) {
      detail.volume = quote.regularMarketVolume
    }

    if (detail.trailingPE != null && quote.trailingPE != null) {
      detail.trailingPE = quote.trailingPE
    }

    if (detail.marketCap != null && quote.marketCap != null) {
      detail.marketCap = quote.marketCap
    }

    if (detail.fiftyTwoWeekHigh != null && quote.fiftyTwoWeekHigh != null) {
      detail.fiftyTwoWeekHigh = quote.fiftyTwoWeekHigh
    }

    if (detail.fiftyTwoWeekLow != null && quote.fiftyTwoWeekLow != null) {
      detail.fiftyTwoWeekLow = quote.fiftyTwoWeekLow
    }

    if (detail.averageVolume != null && quote.averageDailyVolume3Month != null) {
      detail.averageVolume = quote.averageDailyVolume3Month
    }

    updated.summaryDetail = detail
  }

  if (updated.defaultKeyStatistics) {
    const stats = { ...updated.defaultKeyStatistics }

    if (stats.trailingEps != null && quote.trailingEps != null) {
      stats.trailingEps = quote.trailingEps
    }

    updated.defaultKeyStatistics = stats
  }

  return updated
}

function writeOfflineSummaries(summaries, quotes, sourcePath) {
  const updatedSummaries = {}
  for (const [symbol, summary] of Object.entries(summaries)) {
    updatedSummaries[symbol] = updateSummaryFromQuote(summary, quotes[symbol])
  }

  const content = JSON.stringify(updatedSummaries, null, 2).replace(
    /"([A-Za-z0-9_]+)":/g,
    "$1:"
  )

  const fileContent = `import type { QuoteSummary } from "@/types/yahoo-finance"\n\nconst OFFLINE_SUMMARIES: Record<string, QuoteSummary> = ${content}\n\nexport function getOfflineQuoteSummary(symbol: string): QuoteSummary | null {\n  const summary = OFFLINE_SUMMARIES[symbol]\n\n  if (!summary) {\n    return null\n  }\n\n  return {\n    summaryDetail: { ...summary.summaryDetail },\n    defaultKeyStatistics: { ...summary.defaultKeyStatistics },\n    summaryProfile: summary.summaryProfile\n      ? { ...summary.summaryProfile }\n      : undefined,\n  }\n}\n`

  fs.writeFileSync(sourcePath, `${fileContent}\n`)
}

function main() {
  const quotesSource = readFile("data/offlineQuotes.ts")
  const summariesSource = readFile("data/offlineQuoteSummaries.ts")

  const quotesLiteral = extractObjectLiteral(quotesSource, "OFFLINE_QUOTES")
  const summariesLiteral = extractObjectLiteral(
    summariesSource,
    "OFFLINE_SUMMARIES"
  )

  const quotes = evaluateQuotes(quotesLiteral)
  const transformedQuotes = {}

  for (const [symbol, quote] of Object.entries(quotes)) {
    transformedQuotes[symbol] = transformQuote(quote)
  }

  writeOfflineQuotes(
    transformedQuotes,
    path.join(__dirname, "..", "data", "offlineQuotes.ts")
  )

  const summaries = evaluateSummaries(summariesLiteral)
  writeOfflineSummaries(
    summaries,
    transformedQuotes,
    path.join(__dirname, "..", "data", "offlineQuoteSummaries.ts")
  )

  console.log("Offline Yahoo Finance snapshot refreshed with updated values.")
}

main()
