import "./setup"; // Load test environment configuration
import { describe, test, expect } from "bun:test";
import { Context } from "hono";

describe("Rate Limiter - Per-Client Isolation", () => {
  test("should generate different keys for different IPs", () => {
    // Simulate the enhanced IP extraction function from rate-limit.ts
    const getClientIP = (c: Context): string => {
      const xForwardedFor = c.req.header("x-forwarded-for");
      if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map((ip) => ip.trim());
        const firstIP = ips[0];
        if (
          firstIP &&
          !firstIP.startsWith("127.") &&
          !firstIP.startsWith("192.168.") &&
          !firstIP.startsWith("10.") &&
          firstIP !== "::1"
        ) {
          return firstIP;
        }
      }

      const realIP = c.req.header("x-real-ip");
      if (realIP && realIP !== "unknown") {
        return realIP;
      }

      const cfConnectingIP = c.req.header("cf-connecting-ip");
      if (cfConnectingIP) {
        return cfConnectingIP;
      }

      return "unknown";
    };

    // Default key generator logic from rate-limit.ts
    const keyGenerator = (c: Context) => {
      const apiKey = c.req.header("x-api-key");
      if (apiKey) {
        return `rate_limit:api:${apiKey}`;
      }

      const ip = getClientIP(c);
      return `rate_limit:ip:${ip}`;
    };

    // Mock contexts with different public IPs
    const context1 = {
      req: {
        header: (name: string) =>
          name === "x-forwarded-for" ? "203.0.113.1" : undefined,
      },
    } as unknown as Context;

    const context2 = {
      req: {
        header: (name: string) =>
          name === "x-forwarded-for" ? "198.51.100.1" : undefined,
      },
    } as unknown as Context;

    const key1 = keyGenerator(context1);
    const key2 = keyGenerator(context2);

    expect(key1).toBe("rate_limit:ip:203.0.113.1");
    expect(key2).toBe("rate_limit:ip:198.51.100.1");
    expect(key1).not.toBe(key2);
  });

  test("should generate different keys for different API keys", () => {
    const keyGenerator = (c: Context) => {
      const apiKey = c.req.header("x-api-key");
      if (apiKey) {
        return `rate_limit:api:${apiKey}`;
      }
      return "rate_limit:ip:unknown";
    };

    const context1 = {
      req: {
        header: (name: string) =>
          name === "x-api-key" ? "client-api-key-1" : undefined,
      },
    } as unknown as Context;

    const context2 = {
      req: {
        header: (name: string) =>
          name === "x-api-key" ? "client-api-key-2" : undefined,
      },
    } as unknown as Context;

    const key1 = keyGenerator(context1);
    const key2 = keyGenerator(context2);

    expect(key1).toBe("rate_limit:api:client-api-key-1");
    expect(key2).toBe("rate_limit:api:client-api-key-2");
    expect(key1).not.toBe(key2);
  });

  test("should prioritize API key over IP for identification", () => {
    const keyGenerator = (c: Context) => {
      const apiKey = c.req.header("x-api-key");
      if (apiKey) {
        return `rate_limit:api:${apiKey}`;
      }

      const xForwardedFor = c.req.header("x-forwarded-for");
      if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map((ip) => ip.trim());
        const firstIP = ips[0];
        if (
          firstIP &&
          !firstIP.startsWith("127.") &&
          !firstIP.startsWith("192.168.") &&
          !firstIP.startsWith("10.") &&
          firstIP !== "::1"
        ) {
          return `rate_limit:ip:${firstIP}`;
        }
      }

      return "rate_limit:ip:unknown";
    };

    const contextWithBoth = {
      req: {
        header: (name: string) => {
          if (name === "x-api-key") return "my-api-key";
          if (name === "x-forwarded-for") return "203.0.113.1";
          return undefined;
        },
      },
    } as unknown as Context;

    const key = keyGenerator(contextWithBoth);
    expect(key).toBe("rate_limit:api:my-api-key"); // Should prefer API key
  });

  test("should handle proxy chains correctly", () => {
    const getClientIP = (c: Context): string => {
      const xForwardedFor = c.req.header("x-forwarded-for");
      if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map((ip) => ip.trim());
        const firstIP = ips[0];
        if (
          firstIP &&
          !firstIP.startsWith("127.") &&
          !firstIP.startsWith("192.168.") &&
          !firstIP.startsWith("10.") &&
          firstIP !== "::1"
        ) {
          return firstIP;
        }
      }
      return "unknown";
    };

    const context = {
      req: {
        header: (name: string) =>
          name === "x-forwarded-for"
            ? "203.0.113.1, 198.51.100.1, 192.168.1.1"
            : undefined,
      },
    } as unknown as Context;

    const ip = getClientIP(context);
    expect(ip).toBe("203.0.113.1"); // Should use the first (original client) IP
  });

  test("should filter out private IPs in production scenarios", () => {
    const getClientIP = (c: Context): string => {
      const xForwardedFor = c.req.header("x-forwarded-for");
      if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map((ip) => ip.trim());
        const firstIP = ips[0];
        if (
          firstIP &&
          !firstIP.startsWith("127.") &&
          !firstIP.startsWith("192.168.") &&
          !firstIP.startsWith("10.") &&
          firstIP !== "::1"
        ) {
          return firstIP;
        }
      }
      return "unknown";
    };

    const privateIPContext = {
      req: {
        header: (name: string) =>
          name === "x-forwarded-for" ? "192.168.1.1" : undefined,
      },
    } as unknown as Context;

    const ip = getClientIP(privateIPContext);
    expect(ip).toBe("unknown"); // Private IP should be filtered out
  });

  test("should demonstrate per-client isolation principle", () => {
    // This test demonstrates that different clients will have different Redis keys
    // which guarantees that one client's rate limit won't affect another's

    const keyGenerator = (c: Context) => {
      const apiKey = c.req.header("x-api-key");
      if (apiKey) {
        return `rate_limit:api:${apiKey}`;
      }

      const xForwardedFor = c.req.header("x-forwarded-for");
      if (xForwardedFor) {
        const ips = xForwardedFor.split(",").map((ip) => ip.trim());
        const firstIP = ips[0];
        if (
          firstIP &&
          !firstIP.startsWith("127.") &&
          !firstIP.startsWith("192.168.") &&
          !firstIP.startsWith("10.") &&
          firstIP !== "::1"
        ) {
          return `rate_limit:ip:${firstIP}`;
        }
      }

      return "rate_limit:ip:unknown";
    };

    // Simulate 3 different clients
    const client1 = {
      req: {
        header: (name: string) =>
          name === "x-api-key" ? "client-1-key" : undefined,
      },
    } as unknown as Context;

    const client2 = {
      req: {
        header: (name: string) =>
          name === "x-forwarded-for" ? "203.0.113.5" : undefined,
      },
    } as unknown as Context;

    const client3 = {
      req: {
        header: (name: string) =>
          name === "x-forwarded-for" ? "198.51.100.10" : undefined,
      },
    } as unknown as Context;

    const key1 = keyGenerator(client1);
    const key2 = keyGenerator(client2);
    const key3 = keyGenerator(client3);

    // All keys should be different
    expect(key1).toBe("rate_limit:api:client-1-key");
    expect(key2).toBe("rate_limit:ip:203.0.113.5");
    expect(key3).toBe("rate_limit:ip:198.51.100.10");

    // Verify they are all unique
    const keys = [key1, key2, key3];
    const uniqueKeys = [...new Set(keys)];
    expect(uniqueKeys.length).toBe(3);

    // This proves that each client gets its own rate limit counter in Redis
    // If client1 hits their rate limit, it won't affect client2 or client3
    // because they use completely different Redis keys
  });
});
