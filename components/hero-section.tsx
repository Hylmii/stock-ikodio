"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  TrendingDown,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n/I18nContext";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onGetStarted?: () => void;
}

interface IHSGData {
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
  priceHistory: number[];
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { t } = useI18n();
  const ref = React.useRef(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const buttonsRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [ihsgData, setIhsgData] = React.useState<IHSGData>({
    price: 7234.56,
    change: 45.23,
    changePercent: 0.63,
    timestamp: new Date().toLocaleTimeString("id-ID"),
    priceHistory: [7234.56, 7235.0, 7236.2, 7235.5, 7234.8], // Initialize with some data
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Fetch IHSG data from Finnhub API
  React.useEffect(() => {
    const fetchIHSGData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

        console.log("Fetching IHSG data from Finnhub...");

        // Fetch IHSG (Jakarta Composite Index)
        // Using ^JKSE symbol for IHSG
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=^JKSE&token=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch IHSG data");
        }

        const data = await response.json();

        console.log("Finnhub response:", data);

        // Finnhub response: { c: current, d: change, dp: changePercent, h: high, l: low, o: open, pc: previousClose }
        const currentPrice = data.c || 7234.56;
        const change = data.d || 0;
        const changePercent = data.dp || 0;

        console.log(
          "Price:",
          currentPrice,
          "Change:",
          change,
          "Change%:",
          changePercent
        );

        setIhsgData(prev => ({
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          timestamp: new Date().toLocaleTimeString("id-ID"),
          priceHistory: [...prev.priceHistory.slice(-59), currentPrice].slice(
            -60
          ),
        }));
      } catch (error) {
        console.error("Error fetching IHSG data:", error);

        // Fallback to simulated data if API fails
        const basePrice = 7234.56;
        const randomChange = (Math.random() - 0.5) * 10;
        const newPrice = basePrice + randomChange;

        console.log("Using fallback data - Price:", newPrice);

        setIhsgData(prev => ({
          price: newPrice,
          change: randomChange,
          changePercent: (randomChange / basePrice) * 100,
          timestamp: new Date().toLocaleTimeString("id-ID"),
          priceHistory: [...prev.priceHistory.slice(-59), newPrice].slice(-60),
        }));
      }
    };

    // Initial fetch
    fetchIHSGData();

    // Update every 10 seconds (to respect API rate limits)
    const interval = setInterval(fetchIHSGData, 10000);

    return () => clearInterval(interval);
  }, []);

  // Draw IHSG chart on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("Canvas ref not available");
      return;
    }

    if (ihsgData.priceHistory.length < 2) {
      console.log(
        "Not enough price history data:",
        ihsgData.priceHistory.length
      );
      return;
    }

    console.log(
      "Drawing chart with",
      ihsgData.priceHistory.length,
      "data points"
    );

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    console.log("Canvas dimensions:", width, "x", height);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const prices = ihsgData.priceHistory;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw price line
    ctx.beginPath();
    ctx.strokeStyle =
      ihsgData.change >= 0 ? "rgba(16, 185, 129, 1)" : "rgba(239, 68, 68, 1)";
    ctx.lineWidth = 4;

    prices.forEach((price, i) => {
      const x = (width / (prices.length - 1)) * i;
      const y = height - ((price - minPrice) / priceRange) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(
      0,
      ihsgData.change >= 0
        ? "rgba(16, 185, 129, 0.5)"
        : "rgba(239, 68, 68, 0.5)"
    );
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw current price point
    const lastX = width;
    const lastY =
      height - ((prices[prices.length - 1] - minPrice) / priceRange) * height;

    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.fillStyle =
      ihsgData.change >= 0 ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }, [ihsgData]);

  // GSAP Animations - Ultra Smooth & Elegant
  React.useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a master timeline for coordinated animations
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Heading words appear with stagger and slight rotation
      tl.from(headingRef.current?.querySelectorAll("span") || [], {
        opacity: 0,
        y: 100,
        rotationX: -20,
        transformPerspective: 1000,
        stagger: {
          each: 0.08,
          ease: "sine.inOut",
        },
        duration: 1.2,
        ease: "expo.out",
      });

      // Underline draws elegantly
      tl.from(
        ".hero-underline",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: "expo.inOut",
        },
        "-=0.6"
      );

      // Subtitle fades in with blur effect
      tl.from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 40,
          filter: "blur(10px)",
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5"
      );

      // Buttons appear with elastic bounce
      tl.from(
        buttonsRef.current?.children || [],
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
          stagger: 0.15,
          duration: 0.8,
          ease: "elastic.out(1, 0.6)",
        },
        "-=0.3"
      );

      // Parallax scroll effect
      gsap.to(headingRef.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -100,
        opacity: 0.5,
        ease: "none",
      });

      // Floating animation for buttons on hover
      if (buttonsRef.current?.children) {
        Array.from(buttonsRef.current.children).forEach(btn => {
          gsap.to(btn, {
            y: -5,
            duration: 0.6,
            ease: "power2.out",
            paused: true,
            repeat: -1,
            yoyo: true,
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A] pt-20 px-4"
    >
      {/* Live IHSG Chart Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
        style={{ filter: "blur(0.5px)" }}
      />

      {/* Glowing Orbs for Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        style={{ y, opacity }}
      >
        {/* Main Heading with Underline */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal mb-10 leading-[1.1] tracking-tight"
        >
          <span className="text-zinc-400">{t("hero.tagline1")} </span>
          <span className="text-white font-medium">{t("hero.tagline2")}</span>
          <span className="text-zinc-400"> {t("hero.tagline3")} </span>
          <span className="relative inline-block">
            <span className="text-white font-medium">{t("hero.tagline4")}</span>
            <svg
              className="hero-underline absolute left-0 -bottom-2 w-full"
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
          <span className="text-zinc-400">{t("hero.tagline5")} </span>
          <span className="text-white font-medium">{t("hero.tagline6")}</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base md:text-lg text-zinc-500 mb-12 max-w-2xl mx-auto"
        >
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={() => {
              console.log(
                "Hero Get Started clicked, onGetStarted:",
                onGetStarted
              );
              onGetStarted?.();
            }}
            className="group px-6 py-3.5 rounded-lg bg-white text-black font-medium text-base flex items-center gap-2 hover:bg-zinc-100 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            {t("hero.getStarted")}
          </motion.button>

          <motion.button
            className="px-6 py-3.5 rounded-lg border border-white/10 text-white font-medium text-base hover:bg-white/5 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("hero.watchDemo")}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
