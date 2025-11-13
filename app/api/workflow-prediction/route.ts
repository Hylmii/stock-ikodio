import { NextRequest, NextResponse } from "next/server";
import { stockPredictionWorkflow } from "@/workflows/stock-prediction-workflow";
import {
  predictionCache,
  generatePredictionCacheKey,
  CACHE_TTL,
} from "@/cache/memory-cache";

/**
 * Workflow-based Multi-Modal Prediction API (with Caching)
 *
 * This endpoint uses:
 * - Workflow DevKit for reliability and auto-retry
 * - In-memory cache for ultra-fast responses
 * - Smart TTL based on prediction interval
 *
 * Performance improvements:
 * - Cache hit: ~1ms (50-100x faster!)
 * - Cache miss: Normal workflow execution
 * - Reduces API costs significantly
 */

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { symbol, interval, bypassCache = false } = body;

    console.log(`[Workflow API] Received request: ${symbol} @ ${interval}`);

    // Generate cache key
    const cacheKey = generatePredictionCacheKey(symbol, interval);

    // Check cache first (unless bypassed)
    if (!bypassCache) {
      const cachedResult = predictionCache.get(cacheKey);
      if (cachedResult) {
        const cacheAge =
          Date.now() - new Date(cachedResult.timestamp).getTime();
        console.log(
          `[Cache] HIT for ${symbol} @ ${interval} (age: ${(
            cacheAge / 1000
          ).toFixed(1)}s)`
        );

        return NextResponse.json(
          {
            ...cachedResult,
            cached: true,
            cacheAge: Math.floor(cacheAge / 1000),
          },
          {
            status: 200,
            headers: {
              "Cache-Control": "no-store, max-age=0",
              "X-Workflow-Enabled": "true",
              "X-Cache": "HIT",
              "X-Cache-Age": Math.floor(cacheAge / 1000).toString(),
              "X-Response-Time": `${Date.now() - startTime}ms`,
            },
          }
        );
      }
      console.log(`[Cache] MISS for ${symbol} @ ${interval}`);
    }

    // Execute the durable workflow
    const result = await stockPredictionWorkflow(symbol, interval);

    // Cache the result
    const ttl = CACHE_TTL[interval as keyof typeof CACHE_TTL] || 300;
    predictionCache.set(cacheKey, result, ttl);
    console.log(`[Cache] Stored ${symbol} @ ${interval} (TTL: ${ttl}s)`);

    return NextResponse.json(
      {
        ...result,
        cached: false,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Workflow-Enabled": "true",
          "X-Cache": "MISS",
          "X-Response-Time": `${Date.now() - startTime}ms`,
        },
      }
    );
  } catch (error: any) {
    console.error("[Workflow API] Error:", error);

    // Handle FatalError separately
    const isFatal = error.name === "FatalError";
    const statusCode = isFatal ? 400 : 500;

    const errorResponse = {
      success: false,
      error: error.message || "Workflow execution failed",
      code: isFatal ? "FATAL_ERROR" : "WORKFLOW_ERROR",
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };

    return NextResponse.json(errorResponse, {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Workflow-Enabled": "true",
      },
    });
  }
}

/**
 * GET endpoint for health check
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "operational",
    service: "Workflow-based Stock Prediction API",
    version: "2.0.0",
    features: [
      "Durable execution with Workflow DevKit",
      "Automatic retry on failures",
      "State persistence",
      "Built-in observability",
      "Data aggregation from 4 APIs",
      "Real-time event detection",
      "Gemini AI analysis",
      "20+ technical indicators",
    ],
    supportedIntervals: ["1m", "5m", "10m", "15m", "30m", "1h"],
    timestamp: new Date().toISOString(),
    workflow: {
      enabled: true,
      steps: [
        "Input validation",
        "Market data fetching",
        "Prediction generation",
        "Metrics calculation",
        "Response formatting",
      ],
    },
  });
}
