import curatedNames from "@/data/company-names.json"
import tickers from "@/data/tickers.json"

type NameLike = string | null | undefined

type QuoteWithNames = {
  symbol?: NameLike
  shortName?: NameLike
  longName?: NameLike
}

function normalizeSymbolKey(symbol: NameLike): string | null {
  if (typeof symbol !== "string") {
    return null
  }

  const trimmed = symbol.trim()

  if (!trimmed) {
    return null
  }

  return trimmed.toUpperCase()
}

function normalizeNameCandidate(value: NameLike): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  return trimmed
}

const COMPANY_NAME_MAP = new Map<string, string>()

function registerCompanyName(symbol: string, name: string) {
  const normalizedName = normalizeNameCandidate(name)
  const symbolKey = normalizeSymbolKey(symbol)

  if (!normalizedName || !symbolKey) {
    return
  }

  if (!COMPANY_NAME_MAP.has(symbolKey)) {
    COMPANY_NAME_MAP.set(symbolKey, normalizedName)
  }

  const altSymbols = new Set<string>()

  if (symbolKey.includes("-")) {
    altSymbols.add(symbolKey.replace(/-/g, "."))
  }

  if (symbolKey.includes(".")) {
    altSymbols.add(symbolKey.replace(/\./g, "-"))
  }

  altSymbols.forEach((alt) => {
    if (!COMPANY_NAME_MAP.has(alt)) {
      COMPANY_NAME_MAP.set(alt, normalizedName)
    }
  })
}

for (const [symbol, name] of Object.entries(curatedNames)) {
  registerCompanyName(symbol, name)
}

for (const entry of tickers) {
  registerCompanyName(entry.ticker, entry.title)
}

function getMappedCompanyName(symbol: NameLike): string | null {
  const symbolKey = normalizeSymbolKey(symbol)

  if (!symbolKey) {
    return null
  }

  return COMPANY_NAME_MAP.get(symbolKey) ?? null
}

export function resolveCompanyName(
  symbol: NameLike,
  ...candidates: NameLike[]
): string | null {
  const mapped = getMappedCompanyName(symbol)

  if (mapped) {
    return mapped
  }

  const symbolKey = normalizeSymbolKey(symbol)

  for (const candidate of candidates) {
    const normalized = normalizeNameCandidate(candidate)

    if (!normalized) {
      continue
    }

    if (symbolKey && normalized.toUpperCase() === symbolKey) {
      continue
    }

    return normalized
  }

  return null
}

export function applyCompanyNameFallbacks<T extends QuoteWithNames>(
  quote: T,
  ...additionalCandidates: NameLike[]
): T {
  const symbol = quote.symbol ?? null
  const normalizedSymbol = normalizeNameCandidate(symbol)

  const resolvedLongName = resolveCompanyName(
    symbol,
    quote.longName,
    ...additionalCandidates,
    quote.shortName
  )

  const resolvedShortName = resolveCompanyName(
    symbol,
    quote.shortName,
    ...additionalCandidates,
    quote.longName
  )

  const fallbackSymbol = normalizedSymbol ?? null
  const shortName = resolvedShortName ?? resolvedLongName ?? fallbackSymbol
  const longName = resolvedLongName ?? resolvedShortName ?? fallbackSymbol

  return {
    ...quote,
    shortName: shortName ?? null,
    longName: longName ?? null,
  }
}

export function getCompanyNameForSymbol(symbol: NameLike): string | null {
  return getMappedCompanyName(symbol)
}
