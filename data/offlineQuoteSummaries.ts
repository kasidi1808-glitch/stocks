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
  NVDA: {
    summaryDetail: {
      open: 489.74,
      dayHigh: 498.5,
      dayLow: 486.1,
      volume: 32000000,
      trailingPE: 63.11,
      marketCap: 1220000000000,
      fiftyTwoWeekHigh: 505.48,
      fiftyTwoWeekLow: 138.84,
      averageVolume: 35000000,
      dividendYield: 0.0004,
      beta: 1.7,
    },
    defaultKeyStatistics: {
      trailingEps: 7.85,
    },
    summaryProfile: {
      longBusinessSummary:
        "NVIDIA Corporation provides graphics, computing, and networking solutions for gaming, professional visualization, datacenter, and automotive markets worldwide.",
      sector: "Technology",
      industryDisp: "Semiconductors",
      country: "United States",
      fullTimeEmployees: 26000,
      website: "https://www.nvidia.com",
    },
  },
  META: {
    summaryDetail: {
      open: 354.05,
      dayHigh: 359.42,
      dayLow: 351.8,
      volume: 18000000,
      trailingPE: 30.33,
      marketCap: 920000000000,
      fiftyTwoWeekHigh: 360.14,
      fiftyTwoWeekLow: 124.26,
      averageVolume: 19000000,
      dividendYield: null,
      beta: 1.21,
    },
    defaultKeyStatistics: {
      trailingEps: 11.81,
    },
    summaryProfile: {
      longBusinessSummary:
        "Meta Platforms, Inc. builds technologies that help people connect, find communities, and grow businesses through Facebook, Instagram, WhatsApp, and Reality Labs devices.",
      sector: "Communication Services",
      industryDisp: "Internet Content & Information",
      country: "United States",
      fullTimeEmployees: 66000,
      website: "https://about.meta.com",
    },
  },
  JPM: {
    summaryDetail: {
      open: 165.1,
      dayHigh: 166.55,
      dayLow: 164.32,
      volume: 9700000,
      trailingPE: 11.91,
      marketCap: 480000000000,
      fiftyTwoWeekHigh: 167.44,
      fiftyTwoWeekLow: 123.11,
      averageVolume: 9000000,
      dividendYield: 0.022,
      beta: 1.09,
    },
    defaultKeyStatistics: {
      trailingEps: 13.92,
    },
    summaryProfile: {
      longBusinessSummary:
        "JPMorgan Chase & Co. is a financial holding company that provides investment banking, financial services for consumers and businesses, asset management, and treasury services worldwide.",
      sector: "Financial Services",
      industryDisp: "Banks—Diversified",
      country: "United States",
      fullTimeEmployees: 309000,
      website: "https://www.jpmorganchase.com",
    },
  },
  JNJ: {
    summaryDetail: {
      open: 159.02,
      dayHigh: 159.21,
      dayLow: 157.42,
      volume: 7200000,
      trailingPE: 23.55,
      marketCap: 380000000000,
      fiftyTwoWeekHigh: 180.93,
      fiftyTwoWeekLow: 144.95,
      averageVolume: 6900000,
      dividendYield: 0.029,
      beta: 0.54,
    },
    defaultKeyStatistics: {
      trailingEps: 6.73,
    },
    summaryProfile: {
      longBusinessSummary:
        "Johnson & Johnson researches and develops, manufactures, and sells a broad range of healthcare products in the pharmaceutical, medical devices, and consumer health segments worldwide.",
      sector: "Healthcare",
      industryDisp: "Drug Manufacturers—General",
      country: "United States",
      fullTimeEmployees: 134500,
      website: "https://www.jnj.com",
    },
  },
  XOM: {
    summaryDetail: {
      open: 104.95,
      dayHigh: 105.12,
      dayLow: 103.2,
      volume: 18500000,
      trailingPE: 11.74,
      marketCap: 415000000000,
      fiftyTwoWeekHigh: 120.7,
      fiftyTwoWeekLow: 95.77,
      averageVolume: 21000000,
      dividendYield: 0.033,
      beta: 1.02,
    },
    defaultKeyStatistics: {
      trailingEps: 8.89,
    },
    summaryProfile: {
      longBusinessSummary:
        "Exxon Mobil Corporation explores for and produces crude oil and natural gas, manufactures petroleum products, and transports and sells crude oil, natural gas, and petroleum products worldwide.",
      sector: "Energy",
      industryDisp: "Oil & Gas Integrated",
      country: "United States",
      fullTimeEmployees: 62000,
      website: "https://corporate.exxonmobil.com",
    },
  },
  PG: {
    summaryDetail: {
      open: 151.42,
      dayHigh: 152.8,
      dayLow: 151.02,
      volume: 5900000,
      trailingPE: 25.82,
      marketCap: 358000000000,
      fiftyTwoWeekHigh: 158.38,
      fiftyTwoWeekLow: 135.83,
      averageVolume: 6200000,
      dividendYield: 0.024,
      beta: 0.44,
    },
    defaultKeyStatistics: {
      trailingEps: 5.9,
    },
    summaryProfile: {
      longBusinessSummary:
        "The Procter & Gamble Company provides branded consumer packaged goods in the beauty, grooming, health care, fabric and home care, and baby, feminine and family care segments worldwide.",
      sector: "Consumer Defensive",
      industryDisp: "Household & Personal Products",
      country: "United States",
      fullTimeEmployees: 107000,
      website: "https://www.pginvestor.com",
    },
  },
  KO: {
    summaryDetail: {
      open: 59.34,
      dayHigh: 59.87,
      dayLow: 59.12,
      volume: 13800000,
      trailingPE: 24.08,
      marketCap: 258000000000,
      fiftyTwoWeekHigh: 64.99,
      fiftyTwoWeekLow: 51.55,
      averageVolume: 13600000,
      dividendYield: 0.030,
      beta: 0.55,
    },
    defaultKeyStatistics: {
      trailingEps: 2.48,
    },
    summaryProfile: {
      longBusinessSummary:
        "The Coca-Cola Company manufactures, markets, and sells nonalcoholic beverages worldwide, including sparkling soft drinks, water, sports drinks, juices, dairy, tea, and coffee.",
      sector: "Consumer Defensive",
      industryDisp: "Beverages—Non-Alcoholic",
      country: "United States",
      fullTimeEmployees: 79000,
      website: "https://www.coca-colacompany.com",
    },
  },
  NFLX: {
    summaryDetail: {
      open: 465.37,
      dayHigh: 472.88,
      dayLow: 462.03,
      volume: 4200000,
      trailingPE: 29.74,
      marketCap: 207000000000,
      fiftyTwoWeekHigh: 485.0,
      fiftyTwoWeekLow: 315.62,
      averageVolume: 5200000,
      dividendYield: 0,
      beta: 1.20,
    },
    defaultKeyStatistics: {
      trailingEps: 15.82,
    },
    summaryProfile: {
      longBusinessSummary:
        "Netflix, Inc. provides entertainment services by streaming television series, documentaries, feature films, and mobile games across various genres and languages to members worldwide.",
      sector: "Communication Services",
      industryDisp: "Entertainment",
      country: "United States",
      fullTimeEmployees: 12800,
      website: "https://www.netflix.com",
    },
  },
  DIS: {
    summaryDetail: {
      open: 94.02,
      dayHigh: 95.86,
      dayLow: 93.12,
      volume: 7500000,
      trailingPE: 72.28,
      marketCap: 175000000000,
      fiftyTwoWeekHigh: 118.18,
      fiftyTwoWeekLow: 78.73,
      averageVolume: 10000000,
      dividendYield: 0.002,
      beta: 1.29,
    },
    defaultKeyStatistics: {
      trailingEps: 1.32,
    },
    summaryProfile: {
      longBusinessSummary:
        "The Walt Disney Company operates as a worldwide entertainment company, engaging in media networks, theme parks and experiences, studio entertainment, and direct-to-consumer streaming services.",
      sector: "Communication Services",
      industryDisp: "Entertainment",
      country: "United States",
      fullTimeEmployees: 225000,
      website: "https://www.thewaltdisneycompany.com",
    },
  },
  PEP: {
    summaryDetail: {
      open: 171.12,
      dayHigh: 172.11,
      dayLow: 169.02,
      volume: 3300000,
      trailingPE: 26.52,
      marketCap: 234000000000,
      fiftyTwoWeekHigh: 196.88,
      fiftyTwoWeekLow: 155.83,
      averageVolume: 3700000,
      dividendYield: 0.028,
      beta: 0.56,
    },
    defaultKeyStatistics: {
      trailingEps: 6.42,
    },
    summaryProfile: {
      longBusinessSummary:
        "PepsiCo, Inc. manufactures, markets, distributes, and sells beverages and convenient foods under various brands in more than 200 countries and territories worldwide.",
      sector: "Consumer Defensive",
      industryDisp: "Beverages—Non-Alcoholic",
      country: "United States",
      fullTimeEmployees: 309000,
      website: "https://www.pepsico.com",
    },
  },
  ORCL: {
    summaryDetail: {
      open: 111.82,
      dayHigh: 113.28,
      dayLow: 111.14,
      volume: 6100000,
      trailingPE: 26.01,
      marketCap: 309000000000,
      fiftyTwoWeekHigh: 127.54,
      fiftyTwoWeekLow: 82.04,
      averageVolume: 8400000,
      dividendYield: 0.013,
      beta: 1.03,
    },
    defaultKeyStatistics: {
      trailingEps: 4.33,
    },
    summaryProfile: {
      longBusinessSummary:
        "Oracle Corporation provides products and services that address enterprise information technology environments worldwide, including Oracle Cloud Infrastructure and a suite of enterprise applications.",
      sector: "Technology",
      industryDisp: "Software—Infrastructure",
      country: "United States",
      fullTimeEmployees: 164000,
      website: "https://www.oracle.com",
    },
  },
  CSCO: {
    summaryDetail: {
      open: 51.42,
      dayHigh: 51.63,
      dayLow: 50.52,
      volume: 13000000,
      trailingPE: 16.02,
      marketCap: 207000000000,
      fiftyTwoWeekHigh: 58.19,
      fiftyTwoWeekLow: 45.03,
      averageVolume: 19000000,
      dividendYield: 0.031,
      beta: 0.93,
    },
    defaultKeyStatistics: {
      trailingEps: 3.18,
    },
    summaryProfile: {
      longBusinessSummary:
        "Cisco Systems, Inc. designs, manufactures, and sells Internet Protocol-based networking and other products related to the communications and information technology industry worldwide.",
      sector: "Technology",
      industryDisp: "Communication Equipment",
      country: "United States",
      fullTimeEmployees: 84000,
      website: "https://www.cisco.com",
    },
  },
  BAC: {
    summaryDetail: {
      open: 31.92,
      dayHigh: 32.54,
      dayLow: 31.72,
      volume: 38000000,
      trailingPE: 10.46,
      marketCap: 257000000000,
      fiftyTwoWeekHigh: 37,
      fiftyTwoWeekLow: 24.96,
      averageVolume: 44000000,
      dividendYield: 0.027,
      beta: 1.37,
    },
    defaultKeyStatistics: {
      trailingEps: 3.1,
    },
    summaryProfile: {
      longBusinessSummary:
        "Bank of America Corporation provides banking and financial products and services for individual consumers, small- and middle-market businesses, institutional investors, corporations, and governments worldwide.",
      sector: "Financial Services",
      industryDisp: "Banks—Diversified",
      country: "United States",
      fullTimeEmployees: 213000,
      website: "https://www.bankofamerica.com",
    },
  },
  WMT: {
    summaryDetail: {
      open: 159.12,
      dayHigh: 159.82,
      dayLow: 157.45,
      volume: 5600000,
      trailingPE: 25.69,
      marketCap: 425000000000,
      fiftyTwoWeekHigh: 169.94,
      fiftyTwoWeekLow: 136.09,
      averageVolume: 6500000,
      dividendYield: 0.015,
      beta: 0.53,
    },
    defaultKeyStatistics: {
      trailingEps: 6.16,
    },
    summaryProfile: {
      longBusinessSummary:
        "Walmart Inc. engages in the operation of retail, wholesale, and e-commerce businesses, offering a variety of merchandise and services at everyday low prices in the United States and internationally.",
      sector: "Consumer Defensive",
      industryDisp: "Discount Stores",
      country: "United States",
      fullTimeEmployees: 2100000,
      website: "https://www.walmart.com",
    },
  },
  HD: {
    summaryDetail: {
      open: 328.41,
      dayHigh: 331.82,
      dayLow: 326.38,
      volume: 2500000,
      trailingPE: 21.56,
      marketCap: 333000000000,
      fiftyTwoWeekHigh: 347.25,
      fiftyTwoWeekLow: 274.26,
      averageVolume: 3400000,
      dividendYield: 0.024,
      beta: 0.98,
    },
    defaultKeyStatistics: {
      trailingEps: 15.34,
    },
    summaryProfile: {
      longBusinessSummary:
        "The Home Depot, Inc. operates as a home improvement retailer, supplying building materials, home improvement products, lawn and garden goods, and related services in the United States, Canada, and Mexico.",
      sector: "Consumer Cyclical",
      industryDisp: "Home Improvement Retail",
      country: "United States",
      fullTimeEmployees: 465000,
      website: "https://www.homedepot.com",
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
