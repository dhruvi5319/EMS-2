---
phase: 01-foundation
plan: "02"
subsystem: database
tags: [knex, postgres, migrations, schema, sql]

requires:
  - phase: 01-foundation plan 01
    provides: docker-compose postgres service, knexfile.ts configured, migration runner wired

provides:
  - All 23 application tables created via 10 Knex migrations
  - Full indexes and CHECK constraints applied per TechArch Section 3.2
  - login_attempts table added (was missing from pre-seeded migration 001)
  - Idempotent migration runner verified (knex migrate:latest safe to re-run)
  - Admin user seed verified idempotent

affects:
  - 01-03-PLAN
  - 01-04-PLAN
  - All subsequent phases (all depend on this schema)

tech-stack:
  added: []
  patterns:
    - Knex numbered migration files (001_auth_tables, 002_core_tables, etc.) with up/down
    - IF NOT EXISTS guards in additive migrations (007, 009, 010) for idempotency
    - docker compose run --rm migrate as one-shot migration executor

key-files:
  created: []
  modified:
    - backend/migrations/001_auth_tables.ts (added login_attempts table + 2 indexes)

key-decisions:
  - "login_attempts table added to migration 001 (was missing from scaffold; TechArch §Auth requires it)"
  - "Existing schema evolution (username, session_hash, failed_attempts, locked_until) retained to match app code"
  - "independence_status column NOT added to planning_records (app uses independence_affirmations table instead — migration 007)"

patterns-established:
  - "Pattern 1: Numbered Knex migration files with up()/down() — idempotent via knex migrate:latest"
  - "Pattern 2: docker compose run --rm migrate — one-shot migration executor with postgres healthcheck"

duration: 3min
completed: 2026-07-01
---

# Phase 1 Plan 02: Database Migrations Summary

**All 23 EMS application tables created via 10 Knex migrations with indexes, CHECK constraints, and idempotent seed; login_attempts table gap filled**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-01T14:23:43Z
- **Completed:** 2026-07-01T14:27:02Z
- **Tasks:** 2 (+ migration verification)
- **Files modified:** 1

## Accomplishments

- Verified and extended `001_auth_tables.ts` to include all 4 TechArch §Auth tables: `users`, `user_roles`, `sessions`, `login_attempts`
- Verified `002_core_tables.ts` covers all 18 core domain tables: requests, engagements, team_assignments, milestones, planning_records, objectives, planning_revisions, evidence_items, evidence_files, objective_evidence_links, findings, finding_evidence_links, draft_products, draft_statements, statement_evidence_links, draft_comments, gate_decisions, audit_events
- All 10 migration files (001–010) applied successfully via `docker compose run --rm migrate`
- Migration idempotency verified: second run shows "Already up to date" and seed skips existing data
- 54 indexes present in final database schema

## Task Commits

Each task was committed atomically:

1. **Task 1: Auth tables migration** - `394d4dd` (feat) — added `login_attempts` table to `001_auth_tables.ts`
2. **Task 2: Core domain tables** - pre-existing in scaffold (no new commit needed)

## Files Created/Modified

- `backend/migrations/001_auth_tables.ts` — Added `login_attempts` table (id, email, succeeded, ip_address, attempted_at) with 2 indexes

## Tables Created (all 23 application tables)

| Table | Migration | Notes |
|-------|-----------|-------|
| users | 001 | Auth — username/password with lockout fields |
| user_roles | 001 | Auth — role assignments with CHECK constraint |
| sessions | 001 | Auth — session tracking with session_hash |
| login_attempts | 001 | Auth — audit log for login events (added in this plan) |
| requests | 002 | Core — intake requests |
| engagements | 002 | Core — engagement lifecycle |
| team_assignments | 002 | Core — team role assignments |
| milestones | 002 | Core — per-engagement milestone dates |
| planning_records | 002 | Core — engagement planning records |
| objectives | 002 | Core — planning objectives with soft delete |
| planning_revisions | 002 | Core — planning revision history |
| evidence_items | 002 | Core — evidence with soft delete |
| evidence_files | 002 | Core — file attachments |
| objective_evidence_links | 002 | Core — many-to-many |
| findings | 002 | Core — findings with soft delete |
| finding_evidence_links | 002 | Core — many-to-many |
| draft_products | 002 | Core — draft reports |
| draft_statements | 002 | Core — individual statements |
| statement_evidence_links | 002 | Core — many-to-many |
| draft_comments | 002 | Core — append-only comments |
| gate_decisions | 002 | Core — gate approval records |
| audit_events | 002 | Core — audit log |
| independence_affirmations | 007 | Added — team member affirmations |

## Decisions Made

- Added `login_attempts` table to `001_auth_tables.ts`: was absent from the pre-seeded scaffold but required by TechArch Section 3.2 §Auth and the plan
- Retained app-specific schema evolutions (`username`, `session_hash`, `failed_attempts`, `locked_until`) that differ from TechArch DDL — these serve the actual auth service code and cannot be reverted without breaking the app
- Did not add `independence_status` column to `planning_records` — the app uses the separate `independence_affirmations` table (migration 007) instead, which is a correct architectural evolution

## Deviations from Plan

### Context

The plan's migration files (001, 002) were pre-seeded in the project scaffold from prior work. The files existed at `backend/migrations/` (not `backend/src/db/migrations/` as the plan described). The substance of the plan — creating all required tables — was mostly done; only `login_attempts` was missing.

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added missing login_attempts table**
- **Found during:** Task 1 analysis
- **Issue:** `001_auth_tables.ts` was missing the `login_attempts` table required by TechArch Section 3.2 §Auth and Plan 01-02 Task 1
- **Fix:** Added `login_attempts` table with `id`, `email`, `succeeded`, `ip_address`, `attempted_at` columns; added `idx_login_attempts_email` and `idx_login_attempts_attempted_at` indexes; added drop to `down()` function
- **Files modified:** `backend/migrations/001_auth_tables.ts`
- **Verification:** Migration ran successfully; `\dt` shows `login_attempts` table; `\di` shows both indexes
- **Committed in:** `394d4dd`

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Minor gap-fill. The auth schema now fully matches TechArch §Auth. No scope creep.

## Issues Encountered

None — migrations ran cleanly on first attempt. Docker image build completed without errors.

## User Setup Required

None — all configuration is in `docker-compose.yml` and `.env`. Run `docker compose run --rm migrate` to apply migrations to a fresh database.

## Next Phase Readiness

- All 23 application tables exist with correct columns, types, indexes, and CHECK constraints
- Migration runner is idempotent — safe to re-run at any time
- Admin user seeded: `admin` / `Admin1234!` (all 8 roles)
- Database ready for Plan 01-03 (API routes and business logic)

## Self-Check: PASSED

- `backend/migrations/001_auth_tables.ts` — verified present and includes login_attempts
- `backend/migrations/002_core_tables.ts` — verified present with all 18 core tables
- Task commit `394d4dd` — verified in `git log --oneline`
- All 23 application tables verified via `docker compose exec postgres psql \dt`
- 54 indexes verified via `docker compose exec postgres psql \di`
- Idempotency verified: second migration run shows "Already up to date"

---
*Phase: 01-foundation*
*Completed: 2026-07-01*
