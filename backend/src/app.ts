// --- Routes ---
import usersRouter from "@/routes/users.route";
// import entitiesRouter from "@/routes/entities.route";
// import accountsRouter from "@/routes/accounts.route";

// --- Services ---
import redisService from "@/services/redis";

// --- Utils ---
import createApp from "@/utils/create-app";
import configureOpenAPI from "@/utils/openapi";

const app = createApp().basePath("/api");
configureOpenAPI(app);

// Initialize Redis connection
redisService.connect().catch(console.error);

// Apply auth middleware to protected routes
// app.use("/entities/*", authMiddleware);
// app.use("/credit-cards/*", authMiddleware);
// app.use("/loans/*", authMiddleware);
// app.use("/income/*", authMiddleware);
// app.use("/transactions/*", authMiddleware);

app.route("/", usersRouter);
// app.route("/", entitiesRouter);
// app.route("/", accountsRouter);

export default app;
