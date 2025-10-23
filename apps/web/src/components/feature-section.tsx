"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Bell,
  Shield,
  Zap,
  Brain,
  Clock,
} from "lucide-react";
import { Card } from "@project-ikodiomain/ui";

const features = [
  {
    icon: Brain,
    title: "AI Predictions",
    description:
      "Algoritma LSTM yang diprediksi harga saham dengan akurasi tinggi berdasarkan data historis dan pola pasar.",
  },
  {
    icon: Clock,
    title: "Real-Time Data",
    description:
      "Dapatkan update harga saham secara real-time dengan WebSocket untuk keputusan trading yang lebih cepat.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Analisis teknikal lengkap dengan indikator RSI, MACD, Bollinger Bands, dan lebih banyak lagi.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Notifikasi otomatis ketika harga mencapai target atau kondisi pasar berubah.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Sistem penilaian risiko untuk membantu Anda membuat keputusan investasi yang lebih aman.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Platform yang dioptimasi untuk performa tinggi dengan loading time kurang dari 1 detik.",
  },
];

export function FeatureSection() {
  return (
    <section className="py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal mb-6">
            <span className="text-zinc-400">Everything you need to </span>
            <span className="text-white font-medium">trade smarter</span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl">
            Powerful features designed for modern traders. From AI predictions
            to real-time analytics.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16"
        >
          <div>
            <div className="text-5xl font-semibold text-white mb-2">95%</div>
            <div className="text-sm text-zinc-500">Prediction Accuracy</div>
          </div>
          <div>
            <div className="text-5xl font-semibold text-white mb-2">10K+</div>
            <div className="text-sm text-zinc-500">Active Traders</div>
          </div>
          <div>
            <div className="text-5xl font-semibold text-white mb-2">$2M+</div>
            <div className="text-sm text-zinc-500">Daily Volume</div>
          </div>
          <div>
            <div className="text-5xl font-semibold text-white mb-2">24/7</div>
            <div className="text-sm text-zinc-500">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
