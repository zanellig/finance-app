import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: env.MYSQL_URL,
  },
  schema: "./src/models",
  casing: "snake_case",
  strict: true,
  verbose: true,
});
