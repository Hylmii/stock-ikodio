"use server";

import type { HistoricalDataPoint, StockOption } from "@/types/prediction";

const YAHOO_BASE_URL = "https://query1.finance.yahoo.com/v8/finance";
const YAHOO_V10_URL = "https://query2.finance.yahoo.com/v1/finance";

/**
 * Get stock quote from Yahoo Finance
 */
export async function getYahooQuote(symbol: string): Promise<number | null> {
  try {
    const url = `${YAHOO_BASE_URL}/chart/${symbol}?interval=1d&range=1d`;
    console.log("Fetching Yahoo quote for:", symbol);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo quote fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      console.warn("No quote data from Yahoo Finance");
      return null;
    }

    const result = data.chart.result[0];
    const currentPrice = result.meta?.regularMarketPrice;

    if (!currentPrice) {
      return null;
    }

    console.log(`Yahoo quote for ${symbol}: $${currentPrice}`);
    return currentPrice;
  } catch (error) {
    console.error("Yahoo Finance quote error:", error);
    return null;
  }
}

/**
 * Get historical candle data from Yahoo Finance
 */
export async function getYahooCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<HistoricalDataPoint[]> {
  try {
    // Map resolution to Yahoo Finance interval
    const intervalMap: Record<string, string> = {
      "1": "1m",
      "5": "5m",
      "15": "15m",
      "30": "30m",
      "60": "1h",
      D: "1d",
      W: "1wk",
      M: "1mo",
    };

    const interval = intervalMap[resolution] || "1d";
    const url = `${YAHOO_BASE_URL}/chart/${symbol}?period1=${from}&period2=${to}&interval=${interval}`;

    console.log("Fetching Yahoo candles:", { symbol, interval, from, to });

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Yahoo candles fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      console.warn("No candle data from Yahoo Finance");
      return [];
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0];

    if (!quotes || timestamps.length === 0) {
      console.warn("Invalid candle data structure from Yahoo");
      return [];
    }

    const historicalData: HistoricalDataPoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      // Skip null values
      if (
        quotes.close[i] === null ||
        quotes.open[i] === null ||
        quotes.high[i] === null ||
        quotes.low[i] === null
      ) {
        continue;
      }

      historicalData.push({
        timestamp: timestamps[i] * 1000, // Convert to milliseconds
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i] || 0,
      });
    }

    console.log(`Yahoo Finance returned ${historicalData.length} candles`);
    return historicalData;
  } catch (error) {
    console.error("Yahoo Finance candles error:", error);
    return [];
  }
}

/**
 * Search stocks using Yahoo Finance
 */
export async function searchYahooStocks(query: string): Promise<StockOption[]> {
  try {
    const url = `${YAHOO_V10_URL}/search?q=${encodeURIComponent(
      query
    )}&quotesCount=10&newsCount=0`;

    console.log("Searching Yahoo stocks:", query);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      console.warn(
        `Yahoo search failed: ${response.statusText}, falling back to Finnhub`
      );
      return [];
    }

    const data = await response.json();

    if (!data.quotes || data.quotes.length === 0) {
      return [];
    }

    const stocks: StockOption[] = data.quotes
      .filter((q: any) => q.quoteType === "EQUITY")
      .map((quote: any) => ({
        symbol: quote.symbol,
        description: quote.longname || quote.shortname || quote.symbol,
        displaySymbol: quote.symbol,
        type: "Common Stock",
      }));

    console.log(`Yahoo search found ${stocks.length} stocks`);
    return stocks;
  } catch (error) {
    console.warn("Yahoo Finance search unavailable, using Finnhub fallback");
    return [];
  }
}
