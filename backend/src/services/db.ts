import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../config/env";

const db = drizzle({ connection: env.MYSQL_URL, casing: "snake_case" });

export default db;
