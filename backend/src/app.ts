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
import createApp from "@/utils/create-app";

const app = createApp().basePath("/api");

// Apply auth middleware to protected routes
// app.use("/entities/*", authMiddleware);
// app.use("/accounts/*", authMiddleware);
// app.use("/credit-cards/*", authMiddleware);
// app.use("/loans/*", authMiddleware);
// app.use("/income/*", authMiddleware);
// app.use("/transactions/*", authMiddleware);

// app.route("/", usersRouter);
// app.route("/", entitiesRouter);
// app.route("/", accountsRouter);
// app.route("/", creditCardsRouter);
// app.route("/", loansRouter);
// app.route("/", incomeRouter);
// app.route("/", transactionsRouter);

export default app;
