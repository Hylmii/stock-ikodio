import { NextRequest, NextResponse } from "next/server";
import {
  getStockCandles,
  getStockQuote,
} from "@/lib/services/prediction.service";
import {
  intervalToResolution,
  calculateTimeRange,
} from "@/lib/utils/prediction";
import type {
  PredictionResult,
  PredictionDataPoint,
  PredictionMetrics,
  Signal,
  PredictionInterval,
} from "@/types/prediction";

/**
 * ML Prediction Engine
 * This is a simplified LSTM-like prediction using statistical methods
 * In production, replace with actual ML model (TensorFlow.js, ONNX, or backend ML service)
 */
class StockPredictor {
  /**
   * Calculate Simple Moving Average
   */
  private calculateSMA(data: number[], period: number): number[] {
    const sma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(NaN);
      } else {
        const sum = data
          .slice(i - period + 1, i + 1)
          .reduce((a, b) => a + b, 0);
        sma.push(sum / period);
      }
    }
    return sma;
  }

  /**
   * Calculate Exponential Moving Average
   */
  private calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        ema.push(data[i]);
      } else {
        ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1]);
      }
    }
    return ema;
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return rsi;
  }

  /**
   * Generate predictions using time series analysis
   * This uses a combination of trend, seasonality, and momentum
   */
  public predict(
    historicalPrices: number[],
    timestamps: number[],
    periods: number = 10
  ): PredictionDataPoint[] {
    const predictions: PredictionDataPoint[] = [];

    // Calculate moving averages
    const sma20 = this.calculateSMA(historicalPrices, 20);
    const ema12 = this.calculateEMA(historicalPrices, 12);
    const ema26 = this.calculateEMA(historicalPrices, 26);

    // Get last valid values
    const lastPrice = historicalPrices[historicalPrices.length - 1];
    const lastSMA = sma20.filter(v => !isNaN(v)).slice(-1)[0] || lastPrice;
    const lastEMA12 = ema12[ema12.length - 1];
    const lastEMA26 = ema26[ema26.length - 1];

    // Calculate trend
    const recentPrices = historicalPrices.slice(-20);
    const trend =
      recentPrices.reduce((sum, price, i) => {
        if (i === 0) return 0;
        return sum + (price - recentPrices[i - 1]);
      }, 0) /
      (recentPrices.length - 1);

    // Calculate volatility (standard deviation)
    const mean = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const variance =
      recentPrices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
      recentPrices.length;
    const volatility = Math.sqrt(variance);

    // Time delta between data points
    const timeDelta =
      timestamps.length > 1
        ? timestamps[timestamps.length - 1] - timestamps[timestamps.length - 2]
        : 60000; // default 1 minute

    let currentPrice = lastPrice;
    let currentTimestamp = timestamps[timestamps.length - 1];

    for (let i = 0; i < periods; i++) {
      currentTimestamp += timeDelta;

      // Combine trend and mean reversion
      const trendComponent = trend * 0.5;
      const meanReversionComponent = (lastSMA - currentPrice) * 0.2;
      const momentumComponent = (lastEMA12 - lastEMA26) * 0.1;

      // Add some dampening as we go further into future
      const dampening = Math.exp(-i * 0.1);

      const priceChange =
        (trendComponent + meanReversionComponent + momentumComponent) *
        dampening;

      currentPrice += priceChange;

      // Calculate confidence (decreases over time)
      const confidence = Math.max(50, 95 - i * 3);

      // Calculate prediction bounds based on volatility
      const boundRange = volatility * (1 + i * 0.2);

      predictions.push({
        timestamp: currentTimestamp,
        predictedPrice: currentPrice,
        lowerBound: currentPrice - boundRange,
        upperBound: currentPrice + boundRange,
        confidence: confidence,
      });
    }

    return predictions;
  }

  /**
   * Calculate prediction metrics (MAE, RMSE, MAPE)
   * Using backtesting on historical data
   */
  public calculateMetrics(
    actualPrices: number[],
    predictedPrices: number[]
  ): PredictionMetrics {
    const n = Math.min(actualPrices.length, predictedPrices.length);

    if (n === 0) {
      return { mae: 0, rmse: 0, mape: 0, confidence: 0 };
    }

    let sumAbsError = 0;
    let sumSqError = 0;
    let sumPercentError = 0;

    for (let i = 0; i < n; i++) {
      const actual = actualPrices[i];
      const predicted = predictedPrices[i];
      const error = actual - predicted;

      sumAbsError += Math.abs(error);
      sumSqError += error * error;
      sumPercentError += Math.abs(error / actual) * 100;
    }

    const mae = sumAbsError / n;
    const rmse = Math.sqrt(sumSqError / n);
    const mape = sumPercentError / n;

    // Calculate confidence based on MAPE (lower is better)
    const confidence = Math.max(0, Math.min(100, 100 - mape));

    return {
      mae: Number(mae.toFixed(4)),
      rmse: Number(rmse.toFixed(4)),
      mape: Number(mape.toFixed(2)),
      confidence: Number(confidence.toFixed(2)),
    };
  }

  /**
   * Generate trading signal based on predictions and indicators
   */
  public generateSignal(
    currentPrice: number,
    predictions: PredictionDataPoint[],
    historicalPrices: number[]
  ): { signal: Signal; strength: number; reason: string } {
    if (predictions.length === 0) {
      return { signal: "HOLD", strength: 0, reason: "Insufficient data" };
    }

    const firstPrediction = predictions[0].predictedPrice;
    const lastPrediction = predictions[predictions.length - 1].predictedPrice;

    const shortTermChange =
      ((firstPrediction - currentPrice) / currentPrice) * 100;
    const longTermChange =
      ((lastPrediction - currentPrice) / currentPrice) * 100;

    // Calculate RSI
    const rsi = this.calculateRSI(historicalPrices);

    // Calculate trend strength
    const avgConfidence =
      predictions.reduce((sum, p) => sum + (p.confidence || 0), 0) /
      predictions.length;

    let signal: Signal = "HOLD";
    let strength = 0;
    let reason = "";

    // Decision logic
    if (shortTermChange > 2 && longTermChange > 1 && rsi < 70) {
      signal = "BUY";
      strength = Math.min(100, avgConfidence * (shortTermChange / 10));
      reason = `Predicted ${shortTermChange.toFixed(
        2
      )}% increase. RSI: ${rsi.toFixed(1)}`;
    } else if (shortTermChange < -2 && longTermChange < -1 && rsi > 30) {
      signal = "SELL";
      strength = Math.min(
        100,
        avgConfidence * (Math.abs(shortTermChange) / 10)
      );
      reason = `Predicted ${shortTermChange.toFixed(
        2
      )}% decrease. RSI: ${rsi.toFixed(1)}`;
    } else {
      signal = "HOLD";
      strength = 50;
      reason = `Neutral trend (${shortTermChange.toFixed(
        2
      )}%). RSI: ${rsi.toFixed(1)}`;
    }

    return {
      signal,
      strength: Number(strength.toFixed(2)),
      reason,
    };
  }
}

/**
 * POST /api/prediction
 * Generate stock price predictions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, interval, periods = 10 } = body;

    if (!symbol || !interval) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: symbol and interval",
        },
        { status: 400 }
      );
    }

    console.log(`Generating prediction for ${symbol} at ${interval} interval`);

    // Get current quote
    const quote = await getStockQuote(symbol);
    if (!quote || !quote.c) {
      console.error(`Failed to get quote for ${symbol}`);
      return NextResponse.json(
        {
          success: false,
          error: `Unable to fetch price for ${symbol}. Try US stocks (AAPL, MSFT, GOOGL) for best results. Indonesian stocks may have limited support.`,
        },
        { status: 404 }
      );
    }

    const currentPrice = quote.c;

    // Get historical data
    const resolution = intervalToResolution(interval);
    const { from, to } = calculateTimeRange(interval);

    const candles = await getStockCandles(symbol, resolution, from, to);

    if (candles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No historical data available for this stock. This could be due to: 1) Finnhub API rate limit exceeded, 2) Invalid API key, or 3) Stock symbol not supported. Please try again later or check your API key.",
        },
        { status: 404 }
      );
    }

    console.log(`Fetched ${candles.length} historical data points`);

    // Extract prices and timestamps
    const historicalPrices = candles.map(c => c.close);
    const timestamps = candles.map(c => c.timestamp);

    // Initialize predictor
    const predictor = new StockPredictor();

    // Generate predictions
    const predictions = predictor.predict(
      historicalPrices,
      timestamps,
      periods
    );

    // Backtest: use last 10% of data for validation
    const validationSize = Math.floor(historicalPrices.length * 0.1);
    const trainPrices = historicalPrices.slice(0, -validationSize);
    const validationPrices = historicalPrices.slice(-validationSize);

    const backtestPredictions = predictor.predict(
      trainPrices,
      timestamps.slice(0, -validationSize),
      validationSize
    );

    const predictedValues = backtestPredictions.map(p => p.predictedPrice);
    const metrics = predictor.calculateMetrics(
      validationPrices,
      predictedValues
    );

    // Generate trading signal
    const signalData = predictor.generateSignal(
      currentPrice,
      predictions,
      historicalPrices
    );

    // Calculate predicted change
    const futurePrice =
      predictions.length > 0
        ? predictions[predictions.length - 1].predictedPrice
        : currentPrice;
    const predictedChange = ((futurePrice - currentPrice) / currentPrice) * 100;

    const result: PredictionResult = {
      symbol,
      interval: interval as PredictionInterval,
      predictions,
      historicalData: candles, // Include historical data for chart
      metrics,
      signal: signalData,
      currentPrice,
      predictedChange: Number(predictedChange.toFixed(2)),
      timestamp: Date.now(),
      modelUsed: "Time Series Analysis (SMA/EMA/RSI)",
    };

    console.log(
      `Prediction complete: ${signalData.signal} signal with ${metrics.confidence}% confidence`
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Prediction API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
