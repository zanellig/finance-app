import { Hono } from "hono";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import * as entities from "./controllers/entities.controller";
import * as users from "./controllers/users.controller";

import { createEntityDto } from "./dtos/entities.dto";

import { validateBody } from "./utils/validator";

const app = new Hono();

app.use(etag(), logger());
app.use("/api/*", cors());

app
  .get("/api/entities", entities.getEntities)
  .post(validateBody(createEntityDto), entities.createEntity);
app.get("/api/entities/:id", entities.getEntity);

app.post("/api/users", users.createTestUser);

export default app;
