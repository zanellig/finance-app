# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Installation and Setup

```bash
# Install all dependencies for both frontend and backend
pnpm install

# Install backend only
pnpm install:backend

# Install frontend only
pnpm install:frontend
```

### Running the Application

```bash
# Start both frontend and backend in development mode
pnpm dev

# Start backend only (Hono API on Bun)
pnpm dev:backend

# Start frontend only (Next.js)
pnpm dev:frontend
```

### Backend Development

```bash
# Run tests
cd backend && bun test

# Watch tests
cd backend && bun test --watch

# Database operations
cd backend && pnpm db:push      # Push schema changes
cd backend && pnpm db:generate  # Generate migrations
cd backend && pnpm db:migrate   # Run migrations
cd backend && pnpm db:studio    # Open Drizzle Studio
cd backend && pnpm db:check     # Check schema consistency

# Code quality
cd backend && pnpm lint:check   # ESLint check
cd backend && pnpm format:check # Prettier check
```

### Frontend Development

```bash
# Build production version
cd frontend && pnpm build

# Start production server
cd frontend && pnpm start

# Lint check
cd frontend && pnpm lint
```

## Architecture Overview

### Technology Stack

- **Monorepo**: Root package.json with workspace configuration
- **Backend**: Bun runtime with Hono framework, MySQL + Drizzle ORM
- **Frontend**: Next.js 15 with React 19, Tailwind CSS, shadcn/ui
- **Authentication**: Custom JWT-based authentication with jsonwebtoken
- **Package Manager**: pnpm (required - see global CLAUDE.md)

### Project Structure

```
finance-tracker/
├── backend/               # Hono API server
│   ├── src/
│   │   ├── config/       # Environment configuration
│   │   ├── controllers/  # HTTP route handlers
│   │   ├── dtos/         # Zod validation schemas
│   │   ├── middleware/   # Auth and request middleware
│   │   ├── models/       # Drizzle ORM table definitions
│   │   ├── services/     # Database and business logic
│   │   ├── types/        # TypeScript type definitions
│   │   └── utils/        # Utility functions
│   └── drizzle/          # Database migration files
├── frontend/             # Next.js application
│   └── src/
│       ├── app/          # Next.js App Router pages
│       ├── components/   # React components (auth + ui)
│       ├── contexts/     # React contexts (auth)
│       └── lib/          # Utilities and API client
└── docs/                 # Documentation
```

### Key Patterns

1. **Monorepo Structure**: Root workspace with concurrent development scripts for both apps

2. **API Design**: RESTful endpoints under `/api` base path with auth middleware on protected routes

3. **Database Schema**:

   - Snake_case naming convention
   - UUID primary keys with v4() generation
   - Entity-based relationships: users → entities → accounts/cards/loans
   - Drizzle ORM with MySQL backend

4. **Validation**: Zod schemas in DTOs for request/response validation with `validateBody` middleware

5. **Authentication**: Custom JWT service with Bearer token validation on protected routes

6. **Frontend State**: React Query for server state, Context API for auth state

### Important Notes

1. **Controller Refactoring**: Current Rails-style controllers need refactoring to Hono's recommended route grouping pattern (see backend/src/index.ts:25-43)

2. **Environment Requirements**:

   - Backend requires `MYSQL_URL` and `JWT_SECRET` (min 32 chars)
   - Frontend currently has Clerk env vars but uses custom auth context

3. **Development Workflow**:

   - Always use pnpm (global requirement)
   - Run linting after code changes
   - Use concurrent development mode for full-stack development

4. **Testing**: Backend uses Bun's built-in test runner with watch mode available

## Versioning

**IMPORTANT**: This project follows semantic versioning (semver) guidelines. Before making any changes that affect versioning, consult the comprehensive versioning framework documented in `VERSIONING.md`.

### Versioning Commands

```bash
# Update version in frontend package.json
cd frontend && npm version [major|minor|patch]

# Create git tag for release
git tag -a v1.2.3 -m "Release version 1.2.3"

# Push version and tags
git push origin main --tags
```

**Version Decision Guidelines:**
- **MAJOR (X.0.0)**: Breaking database schema changes, removed API endpoints, breaking component changes
- **MINOR (x.Y.0)**: New features, new endpoints, new UI components, new database tables
- **PATCH (x.y.Z)**: Bug fixes, security updates, dependency updates, performance improvements

**Always reference VERSIONING.md for detailed decision criteria and AI agent implementation guidelines.**

## Critical Development Rules

### Database Operations

**NEVER use `db.delete()` for any operations.** All deletions must be soft deletes using the following pattern:

```typescript
// ✅ CORRECT: Soft delete
await db.update(tableName).set({
  status: "deleted",
  deletedAt: new Date()
}).where(eq(tableName.id, id));

// ❌ WRONG: Hard delete - NEVER DO THIS
await db.delete(tableName).where(eq(tableName.id, id));
```

**All models must have soft delete fields:**
- `status: mysqlEnum(["active", "inactive", "deleted"]).default("active")`
- `deletedAt: timestamp("deleted_at")` (included in `defaultTimestamps`)

**Rationale:** Soft deletes preserve data integrity, enable audit trails, and allow for data recovery. Hard deletes are irreversible and can cause referential integrity issues.

### Query Filtering for Soft Deletes

**All SELECT queries must filter out soft-deleted records** using the following patterns:

```typescript
// ✅ CORRECT: Single table with soft delete
await db.select().from(tableName).where(and(
  eq(tableName.userId, user.id),
  ne(tableName.status, "deleted")
));

// ✅ CORRECT: Join with multiple tables having soft delete
await db.select()
  .from(accounts)
  .innerJoin(entities, eq(accounts.entityId, entities.id))
  .where(and(
    eq(entities.userId, user.id),
    ne(accounts.status, "deleted"),
    ne(entities.status, "deleted")
  ));

// ✅ CORRECT: Credit card transactions (use recordStatus)
await db.select().from(creditCardTransactions).where(and(
  eq(creditCardTransactions.creditCardId, cardId),
  ne(creditCardTransactions.recordStatus, "deleted")
));
```

**Required imports:** Add `ne` (not equal) to drizzle-orm imports:
```typescript
import { eq, and, ne } from "drizzle-orm";
```
