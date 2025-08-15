import * as z from "zod";
import { configDotenv } from "dotenv";

configDotenv({
  quiet: true,
});

const envSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
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
