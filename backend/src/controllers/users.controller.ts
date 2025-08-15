import { Hono } from "hono";
import db from "@/services/db";

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
  const { name, email, password } = c.req.valid("json");

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser)
    return c.json({ success: false, message: "Email already registered" }, 409);

  const passwordHash = await Bun.password.hash(password, "argon2id");

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .$returningId();

  const token = authService.generateToken({
    userId: user.id,
    email,
  });

  const userData = createUserResponseDto.safeParse({
    id: user.id,
    name,
    email,
  });

  return c.json({
    success: true,
    message: "User created successfully",
    user: userData.data,
    token,
  }, 201);
});

usersRouter.post("/login", validateBody(loginUserDto), async (c) => {
  const { email, password } = c.req.valid("json");

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  const passwordValid = await Bun.password.verify(password, user.passwordHash);
  if (!passwordValid) {
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  const token = authService.generateToken({
    userId: user.id,
    email: user.email,
  });

  const userData = loginResponseDto.safeParse(user);

  return c.json(
    {
      success: true,
      message: "Login successful",
      user: userData.data,
      token,
    },
    200
  );
});

export default usersRouter;
