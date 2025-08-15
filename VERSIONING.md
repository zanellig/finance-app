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
   ```

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

- [ ] All existing API endpoints return expected responses
- [ ] Database migrations run successfully
- [ ] Backward compatibility tests pass (if applicable)
- [ ] Integration tests cover breaking changes
- [ ] Update documentation and migration guides

**MINOR Version Requirements:**

- [ ] New features work as expected
- [ ] Existing functionality remains unchanged
- [ ] New API endpoints have proper validation
- [ ] UI components render correctly across browsers
- [ ] Performance impact is acceptable

**PATCH Version Requirements:**

- [ ] Bug fix resolves the reported issue
- [ ] No regressions introduced
- [ ] Affected functionality tested
- [ ] Security fixes verified

### Release Notes Template

````markdown
# Release Notes - v1.2.3

## 🚀 New Features (MINOR)

- Added budget management system
- Implemented transaction categorization
- Enhanced user profile settings

## 🐛 Bug Fixes (PATCH)

- Fixed transaction amount calculation precision
- Resolved authentication token expiration handling
- Corrected responsive design issues on mobile

## 💥 Breaking Changes (MAJOR)

- Removed legacy authentication endpoints
- Updated user profile data structure
- Changed database schema for improved performance

## 🔄 Database Migrations

Run the following commands to update your database:

```bash
cd backend && pnpm db:migrate
```
````

## 📦 Dependencies

- Updated React to v19.1.0
- Security patch for jsonwebtoken
- Updated Tailwind CSS to v4.0

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
