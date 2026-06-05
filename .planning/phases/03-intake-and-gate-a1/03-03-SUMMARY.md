---
phase: 03-intake-and-gate-a1
plan: "03"
subsystem: ui
tags: [react, react-hook-form, zod, shadcn, playwright, request-list, request-form, radix-ui, tailwind]

# Dependency graph
requires:
  - phase: 03-intake-and-gate-a1
    provides: "GET/POST/PATCH /api/requests, POST /api/requests/:id/submit (Plan 03-01)"
  - phase: 01-foundation
    provides: "AuthContext, api.ts, AppShell, routing guards"
  - phase: 02-application-shell
    provides: "shadcn initialization, components.json, CSS variable tokens"
provides:
  - "RequestListPage: /requests with status filter tabs, sortable table, empty states, + New Request CTA"
  - "RequestFormPage: /requests/new and /requests/:id/edit with all F2 fields and validation"
  - "RequestStatusBadge: 4 status variants (draft/submitted/accepted/declined)"
  - "useRequests hook: fetch list + single request, createRequest/updateRequest/submitRequest mutations"
  - "shadcn components: tabs, textarea, calendar, popover, alert, form, label, radio-group"
  - "Playwright E2E tests: request-list.spec.ts (6 tests), request-form.spec.ts (7 tests)"
affects: ["03-04", "03-05"]

# Tech tracking
tech-stack:
  added: [react-hook-form, "@hookform/resolvers", zod, react-day-picker, "@radix-ui/react-tabs", "@radix-ui/react-progress", "@radix-ui/react-radio-group", date-fns]
  patterns:
    - "react-hook-form + zodResolver: form validation with onBlur trigger + canSaveDraft/canSubmit derived state"
    - "Calendar with react-day-picker v10: Chevron component API (not IconLeft/IconRight)"
    - "Status filter tabs using shadcn Tabs: value='' for All, specific status string for filters"
    - "Sticky form actions bar: sticky bottom-0 bg-white border-t (64px height)"

key-files:
  created:
    - frontend/src/pages/requests/RequestListPage.tsx
    - frontend/src/pages/requests/RequestFormPage.tsx
    - frontend/src/components/requests/RequestStatusBadge.tsx
    - frontend/src/hooks/useRequests.ts
    - frontend/src/components/ui/tabs.tsx
    - frontend/src/components/ui/textarea.tsx
    - frontend/src/components/ui/calendar.tsx
    - frontend/src/components/ui/popover.tsx
    - frontend/src/components/ui/alert.tsx
    - frontend/src/components/ui/form.tsx
    - frontend/src/components/ui/label.tsx
    - frontend/src/components/ui/radio-group.tsx
    - frontend/e2e/request-list.spec.ts
    - frontend/e2e/request-form.spec.ts
  modified:
    - frontend/src/App.tsx
    - frontend/src/lib/api.ts
    - frontend/src/components/layout/TopBar.tsx

key-decisions:
  - "react-day-picker v10 installed (not v8/v9): Chevron component API used instead of deprecated IconLeft/IconRight"
  - "zod v4 installed: z.date().optional() pattern used instead of required_error parameter"
  - "shadcn CLI had ECONNRESET network failure: components written manually from official new-york templates"
  - "PATCH method added to api.ts: required by useRequests updateRequest mutation"
  - "E2E tests deferred to verify phase: request-list.spec.ts and request-form.spec.ts written as artifacts"

patterns-established:
  - "Form data type casting: FormValues.request_type cast to RequestTypeValue enum on save/submit"
  - "Char counter pattern: watch() + .length / max displayed below textarea"
  - "canSaveDraft/canSubmit derived booleans from watched form values for button enable state"

# Metrics
duration: 8min
completed: 2026-06-05
---

# Phase 3 Plan 03: Request List + Form UI Summary

**Request intake UI with react-hook-form + zod validation, shadcn Calendar/Tabs/Select/Popover, sortable request table with status filter tabs, and Playwright E2E tests**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-05T20:44:58Z
- **Completed:** 2026-06-05T20:53:44Z
- **Tasks:** 2 completed
- **Files modified:** 17

## Accomplishments
- RequestListPage: status filter tabs (All/Draft/Submitted/Accepted/Declined), sortable 7-column table, empty states ("No requests yet." + "No {status} requests."), + New Request CTA for AL/AD roles
- RequestFormPage: all F2 fields (Request Type Select, Requester, Agency/Program, Topic Textarea, Due Date Calendar/Popover, Notes), Save as Draft (request_type only required), Submit validation (5 required fields), past-due yellow warning, character counters
- RequestStatusBadge: 4 semantic status variants with correct UI-SPEC colors
- useRequests hook: typed RequestRecord, useRequests/useRequest hooks, createRequest/updateRequest/submitRequest mutations, api.patch() added
- 13 Playwright E2E tests across 2 spec files covering all F2 behaviors

## Task Commits

Each task was committed atomically:

1. **Task 1: shadcn components + RequestStatusBadge + useRequests + RequestListPage + App.tsx routes** - `ad99361` (feat)
2. **Task 2: RequestFormPage + Playwright E2E tests** - `1344f52` (feat)

_Note: Implementation files for both tasks were pre-committed by a previous agent (83bc15e) that bundled 03-03 and 03-04. Task commits here reflect the TypeScript fixes and E2E test additions._

## Files Created/Modified
- `frontend/src/hooks/useRequests.ts` - RequestRecord type, useRequests/useRequest hooks, createRequest/updateRequest/submitRequest mutations
- `frontend/src/components/requests/RequestStatusBadge.tsx` - 4 status variants: draft=gray, submitted=yellow, accepted=green, declined=red
- `frontend/src/pages/requests/RequestListPage.tsx` - Status tabs, sortable table, empty states, + New Request CTA
- `frontend/src/pages/requests/RequestFormPage.tsx` - react-hook-form + zod, all F2 fields, Save as Draft, Submit validation, past-due warning, char counters
- `frontend/src/components/ui/tabs.tsx` - shadcn Tabs (new-york style, @radix-ui/react-tabs)
- `frontend/src/components/ui/textarea.tsx` - shadcn Textarea
- `frontend/src/components/ui/calendar.tsx` - shadcn Calendar (react-day-picker v10 API)
- `frontend/src/components/ui/popover.tsx` - shadcn Popover
- `frontend/src/components/ui/alert.tsx` - shadcn Alert + AlertTitle + AlertDescription
- `frontend/src/components/ui/form.tsx` - shadcn Form with react-hook-form integration
- `frontend/src/components/ui/label.tsx` - shadcn Label
- `frontend/src/components/ui/radio-group.tsx` - shadcn RadioGroup (for Plan 03-05 Gate A1)
- `frontend/src/lib/api.ts` - Added PATCH method
- `frontend/src/App.tsx` - Routes for /requests, /requests/new, /requests/:id/edit
- `frontend/src/components/layout/TopBar.tsx` - Removed unused GlobalSearchBar import (Rule 1 fix)
- `frontend/e2e/request-list.spec.ts` - 6 Playwright tests: heading, tabs, empty state, New Request button, navigation, tab filter
- `frontend/e2e/request-form.spec.ts` - 7 Playwright tests: form render, Save disabled, type enables Save, Submit disabled, validation, past-due warning, char counter

## Decisions Made
- react-day-picker v10 API: Used Chevron component instead of deprecated IconLeft/IconRight; removed `initialFocus` prop (not supported in v10)
- zod v4 API: Used `z.date().optional()` + runtime check instead of `{ required_error }` parameter (removed in v4)
- shadcn CLI unavailable (ECONNRESET): All component files written manually from official new-york style templates
- PATCH method added to api.ts: Required by updateRequest() mutation in useRequests.ts

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused GlobalSearchBar import from TopBar.tsx**
- **Found during:** Task 1 TypeScript check
- **Issue:** `import { GlobalSearchBar } from '@/components/search/GlobalSearchBar'` was imported but never used in JSX, causing TS6133 error
- **Fix:** Removed the unused import
- **Files modified:** frontend/src/components/layout/TopBar.tsx
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** ad99361 (Task 1 commit)

**2. [Rule 3 - Blocking] Calendar component rewritten for react-day-picker v10 API**
- **Found during:** Task 1 TypeScript check
- **Issue:** shadcn Calendar template used v8 classNames API (`caption`, `nav_button`, `IconLeft`/`IconRight` components) which don't exist in v10
- **Fix:** Rewrote Calendar to use v10 API (`month_caption`, `button_previous`/`button_next`, `Chevron` component)
- **Files modified:** frontend/src/components/ui/calendar.tsx
- **Verification:** TypeScript clean, Calendar renders in RequestFormPage
- **Committed in:** ad99361 (Task 1 commit)

**3. [Rule 3 - Blocking] zod v4 API compatibility in RequestFormPage**
- **Found during:** Task 2 TypeScript check
- **Issue:** `z.date({ required_error: '...' })` syntax removed in zod v4; `required_error` not a valid option
- **Fix:** Changed to `z.date().optional()` with runtime validation in onSubmit handler
- **Files modified:** frontend/src/pages/requests/RequestFormPage.tsx
- **Verification:** TypeScript clean
- **Committed in:** ad99361 (Task 1 commit)

**4. [Rule 3 - Blocking] shadcn CLI unavailable (ECONNRESET)**
- **Found during:** Task 1 shadcn component installation
- **Issue:** `npx shadcn@latest add ...` failed with ECONNRESET on `https://ui.shadcn.com/r/styles/new-york/form.json`
- **Fix:** All required components written manually from official new-york templates
- **Files modified:** tabs.tsx, textarea.tsx, calendar.tsx, popover.tsx, alert.tsx, form.tsx, label.tsx, radio-group.tsx
- **Verification:** TypeScript clean, build passes
- **Committed in:** ad99361 (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (1 bug, 3 blocking)
**Impact on plan:** All auto-fixes required for TypeScript compliance and correct library API usage. No scope creep. Plan intent fully preserved.

## Issues Encountered
- Previous agent (commit 83bc15e) had already committed implementation files for both plans 03-03 and 03-04 before this plan was executed. This plan's commits therefore added the missing E2E test files and TypeScript fixes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Request list and form UI complete with all F2 behaviors implemented
- Plan 03-04 (file upload + request detail) already committed in 83bc15e
- Ready for Plan 03-05: Gate A1 review panel (GateA1Panel, risk level radio group, rationale textarea, approve/decline confirm dialogs)

## Self-Check: PASSED

All 8 key files verified present on disk. Both task commits (ad99361, 1344f52) confirmed in git log.

---
*Phase: 03-intake-and-gate-a1*
*Completed: 2026-06-05*
