import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "./lib/utils";

interface PriceDisplayProps extends Omit<HTMLMotionProps<"div">, 'children'> {
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showCurrency?: boolean;
}

const PriceDisplay = React.forwardRef<HTMLDivElement, PriceDisplayProps>(
  ({ 
    price, 
    change, 
    changePercent, 
    currency = "$", 
    size = "md",
    showCurrency = true,
    className,
    ...props 
  }, ref) => {
    const isPositive = change >= 0;
    
    const sizeClasses = {
      sm: "text-lg",
      md: "text-2xl",
      lg: "text-4xl"
    };

    const changeSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    };

    return (
      <motion.div
        ref={ref}
        className={cn("flex items-baseline gap-2", className)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        <span className={cn("font-mono font-bold", sizeClasses[size])}>
          {showCurrency && currency}{price.toFixed(2)}
        </span>
        <motion.span
          className={cn(
            "font-medium font-mono",
            changeSizeClasses[size],
            isPositive ? "text-bullish" : "text-bearish"
          )}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: 0,
          }}
        >
          {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
        </motion.span>
      </motion.div>
    );
  }
);

PriceDisplay.displayName = "PriceDisplay";

export { PriceDisplay };