import { Hono } from "hono";
import db from "@/services/db";

import { entities } from "@/models/entities.model";
import { eq, and, ne } from "drizzle-orm";

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
  const user = c.get("user");

  const entitiesRes = await db
    .select()
    .from(entities)
    .where(and(eq(entities.userId, user.id), ne(entities.status, "deleted")));
    
  const entitiesDto = getEntitiesDto.safeParse(entitiesRes);
  return c.json(entitiesDto.data || [], entitiesDto.success ? 200 : 500);
});

// Get specific entity for the authenticated user
entitiesRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const entityId = c.req.param("id");
  
  if (!entityId) {
    return c.json({ error: "Entity ID required" }, 400);
  }

  const [entityRes] = await db
    .select()
    .from(entities)
    .where(and(eq(entities.id, entityId), eq(entities.userId, user.id), ne(entities.status, "deleted")));

  if (!entityRes) {
    return c.json({ error: "Entity not found" }, 404);
  }

  const entityDto = getEntityDto.safeParse(entityRes);
  return c.json(entityDto.data, entityDto.success ? 200 : 500);
});

// Create new entity for the authenticated user
entitiesRouter.post("/", validateBody(createEntityDto), async (c) => {
  const user = c.get("user");
  const { name, type } = c.req.valid("json");

  const [entityRes] = await db
    .insert(entities)
    .values({
      name,
      type,
      userId: user.id,
    })
    .$returningId();

  const entityDto = createEntityResponseDto.safeParse(entityRes);
  return c.json(entityDto.data, entityDto.success ? 201 : 500);
});

export default entitiesRouter;