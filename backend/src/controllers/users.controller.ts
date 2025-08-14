import { Hono } from "hono";
import db from "@/services/db";
import { getAuth } from "@hono/clerk-auth";

import { users } from "@/models/users.model";

import {
  createUserDto,
  createUserResponseDto,
  loginUserDto,
  loginResponseDto,
} from "@/dtos/users.dto";

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
      409
    );

  const { name, email, password } = c.req.valid("json");

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser)
    return c.json({ success: false, message: "Username taken" }, 409);

  const passwordHash = await Bun.password.hash(password, "argon2id");

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
      return null;
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

  const { id, username } = authRes;

  const userData = createUserResponseDto.safeParse({
    ...user,
    externalId: id,
    username,
  });

  return c.json(userData, 201);
});

usersRouter.post("/login", validateBody(loginUserDto), async (c) => {
  const auth = getAuth(c);
  if (auth?.isAuthenticated)
    return c.json(
      {
        success: false,
        message: "Already logged in",
      },
      409
    );

  const { email, password } = c.req.valid("json");

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  const passwordValid = await Bun.password.verify(password, user.passwordHash);
  if (!passwordValid) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  try {
    const signInToken = await authService.signInTokens.createSignInToken({
      userId: user.externalId!,
      expiresInSeconds: 3600,
    });

    const userData = loginResponseDto.safeParse(user);

    return c.json(
      {
        success: true,
        message: "Login successful",
        user: userData.data,
        token: signInToken.token,
      },
      200
    );
  } catch (error) {
    console.error("Error creating sign-in token:", error);
    return c.json({ success: false, message: "Login failed" }, 500);
  }
});

export default usersRouter;
