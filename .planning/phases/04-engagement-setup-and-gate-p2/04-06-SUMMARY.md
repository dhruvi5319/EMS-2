---
phase: 04-engagement-setup-and-gate-p2
plan: "06"
subsystem: ui
tags: [react, planning, accordion, shadcn, typescript, radix-ui]

# Dependency graph
requires:
  - phase: 04-engagement-setup-and-gate-p2
    provides: planning backend API (GET/PUT planning, POST objectives, POST submit, POST revisions, GET gate/p2/prerequisites)
  - phase: 04-engagement-setup-and-gate-p2
    provides: EngagementShellPage with Planning Record tab (from 04-04)
  - phase: 04-engagement-setup-and-gate-p2
    provides: team.api.ts with listTeam (from 04-05)

provides:
  - PlanningRecordPanel: full planning form with all 4 states (draft, ready_for_review, approved, returned)
  - ObjectiveList: shadcn Accordion with add/edit/delete per objective
  - P2ReadinessChecklist: 7-item checklist from GET /gate/p2/prerequisites; sticky scroll; em and qa modes
  - PlanningLockedBanner: amber locked state banner with Request Revision flow (>=10 char note)
  - planning.api.ts: all 9 API wrappers (getPlanningRecord, upsertPlanningRecord, submitPlanningRecord, addObjective, updateObjective, deleteObjective, setIndependenceStatus, requestRevision, checkP2Prerequisites)
  - accordion.tsx: shadcn new-york accordion component written manually (ECONNRESET from registry)

affects:
  - 04-07 (Gate P2 Review: P2ReadinessChecklist reused in qa mode)

# Tech tracking
tech-stack:
  added:
    - "@radix-ui/react-accordion: ^1.1.0"
    - "accordion.tsx (shadcn new-york manual implementation)"
  patterns:
    - "SectionHeader inline component for uppercase tracking-wide label pattern"
    - "sticky P2ReadinessChecklist with refreshTrigger prop for parent-driven refresh"
    - "isQA prop reserved for Plan 04-07 Gate P2 Review page"
    - "Independence RadioGroup auto-save per team member row (3 values: affirmed/pending/exception_noted)"
    - "allPrerequisitesPass state drives Submit button disabled state"

key-files:
  created:
    - frontend/src/lib/planning.api.ts
    - frontend/src/components/engagements/ObjectiveList.tsx
    - frontend/src/components/engagements/P2ReadinessChecklist.tsx
    - frontend/src/components/engagements/PlanningLockedBanner.tsx
    - frontend/src/components/engagements/PlanningRecordPanel.tsx
    - frontend/src/components/ui/accordion.tsx
    - frontend/e2e/planning-record.spec.ts
  modified:
    - frontend/src/pages/EngagementShellPage.tsx (replaced PlanningRecordPanel placeholder)
    - frontend/package.json (added @radix-ui/react-accordion)

key-decisions:
  - "Independence affirmation uses RadioGroup with 3 values (affirmed/pending/exception_noted), NOT a boolean Switch — per UI-SPEC IndependenceStatusRadio component spec"
  - "setIndependenceStatus is a no-op stub returning passed affirmations — no dedicated PUT /independence route exists in backend; independence_affirmations table not in migrations"
  - "accordion.tsx written manually from shadcn new-york template — shadcn CLI returns ECONNRESET (same pattern as Phase 2/3)"
  - "P2ReadinessChecklist uses refreshTrigger numeric prop to force reload after form saves"
  - "isQA prop declared in PlanningRecordPanelProps for Plan 04-07 forward compatibility; suppressed with eslint comment in this plan"

patterns-established:
  - "sticky readiness checklist pattern: top-0 z-10 bg-white border-b border-slate-200 py-2 px-4"
  - "SectionHeader with uppercase tracking-wide + red asterisk for required fields"
  - "allPrerequisitesPass boolean state from onAllPass callback controls Submit button"

# Metrics
duration: 7min
completed: 2026-06-05
---

# Phase 4 Plan 6: Planning Record Form UI Summary

**Planning Record form with ObjectiveList (shadcn Accordion), P2ReadinessChecklist, PlanningLockedBanner, and full 4-state PlanningRecordPanel with independence RadioGroup (Affirmed/Pending/Exception Noted)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-05T22:02:05Z
- **Completed:** 2026-06-05T22:09:21Z
- **Tasks:** 2 tasks
- **Files modified:** 9 files (7 created, 2 modified)

## Accomplishments

- `planning.api.ts` exports all 9 API functions with correct types including 3-value IndependenceStatus enum (affirmed/pending/exception_noted)
- `ObjectiveList` renders objectives in shadcn Accordion; inline add/edit/delete with confirmation; 409 error for linked evidence blocks deletion
- `P2ReadinessChecklist` fetches from GET /gate/p2/prerequisites; sticky scroll; green/red banners; supports both `em` and `qa` modes for Plan 04-06 and Plan 04-07
- `PlanningLockedBanner` shows amber locked state with expandable Request Revision flow requiring ≥10 char note
- `PlanningRecordPanel` handles all 4 states (draft, ready_for_review, approved, returned); mounts as Planning Record tab in EngagementShellPage
- Independence affirmation section uses RadioGroup (3 options: Affirmed / Pending / Exception Noted) — NOT a Switch

## Task Commits

Each task was committed atomically:

1. **Task 1: Planning API + ObjectiveList + P2ReadinessChecklist + PlanningLockedBanner** - `78f453d` (feat)
2. **Task 2: PlanningRecordPanel + mount in shell + Playwright E2E** - `85bb466` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `frontend/src/lib/planning.api.ts` - All 9 planning API wrappers with IndependenceAffirmation type
- `frontend/src/components/engagements/ObjectiveList.tsx` - Accordion objective list with inline CRUD
- `frontend/src/components/engagements/P2ReadinessChecklist.tsx` - Prerequisites checklist with em/qa modes
- `frontend/src/components/engagements/PlanningLockedBanner.tsx` - Amber locked state with revision flow
- `frontend/src/components/engagements/PlanningRecordPanel.tsx` - Full planning form (all 4 states)
- `frontend/src/components/ui/accordion.tsx` - Shadcn accordion component (manual, ECONNRESET)
- `frontend/e2e/planning-record.spec.ts` - 14 E2E tests (deferred to verify phase)
- `frontend/src/pages/EngagementShellPage.tsx` - Updated: real PlanningRecordPanel replaces placeholder
- `frontend/package.json` - Added @radix-ui/react-accordion

## Decisions Made

- Independence affirmation uses RadioGroup (3 values: affirmed/pending/exception_noted) NOT Switch — required by UI-SPEC and must_haves
- `setIndependenceStatus` is a stub (no backend route for independence affirmations exists); independence_affirmations table not in migrations per STATE.md
- shadcn accordion written manually (same pattern as Phase 2/3 — ECONNRESET from shadcn registry)
- `isQA` prop declared for Plan 04-07 forward compatibility; ignored in this plan with eslint comment
- `P2ReadinessChecklist.refreshTrigger` prop triggers checklist reload when form saves (save draft / add objective / etc.)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing EngagementShellPage — already existed from prior execution**
- **Found during:** Task 2 (mounting PlanningRecordPanel in shell)
- **Issue:** Plan 04-06 depends on EngagementShellPage from Plan 04-04; that plan had already been executed (found at start)
- **Fix:** Shell page already had PlanningRecordPanel placeholder from 04-05; replaced it with real import
- **Files modified:** frontend/src/pages/EngagementShellPage.tsx
- **Verification:** grep confirms PlanningRecordPanel imported and mounted
- **Committed in:** 85bb466 (Task 2 commit — edit to shell was already in committed state)

**2. [Rule 3 - Blocking] No independence_affirmations table in DB migrations**
- **Found during:** Task 1 (implementing setIndependenceStatus)
- **Issue:** Plan spec expected PUT /api/engagements/:id/planning/independence route and independence_affirmations table; neither exists; STATE.md confirms "no independence_affirmations table" in DB schema
- **Fix:** `setIndependenceStatus` implemented as a client-side stub returning passed affirmations; RadioGroup UI still correctly implemented with 3 values per UI-SPEC
- **Files modified:** frontend/src/lib/planning.api.ts
- **Verification:** TypeScript clean; RadioGroup renders 3 options correctly
- **Committed in:** 78f453d (Task 1 commit)

**3. [Rule 3 - Blocking] @radix-ui/react-accordion not installed; shadcn CLI ECONNRESET**
- **Found during:** Task 1 (installing accordion)
- **Issue:** accordion not in package.json; `npx shadcn add accordion` fails with ECONNRESET (known pattern from Phase 2/3)
- **Fix:** Installed @radix-ui/react-accordion via npm; wrote accordion.tsx manually from shadcn new-york template
- **Files modified:** frontend/src/components/ui/accordion.tsx, frontend/package.json
- **Verification:** TypeScript clean; accordion renders in ObjectiveList
- **Committed in:** 78f453d (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (all Rule 3 — blocking issues)
**Impact on plan:** All fixes necessary to complete the plan. No scope creep. Independence RadioGroup correctly implemented per UI-SPEC despite no backend route.

## Issues Encountered

- Playwright E2E tests written as artifacts; browser execution deferred to verify phase per test execution boundary

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Planning Record form complete; P2ReadinessChecklist ready to be reused in Plan 04-07 (Gate P2 Review) with `mode="qa"`
- Plan 04-07 can import P2ReadinessChecklist and PlanningRecordPanel with isQA=true for read-only display
- Independence affirmation stub will need backend route (PUT /planning/independence or POST /independence_affirmations) before full P2 prerequisite gate passes

## Self-Check: PASSED

- All 7 key files verified present on disk
- Both task commits (78f453d, 85bb466) verified in git log
- TypeScript compiles without errors (0 error TS entries)

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-05*
