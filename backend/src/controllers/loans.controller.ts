import { Hono } from "hono";
import db from "@/services/db";

import { loans } from "@/models/loans.model";
import { entities } from "@/models/entities.model";
import { eq, and, ne } from "drizzle-orm";

import {
  createLoanDto,
  createLoanResponseDto,
  getLoansDto,
  getLoanDto,
  updateLoanDto,
} from "@/dtos/loans.dto";

import { validateBody } from "@/utils/validator";

const loansRouter = new Hono<{
  Variables: { user: { id: string; email: string; name: string } };
}>().basePath("/loans");

// Get all loans for the authenticated user
loansRouter.get("/", async (c) => {
  const user = c.get("user");

  // Get all loans for entities owned by the user
  const loansRes = await db
    .select()
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(
      and(
        eq(entities.userId, user.id),
        ne(loans.status, "deleted"),
        ne(entities.status, "deleted")
      )
    );

  const loansDto = getLoansDto.safeParse(
    loansRes.map((result) => result.loans)
  );
  return c.json(loansDto.data || [], loansDto.success ? 200 : 500);
});

// Get specific loan for the authenticated user
loansRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const loanId = c.req.param("id");

  if (!loanId) {
    return c.json({ error: "Loan ID required" }, 400);
  }

  // Get loan that belongs to an entity owned by the user
  const [loanRes] = await db
    .select()
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(
      and(
        eq(loans.id, loanId),
        eq(entities.userId, user.id),
        ne(loans.status, "deleted"),
        ne(entities.status, "deleted")
      )
    );

  if (!loanRes) {
    return c.json({ error: "Loan not found" }, 404);
  }

  const loanDto = getLoanDto.safeParse(loanRes.loans);
  return c.json(loanDto.data, loanDto.success ? 200 : 500);
});

// Create new loan for the authenticated user
loansRouter.post("/", validateBody(createLoanDto), async (c) => {
  const user = c.get("user");
  const loanData = c.req.valid("json");

  if (!loanData.entityId) {
    return c.json({ error: "Entity ID is required" }, 400);
  }

  // Verify the entity belongs to the user
  const [entity] = await db
    .select({ id: entities.id })
    .from(entities)
    .where(
      and(eq(entities.id, loanData.entityId), eq(entities.userId, user.id))
    );

  if (!entity) {
    return c.json({ error: "Entity not found or unauthorized" }, 404);
  }

  // Check if loan with same name already exists for this entity (only if name is provided)
  if (loanData.name) {
    const [existingLoan] = await db
      .select({ id: loans.id })
      .from(loans)
      .where(
        and(eq(loans.name, loanData.name), eq(loans.entityId, loanData.entityId!))
      );

    if (existingLoan) {
      return c.json({ error: "Loan already exists", data: existingLoan }, 409);
    }
  }

  const [res] = await db.insert(loans).values({
    ...loanData,
    consolidatedAt: new Date(), // Required field not in DTO
  }).$returningId();

  const responseDto = createLoanResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update loan
loansRouter.put("/:id", validateBody(updateLoanDto), async (c) => {
  const user = c.get("user");
  const loanId = c.req.param("id");

  if (!loanId) {
    return c.json({ error: "Loan ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Verify the loan belongs to an entity owned by the user
  const [loanCheck] = await db
    .select({ id: loans.id })
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(and(eq(loans.id, loanId), eq(entities.userId, user.id)));

  if (!loanCheck) {
    return c.json({ error: "Loan not found or access denied" }, 403);
  }

  await db.update(loans).set(updateData).where(eq(loans.id, loanId));

  return c.json({ success: true }, 200);
});

// Delete loan (soft delete)
loansRouter.delete("/:id", async (c) => {
  const user = c.get("user");
  const loanId = c.req.param("id");

  if (!loanId) {
    return c.json({ error: "Loan ID required" }, 400);
  }

  // Verify the loan belongs to an entity owned by the user
  const [loanCheck] = await db
    .select({ id: loans.id })
    .from(loans)
    .innerJoin(entities, eq(loans.entityId, entities.id))
    .where(and(eq(loans.id, loanId), eq(entities.userId, user.id)));

  if (!loanCheck) {
    return c.json({ error: "Loan not found or access denied" }, 403);
  }

  await db
    .update(loans)
    .set({
      status: "deleted",
      deletedAt: new Date(),
    })
    .where(eq(loans.id, loanId));

  return c.json({ success: true }, 200);
});

export default loansRouter;
