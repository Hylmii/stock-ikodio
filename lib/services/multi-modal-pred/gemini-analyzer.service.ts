/**
 * Gemini AI Multi-Modal Analyzer Service
 * Implements Prompt 3: Multi-Modal Feature Extraction with Gemini AI
 * 
 * Responsibilities:
 * - Sentiment analysis of news and social media
 * - Event identification and categorization
 * - Headline summarization and key information extraction
 * - Anomaly scoring (news impact vs price movements)
 * - Natural language insights generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AggregatedData } from './data-aggregator.service';
import { EventAnalysis, DetectedEvent, EventType } from './event-detector.service';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export interface GeminiSentiment {
  score: number; // -1 to +1 (bearish to bullish)
  magnitude: number; // 0 to 1 (weak to strong)
  label: 'VERY_BEARISH' | 'BEARISH' | 'NEUTRAL' | 'BULLISH' | 'VERY_BULLISH';
  confidence: number; // 0 to 1
  reasoning: string; // AI explanation
}

export interface GeminiEventAnalysis {
  eventType: EventType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priceImpact: number; // Expected % change
  timeHorizon: '1m' | '5m' | '15m' | '30m' | '1h'; // Expected timeframe for impact
  confidence: number;
  explanation: string;
}

export interface GeminiInsights {
  // Overall market sentiment
  sentiment: GeminiSentiment;
  
  // Event-specific analysis
  events: GeminiEventAnalysis[];
  
  // Price prediction context
  priceContext: {
    trend: 'STRONG_UP' | 'UP' | 'SIDEWAYS' | 'DOWN' | 'STRONG_DOWN';
    support: number | null; // Identified support level
    resistance: number | null; // Identified resistance level
    volatilityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  
  // Natural language summary
  summary: string;
  keyFactors: string[]; // Top 3-5 factors affecting the stock
  
  // Anomaly detection
  anomalies: Array<{
    type: string;
    description: string;
    severity: number; // 0-1
  }>;
}

export class GeminiAnalyzerService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  
  constructor() {
    if (GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    } else {
      console.warn('[GeminiAnalyzer] API key not found - AI insights will be limited');
    }
  }
  
  /**
   * Analyze market data and events using Gemini AI
   */
  async analyze(
    data: AggregatedData,
    events: EventAnalysis
  ): Promise<GeminiInsights> {
    if (!this.model) {
      return this.getFallbackInsights(data, events);
    }
    
    try {
      console.log(`[GeminiAnalyzer] Analyzing ${data.symbol} with AI...`);
      
      // Build comprehensive context for Gemini
      const context = this.buildAnalysisContext(data, events);
      
      // Generate AI insights
      const insights = await this.generateInsights(context, data, events);
      
      console.log('[GeminiAnalyzer] AI analysis complete');
      return insights;
      
    } catch (error) {
      console.error('[GeminiAnalyzer] Error during AI analysis:', error);
      return this.getFallbackInsights(data, events);
    }
  }
  
  /**
   * Build comprehensive context for Gemini AI analysis
   */
  private buildAnalysisContext(
    data: AggregatedData,
    events: EventAnalysis
  ): string {
    const { symbol, technical, close, open, high, low, volume } = data;
    
    let context = `Analyze stock ${symbol} for short-term trading (1 minute to 1 hour):\n\n`;
    
    // Current price data
    context += `CURRENT PRICE DATA:\n`;
    context += `- Current Price: ${close}\n`;
    context += `- Open: ${open}, High: ${high}, Low: ${low}\n`;
    context += `- Volume: ${volume.toLocaleString()}\n`;
    context += `- Price Change: ${technical.price_change_pct.toFixed(2)}%\n\n`;
    
    // Technical indicators
    context += `TECHNICAL INDICATORS:\n`;
    context += `- RSI(14): ${technical.rsi_14.toFixed(2)} ${this.interpretRSI(technical.rsi_14)}\n`;
    context += `- MACD: ${technical.macd.toFixed(4)} (Signal: ${technical.macd_signal.toFixed(4)}, Histogram: ${technical.macd_histogram.toFixed(4)})\n`;
    context += `- Bollinger Bands: Upper=${technical.bollinger_upper.toFixed(2)}, Middle=${technical.bollinger_middle.toFixed(2)}, Lower=${technical.bollinger_lower.toFixed(2)}\n`;
    context += `- Bollinger Bandwidth: ${technical.bollinger_bandwidth.toFixed(2)}% ${this.interpretBollingerBandwidth(technical.bollinger_bandwidth)}\n`;
    context += `- Volume Ratio: ${technical.volume_ratio.toFixed(2)}x average ${this.interpretVolumeRatio(technical.volume_ratio)}\n`;
    context += `- ATR(14): ${technical.atr_14.toFixed(4)} (volatility measure)\n\n`;
    
    // Moving averages and trend
    context += `TREND ANALYSIS:\n`;
    context += `- SMA(5/10/20): ${technical.sma_5.toFixed(2)} / ${technical.sma_10.toFixed(2)} / ${technical.sma_20.toFixed(2)}\n`;
    context += `- EMA(5/10/20): ${technical.ema_5.toFixed(2)} / ${technical.ema_10.toFixed(2)} / ${technical.ema_20.toFixed(2)}\n`;
    context += `- Current vs SMA20: ${((close - technical.sma_20) / technical.sma_20 * 100).toFixed(2)}%\n\n`;
    
    // Detected events
    if (events.events.length > 0) {
      context += `DETECTED EVENTS (${events.events.length} total):\n`;
      events.events.slice(0, 10).forEach(event => {
        context += `- [${event.severity}] ${event.type}: ${event.description}\n`;
      });
      context += `\nEvent Bias: Bullish ${events.bullishScore.toFixed(0)}% / Bearish ${events.bearishScore.toFixed(0)}% / Neutral ${events.neutralScore.toFixed(0)}%\n\n`;
    }
    
    // Order book (if available)
    if (technical.bid_ask_spread > 0) {
      context += `ORDER BOOK:\n`;
      context += `- Bid-Ask Spread: ${technical.bid_ask_spread.toFixed(4)}\n`;
      context += `- Imbalance: ${(technical.order_book_imbalance * 100).toFixed(2)}% ${technical.order_book_imbalance > 0 ? '(buy pressure)' : '(sell pressure)'}\n\n`;
    }
    
    return context;
  }
  
  /**
   * Generate AI insights using Gemini
   */
  private async generateInsights(
    context: string,
    data: AggregatedData,
    events: EventAnalysis
  ): Promise<GeminiInsights> {
    const prompt = `${context}

Based on this data, provide a CONCISE analysis for short-term trading (1m to 1h timeframe):

1. OVERALL SENTIMENT (bullish/bearish scale -1 to +1, reasoning)
2. PRICE TREND (STRONG_UP/UP/SIDEWAYS/DOWN/STRONG_DOWN)
3. KEY SUPPORT AND RESISTANCE LEVELS (if identifiable from data)
4. VOLATILITY RISK (LOW/MEDIUM/HIGH)
5. TOP 3-5 KEY FACTORS affecting the stock right now
6. ANY ANOMALIES (price-volume divergence, unusual patterns, etc.)
7. SHORT SUMMARY (2-3 sentences for traders)

Format your response as JSON with this structure:
{
  "sentiment": {
    "score": -1 to +1,
    "magnitude": 0 to 1,
    "label": "VERY_BEARISH|BEARISH|NEUTRAL|BULLISH|VERY_BULLISH",
    "confidence": 0 to 1,
    "reasoning": "brief explanation"
  },
  "priceContext": {
    "trend": "STRONG_UP|UP|SIDEWAYS|DOWN|STRONG_DOWN",
    "support": number or null,
    "resistance": number or null,
    "volatilityRisk": "LOW|MEDIUM|HIGH"
  },
  "keyFactors": ["factor1", "factor2", "factor3"],
  "anomalies": [{"type": "name", "description": "text", "severity": 0-1}],
  "summary": "2-3 sentence summary for traders"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response');
      }
      
      const aiResponse = JSON.parse(jsonMatch[0]);
      
      // Build full insights object
      const insights: GeminiInsights = {
        sentiment: aiResponse.sentiment,
        events: this.analyzeEventsWithAI(events.events, aiResponse),
        priceContext: aiResponse.priceContext,
        summary: aiResponse.summary,
        keyFactors: aiResponse.keyFactors || [],
        anomalies: aiResponse.anomalies || []
      };
      
      return insights;
      
    } catch (error) {
      console.error('[GeminiAnalyzer] AI generation failed:', error);
      return this.getFallbackInsights(data, events);
    }
  }
  
  /**
   * Analyze events with AI context
   */
  private analyzeEventsWithAI(
    events: DetectedEvent[],
    aiResponse: any
  ): GeminiEventAnalysis[] {
    // For now, use rule-based analysis
    // In future, we can enhance this with AI-specific event interpretation
    return events.map(event => ({
      eventType: event.type,
      severity: event.severity,
      priceImpact: event.priceImpact || 0,
      timeHorizon: this.estimateTimeHorizon(event),
      confidence: event.confidence,
      explanation: event.description
    }));
  }
  
  /**
   * Estimate time horizon for event impact
   */
  private estimateTimeHorizon(event: DetectedEvent): '1m' | '5m' | '15m' | '30m' | '1h' {
    // High severity events have immediate impact
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      return '1m';
    }
    
    // News events typically have medium-term impact
    if (event.type.includes('NEWS')) {
      return '15m';
    }
    
    // Volume and order book events are short-term
    if (event.type.includes('VOLUME') || event.type.includes('ORDER_BOOK')) {
      return '5m';
    }
    
    // Default
    return '30m';
  }
  
  /**
   * Fallback insights when AI is unavailable
   */
  private getFallbackInsights(
    data: AggregatedData,
    events: EventAnalysis
  ): GeminiInsights {
    const { technical } = data;
    
    // Calculate sentiment from technical indicators
    let sentimentScore = 0;
    
    // RSI contribution
    if (technical.rsi_14 > 70) sentimentScore -= 0.3; // Overbought
    else if (technical.rsi_14 < 30) sentimentScore += 0.3; // Oversold
    
    // MACD contribution
    if (technical.macd_histogram > 0) sentimentScore += 0.2;
    else sentimentScore -= 0.2;
    
    // Price vs MA contribution
    const priceVsSMA20 = (data.close - technical.sma_20) / technical.sma_20;
    sentimentScore += Math.max(-0.3, Math.min(0.3, priceVsSMA20 * 2));
    
    // Event contribution
    const eventBias = (events.bullishScore - events.bearishScore) / 100;
    sentimentScore += eventBias * 0.3;
    
    // Clamp to -1 to +1
    sentimentScore = Math.max(-1, Math.min(1, sentimentScore));
    
    const sentimentLabel: GeminiSentiment['label'] = 
      sentimentScore > 0.5 ? 'VERY_BULLISH' :
      sentimentScore > 0.15 ? 'BULLISH' :
      sentimentScore < -0.5 ? 'VERY_BEARISH' :
      sentimentScore < -0.15 ? 'BEARISH' : 'NEUTRAL';
    
    // Determine trend
    const trend = 
      technical.macd_histogram > 0 && technical.rsi_14 > 55 ? 'STRONG_UP' :
      technical.macd_histogram > 0 ? 'UP' :
      technical.macd_histogram < 0 && technical.rsi_14 < 45 ? 'STRONG_DOWN' :
      technical.macd_histogram < 0 ? 'DOWN' : 'SIDEWAYS';
    
    // Calculate support/resistance
    const support = Math.min(technical.bollinger_lower, technical.sma_20 * 0.98);
    const resistance = Math.max(technical.bollinger_upper, technical.sma_20 * 1.02);
    
    // Volatility risk
    const volatilityRisk: 'LOW' | 'MEDIUM' | 'HIGH' = 
      technical.bollinger_bandwidth > 8 ? 'HIGH' :
      technical.bollinger_bandwidth > 4 ? 'MEDIUM' : 'LOW';
    
    return {
      sentiment: {
        score: sentimentScore,
        magnitude: Math.abs(sentimentScore),
        label: sentimentLabel,
        confidence: 0.7,
        reasoning: 'Based on technical indicators and detected events'
      },
      events: events.events.map(e => ({
        eventType: e.type,
        severity: e.severity,
        priceImpact: e.priceImpact || 0,
        timeHorizon: this.estimateTimeHorizon(e),
        confidence: e.confidence,
        explanation: e.description
      })),
      priceContext: {
        trend,
        support,
        resistance,
        volatilityRisk
      },
      summary: `${data.symbol} is showing ${sentimentLabel.toLowerCase()} sentiment with ${volatilityRisk.toLowerCase()} volatility. ` +
        `Current trend: ${trend.toLowerCase().replace('_', ' ')}. ` +
        `${events.events.length} events detected.`,
      keyFactors: this.identifyKeyFactors(data, events),
      anomalies: this.detectAnomalies(data, events)
    };
  }
  
  /**
   * Identify key factors affecting the stock
   */
  private identifyKeyFactors(data: AggregatedData, events: EventAnalysis): string[] {
    const factors: string[] = [];
    const { technical } = data;
    
    // RSI extremes
    if (technical.rsi_14 > 70) factors.push('Overbought conditions (RSI > 70)');
    if (technical.rsi_14 < 30) factors.push('Oversold conditions (RSI < 30)');
    
    // Volume spikes
    if (technical.volume_ratio > 2) factors.push(`High volume (${technical.volume_ratio.toFixed(1)}x average)`);
    
    // Critical events
    const criticalEvents = events.events.filter(e => e.severity === 'CRITICAL');
    if (criticalEvents.length > 0) {
      factors.push(`${criticalEvents.length} critical event(s) detected`);
    }
    
    // Volatility
    if (technical.bollinger_bandwidth > 8) factors.push('High volatility environment');
    
    // Strong directional bias
    if (events.bullishScore > 70) factors.push('Strong bullish bias from events');
    if (events.bearishScore > 70) factors.push('Strong bearish bias from events');
    
    return factors.slice(0, 5);
  }
  
  /**
   * Detect anomalies in the data
   */
  private detectAnomalies(data: AggregatedData, events: EventAnalysis): GeminiInsights['anomalies'] {
    const anomalies: GeminiInsights['anomalies'] = [];
    const { technical } = data;
    
    // Price-volume divergence
    if (Math.abs(technical.price_change_pct) > 1 && technical.volume_ratio < 0.5) {
      anomalies.push({
        type: 'Price-Volume Divergence',
        description: 'Large price movement with low volume - unusual pattern',
        severity: 0.7
      });
    }
    
    // Extreme RSI with contradicting MACD
    if (technical.rsi_14 > 70 && technical.macd_histogram > 0) {
      anomalies.push({
        type: 'Overbought Momentum',
        description: 'Overbought RSI with positive MACD - potential reversal risk',
        severity: 0.6
      });
    }
    
    if (technical.rsi_14 < 30 && technical.macd_histogram < 0) {
      anomalies.push({
        type: 'Oversold Momentum',
        description: 'Oversold RSI with negative MACD - potential bounce opportunity',
        severity: 0.6
      });
    }
    
    // Bollinger Band squeeze followed by breakout
    if (technical.bollinger_bandwidth < 2 && Math.abs(technical.price_change_pct) > 1) {
      anomalies.push({
        type: 'Volatility Breakout',
        description: 'Price breaking out after low volatility period',
        severity: 0.8
      });
    }
    
    return anomalies;
  }
  
  // ============================================================================
  // INTERPRETATION HELPERS
  // ============================================================================
  
  private interpretRSI(rsi: number): string {
    if (rsi > 70) return '(Overbought)';
    if (rsi < 30) return '(Oversold)';
    if (rsi > 60) return '(Bullish)';
    if (rsi < 40) return '(Bearish)';
    return '(Neutral)';
  }
  
  private interpretBollingerBandwidth(bandwidth: number): string {
    if (bandwidth > 10) return '(Very High Volatility)';
    if (bandwidth > 5) return '(High Volatility)';
    if (bandwidth < 2) return '(Low Volatility - Squeeze)';
    return '(Normal)';
  }
  
  private interpretVolumeRatio(ratio: number): string {
    if (ratio > 3) return '(Extremely High)';
    if (ratio > 1.5) return '(High)';
    if (ratio < 0.5) return '(Low)';
    return '(Normal)';
  }
}
