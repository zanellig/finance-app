import { Hono } from "hono";
import db from "@/services/db";
import { getAuth } from "@hono/clerk-auth";

import { income } from "@/models/income.model";
import { users } from "@/models/users.model";
import { eq, and } from "drizzle-orm";

import {
  createIncomeDto,
  createIncomeResponseDto,
  getIncomeDto,
  getIncomesDto,
  updateIncomeDto,
} from "@/dtos/income.dto";

import { validateBody } from "@/utils/validator";

const incomeRouter = new Hono().basePath("/income");

// Get all income for the authenticated user
incomeRouter.get("/", async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.externalId, auth.userId));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const incomeRes = await db
    .select()
    .from(income)
    .where(eq(income.userId, user.id));

  const incomeDto = getIncomesDto.safeParse(incomeRes);
  return c.json(incomeDto.data || [], incomeDto.success ? 200 : 500);
});

// Get specific income for the authenticated user
incomeRouter.get("/:id", async (c) => {
  const auth = getAuth(c);
  const incomeId = c.req.param("id");

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!incomeId) {
    return c.json({ error: "Income ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.externalId, auth.userId));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const [incomeRes] = await db
    .select()
    .from(income)
    .where(and(eq(income.id, incomeId), eq(income.userId, user.id)));

  if (!incomeRes) {
    return c.json({ error: "Income not found" }, 404);
  }

  const incomeDto = getIncomeDto.safeParse(incomeRes);
  return c.json(incomeDto.data, incomeDto.success ? 200 : 500);
});

// Create new income for the authenticated user
incomeRouter.post("/", validateBody(createIncomeDto), async (c) => {
  const auth = getAuth(c);

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const incomeData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.externalId, auth.userId));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Check if income with same name already exists for this user
  const [existingIncome] = await db
    .select({ id: income.id })
    .from(income)
    .where(and(eq(income.name, incomeData.name), eq(income.userId, user.id)));

  if (existingIncome) {
    return c.json(
      { error: "Income already exists", data: existingIncome },
      409
    );
  }

  const [res] = await db
    .insert(income)
    .values({ ...incomeData, userId: user.id })
    .$returningId();

  const responseDto = createIncomeResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update income for the authenticated user
incomeRouter.put("/:id", validateBody(updateIncomeDto), async (c) => {
  const auth = getAuth(c);
  const incomeId = c.req.param("id");

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!incomeId) {
    return c.json({ error: "Income ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.externalId, auth.userId));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify income belongs to user
  const [incomeCheck] = await db
    .select({ id: income.id })
    .from(income)
    .where(and(eq(income.id, incomeId), eq(income.userId, user.id)));

  if (!incomeCheck) {
    return c.json({ error: "Income not found or access denied" }, 403);
  }

  await db.update(income).set(updateData).where(eq(income.id, incomeId));

  return c.json({ success: true }, 200);
});

// Delete income for the authenticated user
incomeRouter.delete("/:id", async (c) => {
  const auth = getAuth(c);
  const incomeId = c.req.param("id");

  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!incomeId) {
    return c.json({ error: "Income ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.externalId, auth.userId));

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify income belongs to user
  const [incomeCheck] = await db
    .select({ id: income.id })
    .from(income)
    .where(and(eq(income.id, incomeId), eq(income.userId, user.id)));

  if (!incomeCheck) {
    return c.json({ error: "Income not found or access denied" }, 403);
  }

  await db.delete(income).where(eq(income.id, incomeId));

  return c.json({ success: true }, 200);
});

export default incomeRouter;
