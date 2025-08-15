import { Hono } from "hono";
import db from "@/services/db";


import { loans } from "@/models/loans.model";
import { entities } from "@/models/entities.model";
import { users } from "@/models/users.model";
import { eq, and } from "drizzle-orm";

import {
  createLoanDto,
  createLoanResponseDto,
  getLoansDto,
  getLoanDto,
  updateLoanDto,
} from "@/dtos/loans.dto";

import { validateBody } from "@/utils/validator";

const loansRouter = new Hono().basePath("/loans");

// Get all loans for the authenticated user
loansRouter.get("/", async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get all loans for entities owned by the user
  const loansRes = await db
    .select()
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(eq(entities.userId, user.id));
    
  const loansDto = getLoansDto.safeParse(loansRes.map(result => result.loans));
  return c.json(loansDto.data || [], loansDto.success ? 200 : 500);
});

// Get specific loan for the authenticated user
loansRouter.get("/:id", async (c) => {
  const auth = getAuth(c);
  const loanId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!loanId) {
    return c.json({ error: "Loan ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get loan that belongs to an entity owned by the user
  const [loanRes] = await db
    .select()
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(and(eq(loans.id, loanId), eq(entities.userId, user.id)));

  if (!loanRes) {
    return c.json({ error: "Loan not found" }, 404);
  }

  const loanDto = getLoanDto.safeParse(loanRes.loans);
  return c.json(loanDto.data, loanDto.success ? 200 : 500);
});

// Create new loan for the authenticated user
loansRouter.post("/", validateBody(createLoanDto), async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const loanData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the entity belongs to the user
  const [entity] = await db
    .select({ id: entities.id })
    .from(entities)
    .where(and(eq(entities.id, loanData.entityId), eq(entities.userId, user.id)));

  if (!entity) {
    return c.json({ error: "Entity not found or unauthorized" }, 404);
  }

  // Check if loan with same name already exists for this entity
  const [existingLoan] = await db
    .select({ id: loans.id })
    .from(loans)
    .where(and(eq(loans.name, loanData.name), eq(loans.entityId, loanData.entityId)));

  if (existingLoan) {
    return c.json(
      { error: "Loan already exists", data: existingLoan },
      409
    );
  }

  const [res] = await db
    .insert(loans)
    .values(loanData)
    .$returningId();

  const responseDto = createLoanResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update loan
loansRouter.put("/:id", validateBody(updateLoanDto), async (c) => {
  const auth = getAuth(c);
  const loanId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!loanId) {
    return c.json({ error: "Loan ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the loan belongs to an entity owned by the user
  const [loanRes] = await db
    .select()
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(and(eq(loans.id, loanId), eq(entities.userId, user.id)));

  if (!loanRes) {
    return c.json({ error: "Loan not found" }, 404);
  }

  await db
    .update(loans)
    .set(updateData)
    .where(eq(loans.id, loanId));

  return c.json({ success: true }, 200);
});

// Delete loan
loansRouter.delete("/:id", async (c) => {
  const auth = getAuth(c);
  const loanId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!loanId) {
    return c.json({ error: "Loan ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify the loan belongs to an entity owned by the user
  const [loanRes] = await db
    .select()
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(and(eq(loans.id, loanId), eq(entities.userId, user.id)));

  if (!loanRes) {
    return c.json({ error: "Loan not found" }, 404);
  }

  await db
    .delete(loans)
    .where(eq(loans.id, loanId));

  return c.json({ success: true }, 200);
});

export default loansRouter;