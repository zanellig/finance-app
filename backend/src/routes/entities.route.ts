import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import db from "@/services/db";

import { entities } from "@/models/entities.model";
import { eq, and, ne } from "drizzle-orm";

import {
  createEntityDto,
  createEntityResponseDto,
  getEntitiesDto,
  getEntityDto,
} from "@/dtos/entities.dto";

import { createRouter } from "@/utils/create-app";
import { authMiddleware } from "@/middleware/auth";

const entitiesRouter = createRouter().basePath("/entities");

entitiesRouter.use("*", authMiddleware);

// Route definitions
const getEntitiesRoute = createRoute({
  method: "get",
  path: "/",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: getEntitiesDto,
        },
      },
      description: "Successfully retrieved entities",
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
  tags: ["Entities"],
});

const getEntityByIdRoute = createRoute({
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
          schema: getEntityDto,
        },
      },
      description: "Successfully retrieved entity",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Entity ID required" }),
          }),
        },
      },
      description: "Bad request - Entity ID required",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string().openapi({ example: "Entity not found" }),
          }),
        },
      },
      description: "Entity not found",
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
  tags: ["Entities"],
});

const createEntityRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: createEntityDto,
        },
      },
    },
  },
  security: [{ Bearer: [] }],
  responses: {
    201: {
      content: {
        "application/json": {
          schema: createEntityResponseDto,
        },
      },
      description: "Entity successfully created",
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
  tags: ["Entities"],
});

entitiesRouter.openapi(getEntitiesRoute, async (c) => {
  const user = c.get("user");

  try {
    const entitiesRes = await db
      .select()
      .from(entities)
      .where(and(eq(entities.userId, user.id), ne(entities.status, "deleted")));

    const entitiesDto = getEntitiesDto.safeParse(entitiesRes);
    if (!entitiesDto.success) {
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(entitiesDto.data, 200);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

entitiesRouter.openapi(getEntityByIdRoute, async (c) => {
  const user = c.get("user");
  const { id: entityId } = c.req.valid("param");

  try {
    const [entityRes] = await db
      .select()
      .from(entities)
      .where(
        and(
          eq(entities.id, entityId),
          eq(entities.userId, user.id),
          ne(entities.status, "deleted")
        )
      );

    if (!entityRes) {
      return c.json({ error: "Entity not found" }, 404);
    }

    const entityDto = getEntityDto.safeParse(entityRes);
    if (!entityDto.success) {
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(entityDto.data, 200);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

entitiesRouter.openapi(createEntityRoute, async (c) => {
  const user = c.get("user");
  const { name, type } = c.req.valid("json");

  try {
    const [entityRes] = await db
      .insert(entities)
      .values({
        name,
        type,
        userId: user.id,
      })
      .$returningId();

    const entityDto = createEntityResponseDto.safeParse(entityRes);
    if (!entityDto.success) {
      return c.json({ error: "Internal server error" }, 500);
    }
    return c.json(entityDto.data, 201);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default entitiesRouter;
