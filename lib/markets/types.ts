export interface MarketInstrument {
  symbol: string
  shortName: string
  /**
   * Optional override symbol to use when requesting related news headlines.
   * Some market instruments (such as futures contracts) have limited coverage,
   * so we map them to a broader index ticker when fetching Yahoo Finance news.
   */
  newsSymbol?: string
}
