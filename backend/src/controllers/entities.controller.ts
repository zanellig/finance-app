import db from "../services/db";
import { entities } from "../models/entities.model";
import { eq } from "drizzle-orm";
import {
  createEntityDto,
  createEntityResponseDto,
  getEntitiesDto,
  getEntityDto,
} from "../dtos/entities.dto";

import type { Context } from "hono";
import { users } from "../models/users.model";

export async function getEntities(c: Context) {
  const entitiesRes = await db.select().from(entities);
  const entitiesDto = getEntitiesDto.safeParse(entitiesRes);
  return c.json(entitiesDto, entitiesDto.success ? 200 : 404);
}

export async function getEntity(c: Context) {
  const entityId = c.req.param("id");
  if (entityId) {
    const entityRes = await db
      .select()
      .from(entities)
      .where(eq(entities.id, entityId));
    const entityDto = getEntityDto.safeParse(entityRes[0]);
    return c.json(entityDto, entityDto.success ? 200 : 404);
  }
  return c.json({ data: null }, 400);
}

export async function createEntity(c: Context) {
  const entity = await c.req.json();
  const entityInsertor = createEntityDto.safeParse(entity);
  if (!entityInsertor.success) {
    console.log(entityInsertor);
    return c.json({ data: null }, 400);
  }
  const [user] = await db.select().from(users);
  const existingEntity = await db
    .select({
      id: entities.id,
    })
    .from(entities)
    .where(eq(entities.name, entityInsertor.data.name));
  if (existingEntity.length) {
    return c.json(
      { error: "Entity already exists", data: existingEntity[0] },
      409
    );
  }
  const [res] = await db
    .insert(entities)
    .values({ userId: user.id, ...entityInsertor.data })
    .$returningId();

  return c.json(createEntityResponseDto.safeParse(res), 201);
}
