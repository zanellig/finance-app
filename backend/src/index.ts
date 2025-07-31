import { Hono } from "hono";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { compress } from "@hono/bun-compress";

import * as entities from "./controllers/entities.controller";
import * as users from "./controllers/users.controller";

import { createEntityDto } from "./dtos/entities.dto";

import { validateBody } from "./utils/validator";

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
const app = new Hono();

app.use(etag(), logger());
app.use("/api/*", cors());
app.use(compress());

app
  .get("/api/entities", entities.getEntities)
  .post(validateBody(createEntityDto), entities.createEntity);
app.get("/api/entities/:id", entities.getEntity);

app.post("/api/users", users.createTestUser);

export default app;
