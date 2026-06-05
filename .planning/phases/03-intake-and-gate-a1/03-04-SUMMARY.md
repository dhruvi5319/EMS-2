---
phase: 03-intake-and-gate-a1
plan: "04"
subsystem: ui
tags: [react, file-upload, drag-drop, playwright, request-detail, shadcn]

# Dependency graph
requires:
  - phase: 03-intake-and-gate-a1
    provides: "POST /api/requests/:id/intake-document, DELETE /api/requests/:id/intake-document, GET /api/requests/:id (Plan 03-01)"
provides:
  - "IntakeFileUpload component: drag-drop zone, 25MB/MIME validation, progress bar, success chip, replace behavior, error states"
  - "RequestDetailPage: read-only field grid, intake document card with Download, Gate A1 slot, Edit/Audit links"
  - "RequestFormPage: react-hook-form + zod, all F2 fields, Save as Draft, Submit with validation, IntakeFileUpload in edit mode"
  - "RequestListPage: status filter tabs, sortable table, empty states, + New Request CTA"
  - "RequestStatusBadge: 4 status variants (draft/submitted/accepted/declined)"
  - "useRequests/useRequest hooks + createRequest/updateRequest/submitRequest mutations"
  - "App.tsx routes: /requests, /requests/new, /requests/:id/edit, /requests/:id"
  - "Playwright E2E tests: request-detail.spec.ts (4 tests), file-upload.spec.ts (5 tests)"
affects: ["03-05"]

# Tech tracking
tech-stack:
  added: [react-hook-form, "@hookform/resolvers", zod, react-day-picker]
  patterns:
    - "IntakeFileUpload: fetch FormData directly (not through api.ts wrapper) for multipart upload support"
    - "Client-side file validation before upload: MIME type check + size check, error surfaced via role=alert"
    - "RequestDetailPage: Gate A1 section uses data-section=gate-a1 slot for Plan 03-05 injection"
    - "RequestFormPage: IntakeFileUploadPlaceholder pattern avoids circular imports"

key-files:
  created:
    - frontend/src/components/requests/IntakeFileUpload.tsx
    - frontend/src/components/requests/RequestStatusBadge.tsx
    - frontend/src/pages/requests/RequestDetailPage.tsx
    - frontend/src/pages/requests/RequestFormPage.tsx
    - frontend/src/pages/requests/RequestListPage.tsx
    - frontend/src/hooks/useRequests.ts
    - frontend/src/components/ui/progress.tsx
    - frontend/src/components/ui/separator.tsx
    - frontend/src/components/ui/tabs.tsx
    - frontend/src/components/ui/textarea.tsx
    - frontend/src/components/ui/alert.tsx
    - frontend/src/components/ui/calendar.tsx
    - frontend/src/components/ui/form.tsx
    - frontend/src/components/ui/label.tsx
    - frontend/src/components/ui/popover.tsx
    - frontend/src/components/ui/radio-group.tsx
    - frontend/e2e/request-detail.spec.ts
    - frontend/e2e/file-upload.spec.ts
  modified:
    - frontend/src/App.tsx
    - frontend/package.json

key-decisions:
  - "shadcn registry unavailable (ECONNRESET) — shadcn components written manually from official templates, exact contract parity maintained"
  - "IntakeFileUpload uses raw fetch (not api.ts wrapper) for FormData/multipart support"
  - "Zod v4 uses message instead of required_error for date validation"
  - "Calendar initialFocus prop removed (not supported in installed react-day-picker version)"
  - "Plan 03-03 prerequisites (useRequests, RequestStatusBadge, RequestListPage) found uncommitted in working tree — included in this plan's commit"
  - "Playwright tests written as artifacts; E2E execution deferred to verify phase (requires full running stack)"

patterns-established:
  - "File upload pattern: direct fetch with FormData, clearInterval on both success and error, setTimeout for progress completion visual"
  - "Gate A1 slot pattern: data-section=gate-a1 div placeholder in RequestDetailPage for Plan 03-05 injection"

# Metrics
duration: 7min
completed: 2026-06-05
---

# Phase 3 Plan 04: Request Detail and File Upload Summary

**IntakeFileUpload drag-drop component with 25MB/MIME validation + RequestDetailPage read-only hub with Gate A1 slot, plus full react-hook-form RequestFormPage and Playwright E2E test suite**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-05T20:45:23Z
- **Completed:** 2026-06-05T20:52:58Z
- **Tasks:** 2 completed
- **Files modified:** 20 files

## Accomplishments
- `IntakeFileUpload` component: 5 states (idle dashed zone, drag-over blue highlight, uploading progress bar, success green chip, error red text), WCAG role=region + aria-label + role=progressbar + role=alert
- `RequestDetailPage`: read-only field grid with breadcrumb, type/status badges, intake document card (Download ↓ or "No intake document attached."), Gate A1 Decision slot, Edit Request (draft+AL/AD only), View Audit Trail link
- `RequestFormPage`: react-hook-form + zod schema, all 6 F2 fields, Save as Draft (draft-only validation), Submit Request (full validation), past-due warning, char counters
- Complete shadcn UI component set installed (manually from templates due to network unavailability): progress, separator, tabs, textarea, alert, calendar, popover, form, label, radio-group

## Task Commits

Each task was committed atomically:

1. **Task 1: IntakeFileUpload + RequestDetailPage + routes** - `83bc15e` (feat)
2. **Task 2: Playwright E2E for request detail + file upload** - `812de0e` (feat)

**Plan metadata:** (docs commit — see final commit)

_Note: E2E tests written as artifacts; execution deferred to verify phase per test execution boundary_

## Files Created/Modified
- `frontend/src/components/requests/IntakeFileUpload.tsx` - Drag-drop upload: idle/drag-over/uploading/success/error states, 25MB/MIME validation
- `frontend/src/components/requests/RequestStatusBadge.tsx` - Status badge: 4 variants with semantic colors
- `frontend/src/pages/requests/RequestDetailPage.tsx` - Read-only request hub with intake doc card, Gate A1 slot, Edit/Audit links
- `frontend/src/pages/requests/RequestFormPage.tsx` - New/edit form: react-hook-form, zod, IntakeFileUpload integration
- `frontend/src/pages/requests/RequestListPage.tsx` - Request list with status tabs and sortable table
- `frontend/src/hooks/useRequests.ts` - useRequests/useRequest hooks + CRUD mutations
- `frontend/src/App.tsx` - Added /requests/:id route and RequestDetailPage import
- `frontend/e2e/request-detail.spec.ts` - 4 Playwright tests: audit trail, URL, intake card, section headers
- `frontend/e2e/file-upload.spec.ts` - 5 Playwright tests: drop zone, Browse files, type error, size error, success chip
- `frontend/src/components/ui/progress.tsx` - shadcn Progress component
- `frontend/src/components/ui/separator.tsx` - shadcn Separator component
- `frontend/src/components/ui/tabs.tsx` - shadcn Tabs component
- Plus 6 more shadcn UI components (alert, calendar, form, label, popover, radio-group)

## Decisions Made
- shadcn CLI unavailable (ECONNRESET network failure) — components manually written from official new-york templates (same pattern as Phase 2 Plan 02-01)
- `IntakeFileUpload` uses raw `fetch()` with FormData instead of `api.ts` wrapper — api.ts forces `Content-Type: application/json` which would break multipart uploads
- Zod v4 changed `required_error` → `message` for `z.date()` validation options
- Calendar component's `initialFocus` prop removed — not supported in installed react-day-picker version
- Plan 03-03 prerequisites found uncommitted in working tree — bundled into this plan's Task 1 commit rather than creating orphaned files

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Plan 03-03 prerequisites uncommitted in working tree**
- **Found during:** Pre-execution dependency check
- **Issue:** useRequests.ts, RequestStatusBadge.tsx, RequestListPage.tsx, all shadcn components existed on disk but were never committed (03-03 has no SUMMARY)
- **Fix:** Bundled all 03-03 prerequisite files into Task 1 commit along with 03-04 artifacts
- **Files modified:** frontend/src/hooks/useRequests.ts, frontend/src/components/requests/RequestStatusBadge.tsx, frontend/src/pages/requests/RequestListPage.tsx, 9 shadcn UI components
- **Verification:** TypeScript build passes cleanly
- **Committed in:** 83bc15e (Task 1 commit)

**2. [Rule 3 - Blocking] shadcn registry unavailable (ECONNRESET)**
- **Found during:** Task 1 (installing missing shadcn components)
- **Issue:** `npx shadcn add progress separator ...` fails with ECONNRESET — no network access to shadcn registry
- **Fix:** Wrote progress.tsx and separator.tsx manually from official shadcn/new-york templates (same approach used in Phase 2 Plan 02-01)
- **Files modified:** frontend/src/components/ui/progress.tsx, frontend/src/components/ui/separator.tsx
- **Verification:** TypeScript imports succeed, build passes
- **Committed in:** 83bc15e (Task 1 commit)

**3. [Rule 1 - Bug] Zod v4 API change: required_error → message**
- **Found during:** Task 1 (TypeScript type check)
- **Issue:** `z.date({ required_error: 'Due date is required.' })` fails TypeScript in Zod v4 — property renamed
- **Fix:** Changed to `z.date({ message: 'Due date is required.' })`
- **Files modified:** frontend/src/pages/requests/RequestFormPage.tsx
- **Verification:** TypeScript build passes
- **Committed in:** 83bc15e (Task 1 commit)

**4. [Rule 1 - Bug] Calendar initialFocus prop not supported**
- **Found during:** Task 1 (TypeScript type check)
- **Issue:** `<Calendar initialFocus />` TypeScript error — installed react-day-picker version doesn't support this prop
- **Fix:** Removed initialFocus prop — calendar opens without auto-focus (functionally acceptable)
- **Files modified:** frontend/src/pages/requests/RequestFormPage.tsx
- **Verification:** TypeScript build passes
- **Committed in:** 83bc15e (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (2 blocking infrastructure, 2 bug fixes)
**Impact on plan:** All auto-fixes necessary for correctness and buildability. No scope creep.

## Issues Encountered
- E2E Playwright tests cannot be run during execute phase (test execution boundary — requires full running stack with browser). Tests written as artifacts; execution deferred to verify phase.
- Pre-existing TypeScript warning in TopBar.tsx (unused GlobalSearchBar import) — out of scope, not modified

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- F2 intake workflow complete: Request list, form (new/edit), detail view, file upload
- RequestDetailPage has `data-section="gate-a1"` slot ready for Plan 03-05 GateA1Panel injection
- Plan 03-05 (Gate A1 UI) can now embed GateA1Panel into the established slot

## Self-Check: PASSED

All key files verified present on disk:
- ✓ `frontend/src/components/requests/IntakeFileUpload.tsx`
- ✓ `frontend/src/pages/requests/RequestDetailPage.tsx`
- ✓ `frontend/src/pages/requests/RequestFormPage.tsx`
- ✓ `frontend/e2e/request-detail.spec.ts`
- ✓ `frontend/e2e/file-upload.spec.ts`
- ✓ `.planning/phases/03-intake-and-gate-a1/03-04-SUMMARY.md`

Both task commits confirmed in git log:
- ✓ `83bc15e` — feat(03-04): IntakeFileUpload component + RequestDetailPage + routes
- ✓ `812de0e` — feat(03-04): Playwright E2E tests for request detail and file upload

---
*Phase: 03-intake-and-gate-a1*
*Completed: 2026-06-05*
