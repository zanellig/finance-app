import { createSchemaFactory } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

import { users } from "@/models/users.model";
import { entities } from "@/models/entities.model";
import { accounts } from "@/models/accounts.model";
import { creditCards } from "@/models/credit-cards.model";
import { loans } from "@/models/loans.model";
import { income } from "@/models/income.model";
import {
  transactions,
  creditCardTransactions,
} from "@/models/transactions.model";

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });

/**
 * Fixed the need to wrap the schemas in z.object()
 * Still, the types are not inferred correctly
 * @see https://github.com/drizzle-team/drizzle-orm/pull/4865
 */

// User schemas
export const userSelectSchema = z.object(createSelectSchema(users).shape);
export const userInsertSchema = z.object(createInsertSchema(users).shape);
export const userUpdateSchema = z.object(createUpdateSchema(users).shape);

// Entity schemas
export const entitySelectSchema = z.object(createSelectSchema(entities).shape);
export const entityInsertSchema = z.object(createInsertSchema(entities).shape);
export const entityUpdateSchema = z.object(createUpdateSchema(entities).shape);

// Account schemas
export const accountSelectSchema = z.object(createSelectSchema(accounts).shape);
export const accountInsertSchema = z.object(createInsertSchema(accounts).shape);
export const accountUpdateSchema = z.object(createUpdateSchema(accounts).shape);

// Credit card schemas
export const creditCardSelectSchema = z.object(
  createSelectSchema(creditCards).shape
);
export const creditCardInsertSchema = z.object(
  createInsertSchema(creditCards).shape
);
export const creditCardUpdateSchema = z.object(
  createUpdateSchema(creditCards).shape
);

// Loan schemas
export const loanSelectSchema = z.object(createSelectSchema(loans).shape);
export const loanInsertSchema = z.object(createInsertSchema(loans).shape);
export const loanUpdateSchema = z.object(createUpdateSchema(loans).shape);

// Income schemas
export const incomeSelectSchema = z.object(createSelectSchema(income).shape);
export const incomeInsertSchema = z.object(createInsertSchema(income).shape);
export const incomeUpdateSchema = z.object(createUpdateSchema(income).shape);

// Transaction schemas
export const transactionSelectSchema = z.object(
  createSelectSchema(transactions).shape
);
export const transactionInsertSchema = z.object(
  createInsertSchema(transactions).shape
);
export const transactionUpdateSchema = z.object(
  createUpdateSchema(transactions).shape
);
export const creditCardTransactionSelectSchema = z.object(
  createSelectSchema(creditCardTransactions).shape
);

export const creditCardTransactionInsertSchema = z.object(
  createInsertSchema(creditCardTransactions).shape
);

export const creditCardTransactionUpdateSchema = z.object(
  createUpdateSchema(creditCardTransactions).shape
);
