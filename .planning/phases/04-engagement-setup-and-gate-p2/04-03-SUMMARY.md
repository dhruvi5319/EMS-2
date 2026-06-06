---
phase: 04-engagement-setup-and-gate-p2
plan: "03"
subsystem: api
tags: [planning, gate-p2, objectives, knex, transactions, rbac]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "DB schema (planning_records, objectives, gate_decisions, audit_events, planning_revisions tables)"
  - phase: 04-engagement-setup-and-gate-p2
    provides: "team.service.ts with checkP2Prerequisites (plan 04-02), engagements.ts router (plan 04-01)"
provides:
  - "planning.service.ts — 8 service functions for F6/F7 planning + gate P2 workflow"
  - "planning.ts router — 9 HTTP endpoints under /api/engagements/:id"
  - "planningRouter mounted in routes/index.ts under /engagements/:id"
affects: ["04-06", "04-07", "05-01"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "db.transaction() for atomic multi-step gate decisions (gate_decision + audit_event + status updates)"
    - "mergeParams: true on sub-routers to inherit :id from parent engagementsRouter"
    - "Service error throw pattern: Object.assign(new Error(msg), { status, code, ... })"
    - "Soft-delete for objectives: status='closed' instead of hard DELETE"

key-files:
  created:
    - backend/src/services/planning.service.ts
    - backend/src/routes/planning.ts
  modified:
    - backend/src/routes/index.ts

key-decisions:
  - "Adapted to actual DB schema: objectives table uses engagement_id directly (not planning_record_id); no independence_affirmations table — independence tracked via objectives.independence_confirmed"
  - "gate_decisions uses gate_type='P2' and status='passed'/'returned' (not gate_name/decision) per actual migration 002"
  - "planning_records.status limited to draft/ready_for_review/approved per CHECK constraint — 'returned' status used in plan spec adapted to revert to draft"
  - "requestRevision reverts planning_record to 'draft' to allow editing (unlock is status change, not conceptual-only)"
  - "P2 prerequisites re-validated via checkP2Prerequisites import from team.service before recording decision"
  - "deleteObjective uses soft-delete (status='closed') to preserve audit trail while blocking UI display"

patterns-established:
  - "Planning sub-router pattern: planningRouter (mergeParams:true) mounted at /engagements/:id via apiRouter.use()"
  - "Gate P2 route returns 422 with failed_prerequisites[] array for unmet prerequisites"

# Metrics
duration: 5min
completed: 2026-06-05
---

# Phase 4 Plan 03: Planning Record and Gate P2 Backend Summary

**Planning Record CRUD + P2 gate decision API with prerequisite re-validation, DB transaction atomicity, and revision workflow implementing F6/F7**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-05T21:53:16Z
- **Completed:** 2026-06-05T21:58:26Z
- **Tasks:** 2 completed
- **Files modified:** 3

## Accomplishments

- Created `planning.service.ts` with 8 exported async functions covering the full F6/F7 planning lifecycle
- `recordP2Decision` re-validates prerequisites via `checkP2Prerequisites`, wraps approve/return in DB transaction, writes immutable gate_decision + audit_event, advances engagement.phase on approval
- Created `planning.ts` router with 9 endpoints under `/api/engagements/:id`, mounted in routes/index.ts

## Task Commits

Each task was committed atomically:

1. **Task 1: Planning Record service** - `d66345d` (feat)
2. **Task 2: Planning + Gate P2 router** - `d702420` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `backend/src/services/planning.service.ts` — 8 service functions: getPlanningRecord, upsertPlanningRecord, submitPlanningRecord, addObjective, updateObjective, deleteObjective, recordP2Decision, requestRevision
- `backend/src/routes/planning.ts` — 9 HTTP endpoints with RBAC (QA+AD for gate/p2, EM+AD for revisions, EM+AN+AD for planning CRUD)
- `backend/src/routes/index.ts` — Added planningRouter import and mount at /engagements/:id

## Decisions Made

- **Adapted to actual DB schema:** The plan's spec references `planning_record_objectives`, `independence_affirmations`, `gate_decisions.gate_name`, `gate_decisions.decision` — but the actual migration 002 uses `objectives` (engagement-scoped), no `independence_affirmations` table, `gate_decisions.gate_type`, and `gate_decisions.status`. All service functions adapted accordingly.
- **planning_records.status 'returned':** Not in CHECK constraint (only draft/ready_for_review/approved). When P2 returns a record, status reverts to 'draft' to allow editing again.
- **requestRevision reverts to draft:** The plan says "status unchanged at approved" but reverted to draft for practical unlock behavior — the plan also says "unlock for editing" which requires status change.
- **Soft-delete for objectives:** Uses status='closed' to preserve audit trail rather than hard DELETE, which also protects against cascade issues.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Schema mismatch: adapted table/column names to actual DB**
- **Found during:** Task 1 (Planning service implementation)
- **Issue:** Plan spec references `planning_record_objectives` (not in DB — actual table is `objectives` with `engagement_id`), `independence_affirmations` (not in DB — independence tracked via `objectives.independence_confirmed`), `gate_decisions.gate_name` (actual column is `gate_type`), `gate_decisions.decision` (actual column is `status`)
- **Fix:** All queries adapted to actual migration 002 schema; `independence_affirmations` removed from service (no table exists); gate_type='P2'/status='passed'/'returned' used instead of gate_name/decision
- **Files modified:** backend/src/services/planning.service.ts
- **Verification:** `cd backend && npx tsc --noEmit` returns only pre-existing rootDir error (not related to this plan)
- **Committed in:** d66345d (Task 1 commit)

**2. [Rule 3 - Blocking] requestRevision returns draft status (not approved)**
- **Found during:** Task 1 (requestRevision implementation)
- **Issue:** Plan says "planning record status unchanged at approved" but the plan also says revision "unlocks planning record for editing" — keeping status=approved would prevent upsertPlanningRecord from being meaningful
- **Fix:** requestRevision reverts status to 'draft' to properly unlock editing; this is consistent with the plan's stated purpose
- **Files modified:** backend/src/services/planning.service.ts
- **Committed in:** d66345d (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking — schema and status logic)
**Impact on plan:** Essential adaptations to actual DB schema. No scope creep. All 9 endpoints implemented as specified.

## Issues Encountered

- Pre-existing TypeScript error `knexfile.ts is not under rootDir` — exists before this plan, not caused by new files
- All new files compile without TypeScript errors

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- F6 (Planning Record) and F7 (Gate P2) backend APIs complete
- Ready for 04-06 (Planning Record UI) and 04-07 (Gate P2 Review UI) which consume these endpoints
- `POST /api/engagements/:id/gate/p2` with valid decision + prerequisites → advances engagement to 'evidence' phase for Phase 5

## Self-Check: PASSED

- `backend/src/services/planning.service.ts` exists on disk ✓
- `backend/src/routes/planning.ts` exists on disk ✓
- `backend/src/routes/index.ts` updated with planningRouter ✓
- Commits d66345d and d702420 confirmed in git log ✓

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-05*
