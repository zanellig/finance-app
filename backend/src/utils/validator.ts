import { validator } from "hono/validator";
import z from "zod";

export function validateBody<T>(schema: z.ZodType<T>) {
  return validator("json", (val, ctx) => {
    const parsed = schema.safeParse(val);
    if (!parsed.success) {
      ctx.status(400);
      return ctx.json({ error: "Invalid request body" });
    }
    return parsed.data;
  });
}
