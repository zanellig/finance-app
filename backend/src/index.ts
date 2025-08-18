// --- Core ---
import { Hono } from "hono";

import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";
import { compress } from "@hono/bun-compress";

// --- Middleware ---
import { authMiddleware } from "@/middleware/auth";

// --- Controllers ---
import usersRouter from "@/controllers/users.controller";
import entitiesRouter from "@/controllers/entities.controller";
import accountsRouter from "@/controllers/accounts.controller";
import creditCardsRouter from "@/controllers/credit-cards.controller";
import loansRouter from "@/controllers/loans.controller";
import incomeRouter from "@/controllers/income.controller";
import transactionsRouter from "@/controllers/transactions.controller";

// --- Utils ---

const app = new Hono().basePath("/api");

app.use(etag(), logger());
app.use("*", cors());
app.use(trimTrailingSlash());
app.use(compress());

// Apply auth middleware to protected routes
app.use("/entities/*", authMiddleware);
app.use("/accounts/*", authMiddleware);
app.use("/credit-cards/*", authMiddleware);
app.use("/loans/*", authMiddleware);
app.use("/income/*", authMiddleware);
app.use("/transactions/*", authMiddleware);

app.route("/", usersRouter);
app.route("/", entitiesRouter);
app.route("/", accountsRouter);
app.route("/", creditCardsRouter);
app.route("/", loansRouter);
app.route("/", incomeRouter);
app.route("/", transactionsRouter);

app.get("/auth/me", authMiddleware, async (c) => {
  const user = c.get("user");

  return c.json({
    message: "You are logged in!",
    user,
  });
});

app.all("*", (c) => {
  return c.json({ sucess: false, message: "Not Found" }, 404);
});

export default app;
