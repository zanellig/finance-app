import * as z from "zod";
import { configDotenv } from "dotenv";

configDotenv({
  quiet: true,
});

const envSchema = z.object({
  MYSQL_URL: z
    .string()
    .regex(
      /^mysql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^\/]+$/,
      "Invalid MySQL URL format. Expected format: mysql://{username}:{password}@{HOST}:{PORT}/{db_name}",
    ),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(parsedEnv.error),
  );
  throw new Error("Invalid environment variables.");
}

export const env = parsedEnv.data;
