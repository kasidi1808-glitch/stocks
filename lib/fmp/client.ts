const FMP_BASE_URL = "https://financialmodelingprep.com/api/v3/"

type QueryParams = Record<string, string | number | undefined>

function buildUrl(path: string, params: QueryParams = {}): string {
  const apiKey = process.env.FMP_API_KEY

  if (!apiKey) {
    throw new Error(
      "FMP_API_KEY is not set. Please configure the API key in your environment."
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

export async function fmpFetch<T>(path: string, params: QueryParams = {}): Promise<T> {
  const url = buildUrl(path, params)

  const response = await fetch(url, {
    next: {
      revalidate: 60,
    },
  })

  if (!response.ok) {
    throw new Error(`FMP request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
