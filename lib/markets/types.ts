export type MarketInstrumentSource =
  | {
      type: "collection"
      path: string
      symbol: string
    }
  | {
      type: "quote"
      symbol: string
    }

export interface MarketInstrument {
  symbol: string
  shortName: string
  sources: MarketInstrumentSource[]
}
