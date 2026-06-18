---
phase: 04-engagement-setup-and-gate-p2
verified: 2026-06-18T22:00:00Z
status: passed
score: 11/11 must-haves verified
re_verification:
  previous_status: passed
  previous_score: 9/9
  gaps_closed:
    - "Clicking a user in the Add Member dropdown commits the selection (user name appears in trigger button)"
    - "Setting milestone dates and clicking Save succeeds without error; page stays visible and shows status chips"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Open Team tab → + Add Member → type 2+ characters → click a user in results"
    expected: "User name appears in trigger button (selection committed); 'Add to Team' button enables; clicking it adds member to table"
    why_human: "onMouseDown preventDefault is a pointer-event timing fix — correct behavior must be confirmed in a live browser at runtime"
  - test: "Set all 4 milestone dates in chronological order → click 'Save Milestones'"
    expected: "Toast 'Milestones saved.' appears; page does NOT go blank; updated status chips shown"
    why_human: "Date mapping fix eliminates the 'Invalid time value' crash — success path and correct chip rendering require live API + DB interaction"
  - test: "Navigate to engagement with approved A1 gate — confirm emerald border appears"
    expected: "A1 gate card shows emerald left border and 'Approved' badge"
    why_human: "Visual CSS rendering; grep confirms the code path, not the runtime output"
  - test: "Set milestone dates with out-of-order values → click Save Milestones"
    expected: "Inline validation error appears; page stays visible"
    why_human: "Error-path behavior requires live interaction to confirm"
---

# Phase 4: Engagement Setup & Gate P2 — Gap Closure Verification Report (v3)

**Phase Goal:** An Engagement Manager can fully set up an accepted engagement — metadata, team, milestones, and planning record — and a QA Reviewer can approve the planning baseline, locking it at Gate P2

**Verified:** 2026-06-18T22:00:00Z
**Status:** ✓ PASSED
**Verification type:** Re-verification v3 — gap closure after UAT retest (2 new gaps diagnosed in 04-RETEST-UAT.md; addressed by 04-GAP-04 and 04-GAP-05)

---

## Gap Closure Summary

The UAT retest (04-RETEST-UAT.md) identified 2 remaining blockers after the first gap-closure round:

1. **GAP-04** — `AddMemberForm.tsx`: cmdk v1 + Radix Popover focus-loss race prevented `onSelect` from firing. Fix: `onMouseDown={(e) => e.preventDefault()}` added to `CommandItem` at line 134. Commit: `6deaa7e`.
2. **GAP-05** — `team.service.ts`: `mapMilestone()` used `String(row.target_date).slice(0, 10)` which produces a locale string (e.g. `"Mon Jun 16"`) when knex returns a `Date` object, causing `parseISO()` to return `Invalid Date` and `.toISOString()` to throw `"Invalid time value"`. Fix: `instanceof Date` guard added to use `.toISOString().split('T')[0]`. Commit: `16aef0d`.

All 9 original truths from the v2 VERIFICATION remain intact (regression-checked below).

---

## Observable Truths — Full Verification

### Original GAP-01 Truths: Gate Card Color Borders (Regression Check)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Approved A1/P2/P3/P4 gates show emerald left border and 'Approved' badge | ✓ VERIFIED | `STATUS_MAP` at `engagements.service.ts` line 54; `GateStatusCard.tsx` line 45: `d === 'approved' \|\| d === 'approve' \|\| d === 'passed'` → emerald |
| 2 | Returned gates show amber left border | ✓ VERIFIED | `STATUS_MAP` passes `returned→returned`; `GateStatusCard.tsx` handles `d === 'returned'` → amber |
| 3 | Gates correctly report locked/unlocked based on prior gate approval | ✓ VERIFIED | `GateStatusCardRow.tsx` line 24: `d !== 'approved' && d !== 'approve' && d !== 'passed'` |

**Score:** 3/3 ✓

### Original GAP-02 Truths: Add Member Form (Regression Check)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 4 | Typing 2+ characters in the user search box returns a results list | ✓ VERIFIED | `onValueChange={handleSearch}` at line 123; `value={query}` absent from `CommandInput` (grep returns NOT PRESENT) |
| 5 | Clicking a user in the results list selects them (name appears in trigger button) | ✓ VERIFIED | `onMouseDown={(e) => e.preventDefault()}` at line 134 (GAP-04); `onSelect` sets `selectedUser` at line 136; `selectedUser.display_name` rendered in trigger at line 110 |
| 6 | The search dropdown width matches the trigger button width (full-width) | ✓ VERIFIED | `PopoverContent` contains `w-[var(--radix-popover-trigger-width)]` (grep count: 1) |

**Score:** 3/3 ✓

### Original GAP-03 Truths: Milestone Error Handling & ErrorBoundary (Regression Check)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 7 | Clicking Save Milestones with an API error shows a destructive toast (not blank screen) | ✓ VERIFIED | `TeamPanel.tsx` has `try` blocks (count: 4); `variant: 'destructive'` toast present |
| 8 | Invalid date order shows a validation error message in MilestoneTable | ✓ VERIFIED | `validateDateOrder` and `dateErrors` present in `MilestoneTable.tsx` (counts: 7 each) |
| 9 | Uncaught React render errors show a fallback UI instead of blank screen | ✓ VERIFIED | `ErrorBoundary` referenced 8 times in `App.tsx` |

**Score:** 3/3 ✓

### NEW GAP-04 Truth: Add Member Click Selection (Gap Closure Verification)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 10 | Clicking a user in the Add Member dropdown commits the selection (user name appears in trigger button) | ✓ VERIFIED | `onMouseDown={(e) => e.preventDefault()}` at line 134 of `AddMemberForm.tsx` (commit `6deaa7e`, 1 insertion); `onSelect` at line 135 calls `setSelectedUser(user)` then `setOpen(false)`; `selectedUser.display_name` rendered at line 110 — full chain wired |

**Score:** 1/1 ✓

### NEW GAP-05 Truth: Milestone Save Date Mapping (Gap Closure Verification)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 11 | Setting milestone dates and clicking Save succeeds without error; page stays visible and shows status chips | ✓ VERIFIED | `mapMilestone()` lines 96–100 of `team.service.ts`: `instanceof Date` guard uses `.toISOString().split('T')[0]`; `String(...).slice(0,10)` fallback retained; commit `16aef0d` (5 insertions, 1 deletion) — correctly converts knex `Date` objects to `YYYY-MM-DD`, eliminating `"Invalid time value"` |

**Score:** 1/1 ✓

**Overall Score: 11/11 must-haves verified**

---

## Required Artifacts

| Artifact | Provides | Status | Key Evidence |
|----------|----------|--------|--------------|
| `frontend/src/components/engagements/AddMemberForm.tsx` | `CommandItem` with `onMouseDown={(e) => e.preventDefault()}` preventing focus-loss race | ✓ VERIFIED | Line 134: `onMouseDown={(e) => e.preventDefault()}` — exactly as planned in GAP-04 |
| `backend/src/services/team.service.ts` | `mapMilestone()` with `instanceof Date` guard for correct `YYYY-MM-DD` conversion | ✓ VERIFIED | Lines 96–100: `instanceof Date ? .toISOString().split('T')[0] : String(...).slice(0,10)` — exactly as planned in GAP-05 |
| `backend/src/services/engagements.service.ts` | `STATUS_MAP` translating `passed→approved` | ✓ VERIFIED (regression) | Line 54: `STATUS_MAP` const; line 73: applied at service boundary |
| `frontend/src/components/engagements/GateStatusCard.tsx` | Color map handles `'passed'` as approved | ✓ VERIFIED (regression) | Line 45: `d === 'passed'` → emerald branch |
| `frontend/src/components/engagements/GateStatusCardRow.tsx` | `isGateLocked` handles `'passed'` as approved | ✓ VERIFIED (regression) | Line 24: `d !== 'passed'` included |
| `frontend/src/components/engagements/TeamPanel.tsx` | `handleSaveMilestones` with `try/catch` + destructive toast | ✓ VERIFIED (regression) | 4 `try` blocks present |
| `frontend/src/components/engagements/MilestoneTable.tsx` | `validateDateOrder` + `dateErrors` inline error display | ✓ VERIFIED (regression) | Both identifiers present (count: 7 each) |
| `frontend/src/App.tsx` | `ErrorBoundary` class component wrapping authenticated shell | ✓ VERIFIED (regression) | 8 `ErrorBoundary` references present |

---

## Key Link Verification

| From | To | Via | Status | Evidence |
|------|----|-----|--------|----------|
| `CommandItem` (user result) | `onSelect` handler → `setSelectedUser` | `onMouseDown={(e) => e.preventDefault()}` prevents focus-loss before click fires | ✓ WIRED | Line 134 (onMouseDown) → line 135 (`onSelect`) → line 136 (`setSelectedUser`) → line 110 (`selectedUser.display_name` in trigger) — complete chain |
| `mapMilestone() target_date` | `MilestoneRecord.target_date` (YYYY-MM-DD string) | `instanceof Date` guard before `toISOString().split('T')[0]` | ✓ WIRED | Lines 96–100: guard present; `target_date` flows to `computeMilestoneStatus()` at line 108; `String` fallback at line 99 for non-Date code paths |
| `engagements.service.ts toGateDecisionRecord()` | `GateStatusCard` color map | `STATUS_MAP`: `'passed'` → `'approved'` before frontend | ✓ WIRED (regression) | `STATUS_MAP` translates at service boundary; frontend receives `'approved'` |
| `CommandInput onValueChange` | `setSelectedUser` via `CommandItem onSelect` | Uncontrolled input — cmdk fires `onSelect` on click without interception | ✓ WIRED (regression) | `value={query}` absent; `onValueChange={handleSearch}` present |
| `MilestoneTable.handleSave` | `TeamPanel.handleSaveMilestones` | `onSave` prop — both catch errors | ✓ WIRED (regression) | Double-catch prevents unhandled rejection propagation |
| `ErrorBoundary` | `EngagementShellPage` tab panels | Wraps `<AppShell />` in `AppRoutes` | ✓ WIRED (regression) | 8 references in `App.tsx` |

---

## Anti-Patterns Found

Both new files were scanned for anti-patterns:

- `AddMemberForm.tsx`: Two `placeholder` occurrences found — both are HTML `placeholder` attributes (input hint text: `"Search by name or email..."` and `"Select role"`), not code stubs. No `TODO`, `FIXME`, `return null`, or empty handlers.
- `team.service.ts`: No anti-patterns found.

**No blockers or warnings introduced by GAP-04 or GAP-05.**

---

## Git Commit Verification

All 7 gap-plan commits verified in `git log`:

| Commit | Plan | Change |
|--------|------|--------|
| `6157723` | GAP-01 Task 1 | `STATUS_MAP` in `engagements.service.ts` |
| `d124a90` | GAP-01 Task 2 | `'passed'` guards in `GateStatusCard` + `GateStatusCardRow` |
| `e537cb0` | GAP-02 Task 1 | Fix cmdk v1 `AddMemberForm` combobox + width |
| `f7a0963` | GAP-03 Task 1 | `TeamPanel` + `MilestoneTable` error handling + `ErrorBoundary` |
| `8a25fc0` | GAP-03 Task 2 | `'overdue'` in migration CHECK constraint |
| `6deaa7e` | GAP-04 Task 1 | `onMouseDown={(e) => e.preventDefault()}` on `CommandItem` in `AddMemberForm` |
| `16aef0d` | GAP-05 Task 1 | `instanceof Date` guard in `mapMilestone()` in `team.service.ts` |

---

## Human Verification Required

### 1. Add Member — User Selection Committed

**Test:** Open Team tab → click "+ Add Member" → type 2+ characters → click a name in the dropdown
**Expected:** The user's name appears in the trigger button (not a blank/reset state); "Add to Team" button becomes enabled after also selecting a role; clicking "Add to Team" adds the member to the table
**Why human:** `onMouseDown` is a pointer-event timing fix — the race condition occurs at the browser event loop level; grep confirms the code is present but runtime confirmation is required

### 2. Milestone Save — Success Path

**Test A (success):** Set all 4 milestone dates in chronological order → click "Save Milestones"
**Expected:** Toast "Milestones saved." appears; page does NOT go blank; status chips update correctly

**Test B (validation):** Set `planning_approval` date AFTER `evidence_readiness` date → click "Save Milestones"
**Expected:** Inline error "Milestone dates must be in chronological order." appears; page stays visible

**Test C (API error):** With backend disconnected or triggering 500 → click "Save Milestones"
**Expected:** Destructive toast "Failed to save milestones" appears; page does NOT go blank

**Why human:** The original bug was a runtime crash (`"Invalid time value"` from `toISOString()` on `Invalid Date`); the fix is verified structurally but the success path and absence of the error require live API + DB interaction to confirm

### 3. Gate Card Emerald Border (Carried from v2)

**Test:** Navigate to an engagement with an approved A1 gate decision in the database
**Expected:** A1 gate card shows emerald left border and 'Approved' badge with checkmark icon
**Why human:** Visual CSS rendering; code path verified but runtime DOM paint requires browser

---

## Regression Summary

All 9 original must-haves from the v2 VERIFICATION remain intact. GAP-04 and GAP-05 are surgical single-file changes:
- GAP-04: 1 insertion (`onMouseDown` prop) in `AddMemberForm.tsx` — no other file touched
- GAP-05: 5 insertions / 1 deletion in `mapMilestone()` in `team.service.ts` — no other file touched

No regressions identified in any of the 8 files originally modified by GAP-01/02/03.

---

## Summary

Both UAT retest blockers have been addressed with precise, substantive, wired code changes:

1. **GAP-04 (Add Member click race):** The `onMouseDown={(e) => e.preventDefault()}` fix on `CommandItem` is the canonical solution for cmdk v1 + Radix Popover — it prevents the browser from moving focus away from `CommandInput` before the click event fires, ensuring `onSelect` dispatches and `setSelectedUser` is called. The full selection → display chain is intact: `onSelect` (line 135) → `setSelectedUser` (line 136) → `selectedUser.display_name` rendered in trigger (line 110).

2. **GAP-05 (Milestone date "Invalid time value"):** The `instanceof Date` guard correctly handles knex returning PostgreSQL `date` columns as JS `Date` objects. `.toISOString().split('T')[0]` produces the canonical `YYYY-MM-DD` format that `parseISO()` can parse without producing `Invalid Date`. The `String(...).slice(0,10)` fallback is retained for pre-formatted string values, making the fix defensive and regression-safe.

**Four human-testable items** remain to confirm runtime behavior that code inspection cannot substitute for. These are validation items, not blockers to confidence — the code implementing each fix is complete and correctly wired.

---

_Verified: 2026-06-18T22:00:00Z_
_Verifier: Claude (pivota_spec-verifier)_
