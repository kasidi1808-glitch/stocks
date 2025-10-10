const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3/"

type QueryParams = Record<string, string | number | undefined>

let fmpDisabled = false

function getApiKey(): string | null {
  const apiKey = process.env.FMP_API_KEY?.trim()

  if (!apiKey) {
    return null
  }

  return apiKey
}

export function isFmpApiAvailable(): boolean {
  return !fmpDisabled && getApiKey() !== null
}

function buildUrl(path: string, params: QueryParams = {}): string {
  const apiKey = getApiKey()

  if (!apiKey) {
    fmpDisabled = true
    throw new Error(
      "Financial Modeling Prep API is not configured. Set FMP_API_KEY to enable fallbacks."
    )
  }

  const url = new URL(path, FMP_BASE_URL)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  url.searchParams.set("apikey", apiKey)

  return url.toString()
}

export async function fmpFetch<T>(
  path: string,
  params: QueryParams = {}
): Promise<T> {
  if (!isFmpApiAvailable()) {
    throw new Error(
      "Financial Modeling Prep API is currently unavailable. Fallback data will be used instead."
    )
  }

  const url = buildUrl(path, params)

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  })

  if (response.status === 401 || response.status === 403) {
    fmpDisabled = true
    throw new Error(
      `FMP request failed with status ${response.status} (unauthorized).`
    )
  }

  if (!response.ok) {
    throw new Error(`FMP request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
