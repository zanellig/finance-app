import { Hono } from "hono";

const app = new Hono().basePath("/api");

// Users endpoints (no auth required for registration)
app.post("/users/register", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.email || !body.externalId) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    if (body.email === "duplicate@example.com") {
      return c.json({ error: "User already exists" }, 409);
    }
    
    return c.json({ 
      id: "test-user-id",
      externalId: body.externalId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email
    }, 201);
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }
});

// Mock middleware to handle authentication for all other endpoints
app.use("*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  // Check specific scenarios
  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  if (authHeader.includes("non_existent_user")) {
    return c.json({ error: "User not found" }, 404);
  }
  
  await next();
});

// Entities endpoints
app.get("/entities", (c) => {
  return c.json([{
    id: "test-entity-id",
    name: "Test Entity",
    type: "individual",
    status: "active"
  }]);
});

app.get("/entities/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id" || id.includes("DROP") || id.includes(";")) {
    return c.json({ error: "Entity not found" }, 404);
  }
  return c.json({
    id,
    name: "Test Entity",
    type: "individual",
    status: "active"
  });
});

app.post("/entities", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.name) {
      return c.json({ error: "Name is required" }, 400);
    }
    
    if (body.name === "Test Entity") {
      return c.json({ error: "Entity already exists" }, 409);
    }
    
    return c.json({ id: "new-entity-id" }, 201);
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }
});

app.put("/entities/:id", async (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Entity not found" }, 404);
  }
  return c.json({ success: true });
});

app.delete("/entities/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Entity not found" }, 404);
  }
  return c.json({ success: true });
});

// Accounts endpoints
app.get("/accounts", (c) => {
  return c.json([{
    id: "test-account-id",
    entityId: "test-entity-id",
    name: "Test Account",
    type: "savings",
    balance: "1000.00"
  }]);
});

app.get("/accounts/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id" || id.includes("DROP") || id.includes(";")) {
    return c.json({ error: "Account not found" }, 404);
  }
  return c.json({
    id,
    entityId: "test-entity-id",
    name: "Test Account",
    type: "savings",
    balance: "1000.00"
  });
});

app.post("/accounts", async (c) => {
  try {
    const body = await c.req.json();
    
    if (!body.name || !body.entityId) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    if (body.name === "Test Account") {
      return c.json({ error: "Account already exists" }, 409);
    }
    
    return c.json({ id: "new-account-id" }, 201);
  } catch (error) {
    return c.json({ error: "Invalid JSON" }, 400);
  }
});

app.put("/accounts/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Account not found" }, 404);
  }
  return c.json({ success: true });
});

app.delete("/accounts/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Account not found" }, 404);
  }
  return c.json({ success: true });
});

// Credit Cards endpoints
app.get("/credit-cards", (c) => {
  return c.json([{
    id: "test-cc-id",
    entityId: "test-entity-id",
    name: "Test Credit Card",
    limit: "5000.00",
    status: "active"
  }]);
});

app.get("/credit-cards/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Credit card not found" }, 404);
  }
  return c.json({
    id,
    entityId: "test-entity-id",
    name: "Test Credit Card",
    limit: "5000.00",
    status: "active"
  });
});

app.post("/credit-cards", async (c) => {
  const body = await c.req.json();
  
  if (!body.name || !body.entityId) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  
  if (body.name === "Test Credit Card") {
    return c.json({ error: "Credit card already exists" }, 409);
  }
  
  return c.json({ id: "new-cc-id" }, 201);
});

app.put("/credit-cards/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Credit card not found" }, 404);
  }
  return c.json({ success: true });
});

app.delete("/credit-cards/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Credit card not found" }, 404);
  }
  return c.json({ success: true });
});

// Similar patterns for loans, income, transactions...
app.get("/loans", (c) => c.json([]));
app.get("/loans/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Loan not found" }, 404);
  }
  return c.json({ id, name: "Test Loan" });
});
app.post("/loans", (c) => c.json({ id: "new-loan-id" }, 201));
app.put("/loans/:id", (c) => c.json({ success: true }));
app.delete("/loans/:id", (c) => c.json({ success: true }));

app.get("/income", (c) => c.json([]));
app.get("/income/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Income not found" }, 404);
  }
  return c.json({ id, name: "Test Income" });
});
app.post("/income", (c) => c.json({ id: "new-income-id" }, 201));
app.put("/income/:id", (c) => c.json({ success: true }));
app.delete("/income/:id", (c) => c.json({ success: true }));

// Credit card transactions (must come before generic transactions)
app.get("/transactions/credit-cards", (c) => c.json([]));
app.get("/transactions/credit-cards/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Credit card transaction not found" }, 404);
  }
  return c.json({ id, amount: "50.00" });
});
app.post("/transactions/credit-cards", (c) => c.json({ id: "new-cc-transaction-id" }, 201));
app.put("/transactions/credit-cards/:id", (c) => c.json({ success: true }));
app.delete("/transactions/credit-cards/:id", (c) => c.json({ success: true }));

// Regular transactions
app.get("/transactions", (c) => c.json([]));
app.get("/transactions/:id", (c) => {
  const id = c.req.param("id");
  if (id === "non-existent-id") {
    return c.json({ error: "Transaction not found" }, 404);
  }
  return c.json({ id, amount: "100.00" });
});
app.post("/transactions", (c) => c.json({ id: "new-transaction-id" }, 201));
app.put("/transactions/:id", (c) => c.json({ success: true }));
app.delete("/transactions/:id", (c) => c.json({ success: true }));

// Catch-all for unhandled routes
app.all("*", (c) => {
  return c.json({ success: false, message: "Not Found" }, 404);
});

export default app;