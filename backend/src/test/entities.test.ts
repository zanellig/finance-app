import { describe, it, expect } from "bun:test";
import { createAuthHeaders, noAuthHeaders, createTestEntity } from "./setup";
import app from "./app";

describe("Entities API", () => {
  describe("GET /api/entities", () => {
    it("should return entities for authenticated user", async () => {
      const res = await app.request("/api/entities", {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("name", "Test Entity");
      expect(data[0]).toHaveProperty("type", "individual");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await app.request("/api/entities", {
        headers: noAuthHeaders(),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await app.request("/api/entities", {
        headers: createAuthHeaders("non_existent_user"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "User not found");
    });
  });

  describe("GET /api/entities/:id", () => {
    it("should return specific entity for authenticated user", async () => {
      const res = await app.request("/api/entities/test-entity-id", {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("id", "test-entity-id");
      expect(data).toHaveProperty("name", "Test Entity");
      expect(data).toHaveProperty("type", "individual");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await app.request("/api/entities/test-entity-id", {
        headers: noAuthHeaders(),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent entity", async () => {
      const res = await app.request("/api/entities/non-existent-id", {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Entity not found");
    });
  });

  describe("POST /api/entities", () => {
    it("should create new entity for authenticated user", async () => {
      const newEntity = createTestEntity();
      newEntity.name = "New Test Entity";

      const res = await app.request("/api/entities", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntity),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("id");
      expect(typeof data.id).toBe("string");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const newEntity = createTestEntity();
      
      const res = await app.request("/api/entities", {
        method: "POST",
        headers: {
          ...noAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntity),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 400 for missing name", async () => {
      const invalidEntity = {};
      
      const res = await app.request("/api/entities", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidEntity),
      });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Name is required");
    });

    it("should return 409 for duplicate entity name", async () => {
      const duplicateEntity = { name: "Test Entity" }; // Same as existing entity
      
      const res = await app.request("/api/entities", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicateEntity),
      });
      
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Entity already exists");
    });
  });

  describe("PUT /api/entities/:id", () => {
    it("should update entity for authenticated user", async () => {
      const updateData = {
        name: "Updated Entity Name",
        type: "company",
        status: "active",
      };

      const res = await app.request("/api/entities/test-entity-id", {
        method: "PUT",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("success", true);
    });

    it("should return 401 for unauthenticated requests", async () => {
      const updateData = { name: "Updated Name" };
      
      const res = await app.request("/api/entities/test-entity-id", {
        method: "PUT",
        headers: {
          ...noAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent entity", async () => {
      const updateData = { name: "Updated Name" };
      
      const res = await app.request("/api/entities/non-existent-id", {
        method: "PUT",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Entity not found");
    });
  });

  describe("DELETE /api/entities/:id", () => {
    it("should delete entity for authenticated user", async () => {
      const res = await app.request("/api/entities/test-entity-id", {
        method: "DELETE",
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("success", true);
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await app.request("/api/entities/test-entity-id", {
        method: "DELETE",
        headers: noAuthHeaders(),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent entity", async () => {
      const res = await app.request("/api/entities/non-existent-id", {
        method: "DELETE",
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Entity not found");
    });
  });

  describe("Edge Cases and Security", () => {
    it("should handle SQL injection attempts", async () => {
      const maliciousId = "'; DROP TABLE entities; --";
      
      const res = await app.request(`/api/entities/${encodeURIComponent(maliciousId)}`, {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Entity not found");
    });

    it("should handle Unicode characters in entity name", async () => {
      const unicodeEntity = { name: "測試實體 🚀 Entity ñáéíóú" };
      
      const res = await app.request("/api/entities", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unicodeEntity),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("id");
    });

    it("should handle malformed JSON", async () => {
      const res = await app.request("/api/entities", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: "invalid json",
      });
      
      expect(res.status).toBe(400);
    });
  });
});