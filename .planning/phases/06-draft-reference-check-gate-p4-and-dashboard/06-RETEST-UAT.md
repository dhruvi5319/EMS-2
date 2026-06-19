---
status: complete
phase: 06-draft-reference-check-gate-p4-and-dashboard
source: [06-GAP-01-SUMMARY.md, 06-GAP-02-SUMMARY.md, 06-GAP-03-SUMMARY.md]
started: 2026-06-19T04:00:00Z
updated: 2026-06-19T05:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Upload a Draft File (retest)
expected: On the Draft Product page, upload a file (PDF, DOCX, etc.). After the upload completes, the page should STAY on the Draft Product view showing the draft with the uploaded filename — it should NOT reset to the empty "no draft" state. Only a manual page refresh or navigation away should change the view.
result: pass

### 2. Add Draft Statements with Evidence Links (retest)
expected: On the Statements page, click "Add Statement". In the dialog, enter statement text and click the evidence multi-select dropdown. Select one or more evidence items — each click should toggle a checkmark and add the item to a selected list without the popover closing prematurely. Submitting creates the statement.
result: pass

### 3. IR Statement Detail — Mark as Passed (retest)
expected: Navigate to a statement's detail page as a user with the IR (Independent Referencer) role. The reference check decision panel shows status options: Not Started / In Review / Passed / Failed. Select "Passed" and save — the statement status updates to Passed and is visible in the Statements list.
result: pass

### 4. IR Statement Detail — Mark as Failed with Discrepancy (retest)
expected: On the statement detail page, select "Failed" as the ref_status expands additional fields for discrepancy type and discrepancy notes. Filling these in and saving records the failure; the statement row in the Statements list shows a red indicator. The statement is assigned to an Analyst for correction.
result: pass

### 5. Analyst Correction Notice (retest)
expected: As an Analyst assigned a failed statement, the statement detail page shows an amber/orange "AnalystCorrectionNotice" panel describing the discrepancy from the Independent Referencer. A "Mark Revision Ready" checkbox or button allows the Analyst to send the statement back for re-check.
result: pass

### 6. Gate P4 Prerequisites Checklist (retest)
expected: Navigate to the Engagement Shell for an engagement. A "Gate P4" tab is now visible in the tab bar. Clicking it opens the Gate P4 review page showing a prerequisites checklist (P3 approved, no failed checks, no in-review checks, no not-started checks). Items not yet met show red/warning; met items show green checkmark.
result: pass

### 7. Approve Gate P4 (retest)
expected: When all P4 prerequisites are met (all statements Passed or Waived, P3 approved), the "Approve Gate P4" button is enabled. Clicking it opens a confirmation dialog. Confirming records the decision and transitions the engagement to "Ready for Issuance" or "Closed". An audit event is written.
result: pass

### 8. Portfolio Dashboard — CSV Export (retest)
expected: On the Portfolio Dashboard (/dashboard), an "Export CSV" button is visible (even when logged in as admin/user with all roles including IR). Clicking it downloads a CSV file containing all visible engagements.
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
