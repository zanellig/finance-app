import { env } from "@/config/env";
import { pinoLogger } from "hono-pino";
import pino from "pino";
import { PinoPretty } from "pino-pretty";

export function loggerInstance() {
  return pino(
    {
      level: env.LOG_LEVEL,
    },
    env.NODE_ENV !== "production" ? PinoPretty() : undefined
  );
}

export function logger() {
  return pinoLogger({
    nodeRuntime: true,
    pino: loggerInstance(),
  });
}
