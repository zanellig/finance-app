import { Hono } from "hono";
import db from "@/services/db";
import { getAuth } from "@hono/clerk-auth";

import { accounts } from "@/models/accounts.model";
import { entities } from "@/models/entities.model";
import { users } from "@/models/users.model";
import { eq, and } from "drizzle-orm";

import {
  createAccountDto,
  createAccountResponseDto,
  getAccountsDto,
  getAccountDto,
  updateAccountDto,
} from "@/dtos/accounts.dto";

import { validateBody } from "@/utils/validator";

const accountsRouter = new Hono().basePath("/accounts");

// Get all accounts for the authenticated user
accountsRouter.get("/", async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get all accounts for entities owned by the user
  const accountsRes = await db
    .select()
    .from(accounts)
    .innerJoin(entities, eq(accounts.entityId, entities.id))
    .where(eq(entities.userId, user.id));
    
  const accountsDto = getAccountsDto.safeParse(accountsRes.map(result => result.accounts));
  return c.json(accountsDto.data || [], accountsDto.success ? 200 : 500);
});

// Get specific account for the authenticated user
accountsRouter.get("/:id", async (c) => {
  const auth = getAuth(c);
  const accountId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!accountId) {
    return c.json({ error: "Account ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get account that belongs to an entity owned by the user
  const [accountRes] = await db
    .select()
    .from(accounts)
    .innerJoin(entities, eq(accounts.entityId, entities.id))
    .where(and(eq(accounts.id, accountId), eq(entities.userId, user.id)));

  if (!accountRes) {
    return c.json({ error: "Account not found" }, 404);
  }

  const accountDto = getAccountDto.safeParse(accountRes.accounts);
  return c.json(accountDto.data, accountDto.success ? 200 : 500);
});

// Create new account for the authenticated user
accountsRouter.post("/", validateBody(createAccountDto), async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const accountData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the entity belongs to the user
  const [entity] = await db
    .select({ id: entities.id })
    .from(entities)
    .where(and(eq(entities.id, accountData.entityId), eq(entities.userId, user.id)));

  if (!entity) {
    return c.json({ error: "Entity not found or unauthorized" }, 404);
  }

  // Check if account with same name already exists for this entity
  const [existingAccount] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(and(eq(accounts.name, accountData.name), eq(accounts.entityId, accountData.entityId)));

  if (existingAccount) {
    return c.json(
      { error: "Account already exists", data: existingAccount },
      409
    );
  }

  const [res] = await db
    .insert(accounts)
    .values(accountData)
    .$returningId();

  const responseDto = createAccountResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update account for the authenticated user
accountsRouter.put("/:id", validateBody(updateAccountDto), async (c) => {
  const auth = getAuth(c);
  const accountId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!accountId) {
    return c.json({ error: "Account ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify account belongs to user through entity
  const [accountCheck] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .innerJoin(entities, eq(accounts.entityId, entities.id))
    .where(and(eq(accounts.id, accountId), eq(entities.userId, user.id)));

  if (!accountCheck) {
    return c.json({ error: "Account not found or access denied" }, 403);
  }

  await db
    .update(accounts)
    .set(updateData)
    .where(eq(accounts.id, accountId));

  return c.json({ success: true }, 200);
});

// Delete account for the authenticated user
accountsRouter.delete("/:id", async (c) => {
  const auth = getAuth(c);
  const accountId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!accountId) {
    return c.json({ error: "Account ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify account belongs to user through entity
  const [accountCheck] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .innerJoin(entities, eq(accounts.entityId, entities.id))
    .where(and(eq(accounts.id, accountId), eq(entities.userId, user.id)));

  if (!accountCheck) {
    return c.json({ error: "Account not found or access denied" }, 403);
  }

  await db.delete(accounts).where(eq(accounts.id, accountId));

  return c.json({ success: true }, 200);
});

export default accountsRouter;