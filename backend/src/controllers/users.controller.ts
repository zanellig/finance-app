import { Hono } from "hono";
import db from "@/services/db";
import { getAuth } from "@hono/clerk-auth";

import { users } from "@/models/users.model";

import { createUserDto } from "@/dtos/users.dto";

import { validateBody } from "@/utils/validator";
import authService from "@/services/auth";
import { eq } from "drizzle-orm";

const usersRouter = new Hono().basePath("/users");

usersRouter.post("/register", validateBody(createUserDto), async (c) => {
  const auth = getAuth(c);
  if (auth?.isAuthenticated)
    return c.json(
      {
        success: false,
        message: "Already logged in",
      },
      409,
    );

  const { name, email, password } = c.req.valid("json");

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser)
    return c.json({ success: false, message: "Username taken" }, 409);

  const passwordHash = await Bun.password.hash(password);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .$returningId();

  const authRes = await authService.users
    .createUser({
      externalId: user.id,
      emailAddress: [email],
      username: email.split("@")[0],
      passwordDigest: passwordHash,
      passwordHasher: "argon2id",
    })
    .catch((e) => {
      console.error(e);
      return;
    });

  if (!authRes) {
    await db.delete(users).where(eq(users.id, user.id));
    return c.json({ success: false, message: "Error creating user" }, 500);
  }

  await db
    .update(users)
    .set({
      externalId: authRes.id,
    })
    .where(eq(users.id, user.id));

  return c.json({ success: true, data: { ...user, authRes } }, 201);
});

export default usersRouter;
