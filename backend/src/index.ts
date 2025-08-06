// --- Core ---
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "@hono/bun-compress";

// --- Controllers ---
import * as entities from "@/controllers/entities.controller";
import usersRouter from "@/controllers/users.controller";

// --- DTOs ---
import { createEntityDto } from "@/dtos/entities.dto";

// --- Utils ---
import { validateBody } from "@/utils/validator";
import { env } from "@/config/env";

/**
 * This way of writing Rails-like controllers is not recommended in the Hono docs.
 * Instead, we sould do the following:
 * ```ts
 * // entities.route.ts
 * import { Hono } from "hono";
 * const entities = new Hono();
 *
 * entities.get("/", (c)=>{
 *   return c.json({foo: "bar"})
 * });
 *
 * export default entities;
 * ```
 *
 * **This is because if we want to use a dynamic route parameter, it can't be inferred.**
 *
 * @see https://hono.dev/docs/guides/best-practices
 *
 * **TODO**: Refactor controllers
 */
const app = new Hono().basePath("/api");

app.use(etag(), logger());
app.use("*", cors());
app.use(trimTrailingSlash());
app.use(compress());

app.use(
  "*",
  clerkMiddleware({
    secretKey: env.CLERK_SECRET_KEY,
    publishableKey: env.CLERK_PUBLISHABLE_KEY,
  }),
);

app.route("/", usersRouter);

app.get("/clerk", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({
      message: "You are not logged in.",
    });
  }

  return c.json({
    message: "You are logged in!",
    userId: auth.userId,
  });
});

app.all("*", (c) => {
  return c.json({ sucess: false, message: "Not Found" }, 404);
});

export default app;
