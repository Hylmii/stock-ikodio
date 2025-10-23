"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

interface TimezoneClockProps {
  className?: string;
}

interface WorldClock {
  city: string;
  timezone: string;
  abbr: string;
}

const WORLD_MARKETS: WorldClock[] = [
  { city: "Jakarta", timezone: "Asia/Jakarta", abbr: "WIB" },
  { city: "New York", timezone: "America/New_York", abbr: "EST" },
  { city: "Tokyo", timezone: "Asia/Tokyo", abbr: "JST" },
  { city: "London", timezone: "Europe/London", abbr: "GMT" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong", abbr: "HKT" },
];

export function MultiTimezoneDisplay({ className = "" }: TimezoneClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [userTimezone, setUserTimezone] = useState<WorldClock | null>(null);

  useEffect(() => {
    // Detect user's timezone
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cityName =
      detectedTimezone.split("/").pop()?.replace(/_/g, " ") || "Local";

    setUserTimezone({
      city: cityName,
      timezone: detectedTimezone,
      abbr: "Local",
    });

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timezone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(time);
  };

  // Combine user timezone with world markets (only if different)
  const allMarkets = userTimezone
    ? [
        userTimezone,
        ...WORLD_MARKETS.filter(m => m.timezone !== userTimezone.timezone),
      ]
    : WORLD_MARKETS;

  return (
    <div
      className={`bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">World Markets Time</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {allMarkets.map((market, index) => (
          <div
            key={market.city + index}
            className={`bg-black/50 border rounded-lg p-2 ${
              index === 0 && userTimezone
                ? "border-blue-500/50"
                : "border-gray-800"
            }`}
          >
            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              {market.city}
              {index === 0 && userTimezone && (
                <span className="text-[10px] text-blue-400">(Your Time)</span>
              )}
            </div>
            <div className="font-mono text-sm font-semibold text-white">
              {formatTime(market.timezone)}
            </div>
            <div className="text-xs text-gray-500">{market.abbr}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
