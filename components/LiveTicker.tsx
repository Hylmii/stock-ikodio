'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getStockQuotes } from '@/lib/actions/finnhub.actions';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export default function LiveTicker() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Popular stocks to track (real-time data)
        const popularSymbols = [
          'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'NFLX',
          'AMD', 'INTC', 'ORCL', 'ADBE', 'CRM', 'PYPL', 'DIS', 'UBER',
          'BABA', 'TSM', 'V', 'MA', 'COIN', 'SQ', 'SHOP', 'SNOW'
        ];

        const stockData = await getStockQuotes(popularSymbols);
        
        if (stockData.length > 0) {
          setStocks(stockData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setLoading(false);
      }
    };

    fetchStockData();
    // Update every 15 seconds for more real-time feel
    const interval = setInterval(fetchStockData, 15000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-black border-y border-white/5 py-6 overflow-hidden">
        <div className="flex items-center justify-center gap-3">
          <Activity className="h-5 w-5 text-white/30 animate-pulse" />
          <span className="text-white/50 text-sm font-medium">Loading real-time market data...</span>
        </div>
      </div>
    );
  }

  // Quadruple the stocks for ultra-smooth infinite scroll
  const repeatedStocks = [...stocks, ...stocks, ...stocks, ...stocks];

  return (
    <div className="relative w-full bg-black border-y border-white/5 py-6 overflow-hidden">
      {/* Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      {/* Live Indicator */}
      <div className="absolute top-2 right-6 flex items-center gap-2 z-20">
        <div className="relative">
          <div className="h-2 w-2 bg-white rounded-full animate-ping absolute opacity-75" />
          <div className="h-2 w-2 bg-white rounded-full" />
        </div>
        <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Live</span>
      </div>

      <div className="relative flex">
        <div className="flex animate-scroll-smooth gap-8 whitespace-nowrap">
          {repeatedStocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="group flex items-center gap-4 px-5 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              {/* Symbol */}
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
                  <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <span className="font-bold text-white text-base tracking-tight">
                  {stock.symbol}
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-col">
                <span className="text-white font-semibold text-base">
                  ${stock.price.toFixed(2)}
                </span>
                <span className="text-xs text-white/40">
                  Vol: {(stock.volume / 1000000).toFixed(1)}M
                </span>
              </div>

              {/* Change */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                  stock.change >= 0 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {stock.change >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span className="font-semibold text-sm">
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Separator */}
              <div className="h-8 w-px bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        .animate-scroll-smooth {
          animation: scroll-smooth 120s linear infinite;
        }
        .animate-scroll-smooth:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
