// Use the actual application for testing using Hono testing approach
import createApp from "@/utils/create-app";
import usersRouter from "@/routes/users.route.ts";
import entitiesRouter from "@/routes/entities.route.ts";
import accountsRouter from "@/routes/accounts.route.ts";
import { testClient } from "hono/testing";

// Create the app with actual routes
const app = createApp();

// Mount routes with /api prefix
app.route("/api/users", usersRouter);
app.route("/api/entities", entitiesRouter);
app.route("/api/accounts", accountsRouter);

// Export both the app and the test client
export default app;
export const client = testClient(app);
