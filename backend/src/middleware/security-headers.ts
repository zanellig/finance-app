import { Context, Next } from "hono";

export const securityHeaders = async (c: Context, next: Next) => {
  await next();

  // Remove Server header for security
  // c.res.headers.delete("Server");

  // Prevent clickjacking attacks
  // c.res.headers.set("X-Frame-Options", "DENY");

  // Enable XSS protection
  // c.res.headers.set("X-XSS-Protection", "1; mode=block");

  // Prevent MIME type sniffing
  // c.res.headers.set("X-Content-Type-Options", "nosniff");

  // Enforce HTTPS
  // c.res.headers.set(
  //   "Strict-Transport-Security",
  //   "max-age=31536000; includeSubDomains; preload"
  // );

  // Content Security Policy
  // c.res.headers.set(
  //   "Content-Security-Policy",
  //   "default-src 'self'; " +
  //   "script-src 'self' 'unsafe-inline'; " +
  //   "style-src 'self' 'unsafe-inline'; " +
  //   "img-src 'self' data: https:; " +
  //   "connect-src 'self'; " +
  //   "font-src 'self'; " +
  //   "object-src 'none'; " +
  //   "base-uri 'self'; " +
  //   "form-action 'self'"
  // );

  // Referrer Policy
  // c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy (formerly Feature Policy)
  // c.res.headers.set(
  //   "Permissions-Policy",
  //   "camera=(), microphone=(), geolocation=(), payment=()"
  // );

  // Cross-Origin policies
  // c.res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  // c.res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  // c.res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
};
