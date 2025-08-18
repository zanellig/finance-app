# Finance Tracker Backend

A modern financial tracking API built with Bun, Hono, and MySQL.

## Quick Start

### Installation
```bash
pnpm install
```

### Database Setup
```bash
pnpm db:push      # Apply schema changes
```

### Development
```bash
pnpm dev          # Start development server at http://localhost:3000
```

## Development Commands

### Running the Application
```bash
pnpm install      # Install dependencies
pnpm db:push      # Push schema changes
pnpm dev          # Start development server
```

### Database Management
```bash
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema changes directly
pnpm db:studio    # Open Drizzle Studio
pnpm db:check     # Check schema consistency
```

### Code Quality
```bash
bun run eslint .     # Run ESLint
pnpm format:check    # Check Prettier formatting
```

### Testing
```bash
bun test             # Run tests
bun test --watch     # Watch mode
```

## Architecture

### Technology Stack
- **Runtime**: Bun
- **Framework**: Hono (lightweight web framework)
- **Database**: MySQL with Drizzle ORM
- **Validation**: Zod for runtime type validation
- **Authentication**: Custom JWT with jsonwebtoken
- **Package Manager**: pnpm

### Project Structure
```
backend/
├── src/
│   ├── config/          # Configuration (env.ts)
│   ├── controllers/     # Route handlers
│   ├── dtos/           # Zod validation schemas
│   ├── middleware/     # Auth and logging middleware
│   ├── models/         # Drizzle ORM table definitions
│   ├── services/       # Business logic (auth, db)
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── drizzle/            # Database migrations
└── test/               # Test files
```

### Key Features
- RESTful API design with `/api` base path
- JWT-based authentication (7-day tokens)
- Soft delete pattern for data integrity
- Snake_case database naming convention
- UUID primary keys with v4() generation
- Comprehensive request validation with Zod

### Database Schema
Entity relationships:
- `users` → `entities` (one-to-many)
- `entities` → `accounts`, `credit_cards`, `loans` (one-to-many)
- `accounts`/`credit_cards` → `transactions` (one-to-many)

All models include:
- Soft delete fields (`status`, `deletedAt`)
- Timestamps (`createdAt`, `updatedAt`)
- Foreign key constraints with cascade options

### API Endpoints

**Authentication**:
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

**Entities** (Protected):
- `GET /api/entities` - List user's entities
- `GET /api/entities/:id` - Get specific entity
- `POST /api/entities` - Create new entity

*Note: Controllers are currently commented out in `src/app.ts`*

## Environment Variables
Required environment variables:
```bash
MYSQL_URL=mysql://username:password@host:port/database
JWT_SECRET=your-secret-key-minimum-32-characters
NODE_ENV=development
LOG_LEVEL=info
```

## Important Notes

⚠️ **Soft Delete Pattern**: Always use soft deletes instead of hard deletes:
```typescript
// ✅ Correct - Soft delete
await db.update(table).set({ status: "deleted", deletedAt: new Date() })

// ❌ Wrong - Hard delete  
await db.delete(table)
```

⚠️ **Query Filtering**: Always filter out deleted records:
```typescript
await db.select().from(table).where(and(
  eq(table.userId, userId),
  ne(table.status, "deleted")
));
```
