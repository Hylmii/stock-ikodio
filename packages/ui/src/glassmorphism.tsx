import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const glassmorphismVariants = cva(
  "backdrop-blur-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        light: "bg-white/80 border-gray-200/20",
        dark: "bg-black/80 border-gray-800/20",
        purple: "bg-purple-500/10 border-purple-500/20",
        gradient:
          "bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20",
      },
      hover: {
        true: "hover:shadow-lg hover:border-purple-500/30",
        false: "",
      },
    },
    defaultVariants: {
      variant: "light",
      hover: false,
    },
  }
);

export interface GlassmorphismProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassmorphismVariants> {}

const Glassmorphism = React.forwardRef<HTMLDivElement, GlassmorphismProps>(
  ({ className, variant, hover, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassmorphismVariants({ variant, hover, className }))}
        {...props}
      />
    );
  }
);
Glassmorphism.displayName = "Glassmorphism";

export { Glassmorphism, glassmorphismVariants };
