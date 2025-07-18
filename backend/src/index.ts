import { Hono } from "hono";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import * as entities from "./routes/entities.route";
import * as users from "./routes/users.route";

const app = new Hono();
app.use(etag(), logger());
app.use("/api/*", cors());

app.get("/api/entities", entities.getEntities);
app.get("/api/entities/:id", entities.getEntity);
app.post("/api/entities", entities.createEntity);

app.post("/api/users", users.createTestUser);

export default app;
