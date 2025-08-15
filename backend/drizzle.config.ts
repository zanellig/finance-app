import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: env.MYSQL_URL,
    // host: env.DB_HOST,
    // port: Number(env.DB_PORT) || 3306,
    // user: env.DB_USER,
    // password: env.DB_PASSWORD,
    // database: env.DB_NAME,
  },
  schema: "./src/models",
  casing: "snake_case",
  strict: true,
  verbose: true,
});
