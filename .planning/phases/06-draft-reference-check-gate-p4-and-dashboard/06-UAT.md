---
status: complete
phase: 06-draft-reference-check-gate-p4-and-dashboard
source: [06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md, 06-04-SUMMARY.md, 06-05-SUMMARY.md, 06-06-SUMMARY.md, 06-07-SUMMARY.md]
started: 2026-06-07T00:40:00Z
updated: 2026-06-07T00:55:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Create a Draft Product
expected: Navigate to an engagement that has passed Gate P3 (phase = draft). Open the "Draft Product" tab on the Engagement Shell. The page shows an empty state with a "Create Draft Product" button (or similar call to action). Clicking it opens a dialog with fields for Title, Version, and Owner. Fill in the fields and confirm — the draft product record is created and the page now shows the draft with a status stepper.
result: pass

### 2. Draft Status Stepper
expected: With a draft product created, the page shows a horizontal 4-step stepper showing "Drafting → Under Review → Ready for Reference Check → Ready for Final Review". The current step is highlighted; completed steps show a checkmark icon. A button exists to advance the status to the next step (e.g. "Submit for Review" or similar label matching the current step).
result: pass

### 3. Upload a Draft File
expected: On the Draft Product page, a file upload section allows dragging or selecting a file (PDF, DOCX, XLSX, TXT, or ZIP). After selecting a file, it shows a progress indicator and then displays the uploaded file name. Uploading a second file replaces the first.
result: pass

### 4. Add a Review Comment
expected: On the Draft Product page, a review comment thread section is visible. Typing a comment and submitting appends it to the thread with the author's name and timestamp. The thread is append-only (no edit/delete on existing comments).
result: pass

### 5. Add Draft Statements with Evidence Links
expected: Navigate to the Statements page for the draft (via a link/button from the Draft Product page or Engagement Shell). The page shows a 5-segment reference check progress bar at the top. Clicking "Add Statement" opens a dialog where you enter statement text and select one or more evidence items (multi-select). Submitting creates the statement in the table.
result: pass

### 6. Reference Check Progress Bar
expected: The Statements page shows a segmented progress bar reflecting the distribution of statement statuses (Not Started / In Review / Passed / Failed / Waived). Each segment is color-coded: Passed = blue, Not Started = light gray, Failed = red, In Review = yellow, Waived = gray. Below the bar a gate status line shows "BLOCKED" or "READY" for Gate P4.
result: pass

### 7. IR Statement Detail — Mark as Passed
expected: As a user with the IR (Independent Referencer) role assigned to a statement, navigating to that statement's detail page shows a reference check decision panel with radio options: Not Started / In Review / Passed / Failed. Selecting "Passed" and saving updates the statement status (visible in the list on the Statements page).
result: pass

### 8. IR Statement Detail — Mark as Failed with Discrepancy
expected: On the statement detail page, selecting "Failed" as the ref_status expands additional fields for discrepancy type and discrepancy notes. Filling these in and saving records the failure; the statement row in the Statements list shows a red indicator. The statement is assigned to an Analyst for correction.
result: pass

### 9. Analyst Correction Notice
expected: As an Analyst who has been assigned back a failed statement, the statement detail page shows an "AnalystCorrectionNotice" panel (amber/orange background with left border) describing the discrepancy from the Independent Referencer. A "Mark Revision Ready" checkbox or button allows the Analyst to send the statement back for re-check.
result: pass

### 10. Gate P4 Prerequisites Checklist
expected: Navigate to the Gate P4 review page (e.g. via a "Gate P4" tab or link on the Engagement Shell). The page shows a prerequisites checklist with 4 items: P3 approved, no failed reference checks, no in-review reference checks, and no not-started reference checks. Items that are not yet met display a red/warning indicator; items that pass show a green checkmark.
result: pass

### 11. Approve Gate P4
expected: When all P4 prerequisites are satisfied (all statements Passed or Waived, P3 approved), the "Approve Gate P4" button becomes enabled. Clicking it opens a confirmation dialog. Confirming records the Gate P4 decision and transitions the engagement to "Ready for Issuance" or "Closed" status. An audit event is created (visible on the audit trail).
result: pass

### 12. Portfolio Dashboard — Stat Cards and Table
expected: Navigating to the Dashboard (e.g. /dashboard) shows 4 phase stat cards (Planning / Evidence / Draft / Readiness) with counts of engagements in each phase. Below is a sortable table listing engagements with columns for ID, title, phase, owner, risk level, next milestone, and gate status mini-icons. Clicking a column header sorts the table.
result: pass

### 13. Portfolio Dashboard — Filters and CSV Export
expected: The Portfolio Dashboard has filters for owner, risk level, due date, phase, and status. Applying a filter narrows the engagement list. A "Export CSV" button downloads a CSV file with all visible engagements.
result: pass

## Summary

total: 13
passed: 13
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
