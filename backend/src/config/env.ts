import z from "zod";
import { config } from "dotenv";

config({
  quiet: true,
});

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  MYSQL_URL: z
    .string()
    .regex(
      /^mysql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^/]+$/,
      "Invalid MySQL URL format. Expected format: mysql://{username}:{password}@{HOST}:{PORT}/{db_name}"
    ),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters long"),
});

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(parsedEnv.error)
  );
  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
