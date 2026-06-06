---
phase: 05-evidence-findings-and-gate-p3
plan: "02"
subsystem: api
tags: [evidence, objectives, coverage, sufficiency, rbac, postgres, knex]

# Dependency graph
requires:
  - phase: 04-engagement-setup-and-gate-p2
    provides: objectives table, planning_records, engagements infrastructure
  - phase: 05-evidence-findings-and-gate-p3
    provides: evidence_items table, objective_evidence_links table (F8 from 05-01)
provides:
  - Evidence-to-objective link/unlink endpoints
  - Objective coverage summary endpoint (gap view data)
  - Objective sufficiency status management (evidence_needed/in_review/sufficient)
  - Migration 003 adding sufficiency_status column to objectives table
affects: [05-04, 05-05, 05-06, 05-07, 05-08]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ON CONFLICT DO NOTHING via db.raw() for safe deduplication in Knex"
    - "actorId passed through route handler to service for linked_by tracking"
    - "Sufficiency validation two-phase: value check, then evidence_count guard"

key-files:
  created:
    - backend/migrations/003_objective_sufficiency.ts
    - backend/src/routes/objectivecoverage.ts
  modified:
    - backend/src/services/objectivecoverage.service.ts
    - backend/src/routes/engagements.ts

key-decisions:
  - "sufficiency_status stored as column on objectives table (added via migration 003) — no separate objective_sufficiency table needed"
  - "objective_evidence_links table uses objective_id/evidence_id (not evidence_item_id) per actual migration 002 schema"
  - "linkEvidenceToObjectives accepts actorId param to populate linked_by NOT NULL column"
  - "objectiveCoverageRouter mounted at /:id in engagements.ts with mergeParams:true for nested param access"

patterns-established:
  - "Deduplication pattern: pre-check existing + ON CONFLICT DO NOTHING for concurrent safety"
  - "Zero-evidence guard: check COUNT(*) from objective_evidence_links before allowing in_review/sufficient"

# Metrics
duration: 4min
completed: 2026-06-06
---

# Phase 5 Plan 02: Objective Coverage Summary

**Evidence-to-objective linking service and router: link/unlink endpoints, coverage summary with evidence_count per objective, and sufficiency status management (evidence_needed/in_review/sufficient) with QA/EM/AD RBAC guard.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-06T21:34:33Z
- **Completed:** 2026-06-06T21:38:39Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Objective coverage service with all 4 F9 functions exported: `getObjectiveCoverage`, `linkEvidenceToObjectives`, `unlinkEvidenceFromObjective`, `setSufficiency`
- Migration 003 adds `sufficiency_status` column to `objectives` table with CHECK constraint
- Router with correct RBAC: link/unlink (AN/EM/AD), coverage (all authenticated), sufficiency (QA/EM/AD)
- Deduplication via ON CONFLICT DO NOTHING in raw SQL with pre-check for accurate linked/skipped counts

## Task Commits

Each task was committed atomically:

1. **Task 1: Objective coverage service** - `1907f65` (feat)
2. **Task 2: Objective coverage router** - `9573bb2` (feat)

**Plan metadata:** `(docs commit follows)`

## Files Created/Modified

- `backend/migrations/003_objective_sufficiency.ts` - Adds sufficiency_status column to objectives with check constraint
- `backend/src/services/objectivecoverage.service.ts` - All 4 F9 service functions
- `backend/src/routes/objectivecoverage.ts` - All 4 F9 route handlers with RBAC guards
- `backend/src/routes/engagements.ts` - Import and mount objectiveCoverageRouter at /:id

## Decisions Made

- **sufficiency_status stored on objectives table:** The plan referenced a separate `objective_sufficiency` table that doesn't exist in migration 002. Instead, added `sufficiency_status` column directly to `objectives` via migration 003. This is simpler and avoids a JOIN.

- **Actual table name is `objective_evidence_links`:** The plan spec used `evidence_objective_links` and `evidence_item_id`. The actual migration 002 schema uses `objective_evidence_links` with columns `objective_id`, `evidence_id`, `linked_by`, `linked_at`. Service adapted accordingly.

- **linkEvidenceToObjectives accepts `actorId`:** The `objective_evidence_links.linked_by` column is NOT NULL, requiring an actor ID. Plan spec didn't mention this — added `actorId` parameter and passed from route handler via `req.user!.id`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Adapted table names and column names to actual schema**
- **Found during:** Task 1 (service implementation)
- **Issue:** Plan referenced `evidence_objective_links` table with `evidence_item_id` column. Actual migration 002 uses `objective_evidence_links` with `evidence_id` column.
- **Fix:** Used correct table name `objective_evidence_links` and column `evidence_id` throughout service
- **Files modified:** backend/src/services/objectivecoverage.service.ts
- **Verification:** grep confirms correct table/column names; TypeScript compiles (no new errors)
- **Committed in:** 1907f65

**2. [Rule 2 - Missing Critical] Added migration for sufficiency_status column**
- **Found during:** Task 1 (coverage query logic)
- **Issue:** Plan assumed a separate `objective_sufficiency` table but none exists in DB schema. `objectives` table has no `sufficiency_status` column.
- **Fix:** Created migration 003 to add `sufficiency_status TEXT NOT NULL DEFAULT 'evidence_needed'` with CHECK constraint to `objectives` table
- **Files modified:** backend/migrations/003_objective_sufficiency.ts
- **Verification:** Migration file created; service uses column correctly
- **Committed in:** 1907f65

**3. [Rule 2 - Missing Critical] Added actorId parameter to linkEvidenceToObjectives**
- **Found during:** Task 1 (link insert logic)
- **Issue:** `objective_evidence_links.linked_by` is NOT NULL in migration 002. Plan spec omitted this parameter.
- **Fix:** Added `actorId: string` parameter to `linkEvidenceToObjectives` and populated `linked_by` in INSERT
- **Files modified:** backend/src/services/objectivecoverage.service.ts, backend/src/routes/objectivecoverage.ts
- **Verification:** Route passes `req.user!.id` as actorId; NOT NULL constraint will be satisfied
- **Committed in:** 1907f65, 9573bb2

---

**Total deviations:** 3 auto-fixed (1 bug - wrong table names, 2 missing critical - schema column + NOT NULL)
**Impact on plan:** All auto-fixes necessary for correctness against actual DB schema. No scope creep.

## Issues Encountered

None — all issues resolved via deviation rules.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- F9 backend complete: link/unlink/coverage/sufficiency all implemented
- objectiveCoverageRouter is available for Plan 05-05 (Gap View UI) to consume `GET /objectives/coverage`
- setSufficiency endpoint ready for Plan 05-07 (Gate P3 Review UI) sufficiency updates
- Migration 003 must be run before evidence linking will work in production

## Self-Check: PASSED

| Item | Status |
|------|--------|
| backend/migrations/003_objective_sufficiency.ts | FOUND |
| backend/src/services/objectivecoverage.service.ts | FOUND |
| backend/src/routes/objectivecoverage.ts | FOUND |
| commit 1907f65 (Task 1) | FOUND |
| commit 9573bb2 (Task 2) | FOUND |

---
*Phase: 05-evidence-findings-and-gate-p3*
*Completed: 2026-06-06*
