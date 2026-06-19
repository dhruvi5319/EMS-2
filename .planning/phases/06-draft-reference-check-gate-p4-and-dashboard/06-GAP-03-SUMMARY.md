---
phase: 06-draft-reference-check-gate-p4-and-dashboard
plan: GAP-03
subsystem: api
tags: [statements, reference-check, waiver, role-guard, validation]

# Dependency graph
requires:
  - phase: 06-draft-reference-check-gate-p4-and-dashboard
    provides: statements.service.ts with 'waived' in validStatuses (migration 010 adds DB support)
provides:
  - "updateStatement enforces EM/AD role restriction for ref_status='waived' (throws 403 for AN/IR)"
  - "updateStatement requires non-empty discrepancy_notes when waiving (throws 422 if missing)"
  - "deleteStatement blocks deletion of waived statements (throws 409)"
affects: ["verification phase", "UAT Test 5 (waiver flow)", "F12", "F13"]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Role-based guard pattern: userRoles.includes check before status-restricted write"]

key-files:
  created: []
  modified:
    - backend/src/services/statements.service.ts

key-decisions:
  - "Added waived delete-block in deleteStatement (management decisions should be un-waived before deletion) — closes logical gap in deletion guard"
  - "justification uses discrepancy_notes field (same as failed status) — no new DB column needed"

patterns-established:
  - "Status-restricted validation pattern: failed block → waived block, each with role check then notes check"

# Metrics
duration: 1min
completed: 2026-06-19
---

# Phase 6 Plan GAP-03: Waiver Role Guard and Mandatory Notes Summary

**EM/AD-only waiver restriction with mandatory justification added to `updateStatement` in `statements.service.ts`, closing the last VERIFICATION.md gap for the waiver feature**

## Performance

- **Duration:** 1 min
- **Started:** 2026-06-19T03:27:59Z
- **Completed:** 2026-06-19T03:29:09Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added EM/AD role guard for `ref_status='waived'`: AN and IR callers now receive 403 with clear message
- Added mandatory justification validation: empty `discrepancy_notes` when waiving now returns 422
- Removed stale comment "waived is not in DB schema" (migration 010 added it)
- Added `waived` guard in `deleteStatement`: waived statements are blocked from deletion (409)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add waiver role guard and mandatory notes validation to updateStatement** - `6988ba6` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `backend/src/services/statements.service.ts` — Added EM/AD role guard and mandatory discrepancy_notes validation for `ref_status='waived'`; updated stale comment; added waived delete guard

## Decisions Made

- Used `discrepancy_notes` as justification field for waiver (same field as `failed` status) — no new DB column needed, aligns with existing VERIFICATION.md spec
- Added `waived` block in `deleteStatement` to block deletion of management-decision waivers — logical extension of the existing `passed` guard

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added waived delete guard in deleteStatement**
- **Found during:** Task 1 (reviewing deleteStatement alongside updateStatement)
- **Issue:** The plan only described updating the stale comment in `deleteStatement`, but the stale comment said "no 'waived' in DB schema" — now that migration 010 adds 'waived', there's no delete guard for waived statements. A management-decision waiver can currently be silently deleted.
- **Fix:** Added a 409 block before the `passed` block in `deleteStatement` for `existing.ref_status === 'waived'`, with a descriptive error message
- **Files modified:** `backend/src/services/statements.service.ts`
- **Verification:** File reviewed — waived block precedes passed block in deleteStatement
- **Committed in:** `6988ba6` (part of task commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Auto-fix closes a logical gap introduced by migration 010 adding 'waived' to DB. No scope creep — direct consequence of the same gap fix this plan addresses.

## Issues Encountered

None — TypeScript compilation had pre-existing errors in unrelated files (`local.storage.ts`, `users.service.ts`) from missing `@types/node` and `knex` type declarations. No errors introduced in `statements.service.ts`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Waiver feature fully restricted and validated end-to-end (EM/AD only, mandatory justification)
- UAT Test 5 (waiver flow) can now be re-tested — AN/IR waiver attempts will correctly return 403
- VERIFICATION.md gap 2 is fully closed — all waiver-related gaps resolved

---
*Phase: 06-draft-reference-check-gate-p4-and-dashboard*
*Completed: 2026-06-19*

## Self-Check: PASSED

- ✅ `backend/src/services/statements.service.ts` — exists on disk
- ✅ `06-GAP-03-SUMMARY.md` — exists on disk
- ✅ Commit `6988ba6` — found in git log
