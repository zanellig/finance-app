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
      
      // Check response structure matches current API
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("message", "User created successfully");
      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("token");
      expect(data).toHaveProperty("refreshToken");
      
      // Check user data structure
      expect(data.user).toHaveProperty("id");
      expect(data.user).toHaveProperty("name", newUser.name);
      expect(data.user).toHaveProperty("email", newUser.email);
      expect(data.user).not.toHaveProperty("password"); // Password should not be returned
      expect(data.user).not.toHaveProperty("passwordHash"); // Password hash should not be returned
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteUser = {
        email: "incomplete@example.com",
        // Missing name and password
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
      expect(data).toHaveProperty("success", false);
    });

    it("should return 409 for duplicate email", async () => {
      const user1 = {
        name: "First User",
        email: "duplicate@example.com",
        password: "TestPass123!",
      };

      const user2 = {
        name: "Second User", 
        email: "duplicate@example.com", // Same email
        password: "TestPass456!",
      };

      // Register first user
      const res1 = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user1),
      });
      
      expect(res1.status).toBe(201);

      // Try to register second user with same email
      const res2 = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user2),
      });
      
      expect(res2.status).toBe(409);
      const data = await res2.json();
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("message", "Email already registered");
    });

    it("should handle special characters in names", async () => {
      const specialCharUser = {
        name: "José María O'Connor-Smith",
        email: "special@example.com",
        password: "TestPass123!",
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
      expect(data.user).toHaveProperty("name", "José María O'Connor-Smith");
    });

    it("should handle Unicode characters", async () => {
      const unicodeUser = {
        name: "测试用户",
        email: "unicode@example.com",
        password: "TestPass123!",
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
      expect(data.user).toHaveProperty("name", "测试用户");
    });

    it("should validate password requirements", async () => {
      const weakPasswordUser = {
        name: "Test User",
        email: "weakpass@example.com",
        password: "weak", // Doesn't meet requirements
      };

      const res = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weakPasswordUser),
      });
      
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty("success", false);
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
    });
  });

  describe("POST /api/users/login", () => {
    it("should login with valid credentials", async () => {
      // First register a user
      const user = {
        name: "Login Test User",
        email: "login@example.com",
        password: "TestPass123!",
      };

      const registerRes = await app.request("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      
      expect(registerRes.status).toBe(201);

      // Then try to login
      const loginRes = await app.request("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });
      
      expect(loginRes.status).toBe(200);
      const data = await loginRes.json();
      
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("message", "Login successful");
      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("token");
      expect(data).toHaveProperty("refreshToken");
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await app.request("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "nonexistent@example.com",
          password: "WrongPass123!",
        }),
      });
      
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("message", "Invalid credentials");
    });
  });
});