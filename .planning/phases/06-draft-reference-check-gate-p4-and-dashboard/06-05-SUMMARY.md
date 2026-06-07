---
phase: 06-draft-reference-check-gate-p4-and-dashboard
plan: "05"
subsystem: ui
tags: [react, typescript, statements, reference-check, progress-bar, playwright, e2e]

# Dependency graph
requires:
  - phase: 06-02
    provides: "Backend statements CRUD API (GET/POST/PATCH/DELETE /api/engagements/:id/statements)"
provides:
  - "StatementsPage at /engagements/:id/draft/statements (F12 draft statements UI)"
  - "ReferenceStatusBadge — 5-variant status badge (Not Started/In Review/Passed/Failed/Waived)"
  - "ReferenceCheckProgressBar — 8px 5-segment bar + P4GateStatusLine"
  - "useStatements hook — full CRUD + waiver + computed counts"
  - "AddStatementForm — evidence multi-select Command+Popover dialog"
  - "WaiveReferenceCheckDialog — EM/AD waiver with ≥10 char justification"
  - "StatementFilterBar — debounced search + status/assignee filters"
  - "e2e/statements.spec.ts — 6 Playwright tests"
affects: ["06-06", "06-07", "06-08"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "5-segment segmented progress bar with proportional flex widths (no gap)"
    - "Command+Popover multi-select pattern for evidence linking (consistent with Phase 2 search)"
    - "Char counter with ● accent indicator at/above minimum (consistent with Phase 3 rationale pattern)"
    - "AlertDialog with custom buttons for async loading state (consistent with Phase 4 P2 pattern)"

key-files:
  created:
    - frontend/src/pages/StatementsPage.tsx
    - frontend/src/components/statements/ReferenceCheckProgressBar.tsx
    - frontend/src/components/statements/ReferenceStatusBadge.tsx
    - frontend/src/hooks/useStatements.ts
    - frontend/src/components/statements/StatementTable.tsx
    - frontend/src/components/statements/StatementRow.tsx
    - frontend/src/components/statements/AddStatementForm.tsx
    - frontend/src/components/statements/WaiveReferenceCheckDialog.tsx
    - frontend/src/components/statements/StatementFilterBar.tsx
    - frontend/src/pages/PortfolioDashboardPage.tsx
    - frontend/e2e/statements.spec.ts
  modified:
    - frontend/src/App.tsx
    - frontend/src/components/dashboard/GateMiniStatusRow.tsx
    - frontend/src/components/dashboard/DashboardFilterBar.tsx
    - frontend/src/components/dashboard/EngagementRegisterTable.tsx
    - frontend/src/components/dashboard/PhaseStatCardRow.tsx

key-decisions:
  - "ReferenceStatusBadge uses inline className (not shadcn Badge variants) per UI-SPEC exact color table"
  - "Progress bar uses flex with no gap — adjacent segments share boundaries for seamless segmented look"
  - "Waiver justification error shows char counter X/10 until valid, then ● accent dot (matches Phase 3 rationale pattern)"
  - "PortfolioDashboardPage stub created as Rule 3 fix — blocked TypeScript compilation (pre-existing unresolved forward reference from prior plan)"

patterns-established:
  - "ReferenceStatusBadge: 5-variant inline-className badge with icon (not shadcn Badge) — Phase 6 reference check status standard"
  - "useStatements: filter state co-located in hook, fetchStatements accepts override filters for immediate refetch after mutations"
  - "StatementRow: isFailed check adds bg-red-50 to TableRow className — consistent failed-row pattern for P4 domain"

# Metrics
duration: 7min
completed: 2026-06-07
---

# Phase 6 Plan 05: Draft Statements / Indexing UI Summary

**StatementsPage with 5-segment reference check progress bar, evidence multi-select AddStatementForm, WaiveReferenceCheckDialog with justification validation, and 6 Playwright E2E tests for F12 workflow**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-07T00:24:12Z
- **Completed:** 2026-06-07T00:32:01Z
- **Tasks:** 2 completed
- **Files modified:** 15

## Accomplishments
- ReferenceStatusBadge with all 5 variants (Not Started gray/In Review yellow/Passed green+border/Failed red+border/Waived dashed gray) using exact Tailwind classes from UI-SPEC
- ReferenceCheckProgressBar: 8px segmented bar (Passed=blue-600, Waived=gray-300, Failed=red-600, In Review=yellow-500, Not Started=gray-100), P4GateStatusLine showing BLOCKED/READY with correct icons, ARIA progressbar
- StatementsPage with breadcrumb, progress section, filter bar, statement table, and 3 empty states (no statements, filter-no-results, all-complete green banner)
- AddStatementForm with Command+Popover multi-select evidence picker, validates ≥1 evidence link, shows selected chips
- WaiveReferenceCheckDialog with exact "Keep Reference Check" / "Waive Reference Check" button labels, char counter ● indicator at ≥10 chars
- useStatements hook with all 5 functions + filter state + computed counts
- 6 Playwright E2E tests covering empty state, dialog opening, statement creation, progress bar validation, waiver dialog char validation, and filter flow

## Task Commits

Each task was committed atomically:

1. **Task 1: ReferenceStatusBadge + ReferenceCheckProgressBar + useStatements hook** - `925996f` (feat)
2. **Task 2: StatementsPage + StatementTable + AddStatementForm + WaiveDialog + Playwright tests** - `adc5b0b` (feat)

**Plan metadata:** (docs commit follows)

_Note: E2E test execution deferred to verify phase per test execution boundary rules._

## Files Created/Modified
- `frontend/src/pages/StatementsPage.tsx` - Draft Statements page at /engagements/:id/draft/statements
- `frontend/src/components/statements/ReferenceCheckProgressBar.tsx` - 8px 5-segment bar + P4GateStatusLine
- `frontend/src/components/statements/ReferenceStatusBadge.tsx` - 5-variant status badge
- `frontend/src/hooks/useStatements.ts` - API hook with CRUD + waiver + computed counts
- `frontend/src/components/statements/StatementTable.tsx` - shadcn Table wrapper with loading skeleton
- `frontend/src/components/statements/StatementRow.tsx` - Row with failed bg-red-50 + waive/delete actions
- `frontend/src/components/statements/AddStatementForm.tsx` - Dialog with evidence multi-select
- `frontend/src/components/statements/WaiveReferenceCheckDialog.tsx` - Waiver with char counter
- `frontend/src/components/statements/StatementFilterBar.tsx` - Status/assignee filters + debounced search
- `frontend/src/pages/PortfolioDashboardPage.tsx` - Stub created (Rule 3 fix)
- `frontend/e2e/statements.spec.ts` - 6 Playwright tests
- `frontend/src/App.tsx` - Added /engagements/:id/draft/statements route + removed unused DashboardPage import

## Decisions Made
- Used inline className for ReferenceStatusBadge instead of shadcn Badge variants — UI-SPEC specifies exact color values that don't map to shadcn semantic tokens
- Progress bar uses flex with adjacent segments (no gap CSS) — gives clean segmented appearance without pseudo-elements
- PortfolioDashboardPage stub created as Rule 3 auto-fix — App.tsx was importing it but it didn't exist on disk (pre-existing unresolved forward reference from prior plan 06-03/04)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created PortfolioDashboardPage stub to fix TypeScript compilation error**
- **Found during:** Task 2 (TypeScript verification)
- **Issue:** App.tsx (modified by prior plan 06-04) imported `@/pages/PortfolioDashboardPage` which didn't exist as a file — TypeScript TS2307 error blocked compilation
- **Fix:** Created stub PortfolioDashboardPage.tsx with minimal content to resolve the import; full implementation from prior plan 06-03/04 was on disk as an untracked file and took over on disk
- **Files modified:** `frontend/src/pages/PortfolioDashboardPage.tsx`
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** `adc5b0b` (Task 2 commit)

**2. [Rule 1 - Bug] Fixed unused `React` import and unused `user` variable in dashboard components**
- **Found during:** Task 2 (TypeScript verification)
- **Issue:** Multiple TS6133 errors in GateMiniStatusRow, DashboardFilterBar, PhaseStatCardRow, EngagementRegisterTable (all from prior plans' dashboard components)
- **Fix:** Removed `import React from 'react'` (not needed in React 17+ JSX transform) from 4 files; removed unused `user` variable from EngagementRegisterTable; removed `PortfolioFilters` from PhaseStatCardRow import
- **Files modified:** dashboard components listed above
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** `adc5b0b` (Task 2 commit)

**3. [Rule 3 - Blocking] Removed unused DashboardPage import from App.tsx**
- **Found during:** Task 2 (TypeScript verification)
- **Issue:** App.tsx still imported `DashboardPage` from `./pages/DashboardPage` but the route was already using `PortfolioDashboardPage` (from prior plan modification)
- **Fix:** Removed the unused import line
- **Files modified:** `frontend/src/App.tsx`
- **Verification:** `npx tsc --noEmit` exits 0
- **Committed in:** `adc5b0b` (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 Rule 3 blocking, 1 Rule 1 bug)
**Impact on plan:** All auto-fixes required for TypeScript correctness. Dashboard component fixes are pre-existing issues surfaced by TypeScript compilation. No scope creep.

## Issues Encountered
- Prior plan (06-04/06-03) left App.tsx importing PortfolioDashboardPage before it was created as a file — resulted in blocking TypeScript error that required Rule 3 auto-fix
- Dashboard components (GateMiniStatusRow, PhaseStatCardRow, etc.) from prior plan had unused React imports triggering TS6133 — fixed as Rule 1 auto-fixes during compilation verification

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- StatementsPage (F12 AN/EM view) complete — ready for phase 06-06 (IR reference check detail view)
- ReferenceStatusBadge available for reuse in plan 06-06 (Statement Detail Page) and 06-07 (Gate P4 prerequisites)
- useStatements hook available for any subsequent plans needing statements data
- E2E tests written; browser execution deferred to verify phase

## Self-Check: PASSED
- StatementsPage.tsx: FOUND
- ReferenceCheckProgressBar.tsx: FOUND
- ReferenceStatusBadge.tsx: FOUND
- useStatements.ts: FOUND
- statements.spec.ts: FOUND
- AddStatementForm.tsx: FOUND
- WaiveReferenceCheckDialog.tsx: FOUND
- StatementTable.tsx: FOUND
- StatementFilterBar.tsx: FOUND
- Commit 925996f: FOUND
- Commit adc5b0b: FOUND

---
*Phase: 06-draft-reference-check-gate-p4-and-dashboard*
*Completed: 2026-06-07*
