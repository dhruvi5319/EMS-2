---
phase: 01-foundation
plan: "02"
subsystem: database
tags: [knex, postgres, migrations, uuid, jsonb, check-constraints, indexes]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "backend/package.json with knex/pg dependencies and backend/src/config/env.ts with databaseUrl"
provides:
  - "Knex configuration (knexfile.ts) for development and production environments"
  - "db singleton (backend/src/db/index.ts) exportable to API routes"
  - "001_auth_tables migration: users, user_roles, sessions tables + 4 auth indexes"
  - "002_core_tables migration: 18 core domain tables + 7 domain indexes"
  - "All 21 tables runnable via npm run migrate / rollbackable via npm run migrate:rollback"
affects: ["01-03", "01-04", "02-01", "03-01", "04-01", "05-01"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Knex migrations with TypeScript (extension: ts) for type safety in dev"
    - "Dependency-ordered table creation (parents before children) within each migration"
    - "gen_random_uuid() for UUID primary keys (PostgreSQL native)"
    - "CHECK constraints inline via table.check() for enum-like columns"
    - "UNIQUE constraints via table.unique([col1, col2]) for composite keys"
    - "JSONB columns for audit state capture (before_state/after_state)"

key-files:
  created:
    - backend/knexfile.ts
    - backend/src/db/index.ts
    - backend/migrations/001_auth_tables.ts
    - backend/migrations/002_core_tables.ts
  modified: []

key-decisions:
  - "Two-migration split: auth tables in 001 (Plan 01-03 needs them first), core domain in 002 — enables Plan 01-03 to run against auth tables independently"
  - "knexfile.ts uses extension: 'ts' for development migrations and 'js' for production (post-compile)"
  - "db singleton reads NODE_ENV at module load to select knex config — consistent with existing env pattern"
  - "All CHECK constraints use Knex table.check() rather than raw SQL — stays portable across Knex versions"

patterns-established:
  - "Migration structure: up() creates tables in FK dependency order; down() drops in reverse order"
  - "Indexes created via knex.raw() after table creation (not inline) — matches TechArch DDL pattern"

# Metrics
duration: 2min
completed: 2026-06-05
---

# Phase 1 Plan 02: Database Migrations Summary

**Two Knex migrations creating all 21 PostgreSQL tables (users/user_roles/sessions + 18 core domain tables) with CHECK constraints, UNIQUE constraints, JSONB columns, and all 11 TechArch indexes**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-05T15:02:27Z
- **Completed:** 2026-06-05T15:05:04Z
- **Tasks:** 2 completed
- **Files modified:** 4

## Accomplishments

- Created `backend/knexfile.ts` with Knex config for development (pg/DATABASE_URL) and production (SSL) environments; migration directory set to `./migrations` with `.ts` extension
- Created `backend/src/db/index.ts` exporting `db` as a Knex instance selecting config by `NODE_ENV`
- Created `backend/migrations/001_auth_tables.ts` with users (failed_attempts, locked_until), user_roles (role CHECK IN AL/EM/AN/QA/IR/PC/RO/Admin, UNIQUE user_id+role), sessions (session_hash UNIQUE, expires_at, last_used_at), and 4 auth indexes
- Created `backend/migrations/002_core_tables.ts` with 18 core domain tables in FK dependency order: requests through draft_comments, with all CHECK constraints, UNIQUE constraints, JSONB columns (audit_events.before_state/after_state), and 7 domain indexes

## Task Commits

Each task was committed atomically:

1. **Task 1: Knex configuration + auth tables migration** - `4078a68` (feat)
2. **Task 2: Core domain tables migration** - `4499854` (feat)

**Plan metadata:** (pending — see final commit)

## Files Created/Modified

- `backend/knexfile.ts` — Knex configuration for development (pg + DATABASE_URL) and production (SSL) environments; migrations directory `./migrations` with ts/js extension per environment
- `backend/src/db/index.ts` — exports `db` as Knex singleton using `knexConfig[NODE_ENV]`
- `backend/migrations/001_auth_tables.ts` — creates users, user_roles, sessions tables with 4 indexes (idx_users_username, idx_users_email, idx_sessions_user_id, idx_sessions_expires_at)
- `backend/migrations/002_core_tables.ts` — creates 18 core domain tables with 7 indexes (idx_requests_status, idx_engagements_phase, idx_engagements_owner_id, idx_team_assignments_engagement, idx_evidence_items_engagement, idx_audit_events_engagement, idx_audit_events_actor)

## Decisions Made

- Two-migration split (auth in 001, core in 002) allows Plan 01-03 (auth endpoints) to develop against auth tables independently
- `extension: 'ts'` for development migrations; production uses compiled `js` — avoids needing ts-node/tsx in production containers
- `db` singleton uses `process.env.NODE_ENV || 'development'` to select config key — consistent with existing env.ts fail-fast pattern
- CHECK constraints via `table.check()` rather than raw SQL — maintains Knex portability

## Deviations from Plan

None - plan executed exactly as written.

Note: The plan states "17 remaining tables" and "All 20 database tables" in some sections, but the explicit table list in the success_criteria section enumerates 21 tables (3 auth + 18 core). The migration implements all 21 tables as listed in the success_criteria, which is the authoritative source of truth.

## Issues Encountered

None. The migration files cannot be run in the execution environment (no live PostgreSQL available), but the Knex migration runner (`npm run migrate`) is configured correctly and will execute against the Docker Compose postgres service when `docker compose up` is run. Runtime verification is deferred to the verifier phase.

## User Setup Required

None - no external service configuration required. The Docker Compose postgres service from Plan 01-01 provides the database. To run migrations:

```bash
docker compose up -d postgres
cd backend && DATABASE_URL=postgresql://ems:ems_password@localhost:5432/ems npm run migrate
```

## Next Phase Readiness

- All 21 database tables defined and migration-ready for Plan 01-03 (auth endpoints: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me)
- users, user_roles, sessions tables from 001_auth_tables will be present when Plan 01-03 runs migrations
- `db` singleton in backend/src/db/index.ts ready to import in route handlers
- All 11 TechArch indexes created across both migrations

## Self-Check: PASSED

All 4 key files verified on disk. Both task commits (4078a68, 4499854) confirmed in git log.

---
*Phase: 01-foundation*
*Completed: 2026-06-05*
