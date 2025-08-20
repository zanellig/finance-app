import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import db from "@/services/db";

import { accounts } from "@/models/accounts.model";
import { entities } from "@/models/entities.model";
import { eq, and, ne } from "drizzle-orm";

import {
  createAccountDto,
  createAccountResponseDto,
  getAccountsDto,
  getAccountDto,
  updateAccountDto,
} from "@/dtos/accounts.dto";

import { createRouter } from "@/utils/create-app";
import { authMiddleware } from "@/middleware/auth";

const accountsRouter = createRouter().basePath("/accounts");

accountsRouter.use("*", authMiddleware);

// Route definitions
const getAccountsRoute = createRoute({
  method: "get",
  path: "/",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getAccountsDto,
        },
      },
      description: "Successfully retrieved accounts",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Internal server error" }),
          }),
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["Accounts"],
});

const getAccountByIdRoute = createRoute({
  method: "get",
  path: "/{id}",
  security: [{ Bearer: [] }],
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getAccountDto,
        },
      },
      description: "Successfully retrieved account",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Account ID required" }),
          }),
        },
      },
      description: "Bad request - Account ID required",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Account not found" }),
          }),
        },
      },
      description: "Account not found",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Internal server error" }),
          }),
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["Accounts"],
});

const createAccountRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createAccountDto,
        },
      },
    },
  },
  security: [{ Bearer: [] }],
  responses: {
    201: {
      content: {
        "application/json": {
          schema: createAccountResponseDto,
        },
      },
      description: "Account successfully created",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            error: z
              .string()
              .openapi({ example: "Entity not found or unauthorized" }),
          }),
        },
      },
      description: "Entity not found or unauthorized",
    },
    409: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Account already exists" }),
            data: z
              .object({
                id: z.uuid(),
              })
              .optional(),
          }),
        },
      },
      description: "Account already exists",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Internal server error" }),
          }),
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["Accounts"],
});

const updateAccountRoute = createRoute({
  method: "put",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateAccountDto,
        },
      },
    },
  },
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
          }),
        },
      },
      description: "Account successfully updated",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Account ID required" }),
          }),
        },
      },
      description: "Bad request - Account ID required",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({
            error: z
              .string()
              .openapi({ example: "Account not found or access denied" }),
          }),
        },
      },
      description: "Access denied",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Internal server error" }),
          }),
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["Accounts"],
});

const deleteAccountRoute = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string().uuid(),
    }),
  },
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({ example: true }),
          }),
        },
      },
      description: "Account successfully deleted",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Account ID required" }),
          }),
        },
      },
      description: "Bad request - Account ID required",
    },
    403: {
      content: {
        "application/json": {
          schema: z.object({
            error: z
              .string()
              .openapi({ example: "Account not found or access denied" }),
          }),
        },
      },
      description: "Access denied",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Internal server error" }),
          }),
        },
      },
      description: "Internal server error",
    },
  },
  tags: ["Accounts"],
});

accountsRouter.openapi(getAccountsRoute, async (c) => {
  const user = c.get("user");

  try {
    // Get all accounts for entities owned by the user
    const accountsRes = await db
      .select()
      .from(accounts)
      .innerJoin(entities, eq(accounts.entityId, entities.id))
      .where(
        and(
          eq(entities.userId, user.id),
          ne(accounts.status, "deleted"),
          ne(entities.status, "deleted")
        )
      );

    const accountsDto = getAccountsDto.safeParse(
      accountsRes.map((result) => result.accounts)
    );
    if (!accountsDto.success) {
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(accountsDto.data, 200);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

accountsRouter.openapi(getAccountByIdRoute, async (c) => {
  const user = c.get("user");
  const { id: accountId } = c.req.valid("param");

  try {
    // Get account that belongs to an entity owned by the user
    const [accountRes] = await db
      .select()
      .from(accounts)
      .innerJoin(entities, eq(accounts.entityId, entities.id))
      .where(
        and(
          eq(accounts.id, accountId),
          eq(entities.userId, user.id),
          ne(accounts.status, "deleted"),
          ne(entities.status, "deleted")
        )
      );

    c.var.logger.debug(accountRes, "Account response");

    if (!accountRes) {
      return c.json({ error: "Account not found" }, 404);
    }

    const accountDto = getAccountDto.safeParse(accountRes.accounts);

    c.var.logger.debug(accountDto, "Account DTO parse result");

    if (!accountDto.success) {
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(accountDto.data, 200);
  } catch (e) {
    c.var.logger.error(e, "Error fetching account");
    return c.json({ error: "Internal server error" }, 500);
  }
});

accountsRouter.openapi(createAccountRoute, async (c) => {
  const user = c.get("user");
  const accountData = c.req.valid("json");

  try {
    // Verify the entity belongs to the user
    const [entity] = await db
      .select({ id: entities.id })
      .from(entities)
      .where(
        and(eq(entities.id, accountData.entityId), eq(entities.userId, user.id))
      );

    if (!entity) {
      return c.json({ error: "Entity not found" }, 404);
    }

    // Check if account with same name and type already exists for this entity
    const [existingAccount] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .where(
        and(
          eq(accounts.name, accountData.name),
          eq(accounts.type, accountData.type),
          eq(accounts.entityId, accountData.entityId)
        )
      );

    if (existingAccount) {
      return c.json(
        { error: "Account already exists", data: existingAccount },
        409
      );
    }

    const [res] = await db.insert(accounts).values(accountData).$returningId();

    const responseDto = createAccountResponseDto.safeParse(res);
    if (!responseDto.success) {
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(responseDto.data, 201);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

accountsRouter.openapi(updateAccountRoute, async (c) => {
  const user = c.get("user");
  const { id: accountId } = c.req.valid("param");
  const updateData = c.req.valid("json");

  try {
    // Verify account belongs to user through entity
    const [accountCheck] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .innerJoin(entities, eq(accounts.entityId, entities.id))
      .where(and(eq(accounts.id, accountId), eq(entities.userId, user.id)));

    if (!accountCheck) {
      return c.json({ error: "Account not found or access denied" }, 403);
    }

    await db.update(accounts).set(updateData).where(eq(accounts.id, accountId));

    return c.json({ success: true }, 200);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

accountsRouter.openapi(deleteAccountRoute, async (c) => {
  const user = c.get("user");
  const { id: accountId } = c.req.valid("param");

  try {
    // Verify account belongs to user through entity
    const [accountCheck] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .innerJoin(entities, eq(accounts.entityId, entities.id))
      .where(and(eq(accounts.id, accountId), eq(entities.userId, user.id)));

    if (!accountCheck) {
      return c.json({ error: "Account not found or access denied" }, 403);
    }

    await db
      .update(accounts)
      .set({
        status: "deleted",
        deletedAt: new Date(),
      })
      .where(eq(accounts.id, accountId));

    return c.json({ success: true }, 200);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default accountsRouter;
