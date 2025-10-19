const fs = require("fs")
const path = require("path")
const vm = require("vm")

const yahooFinance = require("yahoo-finance2").default

const QUOTES_FILE = path.join(__dirname, "..", "data", "offlineQuotes.ts")
const SUMMARIES_FILE = path.join(
  __dirname,
  "..",
  "data",
  "offlineQuoteSummaries.ts"
)

const SUMMARY_MODULES = [
  "summaryDetail",
  "defaultKeyStatistics",
  "summaryProfile",
]

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8")
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

function toNumber(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return null
  }

  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function pickQuoteFields(rawQuote, fallbackQuote = {}) {
  const regularMarketTime = rawQuote?.regularMarketTime
  const regularMarketTimeValue =
    regularMarketTime instanceof Date
      ? Math.floor(regularMarketTime.getTime() / 1000)
      : toNumber(regularMarketTime)

  const base = {
    symbol: rawQuote?.symbol || fallbackQuote.symbol || "",
    shortName:
      rawQuote?.shortName || fallbackQuote.shortName || rawQuote?.symbol || "",
    regularMarketPrice: toNumber(rawQuote?.regularMarketPrice),
    regularMarketChange: toNumber(rawQuote?.regularMarketChange),
    regularMarketChangePercent: toNumber(
      rawQuote?.regularMarketChangePercent
    ),
    regularMarketDayLow: toNumber(rawQuote?.regularMarketDayLow),
    regularMarketDayHigh: toNumber(rawQuote?.regularMarketDayHigh),
    fiftyTwoWeekLow: toNumber(rawQuote?.fiftyTwoWeekLow),
    fiftyTwoWeekHigh: toNumber(rawQuote?.fiftyTwoWeekHigh),
    marketCap: toNumber(rawQuote?.marketCap),
    regularMarketVolume: toNumber(rawQuote?.regularMarketVolume),
    averageDailyVolume3Month: toNumber(rawQuote?.averageDailyVolume3Month),
    regularMarketOpen: toNumber(rawQuote?.regularMarketOpen),
    regularMarketPreviousClose: toNumber(
      rawQuote?.regularMarketPreviousClose
    ),
    trailingEps: toNumber(rawQuote?.trailingEps),
    trailingPE: toNumber(rawQuote?.trailingPE),
    fullExchangeName: rawQuote?.fullExchangeName || null,
    currency: rawQuote?.currency || null,
    regularMarketTime: regularMarketTimeValue,
    postMarketPrice: toNumber(rawQuote?.postMarketPrice),
    postMarketChange: toNumber(rawQuote?.postMarketChange),
    postMarketChangePercent: toNumber(rawQuote?.postMarketChangePercent),
    preMarketPrice: toNumber(rawQuote?.preMarketPrice),
    preMarketChange: toNumber(rawQuote?.preMarketChange),
    preMarketChangePercent: toNumber(rawQuote?.preMarketChangePercent),
    hasPrePostMarketData:
      rawQuote?.postMarketPrice != null || rawQuote?.preMarketPrice != null,
  }

  return base
}

function pickSummaryFields(rawSummary) {
  if (!rawSummary) {
    return null
  }

  const summaryDetail = rawSummary.summaryDetail || {}
  const defaultKeyStatistics = rawSummary.defaultKeyStatistics || {}
  const summaryProfile = rawSummary.summaryProfile || {}

  const normalizedSummary = {}

  if (Object.keys(summaryDetail).length > 0) {
    normalizedSummary.summaryDetail = {
      open: toNumber(summaryDetail.open),
      dayHigh: toNumber(summaryDetail.dayHigh),
      dayLow: toNumber(summaryDetail.dayLow),
      volume: toNumber(summaryDetail.volume),
      trailingPE: toNumber(summaryDetail.trailingPE),
      marketCap: toNumber(summaryDetail.marketCap),
      fiftyTwoWeekHigh: toNumber(summaryDetail.fiftyTwoWeekHigh),
      fiftyTwoWeekLow: toNumber(summaryDetail.fiftyTwoWeekLow),
      averageVolume: toNumber(summaryDetail.averageVolume),
      dividendYield: toNumber(summaryDetail.dividendYield),
      beta: toNumber(summaryDetail.beta),
    }
  }

  if (Object.keys(defaultKeyStatistics).length > 0) {
    normalizedSummary.defaultKeyStatistics = {
      trailingEps: toNumber(defaultKeyStatistics.trailingEps),
    }
  }

  if (Object.keys(summaryProfile).length > 0) {
    normalizedSummary.summaryProfile = {
      longBusinessSummary: summaryProfile.longBusinessSummary || null,
      sector: summaryProfile.sector || null,
      industryDisp: summaryProfile.industryDisp || null,
      country: summaryProfile.country || null,
      fullTimeEmployees: toNumber(summaryProfile.fullTimeEmployees),
      website: summaryProfile.website || null,
    }
  }

  return Object.keys(normalizedSummary).length > 0 ? normalizedSummary : null
}

function formatString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

function formatNumber(value) {
  if (value == null || Number.isNaN(value)) {
    return "null"
  }

  if (Number.isInteger(value)) {
    return String(value)
  }

  return Number(value.toFixed(6)).toString()
}

function formatQuoteRecord(record) {
  const lines = []

  const stringFields = new Set(["symbol", "shortName", "fullExchangeName", "currency"])

  for (const [key, value] of Object.entries(record)) {
    if (value == null) {
      continue
    }

    if (stringFields.has(key)) {
      lines.push(`    ${key}: ${formatString(value)},`)
    } else if (typeof value === "boolean") {
      lines.push(`    ${key}: ${value ? "true" : "false"},`)
    } else {
      lines.push(`    ${key}: ${formatNumber(value)},`)
    }
  }

  return lines.join("\n")
}

function formatQuotes(quotesMap, baseTimestamp) {
  const lines = [
    "import type { Quote } from \"@/types/yahoo-finance\"",
    "",
    `const BASE_TIMESTAMP = ${baseTimestamp}`,
    "",
    "const buildQuote = (quote: Quote): Quote => ({",
    "  regularMarketTime: BASE_TIMESTAMP,",
    "  currency: quote.currency ?? \"USD\",",
    "  ...quote,",
    "})",
    "",
    "const OFFLINE_QUOTES: Record<string, Quote> = {",
  ]

  quotesMap.forEach((quote, symbol) => {
    const body = formatQuoteRecord(quote)
    lines.push(`  \"${symbol}\": buildQuote({`)
    if (body) {
      lines.push(body)
    }
    lines.push("  }),")
  })

  lines.push("}")
  lines.push("")
  lines.push("export function getOfflineQuote(symbol: string): Quote | null {")
  lines.push("  const quote = OFFLINE_QUOTES[symbol]")
  lines.push("")
  lines.push("  if (!quote) {")
  lines.push("    return null")
  lines.push("  }")
  lines.push("")
  lines.push("  return { ...quote }")
  lines.push("}")
  lines.push("")
  lines.push("export function getOfflineQuotes(symbols: string[]): Map<string, Quote> {")
  lines.push("  const entries = symbols")
  lines.push(
    "    .map((symbol) => [symbol, getOfflineQuote(symbol)] as const)"
  )
  lines.push(
    "    .filter(([, quote]) => quote !== null) as Array<[string, Quote]>"
  )
  lines.push("")
  lines.push("  return new Map(entries)")
  lines.push("}")
  lines.push("")
  lines.push("export function hasOfflineQuote(symbol: string): boolean {")
  lines.push("  return Boolean(OFFLINE_QUOTES[symbol])")
  lines.push("}")
  lines.push("")
  lines.push("export const OFFLINE_SYMBOLS = Object.keys(OFFLINE_QUOTES)")
  lines.push("")

  return lines.join("\n")
}

function formatSummaryRecord(record) {
  const lines = []

  if (record.summaryDetail) {
    lines.push("    summaryDetail: {")
    Object.entries(record.summaryDetail).forEach(([key, value]) => {
      if (value == null) {
        return
      }
      lines.push(`      ${key}: ${formatNumber(value)},`)
    })
    lines.push("    },")
  }

  if (record.defaultKeyStatistics) {
    lines.push("    defaultKeyStatistics: {")
    Object.entries(record.defaultKeyStatistics).forEach(([key, value]) => {
      if (value == null) {
        return
      }
      lines.push(`      ${key}: ${formatNumber(value)},`)
    })
    lines.push("    },")
  }

  if (record.summaryProfile) {
    lines.push("    summaryProfile: {")
    Object.entries(record.summaryProfile).forEach(([key, value]) => {
      if (value == null) {
        return
      }
      if (key === "fullTimeEmployees") {
        lines.push(`      ${key}: ${formatNumber(value)},`)
      } else {
        lines.push(`      ${key}: ${formatString(value)},`)
      }
    })
    lines.push("    },")
  }

  return lines.join("\n")
}

function formatSummaries(summariesMap) {
  const lines = [
    "import type { QuoteSummary } from \"@/types/yahoo-finance\"",
    "",
    "const OFFLINE_SUMMARIES: Record<string, QuoteSummary> = {",
  ]

  summariesMap.forEach((summary, symbol) => {
    const body = summary ? formatSummaryRecord(summary) : ""
    lines.push(`  ${symbol}: {`)
    if (body) {
      lines.push(body)
    }
    lines.push("  },")
  })

  lines.push("}")
  lines.push("")
  lines.push("export function getOfflineQuoteSummary(symbol: string): QuoteSummary | null {")
  lines.push("  return OFFLINE_SUMMARIES[symbol] ?? null")
  lines.push("}")
  lines.push("")
  lines.push("export function hasOfflineQuoteSummary(symbol: string): boolean {")
  lines.push("  return Boolean(OFFLINE_SUMMARIES[symbol])")
  lines.push("}")
  lines.push("")
  lines.push("export const OFFLINE_SUMMARY_SYMBOLS = Object.keys(OFFLINE_SUMMARIES)")
  lines.push("")

  return lines.join("\n")
}

async function fetchQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol)
    return quote
  } catch (error) {
    console.warn(`Failed to fetch quote for ${symbol}`, error)
    return null
  }
}

async function fetchQuoteSummary(symbol) {
  try {
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: SUMMARY_MODULES,
    })
    return summary
  } catch (error) {
    console.warn(`Failed to fetch quote summary for ${symbol}`, error)
    return null
  }
}

async function main() {
  const quotesSource = readFile(QUOTES_FILE)
  const quotesLiteral = extractObjectLiteral(quotesSource, "OFFLINE_QUOTES")
  const baseQuotes = evaluateQuotes(quotesLiteral)

  const summariesSource = readFile(SUMMARIES_FILE)
  const summariesLiteral = extractObjectLiteral(
    summariesSource,
    "OFFLINE_SUMMARIES"
  )
  const baseSummaries = evaluateSummaries(summariesLiteral)

  const symbols = Object.keys(baseQuotes)

  const quoteResults = new Map()
  const summaryResults = new Map()

  for (const symbol of symbols) {
    const rawQuote = await fetchQuote(symbol)
    const fallbackQuote = baseQuotes[symbol]
    if (rawQuote) {
      quoteResults.set(symbol, pickQuoteFields(rawQuote, fallbackQuote))
    } else {
      console.warn(`Using fallback quote for ${symbol}`)
      quoteResults.set(symbol, fallbackQuote)
    }

    const rawSummary = await fetchQuoteSummary(symbol)
    if (rawSummary) {
      summaryResults.set(symbol, pickSummaryFields(rawSummary))
    } else {
      console.warn(`Using fallback summary for ${symbol}`)
      summaryResults.set(symbol, baseSummaries[symbol] || null)
    }
  }

  const mostRecentTime = Array.from(quoteResults.values())
    .map((quote) => quote.regularMarketTime)
    .filter((value) => value != null)
    .reduce((latest, value) => Math.max(latest, value), 0)

  const timestampDate = new Date((mostRecentTime || Date.now() / 1000) * 1000)
  const baseTimestamp = `Date.UTC(${timestampDate.getUTCFullYear()}, ${timestampDate.getUTCMonth()}, ${timestampDate.getUTCDate()}, ${timestampDate.getUTCHours()}, ${timestampDate.getUTCMinutes()}, ${timestampDate.getUTCSeconds()}) / 1000`

  const quotesContent = formatQuotes(quoteResults, baseTimestamp)
  fs.writeFileSync(QUOTES_FILE, `${quotesContent}\n`)

  const summariesContent = formatSummaries(summaryResults)
  fs.writeFileSync(SUMMARIES_FILE, `${summariesContent}\n`)

  console.log(
    `Updated offline snapshots for ${symbols.length} symbols at ${timestampDate.toISOString()}`
  )
}

main().catch((error) => {
  console.error("Failed to refresh offline snapshot", error)
  process.exit(1)
})
