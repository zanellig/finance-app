// Global zod instance that redirects all zod imports to @hono/zod-openapi
// This ensures all libraries use the same zod instance for consistency

export { z as default, z } from "@hono/zod-openapi";
export * from "@hono/zod-openapi";