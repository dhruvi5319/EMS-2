---
phase: 06-draft-reference-check-gate-p4-and-dashboard
plan: GAP-01
subsystem: draft
tags: [draft-upload, cmdk, onMouseDown, file-upload, state-management, evidence-multiselect]

# Dependency graph
requires:
  - phase: 06-draft-reference-check-gate-p4-and-dashboard
    provides: draft.ts route, useDraftProduct.ts hook, AddStatementForm.tsx
provides:
  - POST /draft/file returns { draft: DraftProduct } consistent with all other draft endpoints
  - AddStatementForm CommandItem has onMouseDown preventDefault fix
  - statements.spec.ts includes evidence CommandItem toggle test
affects: [UAT Test 3, UAT Test 5, UAT Test 6, UAT Test 7, UAT Test 8, UAT Test 9]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "getDraft re-fetch after file upload — consistent { draft } shape from all POST/PATCH/DELETE draft endpoints"
    - "onMouseDown={(e) => e.preventDefault()} on CommandItem — canonical cmdk v1 + Radix Popover focus-loss fix (same as AddMemberForm, LinkObjectivePopover)"

key-files:
  created: []
  modified:
    - backend/src/routes/draft.ts
    - frontend/src/components/statements/AddStatementForm.tsx
    - frontend/e2e/statements.spec.ts

key-decisions:
  - "Re-fetch draft via getDraft() after file upload rather than reading upload response directly — ensures { draft } shape is always present"
  - "useDraftProduct.ts uploadFile already read data.draft correctly — no frontend hook change needed, only backend fix"
  - "Pre-existing backend TypeScript errors (missing @types/node, npm packages in local env) are out of scope — they exist project-wide and do not affect runtime correctness"

patterns-established:
  - "All draft endpoints return { draft: DraftProduct } — file upload now consistent with GET/POST/PATCH"
  - "onMouseDown preventDefault: standard fix for any cmdk v1 CommandItem inside Radix Popover"

# Metrics
duration: 2min
completed: 2026-06-19
---

# Phase 6 GAP-01: Draft File Upload State Reset + AddStatementForm cmdk Race Fix Summary

**Backend POST /draft/file now returns `{ draft: DraftProduct }` and AddStatementForm CommandItem has `onMouseDown={(e) => e.preventDefault()}` to fix cmdk v1 focus-loss race**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-19T03:27:57Z
- **Completed:** 2026-06-19T03:29:37Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Fixed `POST /draft/file` to return `{ draft: DraftProduct }` by re-fetching via `getDraft()` after upload — consistent with every other draft endpoint shape
- Fixed `AddStatementForm.tsx` CommandItem with `onMouseDown={(e) => e.preventDefault()}` to prevent Radix Popover focus-loss race before `onSelect` fires
- Added evidence CommandItem toggle test to `statements.spec.ts` asserting selection badge visible after click

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix backend POST /draft/file to return full draft object** - `a83236a` (fix)
2. **Task 2: Fix AddStatementForm cmdk onMouseDown race + add toggle test** - `d9969b7` (fix)

**Plan metadata:** (docs commit to follow)

## Files Created/Modified
- `backend/src/routes/draft.ts` - POST /file now calls getDraft() after upload and returns `{ draft }` shape
- `frontend/src/components/statements/AddStatementForm.tsx` - CommandItem in evidence picker has onMouseDown preventDefault fix
- `frontend/e2e/statements.spec.ts` - Added evidence CommandItem toggle test (badge visible after click)

## Decisions Made
- `useDraftProduct.ts` uploadFile already reads `data.draft` from the response (line 105-107) — no change needed to the frontend hook; only the backend response shape needed fixing
- Re-fetching via `getDraft()` after upload is the cleanest approach: ensures the draft object always includes `file_ref`, `filename`, and `file_size` from the DB regardless of what `uploadDraftFile()` returns

## Deviations from Plan

None - plan executed exactly as written. The plan correctly identified that `useDraftProduct.ts` already reads `data.draft` and no hook change would be needed after the backend fix.

## Issues Encountered

Pre-existing backend TypeScript errors (missing `@types/node`, missing npm packages like `express`, `multer`, `knex`, etc.) exist across the entire project when running `tsc` outside Docker. These are environment-level issues unrelated to this plan's changes and were present before any modifications. The actual route logic in `draft.ts` compiles correctly in isolation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- UAT Test 3 (file upload state reset) is unblocked — POST /draft/file now returns full draft object
- UAT Test 5 (evidence multi-select CommandItem click) is unblocked — onMouseDown fix applied
- UAT Tests 6, 7, 8, 9 (statement/IR tests) can now be re-tested since Test 5 blocker is resolved

## Self-Check: PASSED

- ✅ `backend/src/routes/draft.ts` exists and contains `res.json({ draft })` for POST /file
- ✅ `frontend/src/components/statements/AddStatementForm.tsx` exists with `onMouseDown` fix
- ✅ `frontend/e2e/statements.spec.ts` exists with new CommandItem toggle test
- ✅ `06-GAP-01-SUMMARY.md` written to correct path
- ✅ Commits `a83236a` and `d9969b7` verified in git log

---
*Phase: 06-draft-reference-check-gate-p4-and-dashboard*
*Completed: 2026-06-19*
