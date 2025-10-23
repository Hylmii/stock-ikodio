"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import {
  getMarketStatus,
  formatTimeUntil,
  getTimezoneAbbr,
  type MarketStatus,
} from "@/lib/utils/market-hours";

interface MarketStatusBadgeProps {
  symbol: string;
  className?: string;
  showCountdown?: boolean;
}

export function MarketStatusBadge({
  symbol,
  className = "",
  showCountdown = true,
}: MarketStatusBadgeProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<MarketStatus | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    const updateStatus = () => {
      const newStatus = getMarketStatus(symbol);
      setStatus(newStatus);

      if (newStatus.nextOpen && !newStatus.isOpen) {
        setCountdown(formatTimeUntil(newStatus.nextOpen));
      } else if (newStatus.nextClose && newStatus.isOpen) {
        setCountdown(formatTimeUntil(newStatus.nextClose));
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [symbol]);

  if (!status) {
    return null;
  }

  const getStatusColor = () => {
    if (status.isOpen) return "text-green-400";
    if (status.isPreMarket) return "text-blue-400";
    if (status.isAfterHours) return "text-purple-400";
    return "text-red-400";
  };

  const getStatusText = () => {
    if (status.isOpen) return t("market.regularTrading");
    if (status.isPreMarket) return t("market.preMarket");
    if (status.isAfterHours) return t("market.afterHours");
    return t("market.closed");
  };

  const getCountdownLabel = () => {
    if (status.isOpen) return t("market.closesIn");
    return t("market.opensIn");
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-1">{t("market.status")}</div>
          <div className={`text-lg font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-1">
            {t("market.exchange")}
          </div>
          <div className="text-lg font-semibold text-white">
            {status.marketName} ({getTimezoneAbbr(status.timezone)})
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-white/60 text-sm mb-1">
            {showCountdown && countdown
              ? getCountdownLabel()
              : t("market.tradingHours")}
          </div>
          <div className="text-lg font-semibold text-white font-mono">
            {showCountdown && countdown ? countdown : status.tradingHours}
          </div>
        </div>
      </div>
    </div>
  );
}
