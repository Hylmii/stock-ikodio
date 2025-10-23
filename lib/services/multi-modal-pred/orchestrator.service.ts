/**
 * Multi-Modal Prediction Orchestrator
 * Main service that coordinates all components of the Multi-Modal Event-Driven prediction system
 * 
 * Workflow:
 * 1. Data Aggregation (Prompt 1)
 * 2. Event Detection (Prompt 2)
 * 3. Gemini AI Analysis (Prompt 3)
 * 4. [Future] Graph Construction (Prompt 4 - Simplified)
 * 5. [Future] ML Prediction (Prompt 5 - Simplified)
 * 6. Output & Logging (Prompt 6)
 */

import { PredictionInterval } from '@/types/prediction';
import { DataAggregatorService, AggregatedData } from './data-aggregator.service';
import { EventDetectorService, EventAnalysis } from './event-detector.service';
import { GeminiAnalyzerService, GeminiInsights } from './gemini-analyzer.service';

export interface MultiModalPrediction {
  symbol: string;
  interval: PredictionInterval;
  timestamp: Date;
  
  // Raw data
  aggregatedData: AggregatedData;
  
  // Event analysis
  eventAnalysis: EventAnalysis;
  
  // AI insights
  aiInsights: GeminiInsights;
  
  // Prediction output
  prediction: {
    direction: 'UP' | 'DOWN' | 'SIDEWAYS';
    confidence: number; // 0-100%
    expectedChange: number; // Percentage
    timeHorizon: PredictionInterval;
    
    // Price targets
    targetPrice: number;
    stopLoss: number;
    takeProfit: number;
  };
  
  // Explanation for transparency
  explanation: {
    summary: string;
    reasoning: string[];
    risks: string[];
    opportunities: string[];
  };
  
  // Performance metadata
  processingTime: number; // milliseconds
  dataQuality: {
    completeness: number; // 0-1
    reliability: number; // 0-1
  };
}

export class MultiModalOrchestrator {
  private dataAggregator: DataAggregatorService;
  private eventDetector: EventDetectorService;
  private geminiAnalyzer: GeminiAnalyzerService;
  
  constructor() {
    this.dataAggregator = new DataAggregatorService();
    this.eventDetector = new EventDetectorService();
    this.geminiAnalyzer = new GeminiAnalyzerService();
  }
  
  /**
   * Main prediction function
   * Orchestrates all components to generate a multi-modal prediction
   */
  async predict(
    symbol: string,
    interval: PredictionInterval
  ): Promise<MultiModalPrediction> {
    const startTime = Date.now();
    
    console.log(`[MultiModalOrchestrator] Starting prediction for ${symbol} (${interval})`);
    
    try {
      // Step 1: Aggregate data from all sources (Prompt 1)
      console.log('[Step 1/6] Aggregating data...');
      const aggregatedData = await this.dataAggregator.aggregateData(symbol, interval);
      
      // Step 2: Detect events (Prompt 2)
      console.log('[Step 2/6] Detecting events...');
      const eventAnalysis = await this.eventDetector.detectEvents(aggregatedData);
      
      // Step 3: AI analysis with Gemini (Prompt 3)
      console.log('[Step 3/6] Running AI analysis...');
      const aiInsights = await this.geminiAnalyzer.analyze(aggregatedData, eventAnalysis);
      
      // Step 4: [Future] Graph construction (Prompt 4)
      console.log('[Step 4/6] Graph construction - SKIPPED (future enhancement)');
      
      // Step 5: [Future] ML model inference (Prompt 5)
      console.log('[Step 5/6] ML inference - using rule-based for now');
      const prediction = this.generatePrediction(aggregatedData, eventAnalysis, aiInsights, interval);
      
      // Step 6: Build explanation and output (Prompt 6)
      console.log('[Step 6/6] Building explanation...');
      const explanation = this.buildExplanation(aggregatedData, eventAnalysis, aiInsights, prediction);
      
      const processingTime = Date.now() - startTime;
      
      const result: MultiModalPrediction = {
        symbol,
        interval,
        timestamp: new Date(),
        aggregatedData,
        eventAnalysis,
        aiInsights,
        prediction,
        explanation,
        processingTime,
        dataQuality: this.assessDataQuality(aggregatedData, eventAnalysis)
      };
      
      console.log(`[MultiModalOrchestrator] Prediction complete in ${processingTime}ms`);
      console.log(`  → Direction: ${prediction.direction}, Confidence: ${prediction.confidence.toFixed(0)}%`);
      
      return result;
      
    } catch (error) {
      console.error('[MultiModalOrchestrator] Prediction failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate prediction using multi-modal insights
   * This is a simplified rule-based approach
   * In future: Replace with trained ML model (Random Forest, XGBoost, or Deep RL)
   */
  private generatePrediction(
    data: AggregatedData,
    events: EventAnalysis,
    ai: GeminiInsights,
    interval: PredictionInterval
  ): MultiModalPrediction['prediction'] {
    let directionScore = 0;
    let confidenceFactors: number[] = [];
    
    // Factor 1: AI Sentiment (weight: 30%)
    directionScore += ai.sentiment.score * 0.3;
    confidenceFactors.push(ai.sentiment.confidence * 0.3);
    
    // Factor 2: Event Bias (weight: 25%)
    const eventBias = (events.bullishScore - events.bearishScore) / 100;
    directionScore += eventBias * 0.25;
    confidenceFactors.push(Math.min(events.totalEvents / 10, 1) * 0.25);
    
    // Factor 3: Technical Indicators (weight: 25%)
    const technicalScore = this.calculateTechnicalScore(data);
    directionScore += technicalScore * 0.25;
    confidenceFactors.push(0.8 * 0.25); // Technical analysis is quite reliable
    
    // Factor 4: Momentum (weight: 20%)
    const momentumScore = this.calculateMomentumScore(data);
    directionScore += momentumScore * 0.2;
    confidenceFactors.push(0.7 * 0.2);
    
    // Determine direction
    const direction: 'UP' | 'DOWN' | 'SIDEWAYS' = 
      directionScore > 0.2 ? 'UP' :
      directionScore < -0.2 ? 'DOWN' : 'SIDEWAYS';
    
    // Calculate confidence (0-100%)
    const baseConfidence = confidenceFactors.reduce((sum, c) => sum + c, 0) * 100;
    
    // Adjust confidence based on data quality and consistency
    let confidenceAdjustment = 1.0;
    
    // Reduce confidence if indicators are contradicting
    if (Math.abs(technicalScore - (ai.sentiment.score + eventBias) / 2) > 0.5) {
      confidenceAdjustment *= 0.8; // Mixed signals
    }
    
    // Reduce confidence in high volatility
    if (ai.priceContext.volatilityRisk === 'HIGH') {
      confidenceAdjustment *= 0.85;
    }
    
    // Increase confidence if multiple factors align
    if (Math.abs(directionScore) > 0.5 && ai.priceContext.trend !== 'SIDEWAYS') {
      confidenceAdjustment *= 1.1;
    }
    
    const confidence = Math.min(95, Math.max(40, baseConfidence * confidenceAdjustment));
    
    // Calculate expected price change
    const volatilityMultiplier = data.technical.atr_14 / data.close;
    const baseChange = directionScore * 2; // -2% to +2% base
    const volatilityAdjusted = baseChange * (1 + volatilityMultiplier * 10);
    const expectedChange = Math.max(-5, Math.min(5, volatilityAdjusted)); // Cap at ±5%
    
    // Calculate price targets
    const targetPrice = data.close * (1 + expectedChange / 100);
    
    // Stop loss: Use ATR or 1% (whichever is larger)
    const stopLossDistance = Math.max(data.technical.atr_14 * 2, data.close * 0.01);
    const stopLoss = direction === 'UP' 
      ? data.close - stopLossDistance
      : data.close + stopLossDistance;
    
    // Take profit: Use support/resistance or 2x expected change
    const takeProfitDistance = Math.max(
      Math.abs(expectedChange / 100 * data.close) * 2,
      data.technical.atr_14 * 3
    );
    const takeProfit = direction === 'UP'
      ? data.close + takeProfitDistance
      : data.close - takeProfitDistance;
    
    return {
      direction,
      confidence,
      expectedChange,
      timeHorizon: interval,
      targetPrice,
      stopLoss,
      takeProfit
    };
  }
  
  /**
   * Calculate technical indicator score (-1 to +1)
   */
  private calculateTechnicalScore(data: AggregatedData): number {
    const { technical, close } = data;
    let score = 0;
    
    // RSI contribution
    if (technical.rsi_14 > 70) score -= 0.3; // Overbought
    else if (technical.rsi_14 < 30) score += 0.3; // Oversold
    else if (technical.rsi_14 > 50) score += (technical.rsi_14 - 50) / 100;
    else score -= (50 - technical.rsi_14) / 100;
    
    // MACD contribution
    if (technical.macd_histogram > 0) {
      score += Math.min(0.3, technical.macd_histogram * 100);
    } else {
      score += Math.max(-0.3, technical.macd_histogram * 100);
    }
    
    // Moving average contribution
    const priceVsSMA20 = (close - technical.sma_20) / technical.sma_20;
    score += Math.max(-0.3, Math.min(0.3, priceVsSMA20 * 5));
    
    // Bollinger Bands contribution
    const bbPosition = (close - technical.bollinger_lower) / 
                       (technical.bollinger_upper - technical.bollinger_lower);
    if (bbPosition > 0.8) score -= 0.2; // Near upper band
    else if (bbPosition < 0.2) score += 0.2; // Near lower band
    
    return Math.max(-1, Math.min(1, score));
  }
  
  /**
   * Calculate momentum score (-1 to +1)
   */
  private calculateMomentumScore(data: AggregatedData): number {
    const { technical } = data;
    let score = 0;
    
    // Price momentum
    score += Math.max(-0.4, Math.min(0.4, technical.price_change_pct / 5));
    
    // Volume momentum
    if (technical.volume_ratio > 1.5) {
      // High volume supports the move
      score *= 1.2;
    } else if (technical.volume_ratio < 0.5) {
      // Low volume weakens the move
      score *= 0.8;
    }
    
    // Order book momentum
    score += technical.order_book_imbalance * 0.3;
    
    return Math.max(-1, Math.min(1, score));
  }
  
  /**
   * Build comprehensive explanation for transparency
   */
  private buildExplanation(
    data: AggregatedData,
    events: EventAnalysis,
    ai: GeminiInsights,
    prediction: MultiModalPrediction['prediction']
  ): MultiModalPrediction['explanation'] {
    const reasoning: string[] = [];
    const risks: string[] = [];
    const opportunities: string[] = [];
    
    // Main reasoning
    reasoning.push(`AI Sentiment: ${ai.sentiment.label} (score: ${ai.sentiment.score.toFixed(2)}) - ${ai.sentiment.reasoning}`);
    reasoning.push(`Technical Analysis: ${ai.priceContext.trend.replace('_', ' ')} trend detected`);
    reasoning.push(`Event Analysis: ${events.totalEvents} events detected (${events.criticalEvents} critical)`);
    
    if (ai.keyFactors.length > 0) {
      reasoning.push(`Key Factors: ${ai.keyFactors.join(', ')}`);
    }
    
    // Risks
    if (ai.priceContext.volatilityRisk === 'HIGH') {
      risks.push('High volatility increases prediction uncertainty');
    }
    
    if (ai.anomalies.length > 0) {
      risks.push(`Anomalies detected: ${ai.anomalies.map(a => a.type).join(', ')}`);
    }
    
    if (prediction.confidence < 60) {
      risks.push('Low confidence prediction - exercise caution');
    }
    
    if (events.criticalEvents > 0) {
      risks.push(`${events.criticalEvents} critical event(s) may cause sudden price movements`);
    }
    
    // Opportunities
    if (prediction.confidence > 75) {
      opportunities.push('High confidence setup with favorable risk/reward');
    }
    
    if (ai.priceContext.support && ai.priceContext.resistance) {
      opportunities.push(`Clear support at ${ai.priceContext.support.toFixed(2)} and resistance at ${ai.priceContext.resistance.toFixed(2)}`);
    }
    
    if (data.technical.volume_ratio > 2) {
      opportunities.push('High volume confirms price movement strength');
    }
    
    if (Math.abs(ai.sentiment.score) > 0.6) {
      opportunities.push('Strong directional bias from multiple signals');
    }
    
    return {
      summary: ai.summary,
      reasoning,
      risks: risks.length > 0 ? risks : ['Standard market risks apply'],
      opportunities: opportunities.length > 0 ? opportunities : ['Monitor for better entry points']
    };
  }
  
  /**
   * Assess data quality for transparency
   */
  private assessDataQuality(
    data: AggregatedData,
    events: EventAnalysis
  ): MultiModalPrediction['dataQuality'] {
    let completeness = 1.0;
    let reliability = 0.85; // Base reliability
    
    // Check data completeness
    if (!data.context.interval_1m || data.context.interval_1m.length < 10) {
      completeness -= 0.1;
    }
    if (!data.context.interval_5m || data.context.interval_5m.length < 10) {
      completeness -= 0.1;
    }
    if (!data.orderBook) {
      completeness -= 0.1;
      reliability -= 0.05;
    }
    
    // Adjust reliability based on event quality
    if (events.totalEvents > 0 && events.averageSeverity > 2) {
      reliability += 0.05; // High-quality events increase reliability
    }
    
    return {
      completeness: Math.max(0, completeness),
      reliability: Math.min(1, reliability)
    };
  }
}
