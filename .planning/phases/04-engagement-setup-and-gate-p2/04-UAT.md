---
status: complete
phase: 04-engagement-setup-and-gate-p2
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md, 04-06-SUMMARY.md, 04-07-SUMMARY.md]
started: 2026-06-06T00:00:00.000Z
updated: 2026-06-18T17:00:00.000Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Engagement List Page
expected: Navigating to /engagements shows a table of engagements with phase filter tabs (All / Planning / Evidence / Draft / Readiness / Closed) and a search box. Each row shows the engagement's job code, title, phase, status, and risk level.
result: pass

### 2. Engagement Shell — Header and Gate Cards
expected: Clicking an engagement opens /engagements/:id with a header card showing the job code, title, phase, status badge, and risk level. Below it, four gate status cards (A1, P2, P3, P4) each show color-coded left borders — emerald for approved, amber for returned, yellow for pending, slate for not started.
result: issue
reported: "A1 card has no color border — approved A1 gate shows no emerald left border"
severity: major

### 3. Engagement Shell — Open Blockers
expected: The Engagement Shell shows a Blockers section. If no blockers exist, it shows a green "No open blockers" message. If an engagement has no owner set, a red blocker entry appears.
result: pass

### 4. Edit Engagement Metadata
expected: An EM or Admin clicking "Edit Metadata" on the engagement header reveals an inline form (no modal) to change title, status, risk level, and portfolio. Saving shows a "Engagement updated." toast and reverts to read-only view.
result: pass

### 5. Team Tab — View and Add Members
expected: The Team tab lists all assigned users with their role (color-coded badge: EM=blue, QA=purple, AN=teal, etc.). An EM can click "+ Add Member", search by name, pick a role, and add them. Adding a duplicate role/user shows an error.
result: issue
reported: "Can search users but cannot add team members — selection is not working, and the search results dropdown is small and looks bad UI wise"
severity: major

### 6. Team Tab — Remove Member Guards
expected: Removing the last EM or the sole QA (when P2 is not yet approved) is blocked with an error. Removing any other member shows an AlertDialog confirmation and completes successfully.
result: skipped

### 7. Team Tab — Milestone Dates
expected: The Team tab shows four milestone rows (Planning Approval, Evidence Readiness, Draft Readiness, Final Readiness) each with a date picker. Saving milestones out of chronological order shows a validation error. Setting valid dates saves and shows each row's computed status chip (Not Started / On Track / At Risk / Overdue / Complete).
result: issue
reported: "Screen went blank after clicking save/submit on a milestone"
severity: blocker

### 8. Planning Record — Draft and Submit
expected: The Planning Record tab shows a form with design approach, risk notes, data reliability notes, independence affirmation (three radio options: Affirmed / Pending / Exception Noted), and an Objectives accordion. An EM can save as Draft or click "Submit for Review" (enabled only when P2 prerequisites pass). Submitting changes the record status to "Ready for Review".
result: skipped
reason: Blocked by Test 5 issue — can't add team members so readiness checklist cannot be completed to enable Submit for Review

### 9. Planning Record — Objectives
expected: In the Planning Record accordion, clicking "Add Objective" adds a new item. Each objective can be edited inline and deleted (with confirmation). Deleting an objective linked to evidence shows a 409 error.
result: pass

### 10. Planning Record — P2 Readiness Checklist
expected: A sticky checklist at the top of the Planning Record panel shows 7–8 prerequisite items (objectives present, owner set, EM on team, QA on team, milestones set, risk notes, data reliability notes, independence status). Each shows a green check or red X. The Submit button is disabled while any item is red.
result: pass

### 11. Planning Record — Locked State and Request Revision
expected: When the planning record is approved (locked), an amber "Planning Record Locked" banner appears and the form fields are read-only. A QA or EM can click "Request Revision", enter a note of ≥10 characters, and submit — this reverts the record to Draft status, re-enabling editing.
result: skipped

### 12. Gate P2 Review — QA Approve
expected: A QA user sees the planning record in "Ready for Review" status. The Planning tab shows a GateP2ReviewPanel with the P2 prerequisites checklist (mode=qa), a read-only view of the planning record, and an "Approve Planning Baseline" button. Clicking it opens an AlertDialog; confirming writes the gate decision, locks the planning record, and advances the engagement.
result: skipped
reason: Blocked by Test 5 issue — can't add team members so planning record cannot reach Ready for Review state

### 13. Gate P2 Review — QA Return for Revision
expected: The QA user can click "Return for Revision" to open an AlertDialog with a required rationale text area. Submitting reverts the planning record to Draft and records the decision. The engagement does NOT advance phase.
result: skipped
reason: Blocked by Test 5 issue — can't reach the Gate P2 Review state without completing team setup

## Summary

total: 13
passed: 5
issues: 3
pending: 0
skipped: 5

## Gaps

- truth: "Gate cards show color-coded left borders — emerald for approved, amber for returned, yellow for pending, slate for not started"
  status: failed
  reason: "User reported: A1 card has no color border — approved A1 gate shows no emerald left border"
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "EM can click + Add Member, search by name, pick a role, and add them; adding a duplicate shows an error"
  status: failed
  reason: "User reported: Can search users but cannot add team members — selection is not working, and the search results dropdown is small and looks bad UI wise"
  severity: major
  test: 5
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Setting valid milestone dates saves and shows computed status chips; out-of-order dates show validation error"
  status: failed
  reason: "User reported: Screen went blank after clicking save/submit on a milestone"
  severity: blocker
  test: 7
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
