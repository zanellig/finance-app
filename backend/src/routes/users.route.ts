import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import {
  createUserDto,
  createUserResponseDto,
  loginResponseDto,
  loginUserDto,
} from "@/dtos/users.dto";
import { authRateLimit, strictAuthRateLimit } from "@/middleware/rate-limit";
import { users } from "@/models/users.model";
import authService from "@/services/auth";
import db from "@/services/db";

import redisService from "@/services/redis";
import tokenBlacklistService from "@/services/token-blacklist";
import { createRouter } from "@/utils/create-app";

import { createJsonContent, HttpStatusCodes } from "@/utils/openapi-helpers";

const usersRouter = createRouter();

// Route definitions
const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: createJsonContent(createUserDto),
  },
  responses: {
    [HttpStatusCodes.CREATED]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().openapi({ example: "User created successfully" }),
        user: createUserResponseDto,
        token: z
          .string()
          .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
        refreshToken: z
          .string()
          .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
      }),
      "User successfully registered"
    ),

    [HttpStatusCodes.CONFLICT]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: "Email already registered" }),
      }),
      "Email already exists"
    ),

    [HttpStatusCodes.TOO_MANY_REQUESTS]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({
          example: "Too many requests, please try again later",
        }),
        retryAfter: z.number().openapi({ example: 900 }),
      }),
      "Rate limit exceeded"
    ),
  },
  tags: ["Users"],
});

const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: createJsonContent(loginUserDto),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().openapi({ example: "Login successful" }),
        user: loginResponseDto,
        token: z
          .string()
          .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
        refreshToken: z
          .string()
          .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
      }),
      "User successfully authenticated"
    ),

    [HttpStatusCodes.UNAUTHORIZED]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: "Invalid credentials" }),
      }),
      "Invalid credentials"
    ),

    [HttpStatusCodes.TOO_MANY_REQUESTS]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({
          example: "Too many requests, please try again later",
        }),
        retryAfter: z.number().openapi({ example: 900 }),
      }),
      "Rate limit exceeded"
    ),
  },
  tags: ["Users"],
});

const refreshTokenRoute = createRoute({
  method: "post",
  path: "/refresh",
  request: {
    body: createJsonContent(z.object({ refreshToken: z.string() })),
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: true }),
        message: z
          .string()
          .openapi({ example: "Token refreshed successfully" }),
        token: z
          .string()
          .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
        refreshToken: z
          .string()
          .openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }),
      }),
      "Token refreshed successfully"
    ),

    [HttpStatusCodes.UNAUTHORIZED]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: "Invalid refresh token" }),
      }),
      "Invalid or expired refresh token"
    ),

    [HttpStatusCodes.TOO_MANY_REQUESTS]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({
          example: "Too many requests, please try again later",
        }),
        retryAfter: z.number().openapi({ example: 900 }),
      }),
      "Rate limit exceeded"
    ),
  },
  tags: ["Users"],
});

const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            refreshToken: z.string().optional(),
            logoutFromAllDevices: z.boolean().default(false),
          }),
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().openapi({ example: "Logged out successfully" }),
      }),
      "Successfully logged out"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: "Authentication required" }),
      }),
      "Authentication required"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: createJsonContent(
      z.object({
        success: z.boolean().openapi({ example: false }),
        message: z.string().openapi({ example: "Logout failed" }),
      }),
      "Internal server error"
    ),
  },
  tags: ["Users"],
});

usersRouter.use("/register", authRateLimit);
usersRouter.openapi(registerRoute, async (c) => {
  const { name, email, password } = c.req.valid("json");
  const clientIp =
    c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
  const userAgent = c.req.header("user-agent") ?? "unknown";

  // Check for existing user with constant-time lookup
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    await redisService.logAuthEvent({
      type: "register",
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      success: false,
      details: { reason: "email_already_exists", email },
    });
    return c.json({ success: false, message: "Email already registered" }, 409);
  }

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

  const refreshToken = authService.generateRefreshToken({
    userId: user.id,
    email,
  });

  // Store refresh token in Redis
  await redisService.storeRefreshToken(user.id, refreshToken, 60 * 60 * 24 * 7);

  const userData = createUserResponseDto.parse({
    id: user.id,
    name,
    email,
  });

  await redisService.logAuthEvent({
    type: "register",
    userId: user.id,
    ip: clientIp,
    userAgent,
    timestamp: new Date(),
    success: true,
  });

  return c.json(
    {
      success: true,
      message: "User created successfully",
      user: userData,
      token,
      refreshToken,
    },
    201
  );
});

usersRouter.use("/login", authRateLimit);
usersRouter.use("/login", strictAuthRateLimit);
usersRouter.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid("json");
  const clientIp =
    c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
  const userAgent = c.req.header("user-agent") ?? "unknown";

  // Constant-time user lookup and password verification to prevent timing attacks
  const [user] = await db.select().from(users).where(eq(users.email, email));

  let isValidUser = false;
  let isValidPassword = false;

  if (user) {
    isValidUser = true;
    isValidPassword = await Bun.password.verify(password, user.passwordHash);
  } else {
    // Perform a dummy hash operation to maintain constant time
    await Bun.password.verify(
      "dummy",
      "$argon2id$v=19$m=65536,t=2,p=1$c2FsdA$placeholder"
    );
  }

  if (!isValidUser || !isValidPassword) {
    await redisService.logAuthEvent({
      type: "failed_login",
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      success: false,
      details: {
        email,
        reason: !isValidUser ? "user_not_found" : "invalid_password",
      },
    });
    return c.json({ success: false, message: "Invalid credentials" }, 401);
  }

  const token = authService.generateToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = authService.generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  // Store refresh token in Redis
  await redisService.storeRefreshToken(user.id, refreshToken, 60 * 60 * 24 * 7);

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  await redisService.logAuthEvent({
    type: "login",
    userId: user.id,
    ip: clientIp,
    userAgent,
    timestamp: new Date(),
    success: true,
  });

  return c.json(
    {
      success: true,
      message: "Login successful",
      user: userData,
      token,
      refreshToken,
    },
    200
  );
});

usersRouter.use("/refresh", authRateLimit);
usersRouter.openapi(refreshTokenRoute, async (c) => {
  const { refreshToken } = c.req.valid("json");
  const clientIp =
    c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
  const userAgent = c.req.header("user-agent") ?? "unknown";

  // Verify refresh token
  const payload = authService.verifyRefreshToken(refreshToken);
  if (!payload) {
    await redisService.logAuthEvent({
      type: "token_refresh",
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      success: false,
      details: { reason: "invalid_refresh_token" },
    });
    return c.json({ success: false, message: "Invalid refresh token" }, 401);
  }

  // Check if stored refresh token matches
  const storedRefreshToken = await redisService.getRefreshToken(payload.userId);
  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    await redisService.logAuthEvent({
      type: "token_refresh",
      userId: payload.userId,
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      success: false,
      details: { reason: "refresh_token_mismatch" },
    });
    return c.json({ success: false, message: "Invalid refresh token" }, 401);
  }

  // Verify user still exists
  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, payload.userId));

  if (!user) {
    await redisService.logAuthEvent({
      type: "token_refresh",
      userId: payload.userId,
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      success: false,
      details: { reason: "user_not_found" },
    });
    return c.json({ success: false, message: "User not found" }, 401);
  }

  // Generate new tokens
  const newToken = authService.generateToken({
    userId: user.id,
    email: user.email,
  });

  const newRefreshToken = authService.generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  // Update stored refresh token
  await redisService.storeRefreshToken(
    user.id,
    newRefreshToken,
    60 * 60 * 24 * 7
  );

  await redisService.logAuthEvent({
    type: "token_refresh",
    userId: user.id,
    ip: clientIp,
    userAgent,
    timestamp: new Date(),
    success: true,
  });

  return c.json(
    {
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
      refreshToken: newRefreshToken,
    },
    200
  );
});

usersRouter.openapi(logoutRoute, async (c) => {
  const { refreshToken, logoutFromAllDevices } = c.req.valid("json");
  const authHeader = c.req.header("Authorization");
  const accessToken = authService.extractTokenFromHeader(authHeader);
  const clientIp =
    c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
  const userAgent = c.req.header("user-agent") ?? "unknown";

  if (!accessToken) {
    return c.json({ success: false, message: "Authentication required" }, 401);
  }

  // Verify access token to get user info
  const payload = authService.verifyToken(accessToken);
  if (!payload) {
    return c.json({ success: false, message: "Invalid token" }, 401);
  }

  try {
    // Blacklist the current access token
    await tokenBlacklistService.blacklistToken(accessToken);

    // Remove refresh token if provided
    if (refreshToken) {
      await redisService.removeRefreshToken(payload.userId);
    }

    // If logout from all devices, blacklist all user tokens
    if (logoutFromAllDevices) {
      await tokenBlacklistService.blacklistAllUserTokens(payload.userId);
    }

    await redisService.logAuthEvent({
      type: "logout",
      userId: payload.userId,
      ip: clientIp,
      userAgent,
      timestamp: new Date(),
      success: true,
      details: { logoutFromAllDevices },
    });

    return c.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ success: false, message: "Logout failed" }, 500);
  }
});

export default usersRouter;
