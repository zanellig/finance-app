import { Context } from "hono";
import { JWTPayload } from "@/services/auth";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContext extends Context {
  get(key: "user"): User;
  get(key: "jwtPayload"): JWTPayload;
  set(key: "user", value: User): void;
  set(key: "jwtPayload", value: JWTPayload): void;
}