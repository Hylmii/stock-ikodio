/**
 * Performance Monitoring Utility
 * 
 * Track and measure performance metrics for IKODIO platform
 */

export class PerformanceMonitor {
  private metrics: Map<string, number[]>;
  
  constructor() {
    this.metrics = new Map();
  }

  /**
   * Start timing an operation
   */
  start(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.record(operation, duration);
      return duration;
    };
  }

  /**
   * Record a metric
   */
  record(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const values = this.metrics.get(operation)!;
    values.push(duration);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * Get statistics for an operation
   */
  getStats(operation: string) {
    const values = this.metrics.get(operation);
    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Get all stats
   */
  getAllStats() {
    const stats: Record<string, any> = {};
    
    for (const [operation, _] of this.metrics) {
      stats[operation] = this.getStats(operation);
    }
    
    return stats;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics.clear();
  }
}

// Singleton instance
export const perfMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(operationName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const end = perfMonitor.start(`${operationName}.${propertyKey}`);
      try {
        const result = await originalMethod.apply(this, args);
        const duration = end();
        console.log(`[Perf] ${operationName}.${propertyKey}: ${duration.toFixed(2)}ms`);
        return result;
      } catch (error) {
        end();
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Web Vitals tracking for frontend
 */
export function trackWebVitals(metric: any) {
  const { name, value, id } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${name}:`, value);
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // You can send this to your analytics service
    // Example: gtag('event', name, { value, metric_id: id });
  }
}
