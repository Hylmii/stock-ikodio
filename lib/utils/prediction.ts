/**
 * Convert prediction interval to Finnhub resolution
 */
export function intervalToResolution(interval: string): string {
  const mapping: Record<string, string> = {
    "1m": "1",
    "5m": "5",
    "10m": "15", // Finnhub doesn't have 10m, use 15m
    "30m": "30",
    "1h": "60",
    "1d": "D",
    "1w": "W",
    "1M": "M",
    "1y": "M", // Use monthly for yearly predictions
  };
  return mapping[interval] || "D";
}

/**
 * Calculate time range based on interval
 */
export function calculateTimeRange(interval: string): {
  from: number;
  to: number;
} {
  const now = Math.floor(Date.now() / 1000);
  let from = now;

  switch (interval) {
    case "1m":
    case "5m":
    case "10m":
      from = now - 86400; // 1 day
      break;
    case "30m":
      from = now - 86400 * 3; // 3 days
      break;
    case "1h":
      from = now - 86400 * 7; // 1 week
      break;
    case "1d":
      from = now - 86400 * 365; // 1 year
      break;
    case "1w":
      from = now - 86400 * 730; // 2 years
      break;
    case "1M":
      from = now - 86400 * 1095; // 3 years
      break;
    case "1y":
      from = now - 86400 * 3650; // 10 years
      break;
    default:
      from = now - 86400 * 365; // default 1 year
  }

  return { from, to: now };
}
