import { unstable_noStore as noStore } from "next/cache"
import yahooFinance from "yahoo-finance2"
import type {
  SearchNews,
  SearchResult,
} from "@/node_modules/yahoo-finance2/dist/esm/src/modules/search"
import { fetchFmpNews } from "@/lib/fmp/news"
import type { StockNewsResult } from "@/lib/fmp/news"

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

    try {
      return await fetchFmpNews(ticker, newsCount)
    } catch (fallbackError) {
      console.log("Fallback stock news fetch failed", fallbackError)
      return { news: [] }
    }
  }
}

function mapYahooNewsArticle(article: SearchNews) {
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
