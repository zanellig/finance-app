import {
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { v4 } from "uuid";

export const users = mysqlTable("users", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  status: mysqlEnum(["active", "inactive", "deleted"]).default("active"),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
});
