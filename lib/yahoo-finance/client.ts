const BASE_URL = "https://query2.finance.yahoo.com/"
const CRUMB_URL = "https://query1.finance.yahoo.com/v1/test/getcrumb"

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "User-Agent":
    "Mozilla/5.0 (compatible; StocksApp/1.0; +https://github.com/)",
}

type YahooSession = {
  cookie: string | null
  crumb: string | null
  fetchedAt: number
}

let cachedSession: YahooSession | null = null
let sessionPromise: Promise<YahooSession> | null = null

function parseCookies(headers: Headers): string | null {
  const getSetCookie = (headers as Headers & {
    getSetCookie?: () => string[]
  }).getSetCookie

  const rawCookies =
    getSetCookie?.call(headers) ??
    (headers.get("set-cookie")
      ? headers
          .get("set-cookie")!
          .split(/,(?=[^;]+?=)/)
          .map((cookie) => cookie.trim())
      : [])

  if (!rawCookies || rawCookies.length === 0) {
    return null
  }

  return rawCookies
    .map((cookie) => cookie.split(";")[0])
    .filter(Boolean)
    .join("; ")
}

async function fetchSession(): Promise<YahooSession> {
  const response = await fetch(CRUMB_URL, {
    headers: DEFAULT_HEADERS,
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Yahoo Finance crumb request failed: ${response.status} ${response.statusText}`
    )
  }

  const crumb = (await response.text()).trim() || null
  const cookie = parseCookies(response.headers)

  return {
    cookie,
    crumb,
    fetchedAt: Date.now(),
  }
}

async function getSession(forceRefresh = false): Promise<YahooSession> {
  if (!forceRefresh && cachedSession) {
    return cachedSession
  }

  if (!sessionPromise) {
    sessionPromise = fetchSession().catch((error) => {
      sessionPromise = null
      throw error
    })
  }

  cachedSession = await sessionPromise
  sessionPromise = null
  return cachedSession
}

export type QueryParams = Record<string, string | number | boolean | undefined>

async function performYahooFetch<T>(
  path: string,
  params: QueryParams,
  attempt: number
): Promise<T> {
  const session = await getSession(attempt > 0)
  const url = new URL(path, BASE_URL)

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    url.searchParams.set(key, String(value))
  })

  if (session.crumb) {
    url.searchParams.set("crumb", session.crumb)
  }

  const headers: Record<string, string> = { ...DEFAULT_HEADERS }

  if (session.cookie) {
    headers.Cookie = session.cookie
  }

  const response = await fetch(url.toString(), {
    headers,
    cache: "no-store",
  })

  if (response.status === 401 && attempt === 0) {
    cachedSession = null
    return performYahooFetch(path, params, attempt + 1)
  }

  if (!response.ok) {
    throw new Error(
      `Yahoo Finance request failed: ${response.status} ${response.statusText}`
    )
  }

  return (await response.json()) as T
}

export async function yahooFinanceFetch<
  T
>(path: string, params: QueryParams = {}): Promise<T> {
  try {
    return await performYahooFetch<T>(path, params, 0)
  } catch (error) {
    cachedSession = null
    sessionPromise = null
    throw error
  }
}
