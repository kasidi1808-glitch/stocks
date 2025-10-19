import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import type {
  SearchNews,
  SearchResult,
} from "@/node_modules/yahoo-finance2/dist/esm/src/modules/search"

type StockNewsArticle = {
  id: string
  uuid: string
  title: string
  link: string
  publisher?: string
  providerPublishTime?: number | Date
  published_at?: string
}

type StockNewsResult = {
  news: StockNewsArticle[]
}

export async function fetchStockSearch(
  ticker: string,
  newsCount: number = 5
): Promise<StockNewsResult> {
  noStore()

  const queryOptions = {
    quotesCount: 1,
    newsCount: newsCount,
    enableFuzzyQuery: true,
  }

  try {
    const response: SearchResult = await yahooFinance.search(
      ticker,
      queryOptions
    )

    const mappedNews = Array.isArray(response.news)
      ? response.news.map(mapYahooNewsArticle)
      : []

    return { news: mappedNews }
  } catch (error) {
    console.log("Failed to fetch stock search", error)

    return { news: [] }
  }
}

function mapYahooNewsArticle(article: SearchNews): StockNewsArticle {
  const publishValue = article.providerPublishTime

  let publishTimestamp: number | null = null

  if (publishValue instanceof Date) {
    publishTimestamp = publishValue.getTime()
  } else if (typeof publishValue === "number") {
    // Yahoo Finance uses seconds since epoch for news timestamps
    const candidate = publishValue > 10_000_000_000 ? publishValue : publishValue * 1000
    publishTimestamp = Number.isFinite(candidate) ? candidate : null
  }

  const publishedAt =
    publishTimestamp !== null && Number.isFinite(publishTimestamp)
      ? new Date(publishTimestamp).toISOString()
      : undefined

  return {
    id: article.uuid,
    uuid: article.uuid,
    title: article.title,
    link: article.link,
    publisher: article.publisher,
    providerPublishTime: article.providerPublishTime,
    published_at: publishedAt,
  }
}
