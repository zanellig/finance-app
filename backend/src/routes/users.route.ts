import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import db from "@/services/db";

import { users } from "@/models/users.model";

import {
  createUserDto,
  createUserResponseDto,
  loginUserDto,
  loginResponseDto,
} from "@/dtos/users.dto";

import authService from "@/services/auth";
import { eq } from "drizzle-orm";
import { createRouter } from "@/utils/create-app";

const usersRouter = createRouter();

// Route definitions
const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createUserDto,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z
              .string()
              .openapi({ example: "User created successfully" }),
            user: createUserResponseDto,
            token: z
              .string()
              .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
          }),
        },
      },
      description: "User successfully registered",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z
              .string()
              .openapi({ example: "Email already registered" }),
          }),
        },
      },
      description: "Email already exists",
    },
  },
  tags: ["Users"],
});

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: loginUserDto,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
            message: z.string().openapi({ example: "Login successful" }),
            user: loginResponseDto,
            token: z
              .string()
              .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
          }),
        },
      },
      description: "User successfully authenticated",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: false }),
            message: z.string().openapi({ example: "Invalid credentials" }),
          }),
        },
      },
      description: "Invalid credentials",
    },
  },
  tags: ["Users"],
});

usersRouter.openapi(registerRoute, async (c) => {
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

  const userData = createUserResponseDto.parse({
    id: user.id,
    name,
    email,
  });

  return c.json(
    {
      success: true,
      message: "User created successfully",
      user: userData,
      token,
    },
    201
  );
});

usersRouter.openapi(loginRoute, async (c) => {
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

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return c.json(
    {
      success: true,
      message: "Login successful",
      user: userData,
      token,
    },
    200
  );
});

export default usersRouter;
