/**
 * In-Memory Cache untuk Prediction Results
 * 
 * Benefits:
 * - Ultra-fast lookups (< 1ms)
 * - Reduce API calls to external services
 * - Save costs on Gemini AI API calls
 * - Improve response time by 10-50x
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    
    // Cleanup expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Set cache entry with TTL
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  /**
   * Get cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists and not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Get cache statistics
   */
  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: ((this.cache.size / this.maxSize) * 100).toFixed(2) + '%',
    };
  }
}

// Singleton instance
export const predictionCache = new MemoryCache(1000);

/**
 * Generate cache key for predictions
 */
export function generatePredictionCacheKey(
  symbol: string,
  interval: string
): string {
  return `prediction:${symbol.toLowerCase()}:${interval}`;
}

/**
 * Cache TTL by interval (in seconds)
 */
export const CACHE_TTL = {
  '1m': 30,    // 30 seconds for 1-minute predictions
  '5m': 120,   // 2 minutes for 5-minute predictions
  '10m': 240,  // 4 minutes for 10-minute predictions
  '15m': 300,  // 5 minutes for 15-minute predictions
  '30m': 600,  // 10 minutes for 30-minute predictions
  '1h': 900,   // 15 minutes for 1-hour predictions
} as const;
