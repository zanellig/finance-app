import { Context, Next } from "hono";
import authService from "@/services/auth";
import db from "@/services/db";
import { users } from "@/models/users.model";
import { eq } from "drizzle-orm";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const token = authService.extractTokenFromHeader(authHeader);

  if (!token) {
    return c.json({ success: false, message: "Authentication required" }, 401);
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }

  // Verify user still exists in database
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, payload.userId));

    if (!user) {
      return c.json({ success: false, message: "User not found" }, 401);
    }

    // Add user info to context for use in handlers
    c.set("user", user);
    c.set("jwtPayload", payload);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ success: false, message: "Authentication failed" }, 401);
  }
};