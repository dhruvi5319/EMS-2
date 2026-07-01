---
phase: 01-foundation
plan: "03"
subsystem: auth
tags: [jwt, bcrypt, rbac, sessions, express, knex, postgresql]

# Dependency graph
requires:
  - phase: 01-foundation-02
    provides: Database migrations (users, user_roles, sessions, login_attempts tables)
provides:
  - POST /api/auth/login — email+password login returning JWT token
  - POST /api/auth/logout — revoke session
  - GET /api/auth/me — current user with roles
  - requireAuth middleware — Bearer token → DB session validation
  - requireRole RBAC middleware — role-based access control
  - Seeded admin + 7 test role users
affects:
  - 02-application-shell
  - All subsequent phases requiring authenticated API access

# Tech tracking
tech-stack:
  added: [jsonwebtoken, bcryptjs (existing)]
  patterns:
    - Repository pattern for data access (auth.repository.ts)
    - Service layer for business logic (auth.service.ts)
    - Controller/router pattern for HTTP handlers (auth.controller.ts)
    - JWT wrapping session hash for stateless + revocable auth
    - Global requireAuth middleware in routes/index.ts

key-files:
  created:
    - backend/src/modules/auth/auth.repository.ts
    - backend/src/modules/auth/auth.service.ts
    - backend/src/modules/auth/auth.controller.ts
  modified:
    - backend/src/middleware/auth.ts
    - backend/src/middleware/rbac.ts
    - backend/src/routes/index.ts
    - backend/src/types/express.d.ts
    - backend/seeds/001_admin_user.ts

key-decisions:
  - "JWT token wraps session hash: stateless token + revocable DB session (best of both)"
  - "requireAuth exported as alias for authenticateSession: backward-compat for existing route files"
  - "Global requireAuth in routes/index.ts: cleaner than per-route middleware for 15+ route files"
  - "Seed updated in-place (seeds/001_admin_user.ts): matches knexfile configured directory"
  - "Login uses email not username: matches plan spec; both fields exist in DB"

patterns-established:
  - "Repository pattern: all DB queries in auth.repository.ts, never in service or controller"
  - "Service pattern: business logic in auth.service.ts, no HTTP concern"
  - "Global auth middleware: mount requireAuth once on apiRouter, exceptions mounted above it"

# Metrics
duration: 10min
completed: 2026-07-01
---

# Phase 1 Plan 03: Auth API + RBAC Middleware + Seed Summary

**JWT-based session-cookie-hybrid auth with email login, Bearer token extraction, account lockout (5 failures/15 min), requireRole RBAC middleware, and 8 seeded users covering all roles**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-07-01T15:20:00Z
- **Completed:** 2026-07-01T15:30:37Z
- **Tasks:** 3 tasks
- **Files modified:** 8 files

## Accomplishments

- Login endpoint returns JWT token containing session hash; session stored in DB for revocability
- Bearer token middleware decodes JWT → extracts session hash → validates against DB → attaches req.user
- Account lockout: 5 failed attempts in 15 min window locks account, recorded in login_attempts table
- requireRole RBAC factory: returns 401 if unauthenticated, 403 if role not in user.roles
- Global requireAuth applied to all /api/* except /api/health and /api/auth/*
- Seeded admin@ems.local (all 8 roles) + 7 single-role test users (al/em/an/qa/ir/pc/ro@ems.local)
- All 13 acceptance checks pass: login, me, lockout, logout, protected routes, RBAC

## Task Commits

Each task was committed atomically:

1. **Task 1+2: Auth service, repository, controller, Bearer middleware, global auth** - `b58028d` (feat)
2. **Task 3: Seed script with admin and per-role test users** - `fbd61a5` (feat)

_Note: Task 2 (RBAC middleware) was completed as part of Task 1's commit since requireAuth and requireRole were built together. The rbac.ts already existed and was correct._

## Files Created/Modified

- `backend/src/modules/auth/auth.repository.ts` — getUserByEmail, createSession, getSessionByHash, revokeSession, recordLoginAttempt, countRecentFailures, getUserRoles
- `backend/src/modules/auth/auth.service.ts` — login(email, password), logout(sessionHash), me(sessionHash)
- `backend/src/modules/auth/auth.controller.ts` — Express router: POST /login, POST /logout, GET /me
- `backend/src/middleware/auth.ts` — requireAuth (Bearer token → JWT verify → DB session lookup); authenticateSession alias preserved
- `backend/src/middleware/rbac.ts` — requireRole factory (already existed, verified correct)
- `backend/src/routes/index.ts` — Mounts authControllerRouter at /auth (public), then requireAuth globally, then all protected routes
- `backend/src/types/express.d.ts` — Added sessionHash?: string to Express.Request
- `backend/seeds/001_admin_user.ts` — Admin + 7 single-role test users, bcrypt cost 12, idempotent

## Decisions Made

- **JWT wraps session hash**: The JWT payload contains the session hash. The middleware verifies the JWT signature first (fast, no DB), then looks up the session hash in DB (revocability). This gives stateless token verification with revocation capability.
- **Global auth middleware**: Applied `requireAuth` once in `routes/index.ts` after the public auth routes, rather than in each of the 15+ individual route files. Cleaner and safer.
- **authenticateSession alias**: Existing route files all import `authenticateSession`. Rather than updating 15+ files, the updated middleware exports both `requireAuth` and `authenticateSession = requireAuth`. Both work identically.
- **Seed location**: The plan specified `src/db/seeds/` but knexfile.ts configures `./seeds`. Updated existing `seeds/001_admin_user.ts` to match the configured directory.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Existing auth used username-based login; plan requires email**
- **Found during:** Task 1
- **Issue:** Old auth.service.ts and routes/auth.ts looked up users by username. Plan requires `login(email, password)`.
- **Fix:** New auth.service.ts uses getUserByEmail(); auth.controller.ts accepts `email` in request body.
- **Files modified:** src/modules/auth/auth.service.ts, src/modules/auth/auth.controller.ts
- **Verification:** Login with email admin@ems.local succeeds in acceptance test
- **Committed in:** b58028d

**2. [Rule 2 - Missing Critical] Seed script missing 7 single-role test users**
- **Found during:** Task 3
- **Issue:** Existing seeds/001_admin_user.ts only created the admin user. Plan requires per-role test users for al/em/an/qa/ir/pc/ro.
- **Fix:** Updated seed to create all 8 users with correct roles.
- **Files modified:** backend/seeds/001_admin_user.ts
- **Verification:** All 8 users seeded and can log in; idempotency verified by double-run.
- **Committed in:** fbd61a5

**3. [Rule 3 - Blocking] Seed directory path in plan differs from knexfile configuration**
- **Found during:** Task 3
- **Issue:** Plan says `src/db/seeds/001_admin.ts`; knexfile.ts configures `./seeds` directory.
- **Fix:** Updated existing `seeds/001_admin_user.ts` in the configured location rather than creating a mismatched file.
- **Files modified:** backend/seeds/001_admin_user.ts
- **Verification:** `knex seed:run` executes successfully
- **Committed in:** fbd61a5

---

**Total deviations:** 3 auto-fixed (1 bug, 1 missing critical, 1 blocking)
**Impact on plan:** All auto-fixes essential. No scope creep. Full acceptance criteria met.

## Issues Encountered

None beyond the deviations above, which were all resolved automatically.

## User Setup Required

None - no external service configuration required. Database is the platform-provided sidecar PostgreSQL (DB_CONTRACT=native-sidecar).

## Next Phase Readiness

- Auth foundation complete: login/logout/me endpoints working with Bearer token
- All seed users seeded and can authenticate
- requireAuth + requireRole middleware ready for all subsequent API routes
- Ready for 01-04-PLAN.md

---
*Phase: 01-foundation*
*Completed: 2026-07-01*

## Self-Check: PASSED

All created files verified to exist on disk. All task commits (b58028d, fbd61a5) verified present in git history. 13/13 acceptance tests passed in live functional test against real PostgreSQL sidecar.
