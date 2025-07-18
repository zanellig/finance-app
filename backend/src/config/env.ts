import * as z from "zod";
import { configDotenv } from "dotenv";

configDotenv();

const envSchema = z.object({
  MYSQL_URL: z
    .string()
    .regex(
      /^mysql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^\/]+$/,
      "Invalid MySQL URL format. Expected format: mysql://{username}:{password}@{HOST}:{PORT}/{db_name}"
    ),
});

export const env = envSchema.parse(process.env);
