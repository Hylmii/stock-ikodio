/**
 * Market Hours and Timezone Utilities
 * Handles market status detection and timezone mapping for global stock exchanges
 */

export interface MarketHours {
  open: string; // HH:MM format
  close: string; // HH:MM format
  timezone: string;
  name: string;
  days: number[]; // 1-5 for Mon-Fri
}

export interface MarketStatus {
  isOpen: boolean;
  marketName: string;
  timezone: string;
  currentTime: Date;
  nextOpen?: Date;
  nextClose?: Date;
  isPreMarket?: boolean;
  isAfterHours?: boolean;
  tradingHours: string;
}

// Major stock exchanges and their trading hours
const MARKET_EXCHANGES: Record<string, MarketHours> = {
  // Indonesia Stock Exchange
  IDX: {
    open: "09:00",
    close: "16:00",
    timezone: "Asia/Jakarta",
    name: "Indonesia Stock Exchange",
    days: [1, 2, 3, 4, 5], // Mon-Fri
  },

  // New York Stock Exchange & NASDAQ
  NYSE: {
    open: "09:30",
    close: "16:00",
    timezone: "America/New_York",
    name: "NYSE/NASDAQ",
    days: [1, 2, 3, 4, 5],
  },

  // Tokyo Stock Exchange
  TSE: {
    open: "09:00",
    close: "15:00",
    timezone: "Asia/Tokyo",
    name: "Tokyo Stock Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // Hong Kong Stock Exchange
  HKEX: {
    open: "09:30",
    close: "16:00",
    timezone: "Asia/Hong_Kong",
    name: "Hong Kong Stock Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // London Stock Exchange
  LSE: {
    open: "08:00",
    close: "16:30",
    timezone: "Europe/London",
    name: "London Stock Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // Shanghai Stock Exchange
  SSE: {
    open: "09:30",
    close: "15:00",
    timezone: "Asia/Shanghai",
    name: "Shanghai Stock Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // Australian Securities Exchange
  ASX: {
    open: "10:00",
    close: "16:00",
    timezone: "Australia/Sydney",
    name: "Australian Securities Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // Toronto Stock Exchange
  TSX: {
    open: "09:30",
    close: "16:00",
    timezone: "America/Toronto",
    name: "Toronto Stock Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // Singapore Exchange
  SGX: {
    open: "09:00",
    close: "17:00",
    timezone: "Asia/Singapore",
    name: "Singapore Exchange",
    days: [1, 2, 3, 4, 5],
  },

  // Deutsche Börse (Frankfurt)
  XETRA: {
    open: "09:00",
    close: "17:30",
    timezone: "Europe/Berlin",
    name: "Deutsche Börse",
    days: [1, 2, 3, 4, 5],
  },
};

/**
 * Get exchange identifier from stock symbol
 */
export function getExchangeFromSymbol(symbol: string): string {
  try {
    if (!symbol) return "NYSE";

    const upperSymbol = symbol.toUpperCase();

    // Indonesia stocks (.JK, .JKT)
    if (upperSymbol.endsWith(".JK") || upperSymbol.endsWith(".JKT")) {
      return "IDX";
    }

    // Japanese stocks (.T)
    if (upperSymbol.endsWith(".T")) {
      return "TSE";
    }

    // Hong Kong stocks (.HK)
    if (upperSymbol.endsWith(".HK")) {
      return "HKEX";
    }

    // London stocks (.L)
    if (upperSymbol.endsWith(".L")) {
      return "LSE";
    }

    // Shanghai stocks (.SS)
    if (upperSymbol.endsWith(".SS")) {
      return "SSE";
    }

    // Australian stocks (.AX)
    if (upperSymbol.endsWith(".AX")) {
      return "ASX";
    }

    // Toronto stocks (.TO)
    if (upperSymbol.endsWith(".TO")) {
      return "TSX";
    }

    // Singapore stocks (.SI)
    if (upperSymbol.endsWith(".SI")) {
      return "SGX";
    }

    // German stocks (.DE, .F)
    if (upperSymbol.endsWith(".DE") || upperSymbol.endsWith(".F")) {
      return "XETRA";
    }

    // Default to NYSE for US stocks (AAPL, TSLA, etc.)
    return "NYSE";
  } catch (error) {
    console.warn("Error detecting exchange, defaulting to NYSE:", error);
    return "NYSE";
  }
}

/**
 * Get timezone for a stock symbol
 */
export function getMarketTimezone(symbol: string): string {
  try {
    if (!symbol) return "America/New_York";
    const exchange = getExchangeFromSymbol(symbol);
    return MARKET_EXCHANGES[exchange]?.timezone || "America/New_York";
  } catch (error) {
    console.warn("Error getting timezone, defaulting to EST:", error);
    return "America/New_York";
  }
}

/**
 * Get current time in specific timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone || "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const getValue = (type: string) =>
      parts.find(p => p.type === type)?.value || "0";

    return new Date(
      `${getValue("year")}-${getValue("month")}-${getValue("day")}T${getValue(
        "hour"
      )}:${getValue("minute")}:${getValue("second")}`
    );
  } catch (error) {
    console.warn("Error getting time in timezone, using current time:", error);
    return new Date();
  }
}

/**
 * Check if market is currently open
 */
export function getMarketStatus(symbol: string): MarketStatus {
  try {
    const exchange = getExchangeFromSymbol(symbol);
    const marketHours = MARKET_EXCHANGES[exchange] || MARKET_EXCHANGES.NYSE;

    // Get current time in market timezone
    const now = new Date();
    const marketTime = new Date(
      now.toLocaleString("en-US", { timeZone: marketHours.timezone })
    );

    const day = marketTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentMinutes = marketTime.getHours() * 60 + marketTime.getMinutes();

    // Parse trading hours
    const [openHour, openMinute] = marketHours.open.split(":").map(Number);
    const [closeHour, closeMinute] = marketHours.close.split(":").map(Number);
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    // Check if it's a trading day
    const isTradingDay = marketHours.days.includes(day);

    // Check if market is open
    const isOpen =
      isTradingDay &&
      currentMinutes >= openMinutes &&
      currentMinutes < closeMinutes;

    // Check pre-market (for US markets)
    const isPreMarket =
      exchange === "NYSE" &&
      isTradingDay &&
      currentMinutes >= 4 * 60 && // 04:00
      currentMinutes < openMinutes;

    // Check after-hours (for US markets)
    const isAfterHours =
      exchange === "NYSE" &&
      isTradingDay &&
      currentMinutes >= closeMinutes &&
      currentMinutes < 20 * 60; // 20:00

    // Calculate next open/close
    let nextOpen: Date | undefined;
    let nextClose: Date | undefined;

    if (isOpen) {
      // Market is open, calculate next close
      nextClose = new Date(marketTime);
      nextClose.setHours(closeHour, closeMinute, 0, 0);
    } else {
      // Market is closed, calculate next open
      nextOpen = new Date(marketTime);

      if (isTradingDay && currentMinutes < openMinutes) {
        // Same day, before opening
        nextOpen.setHours(openHour, openMinute, 0, 0);
      } else {
        // Find next trading day
        let daysToAdd = 1;
        let nextDay = (day + daysToAdd) % 7;

        while (!marketHours.days.includes(nextDay)) {
          daysToAdd++;
          nextDay = (day + daysToAdd) % 7;
        }

        nextOpen.setDate(nextOpen.getDate() + daysToAdd);
        nextOpen.setHours(openHour, openMinute, 0, 0);
      }
    }

    return {
      isOpen,
      marketName: marketHours.name,
      timezone: marketHours.timezone,
      currentTime: marketTime,
      nextOpen,
      nextClose,
      isPreMarket,
      isAfterHours,
      tradingHours: `${marketHours.open} - ${marketHours.close}`,
    };
  } catch (error) {
    console.warn("Error getting market status, returning default:", error);
    // Return default closed status for NYSE
    const now = new Date();
    return {
      isOpen: false,
      marketName: "NYSE/NASDAQ",
      timezone: "America/New_York",
      currentTime: now,
      nextOpen: undefined,
      nextClose: undefined,
      isPreMarket: false,
      isAfterHours: false,
      tradingHours: "09:30 - 16:00",
    };
  }
}

/**
 * Format time remaining until next event
 */
export function formatTimeUntil(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) return "Now";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Get timezone abbreviation
 */
export function getTimezoneAbbr(timezone: string): string {
  const abbrs: Record<string, string> = {
    "Asia/Jakarta": "WIB",
    "America/New_York": "EST",
    "Asia/Tokyo": "JST",
    "Asia/Hong_Kong": "HKT",
    "Europe/London": "GMT",
    "Asia/Shanghai": "CST",
    "Australia/Sydney": "AEST",
    "America/Toronto": "EST",
    "Asia/Singapore": "SGT",
    "Europe/Berlin": "CET",
  };

  return abbrs[timezone] || "UTC";
}
