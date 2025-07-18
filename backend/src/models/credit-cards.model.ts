import {
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { entities } from "./entities.model";
import { v4 } from "uuid";

export const creditCards = mysqlTable("credit_cards", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  entityId: varchar("entity_id", { length: 36 }).references(() => entities.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  status: mysqlEnum(["active", "inactive", "blocked", "deleted"]).default(
    "inactive"
  ),
  name: varchar({ length: 36 }).notNull().unique(),
  description: varchar({ length: 255 }),
  limit: decimal({
    precision: 2,
  })
    .notNull()
    .default("0.00"),
  /** Optional, non-required */
  number: varchar({ length: 16 }).unique(),
  expiration: timestamp().notNull(),
  closingDay: int("closing_day").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
