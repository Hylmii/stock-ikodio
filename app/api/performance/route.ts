import { NextRequest, NextResponse } from "next/server";
import { perfMonitor } from "@/utils/performance";
import { predictionCache } from "@/cache/memory-cache";

/**
 * Performance Metrics API
 *
 * Provides real-time performance statistics for monitoring
 */

export async function GET(request: NextRequest) {
  try {
    const performanceStats = perfMonitor.getAllStats();
    const cacheStats = predictionCache.stats();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),

      // Performance metrics
      performance: performanceStats,

      // Cache statistics
      cache: cacheStats,

      // System info
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: {
          heapUsed:
            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB",
          heapTotal:
            (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + " MB",
          rss: (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + " MB",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Reset performance metrics
 */
export async function DELETE(request: NextRequest) {
  try {
    perfMonitor.reset();
    predictionCache.clear();

    return NextResponse.json({
      success: true,
      message: "Performance metrics and cache cleared",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
