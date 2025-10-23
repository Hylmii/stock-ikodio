"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import type {
  HistoricalDataPoint,
  PredictionDataPoint,
} from "@/types/prediction";
import {
  TrendingUp,
  TrendingDown,
  CandlestickChart,
  LineChart,
  BarChart3,
  Activity,
  Clock,
} from "lucide-react";
import { getCurrencySymbol } from "@/lib/utils/currency";
import { useI18n } from "@/lib/i18n/I18nContext";
import { getMarketTimezone, getTimezoneAbbr } from "@/lib/utils/market-hours";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartType = "candlestick" | "line" | "area" | "bar";

interface PredictionChartProps {
  historicalData: HistoricalDataPoint[];
  predictions?: PredictionDataPoint[]; // Make optional
  symbol: string;
  currentPrice: number;
  interval?: string;
}

export function PredictionChart({
  historicalData,
  predictions = [], // Default to empty array
  symbol,
  currentPrice,
  interval = "1d",
}: PredictionChartProps) {
  const { t } = useI18n();
  const [isMounted, setIsMounted] = useState(false);
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const currencySymbol = getCurrencySymbol(symbol);
  const marketTimezone = getMarketTimezone(symbol);
  const timezoneAbbr = getTimezoneAbbr(marketTimezone);

  useEffect(() => {
    setIsMounted(true);

    // Update current time every second for real-time display
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[500px] bg-[#111111] rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  // Calculate predicted price and change with validation
  const safeCurrentPrice =
    currentPrice && !isNaN(currentPrice) ? currentPrice : 0;
  const predictedPrice =
    predictions && predictions.length > 0
      ? predictions[predictions.length - 1].predictedPrice
      : safeCurrentPrice;
  const priceChange = predictedPrice - safeCurrentPrice;
  const priceChangePercent =
    safeCurrentPrice > 0 ? (priceChange / safeCurrentPrice) * 100 : 0;
  const isPriceUp = priceChange >= 0;

  // Get interval display name
  const getIntervalName = (interval: string) => {
    const intervalMap: Record<string, string> = {
      "1m": "One Minute",
      "5m": "Five Minutes",
      "15m": "Fifteen Minutes",
      "30m": "Thirty Minutes",
      "1h": "One Hour",
      "4h": "Four Hours",
      "1d": "One Day",
      "1w": "One Week",
      "1mo": "One Month",
    };
    return intervalMap[interval] || interval;
  };

  // Prepare historical data based on chart type with validation
  const candlestickData = (historicalData || [])
    .filter(d => d && d.open && d.high && d.low && d.close && d.timestamp)
    .map(d => ({
      x: new Date(d.timestamp),
      y: [d.open, d.high, d.low, d.close],
    }));

  const lineData = (historicalData || [])
    .filter(d => d && d.close && d.timestamp)
    .map(d => ({
      x: new Date(d.timestamp),
      y: d.close,
    }));

  // Prepare prediction line data (with safety check)
  const predictionLineData = (predictions || [])
    .filter(p => p && p.predictedPrice && p.timestamp)
    .map(p => ({
      x: new Date(p.timestamp),
      y: p.predictedPrice,
    }));

  // Prepare confidence band data (upper/lower bounds)
  const upperBandData = (predictions || [])
    .filter(p => p && p.predictedPrice && p.timestamp)
    .map(p => ({
      x: new Date(p.timestamp),
      y: p.upperBound || p.predictedPrice * 1.02,
    }));

  const lowerBandData = (predictions || [])
    .filter(p => p && p.predictedPrice && p.timestamp)
    .map(p => ({
      x: new Date(p.timestamp),
      y: p.lowerBound || p.predictedPrice * 0.98,
    }));

  // Prepare series based on selected chart type
  const getSeries = (): ApexAxisChartSeries => {
    const baseSeriesConfig = {
      prediction: {
        name: "Prediction",
        type: "line" as const,
        data: predictionLineData,
      },
      upperBound: {
        name: "Upper Bound",
        type: "line" as const,
        data: upperBandData,
      },
      lowerBound: {
        name: "Lower Bound",
        type: "line" as const,
        data: lowerBandData,
      },
    };

    switch (chartType) {
      case "candlestick":
        return [
          {
            name: "Price (Actual)",
            type: "candlestick",
            data: candlestickData,
          },
          baseSeriesConfig.prediction,
          baseSeriesConfig.upperBound,
          baseSeriesConfig.lowerBound,
        ];

      case "line":
        return [
          {
            name: "Price (Actual)",
            type: "line",
            data: lineData,
          },
          baseSeriesConfig.prediction,
          baseSeriesConfig.upperBound,
          baseSeriesConfig.lowerBound,
        ];

      case "area":
        return [
          {
            name: "Price (Actual)",
            type: "area",
            data: lineData,
          },
          baseSeriesConfig.prediction,
          baseSeriesConfig.upperBound,
          baseSeriesConfig.lowerBound,
        ];

      case "bar":
        return [
          {
            name: "Price (Actual)",
            type: "bar",
            data: lineData,
          },
          baseSeriesConfig.prediction,
          baseSeriesConfig.upperBound,
          baseSeriesConfig.lowerBound,
        ];

      default:
        return [
          {
            name: "Price (Actual)",
            type: "candlestick",
            data: candlestickData,
          },
          baseSeriesConfig.prediction,
          baseSeriesConfig.upperBound,
          baseSeriesConfig.lowerBound,
        ];
    }
  };

  const series = getSeries();

  const options: ApexOptions = {
    chart: {
      type: "candlestick",
      height: 500,
      background: "transparent",
      foreColor: "#9ca3af",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    theme: {
      mode: "dark",
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
        datetimeUTC: false,
      },
      axisBorder: {
        show: true,
        color: "#374151",
      },
      axisTicks: {
        show: true,
        color: "#374151",
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: value => `${currencySymbol}${value.toFixed(2)}`,
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#374151",
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981",
          downward: "#ef4444",
        },
        wick: {
          useFillColor: true,
        },
      },
      bar: {
        columnWidth: "70%",
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#ef4444",
            },
            {
              from: 0,
              to: Infinity,
              color: "#10b981",
            },
          ],
        },
      },
    },
    stroke: {
      width: [1, 3, 2, 2],
      curve: ["straight", "smooth", "smooth", "smooth"],
      dashArray: [0, 0, 5, 5],
    },
    colors: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
    fill: {
      type: ["solid", "solid", "gradient", "gradient"],
      opacity: [1, 0.9, 0.15, 0.15],
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.2,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 3,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      floating: false,
      fontSize: "12px",
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      labels: {
        colors: "#9ca3af",
        useSeriesColors: false,
      },
      markers: {
        size: 6,
        shape: "circle",
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 5,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      shared: true,
      intersect: false,
      x: {
        format: "dd MMM yyyy HH:mm",
      },
      y: {
        formatter: value => `${currencySymbol}${value?.toFixed(2) || "N/A"}`,
      },
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      marker: {
        show: true,
      },
    },
    annotations: {
      yaxis: [
        {
          y: currentPrice,
          borderColor: "#ffffff",
          strokeDashArray: 4,
          borderWidth: 2,
          opacity: 0.8,
          label: {
            borderColor: "#ffffff",
            borderWidth: 1,
            style: {
              color: "#000",
              background: "#ffffff",
              fontSize: "11px",
              fontWeight: 600,
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4,
              },
            },
            text: `Current: ${currencySymbol}${currentPrice.toFixed(2)}`,
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Chart Container */}
      <div className="flex-1 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                {symbol.replace(".JK", "")}
              </h3>
              <span className="text-xs text-gray-400 font-mono">
                {interval ? getIntervalName(interval) : "1D"}
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

          {/* Chart Type Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("candlestick")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                chartType === "candlestick"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                chartType === "line"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Line Chart"
            >
              <LineChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType("area")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                chartType === "area"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Area Chart"
            >
              <Activity className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                chartType === "bar"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
              title="Bar Chart"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4">
          <Chart
            options={options}
            series={series}
            type={chartType === "candlestick" ? "candlestick" : chartType}
            height={380}
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
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
              Prediction ({interval ? getIntervalName(interval) : "1D"})
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  isPriceUp ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {currencySymbol}
                {predictedPrice.toFixed(2)}
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
      </div>
    </div>
  );
}
