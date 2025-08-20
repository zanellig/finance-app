import {
  boolean,
  decimal,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { v4 } from "uuid";

import { defaultTimestamps, noActionCascade } from "@/models/constants";
import { users } from "@/models/users.model";

export const income = mysqlTable("income", {
  id: varchar({ length: 36 }).primaryKey().unique().$defaultFn(v4),
  userId: varchar("user_id", { length: 36 }).references(
    () => users.id,
    noActionCascade
  ),
  status: mysqlEnum(["active", "inactive", "deleted"]).default("active"),
  name: varchar({ length: 255 }),
  amount: decimal({
    precision: 2,
  })
    .notNull()
    .default("0.00"),
  frequency: mysqlEnum([
    "monthly",
    "biweekly",
    "quarterly",
    "annually",
  ]).notNull(),
  isHourly: boolean("is_hourly").default(false),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  ...defaultTimestamps,
});
