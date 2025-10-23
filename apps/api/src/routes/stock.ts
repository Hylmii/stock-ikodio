import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

// Mock stock data
const mockStocks: Record<string, any> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    price: 178.32,
    change: 2.34,
    changePercent: 1.33,
    volume: 42300000,
    marketCap: 2800000000000,
    pe: 29.5,
    high52Week: 199.62,
    low52Week: 124.17,
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    exchange: "NASDAQ",
    currency: "USD",
    price: 142.65,
    change: -1.23,
    changePercent: -0.85,
    volume: 25100000,
    marketCap: 1800000000000,
    pe: 26.8,
    high52Week: 156.83,
    low52Week: 102.21,
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    currency: "USD",
    price: 412.89,
    change: 5.67,
    changePercent: 1.39,
    volume: 18900000,
    marketCap: 3100000000000,
    pe: 35.2,
    high52Week: 430.82,
    low52Week: 275.37,
  },
};

// GET /api/stocks/search?q=AAPL
router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.length < 1) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // TODO: Implement real stock search with external API
    // For now, return mock filtered data
    const results = Object.values(mockStocks).filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ results, count: results.length });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/stocks/:symbol/quote
router.get("/:symbol/quote", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    // TODO: Fetch real-time quote from external API
    const stock = mockStocks[upperSymbol];

    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/stocks/:symbol/history?interval=1d&range=1mo
router.get("/:symbol/history", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const interval = (req.query.interval as string) || "1d";
    const range = (req.query.range as string) || "1mo";

    // TODO: Fetch historical data from external API
    // Generate mock historical data
    const dataPoints = 30;
    const basePrice = 178.32;
    const now = Date.now();
    const data = [];

    for (let i = dataPoints; i >= 0; i--) {
      const timestamp = now - i * 24 * 60 * 60 * 1000;
      const volatility = 5;
      const change = (Math.random() - 0.5) * volatility;
      const open = basePrice + change;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      const volume = Math.floor(Math.random() * 50000000) + 10000000;

      data.push({
        timestamp,
        date: new Date(timestamp).toISOString().split("T")[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });
    }

    res.json({
      symbol: symbol.toUpperCase(),
      interval,
      range,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/stocks/:symbol/indicators
router.get("/:symbol/indicators", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    // TODO: Calculate real technical indicators
    // Return mock indicators
    const indicators = {
      symbol: symbol.toUpperCase(),
      timestamp: Date.now(),
      rsi: {
        value: 58.3,
        signal: "neutral",
        description: "RSI is in neutral territory",
      },
      macd: {
        value: 2.45,
        signal: "bullish",
        histogram: 1.23,
        description: "MACD shows bullish momentum",
      },
      bollinger: {
        upper: 185.5,
        middle: 178.3,
        lower: 171.1,
        signal: "bullish",
        description: "Price near upper band",
      },
      sma: {
        sma20: 176.5,
        sma50: 172.8,
        sma200: 165.3,
      },
      ema: {
        ema12: 177.2,
        ema26: 174.5,
      },
      volume: {
        current: 42300000,
        average: 38500000,
        signal: "bullish",
      },
    };

    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;