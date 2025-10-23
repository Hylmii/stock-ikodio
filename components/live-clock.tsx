"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface LiveClockProps {
  timezone?: string;
  showDate?: boolean;
  className?: string;
}

export function LiveClock({
  timezone,
  showDate = false,
  className = "",
}: LiveClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);

    // Detect user's timezone from their device
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      // Use provided timezone, or detected user timezone, or default
      timeZone: timezone || userTimezone || undefined,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      // Use provided timezone, or detected user timezone, or default
      timeZone: timezone || userTimezone || undefined,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-blue-400" />
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold text-white">
            --:--:--
          </span>
          {showDate && (
            <span className="text-xs text-gray-400">Loading...</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className="w-4 h-4 text-blue-400" />
      <div className="flex flex-col">
        <span className="font-mono text-sm font-semibold text-white">
          {formatTime(time)}
        </span>
        {showDate && (
          <span className="text-xs text-gray-400">{formatDate(time)}</span>
        )}
      </div>
    </div>
  );
}
