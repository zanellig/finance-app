import { Context, Next } from "hono";
import redisService from "@/services/redis";

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Skip counting successful requests
  keyGenerator?: (c: Context) => string; // Custom key generator
}

// Enhanced IP extraction function to handle proxy chains and edge cases
const getClientIP = (c: Context): string => {
  // Check for X-Forwarded-For header (can contain multiple IPs in proxy chains)
  const xForwardedFor = c.req.header("x-forwarded-for");
  if (xForwardedFor) {
    // Take the first IP from the chain (original client)
    const ips = xForwardedFor.split(",").map(ip => ip.trim());
    const firstIP = ips[0];
    // Validate IP format and reject private/local IPs in production
    if (firstIP && !firstIP.startsWith("127.") && !firstIP.startsWith("192.168.") && !firstIP.startsWith("10.") && firstIP !== "::1") {
      return firstIP;
    }
  }

  // Fallback headers
  const realIP = c.req.header("x-real-ip");
  if (realIP && realIP !== "unknown") {
    return realIP;
  }

  const cfConnectingIP = c.req.header("cf-connecting-ip"); // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Return unknown for localhost/development scenarios
  return "unknown";
};

export const createRateLimiter = (options: RateLimitOptions) => {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later",
    skipSuccessfulRequests = false,
    keyGenerator = (c: Context) => {
      // Try API key first if available
      const apiKey = c.req.header("x-api-key");
      if (apiKey) {
        return `rate_limit:api:${apiKey}`;
      }
      
      // Fallback to enhanced IP detection
      const ip = getClientIP(c);
      return `rate_limit:ip:${ip}`;
    },
  } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const windowInSeconds = Math.floor(windowMs / 1000);

    try {
      // Get current count
      const current = await redisService.getRateLimit(key);
      const remaining = Math.max(0, max - current);
      const resetTime = Math.floor(Date.now() / 1000) + windowInSeconds;

      // Add rate limit headers
      c.header("X-RateLimit-Limit", max.toString());
      c.header("X-RateLimit-Remaining", remaining.toString());
      c.header("X-RateLimit-Reset", resetTime.toString());

      if (current >= max) {
        c.header("Retry-After", windowInSeconds.toString());
        return c.json(
          {
            success: false,
            message,
            retryAfter: windowInSeconds,
            limit: max,
            remaining: 0,
            reset: resetTime,
          },
          429
        );
      }

      // Proceed with request
      await next();

      // Only increment after successful request if skipSuccessfulRequests is true
      if (!skipSuccessfulRequests || c.res.status < 400) {
        await redisService.incrementRateLimit(key, windowInSeconds);
        
        // Update remaining count header after increment
        const newRemaining = Math.max(0, max - (current + 1));
        c.header("X-RateLimit-Remaining", newRemaining.toString());
      }
    } catch (error) {
      console.error("Rate limiting error:", error);
      // If Redis is down, allow the request to proceed
      await next();
    }
  };
};

// Pre-configured rate limiters for common use cases
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: "Too many authentication attempts, please try again later",
});

export const generalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: "Too many requests, please try again later",
});

export const strictAuthRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: "Account temporarily locked due to multiple failed attempts",
  keyGenerator: (c: Context) => {
    // Rate limit by email for stricter control
    const body = c.req.valid("json") as { email?: string };
    const email = body?.email || "unknown";
    return `strict_auth:${email}`;
  },
});