const BASE_URL = "https://query2.finance.yahoo.com/"

const DEFAULT_HEADERS = {
  "Accept": "application/json",
  "User-Agent":
    "Mozilla/5.0 (compatible; StocksApp/1.0; +https://github.com/)",
}

export type QueryParams = Record<string, string | number | boolean | undefined>

export async function yahooFinanceFetch<T>(
  path: string,
  params: QueryParams = {}
): Promise<T> {
  const url = new URL(path, BASE_URL)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    url.searchParams.set(key, String(value))
  })

  const response = await fetch(url.toString(), {
    headers: DEFAULT_HEADERS,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Yahoo Finance request failed: ${response.status} ${response.statusText}`
    )
  }

  return (await response.json()) as T
}
