import { NextRequest, NextResponse } from "next/server";
import { stockPredictionWorkflow } from "@/workflows/stock-prediction-workflow";

/**
 * Workflow-based Multi-Modal Prediction API
 * 
 * This endpoint uses Workflow DevKit for:
 * - Automatic retries on transient failures
 * - State persistence across steps
 * - Built-in observability and tracing
 * - Fault tolerance and reliability
 * 
 * All the same features as /api/multi-modal-prediction but more reliable!
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbol, interval } = body;

    console.log(`[Workflow API] Received request: ${symbol} @ ${interval}`);

    // Execute the durable workflow
    const result = await stockPredictionWorkflow(symbol, interval);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Workflow-Enabled": "true",
      },
    });

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
