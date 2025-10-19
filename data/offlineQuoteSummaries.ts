import type { QuoteSummary } from "@/types/yahoo-finance"

const OFFLINE_SUMMARIES: Record<string, QuoteSummary> = {
  AAPL: {
    summaryDetail: {
      open: 199.32,
      dayHigh: 201.01,
      dayLow: 197.91,
      volume: 58210000,
      trailingPE: 30.33,
      marketCap: 3121200000000,
      fiftyTwoWeekHigh: 215.59,
      fiftyTwoWeekLow: 133.36,
      averageVolume: 58000000,
      dividendYield: 0.0058,
      beta: 1.28
    },
    defaultKeyStatistics: {
      trailingEps: 6.62
    },
    summaryProfile: {
      longBusinessSummary: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
      sector: "Technology",
      industryDisp: "Consumer Electronics",
      country: "United States",
      fullTimeEmployees: 161000,
      website: "https://www.apple.com"
    }
  },
  MSFT: {
    summaryDetail: {
      open: 401.12,
      dayHigh: 405.22,
      dayLow: 399.33,
      volume: 22500000,
      trailingPE: 37.66,
      marketCap: 3002400000000,
      fiftyTwoWeekHigh: 406.46,
      fiftyTwoWeekLow: 236.9,
      averageVolume: 23000000,
      dividendYield: 0.0088,
      beta: 0.9
    },
    defaultKeyStatistics: {
      trailingEps: 10.74
    },
    summaryProfile: {
      longBusinessSummary: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
      sector: "Technology",
      industryDisp: "Software—Infrastructure",
      country: "United States",
      fullTimeEmployees: 221000,
      website: "https://www.microsoft.com"
    }
  },
  GOOGL: {
    summaryDetail: {
      open: 146.58,
      dayHigh: 148.8,
      dayLow: 146.1,
      volume: 21000000,
      trailingPE: 23.77,
      marketCap: 1857600000000,
      fiftyTwoWeekHigh: 149.06,
      fiftyTwoWeekLow: 91.65,
      averageVolume: 22000000,
      dividendYield: null,
      beta: 1.05
    },
    defaultKeyStatistics: {
      trailingEps: 6.23
    },
    summaryProfile: {
      longBusinessSummary: "Alphabet Inc., through its subsidiaries, provides various products and platforms in the United States and internationally.",
      sector: "Communication Services",
      industryDisp: "Internet Content & Information",
      country: "United States",
      fullTimeEmployees: 190234,
      website: "https://www.abc.xyz"
    }
  },
  AMZN: {
    summaryDetail: {
      open: 156.65,
      dayHigh: 158.98,
      dayLow: 155.87,
      volume: 42500000,
      trailingPE: 56.48,
      marketCap: 1641600000000,
      fiftyTwoWeekHigh: 159.08,
      fiftyTwoWeekLow: 87.94,
      averageVolume: 50000000,
      dividendYield: null,
      beta: 1.22
    },
    defaultKeyStatistics: {
      trailingEps: 2.81
    },
    summaryProfile: {
      longBusinessSummary: "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.",
      sector: "Consumer Cyclical",
      industryDisp: "Internet Retail",
      country: "United States",
      fullTimeEmployees: 1544000,
      website: "https://www.amazon.com"
    }
  },
  TSLA: {
    summaryDetail: {
      open: 271.9,
      dayHigh: 272.86,
      dayLow: 264.38,
      volume: 152000000,
      trailingPE: 80.14,
      marketCap: 853200000000,
      fiftyTwoWeekHigh: 323.23,
      fiftyTwoWeekLow: 109.95,
      averageVolume: 155000000,
      dividendYield: null,
      beta: 2.08
    },
    defaultKeyStatistics: {
      trailingEps: 3.35
    },
    summaryProfile: {
      longBusinessSummary: "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems.",
      sector: "Consumer Cyclical",
      industryDisp: "Auto Manufacturers",
      country: "United States",
      fullTimeEmployees: 127855,
      website: "https://www.tesla.com"
    }
  },
  NVDA: {
    summaryDetail: {
      open: 528.92,
      dayHigh: 538.38,
      dayLow: 524.99,
      volume: 32000000,
      trailingPE: 63.11,
      marketCap: 1317600000000,
      fiftyTwoWeekHigh: 545.92,
      fiftyTwoWeekLow: 149.95,
      averageVolume: 35000000,
      dividendYield: 0.0004,
      beta: 1.7
    },
    defaultKeyStatistics: {
      trailingEps: 8.48
    },
    summaryProfile: {
      longBusinessSummary: "NVIDIA Corporation provides graphics, computing, and networking solutions for gaming, professional visualization, datacenter, and automotive markets worldwide.",
      sector: "Technology",
      industryDisp: "Semiconductors",
      country: "United States",
      fullTimeEmployees: 26000,
      website: "https://www.nvidia.com"
    }
  },
  META: {
    summaryDetail: {
      open: 382.37,
      dayHigh: 388.17,
      dayLow: 379.94,
      volume: 18000000,
      trailingPE: 30.33,
      marketCap: 993600000000,
      fiftyTwoWeekHigh: 388.95,
      fiftyTwoWeekLow: 134.2,
      averageVolume: 19000000,
      dividendYield: null,
      beta: 1.21
    },
    defaultKeyStatistics: {
      trailingEps: 12.75
    },
    summaryProfile: {
      longBusinessSummary: "Meta Platforms, Inc. builds technologies that help people connect, find communities, and grow businesses through Facebook, Instagram, WhatsApp, and Reality Labs devices.",
      sector: "Communication Services",
      industryDisp: "Internet Content & Information",
      country: "United States",
      fullTimeEmployees: 66000,
      website: "https://about.meta.com"
    }
  },
  JPM: {
    summaryDetail: {
      open: 178.31,
      dayHigh: 179.87,
      dayLow: 177.47,
      volume: 9700000,
      trailingPE: 11.91,
      marketCap: 518400000000,
      fiftyTwoWeekHigh: 180.84,
      fiftyTwoWeekLow: 132.96,
      averageVolume: 9000000,
      dividendYield: 0.022,
      beta: 1.09
    },
    defaultKeyStatistics: {
      trailingEps: 15.03
    },
    summaryProfile: {
      longBusinessSummary: "JPMorgan Chase & Co. is a financial holding company that provides investment banking, financial services for consumers and businesses, asset management, and treasury services worldwide.",
      sector: "Financial Services",
      industryDisp: "Banks—Diversified",
      country: "United States",
      fullTimeEmployees: 309000,
      website: "https://www.jpmorganchase.com"
    }
  },
  JNJ: {
    summaryDetail: {
      open: 171.74,
      dayHigh: 171.95,
      dayLow: 170.01,
      volume: 7200000,
      trailingPE: 23.55,
      marketCap: 410400000000,
      fiftyTwoWeekHigh: 195.4,
      fiftyTwoWeekLow: 156.55,
      averageVolume: 6900000,
      dividendYield: 0.029,
      beta: 0.54
    },
    defaultKeyStatistics: {
      trailingEps: 7.27
    },
    summaryProfile: {
      longBusinessSummary: "Johnson & Johnson researches and develops, manufactures, and sells a broad range of healthcare products in the pharmaceutical, medical devices, and consumer health segments worldwide.",
      sector: "Healthcare",
      industryDisp: "Drug Manufacturers—General",
      country: "United States",
      fullTimeEmployees: 134500,
      website: "https://www.jnj.com"
    }
  },
  XOM: {
    summaryDetail: {
      open: 113.35,
      dayHigh: 113.53,
      dayLow: 111.46,
      volume: 18500000,
      trailingPE: 11.74,
      marketCap: 448200000000,
      fiftyTwoWeekHigh: 130.36,
      fiftyTwoWeekLow: 103.43,
      averageVolume: 21000000,
      dividendYield: 0.033,
      beta: 1.02
    },
    defaultKeyStatistics: {
      trailingEps: 9.6
    },
    summaryProfile: {
      longBusinessSummary: "Exxon Mobil Corporation explores for and produces crude oil and natural gas, manufactures petroleum products, and transports and sells crude oil, natural gas, and petroleum products worldwide.",
      sector: "Energy",
      industryDisp: "Oil & Gas Integrated",
      country: "United States",
      fullTimeEmployees: 62000,
      website: "https://corporate.exxonmobil.com"
    }
  },
  PG: {
    summaryDetail: {
      open: 163.53,
      dayHigh: 165.02,
      dayLow: 163.1,
      volume: 5900000,
      trailingPE: 25.82,
      marketCap: 386640000000,
      fiftyTwoWeekHigh: 171.05,
      fiftyTwoWeekLow: 146.7,
      averageVolume: 6200000,
      dividendYield: 0.024,
      beta: 0.44
    },
    defaultKeyStatistics: {
      trailingEps: 6.37
    },
    summaryProfile: {
      longBusinessSummary: "The Procter & Gamble Company provides branded consumer packaged goods in the beauty, grooming, health care, fabric and home care, and baby, feminine and family care segments worldwide.",
      sector: "Consumer Defensive",
      industryDisp: "Household & Personal Products",
      country: "United States",
      fullTimeEmployees: 107000,
      website: "https://www.pginvestor.com"
    }
  },
  KO: {
    summaryDetail: {
      open: 64.09,
      dayHigh: 64.66,
      dayLow: 63.85,
      volume: 13800000,
      trailingPE: 24.08,
      marketCap: 278640000000,
      fiftyTwoWeekHigh: 70.19,
      fiftyTwoWeekLow: 55.67,
      averageVolume: 13600000,
      dividendYield: 0.03,
      beta: 0.55
    },
    defaultKeyStatistics: {
      trailingEps: 2.68
    },
    summaryProfile: {
      longBusinessSummary: "The Coca-Cola Company manufactures, markets, and sells nonalcoholic beverages worldwide, including sparkling soft drinks, water, sports drinks, juices, dairy, tea, and coffee.",
      sector: "Consumer Defensive",
      industryDisp: "Beverages—Non-Alcoholic",
      country: "United States",
      fullTimeEmployees: 79000,
      website: "https://www.coca-colacompany.com"
    }
  },
  NFLX: {
    summaryDetail: {
      open: 502.6,
      dayHigh: 510.71,
      dayLow: 498.99,
      volume: 4200000,
      trailingPE: 29.74,
      marketCap: 223560000000,
      fiftyTwoWeekHigh: 523.8,
      fiftyTwoWeekLow: 340.87,
      averageVolume: 5200000,
      dividendYield: 0,
      beta: 1.2
    },
    defaultKeyStatistics: {
      trailingEps: 17.09
    },
    summaryProfile: {
      longBusinessSummary: "Netflix, Inc. provides entertainment services by streaming television series, documentaries, feature films, and mobile games across various genres and languages to members worldwide.",
      sector: "Communication Services",
      industryDisp: "Entertainment",
      country: "United States",
      fullTimeEmployees: 12800,
      website: "https://www.netflix.com"
    }
  },
  DIS: {
    summaryDetail: {
      open: 101.54,
      dayHigh: 103.53,
      dayLow: 100.57,
      volume: 7500000,
      trailingPE: 72.28,
      marketCap: 189000000000,
      fiftyTwoWeekHigh: 127.63,
      fiftyTwoWeekLow: 85.03,
      averageVolume: 10000000,
      dividendYield: 0.002,
      beta: 1.29
    },
    defaultKeyStatistics: {
      trailingEps: 1.43
    },
    summaryProfile: {
      longBusinessSummary: "The Walt Disney Company operates as a worldwide entertainment company, engaging in media networks, theme parks and experiences, studio entertainment, and direct-to-consumer streaming services.",
      sector: "Communication Services",
      industryDisp: "Entertainment",
      country: "United States",
      fullTimeEmployees: 225000,
      website: "https://www.thewaltdisneycompany.com"
    }
  },
  PEP: {
    summaryDetail: {
      open: 184.81,
      dayHigh: 185.88,
      dayLow: 182.54,
      volume: 3300000,
      trailingPE: 26.52,
      marketCap: 252720000000,
      fiftyTwoWeekHigh: 212.63,
      fiftyTwoWeekLow: 168.3,
      averageVolume: 3700000,
      dividendYield: 0.028,
      beta: 0.56
    },
    defaultKeyStatistics: {
      trailingEps: 6.93
    },
    summaryProfile: {
      longBusinessSummary: "PepsiCo, Inc. manufactures, markets, distributes, and sells beverages and convenient foods under various brands in more than 200 countries and territories worldwide.",
      sector: "Consumer Defensive",
      industryDisp: "Beverages—Non-Alcoholic",
      country: "United States",
      fullTimeEmployees: 309000,
      website: "https://www.pepsico.com"
    }
  },
  ORCL: {
    summaryDetail: {
      open: 120.77,
      dayHigh: 122.34,
      dayLow: 120.03,
      volume: 6100000,
      trailingPE: 26.01,
      marketCap: 333720000000,
      fiftyTwoWeekHigh: 137.74,
      fiftyTwoWeekLow: 88.6,
      averageVolume: 8400000,
      dividendYield: 0.013,
      beta: 1.03
    },
    defaultKeyStatistics: {
      trailingEps: 4.68
    },
    summaryProfile: {
      longBusinessSummary: "Oracle Corporation provides products and services that address enterprise information technology environments worldwide, including Oracle Cloud Infrastructure and a suite of enterprise applications.",
      sector: "Technology",
      industryDisp: "Software—Infrastructure",
      country: "United States",
      fullTimeEmployees: 164000,
      website: "https://www.oracle.com"
    }
  },
  CSCO: {
    summaryDetail: {
      open: 55.53,
      dayHigh: 55.76,
      dayLow: 54.56,
      volume: 13000000,
      trailingPE: 16.02,
      marketCap: 223560000000,
      fiftyTwoWeekHigh: 62.85,
      fiftyTwoWeekLow: 48.63,
      averageVolume: 19000000,
      dividendYield: 0.031,
      beta: 0.93
    },
    defaultKeyStatistics: {
      trailingEps: 3.43
    },
    summaryProfile: {
      longBusinessSummary: "Cisco Systems, Inc. designs, manufactures, and sells Internet Protocol-based networking and other products related to the communications and information technology industry worldwide.",
      sector: "Technology",
      industryDisp: "Communication Equipment",
      country: "United States",
      fullTimeEmployees: 84000,
      website: "https://www.cisco.com"
    }
  },
  BAC: {
    summaryDetail: {
      open: 34.47,
      dayHigh: 35.14,
      dayLow: 34.26,
      volume: 38000000,
      trailingPE: 10.46,
      marketCap: 277560000000,
      fiftyTwoWeekHigh: 39.96,
      fiftyTwoWeekLow: 26.96,
      averageVolume: 44000000,
      dividendYield: 0.027,
      beta: 1.37
    },
    defaultKeyStatistics: {
      trailingEps: 3.35
    },
    summaryProfile: {
      longBusinessSummary: "Bank of America Corporation provides banking and financial products and services for individual consumers, small- and middle-market businesses, institutional investors, corporations, and governments worldwide.",
      sector: "Financial Services",
      industryDisp: "Banks—Diversified",
      country: "United States",
      fullTimeEmployees: 213000,
      website: "https://www.bankofamerica.com"
    }
  },
  WMT: {
    summaryDetail: {
      open: 171.85,
      dayHigh: 172.61,
      dayLow: 170.05,
      volume: 5600000,
      trailingPE: 25.69,
      marketCap: 459000000000,
      fiftyTwoWeekHigh: 183.54,
      fiftyTwoWeekLow: 146.98,
      averageVolume: 6500000,
      dividendYield: 0.015,
      beta: 0.53
    },
    defaultKeyStatistics: {
      trailingEps: 6.65
    },
    summaryProfile: {
      longBusinessSummary: "Walmart Inc. engages in the operation of retail, wholesale, and e-commerce businesses, offering a variety of merchandise and services at everyday low prices in the United States and internationally.",
      sector: "Consumer Defensive",
      industryDisp: "Discount Stores",
      country: "United States",
      fullTimeEmployees: 2100000,
      website: "https://www.walmart.com"
    }
  },
  HD: {
    summaryDetail: {
      open: 354.68,
      dayHigh: 358.37,
      dayLow: 352.49,
      volume: 2500000,
      trailingPE: 21.56,
      marketCap: 359640000000,
      fiftyTwoWeekHigh: 375.03,
      fiftyTwoWeekLow: 296.2,
      averageVolume: 3400000,
      dividendYield: 0.024,
      beta: 0.98
    },
    defaultKeyStatistics: {
      trailingEps: 16.57
    },
    summaryProfile: {
      longBusinessSummary: "The Home Depot, Inc. operates as a home improvement retailer, supplying building materials, home improvement products, lawn and garden goods, and related services in the United States, Canada, and Mexico.",
      sector: "Consumer Cyclical",
      industryDisp: "Home Improvement Retail",
      country: "United States",
      fullTimeEmployees: 465000,
      website: "https://www.homedepot.com"
    }
  },
  V: {
    summaryDetail: {
      open: 266.44,
      dayHigh: 268.92,
      dayLow: 264.06,
      volume: 5700000,
      trailingPE: 29.96,
      marketCap: 561600000000,
      fiftyTwoWeekHigh: 272.88,
      fiftyTwoWeekLow: 233.43,
      averageVolume: 6200000,
      dividendYield: 0.0075,
      beta: 0.96
    },
    defaultKeyStatistics: {
      trailingEps: 8.94
    },
    summaryProfile: {
      longBusinessSummary: "Visa Inc. operates a global payments network that facilitates digital fund transfers among consumers, merchants, financial institutions, and governments.",
      sector: "Financial Services",
      industryDisp: "Credit Services",
      country: "United States",
      fullTimeEmployees: 28000,
      website: "https://www.visa.com"
    }
  },
  MA: {
    summaryDetail: {
      open: 439.56,
      dayHigh: 445.82,
      dayLow: 436.43,
      volume: 3200000,
      trailingPE: 33.93,
      marketCap: 415800000000,
      fiftyTwoWeekHigh: 452.09,
      fiftyTwoWeekLow: 367.43,
      averageVolume: 3000000,
      dividendYield: 0.0059,
      beta: 1.09
    },
    defaultKeyStatistics: {
      trailingEps: 13.07
    },
    summaryProfile: {
      longBusinessSummary: "Mastercard Incorporated provides transaction processing and payment-related products and services for consumers, merchants, and financial institutions worldwide.",
      sector: "Financial Services",
      industryDisp: "Credit Services",
      country: "United States",
      fullTimeEmployees: 29000,
      website: "https://www.mastercard.com"
    }
  },
  INTC: {
    summaryDetail: {
      open: 50,
      dayHigh: 50.33,
      dayLow: 48.71,
      volume: 36500000,
      trailingPE: 31.44,
      marketCap: 207360000000,
      fiftyTwoWeekHigh: 51.08,
      fiftyTwoWeekLow: 26.71,
      averageVolume: 33000000,
      dividendYield: 0.015,
      beta: 0.86
    },
    defaultKeyStatistics: {
      trailingEps: 1.58
    },
    summaryProfile: {
      longBusinessSummary: "Intel Corporation designs, manufactures, and sells computer products and technologies, including microprocessors, chipsets, and accelerated computing systems worldwide.",
      sector: "Technology",
      industryDisp: "Semiconductors",
      country: "United States",
      fullTimeEmployees: 131900,
      website: "https://www.intel.com"
    }
  },
  AMD: {
    summaryDetail: {
      open: 144.61,
      dayHigh: 147.31,
      dayLow: 143.42,
      volume: 29000000,
      trailingPE: 51.04,
      marketCap: 237600000000,
      fiftyTwoWeekHigh: 147.74,
      fiftyTwoWeekLow: 64.85,
      averageVolume: 27000000,
      dividendYield: null,
      beta: 1.95
    },
    defaultKeyStatistics: {
      trailingEps: 2.86
    },
    summaryProfile: {
      longBusinessSummary: "Advanced Micro Devices, Inc. operates as a semiconductor company, offering x86 microprocessors, GPUs, adaptive SoCs, and related technologies for data center, client, and gaming markets.",
      sector: "Technology",
      industryDisp: "Semiconductors",
      country: "United States",
      fullTimeEmployees: 26000,
      website: "https://www.amd.com"
    }
  },
  ADBE: {
    summaryDetail: {
      open: 643.68,
      dayHigh: 653.83,
      dayLow: 638.5,
      volume: 2100000,
      trailingPE: 45.04,
      marketCap: 293760000000,
      fiftyTwoWeekHigh: 662.81,
      fiftyTwoWeekLow: 344.09,
      averageVolume: 2400000,
      dividendYield: null,
      beta: 1.34
    },
    defaultKeyStatistics: {
      trailingEps: 14.42
    },
    summaryProfile: {
      longBusinessSummary: "Adobe Inc. offers products and services for content creation, document management, and marketing analytics through its Digital Media and Digital Experience segments.",
      sector: "Technology",
      industryDisp: "Software—Infrastructure",
      country: "United States",
      fullTimeEmployees: 29000,
      website: "https://www.adobe.com"
    }
  },
  CRM: {
    summaryDetail: {
      open: 269.89,
      dayHigh: 274.43,
      dayLow: 268.38,
      volume: 5200000,
      trailingPE: 41.03,
      marketCap: 264600000000,
      fiftyTwoWeekHigh: 275.4,
      fiftyTwoWeekLow: 145.8,
      averageVolume: 5400000,
      dividendYield: null,
      beta: 1.12
    },
    defaultKeyStatistics: {
      trailingEps: 6.65
    },
    summaryProfile: {
      longBusinessSummary: "Salesforce, Inc. provides customer relationship management technology that helps companies engage with customers across sales, service, marketing, and commerce applications.",
      sector: "Technology",
      industryDisp: "Software—Application",
      country: "United States",
      fullTimeEmployees: 73000,
      website: "https://www.salesforce.com"
    }
  },
  PYPL: {
    summaryDetail: {
      open: 69.34,
      dayHigh: 69.98,
      dayLow: 67.72,
      volume: 9000000,
      trailingPE: 16.53,
      marketCap: 75600000000,
      fiftyTwoWeekHigh: 95.72,
      fiftyTwoWeekLow: 54.27,
      averageVolume: 11000000,
      dividendYield: null,
      beta: 1.37
    },
    defaultKeyStatistics: {
      trailingEps: 4.15
    },
    summaryProfile: {
      longBusinessSummary: "PayPal Holdings, Inc. operates digital payment platforms that enable digital and mobile payments on behalf of consumers and merchants worldwide.",
      sector: "Financial Services",
      industryDisp: "Credit Services",
      country: "United States",
      fullTimeEmployees: 29000,
      website: "https://www.paypal.com"
    }
  },
  ABT: {
    summaryDetail: {
      open: 120.64,
      dayHigh: 122.15,
      dayLow: 120.1,
      volume: 4200000,
      trailingPE: 34.31,
      marketCap: 210600000000,
      fiftyTwoWeekHigh: 125.1,
      fiftyTwoWeekLow: 96.84,
      averageVolume: 4600000,
      dividendYield: 0.017,
      beta: 0.74
    },
    defaultKeyStatistics: {
      trailingEps: 3.54
    },
    summaryProfile: {
      longBusinessSummary: "Abbott Laboratories discovers, develops, manufactures, and sells health care products, including diagnostics, medical devices, nutritionals, and branded generic medicines.",
      sector: "Healthcare",
      industryDisp: "Medical Devices",
      country: "United States",
      fullTimeEmployees: 115000,
      website: "https://www.abbott.com"
    }
  },
  T: {
    summaryDetail: {
      open: 18.36,
      dayHigh: 18.68,
      dayLow: 18.25,
      volume: 31000000,
      trailingPE: 9.01,
      marketCap: 131760000000,
      fiftyTwoWeekHigh: 22.14,
      fiftyTwoWeekLow: 14.5,
      averageVolume: 27000000,
      dividendYield: 0.058,
      beta: 0.58
    },
    defaultKeyStatistics: {
      trailingEps: 2.05
    },
    summaryProfile: {
      longBusinessSummary: "AT&T Inc. provides telecommunications, media, and technology services, offering wireless communications, broadband, and entertainment solutions primarily in the United States.",
      sector: "Communication Services",
      industryDisp: "Telecom Services",
      country: "United States",
      fullTimeEmployees: 149000,
      website: "https://www.att.com"
    }
  },
  COST: {
    summaryDetail: {
      open: 719.5,
      dayHigh: 728.78,
      dayLow: 715.93,
      volume: 1600000,
      trailingPE: 47.43,
      marketCap: 320760000000,
      fiftyTwoWeekHigh: 733.21,
      fiftyTwoWeekLow: 483.73,
      averageVolume: 1900000,
      dividendYield: 0.006,
      beta: 0.78
    },
    defaultKeyStatistics: {
      trailingEps: 15.29
    },
    summaryProfile: {
      longBusinessSummary: "Costco Wholesale Corporation operates membership warehouses that offer a selection of brand-name merchandise across a wide range of categories in bulk quantities.",
      sector: "Consumer Defensive",
      industryDisp: "Discount Stores",
      country: "United States",
      fullTimeEmployees: 316000,
      website: "https://www.costco.com"
    }
  },
  NKE: {
    summaryDetail: {
      open: 127.44,
      dayHigh: 128.2,
      dayLow: 125.5,
      volume: 6800000,
      trailingPE: 36.2,
      marketCap: 194400000000,
      fiftyTwoWeekHigh: 141.81,
      fiftyTwoWeekLow: 95.75,
      averageVolume: 7800000,
      dividendYield: 0.012,
      beta: 1.07
    },
    defaultKeyStatistics: {
      trailingEps: 3.5
    },
    summaryProfile: {
      longBusinessSummary: "NIKE, Inc. designs, develops, markets, and sells athletic footwear, apparel, equipment, and accessories for men, women, and children worldwide.",
      sector: "Consumer Cyclical",
      industryDisp: "Footwear & Accessories",
      country: "United States",
      fullTimeEmployees: 83000,
      website: "https://www.nike.com"
    }
  },
  MCD: {
    summaryDetail: {
      open: 319.46,
      dayHigh: 321.62,
      dayLow: 317.84,
      volume: 2900000,
      trailingPE: 27.41,
      marketCap: 232200000000,
      fiftyTwoWeekHigh: 323.3,
      fiftyTwoWeekLow: 265.39,
      averageVolume: 2700000,
      dividendYield: 0.022,
      beta: 0.7
    },
    defaultKeyStatistics: {
      trailingEps: 11.69
    },
    summaryProfile: {
      longBusinessSummary: "McDonald's Corporation operates and franchises restaurants worldwide, offering a menu of hamburgers and cheeseburgers, chicken, fish, salads, and sides.",
      sector: "Consumer Cyclical",
      industryDisp: "Restaurants",
      country: "United States",
      fullTimeEmployees: 150000,
      website: "https://www.mcdonalds.com"
    }
  },
  QCOM: {
    summaryDetail: {
      open: 144.94,
      dayHigh: 147.74,
      dayLow: 144.61,
      volume: 7200000,
      trailingPE: 17.3,
      marketCap: 164160000000,
      fiftyTwoWeekHigh: 151.14,
      fiftyTwoWeekLow: 109.59,
      averageVolume: 8100000,
      dividendYield: 0.024,
      beta: 1.2
    },
    defaultKeyStatistics: {
      trailingEps: 8.48
    },
    summaryProfile: {
      longBusinessSummary: "QUALCOMM Incorporated engages in the development and commercialization of foundational technologies for wireless communications, including Snapdragon chipsets and licensing.",
      sector: "Technology",
      industryDisp: "Semiconductors",
      country: "United States",
      fullTimeEmployees: 51000,
      website: "https://www.qualcomm.com"
    }
  },
  TXN: {
    summaryDetail: {
      open: 180.58,
      dayHigh: 183.06,
      dayLow: 179.5,
      volume: 4500000,
      trailingPE: 23.4,
      marketCap: 165240000000,
      fiftyTwoWeekHigh: 201.2,
      fiftyTwoWeekLow: 150.64,
      averageVolume: 4600000,
      dividendYield: 0.028,
      beta: 1.01
    },
    defaultKeyStatistics: {
      trailingEps: 7.78
    },
    summaryProfile: {
      longBusinessSummary: "Texas Instruments Incorporated designs and manufactures analog and embedded semiconductor chips for industrial, automotive, personal electronics, and communications markets.",
      sector: "Technology",
      industryDisp: "Semiconductors",
      country: "United States",
      fullTimeEmployees: 33000,
      website: "https://www.ti.com"
    }
  },
  IBM: {
    summaryDetail: {
      open: 175.18,
      dayHigh: 176.9,
      dayLow: 174.42,
      volume: 3300000,
      trailingPE: 18,
      marketCap: 159840000000,
      fiftyTwoWeekHigh: 180.24,
      fiftyTwoWeekLow: 130.19,
      averageVolume: 4100000,
      dividendYield: 0.049,
      beta: 0.85
    },
    defaultKeyStatistics: {
      trailingEps: 9.77
    },
    summaryProfile: {
      longBusinessSummary: "International Business Machines Corporation provides integrated solutions and services in software, consulting, and infrastructure with a focus on hybrid cloud and AI.",
      sector: "Technology",
      industryDisp: "Information Technology Services",
      country: "United States",
      fullTimeEmployees: 288000,
      website: "https://www.ibm.com"
    }
  },
  UNH: {
    summaryDetail: {
      open: 558.81,
      dayHigh: 564.09,
      dayLow: 556.46,
      volume: 3100000,
      trailingPE: 22.16,
      marketCap: 518400000000,
      fiftyTwoWeekHigh: 602.75,
      fiftyTwoWeekLow: 481.33,
      averageVolume: 3400000,
      dividendYield: 0.013,
      beta: 0.68
    },
    defaultKeyStatistics: {
      trailingEps: 25.38
    },
    summaryProfile: {
      longBusinessSummary: "UnitedHealth Group Incorporated operates diversified healthcare businesses including insurance services and technology-enabled care delivery across the United States.",
      sector: "Healthcare",
      industryDisp: "Healthcare Plans",
      country: "United States",
      fullTimeEmployees: 400000,
      website: "https://www.unitedhealthgroup.com"
    }
  },
  LLY: {
    summaryDetail: {
      open: 644.87,
      dayHigh: 654.05,
      dayLow: 639.52,
      volume: 3000000,
      trailingPE: 85.18,
      marketCap: 615600000000,
      fiftyTwoWeekHigh: 684.6,
      fiftyTwoWeekLow: 333.94,
      averageVolume: 3100000,
      dividendYield: 0.008,
      beta: 0.36
    },
    defaultKeyStatistics: {
      trailingEps: 7.61
    },
    summaryProfile: {
      longBusinessSummary: "Eli Lilly and Company discovers, develops, manufactures, and markets pharmaceutical products in the areas of diabetes, oncology, neuroscience, and immunology globally.",
      sector: "Healthcare",
      industryDisp: "Drug Manufacturers—General",
      country: "United States",
      fullTimeEmployees: 43000,
      website: "https://www.lilly.com"
    }
  },
  MRK: {
    summaryDetail: {
      open: 118.63,
      dayHigh: 119.75,
      dayLow: 117.63,
      volume: 7000000,
      trailingPE: 20.3,
      marketCap: 302400000000,
      fiftyTwoWeekHigh: 129.22,
      fiftyTwoWeekLow: 105.96,
      averageVolume: 8200000,
      dividendYield: 0.027,
      beta: 0.34
    },
    defaultKeyStatistics: {
      trailingEps: 5.89
    },
    summaryProfile: {
      longBusinessSummary: "Merck & Co., Inc. provides health solutions through its prescription medicines, vaccines, and animal health products worldwide.",
      sector: "Healthcare",
      industryDisp: "Drug Manufacturers—General",
      country: "United States",
      fullTimeEmployees: 69000,
      website: "https://www.merck.com"
    }
  },
  PFE: {
    summaryDetail: {
      open: 38.09,
      dayHigh: 38.46,
      dayLow: 37.49,
      volume: 28000000,
      trailingPE: 10.46,
      marketCap: 213840000000,
      fiftyTwoWeekHigh: 59.31,
      fiftyTwoWeekLow: 36.2,
      averageVolume: 26000000,
      dividendYield: 0.046,
      beta: 0.61
    },
    defaultKeyStatistics: {
      trailingEps: 3.62
    },
    summaryProfile: {
      longBusinessSummary: "Pfizer Inc. discovers, develops, manufactures, and markets biopharmaceutical products across cardiovascular, metabolic, oncology, and rare disease categories.",
      sector: "Healthcare",
      industryDisp: "Drug Manufacturers—General",
      country: "United States",
      fullTimeEmployees: 83000,
      website: "https://www.pfizer.com"
    }
  },
  CVS: {
    summaryDetail: {
      open: 78.34,
      dayHigh: 79.73,
      dayLow: 77.89,
      volume: 5200000,
      trailingPE: 11.34,
      marketCap: 100440000000,
      fiftyTwoWeekHigh: 97.86,
      fiftyTwoWeekLow: 69.61,
      averageVolume: 6100000,
      dividendYield: 0.029,
      beta: 0.55
    },
    defaultKeyStatistics: {
      trailingEps: 6.97
    },
    summaryProfile: {
      longBusinessSummary: "CVS Health Corporation provides integrated health services including retail pharmacy, benefit management, and primary care offerings across the United States.",
      sector: "Healthcare",
      industryDisp: "Healthcare Plans",
      country: "United States",
      fullTimeEmployees: 300000,
      website: "https://www.cvshealth.com"
    }
  },
  BA: {
    summaryDetail: {
      open: 276.99,
      dayHigh: 279.32,
      dayLow: 272.2,
      volume: 6800000,
      trailingPE: 53.69,
      marketCap: 166320000000,
      fiftyTwoWeekHigh: 288.94,
      fiftyTwoWeekLow: 185.65,
      averageVolume: 5600000,
      dividendYield: null,
      beta: 1.47
    },
    defaultKeyStatistics: {
      trailingEps: 5.13
    },
    summaryProfile: {
      longBusinessSummary: "The Boeing Company designs, manufactures, and services commercial airplanes, defense systems, and space technology for customers worldwide.",
      sector: "Industrials",
      industryDisp: "Aerospace & Defense",
      country: "United States",
      fullTimeEmployees: 156000,
      website: "https://www.boeing.com"
    }
  },
  UPS: {
    summaryDetail: {
      open: 174.15,
      dayHigh: 176.99,
      dayLow: 173.36,
      volume: 3500000,
      trailingPE: 14.8,
      marketCap: 149040000000,
      fiftyTwoWeekHigh: 213.62,
      fiftyTwoWeekLow: 166.64,
      averageVolume: 3300000,
      dividendYield: 0.035,
      beta: 1.04
    },
    defaultKeyStatistics: {
      trailingEps: 11.83
    },
    summaryProfile: {
      longBusinessSummary: "United Parcel Service, Inc. provides logistics services, including package delivery, supply chain management, and freight forwarding globally.",
      sector: "Industrials",
      industryDisp: "Integrated Freight & Logistics",
      country: "United States",
      fullTimeEmployees: 540000,
      website: "https://www.ups.com"
    }
  },
  SBUX: {
    summaryDetail: {
      open: 105.44,
      dayHigh: 107.16,
      dayLow: 104.91,
      volume: 7500000,
      trailingPE: 27.68,
      marketCap: 120960000000,
      fiftyTwoWeekHigh: 124.72,
      fiftyTwoWeekLow: 96.4,
      averageVolume: 8000000,
      dividendYield: 0.021,
      beta: 0.98
    },
    defaultKeyStatistics: {
      trailingEps: 3.83
    },
    summaryProfile: {
      longBusinessSummary: "Starbucks Corporation operates as a roaster, marketer, and retailer of specialty coffee with a global network of company-operated and licensed stores.",
      sector: "Consumer Cyclical",
      industryDisp: "Restaurants",
      country: "United States",
      fullTimeEmployees: 381000,
      website: "https://www.starbucks.com"
    }
  },
  CAT: {
    summaryDetail: {
      open: 308.42,
      dayHigh: 313.05,
      dayLow: 306.74,
      volume: 3000000,
      trailingPE: 19.54,
      marketCap: 159840000000,
      fiftyTwoWeekHigh: 317.39,
      fiftyTwoWeekLow: 220.36,
      averageVolume: 3400000,
      dividendYield: 0.019,
      beta: 1.1
    },
    defaultKeyStatistics: {
      trailingEps: 15.93
    },
    summaryProfile: {
      longBusinessSummary: "Caterpillar Inc. manufactures construction and mining equipment, diesel and natural gas engines, and industrial gas turbines for customers worldwide.",
      sector: "Industrials",
      industryDisp: "Farm & Heavy Construction Machinery",
      country: "United States",
      fullTimeEmployees: 109100,
      website: "https://www.caterpillar.com"
    }
  },
  HON: {
    summaryDetail: {
      open: 224.45,
      dayHigh: 227.42,
      dayLow: 223.65,
      volume: 2600000,
      trailingPE: 24.8,
      marketCap: 149040000000,
      fiftyTwoWeekHigh: 238.64,
      fiftyTwoWeekLow: 188.87,
      averageVolume: 3000000,
      dividendYield: 0.021,
      beta: 1.03
    },
    defaultKeyStatistics: {
      trailingEps: 9.1
    },
    summaryProfile: {
      longBusinessSummary: "Honeywell International Inc. invents and manufactures technologies for aerospace, building technologies, performance materials, and safety and productivity solutions globally.",
      sector: "Industrials",
      industryDisp: "Conglomerates",
      country: "United States",
      fullTimeEmployees: 98000,
      website: "https://www.honeywell.com"
    }
  },
  BLK: {
    summaryDetail: {
      open: 849.5,
      dayHigh: 862.66,
      dayLow: 844.93,
      volume: 600000,
      trailingPE: 22.53,
      marketCap: 127440000000,
      fiftyTwoWeekHigh: 874.18,
      fiftyTwoWeekLow: 643.87,
      averageVolume: 700000,
      dividendYield: 0.023,
      beta: 1.28
    },
    defaultKeyStatistics: {
      trailingEps: 38.02
    },
    summaryProfile: {
      longBusinessSummary: "BlackRock, Inc. is an investment management company offering active and index investment products, technology services, and advisory solutions worldwide.",
      sector: "Financial Services",
      industryDisp: "Asset Management",
      country: "United States",
      fullTimeEmployees: 19000,
      website: "https://www.blackrock.com"
    }
  },
  GS: {
    summaryDetail: {
      open: 397.68,
      dayHigh: 402.2,
      dayLow: 394.76,
      volume: 2400000,
      trailingPE: 14.59,
      marketCap: 130680000000,
      fiftyTwoWeekHigh: 420.39,
      fiftyTwoWeekLow: 312.51,
      averageVolume: 2500000,
      dividendYield: 0.025,
      beta: 1.4
    },
    defaultKeyStatistics: {
      trailingEps: 27.43
    },
    summaryProfile: {
      longBusinessSummary: "The Goldman Sachs Group, Inc. provides investment banking, securities, investment management, and consumer banking services globally.",
      sector: "Financial Services",
      industryDisp: "Capital Markets",
      country: "United States",
      fullTimeEmployees: 45000,
      website: "https://www.goldmansachs.com"
    }
  },
  C: {
    summaryDetail: {
      open: 51.39,
      dayHigh: 52.2,
      dayLow: 51.04,
      volume: 17000000,
      trailingPE: 8.13,
      marketCap: 99360000000,
      fiftyTwoWeekHigh: 57.5,
      fiftyTwoWeekLow: 42.04,
      averageVolume: 15000000,
      dividendYield: 0.044,
      beta: 1.4
    },
    defaultKeyStatistics: {
      trailingEps: 6.39
    },
    summaryProfile: {
      longBusinessSummary: "Citigroup Inc. provides financial products and services, including consumer banking, institutional banking, and wealth management across the globe.",
      sector: "Financial Services",
      industryDisp: "Banks—Diversified",
      country: "United States",
      fullTimeEmployees: 240000,
      website: "https://www.citigroup.com"
    }
  }
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

