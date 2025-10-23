// Prediction Feature Types
// FOKUS SHORT-TERM ONLY (Maksimal 1 jam)

export type PredictionInterval = "1m" | "5m" | "10m" | "15m" | "30m" | "1h";

export interface StockOption {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

export interface HistoricalDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PredictionDataPoint {
  timestamp: number;
  predictedPrice: number;
  lowerBound?: number;
  upperBound?: number;
  confidence?: number;
}

export interface PredictionMetrics {
  mae?: number; // Mean Absolute Error
  rmse?: number; // Root Mean Square Error
  mape?: number; // Mean Absolute Percentage Error
  confidence?: number; // 0-100%

  // Technical indicators
  rsi?: number;
  macd?: number;
  sma?: number;
  ema?: number;
  volatility?: number;
  volume?: number;

  // Multi-Modal specific metrics
  sentiment?: number; // AI sentiment score (-1 to +1)
  eventScore?: number; // Event bias score (-1 to +1)
  totalEvents?: number;
  criticalEvents?: number;
}

export type Signal = "BUY" | "SELL" | "HOLD";

export interface PredictionSignal {
  type?: Signal; // Made optional for compatibility
  signal?: Signal; // Legacy field
  strength: number; // 0-100%
  reason?: string;
  description?: string;
  stopLoss?: number;
  takeProfit?: number;
}

export interface PredictionResult {
  symbol?: string;
  interval?: PredictionInterval;
  predictions?: PredictionDataPoint[];
  historicalData?: HistoricalDataPoint[]; // Optional: include for chart rendering
  metrics?: PredictionMetrics;
  signal?: PredictionSignal;
  currentPrice: number;
  predictedPrice?: number;
  predictedChange?: number; // percentage
  changePercent?: number; // Alternative name
  timestamp?: number;
  modelUsed?: string;

  // New fields for Multi-Modal predictions
  confidence?: number;
  direction?: "UP" | "DOWN" | "SIDEWAYS";

  // Multi-Modal specific data
  multiModal?: {
    events?: {
      total: number;
      critical: number;
      bullishScore: number;
      bearishScore: number;
      neutralScore: number;
      recentEvents?: Array<{
        type: string;
        severity: string;
        description: string;
        timestamp: Date;
      }>;
    };
    aiInsights?: {
      sentiment: {
        label: string;
        score: number;
        reasoning: string;
      };
      trend: string;
      support: number | null;
      resistance: number | null;
      volatilityRisk: string;
      keyFactors: string[];
      anomalies: Array<{
        type: string;
        description: string;
        severity: number;
      }>;
    };
    explanation?: {
      summary: string;
      reasoning: string[];
      risks: string[];
      opportunities: string[];
    };
    performance?: {
      processingTime: number;
      dataQuality: {
        completeness: number;
        reliability: number;
      };
    };
    metadata?: {
      model: string;
      methodology: string;
      dataSource: string;
      expectedAccuracy: string;
      optimizedFor: string;
    };
  };
}

export interface PredictionRequest {
  symbol: string;
  interval: PredictionInterval;
  periods: number; // number of future periods to predict
}

export interface PredictionAPIResponse {
  success: boolean;
  data?: PredictionResult;
  error?: string;
  message?: string;
}

export const INTERVAL_OPTIONS: Array<{
  value: PredictionInterval;
  label: string;
  description: string;
}> = [
  {
    value: "1m",
    label: "1 Minute",
    description: "Ultra-fast scalping (highest frequency)",
  },
  {
    value: "5m",
    label: "5 Minutes",
    description: "Quick trades (day trading)",
  },
  {
    value: "10m",
    label: "10 Minutes",
    description: "Short-term momentum",
  },
  {
    value: "15m",
    label: "15 Minutes",
    description: "Intraday swing trades",
  },
  {
    value: "30m",
    label: "30 Minutes",
    description: "Extended intraday positions",
  },
  {
    value: "1h",
    label: "1 Hour",
    description: "Maximum timeframe (trend confirmation)",
  },
];
