import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    url: env.MYSQL_URL,
  },
  schema: "./src/models",
});
