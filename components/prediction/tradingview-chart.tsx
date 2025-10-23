"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { getMarketTimezone, getTimezoneAbbr } from "@/lib/utils/market-hours";

interface TradingViewChartProps {
  symbol: string;
  currentPrice: number;
  predictedPrice?: number;
  interval?: string;
}

// Mapping interval dari format kita ke TradingView format
const getIntervalMapping = (interval: string): string => {
  const mapping: Record<string, string> = {
    "1m": "1",
    "5m": "5",
    "15m": "15",
    "30m": "30",
    "1h": "60",
    "4h": "240",
    "1d": "D",
    "1w": "W",
    "1mo": "M",
  };
  return mapping[interval] || "5";
};

export function TradingViewChart({
  symbol,
  currentPrice,
  predictedPrice,
  interval = "5m",
}: TradingViewChartProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const currencySymbol = getCurrencySymbol(symbol);
  const marketTimezone = getMarketTimezone(symbol);
  const timezoneAbbr = getTimezoneAbbr(marketTimezone);

  // Format time in market timezone
  const formatMarketTime = () => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: marketTimezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(currentTime);
  };

  useEffect(() => {
    setIsMounted(true);

    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    // Convert symbol format (e.g., BBCA.JK -> IDX:BBCA)
    const getTradingViewSymbol = (sym: string): string => {
      if (sym.endsWith(".JK")) {
        // Indonesian stocks
        return `IDX:${sym.replace(".JK", "")}`;
      }
      // US stocks (default)
      return sym;
    };

    const tvSymbol = getTradingViewSymbol(symbol);
    const tvInterval = getIntervalMapping(interval);

    // Clear previous widget
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Create TradingView widget
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).TradingView &&
        containerRef.current
      ) {
        new (window as any).TradingView.widget({
          container_id: containerRef.current.id,
          autosize: true,
          symbol: tvSymbol,
          interval: tvInterval,
          timezone: "Asia/Jakarta",
          theme: "dark",
          style: "1", // Candlestick
          locale: "en",
          toolbar_bg: "#000000",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          backgroundColor: "#000000",
          gridColor: "#1a1a1a",
          hide_side_toolbar: false,
          allow_symbol_change: false,
          details: true,
          hotlist: false,
          calendar: false,
          studies: [
            "RSI@tv-basicstudies",
            "MASimple@tv-basicstudies",
            "MACD@tv-basicstudies",
          ],
          show_popup_button: false,
          popup_width: "1000",
          popup_height: "650",
          support_host: "https://www.tradingview.com",
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, isMounted]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-zinc-900/50 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">{t("common.loading")}</div>
      </div>
    );
  }

  const safeCurrentPrice =
    currentPrice && !isNaN(currentPrice) ? currentPrice : 0;
  const safePredictedPrice =
    predictedPrice && !isNaN(predictedPrice)
      ? predictedPrice
      : safeCurrentPrice;
  const priceChange = safePredictedPrice - safeCurrentPrice;
  const priceChangePercent =
    safeCurrentPrice > 0 ? (priceChange / safeCurrentPrice) * 100 : 0;
  const isPriceUp = priceChange >= 0;

  // Get interval display name
  const getIntervalName = (interval: string) => {
    const intervalKey = `interval.${interval}` as any;
    return t(intervalKey);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* TradingView Chart Container */}
      <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                {symbol.replace(".JK", "")}
              </h3>
              <span className="text-xs text-gray-400 font-mono bg-white/5 px-2 py-1 rounded">
                {getIntervalName(interval)}
              </span>
            </div>
            {/* Market Time */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="font-mono font-semibold text-white">
                {formatMarketTime()}
              </span>
              <span>({timezoneAbbr})</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">
              {t("prediction.poweredBy")}
            </div>
            <div className="text-sm font-semibold text-blue-400">
              TradingView
            </div>
          </div>
        </div>

        {/* TradingView Widget */}
        <div className="w-full h-[calc(100%-80px)]">
          <div
            id={`tradingview_chart_${symbol}`}
            ref={containerRef}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Price Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current Price */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Current Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {currencySymbol}
                {safeCurrentPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Predicted Price */}
        {predictedPrice && (
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                {t("price.prediction")} ({getIntervalName(interval)})
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold ${
                    isPriceUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {currencySymbol}
                  {safePredictedPrice.toFixed(2)}
                </span>
                <div className="flex items-center gap-1">
                  {isPriceUp ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      isPriceUp ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPriceUp ? "+" : ""}
                    {priceChangePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
