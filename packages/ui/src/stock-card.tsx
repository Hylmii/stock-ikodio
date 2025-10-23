import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "./lib/utils";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  onClick?: () => void;
  showMiniChart?: boolean;
}

const StockCard = React.forwardRef<HTMLDivElement, StockCardProps>(
  ({ symbol, name, price, change, changePercent, onClick, showMiniChart = false }, ref) => {
    const isPositive = change >= 0;

    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        className={cn(
          "p-4 rounded-xl backdrop-blur-xl bg-white/80 border border-gray-200/20",
          "hover:shadow-lg hover:border-purple-500/30 cursor-pointer",
          "transition-all duration-300"
        )}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg">{symbol}</h3>
            <p className="text-xs text-gray-500">{name}</p>
          </div>
          <div className={cn(
            "p-1.5 rounded-full",
            isPositive ? "bg-bullish/10" : "bg-bearish/10"
          )}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-bullish" />
            ) : (
              <TrendingDown className="w-4 h-4 text-bearish" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold font-mono">${price.toFixed(2)}</p>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-bullish" : "text-bearish"
            )}>
              {isPositive ? "+" : ""}{change.toFixed(2)}
            </span>
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-bullish" : "text-bearish"
            )}>
              ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {showMiniChart && (
          <div className="mt-3 h-8 bg-gray-100 rounded" />
        )}
      </motion.div>
    );
  }
);

StockCard.displayName = "StockCard";

export { StockCard };