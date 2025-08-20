import { describe, it, expect } from "bun:test";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "@hono/zod-openapi";
import { json, mysqlTable, varchar } from "drizzle-orm/mysql-core";

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    zodInstance: z,
  });

const TestSchema = mysqlTable("test", {
  id: varchar({ length: 36 }).notNull(),
  json: json().notNull(),
});
const TestInsertSchema = createInsertSchema(TestSchema);
const TestSelectSchema = createSelectSchema(TestSchema);
const TestUpdateSchema = createUpdateSchema(TestSchema);

describe("createInsertSchema usage of the zod instance", () => {
  it("should have openapi method on TestInsertSchema", () => {
    expect(TestInsertSchema.openapi).toBeDefined();
    expect(typeof TestInsertSchema.openapi).toBe("function");
    expect(TestInsertSchema.openapi).toBeInstanceOf(Function);
  });
});

describe("createSelectSchema usage of the zod instance", () => {
  it("should have openapi method on TestSelectSchema", () => {
    expect(TestSelectSchema.openapi).toBeDefined();
    expect(typeof TestSelectSchema.openapi).toBe("function");
    expect(TestSelectSchema.openapi).toBeInstanceOf(Function);
    expect(TestSelectSchema.shape).toHaveProperty("id");
  });
});

describe("createUpdateSchema usage of the zod instance", () => {
  it("should have openapi method on TestUpdateSchema", () => {
    expect(TestUpdateSchema.openapi).toBeDefined();
    expect(typeof TestUpdateSchema.openapi).toBe("function");
    expect(TestUpdateSchema.openapi).toBeInstanceOf(Function);
    expect(TestUpdateSchema.shape).toHaveProperty("id");
  });
});

describe("schemas must be generated correctly", () => {
  it("should generate TestInsertSchema with correct properties", () => {
    expect(TestInsertSchema.shape).toHaveProperty("id");
    expect(TestInsertSchema.shape).toHaveProperty("json");
    expect(TestInsertSchema.shape.id).toBeInstanceOf(z.ZodString);
    expect(TestInsertSchema.shape.json).toBeInstanceOf(z.ZodType);
  });

  it("should generate TestSelectSchema with correct properties", () => {
    expect(TestSelectSchema.shape).toHaveProperty("id");
    expect(TestSelectSchema.shape).toHaveProperty("json");
    expect(TestSelectSchema.shape.id).toBeInstanceOf(z.ZodString);
    expect(TestSelectSchema.shape.json).toBeInstanceOf(z.ZodType);
  });

  it("should generate TestUpdateSchema with correct properties", () => {
    expect(TestUpdateSchema.shape).toHaveProperty("json");
    expect(TestUpdateSchema.shape.json).toBeInstanceOf(z.ZodType);
  });
});
