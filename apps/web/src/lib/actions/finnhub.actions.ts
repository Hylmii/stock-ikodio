"use server";

import { getDateRange, validateArticle, formatArticle } from "@/lib/utils";
import { cache } from "react";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY ?? "";
const NEXT_PUBLIC_FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";

// Debug: Log API key status on module load
console.log(" Finnhub API Key Status:");
console.log(
  "  FINNHUB_API_KEY:",
  FINNHUB_API_KEY ? `${FINNHUB_API_KEY.substring(0, 10)}...` : " NOT SET"
);
console.log(
  "  NEXT_PUBLIC_FINNHUB_API_KEY:",
  NEXT_PUBLIC_FINNHUB_API_KEY
    ? `${NEXT_PUBLIC_FINNHUB_API_KEY.substring(0, 10)}...`
    : " NOT SET"
);

async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number
): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } =
    revalidateSeconds
      ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
      : { cache: "no-store" };

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export { fetchJSON };

// Server action to get stock quotes for LiveTicker
export async function getStockQuotes(symbols: string[]): Promise<any[]> {
  try {
    const token = FINNHUB_API_KEY || NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      console.error("FINNHUB API key not found");
      return [];
    }

    const stockPromises = symbols.map(async symbol => {
      try {
        const response = await fetch(
          `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${token}`,
          { cache: "no-store" }
        );

        if (!response.ok) return null;
        const data = await response.json();

        // Only include stocks with valid data
        if (data.c && data.c > 0) {
          return {
            symbol,
            price: data.c,
            change: data.d || 0,
            changePercent: data.dp || 0,
            high: data.h || data.c,
            low: data.l || data.c,
            volume: data.v || 0,
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error);
        return null;
      }
    });

    const stockData = (await Promise.all(stockPromises)).filter(
      (stock): stock is any => stock !== null
    );

    return stockData;
  } catch (error) {
    console.error("Error in getStockQuotes:", error);
    return [];
  }
}

export async function getNews(
  symbols?: string[]
): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(5);
    const token = FINNHUB_API_KEY || NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      throw new Error("FINNHUB API key is not configured");
    }
    const cleanSymbols = (symbols || [])
      .map(s => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));

    const maxArticles = 6;

    // If we have symbols, try to fetch company news per symbol and round-robin select
    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

      await Promise.all(
        cleanSymbols.map(async sym => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(
              sym
            )}&from=${range.from}&to=${range.to}&token=${token}`;
            const articles = await fetchJSON<RawNewsArticle[]>(url, 300);
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (e) {
            console.error("Error fetching company news for", sym, e);
            perSymbolArticles[sym] = [];
          }
        })
      );

      const collected: MarketNewsArticle[] = [];
      // Round-robin up to 6 picks
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        // Sort by datetime desc
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
      // If none collected, fall through to general news
    }

    // General market news fallback or when no symbols provided
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`;
    const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300);

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];
    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break; // cap early before final slicing
    }

    const formatted = unique
      .slice(0, maxArticles)
      .map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (err) {
    console.error("getNews error:", err);
    throw new Error("Failed to fetch news");
  }
}

export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      // Get API key - prioritize server-side FINNHUB_API_KEY
      const token = FINNHUB_API_KEY || NEXT_PUBLIC_FINNHUB_API_KEY;

      // Validate API key exists and is not dummy
      if (!token || token === "dummy_key_for_testing" || token === "") {
        console.error(
          " Valid Finnhub API key is required!\n" +
            "Please:\n" +
            "1. Go to https://finnhub.io/register\n" +
            "2. Get your FREE API key\n" +
            "3. Add FINNHUB_API_KEY to .env.local\n" +
            "4. Restart the server"
        );
        return [];
      }

      const trimmed = typeof query === "string" ? query.trim() : "";

      // Require at least 1 character for search
      if (!trimmed || trimmed.length < 1) {
        console.log(
          "Search query too short. Please enter at least 1 character."
        );
        return [];
      }

      // Call Finnhub Symbol Lookup API
      const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(
        trimmed
      )}&token=${token}`;

      console.log(` Searching Finnhub API for: "${trimmed}"`);

      const data = await fetchJSON<FinnhubSearchResponse>(url, 0); // No cache for real-time search

      if (!data?.result || !Array.isArray(data.result)) {
        console.log("No results from Finnhub API");
        return [];
      }

      console.log(` Found ${data.result.length} results from Finnhub`);

      // Transform and filter results
      const results: StockWithWatchlistStatus[] = data.result
        .filter(r => {
          // Filter out irrelevant results (warrants, indices, funds, etc)
          const type = (r.type || "").toLowerCase();
          const symbol = r.symbol || "";

          // Allow common stocks, equity, and stocks without type
          // Exclude warrants, rights, funds, indices
          if (
            type.includes("warrant") ||
            type.includes("right") ||
            type.includes("fund") ||
            type.includes("index") ||
            type.includes("etf")
          ) {
            return false;
          }

          return (
            type.includes("common stock") ||
            type.includes("equity") ||
            type.includes("stock") ||
            type === ""
          );
        })
        .slice(0, 20) // Limit to top 20 results
        .map(r => {
          const symbol = (r.symbol || r.displaySymbol || "").toUpperCase();
          const name = r.description || symbol;
          const displaySymbol = r.displaySymbol || symbol;

          // Extract exchange from displaySymbol suffix
          let exchange = "US";
          if (displaySymbol.includes(".JK")) exchange = "IDX"; // Indonesia
          else if (displaySymbol.includes(".L")) exchange = "LSE"; // London
          else if (displaySymbol.includes(".T")) exchange = "TYO"; // Tokyo
          else if (displaySymbol.includes(".HK"))
            exchange = "HKEX"; // Hong Kong
          else if (displaySymbol.includes(".AX")) exchange = "ASX"; // Australia
          else if (displaySymbol.includes(".SS")) exchange = "SSE"; // Shanghai
          else exchange = displaySymbol.split(".")[0]; // Use as-is

          return {
            symbol,
            name,
            exchange,
            type: r.type || "Common Stock",
            isInWatchlist: false,
          };
        });

      console.log(` Returning ${results.length} filtered results`);
      return results;
    } catch (err) {
      console.error(" Error in stock search:", err);

      if (err instanceof Error) {
        if (err.message.includes("429")) {
          console.error(
            "  Finnhub API rate limit exceeded. Please wait a moment and try again."
          );
        } else if (err.message.includes("401") || err.message.includes("403")) {
          console.error(
            "  Invalid Finnhub API key. Please check your .env.local file."
          );
        }
      }

      return [];
    }
  }
);
