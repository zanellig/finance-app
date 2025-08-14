import { describe, it, expect } from "bun:test";
import { createAuthHeaders, noAuthHeaders, createTestAccount } from "./setup";
import app from "./app";

describe("Accounts API", () => {
  describe("GET /api/accounts", () => {
    it("should return accounts for authenticated user", async () => {
      const res = await app.request("/api/accounts", {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(1);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("name", "Test Account");
      expect(data[0]).toHaveProperty("type", "savings");
      expect(data[0]).toHaveProperty("balance", "1000.00");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await app.request("/api/accounts", {
        headers: noAuthHeaders(),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await app.request("/api/accounts", {
        headers: createAuthHeaders("non_existent_user"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "User not found");
    });
  });

  describe("GET /api/accounts/:id", () => {
    it("should return specific account for authenticated user", async () => {
      const res = await app.request("/api/accounts/test-account-id", {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("id", "test-account-id");
      expect(data).toHaveProperty("name", "Test Account");
      expect(data).toHaveProperty("entityId", "test-entity-id");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await app.request("/api/accounts/test-account-id", {
        headers: noAuthHeaders(),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent account", async () => {
      const res = await app.request("/api/accounts/non-existent-id", {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Account not found");
    });
  });

  describe("POST /api/accounts", () => {
    it("should create new account for authenticated user", async () => {
      const newAccount = createTestAccount();
      newAccount.name = "New Checking Account";
      newAccount.type = "checking";

      const res = await app.request("/api/accounts", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("id");
      expect(typeof data.id).toBe("string");
    });

    it("should return 401 for unauthenticated requests", async () => {
      const newAccount = createTestAccount();
      
      const res = await app.request("/api/accounts", {
        method: "POST",
        headers: {
          ...noAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAccount),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 400 for missing required fields", async () => {
      const invalidAccount = {
        name: "Invalid Account",
        // Missing entityId
      };
      
      const res = await app.request("/api/accounts", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidAccount),
      });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Missing required fields");
    });

    it("should return 409 for duplicate account name", async () => {
      const duplicateAccount = { 
        name: "Test Account", // Same as existing account
        entityId: "test-entity-id",
        type: "checking"
      };
      
      const res = await app.request("/api/accounts", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicateAccount),
      });
      
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Account already exists");
    });
  });

  describe("PUT /api/accounts/:id", () => {
    it("should update account for authenticated user", async () => {
      const updateData = {
        name: "Updated Account Name",
        type: "checking",
        balance: "2000.00",
      };

      const res = await app.request("/api/accounts/test-account-id", {
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
      
      const res = await app.request("/api/accounts/test-account-id", {
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

    it("should return 404 for non-existent account", async () => {
      const updateData = { name: "Updated Name" };
      
      const res = await app.request("/api/accounts/non-existent-id", {
        method: "PUT",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Account not found");
    });
  });

  describe("DELETE /api/accounts/:id", () => {
    it("should delete account for authenticated user", async () => {
      const res = await app.request("/api/accounts/test-account-id", {
        method: "DELETE",
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("success", true);
    });

    it("should return 401 for unauthenticated requests", async () => {
      const res = await app.request("/api/accounts/test-account-id", {
        method: "DELETE",
        headers: noAuthHeaders(),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Unauthorized");
    });

    it("should return 404 for non-existent account", async () => {
      const res = await app.request("/api/accounts/non-existent-id", {
        method: "DELETE",
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Account not found");
    });
  });

  describe("Edge Cases and Security", () => {
    it("should handle SQL injection attempts", async () => {
      const maliciousId = "'; DROP TABLE accounts; --";
      
      const res = await app.request(`/api/accounts/${encodeURIComponent(maliciousId)}`, {
        headers: createAuthHeaders("test_clerk_user_123"),
      });
      
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Account not found");
    });

    it("should handle Unicode characters in account name", async () => {
      const unicodeAccount = { 
        name: "账户测试 💰 Account ñáéíóú",
        entityId: "test-entity-id",
        type: "savings",
        balance: "1000.00"
      };
      
      const res = await app.request("/api/accounts", {
        method: "POST",
        headers: {
          ...createAuthHeaders("test_clerk_user_123"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unicodeAccount),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("id");
    });

    it("should handle malformed JSON", async () => {
      const res = await app.request("/api/accounts", {
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