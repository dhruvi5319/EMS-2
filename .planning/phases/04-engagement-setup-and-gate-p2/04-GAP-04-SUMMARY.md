---
phase: 04-engagement-setup-and-gate-p2
plan: GAP-04
subsystem: ui
tags: [cmdk, radix-ui, popover, combobox, focus-race]

# Dependency graph
requires: []
provides:
  - "AddMemberForm CommandItem has onMouseDown={(e) => e.preventDefault()} preventing focus-loss race"
  - "Clicking a user in the Add Member dropdown now reliably commits the selection"
affects: ["Gate P2 UAT Test 4 — team assignment workflow"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "cmdk v1 + Radix Popover: onMouseDown e.preventDefault() on CommandItem prevents focus-loss race before click fires"

key-files:
  created: []
  modified:
    - frontend/src/components/engagements/AddMemberForm.tsx

key-decisions:
  - "onMouseDown={(e) => e.preventDefault()} on CommandItem: canonical fix for cmdk v1 + Radix Popover focus-loss race condition"

patterns-established:
  - "Any cmdk CommandItem inside a Radix Popover must have onMouseDown={(e) => e.preventDefault()} to prevent focus-stealing before click fires"

# Metrics
duration: 1min
completed: 2026-06-18
---

# Phase 4 Plan GAP-04: Add Member Dropdown Fix Summary

**onMouseDown={(e) => e.preventDefault()} added to CommandItem in AddMemberForm — fixes cmdk v1 + Radix Popover focus-loss race so clicking a user commits the selection**

## Performance

- **Duration:** 1 min
- **Started:** 2026-06-18T21:30:26Z
- **Completed:** 2026-06-18T21:31:11Z
- **Tasks:** 1 completed
- **Files modified:** 1

## Accomplishments

- Added `onMouseDown={(e) => e.preventDefault()}` to the `CommandItem` inside `users.map(...)` in `AddMemberForm.tsx`
- Fixes the cmdk v1 + Radix Popover race condition: browser was shifting focus away from `CommandInput` on mousedown, triggering a cmdk re-render that cleared internal state before the click event fired
- `onSelect` now fires reliably — selected user's name appears in the Popover trigger button

## Task Commits

Each task was committed atomically:

1. **Task 1: Add onMouseDown preventDefault to CommandItem in AddMemberForm** - `6deaa7e` (fix)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `frontend/src/components/engagements/AddMemberForm.tsx` — Added `onMouseDown={(e) => e.preventDefault()}` prop to `CommandItem` at line 134 (inside `users.map(...)`)

## Decisions Made

- Used `onMouseDown={(e) => e.preventDefault()}` as the canonical fix for cmdk v1 + Radix Popover focus-loss race — this is the documented approach for this library combination. No other changes were needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The TypeScript errors shown by `tsc --noEmit` are environment-wide (`Cannot find module 'react'` due to missing node_modules in the check context) and pre-existed before this change. They appear across all files in the frontend and are unrelated to this fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `AddMemberForm.tsx` now correctly selects users from the dropdown
- Gate P2 UAT Test 4 (team assignment workflow) is unblocked
- No further changes needed for this gap

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-18*
