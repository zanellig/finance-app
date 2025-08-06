import { mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { v4 } from "uuid";

import { defaultTimestamps } from "@/models/constants";

export const users = mysqlTable("users", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  status: mysqlEnum(["active", "inactive", "deleted"]).default("active"),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  ...defaultTimestamps,
});
