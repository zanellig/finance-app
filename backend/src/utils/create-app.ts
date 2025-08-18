// ---Core---
import { Hono } from "hono";
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

export default function createApp() {
  const app = new Hono<AppBindings>({
    strict: false,
  });
  app.basePath("/api");
  app.use(requestId({ generator: () => v4() }));
  app.use(logger());
  app.use("*", cors());
  app.use(compress());

  return app;
}
