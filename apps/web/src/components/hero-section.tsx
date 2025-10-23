"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] pt-20 px-4"
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        style={{ y, opacity }}
      >
        {/* Main Heading with Underline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal mb-10 leading-[1.1] tracking-tight"
        >
          <span className="text-zinc-400">The </span>
          <span className="text-white font-medium">fastest way</span>
          <span className="text-zinc-400"> to </span>
          <span className="relative inline-block">
            <span className="text-white font-medium">trade</span>
            <svg
              className="absolute left-0 -bottom-2 w-full"
              height="8"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 6C50 2 150 2 199 6"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br />
          <span className="text-zinc-400">stocks with your </span>
          <span className="text-white font-medium">portfolio</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-zinc-500 mb-12 max-w-2xl mx-auto"
        >
          Generate trading insights quickly and easily using AI, all without
          leaving Ikodio
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={onGetStarted}
            className="group px-6 py-3.5 rounded-lg bg-white text-black font-medium text-base flex items-center gap-2 hover:bg-zinc-100 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            Try for free
          </motion.button>

          <motion.button
            className="px-6 py-3.5 rounded-lg border border-white/10 text-white font-medium text-base hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Watch demo
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
