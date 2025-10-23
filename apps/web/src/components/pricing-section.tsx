"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button, Badge } from "@project-ikodiomain/ui";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for beginners exploring stock trading",
    features: [
      "Basic price charts",
      "5 watchlist items",
      "Limited predictions (5/day)",
      "Community support",
      "Basic technical indicators",
    ],
    notIncluded: [
      "Real-time data",
      "Advanced AI predictions",
      "Priority support",
      "Export reports",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 49,
    period: "month",
    description: "For serious traders who need advanced tools",
    features: [
      "Real-time stock data",
      "Unlimited watchlist",
      "Unlimited AI predictions",
      "All technical indicators",
      "Price alerts",
      "Advanced charting tools",
      "Priority email support",
      "Export detailed reports",
    ],
    notIncluded: [],
    cta: "Start Pro Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    description: "For institutional traders and hedge funds",
    features: [
      "Everything in Pro",
      "API access",
      "Custom AI model training",
      "Multiple user accounts",
      "Dedicated account manager",
      "Custom integrations",
      "24/7 phone support",
      "Advanced risk analytics",
      "White-label option",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
];

interface PricingSectionProps {
  onGetStarted?: () => void;
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  const [billingPeriod, setBillingPeriod] = React.useState<
    "monthly" | "yearly"
  >("monthly");

  return (
    <section className="py-32 bg-[#0A0A0A] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal mb-6">
            <span className="text-zinc-400">Choose your </span>
            <span className="text-white font-medium">plan</span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10">
            Start trading smarter with AI-powered predictions. Choose the plan
            that fits your needs.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === "yearly"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`h-full p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "border-white/20 bg-white/[0.04] scale-105"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-semibold text-white">
                      $
                      {billingPeriod === "yearly"
                        ? Math.floor(plan.price * 0.8 * 12)
                        : plan.price}
                    </span>
                    <span className="text-zinc-500">
                      /{billingPeriod === "yearly" ? "year" : plan.period}
                    </span>
                  </div>
                  {billingPeriod === "yearly" && plan.price > 0 && (
                    <p className="text-sm text-green-400 mt-2">
                      Save ${Math.floor(plan.price * 0.2 * 12)} per year
                    </p>
                  )}
                </div>

                <button
                  onClick={onGetStarted}
                  className={`w-full mb-8 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                    plan.popular
                      ? "bg-white text-black hover:bg-zinc-100"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-4">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map(feature => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 opacity-40"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-zinc-600" />
                      </div>
                      <span className="text-sm text-zinc-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
