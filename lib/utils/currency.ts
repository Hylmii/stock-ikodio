/**
 * Get currency symbol based on stock symbol
 * @param symbol - Stock symbol (e.g., "AAPL", "BRIS.JK", "BBCA.JK")
 * @returns Currency symbol (e.g., "$", "Rp")
 */
export function getCurrencySymbol(symbol: string): string {
  try {
    if (!symbol) return "$";

    const upperSymbol = symbol.toUpperCase();

    // Indonesian stocks (IDX)
    if (upperSymbol.endsWith(".JK") || upperSymbol.endsWith(".JKT")) {
      return "Rp";
    }

    // Japanese stocks
    if (upperSymbol.endsWith(".T") || upperSymbol.endsWith(".TYO")) {
      return "¥";
    }

    // Hong Kong stocks
    if (upperSymbol.endsWith(".HK")) {
      return "HK$";
    }

    // London stocks
    if (upperSymbol.endsWith(".L") || upperSymbol.endsWith(".LON")) {
      return "£";
    }

    // Euro stocks (various European exchanges)
    if (
      upperSymbol.endsWith(".DE") || // Germany
      upperSymbol.endsWith(".PA") || // Paris
      upperSymbol.endsWith(".MI") || // Milan
      upperSymbol.endsWith(".AS") || // Amsterdam
      upperSymbol.endsWith(".BR") // Brussels
    ) {
      return "€";
    }

    // Australian stocks
    if (upperSymbol.endsWith(".AX")) {
      return "A$";
    }

    // Canadian stocks
    if (upperSymbol.endsWith(".TO") || upperSymbol.endsWith(".V")) {
      return "C$";
    }

    // Singapore stocks
    if (upperSymbol.endsWith(".SI")) {
      return "S$";
    }

    // Default to USD (US stocks and others)
    return "$";
  } catch (error) {
    console.warn("Error getting currency symbol, defaulting to USD:", error);
    return "$";
  }
}

/**
 * Get currency code based on stock symbol
 * @param symbol - Stock symbol
 * @returns Currency code (e.g., "USD", "IDR")
 */
export function getCurrencyCode(symbol: string): string {
  try {
    if (!symbol) return "USD";

    const upperSymbol = symbol.toUpperCase();

    if (upperSymbol.endsWith(".JK") || upperSymbol.endsWith(".JKT"))
      return "IDR";
    if (upperSymbol.endsWith(".T") || upperSymbol.endsWith(".TYO"))
      return "JPY";
    if (upperSymbol.endsWith(".HK")) return "HKD";
    if (upperSymbol.endsWith(".L") || upperSymbol.endsWith(".LON"))
      return "GBP";
    if (
      upperSymbol.endsWith(".DE") ||
      upperSymbol.endsWith(".PA") ||
      upperSymbol.endsWith(".MI") ||
      upperSymbol.endsWith(".AS") ||
      upperSymbol.endsWith(".BR")
    )
      return "EUR";
    if (upperSymbol.endsWith(".AX")) return "AUD";
    if (upperSymbol.endsWith(".TO") || upperSymbol.endsWith(".V")) return "CAD";
    if (upperSymbol.endsWith(".SI")) return "SGD";
    return "USD";
  } catch (error) {
    console.warn("Error getting currency code, defaulting to USD:", error);
    return "USD";
  }
}

/**
 * Format price with appropriate currency
 * @param price - Price value
 * @param symbol - Stock symbol
 * @returns Formatted price string
 */
export function formatPrice(price: number, symbol: string): string {
  try {
    if (price === null || price === undefined || isNaN(price)) {
      return "$0.00";
    }

    const currencySymbol = getCurrencySymbol(symbol);
    const currencyCode = getCurrencyCode(symbol);

    // Indonesian Rupiah doesn't use decimals
    if (currencyCode === "IDR") {
      return `${currencySymbol}${Math.round(price).toLocaleString("id-ID")}`;
    }

    // Japanese Yen doesn't use decimals
    if (currencyCode === "JPY") {
      return `${currencySymbol}${Math.round(price).toLocaleString("ja-JP")}`;
    }

    // Most currencies use 2 decimal places
    return `${currencySymbol}${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } catch (error) {
    console.warn("Error formatting price, returning raw value:", error);
    return `$${price?.toFixed(2) || "0.00"}`;
  }
}
