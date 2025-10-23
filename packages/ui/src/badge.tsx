import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        bullish: "bg-bullish/10 text-bullish border border-bullish/20",
        bearish: "bg-bearish/10 text-bearish border border-bearish/20",
        prediction: "bg-prediction/10 text-prediction border border-prediction/20",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        gradient: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        success: "bg-green-100 text-green-700 border border-green-200",
        warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        danger: "bg-red-100 text-red-700 border border-red-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };