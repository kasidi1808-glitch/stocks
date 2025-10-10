import { fmpFetch } from "./client"

type FmpNewsResponse = FmpNewsArticle[]

interface FmpNewsArticle {
  symbol: string
  publishedDate: string
  title: string
  image?: string
  site?: string
  text?: string
  url: string
}

export interface StockNewsArticle {
  id: string
  uuid: string
  title: string
  link: string
  publisher: string
  providerPublishTime: Date
  published_at: string
}

export interface StockNewsResult {
  news: StockNewsArticle[]
}

function mapNewsArticle(article: FmpNewsArticle): StockNewsArticle {
  const publishedDate = new Date(article.publishedDate)

  return {
    id: article.url,
    uuid: article.url,
    title: article.title,
    link: article.url,
    publisher: article.site ?? "",
    providerPublishTime: publishedDate,
    published_at: article.publishedDate,
  }
}

export async function fetchFmpNews(
  ticker: string,
  limit: number
): Promise<StockNewsResult> {
  const response = await fmpFetch<FmpNewsResponse>("stock_news", {
    tickers: ticker,
    limit,
  })

  if (!Array.isArray(response)) {
    return { news: [] }
  }

  return {
    news: response.map(mapNewsArticle),
  }
}
