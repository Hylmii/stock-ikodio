"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  AlertCircle,
  Info,
  Sparkles,
  TrendingDown,
  Shield,
  Lightbulb,
  Newspaper,
} from "lucide-react";
import gsap from "gsap";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  generateStockAnalysis,
  type GeminiAnalysis,
} from "@/lib/services/gemini.service";
import type {
  PredictionMetrics,
  PredictionResult,
  Signal as SignalType,
} from "@/types/prediction";

interface DetailedAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionResult: PredictionResult;
}

export function DetailedAnalysisModal({
  isOpen,
  onClose,
  predictionResult,
}: DetailedAnalysisModalProps) {
  const { t, language } = useI18n();
  const [, forceUpdate] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysis | null>(
    null
  );
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const currencySymbol = getCurrencySymbol(predictionResult.symbol || "");
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => forceUpdate(prev => !prev);
    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  // Load Gemini AI analysis when modal opens
  useEffect(() => {
    if (isOpen && !geminiAnalysis && !isLoadingAI) {
      const loadAIAnalysis = async () => {
        setIsLoadingAI(true);
        try {
          const predictedPrice =
            predictionResult.predictions &&
            predictionResult.predictions.length > 0
              ? predictionResult.predictions[
                  predictionResult.predictions.length - 1
                ].predictedPrice
              : predictionResult.currentPrice;

          const analysis = await generateStockAnalysis(
            predictionResult.symbol || "",
            predictionResult.currentPrice || 0,
            predictedPrice || 0,
            predictionResult.signal?.type || "HOLD",
            predictionResult.metrics
          );
          setGeminiAnalysis(analysis);
        } catch (error) {
          console.error("Failed to load AI analysis:", error);
        } finally {
          setIsLoadingAI(false);
        }
      };
      loadAIAnalysis();
    }
  }, [isOpen, predictionResult, geminiAnalysis, isLoadingAI]);

  useEffect(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );

        gsap.fromTo(
          contentRef.current,
          {
            scale: 0.9,
            y: 50,
            opacity: 0,
          },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
          }
        );

        // Animate sections
        const sections = contentRef.current?.querySelectorAll("section");
        if (sections) {
          gsap.fromTo(
            sections,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              delay: 0.3,
              ease: "power2.out",
            }
          );
        }
      });

      return () => ctx.revert();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    metrics = {},
    signal = { signal: "HOLD", strength: 0, reason: "No signal" },
    predictions = [],
    currentPrice = 0,
    predictedChange,
    historicalData = [],
  } = predictionResult;

  // Calculate additional statistics
  const priceChange =
    predictions && predictions.length > 0
      ? predictions[predictions.length - 1].predictedPrice - currentPrice
      : 0;

  const volatility =
    historicalData && historicalData.length > 0
      ? Math.sqrt(
          historicalData.reduce((sum, point, idx, arr) => {
            if (idx === 0) return 0;
            const change = Math.abs(
              (point.close - arr[idx - 1].close) / arr[idx - 1].close
            );
            return sum + change * change;
          }, 0) / historicalData.length
        ) * 100
      : 0;

  const avgVolume =
    historicalData && historicalData.length > 0
      ? historicalData.reduce((sum, point) => sum + point.volume, 0) /
        historicalData.length
      : 0;

  const priceRange =
    historicalData && historicalData.length > 0
      ? {
          high: Math.max(...historicalData.map(d => d.high)),
          low: Math.min(...historicalData.map(d => d.low)),
        }
      : { high: currentPrice, low: currentPrice };

  const getSignalColor = (sig: SignalType) => {
    switch (sig) {
      case "BUY":
        return "text-emerald-400";
      case "SELL":
        return "text-red-400";
      case "HOLD":
        return "text-yellow-400";
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90)
      return { level: "Very High", color: "text-emerald-400" };
    if (confidence >= 80) return { level: "High", color: "text-emerald-400" };
    if (confidence >= 70)
      return { level: "Moderate", color: "text-yellow-400" };
    if (confidence >= 60) return { level: "Fair", color: "text-yellow-400" };
    return { level: "Low", color: "text-red-400" };
  };

  const confidenceLevel = getConfidenceLevel(metrics.confidence ?? 0);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
    >
      <div
        ref={contentRef}
        className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-black/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              {t("analysis.title")}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {t("analysis.subtitle", {
                symbol: predictionResult.symbol || "STOCK",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Trading Signal Analysis */}
          <section className="bg-black/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              {t("analysis.tradingSignalAnalysis")}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {t("analysis.signal")}
                  </p>
                  <p
                    className={`text-2xl font-bold ${getSignalColor(
                      signal?.signal || "HOLD"
                    )}`}
                  >
                    {signal?.signal || "HOLD"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {t("analysis.signalStrength")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {(signal?.strength || 0).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {t("analysis.predictedPriceChange")}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      (predictedChange ?? 0) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {(predictedChange ?? 0) >= 0 ? "+" : ""}
                    {(predictedChange ?? 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {t("analysis.priceTarget")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {currencySymbol}
                    {(currentPrice + priceChange).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-300 mb-2">
                  {t("analysis.signalReasoning")}:
                </p>
                <p className="text-gray-400">
                  {signal?.reason || t("analysis.signalReasoning")}
                </p>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-300 mb-2">
                  {t("analysis.technicalAnalysisTitle")}:
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <span className="text-white">{t("analysis.rsi")}:</span>{" "}
                    {t("analysis.rsiDesc1")}
                  </li>
                  <li>
                    <span className="text-white">{t("analysis.sma")}:</span>{" "}
                    {t("analysis.smaDesc2")}
                  </li>
                  <li>
                    <span className="text-white">{t("analysis.ema")}:</span>{" "}
                    {t("analysis.emaDesc2")}
                  </li>
                  <li>
                    <span className="text-white">{t("analysis.rsi")}:</span>{" "}
                    {t("analysis.rsiDesc2")}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Accuracy Metrics Deep Dive */}
          <section className="bg-black/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              {t("analysis.accuracyMetricsAnalysis")}
            </h3>

            <div className="space-y-4">
              {/* MAE */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-500">
                    {t("analysis.maeTitle")}
                  </h4>
                  <span className="text-2xl font-bold text-white">
                    {currencySymbol}
                    {(metrics.mae ?? 0).toFixed(4)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <strong className="text-white">
                      {t("analysis.whatItMeans")}
                    </strong>{" "}
                    {t("analysis.onAveragePredictionsDeviate")} {currencySymbol}
                    {(metrics.mae ?? 0).toFixed(4)}{" "}
                    {t("analysis.fromActualPrices")}.
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.formula")}:
                    </strong>{" "}
                    MAE = (1/n) × Σ|actual - predicted|
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.interpretation")}:
                    </strong>{" "}
                    {t("analysis.lowerIsBetter")} {currencySymbol}
                    {currentPrice.toFixed(2)}{" "}
                    {t("analysis.stockThisRepresents")}{" "}
                    {(((metrics.mae ?? 0) / currentPrice) * 100).toFixed(3)}%{" "}
                    {t("analysis.averageDeviation")}.
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.quality")}:
                    </strong>{" "}
                    {metrics.mae < 1
                      ? t("analysis.excellent")
                      : metrics.mae < 5
                      ? t("analysis.good")
                      : t("analysis.fair")}
                  </p>
                </div>
              </div>

              {/* RMSE */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-500">
                    {t("analysis.rmseTitle")}
                  </h4>
                  <span className="text-2xl font-bold text-white">
                    {currencySymbol}
                    {(metrics.rmse ?? 0).toFixed(4)}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <strong className="text-white">
                      {t("analysis.whatItMeans")}
                    </strong>{" "}
                    {t("analysis.measuresPrecision")}.
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.formula")}:
                    </strong>{" "}
                    RMSE = √[(1/n) × Σ(actual - predicted)²]
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.interpretation")}:
                    </strong>{" "}
                    {t("analysis.rmseSlightlyHigher")} ({currencySymbol}
                    {(metrics.rmse ?? 0).toFixed(4)} vs {currencySymbol}
                    {(metrics.mae ?? 0).toFixed(4)}),{" "}
                    {t("analysis.indicatingConsistent")}.
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.quality")}:
                    </strong>{" "}
                    {(metrics.rmse ?? 0) < 1
                      ? t("analysis.excellent")
                      : (metrics.rmse ?? 0) < 5
                      ? t("analysis.good")
                      : t("analysis.fair")}
                  </p>
                </div>
              </div>

              {/* MAPE */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-500">
                    {t("analysis.mapeTitle")}
                  </h4>
                  <span className="text-2xl font-bold text-white">
                    {(metrics.mape ?? 0).toFixed(2)}%
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <strong className="text-white">
                      {t("analysis.whatItMeans")}:
                    </strong>{" "}
                    {t("analysis.predictionsAccurateWithin")}{" "}
                    {(metrics.mape ?? 0).toFixed(2)}% {t("analysis.onAverage")}.
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.formula")}:
                    </strong>{" "}
                    MAPE = (100/n) × Σ|(actual - predicted)/actual|
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.interpretation")}:
                    </strong>{" "}
                    {t("analysis.thisMeans")}{" "}
                    {(100 - (metrics.mape ?? 0)).toFixed(2)}%{" "}
                    {t("analysis.predictionAccuracy")}
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.quality")}:
                    </strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      &lt;1%:{" "}
                      {metrics.mape < 1
                        ? `${t("analysis.excellent")} (${t(
                            "analysis.youAreHere"
                          )})`
                        : t("analysis.excellent")}
                    </li>
                    <li>
                      &lt;5%:{" "}
                      {metrics.mape >= 1 && metrics.mape < 5
                        ? `${t("analysis.veryGood")} (${t(
                            "analysis.youAreHere"
                          )})`
                        : t("analysis.veryGood")}
                    </li>
                    <li>
                      &lt;10%:{" "}
                      {metrics.mape >= 5 && metrics.mape < 10
                        ? `${t("analysis.good")} (${t("analysis.youAreHere")})`
                        : t("analysis.good")}
                    </li>
                    <li>
                      &lt;20%:{" "}
                      {metrics.mape >= 10 && metrics.mape < 20
                        ? `${t("analysis.fair")} (${t("analysis.youAreHere")})`
                        : t("analysis.fair")}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confidence */}
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-emerald-500">
                    Model Confidence
                  </h4>
                  <span
                    className={`text-2xl font-bold ${confidenceLevel.color}`}
                  >
                    {(metrics.confidence ?? 0).toFixed(0)}%
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>
                    <strong className="text-white">
                      {t("analysis.whatItMeans")}:
                    </strong>{" "}
                    {t("analysis.modelType").replace(":", "")}{" "}
                    {confidenceLevel.level.toLowerCase()} confidence in this
                    prediction.
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.calculation")}:
                    </strong>{" "}
                    {t("analysis.basedOnValidation")}
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.confidenceLevel")}:
                    </strong>{" "}
                    <span className={confidenceLevel.color}>
                      {confidenceLevel.level}
                    </span>
                  </p>
                  <p>
                    <strong className="text-white">
                      {t("analysis.quality")}:
                    </strong>{" "}
                    {metrics.confidence >= 80
                      ? t("analysis.reliabilityVeryHigh")
                      : metrics.confidence >= 60
                      ? t("analysis.reliabilityModerate")
                      : t("analysis.reliabilityLow")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Model Methodology */}
          <section className="bg-black/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              {t("analysis.predictionMethodology")}
            </h3>

            <div className="space-y-4 text-sm text-gray-400">
              <div>
                <h4 className="font-semibold text-white mb-2">
                  {t("analysis.modelType")}
                </h4>
                <p className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3">
                  <strong className="text-blue-500">
                    {predictionResult.modelUsed}
                  </strong>
                  <br />
                  {t("analysis.hybridApproach")}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">
                  {t("analysis.technicalIndicators")}
                </h4>
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 space-y-2">
                  <p>
                    <strong className="text-blue-500">
                      1. {t("analysis.sma")}
                    </strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>{t("analysis.calculatesAveragePrice")}</li>
                    <li>{t("analysis.smoothsOutFluctuations")}</li>
                    <li>Formula: SMA = (P₁ + P₂ + ... + Pₙ) / n</li>
                  </ul>

                  <p className="pt-2">
                    <strong className="text-purple-400">
                      2. {t("analysis.ema")}
                    </strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>{t("analysis.givesMoreWeight")}</li>
                    <li>{t("analysis.moreResponsive")}</li>
                    <li>
                      Formula: EMA = Price(t) × k + EMA(y) × (1 − k), where k =
                      2/(n+1)
                    </li>
                  </ul>

                  <p className="pt-2">
                    <strong className="text-orange-400">
                      3. {t("analysis.rsi")}
                    </strong>
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>{t("analysis.measuresMomentum")}</li>
                    <li>{t("analysis.range0to100")}</li>
                    <li>
                      Formula: RSI = 100 - [100 / (1 + RS)], where RS = Avg Gain
                      / Avg Loss
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">
                  {t("analysis.predictionProcess")}
                </h4>
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                  <ol className="space-y-2">
                    <li>
                      <strong>{t("analysis.step1Collect")}</strong>{" "}
                      {historicalData?.length || 0}{" "}
                      {t("analysis.historicalDataPoints")}
                    </li>
                    <li>
                      <strong>{t("analysis.step2Calculate")}</strong>
                    </li>
                    <li>
                      <strong>{t("analysis.step3Combine")}</strong>
                    </li>
                    <li>
                      <strong>{t("analysis.step4Generate")}</strong>{" "}
                      {predictions.length} {t("analysis.futurePredictions")}
                    </li>
                    <li>
                      <strong>{t("analysis.step5Backtest")}</strong>
                    </li>
                    <li>
                      <strong>{t("analysis.step6Calculate")}</strong>
                    </li>
                    <li>
                      <strong>{t("analysis.step7Generate")}</strong>
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">
                  {t("analysis.statisticalSummary")}:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("analysis.dataPointsUsed")}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {historicalData?.length || 0}
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("analysis.predictionsGenerated")}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {predictions.length}
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("analysis.priceVolatility")}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {volatility.toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("analysis.currentPrice")}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {currencySymbol}
                      {priceRange.low.toFixed(2)} - {currencySymbol}
                      {priceRange.high.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("analysis.avgVolume")}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {(avgVolume / 1000000).toFixed(2)}M
                    </p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("analysis.currentPrice")}
                    </p>
                    <p className="text-xl font-bold text-white">
                      {currencySymbol}
                      {currentPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI-Powered Analysis from Google Gemini */}
          <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t("analysis.aiPoweredAnalysis")}
                </h3>
                <p className="text-sm text-gray-400">
                  {t("analysis.poweredByGemini")}
                </p>
              </div>
            </div>

            {isLoadingAI && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">{t("prediction.analyzing")}</p>
                </div>
              </div>
            )}

            {!isLoadingAI && geminiAnalysis && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        {t("analysis.executiveSummary")}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {geminiAnalysis.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Market Sentiment */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">
                      {t("analysis.marketSentiment")}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        geminiAnalysis.marketSentiment === "bullish"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : geminiAnalysis.marketSentiment === "bearish"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {geminiAnalysis.marketSentiment === "bullish" &&
                        "🐂 BULLISH"}
                      {geminiAnalysis.marketSentiment === "bearish" &&
                        "🐻 BEARISH"}
                      {geminiAnalysis.marketSentiment === "neutral" &&
                        "➡️ NEUTRAL"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Key Insights */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-semibold text-white">
                        {t("analysis.keyInsights")}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {geminiAnalysis.keyInsights.map((insight, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex gap-2"
                        >
                          <span className="text-blue-400 flex-shrink-0">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recent News */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Newspaper className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-white">
                        {t("analysis.recentNews")}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {geminiAnalysis.recentNews.map((news, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex gap-2"
                        >
                          <span className="text-blue-400 flex-shrink-0">
                            📰
                          </span>
                          <span>{news}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="bg-[#0A0A0A] border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-red-400" />
                      <h4 className="font-semibold text-white">
                        {t("analysis.potentialRisks")}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {geminiAnalysis.risks.map((risk, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex gap-2"
                        >
                          <span className="text-red-400 flex-shrink-0">⚠️</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-[#0A0A0A] border border-emerald-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-white">
                        {t("analysis.potentialOpportunities")}
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {geminiAnalysis.opportunities.map((opp, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-300 flex gap-2"
                        >
                          <Lightbulb className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{opp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        {t("analysis.aiRecommendation")}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {geminiAnalysis.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isLoadingAI && !geminiAnalysis && (
              <div className="text-center py-8 text-gray-400">
                <p>{t("prediction.errorFailed")}</p>
              </div>
            )}
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-semibold mb-2">
                  {t("prediction.disclaimer")}:
                </p>
                <p className="text-yellow-200/80">
                  {t("analysis.disclaimerText")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 bg-[#0A0A0A]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
