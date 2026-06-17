---
status: awaiting_verifying
phase: 05-evidence-findings-and-gate-p3
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md, 05-06-SUMMARY.md, 05-07-SUMMARY.md, 05-08-SUMMARY.md
started: 2026-06-06T22:30:00Z
updated: 2026-06-06T22:45:00Z
---

## Current Test

[not started]

## Tests

### 1. Evidence Registry — Add and View Evidence
expected: Navigate to an engagement. Click the Evidence tab. Click "Add Evidence" — a 640px Sheet panel opens. Fill in type, source, date received, custodian, description, sensitivity. Submit. The item appears in the table with type badge and sensitivity badge.
result: pending

### 2. Evidence File Upload
expected: On an evidence item (via Add Evidence panel or the evidence detail page), use the drag-drop file upload zone. Drop a file (≤25 MB). A per-file progress indicator appears. The upload completes and the filename appears attached to the evidence item.
result: pending

### 3. Sensitivity Access Control (AL/RO exclusion)
expected: Log in as an AL or RO user. Navigate to the Evidence tab on an engagement that has a RESTRICTED evidence item. The RESTRICTED item is NOT visible in the table (absent from the DOM — filtered by the API). STANDARD items remain visible.
result: pending

### 4. Evidence Coverage Bar and Gap View
expected: On the Evidence tab, a horizontal progress bar shows covered vs. gap segments. Clicking "Show Gaps" (or the gap toggle) reveals red dashed-border cards below the bar, each representing an objective with no linked evidence and a P3 Blocker label.
result: pending

### 5. CSV Export — Evidence Registry
expected: On the Evidence tab, click the CSV export button. A CSV file downloads containing the evidence items for the engagement.
result: pending

### 6. Evidence Detail Page
expected: Click on an evidence item in the registry table. A detail page opens showing: a 2-column metadata grid (source, custodian, date received, uploaded by, description); a file list with download links; a "Linked Objectives" section; and a Delete button that is disabled (aria-disabled + tooltip) when the item is linked to objectives or findings.
result: pending

### 7. Link Evidence to Objective
expected: On the Evidence Detail page, click the "Link Objective" button in the Linked Objectives section. A searchable Popover opens listing the engagement's objectives. Select one. The objective appears in the linked list with a checkmark, and a success toast appears.
result: pending

### 8. Gap View Panel — Objective Coverage
expected: After linking evidence to at least one objective, the Gap View (on the Evidence tab) updates: linked objectives are no longer shown as P3 blockers. An objective with NO linked evidence still shows as a red dashed card.
result: pending

### 9. Findings — Add and View
expected: Navigate to the Findings tab on an engagement. Click "Add Finding". A 520px dialog opens with a text area (Save button disabled while empty) and an evidence checkbox list (showing EvidenceTypeBadge + SensitivityBadge per item). Enter finding text, select linked evidence items, submit. The finding appears as a FindingCard with a 3-line text preview and evidence chips.
result: pending

### 10. Objective Sufficiency Summary (Findings Tab)
expected: On the Findings tab, the top section shows each planning objective with its SufficiencyChip (Evidence Needed / In Review / Sufficient with colored border). Below the chips is a "P3 Gate Status: BLOCKED" or "P3 Gate Status: READY" line with an icon.
result: pending

### 11. P3 Prerequisites Checklist
expected: On the Findings tab, a checklist shows the P3 prerequisite conditions (P2 approved, all objectives have evidence, no objectives marked Evidence Needed, all findings have linked evidence). Each row shows a CheckCircle (green) or XCircle (red) icon.
result: pending

### 12. Gate P3 Review Page — Sufficiency Management
expected: Log in as QA. Navigate to /engagements/:id/evidence/p3-review (or find the P3 Review link). The page shows an ObjectiveSufficiencyTable with columns: Objective / Evidence Count / Status. For QA/EM/AD roles, the Status column is an editable Select (Evidence Needed / In Review / Sufficient). Objectives with 0 evidence have "In Review" and "Sufficient" options disabled with a tooltip.
result: pending

### 13. Gate P3 Approval
expected: On the Gate P3 Review page, once all prerequisites are met (all objectives sufficient, all findings have evidence, P2 approved), enter a comment (≥10 chars) in the decision panel and click "Approve P3". An AlertDialog confirms with "Keep Under Review" and "Confirm Approve P3 ✓" buttons. Confirming: shows a success toast, redirects to the Engagement Shell, and a dismissible green banner appears: "Gate P3 approved. [job_code] is now in the Draft phase." The engagement phase advances to Draft.
result: pending

### 14. Gate P3 Return
expected: On the Gate P3 Review page, click "Return" (amber outline button). An AlertDialog confirms. Confirming: redirects to the Review Queue with a toast "P3 review returned for revision."
result: pending

### 15. Gate P3 Block — Missing Prerequisites
expected: On the Gate P3 Review page, when prerequisites are NOT all met (e.g., an objective has no linked evidence), the "Approve P3" button is aria-disabled and a tooltip explains why. The P3 prerequisites checklist shows the failing condition(s) with XCircle icons.
result: pending

## Summary

total: 15
passed: 0
issues: 0
pending: 15
skipped: 0

## Gaps

[none yet]
