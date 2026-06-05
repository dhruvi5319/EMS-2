---
phase: 01-foundation
plan: "03"
subsystem: auth
tags: [bcryptjs, express, session-cookie, rbac, knex, middleware, typescript]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "users/user_roles/sessions tables (001_auth_tables migration), db singleton, Express app scaffold"
provides:
  - "authenticateSession middleware: reads ems_session httpOnly cookie, validates session_hash in DB, populates req.user"
  - "requireRole(...roles) factory middleware: returns 403 if req.user.roles lacks required roles"
  - "POST /api/auth/login: bcryptjs verify, account lockout (5 attempts/15min), 200|400|401|423"
  - "POST /api/auth/logout: deletes session row in DB, clears cookie"
  - "GET /api/auth/me: returns authenticated user object"
  - "GET /health: public endpoint, no auth required"
  - "admin user seed (username: admin, password: Admin1234!, 8 roles: AL/EM/AN/QA/IR/PC/RO/Admin)"
  - "Smoke test script: 7 assertions validating full auth flow end-to-end"
affects: ["01-04", "02-01", "03-01", "04-01", "05-01", "06-01"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Session-cookie hybrid: crypto.randomBytes(32) session_hash stored in sessions table for revocability"
    - "Account lockout: failed_attempts counter with locked_until timestamp, MAX=5 attempts, 15min lockout"
    - "Generic error responses: 401 for both wrong username AND wrong password — no user enumeration"
    - "Middleware factory pattern: requireRole(...roles) returns RequestHandler — composable RBAC"
    - "Idempotent seeds: check-before-insert pattern with username uniqueness check"

key-files:
  created:
    - backend/src/types/express.d.ts
    - backend/src/services/auth.service.ts
    - backend/src/middleware/auth.ts
    - backend/src/middleware/rbac.ts
    - backend/src/routes/auth.ts
    - backend/src/routes/index.ts
    - backend/seeds/001_admin_user.ts
    - backend/src/scripts/smoke-test.ts
  modified:
    - backend/src/index.ts

key-decisions:
  - "bcryptjs (not native bcrypt) — avoids Alpine Linux native module compilation issues in Docker"
  - "session_hash stored in DB (not stateless JWT) — enables per-session revocation via DELETE from sessions table"
  - "Generic 401 for both bad username and bad password — prevents user enumeration attacks"
  - "Account lockout at 5 failed attempts for 15 minutes — returns 423 with ACCOUNT_LOCKED code"
  - "requireRole as factory function returning RequestHandler — composable, works with any Express route"

patterns-established:
  - "Auth middleware: authenticateSession reads cookie → validates against DB → populates req.user → 401 if invalid"
  - "RBAC pattern: requireRole('Admin', 'AL') applied per-route after authenticateSession"
  - "apiRouter in routes/index.ts: /auth public, future routes registered with authenticateSession"

# Metrics
duration: 2min
completed: 2026-06-05
---

# Phase 1 Plan 03: Auth Service, RBAC Middleware, and Seed Summary

**Session-cookie hybrid auth with bcryptjs, DB-stored session hash for revocability, 5-attempt account lockout, requireRole RBAC middleware, admin seed with all 8 roles, and 7-assertion smoke test**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-05T15:07:49Z
- **Completed:** 2026-06-05T15:10:36Z
- **Tasks:** 3 completed
- **Files modified:** 9 (8 created, 1 modified)

## Accomplishments

- Full auth stack: login validates bcrypt hash, generates 32-byte session_hash stored in sessions table with 7-day expiry, sets `ems_session` httpOnly cookie
- Account lockout: `failed_attempts` incremented on each bad password; 5th failure sets `locked_until = now() + 15min`; locked accounts return 423 with `ACCOUNT_LOCKED` code
- Session revocation: `POST /api/auth/logout` deletes session row from DB — cookie can't be reused
- RBAC middleware: `requireRole(...roles)` factory composable with any Express route, returns 403 with required roles listed
- Admin seed: idempotent `seeds/001_admin_user.ts` creates `admin` user with all 8 roles (AL, EM, AN, QA, IR, PC, RO, Admin) using 12-round bcrypt
- Smoke test: `npx tsx src/scripts/smoke-test.ts` validates 7 assertions against running backend

## Task Commits

Each task was committed atomically:

1. **Task 1: Auth service, middleware, and Express route registration** - `b51f858` (feat)
2. **Task 2: Seed script — admin user with all roles** - `8751b2f` (feat)
3. **Task 3: Integration smoke-test script** - `cf883f7` (feat)

**Plan metadata:** (pending — see final commit)

## Files Created/Modified

- `backend/src/types/express.d.ts` — Extends Express Request with `user?: { id, username, email, display_name, roles }`
- `backend/src/services/auth.service.ts` — `login()`, `logout()`, `validateSession()` using bcryptjs + crypto session hash
- `backend/src/middleware/auth.ts` — `authenticateSession` reads `ems_session` cookie, validates in DB, populates req.user
- `backend/src/middleware/rbac.ts` — `requireRole(...roles)` factory returning 403 middleware
- `backend/src/routes/auth.ts` — `authRouter` with POST /login (200|400|401|423), POST /logout, GET /me
- `backend/src/routes/index.ts` — `apiRouter` with /auth public, extensible structure for Phase 2+ routes
- `backend/seeds/001_admin_user.ts` — Idempotent admin user seed with 8 roles, 12-round bcrypt
- `backend/src/scripts/smoke-test.ts` — 7-assertion CLI smoke test for full auth flow
- `backend/src/index.ts` — Updated to import and register `apiRouter` on `/api`

## Decisions Made

- **bcryptjs over bcrypt**: bcryptjs is pure JavaScript — avoids native module compilation failures on Alpine Linux Docker images used by the backend service
- **DB session hash over stateless JWT**: session_hash in sessions table enables revocation (DELETE row on logout) — stateless JWTs cannot be invalidated before expiry
- **Generic 401 for both bad username and bad password**: prevents user enumeration — attacker cannot distinguish "user not found" from "wrong password"
- **423 status for locked accounts**: RFC 4918 "Locked" is semantically correct for temporary account lockout — includes `code: ACCOUNT_LOCKED` for frontend handling
- **requireRole as factory**: `requireRole('Admin', 'AL')` returns a RequestHandler — can be composed in any Express route definition without ceremony

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The smoke test script (`backend/src/scripts/smoke-test.ts`) requires a running backend with seeded data to execute. The script was written and verified syntactically. Runtime execution is deferred to the verifier phase when Docker Compose is available.

## User Setup Required

None - no external service configuration required. To test the full auth stack:

```bash
docker compose up -d
cd backend && DATABASE_URL=postgresql://ems:ems_password@localhost:5432/ems npm run migrate && npm run seed
npx tsx src/scripts/smoke-test.ts
```

## Next Phase Readiness

- Auth infrastructure complete; Plan 01-04 (React login UI) can now wire to `POST /api/auth/login`
- `authenticateSession` and `requireRole` ready for Phase 2+ route registration in `backend/src/routes/index.ts`
- All must_haves from PRD F0 auth infrastructure implemented: login, lockout, session revocation, RBAC middleware
- Admin user seed enables immediate development login after `docker compose up && npm run migrate && npm run seed`

## Self-Check: PASSED

All 9 key files verified on disk. All 3 task commits (b51f858, 8751b2f, cf883f7) confirmed in git log.

---
*Phase: 01-foundation*
*Completed: 2026-06-05*
