import * as z from "zod";
import { configDotenv } from "dotenv";

configDotenv({
  quiet: true,
});

const envSchema = z.object({
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

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(parsedEnv.error)
  );
  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
