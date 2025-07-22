import type { Context } from "hono";
import db from "../services/db";
import { entities } from "../models/entities.model";
import { eq } from "drizzle-orm";

export async function getEntities(c: Context) {
  const entitiesRes = await db.select().from(entities);
  return c.json({ data: entitiesRes }, entitiesRes.length ? 200 : 404);
}

export async function getEntity(c: Context) {
  const entityId = c.req.param("id");

  if (entityId) {
    const entityRes = await db
      .select()
      .from(entities)
      .where(eq(entities.id, entityId));
    return c.json({ data: entityRes }, entityRes.length ? 200 : 404);
  }

  return c.json({ data: null }, 404);
}

export async function createEntity(c: Context) {
  const entity = await c.req.json();
  const entityRes = await db.insert(entities).values(entity);
  return c.json({ data: entityRes }, 201);
}
