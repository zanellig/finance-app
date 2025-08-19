import { Hono } from "hono";
import db from "@/services/db";

import { creditCards } from "@/models/credit-cards.model";
import { entities } from "@/models/entities.model";
import { eq, and, ne } from "drizzle-orm";

import {
  createCreditCardDto,
  createCreditCardResponseDto,
  getCreditCardsDto,
  getCreditCardDto,
  updateCreditCardDto,
} from "@/dtos/credit-cards.dto";

import { validateBody } from "@/utils/validator";

const creditCardsRouter = new Hono<{
  Variables: { user: { id: string; email: string; name: string } };
}>().basePath("/credit-cards");

// Get all credit cards for the authenticated user
creditCardsRouter.get("/", async (c) => {
  const user = c.get("user");

  // Get all credit cards for entities owned by the user
  const creditCardsRes = await db
    .select()
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(
      and(
        eq(entities.userId, user.id),
        ne(creditCards.status, "deleted"),
        ne(entities.status, "deleted")
      )
    );

  const creditCardsDto = getCreditCardsDto.safeParse(
    creditCardsRes.map((result) => result.credit_cards)
  );
  return c.json(creditCardsDto.data || [], creditCardsDto.success ? 200 : 500);
});

// Get specific credit card for the authenticated user
creditCardsRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const creditCardId = c.req.param("id");

  if (!creditCardId) {
    return c.json({ error: "Credit card ID required" }, 400);
  }

  // Get credit card that belongs to an entity owned by the user
  const [creditCardRes] = await db
    .select()
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(
      and(
        eq(creditCards.id, creditCardId),
        eq(entities.userId, user.id),
        ne(creditCards.status, "deleted"),
        ne(entities.status, "deleted")
      )
    );

  if (!creditCardRes) {
    return c.json({ error: "Credit card not found" }, 404);
  }

  const creditCardDto = getCreditCardDto.safeParse(creditCardRes.credit_cards);
  return c.json(creditCardDto.data, creditCardDto.success ? 200 : 500);
});

// Create new credit card for the authenticated user
creditCardsRouter.post("/", validateBody(createCreditCardDto), async (c) => {
  const user = c.get("user");
  const creditCardData = c.req.valid("json");

  if (!creditCardData.entityId) {
    return c.json({ error: "Entity ID is required" }, 400);
  }

  // Verify the entity belongs to the user
  const [entity] = await db
    .select({ id: entities.id })
    .from(entities)
    .where(
      and(
        eq(entities.id, creditCardData.entityId),
        eq(entities.userId, user.id)
      )
    );

  if (!entity) {
    return c.json({ error: "Entity not found or unauthorized" }, 404);
  }

  // Check if credit card with same name already exists for this entity
  const [existingCreditCard] = await db
    .select({ id: creditCards.id })
    .from(creditCards)
    .where(
      and(
        eq(creditCards.name, creditCardData.name),
        eq(creditCards.entityId, creditCardData.entityId!)
      )
    );

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
  const user = c.get("user");
  const creditCardId = c.req.param("id");

  if (!creditCardId) {
    return c.json({ error: "Credit card ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Verify the credit card belongs to an entity owned by the user
  const [creditCardCheck] = await db
    .select({ id: creditCards.id })
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCards.id, creditCardId), eq(entities.userId, user.id)));

  if (!creditCardCheck) {
    return c.json({ error: "Credit card not found or access denied" }, 403);
  }

  await db
    .update(creditCards)
    .set(updateData)
    .where(eq(creditCards.id, creditCardId));

  return c.json({ success: true }, 200);
});

// Delete credit card (soft delete by setting status)
creditCardsRouter.delete("/:id", async (c) => {
  const user = c.get("user");
  const creditCardId = c.req.param("id");

  if (!creditCardId) {
    return c.json({ error: "Credit card ID required" }, 400);
  }

  // Verify the credit card belongs to an entity owned by the user
  const [creditCardCheck] = await db
    .select({ id: creditCards.id })
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCards.id, creditCardId), eq(entities.userId, user.id)));

  if (!creditCardCheck) {
    return c.json({ error: "Credit card not found or access denied" }, 403);
  }

  await db
    .update(creditCards)
    .set({
      status: "deleted",
      deletedAt: new Date(),
    })
    .where(eq(creditCards.id, creditCardId));

  return c.json({ success: true }, 200);
});

export default creditCardsRouter;
