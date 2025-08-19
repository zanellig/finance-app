// --- Middleware ---
import { authMiddleware } from "@/middleware/auth";

// --- Routes ---
import usersRouter from "@/routes/users.route";
import entitiesRouter from "@/routes/entities.route";
import accountsRouter from "@/routes/accounts.route";
import creditCardsRouter from "@/routes/credit-cards.route";
import loansRouter from "@/routes/loans.route";
import incomeRouter from "@/routes/income.route";
import transactionsRouter from "@/routes/transactions.route";

// --- Utils ---
import createApp from "@/utils/create-app";
import configureOpenAPI from "@/utils/openapi";

const app = createApp().basePath("/api");
configureOpenAPI(app);

// Apply auth middleware to protected routes
// app.use("/entities/*", authMiddleware);
// app.use("/accounts/*", authMiddleware);
// app.use("/credit-cards/*", authMiddleware);
// app.use("/loans/*", authMiddleware);
// app.use("/income/*", authMiddleware);
// app.use("/transactions/*", authMiddleware);

app.route("/", usersRouter);
app.route("/", entitiesRouter);

export default app;
