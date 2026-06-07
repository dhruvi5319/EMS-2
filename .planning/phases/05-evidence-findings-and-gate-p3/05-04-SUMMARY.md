---
phase: 05-evidence-findings-and-gate-p3
plan: "04"
subsystem: ui
tags: [react, shadcn, evidence-registry, file-upload, playwright, typescript]

# Dependency graph
requires:
  - phase: 05-01
    provides: "GET/POST /api/engagements/:id/evidence + CSV export endpoints"
  - phase: 05-02
    provides: "GET /api/engagements/:id/objectives/coverage endpoint"

provides:
  - "EvidenceTypeBadge component (5 type labels)"
  - "SensitivityBadge component (STANDARD gray-100 / RESTRICTED red-100 + Lock icon + tooltip)"
  - "ObjectiveCoverageBar component (8px progress bar with covered/gap segments)"
  - "useEvidence and useEvidenceCoverage hooks"
  - "EvidenceTable with loading skeletons and two empty states"
  - "EvidenceFilterBar with type/sensitivity filters + search"
  - "EvidenceFileUpload with drag-drop, MIME/size/count validation, per-file progress"
  - "AddEvidencePanel: 640px Sheet with react-hook-form, 7 fields, objective linking, file upload"
  - "EvidenceListPage: coverage bar + gap view + filter bar + table + CSV export"
  - "Playwright E2E tests (6 tests, execution deferred to verify phase)"

affects:
  - "05-05-PLAN.md (uses EvidenceTypeBadge, SensitivityBadge primitives)"
  - "05-06-PLAN.md (Findings UI may use same badge patterns)"

# Tech tracking
tech-stack:
  added:
    - "shadcn tooltip (written manually - ECONNRESET)"
    - "shadcn sheet (written manually using @radix-ui/react-dialog)"
    - "@radix-ui/react-tooltip (already in node_modules)"
  patterns:
    - "Sheet component uses @radix-ui/react-dialog (no separate @radix-ui/react-sheet package exists)"
    - "Evidence primitives (EvidenceTypeBadge, SensitivityBadge) are shared across plans 05-04 through 05-07"
    - "EvidenceFileUpload uses raw fetch() for FormData uploads (same pattern as IntakeFileUpload)"
    - "EvidenceListPage rendered inside EngagementShellPage Evidence tab (replaces PlaceholderPanel)"

key-files:
  created:
    - "frontend/src/components/ui/tooltip.tsx"
    - "frontend/src/components/ui/sheet.tsx"
    - "frontend/src/components/evidence/EvidenceTypeBadge.tsx"
    - "frontend/src/components/evidence/SensitivityBadge.tsx"
    - "frontend/src/components/evidence/ObjectiveCoverageBar.tsx"
    - "frontend/src/hooks/useEvidence.ts"
    - "frontend/src/components/evidence/EvidenceTable.tsx"
    - "frontend/src/components/evidence/EvidenceFilterBar.tsx"
    - "frontend/src/components/evidence/EvidenceFileUpload.tsx"
    - "frontend/src/components/evidence/AddEvidencePanel.tsx"
    - "frontend/src/pages/engagements/EvidenceListPage.tsx"
    - "frontend/e2e/evidence-registry.spec.ts"
  modified:
    - "frontend/src/pages/EngagementShellPage.tsx (Evidence tab wired to EvidenceListPage)"

key-decisions:
  - "shadcn registry ECONNRESET (consistent with Phases 2-4) — tooltip.tsx and sheet.tsx written manually from official new-york templates"
  - "Sheet component wraps @radix-ui/react-dialog — no separate @radix-ui/react-sheet package exists on npm"
  - "EvidenceFileUpload uses raw fetch() for FormData multipart uploads (same rationale as IntakeFileUpload in Phase 3)"
  - "Playwright E2E tests written as artifacts; execution deferred to verify phase per test execution boundary"
  - "EvidenceListPage rendered as tab content in EngagementShellPage (not a standalone route)"

patterns-established:
  - "Sensitivity: AL/RO restriction enforced server-side; RESTRICTED items absent from DOM via API filtering"
  - "Coverage bar shows 8px horizontal progress bar with covered (blue-100) / gap (red-100) segments"
  - "Gap view expands inline below coverage bar (no navigation); shows red-100 dashed-border cards per UI-SPEC"
  - "Evidence form uses react-hook-form with zodResolver; mode=onBlur + errors shown on isSubmitted"

# Metrics
duration: 12min
completed: 2026-06-06
---

# Phase 5 Plan 04: Evidence Registry UI Summary

**Evidence Registry UI (F8) with tooltip/sheet primitives, EvidenceTypeBadge/SensitivityBadge/ObjectiveCoverageBar, EvidenceListPage with filterable table + coverage bar + gap view + CSV export + 640px Sheet add panel + multi-file drag-drop upload**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-06T21:42:00Z
- **Completed:** 2026-06-06T21:54:00Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Installed shadcn tooltip and sheet components manually (registry unavailable per consistent ECONNRESET pattern from Phases 2–4)
- Built shared evidence primitives: EvidenceTypeBadge (5 type labels), SensitivityBadge (STANDARD/RESTRICTED with Lock icon + tooltip), ObjectiveCoverageBar (8px progressbar with a11y attributes)
- Created useEvidence and useEvidenceCoverage hooks with full ApiResponse pattern
- Built complete Evidence Registry UI: table with 8 columns, loading skeletons, two empty states; filter bar; coverage bar with gap view (collapsible, red dashed cards); Add Evidence 640px Sheet panel; multi-file upload with validation; CSV export with toast
- Wired EvidenceListPage into EngagementShellPage Evidence tab (replacing PlaceholderPanel)
- Wrote 6 Playwright E2E tests covering: list render, restricted-hidden-from-AL, sheet-opens, form-validation, CSV export, coverage bar

## Task Commits

1. **Task 1: Install tooltip+sheet; build evidence primitives and hooks** - `fec442e` (feat)
2. **Task 2: EvidenceTable, AddEvidencePanel, EvidenceListPage, Playwright E2E** - `ccbd47a` (feat)

**Plan metadata:** (docs commit to follow)

_Note: Playwright E2E tests written as artifacts; execution deferred to verify phase per test execution boundary_

## Files Created/Modified
- `frontend/src/components/ui/tooltip.tsx` - shadcn Tooltip (written manually, new-york template)
- `frontend/src/components/ui/sheet.tsx` - shadcn Sheet (written manually, uses @radix-ui/react-dialog)
- `frontend/src/components/evidence/EvidenceTypeBadge.tsx` - Document/Dataset/Interview Note/Meeting Note/Other badge
- `frontend/src/components/evidence/SensitivityBadge.tsx` - STANDARD (gray-100) / RESTRICTED (red-100 + Lock icon + tooltip)
- `frontend/src/components/evidence/ObjectiveCoverageBar.tsx` - 8px progressbar with covered/gap segments + Show/Hide Gaps toggle
- `frontend/src/hooks/useEvidence.ts` - useEvidence + useEvidenceCoverage hooks
- `frontend/src/components/evidence/EvidenceTable.tsx` - 8-column table with loading skeletons and two empty states
- `frontend/src/components/evidence/EvidenceFilterBar.tsx` - Type/sensitivity filters + search + active count badge
- `frontend/src/components/evidence/EvidenceFileUpload.tsx` - Drag-drop zone, MIME/size/count validation, per-file progress
- `frontend/src/components/evidence/AddEvidencePanel.tsx` - 640px Sheet with react-hook-form, 7 fields, objective linking, file upload
- `frontend/src/pages/engagements/EvidenceListPage.tsx` - Coverage bar + gap view + filter bar + table + CSV export
- `frontend/src/pages/EngagementShellPage.tsx` - Evidence tab wired to EvidenceListPage
- `frontend/e2e/evidence-registry.spec.ts` - 6 Playwright E2E tests

## Decisions Made
- **shadcn registry ECONNRESET**: tooltip.tsx and sheet.tsx written manually from official new-york templates. Same decision as Phases 2–4.
- **@radix-ui/react-sheet does not exist**: Sheet uses @radix-ui/react-dialog with slide-in variants (cva) — correct approach per shadcn source.
- **EvidenceFileUpload uses raw fetch()**: For FormData multipart uploads, same rationale as IntakeFileUpload (Phase 3): api.ts forces Content-Type: application/json which breaks file uploads.
- **Playwright tests deferred**: Per test execution boundary, E2E tests written as artifacts only; browser/server execution handled in verify phase.
- **EvidenceListPage as tab content**: Rendered within EngagementShellPage tab (not a standalone route) to use shared engagement context.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] zod v4 API: removed `required_error` parameter**
- **Found during:** Task 2 (build check)
- **Issue:** `z.date({ required_error: 'Required' })` and `z.enum(['standard','restricted'], { required_error: 'Required' })` cause TypeScript errors in zod v4 (parameter removed)
- **Fix:** Used `z.date().refine((d) => !!d, { message: 'Required' })` and `z.enum(['standard', 'restricted'])` per zod v4 API (same fix as Phase 3)
- **Files modified:** frontend/src/components/evidence/AddEvidencePanel.tsx
- **Verification:** Build passes
- **Committed in:** ccbd47a

**2. [Rule 3 - Blocking] Calendar component: removed `initialFocus` prop**
- **Found during:** Task 2 (build check)
- **Issue:** `initialFocus` prop doesn't exist on react-day-picker v10 Calendar type
- **Fix:** Removed `initialFocus={false}` prop (same fix as Phase 3)
- **Files modified:** frontend/src/components/evidence/AddEvidencePanel.tsx
- **Verification:** Build passes
- **Committed in:** ccbd47a

**3. [Rule 3 - Blocking] Unused import/variable TS errors**
- **Found during:** Task 2 (build check)
- **Issue:** `React`, `api`, `watch`, `dateValue` declared but never read
- **Fix:** Removed unused imports and declarations
- **Files modified:** frontend/src/pages/engagements/EvidenceListPage.tsx, frontend/src/components/evidence/AddEvidencePanel.tsx
- **Verification:** Build passes
- **Committed in:** ccbd47a

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All auto-fixes are zod v4/react-day-picker v10 API alignment issues consistent with Phases 2–4. No scope creep.

## Issues Encountered
- shadcn registry unavailable (ECONNRESET) — consistent with all prior phases. Components written manually from new-york templates. No impact on functionality.
- `@radix-ui/react-sheet` does not exist as an npm package — Sheet is a shadcn-only abstraction over @radix-ui/react-dialog with slide-in CSS variants.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- EvidenceTypeBadge and SensitivityBadge are ready for use by Plans 05-05 through 05-07
- EvidenceListPage is functional with full coverage bar, gap view, table, add panel, CSV export
- Tests written; E2E execution deferred to verify phase
- Ready for Plan 05-05 (evidence detail page or findings UI)

## Self-Check: PASSED

All 12 key files verified on disk. Both task commits (fec442e, ccbd47a) confirmed in git log.

---
*Phase: 05-evidence-findings-and-gate-p3*
*Completed: 2026-06-06*
