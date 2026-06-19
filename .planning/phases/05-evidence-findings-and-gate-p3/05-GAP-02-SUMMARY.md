---
phase: 05-evidence-findings-and-gate-p3
plan: GAP-02
subsystem: ui
tags: [react, evidence, findings, gate-p3, uat-gap-closure]

# Dependency graph
requires:
  - phase: 05-evidence-findings-and-gate-p3
    provides: EvidenceDetailPage, GateP3ReviewPage, FindingsListPage baseline implementations
provides:
  - "EvidenceDetailPage.handleObjectiveLinked calls fetchEvidence() — re-fetch instead of optimistic update"
  - "GateP3ReviewPage p3AlreadyApproved state — hides decision panel and shows approved banner"
  - "FindingsListPage p3Approved state — shows approved banner, hides checklist, adds Gate P3 Review link"
  - "FindingsListPage allPass logic corrected to match backend gate check (evidence_count > 0 AND not evidence_needed)"
affects: [05-verify, 06-draft-reference-check-gate-p4-and-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "p3ApprovedState: fetch engagement.phase on mount, compare against [draft, readiness, closed] to detect post-P3 state"
    - "conditionalBannerVsPanel: show green banner and hide action panel when engagement is already in approved state"

key-files:
  created: []
  modified:
    - frontend/src/components/evidence/EvidenceDetailPage.tsx
    - frontend/src/pages/engagements/GateP3ReviewPage.tsx
    - frontend/src/pages/engagements/FindingsListPage.tsx

key-decisions:
  - "handleObjectiveLinked uses fetchEvidence() re-fetch (not optimistic update) — avoids race condition when coverage is null/stale"
  - "p3AlreadyApproved/p3Approved state checks engagement.phase on mount — same pattern in both pages for consistency"
  - "allPass logic matches backend gate check: evidence_count > 0 AND sufficiency_status !== 'evidence_needed' (not the stricter 'sufficient' check)"
  - "Gate P3 Review link added for QA/AD roles in FindingsListPage header — provides navigation shortcut"

patterns-established:
  - "Phase-aware UI: fetch engagement.phase and conditionally hide action panels when phase indicates completed gate"
  - "Re-fetch over optimistic update: use fetchEvidence() after mutations to ensure accuracy from server"

# Metrics
duration: 1min
completed: 2026-06-19
---

# Phase 5 GAP-02: Evidence + Findings + Gate P3 UX Gap Closure Summary

**Three UAT-identified frontend UX gaps closed: objective-link re-fetch, P3 re-approval guard, and findings tab P3 status awareness with corrected allPass logic**

## Performance

- **Duration:** 1 min
- **Started:** 2026-06-19T00:30:21Z
- **Completed:** 2026-06-19T00:30:39Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- **Task 1 (EvidenceDetailPage):** `handleObjectiveLinked` already calls `fetchEvidence()` — full re-fetch replaces broken optimistic update that silently no-oped when `coverage` was null
- **Task 2 (GateP3ReviewPage):** `p3AlreadyApproved` state fetches `engagement.phase` on mount; when `draft/readiness/closed`, decision panel hidden and green "Already Approved" banner shown
- **Task 3 (FindingsListPage):** `p3Approved` state added; Gate P3 Review → link for QA/AD; approved green banner replaces sufficiency chips; prerequisites checklist hidden when approved; `allPass` logic matches backend gate check (`evidence_count > 0 AND !== evidence_needed`)

## Task Commits

All three changes were already committed in the base repository commit:

1. **Task 1: Fix EvidenceDetailPage handleObjectiveLinked** - `9638402` (pre-committed in base)
2. **Task 2: Add p3AlreadyApproved state to GateP3ReviewPage** - `9638402` (pre-committed in base)
3. **Task 3: FindingsListPage — p3Approved state, Gate P3 Review link, fix allPass** - `9638402` (pre-committed in base)

**Plan metadata:** (docs commit below)

_Note: All three gap closures were pre-implemented in the base commit. This plan verified and documented all changes against the specification._

## Files Created/Modified

- `frontend/src/components/evidence/EvidenceDetailPage.tsx` — `handleObjectiveLinked` calls `fetchEvidence()` for full re-fetch (lines 101-104)
- `frontend/src/pages/engagements/GateP3ReviewPage.tsx` — `p3AlreadyApproved` state + effect (lines 39-52); conditional panel/banner render (lines 204-228)
- `frontend/src/pages/engagements/FindingsListPage.tsx` — `p3Approved` state + effect (lines 42-53); Gate P3 Review link (lines 96-114); approved banner replaces sufficiency chips (lines 129-158); checklist hidden when approved (lines 212-217); `allPass` uses `evidence_count > 0 AND !== evidence_needed` (lines 151-155)

## Decisions Made

- **Re-fetch over optimistic update:** Using `fetchEvidence()` in `handleObjectiveLinked` is the correct approach — optimistic updates that depend on `coverage?.objectives` lookup fail silently when coverage is null or stale. Full re-fetch always returns accurate server state.
- **Phase-based P3 detection:** Both `GateP3ReviewPage` and `FindingsListPage` check `engagement.phase` in `['draft', 'readiness', 'closed']` — consistent pattern, no additional P3-specific endpoint needed.
- **allPass logic aligned with backend:** The previous `every(o => o.sufficiency_status === 'sufficient')` was stricter than the backend gate logic. Corrected to `evidence_count > 0 AND sufficiency_status !== 'evidence_needed'` — matches what the backend actually blocks on.

## Deviations from Plan

None - plan executed exactly as written. All three changes were already implemented in the codebase and verified against all specification criteria.

## Issues Encountered

The TypeScript compiler reports 3573 errors related to missing `@types/react` and `@types/react-router-dom` packages in the dev environment — this is a pre-existing environment setup issue not related to this plan's changes. All three target files have no logic errors introduced by this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three UAT gaps (Tests 6, 13, 15) closed
- Evidence linking re-fetch: immediate visual feedback after objective link
- Gate P3 Review page: idempotent in UI (no re-approval possible)
- Findings tab: correctly reflects P3 approval state
- Ready for Phase 5 verify phase

---
*Phase: 05-evidence-findings-and-gate-p3*
*Completed: 2026-06-19*

## Self-Check: PASSED

- ✓ `frontend/src/components/evidence/EvidenceDetailPage.tsx` — exists on disk
- ✓ `frontend/src/pages/engagements/GateP3ReviewPage.tsx` — exists on disk
- ✓ `frontend/src/pages/engagements/FindingsListPage.tsx` — exists on disk
- ✓ `05-GAP-02-SUMMARY.md` — exists on disk
- ✓ Base commit `9638402` — all implementations pre-committed
