import { mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";

import { v4 } from "uuid";

import { users } from "@/models/users.model";
import { cascadeCascade, defaultTimestamps } from "@/models/constants";

export const entities = mysqlTable("entities", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  status: mysqlEnum(["active", "inactive", "deleted"]).default("active"),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, cascadeCascade)
    .notNull(),
  name: varchar({ length: 255 }).notNull().unique(),
  type: mysqlEnum(["bank", "wallet", "asset_manager"]).default("bank"),
  ...defaultTimestamps,
});
