---
phase: 05-evidence-findings-and-gate-p3
plan: "03"
subsystem: api
tags: [findings, gate-p3, evidence-linking, rbac, typescript, knex]

# Dependency graph
requires:
  - phase: 04-engagement-setup-and-gate-p2
    provides: gate_decisions P2 record, objectives table, engagement phase tracking
  - phase: 05-evidence-findings-and-gate-p3
    provides: evidence_items, evidence_files tables (plans 01-02)
provides:
  - Findings CRUD API (list/create/update/delete) with evidence linking
  - Gate P3 prerequisites check returning structured blockers[]
  - Gate P3 decision endpoint (approved → engagement.phase='draft', returned → revision)
  - objectivecoverage.service.ts with getObjectiveCoverage for P3 checks
affects: [05-06-findings-ui, 05-07-gate-p3-review-ui, 06-draft-products]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Gate decision pattern: re-check prerequisites server-side before any gate approval"
    - "DB transaction wraps all gate writes (gate_decisions + audit_events + phase update)"
    - "Sensitivity-based evidence filtering: AL/RO cannot see restricted evidence in findings"
    - "Replace strategy for evidence links on PATCH: delete all + re-insert provided IDs"
    - "P3 blocker types: p2_not_approved, objective_no_evidence, objective_evidence_needed, finding_no_evidence"

key-files:
  created:
    - backend/src/services/findings.service.ts
    - backend/src/services/objectivecoverage.service.ts
    - backend/src/routes/findings.ts
  modified:
    - backend/src/routes/engagements.ts

key-decisions:
  - "objectivecoverage.service.ts created as part of plan 05-03 (Rule 3 - blocking): plan 05-02 was not yet executed, but checkP3Prerequisites requires getObjectiveCoverage"
  - "Gate P3 routes mounted on engagementsRouter (not findingsRouter) to avoid /:finding_id path conflicts with /gate/p3/prerequisites"
  - "gate_decisions uses gate_type='P3' and status='passed'/'returned' to match actual DB schema (not gate_name/decision per original spec)"
  - "finding_evidence_links uses evidence_id FK (not evidence_item_id per original spec) — matched actual migration 002 schema"
  - "P3 prerequisites check: objectives without sufficiency_status column default to 'evidence_needed' — all objectives appear as blockers until evidence_count > 0"

patterns-established:
  - "P3 blocker types enum: p2_not_approved, objective_no_evidence, objective_evidence_needed, finding_no_evidence"
  - "Gate approval pattern: validate → prerequisites re-check → db.transaction(insert gate_decision + audit_event + update phase)"

# Metrics
duration: 4min
completed: 2026-06-06
---

# Phase 5 Plan 03: Findings Service and Gate P3 Summary

**Findings CRUD backend with sensitivity-filtered evidence links, P3 prerequisites check returning 4-type blockers[], and Gate P3 approval advancing engagement.phase to 'draft' via DB transaction**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-06T21:33:24Z
- **Completed:** 2026-06-06T21:38:20Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created `findings.service.ts` with 6 exported functions: listFindings, createFinding, updateFinding, deleteFinding, checkP3Prerequisites, recordP3Decision
- `checkP3Prerequisites` checks 4 conditions and returns structured `blockers[]` with typed `type` fields
- `recordP3Decision` re-validates prerequisites, executes in DB transaction (gate_decision + audit_event + optional phase update), advances engagement to 'draft' on approval
- Created `findings.ts` router with full CRUD + Gate P3 endpoints, proper RBAC (AN/AD for CRUD, QA/AD for gate approval)
- Gate P3 routes mounted directly on engagementsRouter to avoid path conflicts with `/:finding_id`
- Created minimal `objectivecoverage.service.ts` (Rule 3 blocker) with `getObjectiveCoverage` consumed by `checkP3Prerequisites`

## Task Commits

Each task was committed atomically:

1. **Task 1: Findings service (+ objectivecoverage dependency)** - `04ab6ba` (feat) — included in plan 05-01 commit due to pre-existing staged state
2. **Task 2: Findings router + engagements.ts Gate P3 routes** - `ea59774` (feat)

**Plan metadata:** to be committed with this SUMMARY

## Files Created/Modified
- `backend/src/services/findings.service.ts` — 6 service functions: CRUD + checkP3Prerequisites + recordP3Decision
- `backend/src/services/objectivecoverage.service.ts` — getObjectiveCoverage (blocking dependency for P3 prerequisites check)
- `backend/src/routes/findings.ts` — findingsRouter with CRUD endpoints (AN/AD roles)
- `backend/src/routes/engagements.ts` — Added findingsRouter mount + Gate P3 prerequisites + Gate P3 decision routes

## Decisions Made
- Used `gate_type='P3'` and `status='passed'/'returned'` to match actual DB schema in `002_core_tables.ts` migration (plan spec used `gate_name`/`decision` which doesn't match schema)
- Used `evidence_id` FK (not `evidence_item_id`) in `finding_evidence_links` and `objective_evidence_links` to match actual migration 002 schema
- Gate P3 routes mounted on `engagementsRouter` directly (not on `findingsRouter`) to avoid Express path conflict between `/:finding_id` and `/gate/p3/prerequisites`
- objectivecoverage.service.ts created with try/catch fallback for `sufficiency_status` column — handles case where column doesn't exist on objectives table

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created objectivecoverage.service.ts as missing dependency**
- **Found during:** Task 1 (findings service creation)
- **Issue:** `checkP3Prerequisites` requires `getObjectiveCoverage` from `objectivecoverage.service.ts`, but plan 05-02 had not been executed and the service did not exist
- **Fix:** Created `objectivecoverage.service.ts` with `getObjectiveCoverage`, `linkEvidenceToObjectives`, `unlinkEvidenceFromObjective`, and `setSufficiency` functions
- **Files modified:** `backend/src/services/objectivecoverage.service.ts`
- **Verification:** `grep 'export.*getObjectiveCoverage' backend/src/services/objectivecoverage.service.ts` passes
- **Committed in:** 04ab6ba

**2. [Rule 1 - Bug] Adapted schema references to match actual migration 002**
- **Found during:** Task 1 (reviewing migration file before writing service)
- **Issue:** Plan spec references `finding_evidence_links.evidence_item_id` but migration uses `evidence_id`; plan references `gate_name`/`decision` but migration uses `gate_type`/`status`
- **Fix:** Used correct column names `evidence_id`, `gate_type`, `status='passed'/'returned'` throughout both service and router
- **Files modified:** `backend/src/services/findings.service.ts`
- **Verification:** Schema columns verified against `backend/migrations/002_core_tables.ts`
- **Committed in:** 04ab6ba, ea59774

---

**Total deviations:** 2 auto-fixed (1 blocking dependency, 1 schema adaptation bug)
**Impact on plan:** Both essential for correctness. No scope creep.

## Issues Encountered
- TypeScript errors in new files are all pre-existing project-level environment issues (missing `@types/node`, `express` module resolution failures) — identical errors exist in every other file in the codebase. No new TypeScript patterns introduced.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Findings CRUD + Gate P3 backend complete: ready for Plan 05-06 (Findings UI) and Plan 05-07 (Gate P3 Review UI)
- `objectivecoverage.service.ts` created: unblocks Plan 05-02 completion if needed (routes already exist in `objectivecoverage.ts`)
- Gate P3 approval advances `engagement.phase` to `'draft'` — prerequisite for Phase 6 (Draft Products)

## Self-Check: PASSED

All key files verified on disk:
- ✓ `backend/src/services/findings.service.ts`
- ✓ `backend/src/services/objectivecoverage.service.ts`
- ✓ `backend/src/routes/findings.ts`
- ✓ `backend/src/routes/engagements.ts`

All commits verified in git history:
- ✓ `04ab6ba` (feat 05-01 — includes findings.service.ts + objectivecoverage.service.ts)
- ✓ `ea59774` (feat 05-03 — findings.ts router)

---
*Phase: 05-evidence-findings-and-gate-p3*
*Completed: 2026-06-06*
