/**
 * Multi-Modal Event Detector Service
 * Implements Prompt 2: Event Detection
 *
 * Responsibilities:
 * - Detect price spike events (sudden price movements)
 * - Detect volume anomalies (unusual trading volume)
 * - Detect order book imbalances (bid-ask pressure)
 * - Detect news events (breaking news, earnings, announcements)
 * - Timestamp and categorize all events
 */

import { AggregatedData } from "./data-aggregator.service";
import { standardDeviation, mean } from "simple-statistics";
import { getRTIQuote } from "@/lib/services/rti-business.service";

export type EventType =
  | "PRICE_SPIKE_UP"
  | "PRICE_SPIKE_DOWN"
  | "VOLUME_SURGE"
  | "VOLUME_DROP"
  | "ORDER_BOOK_IMBALANCE_BUY"
  | "ORDER_BOOK_IMBALANCE_SELL"
  | "NEWS_POSITIVE"
  | "NEWS_NEGATIVE"
  | "NEWS_NEUTRAL"
  | "VOLATILITY_SURGE";

export type EventSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface DetectedEvent {
  type: EventType;
  severity: EventSeverity;
  timestamp: Date;

  // Event details
  description: string;
  value: number; // Magnitude of the event

  // Related data
  priceImpact?: number; // Expected price impact percentage
  confidence: number; // 0-1 confidence score

  // News-specific fields
  headline?: string;
  source?: string;
  newsUrl?: string;
}

export interface EventAnalysis {
  symbol: string;
  timestamp: Date;
  events: DetectedEvent[];

  // Summary statistics
  totalEvents: number;
  criticalEvents: number;
  averageSeverity: number;

  // Directional bias (from all events)
  bullishScore: number; // 0-100
  bearishScore: number; // 0-100
  neutralScore: number; // 0-100
}

export class EventDetectorService {
  // Thresholds for event detection
  private readonly PRICE_SPIKE_THRESHOLD = 0.5; // 0.5% price movement
  private readonly CRITICAL_PRICE_SPIKE = 2.0; // 2% critical movement
  private readonly VOLUME_SURGE_MULTIPLIER = 2.0; // 2x average volume
  private readonly CRITICAL_VOLUME_SURGE = 5.0; // 5x average volume
  private readonly ORDER_BOOK_IMBALANCE_THRESHOLD = 0.3; // 30% imbalance

  constructor() {
    // Using functional services from existing codebase
  }

  /**
   * Main event detection function
   * Analyzes aggregated data and detects all types of events
   */
  async detectEvents(data: AggregatedData): Promise<EventAnalysis> {
    console.log(`[EventDetector] Starting event detection for ${data.symbol}`);

    const events: DetectedEvent[] = [];

    // 1. Detect price spike events
    const priceEvents = this.detectPriceSpikes(data);
    events.push(...priceEvents);

    // 2. Detect volume anomalies
    const volumeEvents = this.detectVolumeAnomalies(data);
    events.push(...volumeEvents);

    // 3. Detect order book imbalances
    const orderBookEvents = this.detectOrderBookImbalances(data);
    events.push(...orderBookEvents);

    // 4. Detect volatility surges
    const volatilityEvents = this.detectVolatilitySurges(data);
    events.push(...volatilityEvents);

    // 5. Fetch and detect news events
    const newsEvents = await this.detectNewsEvents(data.symbol);
    events.push(...newsEvents);

    // Calculate summary statistics
    const analysis = this.buildEventAnalysis(data.symbol, events);

    console.log(
      `[EventDetector] Detected ${events.length} events (${analysis.criticalEvents} critical)`
    );
    return analysis;
  }

  /**
   * Detect price spike events (sudden price movements)
   */
  private detectPriceSpikes(data: AggregatedData): DetectedEvent[] {
    const events: DetectedEvent[] = [];
    const { technical } = data;

    // Check 1-minute price change
    if (Math.abs(technical.price_change_pct) >= this.PRICE_SPIKE_THRESHOLD) {
      const isUp = technical.price_change_pct > 0;
      const severity = this.calculatePriceSpikeSeverity(
        Math.abs(technical.price_change_pct)
      );

      events.push({
        type: isUp ? "PRICE_SPIKE_UP" : "PRICE_SPIKE_DOWN",
        severity,
        timestamp: data.timestamp,
        description: `${isUp ? "Upward" : "Downward"} price spike of ${Math.abs(
          technical.price_change_pct
        ).toFixed(2)}%`,
        value: technical.price_change_pct,
        priceImpact: technical.price_change_pct * 0.5, // Expect 50% continuation
        confidence: this.calculateConfidence(severity, technical.volume_ratio),
      });
    }

    // Check 5-minute price change
    if (
      Math.abs(technical.price_change_5m) >=
      this.PRICE_SPIKE_THRESHOLD * 1.5
    ) {
      const pctChange = (technical.price_change_5m / data.close) * 100;
      const isUp = pctChange > 0;
      const severity = this.calculatePriceSpikeSeverity(Math.abs(pctChange));

      events.push({
        type: isUp ? "PRICE_SPIKE_UP" : "PRICE_SPIKE_DOWN",
        severity,
        timestamp: data.timestamp,
        description: `5-minute ${isUp ? "rally" : "drop"} of ${Math.abs(
          pctChange
        ).toFixed(2)}%`,
        value: pctChange,
        priceImpact: pctChange * 0.3, // Expect 30% continuation
        confidence: this.calculateConfidence(severity, technical.volume_ratio),
      });
    }

    return events;
  }

  /**
   * Detect volume anomalies (unusual trading volume)
   */
  private detectVolumeAnomalies(data: AggregatedData): DetectedEvent[] {
    const events: DetectedEvent[] = [];
    const { technical } = data;

    // Volume surge detection
    if (technical.volume_ratio >= this.VOLUME_SURGE_MULTIPLIER) {
      const severity = this.calculateVolumeSurgeSeverity(
        technical.volume_ratio
      );

      events.push({
        type: "VOLUME_SURGE",
        severity,
        timestamp: data.timestamp,
        description: `Volume surge: ${technical.volume_ratio.toFixed(
          1
        )}x average`,
        value: technical.volume_ratio,
        priceImpact: Math.min((technical.volume_ratio - 1) * 0.5, 2.0), // Cap at 2%
        confidence: this.calculateConfidence(severity, technical.volume_ratio),
      });
    }

    // Volume drop detection (low liquidity warning)
    if (technical.volume_ratio < 0.3 && technical.volume_sma_20 > 0) {
      events.push({
        type: "VOLUME_DROP",
        severity: "MEDIUM",
        timestamp: data.timestamp,
        description: `Low liquidity: ${(technical.volume_ratio * 100).toFixed(
          0
        )}% of average volume`,
        value: technical.volume_ratio,
        priceImpact: 0,
        confidence: 0.7,
      });
    }

    return events;
  }

  /**
   * Detect order book imbalances (bid-ask pressure)
   */
  private detectOrderBookImbalances(data: AggregatedData): DetectedEvent[] {
    const events: DetectedEvent[] = [];
    const { technical } = data;

    if (
      Math.abs(technical.order_book_imbalance) >=
      this.ORDER_BOOK_IMBALANCE_THRESHOLD
    ) {
      const isBuyPressure = technical.order_book_imbalance > 0;
      const severity = this.calculateImbalanceSeverity(
        Math.abs(technical.order_book_imbalance)
      );

      events.push({
        type: isBuyPressure
          ? "ORDER_BOOK_IMBALANCE_BUY"
          : "ORDER_BOOK_IMBALANCE_SELL",
        severity,
        timestamp: data.timestamp,
        description: `Strong ${isBuyPressure ? "buy" : "sell"} pressure: ${(
          Math.abs(technical.order_book_imbalance) * 100
        ).toFixed(0)}% imbalance`,
        value: technical.order_book_imbalance,
        priceImpact: technical.order_book_imbalance * 1.5, // Imbalance often leads to movement
        confidence: this.calculateConfidence(severity, 1.5),
      });
    }

    return events;
  }

  /**
   * Detect volatility surges (using ATR and Bollinger Bandwidth)
   */
  private detectVolatilitySurges(data: AggregatedData): DetectedEvent[] {
    const events: DetectedEvent[] = [];
    const { technical } = data;

    // High Bollinger Bandwidth indicates high volatility
    if (technical.bollinger_bandwidth > 5.0) {
      const severity = technical.bollinger_bandwidth > 10.0 ? "HIGH" : "MEDIUM";

      events.push({
        type: "VOLATILITY_SURGE",
        severity,
        timestamp: data.timestamp,
        description: `High volatility detected: ${technical.bollinger_bandwidth.toFixed(
          1
        )}% bandwidth`,
        value: technical.bollinger_bandwidth,
        priceImpact: 0, // Volatility doesn't have directional bias
        confidence: 0.8,
      });
    }

    return events;
  }

  /**
   * Detect news events (breaking news, earnings, announcements)
   * Note: News APIs will be integrated later with Gemini AI
   */
  private async detectNewsEvents(symbol: string): Promise<DetectedEvent[]> {
    const events: DetectedEvent[] = [];

    try {
      // TODO: Integrate news APIs when available
      // For now, return empty array - will be enhanced with Gemini AI analysis
      console.log(
        "[EventDetector] News detection will be implemented with Gemini AI"
      );
    } catch (error) {
      console.warn("[EventDetector] News fetch failed:", error);
    }

    return events;
  }

  /**
   * Categorize news event based on keywords (basic sentiment)
   * Note: Gemini AI will do deeper analysis in next step
   */
  private categorizeNewsEvent(article: any): DetectedEvent | null {
    if (!article || !article.title) return null;

    const title = article.title.toLowerCase();

    // Positive keywords
    const positiveKeywords = [
      "profit",
      "surge",
      "gain",
      "growth",
      "bullish",
      "upgrade",
      "outperform",
      "beat",
      "strong",
      "positive",
      "record",
      "high",
      "rally",
      "acquisition",
    ];

    // Negative keywords
    const negativeKeywords = [
      "loss",
      "drop",
      "decline",
      "fall",
      "bearish",
      "downgrade",
      "underperform",
      "miss",
      "weak",
      "negative",
      "low",
      "crash",
      "selloff",
      "bankruptcy",
    ];

    let type: EventType = "NEWS_NEUTRAL";
    let sentiment = 0;

    // Simple keyword matching
    for (const keyword of positiveKeywords) {
      if (title.includes(keyword)) {
        sentiment += 1;
      }
    }
    for (const keyword of negativeKeywords) {
      if (title.includes(keyword)) {
        sentiment -= 1;
      }
    }

    if (sentiment > 0) type = "NEWS_POSITIVE";
    else if (sentiment < 0) type = "NEWS_NEGATIVE";

    const severity: EventSeverity =
      Math.abs(sentiment) >= 2 ? "HIGH" : "MEDIUM";

    return {
      type,
      severity,
      timestamp: new Date(
        article.publishedAt || article.timestamp || Date.now()
      ),
      description: article.title,
      value: sentiment,
      priceImpact: sentiment * 0.5, // Rough estimate
      confidence: 0.6, // Low confidence, will be improved by Gemini AI
      headline: article.title,
      source: article.source || "Unknown",
      newsUrl: article.url || article.link,
    };
  }

  /**
   * Build comprehensive event analysis
   */
  private buildEventAnalysis(
    symbol: string,
    events: DetectedEvent[]
  ): EventAnalysis {
    const criticalEvents = events.filter(e => e.severity === "CRITICAL").length;

    // Calculate average severity (as number)
    const severityMap = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    const averageSeverity =
      events.length > 0 ? mean(events.map(e => severityMap[e.severity])) : 0;

    // Calculate directional bias
    let bullishScore = 0;
    let bearishScore = 0;
    let neutralScore = 0;

    for (const event of events) {
      const weight = severityMap[event.severity];

      if (
        event.type.includes("UP") ||
        event.type === "NEWS_POSITIVE" ||
        event.type === "ORDER_BOOK_IMBALANCE_BUY"
      ) {
        bullishScore += weight * event.confidence;
      } else if (
        event.type.includes("DOWN") ||
        event.type === "NEWS_NEGATIVE" ||
        event.type === "ORDER_BOOK_IMBALANCE_SELL"
      ) {
        bearishScore += weight * event.confidence;
      } else {
        neutralScore += weight * event.confidence;
      }
    }

    // Normalize scores to 0-100
    const total = bullishScore + bearishScore + neutralScore;
    if (total > 0) {
      bullishScore = (bullishScore / total) * 100;
      bearishScore = (bearishScore / total) * 100;
      neutralScore = (neutralScore / total) * 100;
    }

    return {
      symbol,
      timestamp: new Date(),
      events,
      totalEvents: events.length,
      criticalEvents,
      averageSeverity,
      bullishScore,
      bearishScore,
      neutralScore,
    };
  }

  // ============================================================================
  // SEVERITY CALCULATION HELPERS
  // ============================================================================

  private calculatePriceSpikeSeverity(pctChange: number): EventSeverity {
    if (pctChange >= this.CRITICAL_PRICE_SPIKE) return "CRITICAL";
    if (pctChange >= 1.5) return "HIGH";
    if (pctChange >= 1.0) return "MEDIUM";
    return "LOW";
  }

  private calculateVolumeSurgeSeverity(ratio: number): EventSeverity {
    if (ratio >= this.CRITICAL_VOLUME_SURGE) return "CRITICAL";
    if (ratio >= 4.0) return "HIGH";
    if (ratio >= 3.0) return "MEDIUM";
    return "LOW";
  }

  private calculateImbalanceSeverity(imbalance: number): EventSeverity {
    if (imbalance >= 0.6) return "CRITICAL";
    if (imbalance >= 0.5) return "HIGH";
    if (imbalance >= 0.4) return "MEDIUM";
    return "LOW";
  }

  private calculateConfidence(
    severity: EventSeverity,
    volumeRatio: number
  ): number {
    // Base confidence on severity
    let confidence = {
      LOW: 0.5,
      MEDIUM: 0.7,
      HIGH: 0.85,
      CRITICAL: 0.95,
    }[severity];

    // Boost confidence if volume supports the event
    if (volumeRatio > 1.5) {
      confidence = Math.min(confidence + 0.1, 1.0);
    }

    return confidence;
  }
}
