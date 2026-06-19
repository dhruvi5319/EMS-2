---
status: complete
phase: 05-evidence-findings-and-gate-p3
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md, 05-06-SUMMARY.md, 05-07-SUMMARY.md, 05-08-SUMMARY.md, 05-GAP-01-SUMMARY.md, 05-GAP-02-SUMMARY.md
started: 2026-06-19T00:35:00Z
updated: 2026-06-19T01:10:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Evidence Registry — Add and View Evidence
expected: Navigate to an engagement that has passed Gate P2 (in planning phase). Click the Evidence tab. Click "Add Evidence" — a 640px Sheet panel opens. Fill in type, source, date received, custodian, description, sensitivity (Standard or Restricted). Submit. The item appears in the evidence table with a type badge and sensitivity badge.
result: pass

### 2. Evidence File Upload — Filename Appears After Upload
expected: On the Evidence Detail page (click an evidence item in the registry table), use the file upload zone to upload a file (≤25 MB). After upload completes, the filename appears in the file list on the detail page.
result: pass

### 3. Sensitivity Access Control (AL/RO exclusion)
expected: Log in as an AL or RO user. Navigate to the Evidence tab on an engagement that has a RESTRICTED evidence item. The RESTRICTED item is NOT visible in the table. STANDARD items remain visible.
result: pass

### 4. Evidence Coverage Bar and Gap View
expected: On the Evidence tab, a horizontal progress bar shows covered vs. gap segments. Clicking "Show Gaps" reveals red dashed-border cards below the bar, each representing an objective with no linked evidence and a P3 Blocker label.
result: issue
reported: "P3 blocker label is not visible on gap cards"
severity: minor

### 5. CSV Export — Evidence Registry
expected: On the Evidence tab, click the CSV export button. A CSV file downloads containing the evidence items for the engagement.
result: pass

### 6. Evidence Detail Page — Link Objective and See It Listed
expected: On the Evidence Detail page, click "Link Objective" in the Linked Objectives section. A searchable Popover opens listing the engagement's objectives. Select one and save. The linked objective now appears in the Linked Objectives section on the detail page (without needing to refresh).
result: issue
reported: "Can select objective but it doesn't appear in the linked objectives section after saving"
severity: major

### 7. Gap View Panel Updates After Linking
expected: After linking evidence to an objective, navigate back to the Evidence tab. The coverage bar updates: the objective that was just linked is no longer shown as a P3 blocker in the gap view.
result: skipped
reason: Dependent on Test 6 (objective linking not working)

### 8. Findings — Add and View
expected: Navigate to the Findings tab on an engagement. Click "Add Finding". A dialog opens with a text area and an evidence checkbox list. Enter finding text, select linked evidence items, submit. The finding appears as a FindingCard with a text preview and evidence chips.
result: skipped
reason: User unable to test at this time

### 9. Objective Sufficiency Summary (Findings Tab)
expected: On the Findings tab, the top section shows each planning objective with its SufficiencyChip (Evidence Needed / In Review / Sufficient). Below the chips is a "P3 Gate Status: BLOCKED" or "P3 Gate Status: READY" line with an icon.
result: pass

### 10. P3 Prerequisites Checklist
expected: On the Findings tab, a checklist shows the P3 prerequisite conditions (P2 approved, all objectives have evidence, no objectives marked Evidence Needed, all findings have linked evidence). Each row shows a green checkmark or red X icon.
result: pass

### 11. Gate P3 Review Page — Navigation and Sufficiency Management
expected: On the Findings tab (logged in as QA), a "Gate P3 Review →" link/button is visible in the header. Clicking it navigates to /engagements/:id/evidence/p3-review. The page shows an ObjectiveSufficiencyTable with editable Status dropdowns for QA/EM/AD roles. Objectives with 0 evidence have "In Review" and "Sufficient" options disabled with a tooltip.
result: skipped
reason: User unable to test at this time

### 12. Gate P3 Approval — Phase Advances to Draft
expected: On the Gate P3 Review page, once all prerequisites are met, enter a comment (≥10 chars) and click "Approve P3". An AlertDialog confirms. Confirming shows a success toast, redirects to the Engagement Shell, and a dismissible green banner appears. The engagement phase advances to Draft.
result: skipped
reason: User unable to test at this time

### 13. Gate P3 Idempotency — Re-approval Blocked
expected: After Gate P3 is approved, visiting the Gate P3 Review page shows an "Already Approved" banner and hides the decision panel. Attempting to approve again (if the button were somehow available) would be blocked by a 409 response.
result: skipped
reason: User unable to test at this time

### 14. Findings Tab Post-P3 — Shows Approved State
expected: After Gate P3 is approved, the Findings tab shows a green "Gate P3 approved" banner instead of the objective sufficiency chips and prerequisites checklist. The P3 prerequisites checklist is hidden.
result: skipped
reason: User unable to test at this time

### 15. Gate P3 Return
expected: On the Gate P3 Review page (before approval), click "Return" (amber outline button). An AlertDialog confirms. Confirming redirects to the Review Queue with a toast "P3 review returned for revision."
result: skipped
reason: User unable to test at this time

## Summary

total: 15
passed: 6
issues: 2
pending: 0
skipped: 7

## Gaps

- truth: "Gap cards show a P3 Blocker label for objectives with no linked evidence"
  status: failed
  reason: "User reported: P3 blocker label is not visible on gap cards"
  severity: minor
  test: 4
  artifacts: []
  missing: []

- truth: "After selecting an objective via the LinkObjectivePopover, the linked objective appears immediately in the Linked Objectives section"
  status: failed
  reason: "User reported: Can select objective but it doesn't appear in the linked objectives section after saving"
  severity: major
  test: 6
  artifacts: []
  missing: []
