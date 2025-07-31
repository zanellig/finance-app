import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from "drizzle-orm/mysql-core";

import { entities } from "./entities.model";
import { users } from "./users.model";
import { v4 } from "uuid";
import { defaultTimestamps, noActionCascade } from "./constants";

export const loans = mysqlTable("loans", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  entityId: varchar("entity_id", { length: 36 }).references(
    () => entities.id,
    noActionCascade
  ),
  name: varchar({ length: 255 }),
  initialCapital: decimal("initial_capital", {
    precision: 2,
  })
    .notNull()
    .default("0.00"),
  annualInterestRate: decimal("annual_interest_rate", {
    precision: 2,
  })
    .notNull()
    .default("0.00"),
  installments: int({ unsigned: true }).notNull().default(1),
  remainingInstallments: int("remaining_installments", {
    unsigned: true,
  }).notNull(),
  totalAnnualFinancedCost: decimal("total_annual_financed_cost", {
    precision: 2,
  }).notNull(),
  amortizationStrategy: mysqlEnum("amortization_strategy", [
    "flat",
    "french",
    "german",
    "american",
  ]),
  currency: mysqlEnum(["ARS", "USD"]).default("ARS"),
  remainingCapital: decimal("remaining_capital", {
    precision: 2,
  }).notNull(),
  ...defaultTimestamps,
});
