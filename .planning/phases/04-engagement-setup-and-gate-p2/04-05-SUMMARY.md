---
phase: 04-engagement-setup-and-gate-p2
plan: "05"
subsystem: ui
tags: [react, typescript, shadcn, team-management, milestones]

# Dependency graph
requires:
  - phase: 04-02
    provides: backend team routes (GET/POST/DELETE /team, GET/PUT /milestones)
  - phase: 04-04
    provides: EngagementShellPage with Team tab placeholder, engagements.api.ts

provides:
  - TeamPanel component (team member list + add form + milestones within Team tab)
  - MilestoneStatusChip with 5 color-coded states (not_started/on_track/at_risk/overdue/complete)
  - team.api.ts with all 5 API functions (listTeam, addTeamMember, removeTeamMember, listMilestones, upsertMilestones)
  - TeamMemberTable with role badges and remove guards
  - AddMemberForm with Command+Popover user search and 7-role selector
  - MilestoneTable with date pickers, date-order validation, and Save button
  - TeamPanel mounted as Team tab in EngagementShellPage

affects: [04-06, 04-07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "canRemove() prop pattern: guard computation in TeamPanel, rendering in TeamMemberTable"
    - "Parallel Promise.all([listTeam, listMilestones]) on mount for single loading state"
    - "MILESTONE_ORDER constant array drives table rows + date validation order"

key-files:
  created:
    - frontend/src/lib/team.api.ts
    - frontend/src/components/engagements/TeamPanel.tsx
    - frontend/src/components/engagements/TeamMemberTable.tsx
    - frontend/src/components/engagements/AddMemberForm.tsx
    - frontend/src/components/engagements/MilestoneStatusChip.tsx
    - frontend/src/components/engagements/MilestoneTable.tsx
    - frontend/e2e/team-milestones.spec.ts
  modified:
    - frontend/src/pages/EngagementShellPage.tsx

key-decisions:
  - "canRemove() guard function passed as prop from TeamPanel to TeamMemberTable — keeps guard logic centralized, rendering in table"
  - "MilestoneTable date state initialized from milestones prop; re-syncs on prop reference change — supports post-save refresh"
  - "TeamPanel passes p2Approved bool computed from gate_decisions in EngagementShellPage — avoids TeamPanel needing to fetch gate data"
  - "initialFocus removed from Calendar component (react-day-picker v10 API incompatibility, consistent with Phase 3 decision)"

patterns-established:
  - "TeamRoleBadge inline in TeamMemberTable: color-coded role pills (EM=blue, QA=purple, AN=teal, IR=orange, PC=amber, AL/RO=gray)"
  - "Section header style: text-xs font-medium uppercase tracking-wide text-slate-500"
  - "AddMemberForm: Command+Popover with shouldFilter={false}, onValueChange triggers API search"

# Metrics
duration: 6min
completed: 2026-06-05
---

# Phase 4 Plan 05: Team Assignments and Milestones UI Summary

**TeamPanel with role-protected add/remove, 5-color MilestoneStatusChip, and date-picker milestone table mounted as Team tab in EngagementShellPage**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-05T22:01:26Z
- **Completed:** 2026-06-05T22:07:31Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- `team.api.ts`: 5 API functions (listTeam, addTeamMember, removeTeamMember, listMilestones, upsertMilestones) with error-throwing wrappers
- `MilestoneStatusChip`: 5 color states (not_started/on_track/at_risk/overdue/complete) with lucide-react icons
- `TeamMemberTable`: role-colored badges, Remove button with blocked tooltip state, AlertDialog confirm flow
- `AddMemberForm`: Command+Popover user search, 7-role Select, duplicate assignment (409) error handling
- `MilestoneTable`: 4 milestone rows with Popover date pickers, date-order validation, Save Milestones button
- `TeamPanel`: parallel load, [+ Add Member] toggle, canRemove() guard for last EM and sole QA before P2, success toasts
- `EngagementShellPage`: replaced placeholder `TeamPanel` local function with real imported `TeamPanel` component
- `e2e/team-milestones.spec.ts`: 12 Playwright E2E tests; execution deferred to verify phase

## Task Commits

Each task was committed atomically:

1. **Task 1: Team API client + TeamMemberTable + AddMemberForm + MilestoneStatusChip + MilestoneTable** - `23593d4` (feat)
2. **Task 2: TeamPanel composite + mount in EngagementShellPage + Playwright E2E** - `b37b208` (feat)

## Files Created/Modified
- `frontend/src/lib/team.api.ts` - API wrappers for all team and milestone endpoints
- `frontend/src/components/engagements/MilestoneStatusChip.tsx` - 5-state color-coded status chip
- `frontend/src/components/engagements/TeamMemberTable.tsx` - Table with role badges, remove guards, AlertDialog confirm
- `frontend/src/components/engagements/AddMemberForm.tsx` - Command+Popover user search + role selector + error states
- `frontend/src/components/engagements/MilestoneTable.tsx` - 4-milestone table with date pickers and date-order validation
- `frontend/src/components/engagements/TeamPanel.tsx` - Composite panel combining all above components
- `frontend/src/pages/EngagementShellPage.tsx` - Updated Team tab to use real TeamPanel
- `frontend/e2e/team-milestones.spec.ts` - 12 E2E tests (execution deferred to verify phase)

## Decisions Made
- `canRemove()` guard computed in TeamPanel (has access to full assignments list), passed as prop to TeamMemberTable — avoids TeamMemberTable needing list context
- `p2Approved` boolean passed from EngagementShellPage into TeamPanel (derived from gate_decisions already loaded) — TeamPanel doesn't need to make an extra API call
- `initialFocus` removed from Calendar — react-day-picker v10 incompatibility (same as Phase 3 decision)
- MilestoneTable date state managed locally; re-syncs from props on reference change to support post-save refresh

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed `initialFocus` prop from Calendar**
- **Found during:** Task 1 (MilestoneTable TypeScript check)
- **Issue:** `initialFocus` prop doesn't exist in react-day-picker v10 DayPickerProps
- **Fix:** Removed `initialFocus` from Calendar usage (consistent with Phase 3 fix)
- **Files modified:** frontend/src/components/engagements/MilestoneTable.tsx
- **Verification:** TypeScript compiles without errors
- **Committed in:** 23593d4 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor fix for react-day-picker v10 API. No scope creep.

## Issues Encountered
None — plan executed as written with one minor API compatibility fix.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Team tab functional with team member management and milestone dates
- TeamPanel exports `TeamPanelProps { engagementId: string; canEdit: boolean; p2Approved?: boolean }`
- MilestoneStatusChip exports `MilestoneStatus` type for reuse in Gate P2 checklist (Plan 04-07)
- E2E tests written; execution deferred to verify phase (requires running full stack)
- Ready for Plan 04-06 (Planning Record form) which mounts in `planning` tab of EngagementShellPage

## Self-Check: PASSED

All key files verified on disk. Both task commits (23593d4, b37b208) verified in git log.

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-05*
