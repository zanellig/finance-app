import { Context } from "hono";
import db from "../services/db";
import { users } from "../models/users.model";

export async function createTestUser(c: Context) {
  const { name, email } = await c.req.json();
  const result = await db
    .insert(users)
    .values({
      name,
      email,
    })
    .catch((error) => console.error(error));

  return c.json({ data: result }, 201);
}
