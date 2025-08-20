import Redis from "ioredis";
import { env } from "@/config/env";
import { loggerInstance } from "@/middleware/logger";

class RedisService {
  private client: Redis;
  private isConnected: boolean = false;
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private circuitBreakerThreshold: number = 5;
  private circuitBreakerTimeout: number = 60000; // 1 minute

  constructor() {
    this.client = new Redis(env.REDIS_URL, {
      retryStrategy: (times) => {
        // Circuit breaker: stop retries if we've failed too many times recently
        if (this.isCircuitBreakerOpen()) {
          loggerInstance().fatal(
            "Redis circuit breaker is open, stopping retry attempts"
          );
          return null; // Stop retrying
        }

        // Maximum retry attempts
        if (times > 10) {
          loggerInstance().fatal(
            `Redis max retry attempts exceeded (${String(times)})`
          );
          this.recordFailure();
          return null; // Stop retrying
        }

        // Exponential backoff with jitter
        const baseDelay = Math.pow(2, times) * 1000;
        const jitter = Math.random() * 1000; // 0-1000ms jitter
        const delay = Math.min(baseDelay + jitter, 30000);

        loggerInstance().warn(
          `Redis retry attempt ${String(times)}, waiting ${String(delay)}ms`
        );
        return delay;
      },
      connectTimeout: 10000, // 10 seconds
      maxRetriesPerRequest: null, // Disable per-request retries
      lazyConnect: true,
    });

    this.client.on("connect", () => {
      loggerInstance().info("✅ Connected to Redis");
      this.isConnected = true;
      this.resetCircuitBreaker(); // Reset on successful connection
    });

    this.client.on("error", (error) => {
      loggerInstance().error(error, "❌ Redis connection error");
      this.isConnected = false;
      this.recordFailure();
    });

    this.client.on("close", () => {
      loggerInstance().warn("🔌 Redis connection closed");
      this.isConnected = false;
    });

    this.client.on("ready", () => {
      loggerInstance().info("🚀 Redis client ready");
      this.isConnected = true;
      this.resetCircuitBreaker();
    });
  }

  private isCircuitBreakerOpen(): boolean {
    if (this.failureCount < this.circuitBreakerThreshold) {
      return false;
    }

    const timeSinceLastFailure = Date.now() - this.lastFailureTime;
    return timeSinceLastFailure < this.circuitBreakerTimeout;
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    loggerInstance().warn(
      `Redis failure recorded. Count: ${String(this.failureCount)}`
    );
  }

  private resetCircuitBreaker(): void {
    if (this.failureCount > 0) {
      loggerInstance().info("Resetting Redis circuit breaker");
      this.failureCount = 0;
      this.lastFailureTime = 0;
    }
  }

  async connect(): Promise<void> {
    if (this.isCircuitBreakerOpen()) {
      loggerInstance().warn(
        "Redis circuit breaker is open, refusing connection attempt"
      );
      throw new Error("Redis circuit breaker is open");
    }

    if (!this.isConnected) {
      try {
        await this.client.connect();
      } catch (error) {
        this.recordFailure();
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        this.client.disconnect();
        this.isConnected = false;
      } catch (error) {
        loggerInstance().error(error, "Error during Redis disconnect");
      }
    }
  }

  getClient(): Redis {
    return this.client;
  }

  isHealthy(): boolean {
    return this.isConnected && !this.isCircuitBreakerOpen();
  }

  getCircuitBreakerStatus(): {
    isOpen: boolean;
    failureCount: number;
    lastFailureTime: number;
  } {
    return {
      isOpen: this.isCircuitBreakerOpen(),
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  // Token blacklist operations
  async blacklistToken(
    token: string,
    expirationInSeconds: number
  ): Promise<void> {
    if (!this.isHealthy()) {
      loggerInstance().warn("Redis not healthy, skipping token blacklist");
      return; // Graceful degradation
    }

    try {
      const key = `blacklist:${token}`;
      await this.client.setex(key, expirationInSeconds, "blacklisted");
    } catch (error) {
      loggerInstance().error(error, "Failed to blacklist token");
      this.recordFailure();
      throw error;
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!this.isHealthy()) {
      loggerInstance().warn(
        "Redis not healthy, assuming token is not blacklisted"
      );
      return false; // Fail open for security
    }

    try {
      const key = `blacklist:${token}`;
      const result = await this.client.get(key);
      return result === "blacklisted";
    } catch (error) {
      loggerInstance().error(error, "Failed to check token blacklist");
      this.recordFailure();
      return false; // Fail open for security
    }
  }

  // Rate limiting operations
  async incrementRateLimit(key: string, window: number): Promise<number> {
    if (!this.isHealthy()) {
      loggerInstance().warn("Redis not healthy, rate limiting disabled");
      return 0; // Allow request when Redis is down
    }

    try {
      const multi = this.client.multi();
      multi.incr(key);
      multi.expire(key, window);
      const results = await multi.exec();
      return results ? (results[0][1] as number) : 0;
    } catch (error) {
      loggerInstance().error(error, "Failed to increment rate limit");
      this.recordFailure();
      return 0; // Allow request on error
    }
  }

  async getRateLimit(key: string): Promise<number> {
    if (!this.isHealthy()) {
      loggerInstance().warn("Redis not healthy, returning 0 for rate limit");
      return 0;
    }

    try {
      const result = await this.client.get(key);
      return result ? parseInt(result, 10) : 0;
    } catch (error) {
      loggerInstance().error(error, "Failed to get rate limit");
      this.recordFailure();
      return 0;
    }
  }

  // Audit logging operations
  async logAuthEvent(event: {
    type: "login" | "register" | "logout" | "token_refresh" | "failed_login";
    userId?: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
    success: boolean;
    details?: Record<string, unknown>;
  }): Promise<void> {
    const logKey = `auth_log:${event.type}:${String(Date.now())}`;
    const logData = {
      ...event,
      timestamp: event.timestamp.toISOString(),
    };

    // Store log entry with 30-day expiration
    await this.client.setex(logKey, 30 * 24 * 60 * 60, JSON.stringify(logData));

    // Add to daily auth attempts counter
    const dateKey = `auth_attempts:${
      event.timestamp.toISOString().split("T")[0]
    }`;
    await this.client.incr(dateKey);
    await this.client.expire(dateKey, 30 * 24 * 60 * 60);
  }

  // Session management for refresh tokens
  async storeRefreshToken(
    userId: string,
    refreshToken: string,
    expirationInSeconds: number
  ): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.client.setex(key, expirationInSeconds, refreshToken);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    return await this.client.get(key);
  }

  async removeRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.client.del(key);
  }
}

const redisService = new RedisService();
export default redisService;
