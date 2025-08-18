import { Hono } from "hono";

import type { AppBindings } from "@/types/hono";
import { logger } from "@/middleware/logger";
import { cors } from "hono/cors";
import { compress } from "@hono/bun-compress";
import { requestId } from "hono/request-id";
import { v4 } from "uuid";

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
