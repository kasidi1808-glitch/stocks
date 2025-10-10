import type { QuoteSummary } from "@/types/yahoo-finance"

const OFFLINE_SUMMARIES: Record<string, QuoteSummary> = {
  AAPL: {
    summaryDetail: {
      open: 184.56,
      dayHigh: 186.12,
      dayLow: 183.25,
      volume: 58210000,
      trailingPE: 30.33,
      marketCap: 2890000000000,
      fiftyTwoWeekHigh: 199.62,
      fiftyTwoWeekLow: 123.48,
      averageVolume: 58000000,
      dividendYield: 0.0058,
      beta: 1.28,
    },
    defaultKeyStatistics: {
      trailingEps: 6.13,
    },
    summaryProfile: {
      longBusinessSummary:
        "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
      sector: "Technology",
      industryDisp: "Consumer Electronics",
      country: "United States",
      fullTimeEmployees: 161000,
      website: "https://www.apple.com",
    },
  },
  MSFT: {
    summaryDetail: {
      open: 371.41,
      dayHigh: 375.2,
      dayLow: 369.75,
      volume: 22500000,
      trailingPE: 37.66,
      marketCap: 2780000000000,
      fiftyTwoWeekHigh: 376.35,
      fiftyTwoWeekLow: 219.35,
      averageVolume: 23000000,
      dividendYield: 0.0088,
      beta: 0.9,
    },
    defaultKeyStatistics: {
      trailingEps: 9.94,
    },
    summaryProfile: {
      longBusinessSummary:
        "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
      sector: "Technology",
      industryDisp: "Software—Infrastructure",
      country: "United States",
      fullTimeEmployees: 221000,
      website: "https://www.microsoft.com",
    },
  },
  GOOGL: {
    summaryDetail: {
      open: 135.72,
      dayHigh: 137.78,
      dayLow: 135.28,
      volume: 21000000,
      trailingPE: 23.77,
      marketCap: 1720000000000,
      fiftyTwoWeekHigh: 138.02,
      fiftyTwoWeekLow: 84.86,
      averageVolume: 22000000,
      dividendYield: null,
      beta: 1.05,
    },
    defaultKeyStatistics: {
      trailingEps: 5.77,
    },
    summaryProfile: {
      longBusinessSummary:
        "Alphabet Inc., through its subsidiaries, provides various products and platforms in the United States and internationally.",
      sector: "Communication Services",
      industryDisp: "Internet Content & Information",
      country: "United States",
      fullTimeEmployees: 190234,
      website: "https://www.abc.xyz",
    },
  },
  AMZN: {
    summaryDetail: {
      open: 145.05,
      dayHigh: 147.2,
      dayLow: 144.32,
      volume: 42500000,
      trailingPE: 56.48,
      marketCap: 1520000000000,
      fiftyTwoWeekHigh: 147.3,
      fiftyTwoWeekLow: 81.43,
      averageVolume: 50000000,
      dividendYield: null,
      beta: 1.22,
    },
    defaultKeyStatistics: {
      trailingEps: 2.6,
    },
    summaryProfile: {
      longBusinessSummary:
        "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.",
      sector: "Consumer Cyclical",
      industryDisp: "Internet Retail",
      country: "United States",
      fullTimeEmployees: 1544000,
      website: "https://www.amazon.com",
    },
  },
  TSLA: {
    summaryDetail: {
      open: 251.76,
      dayHigh: 252.65,
      dayLow: 244.8,
      volume: 152000000,
      trailingPE: 80.14,
      marketCap: 790000000000,
      fiftyTwoWeekHigh: 299.29,
      fiftyTwoWeekLow: 101.81,
      averageVolume: 155000000,
      dividendYield: null,
      beta: 2.08,
    },
    defaultKeyStatistics: {
      trailingEps: 3.1,
    },
    summaryProfile: {
      longBusinessSummary:
        "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems.",
      sector: "Consumer Cyclical",
      industryDisp: "Auto Manufacturers",
      country: "United States",
      fullTimeEmployees: 127855,
      website: "https://www.tesla.com",
    },
  },
}

export function getOfflineQuoteSummary(symbol: string): QuoteSummary | null {
  const summary = OFFLINE_SUMMARIES[symbol]

  if (!summary) {
    return null
  }

  return {
    summaryDetail: { ...summary.summaryDetail },
    defaultKeyStatistics: { ...summary.defaultKeyStatistics },
    summaryProfile: summary.summaryProfile
      ? { ...summary.summaryProfile }
      : undefined,
  }
}
