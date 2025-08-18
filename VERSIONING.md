# Finance Tracker - Semantic Versioning Framework

This document defines the semantic versioning (semver) framework for the Finance Tracker application, a full-stack financial management platform. This framework is designed to provide clear, consistent guidelines for version management that both human developers and AI agents can follow.

## Version Format: `MAJOR.MINOR.PATCH`

All versions follow the semantic versioning specification at [semver.org](https://semver.org/).

---

## MAJOR Version (X.0.0)

Major versions represent **breaking changes** that require user intervention, database migrations, or significant architecture modifications. Increment the MAJOR version when making incompatible API changes or fundamental architectural shifts.

### Backend Breaking Changes

#### Database Schema Changes

- **Table Structure Modifications**: Adding/removing/renaming columns with `NOT NULL` constraints
- **Primary Key Changes**: Modifying UUID generation strategy or key structure
- **Relationship Changes**: Breaking foreign key relationships or changing cascade behaviors
- **Data Type Changes**: Altering column types that require data conversion (varchar to enum, etc.)
- **Index Changes**: Removing critical database indexes that affect query performance

**Examples:**

```sql
-- MAJOR: Breaking change - requires migration
ALTER TABLE users ADD COLUMN required_field VARCHAR(255) NOT NULL;

-- MAJOR: Breaking relationship change
ALTER TABLE accounts DROP FOREIGN KEY accounts_user_id_foreign;
```

#### API Breaking Changes

- **Endpoint Removal**: Removing existing REST endpoints (`/api/users`, `/api/entities`)
- **Request/Response Schema Changes**: Modifying Zod validation schemas in ways that break existing clients
- **Authentication Changes**: Changing JWT token structure or auth middleware behavior
- **HTTP Status Code Changes**: Modifying expected response codes for existing endpoints
- **Required Parameter Changes**: Making optional parameters required or vice versa

**Examples:**

```typescript
// MAJOR: Breaking DTO change
export const createUserDto = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  // Adding required field breaks existing API clients
  requiredField: z.string(), // ⚠️ MAJOR version required
});

// MAJOR: Breaking endpoint removal
// Removing usersRouter.get("/profile") // ⚠️ MAJOR version required
```

#### Framework/Runtime Breaking Changes

- **Bun Runtime Version**: Major Bun version upgrades with breaking changes
- **Hono Framework**: Breaking changes in Hono framework (v4 → v5)
- **Drizzle ORM**: Major ORM changes affecting query syntax or schema definitions
- **Database Engine**: Switching database systems (MySQL → PostgreSQL)

### Frontend Breaking Changes

#### UI Component API Changes

- **Component Props**: Removing or significantly changing component prop interfaces
- **Component Behavior**: Fundamental changes to how components work (shadcn/ui breaking changes)
- **Export Changes**: Removing or renaming exported functions/components from shared modules

**Examples:**

```typescript
// MAJOR: Breaking component prop change
interface ButtonProps {
  // Removing 'size' prop breaks existing usage
  // size?: 'sm' | 'md' | 'lg' // ⚠️ MAJOR version required
  variant?: "default" | "destructive";
}
```

#### Framework Breaking Changes

- **Next.js Major Versions**: Next.js 15 → 16 with breaking changes
- **React Major Versions**: React 19 → 20 with breaking changes
- **Build System Changes**: Switching bundlers or major build configuration changes
- **Routing Changes**: App Router structural changes that break existing navigation

#### Theme/Design System Changes

- **CSS Variable Removal**: Removing core CSS custom properties used throughout the app
- **Design Token Changes**: Breaking changes to design system tokens (colors, spacing)
- **Layout Breaking Changes**: Modifications that fundamentally change app layout structure

### Infrastructure Breaking Changes

- **Environment Variables**: Removing required environment variables or changing their format
- **Docker Configuration**: Breaking changes to containerization that require infrastructure updates
- **Deployment Changes**: Modifications requiring infrastructure reconfiguration

---

## MINOR Version (x.Y.0)

Minor versions represent **new features** and **enhancements** that are backward-compatible. Users can upgrade without breaking existing functionality.

### Backend New Features

#### New API Endpoints

- **Resource Endpoints**: Adding new REST endpoints for entities (`GET /api/budgets`, `POST /api/reports`)
- **CRUD Operations**: Adding new CRUD operations for existing resources
- **Query Parameters**: Adding optional query parameters for filtering, sorting, pagination
- **Response Enhancement**: Adding optional fields to response schemas (backward-compatible)

**Examples:**

```typescript
// MINOR: New optional endpoint
budgetsRouter.get("/monthly", async (c) => {
  // New feature - monthly budget overview
});

// MINOR: Adding optional response field
export const userResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  lastLoginAt: z.string().optional(), // New optional field
});
```

#### Database Enhancements

- **New Tables**: Adding entirely new tables for new features (`budgets`, `categories`, `reports`)
- **Optional Columns**: Adding nullable columns to existing tables
- **New Indexes**: Adding performance-enhancing database indexes
- **New Relationships**: Creating new foreign key relationships without breaking existing ones

**Examples:**

```sql
-- MINOR: New table for new feature
CREATE TABLE budgets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- MINOR: Adding optional column
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL;
```

#### Business Logic Enhancements

- **New Services**: Adding new service modules (`budgetService`, `reportService`)
- **Enhanced Validation**: Adding more sophisticated validation rules to existing DTOs
- **New Middleware**: Adding optional middleware for logging, analytics, etc.
- **Algorithm Improvements**: Enhancing existing business logic without changing interfaces

### Frontend New Features

#### New UI Components

- **shadcn/ui Components**: Adding new UI components to the design system
- **Business Components**: Creating new business-specific components (`BudgetCard`, `TransactionTable`)
- **Layout Components**: Adding new layout patterns or page templates

**Examples:**

```typescript
// MINOR: New UI component
export function BudgetOverview({ budget }: { budget: Budget }) {
  return <Card><!-- Budget overview component --></Card>
}

// MINOR: New auth component variant
export function SocialAuthButtons() {
  // New social authentication options
}
```

#### Page/Route Additions

- **New Pages**: Adding new application pages (`/budgets`, `/reports`, `/analytics`)
- **Page Enhancements**: Adding new sections or features to existing pages
- **Navigation Updates**: Adding new navigation items for new features

#### Functionality Enhancements

- **Form Enhancements**: Adding new form fields or validation to existing forms
- **State Management**: Extending React Query queries or auth context functionality
- **Theme Enhancements**: Adding new theme variants or customization options
- **Accessibility**: Improving accessibility features without breaking existing behavior

### Development Experience

- **Build Optimizations**: Performance improvements to build processes
- **Development Tools**: Adding new development scripts or tools
- **Testing Infrastructure**: Adding new test utilities or test coverage
- **Documentation**: Comprehensive documentation updates or new documentation sections

---

## PATCH Version (x.y.Z)

Patch versions represent **bug fixes**, **security updates**, and **minor improvements** that don't add new functionality or break existing behavior.

### Bug Fixes

#### Backend Bug Fixes

- **API Fixes**: Correcting incorrect HTTP status codes, fixing response formatting
- **Business Logic Fixes**: Fixing calculation errors, validation bugs, or data processing issues
- **Database Fixes**: Correcting query performance issues, fixing data integrity problems
- **Security Fixes**: Patching security vulnerabilities, updating dependencies with CVE fixes

**Examples:**

```typescript
// PATCH: Fix incorrect HTTP status
if (!user) {
  // Fixed: was returning 500, should be 404
  return c.json({ success: false, message: "User not found" }, 404);
}

// PATCH: Fix validation bug
export const createTransactionDto = z.object({
  // Fixed: amount should allow negative values for debits
  amount: z.number(), // was z.number().positive()
});
```

#### Frontend Bug Fixes

- **UI Fixes**: Correcting component rendering issues, styling bugs, responsive design problems
- **Form Fixes**: Fixing form validation, submission errors, or user input handling
- **State Fixes**: Correcting React state management issues, fixing re-rendering problems
- **Accessibility Fixes**: Improving screen reader support, keyboard navigation, focus management

**Examples:**

```typescript
// PATCH: Fix button disabled state
<AuthSubmitButton
  loading={isLoading}
  disabled={!isValid || isLoading} // Fixed: was missing isLoading check
>
  Register
</AuthSubmitButton>

// PATCH: Fix responsive design issue
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"> // Fixed: was missing lg breakpoint
```

### Performance Improvements

- **Query Optimizations**: Improving database query performance without changing APIs
- **Bundle Size**: Optimizing JavaScript bundle size, removing unused dependencies
- **Rendering Performance**: Optimizing React component re-rendering, memoization improvements
- **Load Time**: Improving initial page load times, optimizing asset loading

### Dependency Updates

- **Security Updates**: Updating dependencies to patch security vulnerabilities
- **Bug Fix Updates**: Updating to dependency patch versions that fix bugs
- **Maintenance Updates**: Routine dependency updates that don't change functionality

**Examples:**

```json
// PATCH: Security dependency update
{
  "dependencies": {
    "jsonwebtoken": "^9.0.3" // Updated from 9.0.2 for security patch
  }
}
```

### Code Quality Improvements

- **Refactoring**: Internal code improvements that don't change external behavior
- **Type Safety**: Improving TypeScript types without changing runtime behavior
- **Error Handling**: Better error messages, improved error logging
- **Code Organization**: Moving files, improving imports, cleaning up unused code

### Documentation Updates

- **README Updates**: Correcting setup instructions, fixing broken links
- **Comment Updates**: Improving code comments, fixing typos in documentation
- **API Documentation**: Correcting API documentation inconsistencies

---

#### Package Manager Considerations

```json
{
  "dependencies": {
    // Caret range: allows MINOR and PATCH updates
    "react": "^19.0.0",

    // Tilde range: allows PATCH updates only
    "jsonwebtoken": "~9.0.2",

    // Exact version: no automatic updates
    "@types/node": "20.10.0",

    // Range: specific version constraints
    "typescript": ">=5.0.0 <5.3.0"
  }
}
```

**Lock file management strategy:**

- Commit `pnpm-lock.yaml` to ensure reproducible builds
- Update lock files regularly for security patches
- Use `pnpm audit` to identify vulnerable dependencies

---

## Version Decision Matrix

Use this matrix to determine the appropriate version bump:

| Change Type               | Database | API | Frontend | Infrastructure | Version   |
| ------------------------- | -------- | --- | -------- | -------------- | --------- |
| Breaking schema change    | ✅       | ❌  | ❌       | ❌             | **MAJOR** |
| Remove API endpoint       | ❌       | ✅  | ❌       | ❌             | **MAJOR** |
| Change component props    | ❌       | ❌  | ✅       | ❌             | **MAJOR** |
| Remove env variable       | ❌       | ❌  | ❌       | ✅             | **MAJOR** |
| Add new table             | ✅       | ❌  | ❌       | ❌             | **MINOR** |
| Add new endpoint          | ❌       | ✅  | ❌       | ❌             | **MINOR** |
| Add new page              | ❌       | ❌  | ✅       | ❌             | **MINOR** |
| Add optional env variable | ❌       | ❌  | ❌       | ✅             | **MINOR** |
| Fix query bug             | ✅       | ❌  | ❌       | ❌             | **PATCH** |
| Fix status code           | ❌       | ✅  | ❌       | ❌             | **PATCH** |
| Fix UI bug                | ❌       | ❌  | ✅       | ❌             | **PATCH** |
| Update dependencies       | ❌       | ❌  | ❌       | ✅             | **PATCH** |

### Edge Cases and Clarifications

#### Configuration Changes

**Default Configuration Values:**

- **MINOR**: Adding new configuration with sensible defaults
- **MAJOR**: Changing existing default values that affect behavior
- **PATCH**: Fixing incorrect default values

```typescript
// MINOR: New optional config with default
export const config = {
  // Existing configs...
  newFeatureEnabled: process.env.NEW_FEATURE_ENABLED === "true" || false, // Default: false
};

// MAJOR: Changing existing default behavior
export const config = {
  // Was: apiTimeout: 5000, now changed to 30000
  apiTimeout: parseInt(process.env.API_TIMEOUT) || 30000, // ⚠️ MAJOR version required
};

// PATCH: Fixing incorrect default
export const config = {
  // Was: maxRetries: 10 (too high), fixed to reasonable default
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3, // ✅ PATCH version
};
```

**Required Configuration with Migration:**

```typescript
// MAJOR: Adding required config without default
export const config = {
  // New required config - breaks existing deployments
  requiredApiKey: process.env.REQUIRED_API_KEY!, // ⚠️ MAJOR version required
};

// MINOR: Required config with temporary fallback
export const config = {
  // Graceful migration path with fallback
  apiKey:
    process.env.NEW_API_KEY ||
    process.env.LEGACY_API_KEY ||
    (() => {
      console.warn(
        "NEW_API_KEY not set, using legacy key. Update before v3.0.0"
      );
      return process.env.LEGACY_API_KEY;
    })(),
};
```

#### Performance Changes

**Performance Degradation:**

- **MAJOR**: Significant performance degradation (>50% slower)
- **MINOR**: Moderate performance changes with new features
- **PATCH**: Performance fixes and optimizations

```typescript
// MAJOR: Algorithm change causing significant slowdown
// Old: O(1) lookup, New: O(n) scan - breaking performance expectation
async function findUser(id: string) {
  // Changed from hash lookup to linear search ⚠️ MAJOR version required
  return users.find((user) => user.id === id);
}

// MINOR: Performance trade-off with new feature
async function findUser(id: string, includeDetails = false) {
  const user = userCache.get(id);

  // New feature adds optional expensive operation
  if (includeDetails) {
    user.details = await fetchUserDetails(id); // Additional overhead
  }

  return user;
}

// PATCH: Performance optimization
async function findUser(id: string) {
  // Added caching to improve performance ✅ PATCH version
  return userCache.get(id) || (await fetchUser(id));
}
```

**Memory Usage Changes:**

```typescript
// MAJOR: Significant memory increase (breaking production limits)
// New feature requires 10x more memory per user ⚠️ MAJOR version required

// MINOR: Moderate memory increase with new functionality
// Caching adds 20% memory usage but provides new features ✅ MINOR version

// PATCH: Memory leak fix or optimization
// Fixed memory leak reducing usage by 30% ✅ PATCH version
```

#### Behavioral Changes

**Error Handling Changes:**

```typescript
// MAJOR: Changing error behavior that clients depend on
async function validateUser(data: UserData) {
  if (!data.email) {
    // Was: returned null, now throws error ⚠️ MAJOR version required
    throw new ValidationError("Email is required");
  }
}

// MINOR: Adding new error cases for new validation
async function validateUser(data: UserData) {
  // Existing validations...

  // New validation for new feature ✅ MINOR version
  if (data.enableNewFeature && !data.newRequiredField) {
    throw new ValidationError("New field required when feature enabled");
  }
}

// PATCH: Fixing incorrect error messages or codes
async function validateUser(data: UserData) {
  if (!data.email) {
    // Fixed: was returning wrong error code ✅ PATCH version
    throw new ValidationError("Email is required", "INVALID_EMAIL"); // was 'INVALID_USER'
  }
}
```

---

## Monorepo Versioning Strategy

The Finance Tracker uses a **synchronized versioning** approach for the monorepo, ensuring consistency across frontend and backend packages.

### Synchronized Versioning (Recommended)

Both `frontend` and `backend` packages share the same version number, synchronized with the root package.

**Advantages:**

- Clear correlation between frontend and backend changes
- Simplified deployment and release management
- Easier to communicate version updates to users
- Reduced complexity in CI/CD pipelines

**Implementation:**

```json
// Root package.json
{
  "name": "finance-tracker",
  "version": "1.2.3",
  "workspaces": ["frontend", "backend"]
}

// frontend/package.json
{
  "name": "frontend",
  "version": "1.2.3"
}

// backend/package.json
{
  "name": "backend",
  "version": "1.2.3"
}
```

### Version Bump Strategy

**When frontend-only changes:**

```bash
# Update all packages even if only frontend changed
cd frontend && npm version patch
cd ../backend && npm version patch
cd .. && npm version patch
```

**When backend-only changes:**

```bash
# Update all packages even if only backend changed
cd backend && npm version minor
cd ../frontend && npm version minor
cd .. && npm version minor
```

**When both packages change:**

```bash
# Determine highest version bump needed
# If frontend needs PATCH and backend needs MINOR → use MINOR
cd frontend && npm version minor
cd ../backend && npm version minor
cd .. && npm version minor
```

### Version Validation Script

```bash
#!/bin/bash
# scripts/validate-versions.sh

ROOT_VERSION=$(node -p "require('./package.json').version")
FRONTEND_VERSION=$(node -p "require('./frontend/package.json').version")
BACKEND_VERSION=$(node -p "require('./backend/package.json').version")

if [ "$ROOT_VERSION" != "$FRONTEND_VERSION" ] || [ "$ROOT_VERSION" != "$BACKEND_VERSION" ]; then
  echo "❌ Version mismatch detected:"
  echo "  Root: $ROOT_VERSION"
  echo "  Frontend: $FRONTEND_VERSION"
  echo "  Backend: $BACKEND_VERSION"
  exit 1
fi

echo "✅ All versions synchronized: $ROOT_VERSION"
```

### Alternative: Independent Versioning

_Not recommended for Finance Tracker, but documented for completeness._

Each package maintains its own version based on its changes:

```json
// frontend/package.json - UI changes
{
  "name": "frontend",
  "version": "2.1.4"
}

// backend/package.json - API changes
{
  "name": "backend",
  "version": "1.8.2"
}
```

**Challenges with independent versioning:**

- Complex deployment coordination
- Difficult to communicate compatible versions
- Increased testing matrix complexity
- API/UI compatibility tracking overhead

---

## Database Migration Reversibility

All database migrations should include both forward and reverse migration paths to support safe rollbacks.

### Migration Structure

```sql
-- migrations/2024_08_15_000001_add_user_preferences.sql

-- Forward Migration
CREATE TABLE user_preferences (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_preferences_user_id (user_id)
);

-- Rollback Migration
-- DROP TABLE user_preferences;
```

### Drizzle Migration Pattern

```typescript
// drizzle/migrations/0001_add_user_preferences.ts
import { sql } from "drizzle-orm";

export async function up(db: any) {
  await db.execute(sql`
    CREATE TABLE user_preferences (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36) NOT NULL,
      theme VARCHAR(20) DEFAULT 'light',
      language VARCHAR(10) DEFAULT 'en',
      timezone VARCHAR(50) DEFAULT 'UTC',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_preferences_user_id (user_id)
    )
  `);
}

export async function down(db: any) {
  await db.execute(sql`DROP TABLE user_preferences`);
}
```

### Migration Safety Guidelines

**Safe Migrations (Can be rolled back):**

```sql
-- ✅ Adding nullable columns
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP NULL;

-- ✅ Adding new tables
CREATE TABLE budgets (...);

-- ✅ Adding indexes
CREATE INDEX idx_users_email ON users(email);

-- ✅ Inserting reference data
INSERT INTO categories (id, name) VALUES ('income', 'Income');
```

**Dangerous Migrations (Difficult to rollback):**

```sql
-- ⚠️ Dropping columns (data loss)
ALTER TABLE users DROP COLUMN old_field;

-- ⚠️ Changing column types (data conversion)
ALTER TABLE transactions MODIFY amount DECIMAL(15,4); -- was DECIMAL(10,2)

-- ⚠️ Dropping tables (data loss)
DROP TABLE legacy_data;

-- ⚠️ Removing constraints (data integrity)
ALTER TABLE accounts DROP FOREIGN KEY fk_accounts_user_id;
```

### Rollback Strategy by Migration Type

**Column Addition Rollback:**

```sql
-- Forward: Add column
ALTER TABLE users ADD COLUMN preferences_id VARCHAR(36);

-- Rollback: Drop column
ALTER TABLE users DROP COLUMN preferences_id;
```

**Data Type Change Rollback:**

```sql
-- Forward: Expand precision
ALTER TABLE transactions MODIFY amount DECIMAL(15,4);

-- Rollback: Reduce precision (potential data loss warning required)
ALTER TABLE transactions MODIFY amount DECIMAL(10,2);
-- Warning: Data may be truncated during rollback
```

**Table Rename Rollback:**

```sql
-- Forward: Rename table
RENAME TABLE user_settings TO user_preferences;

-- Rollback: Rename back
RENAME TABLE user_preferences TO user_settings;
```

### Migration Testing

```bash
# Test forward migration
pnpm --dir backend db:migrate

# Test rollback capability
pnpm --dir backend db:rollback

# Test re-migration
pnpm --dir backend db:migrate
```

---

## API Versioning Strategy

The Finance Tracker implements URL-based API versioning to maintain backward compatibility while evolving the API.

### URL-Based Versioning

```typescript
// Current approach: URL path versioning
GET / api / v1 / users; // Version 1
GET / api / v2 / users; // Version 2 (enhanced response)
GET / api / v3 / users; // Version 3 (breaking changes)
```

### Version Lifecycle Management

```typescript
// routes/versions.ts
export const API_VERSIONS = {
  v1: {
    status: "deprecated",
    sunset: "2024-12-31",
    successor: "v2",
  },
  v2: {
    status: "stable",
    supported: true,
  },
  v3: {
    status: "beta",
    supported: true,
  },
} as const;

// Middleware to handle version validation
export const validateApiVersion = (version: string) => {
  const versionInfo = API_VERSIONS[version as keyof typeof API_VERSIONS];

  if (!versionInfo || !versionInfo.supported) {
    throw new HTTPException(404, {
      message: `API version ${version} not supported`,
    });
  }

  if (versionInfo.status === "deprecated") {
    // Add deprecation headers
    return {
      headers: {
        Deprecation: "true",
        Sunset: versionInfo.sunset,
        Link: `</api/${versionInfo.successor}>; rel="successor-version"`,
      },
    };
  }

  return {};
};
```

### Versioning Implementation

```typescript
// v1/users.ts - Legacy API
export const usersV1Router = new Hono().get("/", async (c) => {
  const users = await userService.findAll();

  // V1 response format
  return c.json({
    success: true,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      // Limited fields in v1
    })),
  });
});

// v2/users.ts - Enhanced API
export const usersV2Router = new Hono().get("/", async (c) => {
  const users = await userService.findAll();

  // V2 response format (backward compatible + enhanced)
  return c.json({
    success: true,
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      // New fields in v2
      lastLoginAt: user.lastLoginAt,
      preferences: user.preferences,
      profile: user.profile,
    })),
    meta: {
      total: users.length,
      version: "v2",
    },
  });
});
```

### Version Routing

```typescript
// index.ts - Main router setup
const app = new Hono();

// API version routing
app.route("/api/v1/users", usersV1Router);
app.route("/api/v2/users", usersV2Router);
app.route("/api/v3/users", usersV3Router);

// Default to latest stable version
app.route("/api/users", usersV2Router);

// Version discovery endpoint
app.get("/api/versions", (c) => {
  return c.json(API_VERSIONS);
});
```

### Client Version Management

```typescript
// lib/api-client.ts
class ApiClient {
  constructor(private version: string = "v2") {}

  async getUsers() {
    const response = await fetch(`/api/${this.version}/users`);

    // Handle version-specific response formats
    if (this.version === "v1") {
      return this.handleV1Response(response);
    }

    return this.handleV2Response(response);
  }

  private handleV1Response(response: Response) {
    // Handle legacy response format
  }

  private handleV2Response(response: Response) {
    // Handle enhanced response format
  }
}
```

### When to Create New API Version

**Create new MAJOR API version (v1 → v2) when:**

- Removing endpoints or fields
- Changing required parameters
- Modifying response structure significantly
- Changing authentication mechanisms

**Use existing version with MINOR updates when:**

- Adding optional fields to responses
- Adding new optional parameters
- Adding new endpoints under existing version

---

## Deprecation Strategy

The Finance Tracker follows a structured deprecation policy to provide clear communication and migration paths for deprecated features.

### Deprecation Timeline

1. **Deprecation Notice** (MINOR version): Mark feature as deprecated
2. **Migration Period** (1-2 MAJOR versions): Feature remains functional with warnings
3. **Removal** (MAJOR version): Feature completely removed

### Backend API Deprecation

#### Endpoint Deprecation

```typescript
/**
 * @deprecated Will be removed in v3.0.0. Use GET /api/v2/users/profile instead.
 * @since v2.1.0 - Deprecated in favor of enhanced profile endpoint
 */
router.get("/api/users/legacy-profile", async (c) => {
  // Log deprecation usage for monitoring
  console.warn(
    `[DEPRECATED] /api/users/legacy-profile called from ${c.req.header(
      "user-agent"
    )}`
  );

  // Add deprecation header
  c.res.headers.set("Deprecation", "true");
  c.res.headers.set("Sunset", "2024-12-31");
  c.res.headers.set("Link", '</api/v2/users/profile>; rel="successor-version"');

  // Return data with deprecation notice
  return c.json({
    success: true,
    data: userData,
    _deprecated: {
      message: "This endpoint is deprecated. Use /api/v2/users/profile",
      sunset: "2024-12-31",
      migration_guide: "https://docs.finance-tracker.com/migration/v3",
    },
  });
});
```

#### DTO/Schema Deprecation

```typescript
export const legacyUserDto = z.object({
  id: z.string(),
  name: z.string(),
  /**
   * @deprecated Use 'email_address' field instead. Will be removed in v3.0.0
   */
  email: z.string().optional(),
  email_address: z.string().email(),
});
```

### Frontend Component Deprecation

#### Component Deprecation

```typescript
/**
 * @deprecated LegacyButton will be removed in v3.0.0.
 * Use the new Button component from @/components/ui/button instead.
 *
 * Migration guide: https://docs.finance-tracker.com/components/button-migration
 */
export function LegacyButton({ children, ...props }: LegacyButtonProps) {
  // Development warning
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "LegacyButton is deprecated and will be removed in v3.0.0. " +
        "Please migrate to the new Button component."
    );
  }

  return (
    <button {...props} className={cn("legacy-button", props.className)}>
      {children}
    </button>
  );
}
```

#### Hook Deprecation

```typescript
/**
 * @deprecated useOldAuth will be removed in v3.0.0. Use useAuth instead.
 */
export function useOldAuth() {
  React.useEffect(() => {
    console.warn(
      "useOldAuth is deprecated. Please migrate to useAuth hook. " +
        "See: https://docs.finance-tracker.com/hooks/auth-migration"
    );
  }, []);

  return useAuth(); // Delegate to new implementation
}
```

### Configuration Deprecation

```typescript
// config/deprecated.ts
export const deprecatedConfig = {
  /**
   * @deprecated LEGACY_API_URL will be removed in v3.0.0
   * Use API_BASE_URL instead
   */
  LEGACY_API_URL: process.env.LEGACY_API_URL || process.env.API_BASE_URL,

  // Validate and warn about deprecated env vars
  validate() {
    if (process.env.LEGACY_API_URL) {
      console.warn(
        "LEGACY_API_URL is deprecated and will be removed in v3.0.0. " +
          "Please use API_BASE_URL instead."
      );
    }
  },
};
```

### Deprecation Communication

#### API Response Headers

Standard HTTP headers for deprecated APIs:

```http
Deprecation: true
Sunset: Wed, 31 Dec 2024 23:59:59 GMT
Link: </api/v2/users/profile>; rel="successor-version"
Warning: 299 - "This API is deprecated. Use /api/v2/users/profile"
```

#### Documentation Updates

1. **Changelog**: Document deprecation in release notes
2. **API Docs**: Mark deprecated endpoints with clear notices
3. **Migration Guides**: Provide step-by-step migration instructions
4. **Timeline**: Communicate removal schedule clearly

#### Monitoring Deprecated Features

```typescript
// utils/deprecation-tracker.ts
export class DeprecationTracker {
  static track(feature: string, version: string, sunsetDate: string) {
    // Log to monitoring system
    console.warn(`Deprecated feature used: ${feature}`);

    // Send telemetry (if configured)
    if (process.env.TELEMETRY_ENABLED) {
      analytics.track("deprecated_feature_usage", {
        feature,
        version,
        sunsetDate,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
```

---

## Version Communication

### Where to Display Version Information

#### API Responses

Include version information in API responses:

```typescript
// Standard API response format
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "api_version": "2.1.0",
    "timestamp": "2024-08-15T10:30:00Z"
  }
}

// Health check endpoint
router.get("/api/health", async (c) => {
  return c.json({
    status: "healthy",
    version: process.env.npm_package_version || "unknown",
    build: process.env.BUILD_NUMBER || "local",
    commit: process.env.GIT_SHA || "unknown"
  });
});
```

#### Frontend UI Display

```typescript
// Footer component with version info
export function AppFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-2 text-xs text-muted-foreground">
        <span>Finance Tracker v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
        {process.env.NODE_ENV === "development" && (
          <span className="ml-2">
            Build: {process.env.NEXT_PUBLIC_BUILD_NUMBER}
          </span>
        )}
      </div>
    </footer>
  );
}
```

#### Application Logs

Structured logging with version context:

```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, meta = {}) => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        version: process.env.npm_package_version,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  },
};
```

### Breaking Change Communication

#### Pre-release Communication

1. **Alpha/Beta Releases**: Document breaking changes in release notes
2. **Migration Guides**: Provide before stable release
3. **Community Announcements**: Notify users well in advance

#### Breaking Change Documentation

````markdown
# Breaking Changes in v3.0.0

## Authentication API Changes

**What changed:** Removed `/api/auth/legacy-login` endpoint

**Migration required:** Yes

**Timeline:**

- v2.5.0 (2024-06-01): Endpoint marked as deprecated
- v3.0.0 (2024-12-01): Endpoint removed

**Migration steps:**

1. Update client code to use `/api/auth/login`
2. Update request payload format (see examples below)
3. Update response handling for new format

**Before:**

```typescript
const response = await fetch("/api/auth/legacy-login", {
  method: "POST",
  body: JSON.stringify({ username, password }),
});
```
````

**After:**

```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
```

````

---

## Implementation Guidelines for AI Agents

### Pre-Version Analysis Checklist

Before determining version type, AI agents should analyze:

1. **Database Impact Analysis**:

   ```bash
   # Check for schema changes
   pnpm --dir backend db:check

   # Review migration files
   ls backend/drizzle/migrations/
````

2. **API Compatibility Check**:

   ```bash
   # Examine DTO changes
   git diff HEAD~1 backend/src/dtos/

   # Check controller modifications
   git diff HEAD~1 backend/src/controllers/
   ```

3. **Frontend Breaking Changes**:

   ```bash
   # Review component prop changes
   git diff HEAD~1 frontend/src/components/

   # Check for removed exports
   grep -r "export" frontend/src/components/ui/
   ```

4. **Dependency Analysis**:
   ```bash
   # Check for major dependency updates
   git diff HEAD~1 package.json backend/package.json frontend/package.json
   ```

### Version Bump Commands

```bash
# Update version in frontend package.json
cd frontend && npm version [major|minor|patch]

# Create git tag for release
git tag -a v1.2.3 -m "Release version 1.2.3"

# Push version and tags
git push origin main --tags
```

### Commit Message Templates

**MAJOR Version:**

```
BREAKING CHANGE: [description]

- Removed deprecated API endpoint /api/legacy
- Changed user authentication flow
- Requires database migration

BREAKING CHANGES:
- API clients must update authentication headers
- Database migration required before deployment
```

**MINOR Version:**

```
feat: add budget management functionality

- Add budget creation and management endpoints
- Implement budget overview UI components
- Add budget-related database tables
- Extend navigation with budget section
```

**PATCH Version:**

```
fix: resolve transaction calculation error

- Fix decimal precision in transaction amounts
- Correct currency conversion calculations
- Update validation for negative amounts
```

### Testing Requirements by Version Type

**MAJOR Version Requirements:**

- [ ] **100%** backward compatibility test coverage for breaking changes
- [ ] All existing API endpoints return expected responses (until deprecated)
- [ ] Database migrations run successfully with rollback capability
- [ ] Integration tests cover all breaking changes
- [ ] Migration guides completed and tested
- [ ] **>95%** overall test coverage maintained
- [ ] Performance benchmarks show acceptable degradation (<10%)
- [ ] Security audit completed for authentication/authorization changes

**MINOR Version Requirements:**

- [ ] **>90%** test coverage for all new features
- [ ] Existing functionality remains unchanged (regression tests)
- [ ] New API endpoints have comprehensive validation tests
- [ ] UI components tested across target browsers (Chrome, Firefox, Safari, Edge)
- [ ] Performance impact measured and acceptable (<5% degradation)
- [ ] Accessibility tests pass for new UI components
- [ ] Feature flags implemented for gradual rollout (if applicable)

**PATCH Version Requirements:**

- [ ] **100%** test coverage for bug fix area
- [ ] Bug fix resolves the reported issue with test case
- [ ] No regressions introduced (full regression test suite)
- [ ] Security fixes verified with penetration testing
- [ ] Performance improvements measured and documented
- [ ] Error scenarios properly handled and tested

### Changelog Automation with Conventional Commits

The Finance Tracker uses conventional commits to automate version bumping and changelog generation.

#### Conventional Commit Format

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types and Version Impact

```bash
# PATCH version bumps
fix: resolve calculation error in transaction totals
perf: improve query performance for user dashboard
docs: correct API documentation for authentication

# MINOR version bumps
feat: add budget management functionality
feat(api): implement transaction categorization endpoints
feat(ui): add dark mode theme support

# MAJOR version bumps
feat!: change authentication to OAuth2
fix!: remove deprecated legacy API endpoints
BREAKING CHANGE: update user profile data structure
```

#### Automated Version Bumping

```bash
# Install conventional commits tools
pnpm add -D @commitlint/cli @commitlint/config-conventional
pnpm add -D standard-version

# Package.json scripts
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch"
  }
}

# Generate changelog and bump version
pnpm release
```

#### Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build", // Build system changes
        "chore", // Maintenance tasks
        "ci", // CI configuration
        "docs", // Documentation
        "feat", // New features (MINOR)
        "fix", // Bug fixes (PATCH)
        "perf", // Performance improvements (PATCH)
        "refactor", // Code refactoring (PATCH)
        "revert", // Revert previous commit
        "style", // Code style changes (PATCH)
        "test", // Test additions/modifications
      ],
    ],
    "scope-enum": [2, "always", ["api", "ui", "auth", "db", "config", "docs"]],
  },
};
```

### Version File Locations

All locations that need version updates during release:

```bash
# Primary version sources
frontend/package.json         # Frontend application version
backend/package.json          # Backend API version
package.json                  # Root monorepo version

# Environment and configuration
.env.example                  # API_VERSION example value
docker-compose.yml           # Image tags and labels
Dockerfile                   # Version labels

# Documentation
README.md                    # Version badges and references
CLAUDE.md                    # Version in examples
docs/api-reference.md        # API version documentation

# Frontend version display
frontend/src/lib/version.ts  # Version constants
frontend/src/components/footer.tsx  # Version display

# Backend version endpoints
backend/src/routes/health.ts # Health check version info
backend/src/config/version.ts # Version configuration

# CI/CD and deployment
.github/workflows/*.yml      # Workflow version references
k8s/*.yaml                   # Kubernetes deployment versions (if applicable)
```

#### Version Update Script

```bash
#!/bin/bash
# scripts/update-version.sh

NEW_VERSION=$1

if [ -z "$NEW_VERSION" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

echo "Updating version to $NEW_VERSION..."

# Update package.json files
npm version $NEW_VERSION --no-git-tag-version
cd frontend && npm version $NEW_VERSION --no-git-tag-version
cd ../backend && npm version $NEW_VERSION --no-git-tag-version

# Update environment example
sed -i "s/API_VERSION=.*/API_VERSION=$NEW_VERSION/" .env.example

# Update README badges
sed -i "s/version-.*-blue/version-$NEW_VERSION-blue/" README.md

# Update Docker labels
sed -i "s/LABEL version=.*/LABEL version=\"$NEW_VERSION\"/" Dockerfile

echo "✅ Version updated to $NEW_VERSION"
echo "Don't forget to:"
echo "  1. Update CHANGELOG.md"
echo "  2. Commit changes: git add . && git commit -m 'chore: bump version to $NEW_VERSION'"
echo "  3. Create tag: git tag -a v$NEW_VERSION -m 'Release $NEW_VERSION'"
echo "  4. Push: git push origin main --tags"
```

### Zero Version (0.x.y) Handling

During initial development, versions starting with `0.` follow different semver rules:

#### 0.x.y Version Semantics

```
0.1.0 → 0.2.0    # MINOR may include breaking changes
0.2.0 → 0.2.1    # PATCH for backward-compatible fixes
0.y.z → 1.0.0    # First stable release
```

#### Development Phase Guidelines

**0.1.x - Alpha Phase:**

- Rapid prototyping and experimentation
- API structure is highly unstable
- Breaking changes in MINOR versions are expected
- Focus on core functionality implementation

**0.2.x - Beta Phase:**

- Feature-complete for MVP
- API structure stabilizing
- Breaking changes still possible but documented
- User testing and feedback integration

**0.9.x - Release Candidate Phase:**

- Production-ready features
- Minimal breaking changes
- Documentation complete
- Performance optimization

**1.0.0 - Stable Release:**

- Public API stable
- Semantic versioning rules fully apply
- Backward compatibility guaranteed

#### 0.x.y Communication

```typescript
// Add development phase warnings
if (process.env.npm_package_version?.startsWith('0.')) {
  console.warn(
    '⚠️  This is a pre-1.0 version. APIs may change without notice. ' +
    'See VERSIONING.md for details.'
  );
}

// API responses during development
{
  "data": { /* response data */ },
  "meta": {
    "version": "0.8.2",
    "stability": "beta",
    "warning": "Pre-1.0 version: APIs subject to change"
  }
}
```

### Release Notes Template

````markdown
# Release Notes - v1.2.3

## 🚀 New Features (MINOR)

- Added budget management system with monthly/yearly views
- Implemented transaction categorization with custom categories
- Enhanced user profile settings with theme preferences

## 🐛 Bug Fixes (PATCH)

- Fixed transaction amount calculation precision issues
- Resolved authentication token expiration handling
- Corrected responsive design issues on mobile devices

## 💥 Breaking Changes (MAJOR)

- Removed legacy authentication endpoints (`/api/auth/legacy-login`)
- Updated user profile data structure (see migration guide)
- Changed database schema for improved performance

## 🔄 Database Migrations

Run the following commands to update your database:

```bash
cd backend && pnpm db:migrate
```
````

## 📦 Dependencies

- Updated React to v19.1.0 (security patches)
- Security patch for jsonwebtoken (CVE-2024-XXXX)
- Updated Tailwind CSS to v4.0 (new features)

## 🔧 Performance

- Improved dashboard load time by 40%
- Reduced bundle size by 15%
- Optimized database queries for transaction history

## 🛡️ Security

- Implemented rate limiting on authentication endpoints
- Enhanced input validation for financial data
- Updated dependency vulnerabilities

## 📖 Documentation

- Added API migration guide for v2 to v3
- Updated installation instructions
- Enhanced component documentation

## 👥 Contributors

Thanks to all contributors who made this release possible!

```

---

## Emergency Versioning Scenarios

### Critical Security Patches

For critical security vulnerabilities:

1. **Immediate PATCH release** with security fix
2. Skip normal testing cycles if necessary
3. Coordinate with deployment team for urgent rollout
4. Create detailed security advisory

### Hotfixes

For critical production bugs:

1. Create hotfix branch from latest release tag
2. Apply minimal fix with thorough testing
3. Release as PATCH version
4. Merge back to main branch

### Rollback Strategy

If a release causes issues:

1. **PATCH**: Can typically be rolled back with minimal impact
2. **MINOR**: May require careful rollback due to new database tables
3. **MAJOR**: Requires full rollback strategy including database restoration

---

## Conclusion

This versioning framework ensures that:

- **Developers** understand the impact of their changes
- **AI Agents** can make consistent versioning decisions
- **Users** know what to expect from each update
- **Operations** can plan deployments appropriately

When in doubt, err on the side of caution and choose a higher version type. It's better to over-communicate breaking changes than to surprise users with unexpected incompatibilities.

For questions or clarifications on this versioning framework, refer to the [semantic versioning specification](https://semver.org/) or consult with the development team.
```
