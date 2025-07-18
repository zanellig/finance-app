import {
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { users } from "./users.model";
import { v4 } from "uuid";

export const entities = mysqlTable("entities", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  status: mysqlEnum(["active", "inactive", "deleted"]).default("active"),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  type: mysqlEnum(["bank", "wallet", "asset_manager"]).default("bank"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
