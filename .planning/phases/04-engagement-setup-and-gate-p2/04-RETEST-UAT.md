---
status: diagnosed
phase: 04-engagement-setup-and-gate-p2
source: [04-GAP-01-SUMMARY.md, 04-GAP-02-SUMMARY.md, 04-GAP-03-SUMMARY.md]
started: 2026-06-18T20:50:00.000Z
updated: 2026-06-18T21:20:00.000Z
---

## Current Test

[testing complete]

## Tests

### 1. Gate Card Color Borders (GAP-01 fix)
expected: Open any engagement that has an approved A1 gate. The A1 gate status card shows an emerald (green) left border and "Approved" status. P2/P3/P4 cards show slate (grey) borders if not yet decided.
result: pass

### 2. Add Team Member — Selection Works (GAP-02 fix)
expected: On an engagement's Team tab, click "+ Add Member". Type 2+ characters in the search box. A dropdown appears at full-width (matching the button width). Click a user in the dropdown — the user's name appears in the trigger button (selection committed). Picking a role and clicking Add Member adds them to the team list.
result: issue
reported: "Click doesn't select user"
severity: major

### 3. Milestone Save — No Blank Screen (GAP-03 fix)
expected: On the Team tab, set milestone dates and click Save. The page does NOT go blank. Either the save succeeds (showing updated status chips) or an error is shown inline/as a toast — but the page remains visible and usable.
result: issue
reported: "I get this: Something went wrong. Invalid time value. Try again"
severity: major

### 4. Full Team Setup → Planning Record → Gate P2 (regression)
expected: With the Add Member fix in place: add a QA user to the team, set all 4 milestone dates, save the planning record with objectives and required fields, submit it for review, and as QA approve Gate P2. The planning record locks with an amber "Planning Record Locked" banner.
result: skipped
reason: Blocked by Test 2 (Add Member still broken) and Test 3 (milestone save error)

## Summary

total: 4
passed: 1
issues: 2
pending: 0
skipped: 1

## Gaps

- truth: "Clicking a user in the Add Member dropdown commits the selection (user name appears in trigger button)"
  status: failed
  reason: "User reported: Click doesn't select user"
  severity: major
  test: 2
  root_cause: "CommandItem missing onMouseDown={(e) => e.preventDefault()} — clicking a non-focusable div causes browser focus to leave CommandInput, triggering a cmdk re-render race between mousedown and click that prevents onClick from dispatching. GAP-02's removal of value={query} was based on an incorrect diagnosis of the original bug."
  artifacts:
    - path: "frontend/src/components/engagements/AddMemberForm.tsx"
      issue: "Each CommandItem missing onMouseDown={(e) => e.preventDefault()} — standard fix for cmdk v1 + Radix Popover selection bug"
  missing:
    - "Add onMouseDown={(e) => e.preventDefault()} to each CommandItem in the search results list"
  debug_session: ""

- truth: "Setting milestone dates and clicking Save succeeds without error; page stays visible and shows status chips"
  status: failed
  reason: "User reported: I get this: Something went wrong. Invalid time value. Try again"
  severity: major
  test: 3
  root_cause: "mapMilestone() in team.service.ts uses String(row.target_date).slice(0,10) but knex returns PostgreSQL date columns as JavaScript Date objects. String(new Date(...)) produces a locale string like 'Mon Jun 16 2026...' not an ISO string. slice(0,10) gives 'Mon Jun 16' — parseISO() returns Invalid Date — Invalid Date is truthy so it passes the .filter() — then .toISOString() throws 'Invalid time value'. GAP-03 added ErrorBoundary (stopped blank screen) but the date mapping bug was a separate pre-existing issue."
  artifacts:
    - path: "backend/src/services/team.service.ts"
      issue: "Line ~96 in mapMilestone(): String(row.target_date).slice(0,10) breaks when knex returns a Date object instead of a string"
  missing:
    - "Fix mapMilestone() to use row.target_date instanceof Date ? row.target_date.toISOString().split('T')[0] : String(row.target_date).slice(0,10)"
  debug_session: ""
