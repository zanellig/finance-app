import {
  boolean,
  decimal,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { v4 } from "uuid";

import { entities } from "@/models/entities.model";
import { cascadeCascade, defaultTimestamps } from "@/models/constants";

export const accounts = mysqlTable("accounts", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  entityId: varchar("entity_id", { length: 36 })
    .references(() => entities.id, cascadeCascade)
    .notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  type: mysqlEnum(["savings", "checking", "interest_bearing"]).notNull(),
  balance: decimal({ precision: 2, unsigned: false }).notNull().default("0.00"),
  /** Also referred to as TNA, not accounting for taxes */
  annualNominalRate: decimal("annual_nominal_rate", { precision: 2 })
    .notNull()
    .default("0.00"),
  isSalaryAccount: boolean("is_salary_account").notNull().default(false),
  overdraftLimit: decimal("overdraft_limit", { precision: 2 })
    .notNull()
    .default("0.00"),
  accountNumber: varchar("account_number", { length: 50 }).unique(),
  currency: mysqlEnum("currency", ["ARS", "USD"]).default("ARS"),
  openedAt: timestamp("opened_at"),
  ...defaultTimestamps,
});
