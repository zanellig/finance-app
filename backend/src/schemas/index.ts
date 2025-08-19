import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { users } from "@/models/users.model";
import { entities } from "@/models/entities.model";
import { accounts } from "@/models/accounts.model";
import { creditCards } from "@/models/credit-cards.model";
import { loans } from "@/models/loans.model";
import { income } from "@/models/income.model";
import { transactions, creditCardTransactions } from "@/models/transactions.model";

// User schemas
export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users);
export const userUpdateSchema = createUpdateSchema(users);

// Entity schemas
export const entitySelectSchema = createSelectSchema(entities);
export const entityInsertSchema = createInsertSchema(entities);
export const entityUpdateSchema = createUpdateSchema(entities);

// Account schemas
export const accountSelectSchema = createSelectSchema(accounts);
export const accountInsertSchema = createInsertSchema(accounts);
export const accountUpdateSchema = createUpdateSchema(accounts);

// Credit card schemas
export const creditCardSelectSchema = createSelectSchema(creditCards);
export const creditCardInsertSchema = createInsertSchema(creditCards);
export const creditCardUpdateSchema = createUpdateSchema(creditCards);

// Loan schemas
export const loanSelectSchema = createSelectSchema(loans);
export const loanInsertSchema = createInsertSchema(loans);
export const loanUpdateSchema = createUpdateSchema(loans);

// Income schemas
export const incomeSelectSchema = createSelectSchema(income);
export const incomeInsertSchema = createInsertSchema(income);
export const incomeUpdateSchema = createUpdateSchema(income);

// Transaction schemas
export const transactionSelectSchema = createSelectSchema(transactions);
export const transactionInsertSchema = createInsertSchema(transactions);
export const transactionUpdateSchema = createUpdateSchema(transactions);

export const creditCardTransactionSelectSchema = createSelectSchema(creditCardTransactions);
export const creditCardTransactionInsertSchema = createInsertSchema(creditCardTransactions);
export const creditCardTransactionUpdateSchema = createUpdateSchema(creditCardTransactions);

// Legacy exports for compatibility (using select schemas as base)
export const user = userSelectSchema;
export const entity = entitySelectSchema;
export const account = accountSelectSchema;
export const creditCard = creditCardSelectSchema;
export const loan = loanSelectSchema;
export const incomeSchema = incomeSelectSchema;
export const transaction = transactionSelectSchema;
export const creditCardTransaction = creditCardTransactionSelectSchema;