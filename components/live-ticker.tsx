"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrencySymbol } from "@/lib/utils/currency";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const DEMO_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.45,
    change: 2.34,
    changePercent: 1.33,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.67,
    change: -1.23,
    changePercent: -0.85,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 398.21,
    change: 5.67,
    changePercent: 1.44,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.84,
    change: 8.92,
    changePercent: 3.81,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 156.78,
    change: -2.45,
    changePercent: -1.54,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 495.32,
    change: 12.45,
    changePercent: 2.58,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 389.54,
    change: 4.23,
    changePercent: 1.1,
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 421.33,
    change: -3.21,
    changePercent: -0.76,
  },
];

export function LiveTicker() {
  const [stocks, setStocks] = useState(DEMO_STOCKS);

  useEffect(() => {
    // Simulate realtime price updates
    const interval = setInterval(() => {
      setStocks(prevStocks =>
        prevStocks.map(stock => {
          // Random price change between -2 and +2
          const randomChange = (Math.random() - 0.5) * 4;
          const newPrice = stock.price + randomChange;
          const newChange = stock.change + randomChange;
          const newChangePercent = (newChange / (newPrice - newChange)) * 100;

          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            change: Number(newChange.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2)),
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Duplicate stocks for seamless loop
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <section className="relative bg-[#0A0A0A] border-t border-white/5 py-6 overflow-hidden">
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A] pointer-events-none z-10" />

      {/* Ticker content */}
      <div className="relative">
        <motion.div
          className="flex gap-8"
          animate={{
            x: [0, -100 * stocks.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {duplicatedStocks.map((stock, index) => {
            const currencySymbol = getCurrencySymbol(stock.symbol);
            return (
              <div
                key={`${stock.symbol}-${index}`}
                className="flex items-center gap-4 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-lg backdrop-blur-sm flex-shrink-0 min-w-[280px] group hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                {/* Stock Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">
                      {stock.symbol}
                    </span>
                    <span className="text-xs text-zinc-500 truncate max-w-[120px]">
                      {stock.name}
                    </span>
                  </div>
                  <div className="text-lg font-medium text-white">
                    {currencySymbol}
                    {stock.price.toFixed(2)}
                  </div>
                </div>

                {/* Price Change */}
                <div
                  className={`flex items-center gap-1 ${
                    stock.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}
                    </div>
                    <div className="text-xs">
                      {stock.changePercent >= 0 ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Pulse indicator for live updates */}
                <div className="relative">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-500"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
        <motion.div
          className="w-2 h-2 rounded-full bg-red-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span className="text-xs font-medium text-white">LIVE</span>
      </div>
    </section>
  );
}
