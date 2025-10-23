"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Activity,
  BarChart3,
  Info,
} from "lucide-react";
import gsap from "gsap";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { useI18n } from "@/lib/i18n/I18nContext";
import type {
  PredictionMetrics,
  Signal as SignalType,
  PredictionResult,
} from "@/types/prediction";
import { DetailedAnalysisModal } from "./detailed-analysis-modal";

interface MetricsDisplayProps {
  metrics: PredictionMetrics;
  signal: {
    signal?: SignalType;
    strength: number;
    reason?: string;
  };
  predictedChange?: number;
  predictionResult: PredictionResult;
}

export function MetricsDisplay({
  metrics,
  signal,
  predictedChange,
  predictionResult,
}: MetricsDisplayProps) {
  const { t, language } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, forceUpdate] = useState({});
  const signalRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const currencySymbol = getCurrencySymbol(predictionResult.symbol || "");

  // Re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => forceUpdate({});
    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (signalRef.current) {
        gsap.fromTo(
          signalRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.4)",
          }
        );
      }

      if (metricsRef.current) {
        const cards = metricsRef.current.querySelectorAll(".metric-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3,
            ease: "back.out(1.2)",
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const getSignalColor = (sig: SignalType) => {
    switch (sig) {
      case "BUY":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
      case "SELL":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "HOLD":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    }
  };

  const getSignalIcon = (sig: SignalType) => {
    switch (sig) {
      case "BUY":
        return <TrendingUp className="h-6 w-6" />;
      case "SELL":
        return <TrendingDown className="h-6 w-6" />;
      case "HOLD":
        return <Minus className="h-6 w-6" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-emerald-400";
    if (confidence >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Trading Signal Card */}
      <div
        ref={signalRef}
        className={`p-6 rounded-xl border-2 ${getSignalColor(
          signal.signal || "HOLD"
        )} transition-all duration-300`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getSignalIcon(signal.signal || "HOLD")}
            <div>
              <h3 className="text-2xl font-bold">{signal.signal || "HOLD"}</h3>
              <p className="text-sm opacity-80">{t("metrics.tradingSignal")}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {signal.strength.toFixed(0)}%
            </div>
            <p className="text-sm opacity-80">{t("metrics.strength")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Target className="h-4 w-4" />
          <span className="opacity-90">
            {signal.reason || "Analysis in progress"}
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-70">{t("metrics.predictedChange")}:</span>
            <span
              className={`font-bold ${
                (predictedChange ?? 0) >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {(predictedChange ?? 0) >= 0 ? "+" : ""}
              {(predictedChange ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Detail Analysis Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
      >
        <Info className="h-5 w-5" />
        <span>{t("metrics.detailedAnalysis")}</span>
        <BarChart3 className="h-5 w-5" />
      </button>

      {/* Metrics Grid */}
      <div
        ref={metricsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* MAE */}
        <div className="metric-card bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 hover:border-blue-600/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {t("metrics.mae")}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currencySymbol}
            {(metrics.mae ?? 0).toFixed(4)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t("metrics.avgPredictionAccuracy")}
          </p>
        </div>

        {/* RMSE */}
        <div className="metric-card bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 hover:border-blue-600/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {t("metrics.rmse")}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {currencySymbol}
            {(metrics.rmse ?? 0).toFixed(4)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t("metrics.predictionPrecision")}
          </p>
        </div>

        {/* MAPE */}
        <div className="metric-card bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 hover:border-blue-600/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {t("metrics.mape")}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(metrics.mape ?? 0).toFixed(2)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t("metrics.accuracyPercentage")}
          </p>
        </div>

        {/* Confidence */}
        <div className="metric-card bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 hover:border-blue-600/50 transition-all duration-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              {t("metrics.confidence")}
            </span>
          </div>
          <div
            className={`text-2xl font-bold ${getConfidenceColor(
              metrics.confidence ?? 0
            )}`}
          >
            {(metrics.confidence ?? 0).toFixed(0)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t("metrics.modelConfidence")}
          </p>
        </div>
      </div>

      {/* Metrics Explanation */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
        <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          {t("metrics.understandingMetrics")}
        </h4>
        <div className="space-y-3 text-sm text-gray-400">
          <p className="bg-black/50 border border-gray-800 rounded-lg p-3">
            <span className="text-blue-500 font-medium">
              {t("metrics.mae")}:
            </span>{" "}
            {t("metrics.maeDescription")}
          </p>
          <p className="bg-black/50 border border-gray-800 rounded-lg p-3">
            <span className="text-blue-500 font-medium">
              {t("metrics.rmse")}:
            </span>{" "}
            {t("metrics.rmseDescription")}
          </p>
          <p className="bg-black/50 border border-gray-800 rounded-lg p-3">
            <span className="text-blue-500 font-medium">
              {t("metrics.mape")}:
            </span>{" "}
            {t("metrics.mapeDescription")}
          </p>
          <p className="bg-black/50 border border-gray-800 rounded-lg p-3">
            <span className="text-emerald-500 font-medium">
              {t("metrics.confidence")}:
            </span>{" "}
            {t("metrics.confidenceDescription")}
          </p>
        </div>
      </div>

      {/* Detailed Analysis Modal */}
      <DetailedAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        predictionResult={predictionResult}
      />
    </div>
  );
}
