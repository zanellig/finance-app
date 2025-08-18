import { env } from "@/config/env";
import { pinoLogger } from "hono-pino";
import pino = require("pino");
import { PinoPretty } from "pino-pretty";

export function logger() {
  return pinoLogger({
    nodeRuntime: true,
    pino: pino(
      {
        level: env.LOG_LEVEL,
      },
      env.NODE_ENV !== "production" ? PinoPretty() : undefined
    ),
  });
}
