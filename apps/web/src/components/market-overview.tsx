"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity, Users, Zap, Globe, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

interface MarketStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

export function MarketOverview() {
  const [stats, setStats] = useState<MarketStat[]>([
    {
      label: "Market Cap",
      value: "$2.8T",
      change: "+2.4%",
      trend: "up",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "24h Volume",
      value: "$124.5B",
      change: "+5.8%",
      trend: "up",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      label: "Active Traders",
      value: "45.2K",
      change: "+12.3%",
      trend: "up",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Predictions Made",
      value: "892K",
      change: "+8.7%",
      trend: "up",
      icon: <Zap className="w-5 h-5" />,
    },
  ]);

  const [liveCount, setLiveCount] = useState(45234);

  useEffect(() => {
    // Animate live counter
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#0A0A0A] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm text-zinc-400">
              <span className="text-white font-medium">{liveCount.toLocaleString()}</span> traders online now
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-medium text-white mb-4"
          >
            Real-time{" "}
            <span className="relative inline-block">
              market insights
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M0 4C50 4 50 4 100 4C150 4 150 4 200 4"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Track global markets with AI-powered analytics and instant updates
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>

              {/* Value */}
              <div className="text-3xl font-semibold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>

              {/* Animated border on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-blue-500/0 group-hover:border-blue-500/20 transition-colors duration-300"
                initial={false}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Global Coverage</h3>
              <p className="text-sm text-zinc-500">
                Track stocks from 50+ exchanges worldwide
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Instant Updates</h3>
              <p className="text-sm text-zinc-500">
                Real-time data with sub-second latency
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">AI Predictions</h3>
              <p className="text-sm text-zinc-500">
                Machine learning powered forecasts
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
