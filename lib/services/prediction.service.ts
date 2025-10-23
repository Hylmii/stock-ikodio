/**
 * Get stock quote from GoAPI (primary)
 * API Key: 73c1f9e3-d1e4-5c30-aa10-6b2a4535
 * Docs: (asumsi endpoint, sesuaikan jika ada spesifik)
 */
export async function getGoAPIQuote(symbol: string) {
  try {
    // Contoh endpoint, sesuaikan jika berbeda
    const url = `https://api.goapi.id/v1/stock/idx/quote?symbol=${symbol}`;
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer 73c1f9e3-d1e4-5c30-aa10-6b2a4535",
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error("GoAPI quote failed");
    const data = await response.json();
    // Asumsi struktur data, sesuaikan jika berbeda
    if (data && data.data && data.data.last) {
      return {
        c: data.data.last, // current price
        h: data.data.high,
        l: data.data.low,
        o: data.data.open,
        pc: data.data.previous_close,
        t: Date.parse(data.data.time) / 1000 || Math.floor(Date.now() / 1000),
        source: "GoAPI",
      };
    }
    throw new Error("GoAPI: Data not found");
  } catch (err) {
    console.error("GoAPI quote error:", err);
    return null;
  }
}

import { StockOption, HistoricalDataPoint } from "@/types/prediction";
import {
  getYahooQuote,
  getYahooCandles,
  searchYahooStocks,
} from "./yahoo-finance.service";
import { getRTIQuote } from "./rti-business.service";

const FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

/**
 * Search stocks by query
 * Tries Finnhub first, falls back to Yahoo Finance
 */
export async function searchStocksForPrediction(
  query: string
): Promise<StockOption[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(
        query
      )}&token=${FINNHUB_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();

      if (data.result && data.result.length > 0) {
        const stocks = data.result.map((item: any) => ({
          symbol: item.symbol,
          description: item.description,
          displaySymbol: item.displaySymbol,
          type: item.type,
        }));
        console.log(`Finnhub search found ${stocks.length} stocks`);
        return stocks;
      }
    }

    // Fallback to Yahoo Finance
    console.log("Falling back to Yahoo Finance for search");
    return await searchYahooStocks(query);
  } catch (error) {
    console.error("Error searching stocks:", error);
    // Try Yahoo Finance as fallback
    try {
      return await searchYahooStocks(query);
    } catch (fallbackError) {
      console.error("Yahoo Finance search fallback failed:", fallbackError);
      return [];
    }
  }
}

/**
 * Get stock quote (current price)
 * Prioritas: GoAPI → RTI Business → Finnhub → Yahoo
 */
export async function getStockQuote(symbol: string) {
  // 1. Try GoAPI first
  const goapi = await getGoAPIQuote(symbol);
  if (goapi && goapi.c) {
    return goapi;
  }
  // 2. Fallback to RTI Business
  try {
    const rti = await getRTIQuote(symbol);
    if (rti && rti.price) {
      // Samakan struktur return agar konsisten
      return {
        c: rti.price,
        h: rti.price,
        l: rti.price,
        o: rti.price,
        pc: rti.price,
        t: Math.floor(Date.now() / 1000),
        source: "RTI Business",
      };
    }
  } catch (err) {
    console.error("RTI quote fallback error:", err);
  }
  // 3. Fallback to Finnhub
  try {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.c) {
        console.log(`Finnhub quote for ${symbol}: $${data.c}`);
        return data;
      }
    }
  } catch (error) {
    console.error("Finnhub quote error:", error);
  }
  // 4. Fallback to Yahoo Finance
  try {
    const yahooPrice = await getYahooQuote(symbol);
    if (yahooPrice) {
      return {
        c: yahooPrice,
        h: yahooPrice,
        l: yahooPrice,
        o: yahooPrice,
        pc: yahooPrice,
        t: Math.floor(Date.now() / 1000),
      };
    }
  } catch (fallbackError) {
    console.error("Yahoo Finance quote fallback failed:", fallbackError);
  }
  return null;
}

/**
 * Get candle data (OHLCV) for historical prices
 * Uses Yahoo Finance as primary source since Finnhub free tier doesn't support candles
 * Falls back to Finnhub for premium users
 */
export async function getStockCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<HistoricalDataPoint[]> {
  try {
    // Try Yahoo Finance first (free and reliable for historical data)
    console.log("Fetching candles from Yahoo Finance:", {
      symbol,
      resolution,
      from,
      to,
    });
    const yahooData = await getYahooCandles(symbol, resolution, from, to);

    if (yahooData.length > 0) {
      console.log(`Yahoo Finance returned ${yahooData.length} candles`);
      return yahooData;
    }

    // If Yahoo fails, try Finnhub (for premium users)
    if (!FINNHUB_API_KEY) {
      console.error("No data from Yahoo and Finnhub API key is missing");
      return [];
    }

    console.log("Yahoo Finance failed, trying Finnhub as backup...");
    const url = `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Finnhub candles also failed: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.error || data.s === "no_data" || !data.t || data.t.length === 0) {
      console.warn("No data from Finnhub either");
      return [];
    }

    // Transform Finnhub data to HistoricalDataPoint array
    const historicalData: HistoricalDataPoint[] = [];
    for (let i = 0; i < data.t.length; i++) {
      historicalData.push({
        timestamp: data.t[i] * 1000,
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
      });
    }

    console.log(`Finnhub returned ${historicalData.length} candles`);
    return historicalData;
  } catch (error) {
    console.error("Error getting stock candles:", error);
    return [];
  }
}
/**
 * Get popular stocks (US stocks)
 */
export async function getPopularStocks(): Promise<StockOption[]> {
  const popularSymbols = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "TSLA",
    "META",
    "NVDA",
    "NFLX",
    "AMD",
    "INTC",
  ];

  const stocks: StockOption[] = popularSymbols.map(symbol => ({
    symbol,
    description: symbol,
    displaySymbol: symbol,
    type: "Common Stock",
  }));

  return stocks;
}
