import { Hono } from "hono";
import db from "@/services/db";
import { getAuth } from "@hono/clerk-auth";

import { creditCards } from "@/models/credit-cards.model";
import { entities } from "@/models/entities.model";
import { users } from "@/models/users.model";
import { eq, and } from "drizzle-orm";

import {
  createCreditCardDto,
  createCreditCardResponseDto,
  getCreditCardsDto,
  getCreditCardDto,
  updateCreditCardDto,
} from "@/dtos/credit-cards.dto";

import { validateBody } from "@/utils/validator";

const creditCardsRouter = new Hono().basePath("/credit-cards");

// Get all credit cards for the authenticated user
creditCardsRouter.get("/", async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get all credit cards for entities owned by the user
  const creditCardsRes = await db
    .select()
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(eq(entities.userId, user.id));
    
  const creditCardsDto = getCreditCardsDto.safeParse(creditCardsRes.map(result => result.credit_cards));
  return c.json(creditCardsDto.data || [], creditCardsDto.success ? 200 : 500);
});

// Get specific credit card for the authenticated user
creditCardsRouter.get("/:id", async (c) => {
  const auth = getAuth(c);
  const creditCardId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!creditCardId) {
    return c.json({ error: "Credit card ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get credit card that belongs to an entity owned by the user
  const [creditCardRes] = await db
    .select()
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCards.id, creditCardId), eq(entities.userId, user.id)));

  if (!creditCardRes) {
    return c.json({ error: "Credit card not found" }, 404);
  }

  const creditCardDto = getCreditCardDto.safeParse(creditCardRes.credit_cards);
  return c.json(creditCardDto.data, creditCardDto.success ? 200 : 500);
});

// Create new credit card for the authenticated user
creditCardsRouter.post("/", validateBody(createCreditCardDto), async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const creditCardData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the entity belongs to the user
  const [entity] = await db
    .select({ id: entities.id })
    .from(entities)
    .where(and(eq(entities.id, creditCardData.entityId), eq(entities.userId, user.id)));

  if (!entity) {
    return c.json({ error: "Entity not found or unauthorized" }, 404);
  }

  // Check if credit card with same name already exists for this entity
  const [existingCreditCard] = await db
    .select({ id: creditCards.id })
    .from(creditCards)
    .where(and(eq(creditCards.name, creditCardData.name), eq(creditCards.entityId, creditCardData.entityId)));

  if (existingCreditCard) {
    return c.json(
      { error: "Credit card already exists", data: existingCreditCard },
      409
    );
  }

  const [res] = await db
    .insert(creditCards)
    .values(creditCardData)
    .$returningId();

  const responseDto = createCreditCardResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update credit card
creditCardsRouter.put("/:id", validateBody(updateCreditCardDto), async (c) => {
  const auth = getAuth(c);
  const creditCardId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!creditCardId) {
    return c.json({ error: "Credit card ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the credit card belongs to an entity owned by the user
  const [creditCardRes] = await db
    .select()
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCards.id, creditCardId), eq(entities.userId, user.id)));

  if (!creditCardRes) {
    return c.json({ error: "Credit card not found" }, 404);
  }

  await db
    .update(creditCards)
    .set(updateData)
    .where(eq(creditCards.id, creditCardId));

  return c.json({ success: true }, 200);
});

// Delete credit card (soft delete by setting status)
creditCardsRouter.delete("/:id", async (c) => {
  const auth = getAuth(c);
  const creditCardId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!creditCardId) {
    return c.json({ error: "Credit card ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the credit card belongs to an entity owned by the user
  const [creditCardRes] = await db
    .select()
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCards.id, creditCardId), eq(entities.userId, user.id)));

  if (!creditCardRes) {
    return c.json({ error: "Credit card not found" }, 404);
  }

  await db
    .update(creditCards)
    .set({ status: "deleted" })
    .where(eq(creditCards.id, creditCardId));

  return c.json({ success: true }, 200);
});

export default creditCardsRouter;