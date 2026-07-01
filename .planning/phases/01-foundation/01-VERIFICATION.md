---
phase: 01-foundation
verified: 2026-07-01T15:37:32Z
status: gaps_found
score: 4/5 must-haves verified
gaps:
  - truth: "A user can log in with username/password and receive a session token; the system locks accounts after 5 failed attempts"
    status: failed
    reason: "Frontend login form sends { username, password } but backend POST /api/auth/login expects { email, password }. Every login attempt from the UI returns HTTP 400 'Email and password are required'. Additionally, the JWT token returned in the login response is never stored — AuthContext only calls setUser() and discards the token, so even if the field mismatch were fixed, subsequent authenticated API calls (which require Authorization: Bearer <token>) would all receive 401."
    artifacts:
      - path: "frontend/src/context/AuthContext.tsx"
        issue: "login() sends { username, password } instead of { email, password }; ignores token in response (never stores it)"
      - path: "frontend/src/components/auth/LoginCard.tsx"
        issue: "Form state is 'username'; calls login(username, password); labelled 'Username' — mismatches backend email field"
      - path: "frontend/src/lib/api.ts"
        issue: "No Authorization header injection; uses credentials:include (cookie-based) but backend uses Bearer tokens not cookies"
    missing:
      - "Change AuthContext.login() to send { email, password } — or change backend to accept { username } and look up by username"
      - "Store JWT token from login response (localStorage or module-level var) and inject as Authorization: Bearer <token> on all api.ts requests"
      - "Update LoginCard field label, state variable, and validation from 'username' to 'email' if taking the email approach"
---

# Phase 1: Foundation Verification Report

**Phase Goal:** The project runs locally, the database schema exists, all core data objects are seeded, and the API boots with authentication working  
**Verified:** 2026-07-01T15:37:32Z  
**Status:** gaps_found  
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `docker-compose up` starts frontend, backend, database, and file storage without errors | ✓ VERIFIED | docker-compose.yml has 5 services (postgres, minio, migrate, backend, frontend). Backend health returns `{"status":"ok"}`. migrate is a one-shot runner (restart: no). |
| 2 | All 20 database tables are created by migrations with correct columns, indexes, and constraints | ✓ VERIFIED | 23 tables created across 10 migrations (22 from TechArch DDL + independence_affirmations). 13 explicit indexes. CHECK constraints on all enum columns. Exceeds the "20" in SC (TechArch entity count says 20 but DDL defines 22). |
| 3 | A user can log in with username/password and receive a session token; the system locks accounts after 5 failed attempts | ✗ FAILED | **Backend auth works** (live-tested: `curl -d '{"email":"admin@ems.local","password":"Admin1234!"}' → JWT token returned; 423 on lockout after 5 failures). **Frontend login is broken**: LoginCard sends `{ username, password }` but backend requires `{ email, password }` → 400 error on every UI login. Token from response is also not stored anywhere. |
| 4 | All ten core data objects (Request, Engagement, Team Assignment, Planning Record, Objective, Evidence Item, Finding, Draft Product, Gate Decision, Audit Event) are accessible via the database and their fields match the PRD data model | ✓ VERIFIED | All 10 tables present in 002_core_tables.ts with substantive column definitions matching TechArch DDL. Live API confirms: GET /api/requests → 200, GET /api/engagements → 200. |
| 5 | The backend API boots, health check passes, and RBAC middleware is active on all routes | ✓ VERIFIED | `GET /api/health → {"status":"ok"}`. routes/index.ts mounts `requireAuth` globally after auth routes. Live test: GET /api/engagements without token → 401; with token → 200. GET /api/search without token → 401. |

**Score: 4/5 truths verified**

---

## Required Artifacts

| Artifact | Description | Exists | Substantive | Wired | Status |
|----------|-------------|--------|-------------|-------|--------|
| `docker-compose.yml` | 4-service stack (postgres, minio, backend, frontend + migrate) | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/migrations/001_auth_tables.ts` | users, user_roles, sessions, login_attempts tables | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/migrations/002_core_tables.ts` | 18 core domain tables with constraints | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/modules/auth/auth.service.ts` | login/logout/me with account lockout at 5 failures | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/modules/auth/auth.repository.ts` | DB queries for auth operations | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/modules/auth/auth.controller.ts` | POST /login, POST /logout, GET /me routes | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/middleware/auth.ts` | requireAuth Bearer token middleware | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/middleware/rbac.ts` | requireRole RBAC factory | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/routes/index.ts` | Global requireAuth mount after public /auth routes | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/seeds/001_admin_user.ts` | 8 seeded users (admin + 7 role-specific) | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `backend/src/app.ts` | Express app with health route, CORS | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `frontend/src/context/AuthContext.tsx` | Session restore via /api/auth/me, login/logout | ✓ | ✓ (partial) | ✗ | ✗ STUB (login broken) |
| `frontend/src/components/auth/LoginCard.tsx` | Login form with email/password fields | ✓ | ✓ (form exists) | ✗ | ✗ WIRING BROKEN |
| `frontend/src/lib/api.ts` | API client with token injection | ✓ | ✗ | ✗ | ✗ STUB (no token injection) |
| `frontend/src/auth/ProtectedRoute.tsx` | Route guard for authenticated routes | ✓ | ✓ | ✓ | ✓ VERIFIED |
| `frontend/src/App.tsx` | Full routing with AuthProvider and ProtectedRoute | ✓ | ✓ | ✓ | ✓ VERIFIED |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| LoginCard.tsx | `/api/auth/login` | `AuthContext.login()` → `api.post()` | ✗ NOT_WIRED | Sends `{ username }` but backend requires `{ email }` → HTTP 400 |
| AuthContext.tsx | Bearer token | `api.ts` Authorization header | ✗ NOT_WIRED | Token from login response is never stored; `api.ts` has no Authorization header injection |
| `routes/index.ts` | `requireAuth` | `apiRouter.use(requireAuth)` | ✓ WIRED | All routes below auth mount are protected; live-tested 401 on unauthenticated requests |
| `auth.service.ts` | `login_attempts` table | `recordLoginAttempt()` + `countRecentFailures()` | ✓ WIRED | Lockout after 5 failures live-tested (returns 423) |
| `migrate` service | `knex migrate:latest && knex seed:run` | docker-compose command | ✓ WIRED | Both run sequentially; backend depends on `service_completed_successfully` |

---

## Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| 4-service docker-compose stack boots | ✓ SATISFIED | — |
| ≥20 database tables with columns/indexes/constraints | ✓ SATISFIED | — |
| Account lockout after 5 failed attempts (backend) | ✓ SATISFIED | — |
| Login produces session token (backend) | ✓ SATISFIED | — |
| Login works end-to-end from UI | ✗ BLOCKED | username vs email field mismatch; no token storage |
| All 10 core data objects in DB | ✓ SATISFIED | — |
| Backend health endpoint | ✓ SATISFIED | — |
| RBAC middleware on all routes | ✓ SATISFIED | — |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `frontend/src/context/AuthContext.tsx` | 33 | `api.post('/api/auth/login', { username, password })` — sends `username` not `email` | 🛑 Blocker | Every login attempt from UI fails with HTTP 400 |
| `frontend/src/context/AuthContext.tsx` | 37 | `setUser(res.data.user)` — token from response never stored | 🛑 Blocker | Even if field fixed, auth token lost; all subsequent API calls would get 401 |
| `frontend/src/lib/api.ts` | 1–30 | No `Authorization` header injection in `request()` | 🛑 Blocker | API calls from frontend cannot authenticate with backend's Bearer token scheme |
| `frontend/src/components/auth/LoginCard.tsx` | 12 | `const [username, setUsername] = useState('')` + label "Username" | ⚠️ Warning | UX expects username but backend requires email; user would be confused even if field name were fixed in the API call |

---

## Human Verification Required

### 1. docker-compose `up` from cold start

**Test:** On a clean machine with no running containers, run `docker compose up` from project root  
**Expected:** All 5 services start within ~60s; backend health responds; no exit code 1 on any service  
**Why human:** Cannot run docker in this environment; live backend is confirmed running but cold-start behavior unverified

### 2. MinIO storage service health

**Test:** After `docker compose up`, verify MinIO console at `http://localhost:9001` is accessible  
**Expected:** MinIO login page appears (minioadmin/minioadmin credentials)  
**Why human:** Cannot verify network port exposure without docker

---

## Gaps Summary

**1 gap blocking SC3 (login end-to-end)**

The backend authentication system is fully implemented and live-tested correctly:
- `POST /api/auth/login` with `{ email, password }` returns a JWT token ✓
- Account lockout after 5 failures returns HTTP 423 ✓  
- Bearer token middleware validates sessions from DB ✓
- RBAC requireRole middleware enforces roles ✓

However, the **frontend login is broken by two wiring failures**:

**Failure A — Field mismatch:** The login form (`LoginCard.tsx`) collects a `username` field and `AuthContext.login()` sends `{ username, password }` to the backend. The backend explicitly destructures `{ email, password }` from `req.body` and returns 400 if `email` is missing. Every UI login attempt fails with "Email and password are required."

**Failure B — Token not stored:** `AuthContext.login()` receives `{ token, user }` from the backend but only calls `setUser(res.data.user)` — the JWT token is discarded. The `api.ts` fetch wrapper has no mechanism to inject an `Authorization: Bearer <token>` header. The axios `client.ts` also has no token injection. Consequence: even if Failure A were fixed, the session would not persist across page loads and all protected API calls from the frontend would receive 401.

These two gaps are likely from the scaffolded frontend code predating the auth design that settled on JWT Bearer tokens (the pre-existing code assumed cookie-based sessions per the axios `credentials: 'include'` pattern). The 01-03 plan created the JWT backend but did not update the pre-existing frontend auth code to match.

---

_Verified: 2026-07-01T15:37:32Z_  
_Verifier: Claude (pivota_spec-verifier)_
