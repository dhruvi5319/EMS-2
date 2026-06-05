---
phase: 04-engagement-setup-and-gate-p2
plan: "01"
subsystem: api
tags: [engagements, rest-api, rbac, knex, typescript, gate-decisions]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: auth/session middleware, RBAC middleware (requireRole), db (knex), user_roles table
  - phase: 03-intake-and-gate-a1
    provides: gate_decisions table with A1 records, engagements table created on approval
provides:
  - listEngagements (paginated, role-scoped)
  - getEngagement (with gate_decisions[] and blockers[])
  - updateEngagement (title/risk_level/owner_id/portfolio, validated)
  - GET /api/engagements
  - GET /api/engagements/:id
  - PATCH /api/engagements/:id (EM/AD only)
affects: [04-04, 04-05, 04-06, frontend engagement shell UI plans]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Service layer: toRecord() + toGateDecisionRecord() helpers for safe DB row conversion"
    - "Role scoping: non-AD users restricted via owner_id OR team_assignments subquery"
    - "Error objects with status property: Object.assign(new Error(), { status: 4xx }) for HTTP-aware throws"

key-files:
  created:
    - backend/src/services/engagements.service.ts
    - backend/src/routes/engagements.ts
  modified:
    - backend/src/routes/index.ts

key-decisions:
  - "gate_decisions queried by engagement_id only (not request_id) — A1 decision stored with engagement_id after approval, so all gate types (A1/P2/P3/P4) retrieved via single WHERE engagement_id = :id query"
  - "GateDecisionRecord.gate_name maps from DB gate_type column; risk_level parsed from comment field (format: risk_level:low)"
  - "engagementsRouter registered at /engagements alongside existing auditRouter — Express mounts both, routes don't conflict (audit handles /:id/audit, engagements handles /, /:id GET/PATCH)"
  - "owner_id validation checks user_roles table for EM role — not just user existence"
  - "EngagementRecord does not include engagement_number field (not in DB schema — job_code is the display identifier)"

patterns-established:
  - "Engagement service pattern: filters typed interface with optional userId+isAdmin for role scoping"
  - "Knex where() function with explicit this type annotation to satisfy TypeScript strict mode"

# Metrics
duration: 2min
completed: 2026-06-05
---

# Phase 4 Plan 01: Engagement Backend API Summary

**Engagement list/detail/update REST API with role-scoped filtering, gate_decisions[] aggregation, and no_owner blocker computation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-05T21:53:33Z
- **Completed:** 2026-06-05T21:55:38Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- `listEngagements` with phase/status/owner_id filters, pagination (limit/offset max 100), role-scoped (non-AD users restricted to engagements they own or are assigned to)
- `getEngagement` returns engagement with all gate_decisions[] (A1/P2/P3/P4 queried by engagement_id) and blockers[] (no_owner blocker when owner_id is null)
- `updateEngagement` validates title ≤500 chars, owner_id requires EM role in user_roles, risk_level must be low/medium/high
- `engagementsRouter` registered under `/api/engagements` with proper RBAC (PATCH requires EM/AD)

## Task Commits

Each task was committed atomically:

1. **Task 1: Engagement service** - `b7f65c3` (feat)
2. **Task 2: Engagement router + routes/index.ts registration** - `0a904b5` (feat)

## Files Created/Modified
- `backend/src/services/engagements.service.ts` — listEngagements, getEngagement, updateEngagement with types and helpers
- `backend/src/routes/engagements.ts` — Express router with GET /, GET /:id, PATCH /:id
- `backend/src/routes/index.ts` — Added engagementsRouter import and registration at /api/engagements

## Decisions Made
- **gate_decisions queried by engagement_id only**: The DB schema stores A1 gate_decisions with `engagement_id` (NOT NULL constraint), so all gate types are retrieved by a single `WHERE engagement_id = :id` query. The plan mentioned A1 from `request_id` but the actual schema and gate.service.ts (Phase 3) stores A1 with engagement_id after approval.
- **GateDecisionRecord mapping**: DB has `gate_type` (not `gate_name`) and `status` (not `decision`). `risk_level` is parsed from the `comment` field which Phase 3 stores as `risk_level:low`.
- **engagementsRouter coexists with auditRouter at /engagements**: Both registered at same path — no conflict since they handle different sub-paths.
- **No engagement_number in EngagementRecord**: DB schema has no `engagement_number` column — `job_code` is the display identifier.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Adjusted gate_decisions query from request_id to engagement_id join**
- **Found during:** Task 1
- **Issue:** Plan spec described fetching A1 gate decisions via `engagements.request_id → gate_decisions.request_id WHERE gate_name = 'A1'`, but the actual DB schema has `gate_decisions.engagement_id NOT NULL` with no `request_id` column. Phase 3 (gate.service.ts) stores A1 with `engagement_id` directly.
- **Fix:** Query all gate_decisions by `engagement_id = :id` — covers A1/P2/P3/P4 with one query.
- **Files modified:** backend/src/services/engagements.service.ts
- **Verification:** grep confirms gate_decisions WHERE engagement_id query

**2. [Rule 1 - Bug] Fixed TypeScript 'this' implicit any in knex where() callback**
- **Found during:** Task 1 TypeScript check
- **Issue:** `this.where()` in Knex's where() function callback gives TS2683 implicit any
- **Fix:** Added explicit `this: ReturnType<typeof db>` type annotation; extracted userId to local const
- **Files modified:** backend/src/services/engagements.service.ts
- **Verification:** tsc --noEmit shows no errors for engagements.service.ts

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes align implementation with actual DB schema and TypeScript requirements. No scope creep.

## Issues Encountered
- Pre-existing TypeScript errors across all route files (cannot find 'express' module, cannot find 'console', @types/node missing) — these are infrastructure-level issues affecting all existing route files, not introduced by this plan. The engagements router follows identical patterns to existing routes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `GET /api/engagements`, `GET /api/engagements/:id`, `PATCH /api/engagements/:id` are ready for frontend consumption
- Plans 04-04, 04-05, 04-06 can build the Engagement Shell UI against these endpoints
- Gate P2 prerequisites service (04-02) can extend `getEngagement` blockers[] when needed

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-05*
