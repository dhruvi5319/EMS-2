---
phase: 04-engagement-setup-and-gate-p2
plan: GAP-02
subsystem: ui
tags: [react, typescript, cmdk, popover, combobox]

# Dependency graph
requires:
  - phase: 04-05
    provides: AddMemberForm component (original implementation with cmdk v1 incompatibility)

provides:
  - Fixed AddMemberForm with working user selection via cmdk v1 compatible pattern
  - Full-width PopoverContent dropdown matching trigger button width

affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "cmdk v1 uncontrolled CommandInput: omit value prop, use only onValueChange to avoid selectFirstItem() interception"
    - "Single always-mounted CommandEmpty with conditional text content (not two conditional mounts)"
    - "w-[var(--radix-popover-trigger-width)] for full-width Radix Popover content matching trigger"

key-files:
  created: []
  modified:
    - frontend/src/components/engagements/AddMemberForm.tsx

key-decisions:
  - "cmdk v1 requires uncontrolled CommandInput: value prop triggers selectFirstItem() on every keystroke, intercepting onSelect before it fires; remove value prop to fix"
  - "Single always-mounted CommandEmpty is idiomatic for cmdk v1: cmdk controls visibility via data-cmdk-empty attribute; dual conditional rendering causes state desync"
  - "--radix-popover-trigger-width CSS custom property matches PopoverContent to trigger button width automatically"

patterns-established:
  - "cmdk combobox pattern: shouldFilter={false} + uncontrolled CommandInput + single CommandEmpty + CommandGroup"

# Metrics
duration: 1min
completed: 2026-06-18
---

# Phase 4 GAP-02: Fix AddMemberForm cmdk v1 Combobox Summary

**Removed controlled `value` prop from CommandInput and simplified CommandEmpty to fix cmdk v1 user selection bug; fixed PopoverContent to full-width via `--radix-popover-trigger-width`**

## Performance

- **Duration:** 1 min
- **Started:** 2026-06-18T20:39:34Z
- **Completed:** 2026-06-18T20:40:11Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Removed `value={query}` from `CommandInput` — cmdk v1 no longer calls `selectFirstItem()` on each keystroke, allowing `onSelect` to fire on click
- Replaced two conditional `CommandEmpty` mounts with a single always-mounted block containing conditional text — eliminates React key conflicts and cmdk internal state desync
- Changed `PopoverContent` from `w-[300px]` to `w-[var(--radix-popover-trigger-width)]` — dropdown now matches the full width of the trigger button

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix cmdk v1 CommandInput controlled value bug and PopoverContent width** - `e537cb0` (fix)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified
- `frontend/src/components/engagements/AddMemberForm.tsx` - Fixed cmdk v1 combobox: uncontrolled CommandInput, single CommandEmpty, full-width PopoverContent

## Decisions Made
- Removed `value={query}` from `CommandInput`: the cmdk v1 library calls `selectFirstItem()` whenever the controlled value changes via `onValueChange`, which intercepts the pointer click before `onSelect` on `CommandItem` can fire. Removing the prop makes the input uncontrolled from cmdk's perspective while still updating `query` state via `handleSearch`.
- Single `CommandEmpty`: cmdk manages visibility via `data-cmdk-empty` data attribute; two conditional mounts create desync between cmdk's internal tracking and React's render tree.
- `w-[var(--radix-popover-trigger-width)]`: Radix Popover sets this CSS custom property on the popover content to equal the trigger's rendered width, eliminating the need for a hardcoded pixel value.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `AddMemberForm` now correctly allows clicking a user in the search results to select them
- The dropdown matches trigger button width (full-width)
- Ready for UAT verification: navigate to an engagement → Team tab → "+ Add Member" → type 2+ chars → click a user → confirm selection appears in trigger button

## Self-Check: PASSED

- `frontend/src/components/engagements/AddMemberForm.tsx` verified on disk ✓
- Commit `e537cb0` verified in git log ✓
- `value={query}` absent from CommandInput ✓
- Single `CommandEmpty` block ✓
- `w-[var(--radix-popover-trigger-width)]` present ✓
- `onValueChange={handleSearch}` present (CONTRACT_OK) ✓

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-18*
