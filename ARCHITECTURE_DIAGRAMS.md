# System Architecture - Visual Diagrams

> **Dibuat:** 24 Oktober 2025  
> **Project:** IKODIO Stock Prediction Platform  
> **Teknologi:** Multi-Modal Event-Driven AI System

---

## Daftar Diagram

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Multi-Modal Prediction Flow](#2-multi-modal-prediction-flow)
3. [Data Aggregation Pipeline](#3-data-aggregation-pipeline)
4. [Event Detection Engine](#4-event-detection-engine)
5. [AI Analysis Process](#5-ai-analysis-process)
6. [Complete Request-Response Flow](#6-complete-request-response-flow)
7. [Component Relationships](#7-component-relationships)

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        UI[Next.js Frontend<br/>Dashboard/Prediction Page]
    end

    subgraph API["API Layer"]
        Route["API Route<br/>/api/prediction/symbol"]
    end

    subgraph Orchestrator["Multi-Modal Orchestrator"]
        Controller["orchestrator.service.ts<br/>Koordinasi & Aggregasi"]
    end

    subgraph Services["Service Layer (3 Prompts)"]
        P1[Prompt 1<br/>Data Aggregator<br/>550 LOC]
        P2[Prompt 2<br/>Event Detector<br/>400 LOC]
        P3[Prompt 3<br/>Gemini AI Analyzer<br/>600 LOC]
    end

    subgraph DataSources["External Data Sources (4 APIs)"]
        Finnhub[(Finnhub API<br/>Real-time Quotes)]
        Yahoo[(Yahoo Finance<br/>Historical Data)]
        RTI[(RTI Business<br/>IDX Stocks)]
        GoAPI[(GoAPI<br/>Indonesian Market)]
    end

    UI -->|Request Prediction| Route
    Route -->|predict symbol, interval| Controller

    Controller -->|1. Fetch Data| P1
    Controller -->|2. Detect Events| P2
    Controller -->|3. AI Analysis| P3

    P1 -.->|Parallel Fetch| Finnhub
    P1 -.->|Fallback| Yahoo
    P1 -.->|IDX Focus| RTI
    P1 -.->|Future Ready| GoAPI

    P2 -->|Technical Data| P1
    P3 -->|Data + Events| P2

    Controller -->|Final Prediction| Route
    Route -->|JSON Response| UI

    style Controller fill:#FF6B6B,color:#fff
    style P1 fill:#4ECDC4,color:#fff
    style P2 fill:#95E1D3,color:#000
    style P3 fill:#F38181,color:#fff
    style UI fill:#FFA07A,color:#000
```

---

## 2. Multi-Modal Prediction Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Next.js UI
    participant API as /api/prediction
    participant Orch as Orchestrator
    participant DA as Data Aggregator
    participant ED as Event Detector
    participant AI as Gemini AI
    participant DB as External APIs

    User->>UI: Klik "Predict" untuk BBCA.JK
    UI->>API: POST /api/prediction/BBCA.JK?interval=5m

    API->>Orch: predict("BBCA.JK", "5m")

    Note over Orch: Phase 1: Data Collection (300-500ms)
    Orch->>DA: aggregateData("BBCA.JK", "5m")

    par Parallel API Calls
        DA->>DB: Finnhub.getQuote()
        DA->>DB: Finnhub.getCandles()
        DA->>DB: Yahoo.getHistorical()
        DA->>DB: RTI.getIDXData()
    end

    DB-->>DA: Combined Raw Data

    Note over DA: Calculate 20+ Indicators<br/>RSI, MACD, Bollinger, ATR, etc.
    DA-->>Orch: AggregatedData + Technical Features

    Note over Orch: Phase 2: Event Analysis (50-100ms)
    Orch->>ED: detectEvents(technicalData)

    Note over ED: Scan 10 Event Types<br/>Price Spikes, Volume Anomalies,<br/>Order Book Imbalance, Volatility
    ED-->>Orch: Events + Bullish/Bearish Scores

    Note over Orch: Phase 3: AI Analysis (500-800ms)
    Orch->>AI: analyzeWithGemini(data, events)

    Note over AI: Gemini 2.0 Flash<br/>Sentiment, Trend, Anomalies,<br/>Support/Resistance
    AI-->>Orch: AI Insights + Confidence

    Note over Orch: Phase 4: Prediction (10-20ms)<br/>Weighted Scoring:<br/>30% AI + 25% Events<br/>+ 25% Technical + 20% Momentum
    Orch->>Orch: calculatePrediction()
    Orch->>Orch: buildExplanation()

    Orch-->>API: Complete Prediction Object
    API-->>UI: JSON Response (1-2 seconds total)
    UI-->>User: Display Prediction + Charts

    Note over User: Melihat:<br/>Direction: UP, Confidence: 78%<br/>Target: 8750, Stop Loss: 8600
```

---

## 3. Data Aggregation Pipeline

```mermaid
flowchart LR
    subgraph Input
        Symbol[Symbol: BBCA.JK]
        Interval[Interval: 5m]
    end

    subgraph DataFetch["Parallel Data Fetching"]
        F1[Finnhub<br/>Real-time Quote]
        F2[Finnhub<br/>Candles 1m/5m/15m]
        F3[Yahoo Finance<br/>Historical Fallback]
        F4[RTI Business<br/>IDX Stocks]
    end

    subgraph Processing["Technical Calculation"]
        MA[Moving Averages<br/>SMA, EMA]
        RSI[RSI Indicator<br/>14-period]
        MACD[MACD + Signal<br/>+ Histogram]
        BB[Bollinger Bands<br/>Upper/Lower/Width]
        VOL[Volume Analysis<br/>VWAP, Ratio]
        ATR[ATR Volatility<br/>14-period]
        OB[Order Book<br/>Bid-Ask, Imbalance]
    end

    subgraph Output
        Tech[Technical Features<br/>20+ indicators]
        Multi[Multi-Interval<br/>1m/5m/15m/30m/1h]
        Quality[Data Quality<br/>Completeness Score]
    end

    Symbol --> DataFetch
    Interval --> DataFetch

    F1 --> Processing
    F2 --> Processing
    F3 --> Processing
    F4 --> Processing

    Processing --> MA
    Processing --> RSI
    Processing --> MACD
    Processing --> BB
    Processing --> VOL
    Processing --> ATR
    Processing --> OB

    MA --> Tech
    RSI --> Tech
    MACD --> Tech
    BB --> Tech
    VOL --> Tech
    ATR --> Tech
    OB --> Tech

    Tech --> Output
    Multi --> Output
    Quality --> Output

    style DataFetch fill:#E3F2FD,color:#000
    style Processing fill:#FFF3E0,color:#000
    style Output fill:#E8F5E9,color:#000
```

---

## 4. Event Detection Engine

```mermaid
graph TD
    Start[Technical Data Input] --> Scanner{Event Scanner}

    Scanner -->|Check 1| PriceSpike[Price Spike Detection<br/>Sudden jumps >2%<br/>Sudden drops >2%]
    Scanner -->|Check 2| VolAnomaly[Volume Anomaly<br/>Surge >200% avg<br/>Drop <50% avg]
    Scanner -->|Check 3| OrderBook[Order Book Imbalance<br/>Buy Pressure >70%<br/>Sell Pressure >70%]
    Scanner -->|Check 4| VolSurge[Volatility Surge<br/>ATR spike >150%]
    Scanner -->|Check 5-10| FutureEvents[Future Events<br/>News Integration<br/>Earnings<br/>Policy Changes]

    PriceSpike --> Severity{Severity<br/>Classification}
    VolAnomaly --> Severity
    OrderBook --> Severity
    VolSurge --> Severity
    FutureEvents -.-> Severity

    Severity -->|<1% impact| Low[LOW<br/>Score: 0.2]
    Severity -->|1-2% impact| Medium[MEDIUM<br/>Score: 0.5]
    Severity -->|2-3% impact| High[HIGH<br/>Score: 0.7]
    Severity -->|>3% impact| Critical[CRITICAL<br/>Score: 1.0]

    Low --> Aggregate[Event Aggregation]
    Medium --> Aggregate
    High --> Aggregate
    Critical --> Aggregate

    Aggregate --> Score[Bullish/Bearish Score<br/>0-100%]
    Aggregate --> Count[Event Count<br/>Total/Critical]
    Aggregate --> Log[Event Log<br/>Timestamped Details]

    Score --> Output[Event Analysis Output]
    Count --> Output
    Log --> Output

    style PriceSpike fill:#FFCDD2,color:#000
    style VolAnomaly fill:#F8BBD0,color:#000
    style OrderBook fill:#E1BEE7,color:#000
    style VolSurge fill:#D1C4E9,color:#000
    style FutureEvents fill:#C5CAE9,color:#000,stroke-dasharray: 5 5
    style Output fill:#A5D6A7,color:#000
```

---

## 5. AI Analysis Process

```mermaid
flowchart TB
    subgraph Input["Input Data"]
        TechData[Technical Features<br/>RSI, MACD, Volume, etc.]
        Events[Detected Events<br/>Bullish/Bearish scores]
        Historical[Historical Candles<br/>Multi-interval data]
    end

    subgraph GeminiAPI["Gemini 2.0 Flash API"]
        Prompt[Structured Prompt<br/>JSON Schema]
        Model[AI Model<br/>gemini-2.0-flash-exp]
        Parse[Response Parser<br/>Validation]
    end

    subgraph Fallback["Fallback System"]
        Check{API Available?}
        RuleBased[Rule-Based Analysis<br/>Technical rules only]
    end

    subgraph Analysis["AI Analysis"]
        Sentiment[Sentiment Scoring<br/>-1 to +1 scale<br/>STRONG_BEARISH → STRONG_BULLISH]
        Trend[Trend Identification<br/>STRONG_UP, UP, SIDEWAYS,<br/>DOWN, STRONG_DOWN]
        SR[Support/Resistance<br/>Key price levels]
        Risk[Volatility Risk<br/>LOW/MEDIUM/HIGH]
        Anomaly[Anomaly Detection<br/>Price-volume divergence,<br/>Contradicting signals]
        Explain[Natural Language<br/>Trader-friendly summary]
    end

    subgraph Output["AI Insights"]
        Final[Complete Analysis<br/>Sentiment + Trend + Levels<br/>+ Risks + Opportunities]
    end

    TechData --> Prompt
    Events --> Prompt
    Historical --> Prompt

    Prompt --> Model
    Model --> Parse
    Parse --> Check

    Check -->|✅ Success| Analysis
    Check -->|❌ Failed| RuleBased

    RuleBased -.->|Basic analysis| Final

    Analysis --> Sentiment
    Analysis --> Trend
    Analysis --> SR
    Analysis --> Risk
    Analysis --> Anomaly
    Analysis --> Explain

    Sentiment --> Final
    Trend --> Final
    SR --> Final
    Risk --> Final
    Anomaly --> Final
    Explain --> Final

    style GeminiAPI fill:#FFE0B2,color:#000
    style Analysis fill:#C8E6C9,color:#000
    style Fallback fill:#FFCCBC,color:#000
    style Output fill:#B2DFDB,color:#000
```

---

## 6. Complete Request-Response Flow

```mermaid
graph TB
    subgraph Browser["User Browser"]
        U1[User clicks Predict]
        U2[Loading State]
        U3[Display Results]
    end

    subgraph NextJS["Next.js App"]
        R1["API Route<br/>prediction/symbol/route.ts"]
        R2[Validate Request]
        R3[Call Orchestrator]
        R4[Format Response]
    end

    subgraph Orchestrator["Orchestrator"]
        O1[Validate Symbol + Interval]
        O2[Execute Phase 1-3]
        O3[Multi-Factor Scoring]
        O4[Build Explanation]
        O5[Quality Check]
    end

    subgraph Services["Services"]
        S1[Data Aggregator<br/>~400ms]
        S2[Event Detector<br/>~80ms]
        S3[Gemini AI<br/>~600ms]
    end

    subgraph External["External APIs"]
        E1[(Finnhub)]
        E2[(Yahoo)]
        E3[(RTI)]
        E4[(GoAPI)]
        E5[(Gemini AI)]
    end

    U1 --> R1
    R1 --> R2
    R2 --> R3
    R3 --> O1

    O1 --> O2
    O2 --> S1
    O2 --> S2
    O2 --> S3

    S1 -.-> E1
    S1 -.-> E2
    S1 -.-> E3
    S1 -.-> E4

    S3 -.-> E5

    S1 --> O3
    S2 --> O3
    S3 --> O3

    O3 --> O4
    O4 --> O5
    O5 --> R4
    R4 --> U3

    U2 -.->|Loading 1-2s| U3

    style Browser fill:#E1F5FE,color:#000
    style NextJS fill:#FFF9C4,color:#000
    style Orchestrator fill:#FFCCBC,color:#000
    style Services fill:#D1C4E9,color:#000
    style External fill:#C5E1A5,color:#000
```

---

## 7. Component Relationships

```mermaid
classDiagram
    class MultiModalOrchestrator {
        -dataAggregator: DataAggregatorService
        -eventDetector: EventDetectorService
        -geminiAnalyzer: GeminiAnalyzerService
        +predict(symbol, interval) Promise~PredictionResult~
        -calculatePrediction() Prediction
        -buildExplanation() Explanation
        -calculateConfidence() number
    }

    class DataAggregatorService {
        +aggregateData(symbol, interval) Promise~AggregatedData~
        -fetchFinnhubData() Promise~FinnhubData~
        -fetchYahooData() Promise~YahooData~
        -calculateIndicators() TechnicalFeatures
        -buildMultiIntervalContext() IntervalData[]
    }

    class EventDetectorService {
        +detectEvents(data) EventAnalysis
        -detectPriceSpikes() Event[]
        -detectVolumeAnomalies() Event[]
        -detectOrderBookImbalance() Event[]
        -detectVolatilitySurge() Event[]
        -classifySeverity(event) Severity
    }

    class GeminiAnalyzerService {
        +analyzeWithGemini(data, events) Promise~AIInsights~
        -buildPrompt() string
        -callGeminiAPI() Promise~GeminiResponse~
        -parseResponse() AIInsights
        -fallbackRuleBased() AIInsights
    }

    class PredictionResult {
        +symbol: string
        +interval: string
        +timestamp: Date
        +prediction: Prediction
        +explanation: Explanation
        +processingTime: number
    }

    class Prediction {
        +direction: "UP"|"DOWN"|"SIDEWAYS"
        +confidence: number
        +expectedChange: number
        +targetPrice: number
        +stopLoss: number
        +takeProfit: number
    }

    class AggregatedData {
        +symbol: string
        +technical: TechnicalFeatures
        +intervals: IntervalData[]
        +dataQuality: DataQuality
    }

    class EventAnalysis {
        +totalEvents: number
        +criticalEvents: number
        +events: Event[]
        +bullishScore: number
        +bearishScore: number
    }

    class AIInsights {
        +sentiment: Sentiment
        +trend: Trend
        +supportResistance: SRLevels
        +volatilityRisk: "LOW"|"MEDIUM"|"HIGH"
        +anomalies: Anomaly[]
        +keyFactors: string[]
    }

    MultiModalOrchestrator --> DataAggregatorService : uses
    MultiModalOrchestrator --> EventDetectorService : uses
    MultiModalOrchestrator --> GeminiAnalyzerService : uses
    MultiModalOrchestrator --> PredictionResult : returns

    DataAggregatorService --> AggregatedData : returns
    EventDetectorService --> EventAnalysis : returns
    GeminiAnalyzerService --> AIInsights : returns

    PredictionResult *-- Prediction
    PredictionResult *-- AggregatedData
    PredictionResult *-- EventAnalysis
    PredictionResult *-- AIInsights
```

---

## Performance Metrics

| Phase       | Component              | Avg Time | Max Time |
| ----------- | ---------------------- | -------- | -------- |
| **Phase 1** | Data Aggregation       | 400ms    | 600ms    |
| **Phase 2** | Event Detection        | 80ms     | 150ms    |
| **Phase 3** | AI Analysis (Gemini)   | 600ms    | 1000ms   |
| **Phase 3** | AI Analysis (Fallback) | 50ms     | 100ms    |
| **Phase 4** | Prediction Calculation | 15ms     | 30ms     |
| **Phase 5** | Explanation Building   | 15ms     | 30ms     |
| **TOTAL**   | **End-to-End**         | **1.1s** | **1.8s** |

---

## Weighted Scoring Algorithm

```
Final Score = (30% × AI Sentiment)
            + (25% × Event Bias)
            + (25% × Technical Score)
            + (20% × Momentum Score)

Confidence Adjustment:
- Base: 70%
- High Volatility: -10 to -20%
- Mixed Signals: -5 to -15%
- Low Data Quality: -5 to -10%
- Strong Agreement: +5 to +15%

Final Range: 40% - 95%
```

---

## Data Quality Metrics

```mermaid
graph LR
    A[Data Sources] --> B{Completeness Check}
    B -->|4/4 APIs| C[100% Complete]
    B -->|3/4 APIs| D[75% Complete]
    B -->|2/4 APIs| E[50% Complete]
    B -->|1/4 APIs| F[25% Complete]

    C --> G[Reliability Score]
    D --> G
    E --> G
    F --> G

    G --> H{Quality Gates}
    H -->|>80%| I[High Quality<br/>Proceed]
    H -->|50-80%| J[Medium Quality<br/>Lower Confidence]
    H -->|<50%| K[Low Quality<br/>Return Error]

    style C fill:#4CAF50,color:#fff
    style D fill:#8BC34A,color:#fff
    style E fill:#FFC107,color:#000
    style F fill:#FF5722,color:#fff
    style I fill:#4CAF50,color:#fff
    style K fill:#F44336,color:#fff
```

---

## Notes

- **Total Codebase:** ~1,950 lines (Orchestrator 400 + DA 550 + ED 400 + AI 600)
- **Status:** Phase 1-3 Complete
- **Future:** Phase 4 (Graph Construction), Phase 5 (ML Training)
- **Production Ready:** Yes (with Gemini API key)
- **Fallback System:** Rule-based analysis if Gemini unavailable

---

**Terakhir diupdate:** 24 Oktober 2025  
**Dibuat untuk:** IKODIO Stock Prediction Platform  
**Developer:** @Hylmii
