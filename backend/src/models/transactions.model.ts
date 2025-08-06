import {
  boolean,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

import { v4 } from "uuid";

import { creditCards } from "@/models/credit-cards.model";
import { accounts } from "@/models/accounts.model";
import { loans } from "@/models/loans.model";
import { users } from "@/models/users.model";
import { defaultTimestamps, noActionCascade } from "@/models/constants";

export const creditCardTransactions = mysqlTable("credit_card_transactions", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  creditCardId: varchar("credit_card_id", { length: 36 })
    .references(() => creditCards.id, noActionCascade)
    .notNull(),
  status: mysqlEnum(["approved", "declined", "pending", "refunded"]).default(
    "pending",
  ),
  currency: mysqlEnum(["ARS", "USD"]).default("ARS"),
  amount: decimal({ precision: 2 }).default("0.00").notNull(),
  isInstallment: boolean("is_installment").default(false).notNull(),
  installments: int({ unsigned: true }).default(1).notNull(),
  currentInstallment: int("current_installment", { unsigned: true })
    .default(1)
    .notNull(),
  ...defaultTimestamps,
});

export const transactions = mysqlTable("transactions", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  userId: varchar("user_id", { length: 36 }).references(
    () => users.id,
    noActionCascade,
  ),
  fromAccountId: varchar("from_account_id", { length: 36 })
    .references(() => accounts.id, noActionCascade)
    .notNull(),
  toAccountId: varchar("to_account_id", { length: 36 })
    .references(() => accounts.id, noActionCascade)
    .notNull(),
  loanId: varchar("loan_id", { length: 36 }).references(
    () => loans.id,
    noActionCascade,
  ),
  type: mysqlEnum([
    "payment",
    "transfer",
    "loan_payment",
    "cc_payment",
  ]).notNull(),
  currency: mysqlEnum(["ARS", "USD"]).default("ARS"),
  amount: decimal({ precision: 2 }).default("0.00").notNull(),
  ...defaultTimestamps,
});
