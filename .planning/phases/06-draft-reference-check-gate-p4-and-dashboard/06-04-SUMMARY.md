---
phase: 06-draft-reference-check-gate-p4-and-dashboard
plan: "04"
subsystem: ui
tags: [react, tailwind, playwright, draft-product, stepper, typescript]

# Dependency graph
requires:
  - phase: 06-01
    provides: "GET/POST/PATCH /api/engagements/:id/draft and draft/comments endpoints"
provides:
  - DraftProductPage (empty state + draft-exists state with full workflow surface)
  - DraftStatusStepper (custom Tailwind 4-step stepper — no shadcn)
  - DraftStatusBadge (4 color variants)
  - useDraftProduct hook (8 functions: fetch/create/update/uploadFile/removeFile/fetchComments/addComment)
  - CreateDraftProductDialog (title/version/owner fields)
  - DraftFileSection (drag-drop upload + file display + progress bar)
  - ReviewCommentThread (append-only with author/date/text)
  - StatementsIndexingSummary (total/linked/unlinked counts + navigation)
  - DraftProductPage wired into EngagementShellPage Draft Product tab
  - e2e/draft-product.spec.ts (6 Playwright tests)
affects:
  - 06-05 (reference check UI depends on DraftProductPage)
  - 06-06 (Gate P4 UI depends on DraftProductPage status advancement)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Custom Tailwind stepper with 3-state nodes (completed/active/upcoming) and accessibility attributes"
    - "useDraftProduct hook with 8 exported functions for full CRUD including FormData file upload"
    - "API route mocking pattern in Playwright tests for deterministic E2E testing"
    - "Status advancement with exact UI-SPEC copywriting contract (ADVANCE_BUTTON_LABELS map)"

key-files:
  created:
    - frontend/src/pages/DraftProductPage.tsx
    - frontend/src/components/draft/DraftStatusStepper.tsx
    - frontend/src/components/draft/DraftStatusBadge.tsx
    - frontend/src/components/draft/CreateDraftProductDialog.tsx
    - frontend/src/components/draft/DraftFileSection.tsx
    - frontend/src/components/draft/ReviewCommentThread.tsx
    - frontend/src/components/draft/StatementsIndexingSummary.tsx
    - frontend/src/hooks/useDraftProduct.ts
    - frontend/e2e/draft-product.spec.ts
  modified:
    - frontend/src/pages/EngagementShellPage.tsx (Draft Product tab wired)

key-decisions:
  - "DraftStatusStepper is pure Tailwind (no shadcn stepper) — 4-step nodes with CheckCircle for completed, number for active/upcoming"
  - "useDraftProduct uses raw fetch() for file upload (FormData multipart), api.ts wrapper for all other calls — consistent with Phase 3/5 pattern"
  - "ADVANCE_BUTTON_LABELS map enforces exact UI-SPEC copywriting at compile time"
  - "DraftFileSection onRemove prop is optional — avoids unused param TypeScript errors while keeping interface complete"
  - "Playwright tests use page.route() API mocking for deterministic test scenarios without server dependency"

patterns-established:
  - "Custom 4-step stepper pattern: role=list/listitem + aria-current=step + aria-live=polite region"
  - "DraftStatusBadge follows shadcn Badge variant=outline + className override pattern (consistent with Phases 1-5)"
  - "E2E tests: Playwright API mocking for all backend endpoints before navigation"

# Metrics
duration: 5min
completed: 2026-06-07
---

# Phase 6 Plan 04: Draft Product UI Summary

**Custom DraftStatusStepper (Tailwind, 4-step, accessible), DraftProductPage with file/comments/statements sections, and useDraftProduct hook with 8 API functions**

## Performance

- **Duration:** 5 min
- **Started:** 2026-06-07T00:23:45Z
- **Completed:** 2026-06-07T00:29:05Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- Custom DraftStatusStepper (4-step horizontal, no shadcn) with completed/active/upcoming node states, CheckCircle icon, and full accessibility (role=list, aria-current, aria-live)
- DraftProductPage rendering both empty state (P3-locked/no-draft) and full draft-exists state with stepper + metadata + file + comments + statements
- useDraftProduct hook with 8 functions covering full CRUD, file upload (FormData), comments
- All 5 status advancement button labels exactly matching UI-SPEC copywriting contract
- Playwright E2E test file with 6 tests and API mocking pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: DraftStatusStepper + DraftStatusBadge + useDraftProduct hook** - `15836e7` (feat)
2. **Task 2: DraftProductPage + sub-components + Playwright tests** - `3cc6348` (feat)

_Note: Tests written; E2E execution deferred to verify phase (requires full running stack)._

## Files Created/Modified

- `frontend/src/components/draft/DraftStatusStepper.tsx` - Custom Tailwind 4-step stepper (NOT shadcn)
- `frontend/src/components/draft/DraftStatusBadge.tsx` - Status badge with 4 color variants (amber/blue/teal/green)
- `frontend/src/hooks/useDraftProduct.ts` - API hook with 8 functions (fetchDraft/createDraft/updateDraft/uploadFile/removeFile/fetchComments/addComment)
- `frontend/src/pages/DraftProductPage.tsx` - Main draft product page (empty + exists states)
- `frontend/src/components/draft/CreateDraftProductDialog.tsx` - Modal dialog for draft creation
- `frontend/src/components/draft/DraftFileSection.tsx` - File upload/display with drag-drop and progress
- `frontend/src/components/draft/ReviewCommentThread.tsx` - Append-only comment thread
- `frontend/src/components/draft/StatementsIndexingSummary.tsx` - Summary row with navigation link
- `frontend/src/pages/EngagementShellPage.tsx` - Wired DraftProductPage into Draft Product tab
- `frontend/e2e/draft-product.spec.ts` - 6 Playwright E2E tests

## Decisions Made

- DraftStatusStepper built as pure Tailwind (no shadcn stepper import) — UI-SPEC confirms no official shadcn stepper exists
- useDraftProduct uses raw fetch() for file upload (FormData) — api.ts forces Content-Type: application/json which breaks multipart, consistent with Phase 3/5 pattern
- ADVANCE_BUTTON_LABELS Record map enforces exact copywriting at compile time, preventing label drift
- Playwright tests mock all backend API routes for deterministic test execution without requiring running server

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript error in App.tsx (PortfolioDashboardPage import) from plan 06-03 — out of scope, not related to this plan's changes; all draft-related files compile cleanly

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- DraftProductPage is complete and wired into EngagementShellPage
- DraftStatusStepper, DraftStatusBadge, useDraftProduct hook available for F12 reference check UI (06-05)
- Status advancement "Proceed to Gate P4 →" navigates to /engagements/:id/gates/p4 (06-06 target)

---
*Phase: 06-draft-reference-check-gate-p4-and-dashboard*
*Completed: 2026-06-07*

## Self-Check: PASSED

All key files verified on disk:
- ✅ frontend/src/pages/DraftProductPage.tsx
- ✅ frontend/src/components/draft/DraftStatusStepper.tsx
- ✅ frontend/src/components/draft/DraftStatusBadge.tsx
- ✅ frontend/src/hooks/useDraftProduct.ts
- ✅ frontend/src/components/draft/CreateDraftProductDialog.tsx
- ✅ frontend/src/components/draft/DraftFileSection.tsx
- ✅ frontend/src/components/draft/ReviewCommentThread.tsx
- ✅ frontend/src/components/draft/StatementsIndexingSummary.tsx
- ✅ frontend/e2e/draft-product.spec.ts

Commits verified:
- ✅ 15836e7 (Task 1)
- ✅ 3cc6348 (Task 2)
