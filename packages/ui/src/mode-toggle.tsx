import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "./lib/utils";

interface ModeToggleProps {
  mode: "normal" | "prediction";
  onModeChange: (mode: "normal" | "prediction") => void;
  className?: string;
}

const ModeToggle = React.forwardRef<HTMLDivElement, ModeToggleProps>(
  ({ mode, onModeChange, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center gap-1 p-1 rounded-full",
          "bg-gray-100/80 backdrop-blur-sm border border-gray-200/50",
          className
        )}
      >
        <motion.div
          className="absolute inset-y-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          animate={{
            x: mode === "normal" ? 2 : "calc(50% + 2px)",
            width: mode === "normal" ? "calc(50% - 4px)" : "calc(50% - 4px)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
        
        <button
          onClick={() => onModeChange("normal")}
          className={cn(
            "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors",
            mode === "normal" ? "text-white" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Normal
        </button>
        
        <button
          onClick={() => onModeChange("prediction")}
          className={cn(
            "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors",
            mode === "prediction" ? "text-white" : "text-gray-600 hover:text-gray-900"
          )}
        >
          Prediction
        </button>
      </div>
    );
  }
);

ModeToggle.displayName = "ModeToggle";

export { ModeToggle };