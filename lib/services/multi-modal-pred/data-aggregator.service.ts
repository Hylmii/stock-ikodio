/**
 * Multi-Modal Data Aggregator Service
 * Implements Prompt 1: Data Aggregation & Preprocessing
 *
 * Responsibilities:
 * - Aggregate data from all APIs (Finnhub, Yahoo, GoAPI, RTI Business)
 * - Multi-interval synchronization (1m, 5m, 15m, 30m, 1h)
 * - Technical feature extraction (MA, RSI, MACD, Bollinger Bands, etc.)
 * - Order book analysis (bid-ask spread, depth)
 * - Volume analysis (VWAP, volume spikes)
 */

import { PredictionInterval } from "@/types/prediction";
import {
  getStockQuote,
  getStockCandles,
} from "@/lib/services/prediction.service";
import { getYahooQuote } from "@/lib/services/yahoo-finance.service";
import { getRTIQuote } from "@/lib/services/rti-business.service";
import { mean, standardDeviation } from "simple-statistics";
import { subMinutes, subHours } from "date-fns";

// Technical indicators interface
export interface TechnicalFeatures {
  // Moving Averages
  sma_5: number;
  sma_10: number;
  sma_20: number;
  ema_5: number;
  ema_10: number;
  ema_20: number;

  // Momentum Indicators
  rsi_14: number;
  macd: number;
  macd_signal: number;
  macd_histogram: number;

  // Volatility
  bollinger_upper: number;
  bollinger_middle: number;
  bollinger_lower: number;
  bollinger_bandwidth: number;
  atr_14: number; // Average True Range

  // Volume
  volume: number;
  volume_sma_20: number;
  volume_ratio: number;
  vwap: number; // Volume Weighted Average Price

  // Order Book (if available)
  bid_ask_spread: number;
  order_book_imbalance: number;

  // Price Action
  price_change_1m: number;
  price_change_5m: number;
  price_change_15m: number;
  price_change_pct: number;
  high_low_range: number;
}

export interface AggregatedData {
  symbol: string;
  timestamp: Date;
  interval: PredictionInterval;

  // Raw price data
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;

  // Technical features
  technical: TechnicalFeatures;

  // Multi-interval context
  context: {
    interval_1m?: number[];
    interval_5m?: number[];
    interval_15m?: number[];
    interval_30m?: number[];
    interval_1h?: number[];
  };

  // Order book snapshot
  orderBook?: {
    bids: Array<{ price: number; size: number }>;
    asks: Array<{ price: number; size: number }>;
  };

  // News & sentiment (to be filled by event detector)
  news?: any[];
}

export class DataAggregatorService {
  constructor() {
    // Using functional services from existing codebase
  }

  /**
   * Main aggregation function
   * Collects data from all sources and computes technical features
   */
  async aggregateData(
    symbol: string,
    interval: PredictionInterval
  ): Promise<AggregatedData> {
    try {
      console.log(
        `[DataAggregator] Starting aggregation for ${symbol} (${interval})`
      );

      // Parallel data fetching from all sources
      const [finnhubQuote, yahooQuote, rtiQuote, historicalData] =
        await Promise.allSettled([
          getStockQuote(symbol),
          getYahooQuote(symbol),
          this.fetchRTIQuote(symbol),
          this.fetchHistoricalData(symbol, interval),
        ]);

      // Extract price data
      const currentPrice = this.extractCurrentPrice(
        finnhubQuote,
        yahooQuote,
        rtiQuote
      );

      // Validate we have a valid price
      if (!currentPrice || currentPrice === 0) {
        throw new Error(
          `Unable to fetch current price for ${symbol}. The stock symbol may be invalid, delisted, or not supported by the data providers. Please try a different symbol (e.g., AAPL, MSFT for US stocks, or BBCA.JK, TLKM.JK for Indonesian stocks).`
        );
      }

      const historical = this.extractHistoricalData(historicalData);

      // Validate we have historical data
      if (!historical || historical.length === 0) {
        console.warn(
          `[DataAggregator] No historical data for ${symbol}, using current price only`
        );
        // Create minimal historical data from current price
        for (let i = 0; i < 20; i++) {
          historical.push({
            open: currentPrice,
            high: currentPrice,
            low: currentPrice,
            close: currentPrice,
            volume: 0,
          });
        }
      }

      // Calculate technical features (order book disabled for now)
      const technical = this.calculateTechnicalFeatures(
        currentPrice,
        historical,
        { status: "rejected", reason: "Not available" } as PromiseRejectedResult
      );

      // Build multi-interval context
      const context = await this.buildMultiIntervalContext(symbol, interval);

      // Build aggregated data object
      const aggregated: AggregatedData = {
        symbol,
        timestamp: new Date(),
        interval,

        open: historical[0]?.open || currentPrice,
        high: Math.max(...historical.map(h => h.high), currentPrice),
        low: Math.min(...historical.map(h => h.low), currentPrice),
        close: currentPrice,
        volume: historical.reduce((sum, h) => sum + h.volume, 0),

        technical,
        context,
        // Order book temporarily disabled
      };

      console.log(
        `[DataAggregator] Successfully aggregated data for ${symbol}`
      );
      return aggregated;
    } catch (error) {
      console.error("[DataAggregator] Error aggregating data:", error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive technical features
   */
  private calculateTechnicalFeatures(
    currentPrice: number,
    historical: Array<{
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>,
    orderBookData: PromiseSettledResult<any>
  ): TechnicalFeatures {
    const closes = historical.map(h => h.close);
    const highs = historical.map(h => h.high);
    const lows = historical.map(h => h.low);
    const volumes = historical.map(h => h.volume);

    // Moving Averages
    const sma_5 = this.calculateSMA(closes, 5);
    const sma_10 = this.calculateSMA(closes, 10);
    const sma_20 = this.calculateSMA(closes, 20);
    const ema_5 = this.calculateEMA(closes, 5);
    const ema_10 = this.calculateEMA(closes, 10);
    const ema_20 = this.calculateEMA(closes, 20);

    // RSI
    const rsi_14 = this.calculateRSI(closes, 14);

    // MACD
    const macdData = this.calculateMACD(closes);

    // Bollinger Bands
    const bollinger = this.calculateBollingerBands(closes, 20, 2);

    // ATR (Average True Range)
    const atr_14 = this.calculateATR(highs, lows, closes, 14);

    // Volume metrics
    const volume = volumes[volumes.length - 1] || 0;
    const volume_sma_20 = this.calculateSMA(volumes, 20);
    const volume_ratio = volume_sma_20 > 0 ? volume / volume_sma_20 : 1;
    const vwap = this.calculateVWAP(historical);

    // Order book metrics
    const orderBook = this.extractOrderBookMetrics(orderBookData);

    // Price changes
    const price_change_1m =
      closes.length > 1 ? currentPrice - closes[closes.length - 2] : 0;
    const price_change_5m =
      closes.length > 5 ? currentPrice - closes[closes.length - 6] : 0;
    const price_change_15m =
      closes.length > 15 ? currentPrice - closes[closes.length - 16] : 0;
    const price_change_pct =
      closes[0] > 0 ? ((currentPrice - closes[0]) / closes[0]) * 100 : 0;
    const high_low_range = Math.max(...highs) - Math.min(...lows);

    return {
      sma_5,
      sma_10,
      sma_20,
      ema_5,
      ema_10,
      ema_20,
      rsi_14,
      macd: macdData.macd,
      macd_signal: macdData.signal,
      macd_histogram: macdData.histogram,
      bollinger_upper: bollinger.upper,
      bollinger_middle: bollinger.middle,
      bollinger_lower: bollinger.lower,
      bollinger_bandwidth: bollinger.bandwidth,
      atr_14,
      volume,
      volume_sma_20,
      volume_ratio,
      vwap,
      bid_ask_spread: orderBook.spread,
      order_book_imbalance: orderBook.imbalance,
      price_change_1m,
      price_change_5m,
      price_change_15m,
      price_change_pct,
      high_low_range,
    };
  }

  /**
   * Build multi-interval context (prices from different timeframes)
   */
  private async buildMultiIntervalContext(
    symbol: string,
    currentInterval: PredictionInterval
  ): Promise<AggregatedData["context"]> {
    const intervals: PredictionInterval[] = ["1m", "5m", "15m", "30m", "1h"];
    const context: AggregatedData["context"] = {};

    const results = await Promise.allSettled(
      intervals.map(interval => this.fetchHistoricalData(symbol, interval))
    );

    results.forEach((result, index) => {
      const interval = intervals[index];
      if (result.status === "fulfilled" && Array.isArray(result.value)) {
        const key = `interval_${interval}` as keyof typeof context;
        if (key in context) {
          context[key] = result.value.map((d: any) => d.close);
        }
      }
    });

    return context;
  }

  // ============================================================================
  // TECHNICAL INDICATOR CALCULATIONS
  // ============================================================================

  private calculateSMA(values: number[], period: number): number {
    if (!values || values.length === 0) return 0;
    if (values.length < period) return values[values.length - 1] || 0;
    const slice = values.slice(-period);
    if (slice.length === 0) return 0;
    return mean(slice);
  }

  private calculateEMA(values: number[], period: number): number {
    if (!values || values.length === 0) return 0;
    if (values.length < period) {
      if (values.length === 0) return 0;
      return mean(values);
    }

    const multiplier = 2 / (period + 1);
    const initialSlice = values.slice(0, period);
    if (initialSlice.length === 0) return 0;
    let ema = mean(initialSlice);

    for (let i = period; i < values.length; i++) {
      ema = (values[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  private calculateRSI(closes: number[], period: number = 14): number {
    if (closes.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  }

  private calculateMACD(closes: number[]): {
    macd: number;
    signal: number;
    histogram: number;
  } {
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const macd = ema12 - ema26;

    // Calculate signal line (9-period EMA of MACD)
    const macdValues = [];
    for (let i = 26; i <= closes.length; i++) {
      const slice = closes.slice(0, i);
      const e12 = this.calculateEMA(slice, 12);
      const e26 = this.calculateEMA(slice, 26);
      macdValues.push(e12 - e26);
    }

    const signal = this.calculateEMA(macdValues, 9);
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  private calculateBollingerBands(
    closes: number[],
    period: number,
    stdDev: number
  ): {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
  } {
    if (!closes || closes.length === 0) {
      return { upper: 0, middle: 0, lower: 0, bandwidth: 0 };
    }

    if (closes.length < period) {
      const middle = closes.length > 0 ? mean(closes) : 0;
      return { upper: middle, middle, lower: middle, bandwidth: 0 };
    }

    const slice = closes.slice(-period);
    if (slice.length === 0) {
      return { upper: 0, middle: 0, lower: 0, bandwidth: 0 };
    }

    const middle = mean(slice);
    const std = standardDeviation(slice);
    const upper = middle + std * stdDev;
    const lower = middle - std * stdDev;
    const bandwidth = ((upper - lower) / middle) * 100;

    return { upper, middle, lower, bandwidth };
  }

  private calculateATR(
    highs: number[],
    lows: number[],
    closes: number[],
    period: number
  ): number {
    if (!highs || !lows || !closes || highs.length < period + 1) return 0;

    const trueRanges = [];
    for (let i = 1; i < highs.length; i++) {
      const high = highs[i];
      const low = lows[i];
      const prevClose = closes[i - 1];

      const tr = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
      trueRanges.push(tr);
    }

    if (trueRanges.length === 0) return 0;
    const slice = trueRanges.slice(-period);
    if (slice.length === 0) return 0;
    return mean(slice);
  }

  private calculateVWAP(
    historical: Array<{
      high: number;
      low: number;
      close: number;
      volume: number;
    }>
  ): number {
    if (historical.length === 0) return 0;

    let sumPV = 0;
    let sumV = 0;

    for (const bar of historical) {
      const typical = (bar.high + bar.low + bar.close) / 3;
      sumPV += typical * bar.volume;
      sumV += bar.volume;
    }

    return sumV > 0 ? sumPV / sumV : 0;
  }

  // ============================================================================
  // DATA EXTRACTION HELPERS
  // ============================================================================

  private extractCurrentPrice(
    finnhubResult: PromiseSettledResult<any>,
    yahooResult: PromiseSettledResult<any>,
    rtiResult: PromiseSettledResult<any>
  ): number {
    if (finnhubResult.status === "fulfilled" && finnhubResult.value?.c) {
      return finnhubResult.value.c;
    }
    if (yahooResult.status === "fulfilled" && yahooResult.value) {
      return yahooResult.value;
    }
    if (rtiResult.status === "fulfilled" && rtiResult.value?.price) {
      return rtiResult.value.price;
    }
    return 0;
  }

  private extractHistoricalData(
    historicalResult: PromiseSettledResult<any>
  ): Array<{
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }> {
    if (
      historicalResult.status === "fulfilled" &&
      Array.isArray(historicalResult.value)
    ) {
      return historicalResult.value;
    }
    return [];
  }

  private extractOrderBook(
    orderBookResult: PromiseSettledResult<any>
  ): AggregatedData["orderBook"] | undefined {
    if (orderBookResult.status === "fulfilled" && orderBookResult.value) {
      return orderBookResult.value;
    }
    return undefined;
  }

  private extractOrderBookMetrics(orderBookResult: PromiseSettledResult<any>): {
    spread: number;
    imbalance: number;
  } {
    if (orderBookResult.status === "fulfilled" && orderBookResult.value) {
      const { bids, asks } = orderBookResult.value;

      if (bids && asks && bids.length > 0 && asks.length > 0) {
        const bestBid = bids[0].price;
        const bestAsk = asks[0].price;
        const spread = bestAsk - bestBid;

        const bidVolume = bids.reduce((sum: number, b: any) => sum + b.size, 0);
        const askVolume = asks.reduce((sum: number, a: any) => sum + a.size, 0);
        const imbalance = (bidVolume - askVolume) / (bidVolume + askVolume);

        return { spread, imbalance };
      }
    }

    return { spread: 0, imbalance: 0 };
  }

  // ============================================================================
  // API FETCH METHODS
  // ============================================================================

  private async fetchRTIQuote(symbol: string): Promise<any> {
    try {
      return await getRTIQuote(symbol);
    } catch (error) {
      console.warn("[DataAggregator] RTI fetch failed:", error);
      return null;
    }
  }

  private async fetchHistoricalData(
    symbol: string,
    interval: PredictionInterval
  ): Promise<any[]> {
    try {
      // Use existing prediction service
      const resolution = this.intervalToResolution(interval);
      const { from, to } = this.calculateTimeRange(interval);

      const data = await getStockCandles(symbol, resolution, from, to);

      if (!data || data.length === 0) {
        return [];
      }

      // Data is already in correct format (HistoricalDataPoint[])
      return data;
    } catch (error) {
      console.warn("[DataAggregator] Historical data fetch failed:", error);
      return [];
    }
  }

  private intervalToResolution(
    interval: PredictionInterval
  ): "1" | "5" | "15" | "30" | "60" | "D" {
    const map: Record<
      PredictionInterval,
      "1" | "5" | "15" | "30" | "60" | "D"
    > = {
      "1m": "1",
      "5m": "5",
      "10m": "5", // Finnhub doesn't support 10m, use 5m
      "15m": "15",
      "30m": "30",
      "1h": "60",
    };
    return map[interval];
  }

  private calculateTimeRange(interval: PredictionInterval): {
    from: number;
    to: number;
  } {
    const now = Math.floor(Date.now() / 1000);
    const periods: Record<PredictionInterval, number> = {
      "1m": 60 * 60, // 1 hour
      "5m": 5 * 60 * 60, // 5 hours
      "10m": 10 * 60 * 60, // 10 hours
      "15m": 15 * 60 * 60, // 15 hours
      "30m": 24 * 60 * 60, // 1 day
      "1h": 2 * 24 * 60 * 60, // 2 days
    };

    return {
      from: now - periods[interval],
      to: now,
    };
  }

  private getDataPointsForInterval(interval: PredictionInterval): number {
    const map: Record<PredictionInterval, number> = {
      "1m": 60, // 1 hour of 1m data
      "5m": 60, // 5 hours of 5m data
      "10m": 60, // 10 hours of 10m data
      "15m": 60, // 15 hours of 15m data
      "30m": 48, // 24 hours of 30m data
      "1h": 48, // 2 days of 1h data
    };
    return map[interval] || 60;
  }
}
