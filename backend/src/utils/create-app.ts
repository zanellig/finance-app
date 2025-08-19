// ---Core---
import { OpenAPIHono } from "@hono/zod-openapi";

import { requestId } from "hono/request-id";
import { cors } from "hono/cors";

// ---Hono addons---
import { compress } from "@hono/bun-compress";

// ---Third-party dependencies---
import { v4 } from "uuid";

// ---Utils---
import { logger } from "@/middleware/logger";

// ---Types---
import type { AppBindings } from "@/types/hono";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(requestId({ generator: () => v4() }));
  app.use(logger());
  app.use("*", cors());
  app.use(compress());

  return app;
}
