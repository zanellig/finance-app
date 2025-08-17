import { Hono } from "hono";
import db from "@/services/db";


import { transactions, creditCardTransactions } from "@/models/transactions.model";
import { accounts } from "@/models/accounts.model";
import { creditCards } from "@/models/credit-cards.model";
import { entities } from "@/models/entities.model";
import { users } from "@/models/users.model";
import { eq, and } from "drizzle-orm";

import {
  createTransactionDto,
  createTransactionResponseDto,
  getTransactionsDto,
  getTransactionDto,
  updateTransactionDto,
  createCreditCardTransactionDto,
  createCreditCardTransactionResponseDto,
  getCreditCardTransactionsDto,
  getCreditCardTransactionDto,
  updateCreditCardTransactionDto,
} from "@/dtos/transactions.dto";

import { validateBody } from "@/utils/validator";

const transactionsRouter = new Hono().basePath("/transactions");

// Get all transactions for the authenticated user
transactionsRouter.get("/", async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const transactionsRes = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, user.id));
    
  const transactionsDto = getTransactionsDto.safeParse(transactionsRes);
  return c.json(transactionsDto.data || [], transactionsDto.success ? 200 : 500);
});

// Get specific transaction for the authenticated user
transactionsRouter.get("/:id", async (c) => {
  const auth = getAuth(c);
  const transactionId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!transactionId) {
    return c.json({ error: "Transaction ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const [transactionRes] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, user.id)));

  if (!transactionRes) {
    return c.json({ error: "Transaction not found" }, 404);
  }

  const transactionDto = getTransactionDto.safeParse(transactionRes);
  return c.json(transactionDto.data, transactionDto.success ? 200 : 500);
});

// Create new transaction for the authenticated user
transactionsRouter.post("/", validateBody(createTransactionDto), async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const transactionData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify both accounts belong to entities owned by the user
  const [fromAccount] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .innerJoin(entities, eq(accounts.entityId, entities.id))
    .where(and(eq(accounts.id, transactionData.fromAccountId), eq(entities.userId, user.id)));

  const [toAccount] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .innerJoin(entities, eq(accounts.entityId, entities.id))
    .where(and(eq(accounts.id, transactionData.toAccountId), eq(entities.userId, user.id)));

  if (!fromAccount || !toAccount) {
    return c.json({ error: "One or both accounts not found or access denied" }, 403);
  }

  const [res] = await db
    .insert(transactions)
    .values({ ...transactionData, userId: user.id })
    .$returningId();

  const responseDto = createTransactionResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update transaction for the authenticated user
transactionsRouter.put("/:id", validateBody(updateTransactionDto), async (c) => {
  const auth = getAuth(c);
  const transactionId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!transactionId) {
    return c.json({ error: "Transaction ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify transaction belongs to user
  const [transactionCheck] = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, user.id)));

  if (!transactionCheck) {
    return c.json({ error: "Transaction not found or access denied" }, 403);
  }

  await db
    .update(transactions)
    .set(updateData)
    .where(eq(transactions.id, transactionId));

  return c.json({ success: true }, 200);
});

// Delete transaction for the authenticated user
transactionsRouter.delete("/:id", async (c) => {
  const auth = getAuth(c);
  const transactionId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!transactionId) {
    return c.json({ error: "Transaction ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify transaction belongs to user
  const [transactionCheck] = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(and(eq(transactions.id, transactionId), eq(transactions.userId, user.id)));

  if (!transactionCheck) {
    return c.json({ error: "Transaction not found or access denied" }, 403);
  }

  await db.update(transactions).set({
    status: "deleted",
    deletedAt: new Date()
  }).where(eq(transactions.id, transactionId));

  return c.json({ success: true }, 200);
});

// Credit Card Transactions Routes

// Get all credit card transactions for the authenticated user
transactionsRouter.get("/credit-cards", async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Get credit card transactions through credit cards and entities
  const ccTransactionsRes = await db
    .select()
    .from(creditCardTransactions)
    .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(eq(entities.userId, user.id));
    
  const ccTransactionsDto = getCreditCardTransactionsDto.safeParse(
    ccTransactionsRes.map(result => result.credit_card_transactions)
  );
  return c.json(ccTransactionsDto.data || [], ccTransactionsDto.success ? 200 : 500);
});

// Get specific credit card transaction for the authenticated user
transactionsRouter.get("/credit-cards/:id", async (c) => {
  const auth = getAuth(c);
  const ccTransactionId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!ccTransactionId) {
    return c.json({ error: "Credit card transaction ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const [ccTransactionRes] = await db
    .select()
    .from(creditCardTransactions)
    .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCardTransactions.id, ccTransactionId), eq(entities.userId, user.id)));

  if (!ccTransactionRes) {
    return c.json({ error: "Credit card transaction not found" }, 404);
  }

  const ccTransactionDto = getCreditCardTransactionDto.safeParse(ccTransactionRes.credit_card_transactions);
  return c.json(ccTransactionDto.data, ccTransactionDto.success ? 200 : 500);
});

// Create new credit card transaction for the authenticated user
transactionsRouter.post("/credit-cards", validateBody(createCreditCardTransactionDto), async (c) => {
  const auth = getAuth(c);
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const ccTransactionData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify credit card belongs to entity owned by the user
  const [creditCard] = await db
    .select({ id: creditCards.id })
    .from(creditCards)
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCards.id, ccTransactionData.creditCardId), eq(entities.userId, user.id)));

  if (!creditCard) {
    return c.json({ error: "Credit card not found or access denied" }, 403);
  }

  const [res] = await db
    .insert(creditCardTransactions)
    .values(ccTransactionData)
    .$returningId();

  const responseDto = createCreditCardTransactionResponseDto.safeParse(res);
  return c.json(responseDto.data, 201);
});

// Update credit card transaction for the authenticated user
transactionsRouter.put("/credit-cards/:id", validateBody(updateCreditCardTransactionDto), async (c) => {
  const auth = getAuth(c);
  const ccTransactionId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!ccTransactionId) {
    return c.json({ error: "Credit card transaction ID required" }, 400);
  }

  const updateData = c.req.valid("json");

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify credit card transaction belongs to user through credit card and entity
  const [ccTransactionCheck] = await db
    .select({ id: creditCardTransactions.id })
    .from(creditCardTransactions)
    .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCardTransactions.id, ccTransactionId), eq(entities.userId, user.id)));

  if (!ccTransactionCheck) {
    return c.json({ error: "Credit card transaction not found or access denied" }, 403);
  }

  await db
    .update(creditCardTransactions)
    .set(updateData)
    .where(eq(creditCardTransactions.id, ccTransactionId));

  return c.json({ success: true }, 200);
});

// Delete credit card transaction for the authenticated user
transactionsRouter.delete("/credit-cards/:id", async (c) => {
  const auth = getAuth(c);
  const ccTransactionId = c.req.param("id");
  
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!ccTransactionId) {
    return c.json({ error: "Credit card transaction ID required" }, 400);
  }

  // Get user from database using Clerk userId
  const [user] = await db.select().from(users).where(eq(users.externalId, auth.userId));
  
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Verify credit card transaction belongs to user through credit card and entity
  const [ccTransactionCheck] = await db
    .select({ id: creditCardTransactions.id })
    .from(creditCardTransactions)
    .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
    .innerJoin(entities, eq(creditCards.entityId, entities.id))
    .where(and(eq(creditCardTransactions.id, ccTransactionId), eq(entities.userId, user.id)));

  if (!ccTransactionCheck) {
    return c.json({ error: "Credit card transaction not found or access denied" }, 403);
  }

  await db.update(creditCardTransactions).set({
    recordStatus: "deleted",
    deletedAt: new Date()
  }).where(eq(creditCardTransactions.id, ccTransactionId));

  return c.json({ success: true }, 200);
});

export default transactionsRouter;