# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run database migrations
pnpm db:push

# Start development server (runs on http://localhost:3000)
pnpm dev
```

### Database Management

```bash
# Generate database migration files
pnpm db:generate

# Apply database migrations
pnpm db:migrate

# Push schema changes directly to database
pnpm db:push

# Open Drizzle Studio for database management
pnpm db:studio

# Check database schema consistency
pnpm db:check
```

## Architecture Overview

### Technology Stack

- **Runtime**: Bun
- **Framework**: Hono (lightweight web framework)
- **Database**: MySQL with Drizzle ORM
- **Validation**: Zod for runtime type validation
- **Package Manager**: pnpm with workspace configuration

### Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (env.ts)
│   ├── controllers/     # Route handlers (entities, users)
│   ├── dtos/           # Data Transfer Objects with Zod schemas
│   ├── models/         # Drizzle ORM table definitions
│   ├── services/       # Business logic and database service
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions (validator)
└── index.ts            # Application entry point
```

### Key Architectural Patterns

1. **Model-Controller Pattern**: Controllers handle HTTP requests and responses, models define database schema using Drizzle ORM.

2. **DTO Validation**: All request/response data is validated using Zod schemas in the `dtos/` directory. The `validateBody` middleware ensures type safety at runtime.

3. **Database Schema**:

   - Uses snake_case naming convention
   - All tables have UUID primary keys generated with v4()
   - Common fields handled through `defaultTimestamps` constant
   - Relationships defined with foreign key constraints

4. **Entity Relationships**:
   - `users` → `entities` (one-to-many)
   - `entities` → `accounts`, `credit_cards`, `loans` (one-to-many)
   - `accounts`/`credit_cards` → `transactions` (one-to-many)

### Important Notes

1. **Controller Refactoring TODO**: The current controller pattern (Rails-like) is marked for refactoring in src/index.ts:33. The recommended approach is to use Hono's route grouping pattern for better type inference with dynamic route parameters.

2. **Environment Configuration**: The application requires a `MYSQL_URL` environment variable in the format: `mysql://{username}:{password}@{HOST}:{PORT}/{db_name}`

3. **Middleware Stack**:

   - ETag for caching
   - Logger for request logging
   - CORS enabled for `/api/*` routes
   - Compression with @hono/bun-compress

4. **Recent Architecture Changes**: Based on recent commits, userId fields were removed from loans and accounts tables, suggesting a move towards indirect relationships through entities.
