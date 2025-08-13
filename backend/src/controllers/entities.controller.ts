import { Hono } from "hono";
import db from "@/services/db";
import { getAuth } from "@hono/clerk-auth";

import { entities } from "@/models/entities.model";
import { users } from "@/models/users.model";
import { eq, and } from "drizzle-orm";

import {
  createEntityDto,
  createEntityResponseDto,
  getEntitiesDto,
  getEntityDto,
} from "@/dtos/entities.dto";

import { validateBody } from "@/utils/validator";

const entitiesRouter = new Hono().basePath("/entities");

// Get all entities for the authenticated user
entitiesRouter.get("/", async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const entitiesRes = await db
    .select()
    .from(entities)
    .where(eq(entities.userId, user.id));
    
  const entitiesDto = getEntitiesDto.safeParse(entitiesRes);
  return c.json(entitiesDto.data || [], entitiesDto.success ? 200 : 500);
});

// Get specific entity for the authenticated user
entitiesRouter.get("/:id", async (c) => {
  const auth = getAuth(c);
  const entityId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!entityId) {
    return c.json({ error: "Entity ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const [entityRes] = await db
    .select()
    .from(entities)
    .where(and(eq(entities.id, entityId), eq(entities.userId, user.id)));

  if (!entityRes) {
    return c.json({ error: "Entity not found" }, 404);
  }

  const entityDto = getEntityDto.safeParse(entityRes);
  return c.json(entityDto.data, entityDto.success ? 200 : 500);
});

// Create new entity for the authenticated user
entitiesRouter.post("/", validateBody(createEntityDto), async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { name } = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Check if entity with same name already exists for this user
  const [existingEntity] = await db
    .select({ id: entities.id })
    .from(entities)
    .where(and(eq(entities.name, name), eq(entities.userId, user.id)));

  if (existingEntity) {
    return c.json(
      { error: "Entity already exists", data: existingEntity },
      409
    );
  }

  const [res] = await db
    .insert(entities)
    .values({ userId: user.id, name })
    .$returningId();

  const responseDto = createEntityResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

export default entitiesRouter;
