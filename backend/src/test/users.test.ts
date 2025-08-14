import { describe, it, expect } from "bun:test";
import { createTestUser } from "./setup";
import app from "./app";

describe("Users API", () => {
  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const newUser = createTestUser();

      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("externalId", newUser.externalId);
      expect(data).not.toHaveProperty("password"); // Password should not be returned
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteUser = {
        email: "test@example.com",
        // Missing externalId, firstName, lastName, password
      };

      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(incompleteUser),
      });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Missing required fields");
    });

    it("should return 409 for duplicate email", async () => {
      const duplicateUser = {
        externalId: "clerk_user_2",
        email: "duplicate@example.com", // Triggers duplicate response
        firstName: "User",
        lastName: "Two",
        password: "password456",
      };

      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(duplicateUser),
      });
      
      expect(res.status).toBe(409);
      const data = await res.json();
      expect(data).toHaveProperty("error", "User already exists");
    });

    it("should handle special characters in names", async () => {
      const specialCharUser = {
        externalId: "special_char_user",
        email: "special@example.com",
        firstName: "José María",
        lastName: "O'Connor-Smith",
        password: "password123",
      };

      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(specialCharUser),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("firstName", "José María");
      expect(data).toHaveProperty("lastName", "O'Connor-Smith");
    });

    it("should handle Unicode characters", async () => {
      const unicodeUser = {
        externalId: "unicode_user",
        email: "unicode@example.com",
        firstName: "测试",
        lastName: "用户",
        password: "password123",
      };

      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unicodeUser),
      });
      
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data).toHaveProperty("firstName", "测试");
      expect(data).toHaveProperty("lastName", "用户");
    });

    it("should handle malformed JSON", async () => {
      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "invalid json",
      });
      
      expect(res.status).toBe(400);
    });

    it("should handle empty JSON object", async () => {
      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty("error", "Missing required fields");
    });
  });
});