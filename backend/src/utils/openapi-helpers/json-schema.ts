import type { z } from "zod";

export function createJsonContent<T>(schema: z.ZodType<T>): {
  content: { "application/json": { schema: z.ZodType<T> } };
};
export function createJsonContent<T>(
  schema: z.ZodType<T>,
  description: string
): {
  content: { "application/json": { schema: z.ZodType<T> } };
  description: string;
};
export function createJsonContent<T>(
  schema: z.ZodType<T>,
  description?: string
) {
  const result = {
    content: {
      "application/json": {
        schema,
      },
    },
  };

  if (description !== undefined) {
    return {
      ...result,
      description,
    };
  }

  return result;
}
