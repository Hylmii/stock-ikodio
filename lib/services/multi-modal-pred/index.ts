/**
 * Multi-Modal Event-Driven Prediction System
 * 
 * Export all services for easy import
 */

export { DataAggregatorService } from './data-aggregator.service';
export type { AggregatedData, TechnicalFeatures } from './data-aggregator.service';

export { EventDetectorService } from './event-detector.service';
export type { EventAnalysis, DetectedEvent, EventType, EventSeverity } from './event-detector.service';

export { GeminiAnalyzerService } from './gemini-analyzer.service';
export type { GeminiInsights, GeminiSentiment, GeminiEventAnalysis } from './gemini-analyzer.service';

export { MultiModalOrchestrator } from './orchestrator.service';
export type { MultiModalPrediction } from './orchestrator.service';
