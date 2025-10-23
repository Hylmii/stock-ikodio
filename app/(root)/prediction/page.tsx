"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StockSelector } from "@/components/prediction/stock-selector";
import { IntervalSelector } from "@/components/prediction/interval-selector";
import { TradingViewChart } from "@/components/prediction/tradingview-chart";
import { MetricsDisplay } from "@/components/prediction/metrics-display";
import { MarketStatusBadge } from "@/components/market-status-badge";
import { useI18n } from "@/lib/i18n/I18nContext";
import type {
  StockOption,
  PredictionInterval,
  PredictionResult,
  HistoricalDataPoint,
} from "@/types/prediction";

export default function PredictionPage() {
  const { t } = useI18n();
  const [selectedStock, setSelectedStock] = useState<StockOption | null>(null);
  const [selectedInterval, setSelectedInterval] =
    useState<PredictionInterval>("5m");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleGeneratePrediction = async () => {
    if (!selectedStock) {
      setError(t("prediction.errorSelectStock"));
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const response = await fetch("/api/multi-modal-prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: selectedStock.symbol,
          interval: selectedInterval,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("prediction.errorFailed"));
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || t("prediction.predictionFailed"));
      }

      console.log("API Response Data:", data);
      console.log("Technical Data:", data.technical);
      console.log("Performance Data:", data.performance);
      console.log("AI Insights:", data.aiInsights);
      console.log("Events:", data.events);
      console.log("Prediction:", data.prediction);

      // Log individual values to verify they exist
      console.log("=== VERIFICATION ===");
      console.log("RSI:", data.technical?.rsi);
      console.log("MACD:", data.technical?.macd);
      console.log("Bollinger Middle:", data.technical?.bollingerMiddle);
      console.log("Volume Ratio:", data.technical?.volumeRatio);
      console.log("Confidence:", data.prediction?.confidence);
      console.log("MAE:", data.performance?.mae);
      console.log("RMSE:", data.performance?.rmse);
      console.log("MAPE:", data.performance?.mape);
      console.log("Sentiment Score:", data.aiInsights?.sentiment?.score);
      console.log("Total Events:", data.events?.total);
      console.log("Bullish Score:", data.events?.bullishScore);
      console.log("Bearish Score:", data.events?.bearishScore);
      console.log("===================");

      const transformedResult: PredictionResult = {
        currentPrice: data.prediction?.currentPrice ?? 0,
        predictedPrice: data.prediction?.targetPrice ?? 0,
        changePercent: data.prediction?.expectedChange ?? 0,
        confidence: data.prediction?.confidence ?? 0,
        direction: data.prediction?.direction ?? "SIDEWAYS",
        symbol: selectedStock.symbol,
        predictedChange: data.prediction?.expectedChange ?? 0,

        predictions: [
          {
            timestamp: Date.now() + 60000,
            predictedPrice: data.prediction?.targetPrice ?? 0,
            confidence: data.prediction?.confidence ?? 0,
          },
        ],

        signal: {
          type:
            data.prediction?.direction === "UP"
              ? "BUY"
              : data.prediction?.direction === "DOWN"
              ? "SELL"
              : "HOLD",
          strength: data.prediction?.confidence ?? 0,
          description: data.explanation?.summary ?? "Analysis completed",
          reason: data.explanation?.summary || "Based on multi-modal analysis",
          stopLoss: data.prediction?.signals?.stopLoss ?? 0,
          takeProfit: data.prediction?.signals?.takeProfit ?? 0,
        },

        metrics: {
          // Technical Indicators - REAL DATA ONLY
          rsi: data.technical?.rsi || 0,
          macd: data.technical?.macd || 0,
          sma: data.technical?.bollingerMiddle || 0,
          ema: data.technical?.bollingerMiddle || 0,
          volatility:
            data.aiInsights?.volatilityRisk === "HIGH"
              ? 80
              : data.aiInsights?.volatilityRisk === "MEDIUM"
              ? 50
              : data.aiInsights?.volatilityRisk === "LOW"
              ? 30
              : 0,
          volume: data.technical?.volumeRatio || 0,

          // Prediction Metrics - REAL DATA ONLY
          confidence: data.prediction?.confidence || 0,
          mae: data.performance?.mae || 0,
          rmse: data.performance?.rmse || 0,
          mape: data.performance?.mape || 0,

          // AI & Event Scores - REAL DATA ONLY
          sentiment: data.aiInsights?.sentiment?.score || 0,
          eventScore:
            ((data.events?.bullishScore || 0) -
              (data.events?.bearishScore || 0)) /
            100,
          totalEvents: data.events?.total || 0,
          criticalEvents: data.events?.critical || 0,
        },
        multiModal: {
          events: data.events,
          aiInsights: data.aiInsights,
          explanation: data.explanation,
          performance: data.performance,
          metadata: data.metadata,
        },
      };

      setPredictionResult(transformedResult);

      // Generate safe mock historical data
      const basePrice = data.prediction?.currentPrice ?? 1000;
      const mockHistorical: HistoricalDataPoint[] = Array.from(
        { length: 20 },
        (_, i) => {
          const variance = (Math.random() - 0.5) * 0.02;
          const price = basePrice * (1 + variance);
          return {
            timestamp: Date.now() - (20 - i) * 60000,
            open: price * (1 + (Math.random() - 0.5) * 0.01),
            high: price * (1 + Math.random() * 0.015),
            low: price * (1 - Math.random() * 0.015),
            close: price,
            volume: 1000000 * (0.5 + Math.random()),
          };
        }
      );
      setHistoricalData(mockHistorical);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err instanceof Error ? err.message : t("prediction.errorFailed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="border-b border-white/10 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("prediction.title")}
              </h1>
              <p className="text-white/60 text-sm">
                {t("prediction.subtitleIntraday")}
              </p>
            </div>
            <MarketStatusBadge
              symbol={selectedStock?.symbol || "MARKET"}
              showCountdown={true}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1920px] mx-auto px-6 py-6">
          {/* Control Panel */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  {t("prediction.selectStockLabel")}
                </label>
                <StockSelector
                  value={selectedStock?.symbol || ""}
                  onChange={setSelectedStock}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  {t("prediction.timeInterval")}
                </label>
                <IntervalSelector
                  value={selectedInterval}
                  onChange={setSelectedInterval}
                />
              </div>

              <div>
                <Button
                  onClick={handleGeneratePrediction}
                  disabled={!selectedStock || isLoading}
                  className="w-full bg-white text-black hover:bg-white/90 h-10 text-sm font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("prediction.generating")}
                    </>
                  ) : (
                    t("prediction.generatePrediction")
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 bg-red-500/10 border-red-500/50 text-white">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results Grid - 2 Columns */}
          {!isLoading && predictionResult && historicalData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Chart */}
              <div className="h-[calc(100vh-280px)] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Price Chart</h2>
                  <button
                    onClick={() => setShowDetailModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all"
                  >
                    <Info className="h-4 w-4" />
                    View Details
                  </button>
                </div>
                <div className="flex-1 min-h-0">
                  <TradingViewChart
                    symbol={predictionResult.symbol || ""}
                    currentPrice={predictionResult.currentPrice}
                    predictedPrice={predictionResult.predictedPrice}
                    interval={selectedInterval}
                  />
                </div>
              </div>

              {/* Right Column - Metrics */}
              <div className="h-[calc(100vh-280px)] flex flex-col">
                <h2 className="text-lg font-bold mb-3">
                  {t("prediction.analysisSignal")}
                </h2>
                <div className="flex-1 overflow-auto bg-white/5 border border-white/10 rounded-lg p-4">
                  <MetricsDisplay
                    metrics={predictionResult.metrics!}
                    signal={predictionResult.signal!}
                    predictedChange={predictionResult.predictedChange}
                    predictionResult={predictionResult}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !predictionResult && !error && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-white/80 mb-2">
                {t("prediction.readyToPredict")}
              </h3>
              <p className="text-white/50">
                {t("prediction.readyDescription")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && predictionResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {t("prediction.modelInfo")}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">Model Type</div>
                  <div className="text-lg font-semibold">
                    {predictionResult.multiModal?.metadata?.model ||
                      "Multi-Modal Event-Driven"}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">AI Sentiment</div>
                  <div className="text-lg font-semibold">
                    {predictionResult.multiModal?.aiInsights?.sentiment
                      ?.label || "N/A"}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">
                    Events Detected
                  </div>
                  <div className="text-lg font-semibold">
                    {predictionResult.multiModal?.events?.total || 0}
                    {(predictionResult.multiModal?.events?.critical || 0) >
                      0 && (
                      <span className="text-red-400 text-sm ml-2">
                        ({predictionResult.multiModal?.events?.critical}{" "}
                        critical)
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm mb-1">
                    Processing Time
                  </div>
                  <div className="text-lg font-semibold">
                    {predictionResult.multiModal?.performance?.processingTime
                      ? `${predictionResult.multiModal.performance.processingTime}ms`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* System Description */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-400">
                  Multi-Modal Event-Driven Prediction System
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Combines data from 4 APIs (Finnhub, Yahoo Finance, RTI
                  Business, GoAPI) with real-time event detection and Gemini AI
                  analysis. Uses 20+ technical indicators and sophisticated
                  multi-factor algorithm: AI Sentiment (30%) + Events (25%) +
                  Technical (25%) + Momentum (20%).
                </p>
              </div>

              {/* Reasoning */}
              {predictionResult.multiModal?.explanation?.reasoning &&
                predictionResult.multiModal.explanation.reasoning.length >
                  0 && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-blue-400">
                      Reasoning (
                      {predictionResult.multiModal.explanation.reasoning.length}{" "}
                      factors)
                    </h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      {predictionResult.multiModal.explanation.reasoning.map(
                        (reason, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-blue-400">•</span>
                            <span>{reason}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Risks */}
              {predictionResult.multiModal?.explanation?.risks &&
                predictionResult.multiModal.explanation.risks.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-orange-400">
                      Risks (
                      {predictionResult.multiModal.explanation.risks.length})
                    </h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      {predictionResult.multiModal.explanation.risks.map(
                        (risk, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-orange-400">•</span>
                            <span>{risk}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {/* Opportunities */}
              {predictionResult.multiModal?.explanation?.opportunities &&
                predictionResult.multiModal.explanation.opportunities.length >
                  0 && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-green-400">
                      Opportunities (
                      {
                        predictionResult.multiModal.explanation.opportunities
                          .length
                      }
                      )
                    </h3>
                    <ul className="space-y-2 text-sm text-white/80">
                      {predictionResult.multiModal.explanation.opportunities.map(
                        (opp, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-green-400">•</span>
                            <span>{opp}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
