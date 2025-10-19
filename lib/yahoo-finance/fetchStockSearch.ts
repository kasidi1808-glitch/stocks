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
  published_at: string
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
  return {
    id: article.uuid,
    uuid: article.uuid,
    title: article.title,
    link: article.link,
    publisher: article.publisher,
    providerPublishTime: article.providerPublishTime,
    published_at: article.providerPublishTime.toISOString(),
  }
}
