---
status: complete
phase: 05-evidence-findings-and-gate-p3
source: 05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md, 05-06-SUMMARY.md, 05-07-SUMMARY.md, 05-08-SUMMARY.md
started: 2026-06-06T22:30:00Z
updated: 2026-06-19T00:30:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Evidence Registry — Add and View Evidence
expected: Navigate to an engagement. Click the Evidence tab. Click "Add Evidence" — a 640px Sheet panel opens. Fill in type, source, date received, custodian, description, sensitivity. Submit. The item appears in the table with type badge and sensitivity badge.
result: pass

### 2. Evidence File Upload
expected: On an evidence item (via Add Evidence panel or the evidence detail page), use the drag-drop file upload zone. Drop a file (≤25 MB). A per-file progress indicator appears. The upload completes and the filename appears attached to the evidence item.
result: issue
reported: "Uploads but filename missing — file uploads successfully but does not appear on the evidence item"
severity: major

### 3. Sensitivity Access Control (AL/RO exclusion)
expected: Log in as an AL or RO user. Navigate to the Evidence tab on an engagement that has a RESTRICTED evidence item. The RESTRICTED item is NOT visible in the table (absent from the DOM — filtered by the API). STANDARD items remain visible.
result: pass

### 4. Evidence Coverage Bar and Gap View
expected: On the Evidence tab, a horizontal progress bar shows covered vs. gap segments. Clicking "Show Gaps" (or the gap toggle) reveals red dashed-border cards below the bar, each representing an objective with no linked evidence and a P3 Blocker label.
result: pass

### 5. CSV Export — Evidence Registry
expected: On the Evidence tab, click the CSV export button. A CSV file downloads containing the evidence items for the engagement.
result: pass

### 6. Evidence Detail Page
expected: Click on an evidence item in the registry table. A detail page opens showing: a 2-column metadata grid (source, custodian, date received, uploaded by, description); a file list with download links; a "Linked Objectives" section; and a Delete button that is disabled (aria-disabled + tooltip) when the item is linked to objectives or findings.
result: issue
reported: "When I try to link object and click save button, I do not see any objective linked to it"
severity: major

### 7. Link Evidence to Objective
expected: On the Evidence Detail page, click the "Link Objective" button in the Linked Objectives section. A searchable Popover opens listing the engagement's objectives. Select one. The objective appears in the linked list with a checkmark, and a success toast appears.
result: pass

### 8. Gap View Panel — Objective Coverage
expected: After linking evidence to at least one objective, the Gap View (on the Evidence tab) updates: linked objectives are no longer shown as P3 blockers. An objective with NO linked evidence still shows as a red dashed card.
result: pass

### 9. Findings — Add and View
expected: Navigate to the Findings tab on an engagement. Click "Add Finding". A 520px dialog opens with a text area (Save button disabled while empty) and an evidence checkbox list (showing EvidenceTypeBadge + SensitivityBadge per item). Enter finding text, select linked evidence items, submit. The finding appears as a FindingCard with a 3-line text preview and evidence chips.
result: pass

### 10. Objective Sufficiency Summary (Findings Tab)
expected: On the Findings tab, the top section shows each planning objective with its SufficiencyChip (Evidence Needed / In Review / Sufficient with colored border). Below the chips is a "P3 Gate Status: BLOCKED" or "P3 Gate Status: READY" line with an icon.
result: pass

### 11. P3 Prerequisites Checklist
expected: On the Findings tab, a checklist shows the P3 prerequisite conditions (P2 approved, all objectives have evidence, no objectives marked Evidence Needed, all findings have linked evidence). Each row shows a CheckCircle (green) or XCircle (red) icon.
result: pass

### 12. Gate P3 Review Page — Sufficiency Management
expected: Log in as QA. Navigate to /engagements/:id/evidence/p3-review (or find the P3 Review link). The page shows an ObjectiveSufficiencyTable with columns: Objective / Evidence Count / Status. For QA/EM/AD roles, the Status column is an editable Select (Evidence Needed / In Review / Sufficient). Objectives with 0 evidence have "In Review" and "Sufficient" options disabled with a tooltip.
result: issue
reported: "Didn't understand where to test this — no navigation link to P3 Review page in the app. Also found P3 Gate Status: BLOCKED — 0 objective(s) need evidence showing even when objective is In Review with evidence linked"
severity: minor

### 13. Gate P3 Approval
expected: On the Gate P3 Review page, once all prerequisites are met (all objectives sufficient, all findings have evidence, P2 approved), enter a comment (≥10 chars) in the decision panel and click "Approve P3". An AlertDialog confirms with "Keep Under Review" and "Confirm Approve P3 ✓" buttons. Confirming: shows a success toast, redirects to the Engagement Shell, and a dismissible green banner appears: "Gate P3 approved. [job_code] is now in the Draft phase." The engagement phase advances to Draft.
result: issue
reported: "phase didn't advanced to draft and also when Gate P3 is approved, the findings still show it 'In review' and I can still go ahead and approve it"
severity: major

### 14. Gate P3 Return
expected: On the Gate P3 Review page, click "Return" (amber outline button). An AlertDialog confirms. Confirming: redirects to the Review Queue with a toast "P3 review returned for revision."
result: skipped
reason: P3 already approved on current engagement; Return unavailable after approval (correct behavior)

### 15. Gate P3 Block — Missing Prerequisites
expected: On the Gate P3 Review page, when prerequisites are NOT all met (e.g., an objective has no linked evidence), the "Approve P3" button is aria-disabled and a tooltip explains why. The P3 prerequisites checklist shows the failing condition(s) with XCircle icons.
result: issue
reported: "When P3 is already approved, Findings tab still shows objective 'In Review' and shows objective sufficiency chips + prerequisites checklist — confusing since P3 is done"
severity: minor

## Summary

total: 15
passed: 9
issues: 5
pending: 0
skipped: 1

## Gaps

<!-- Note: Test 1 initial failures (P2 dialog freeze + missing /api prefix) were diagnosed and fixed before retest passed. No open gap remains for test 1. -->

- truth: "Clicking 'Add Evidence' opens a Sheet panel and the evidence item appears in the table after submission"
  status: failed
  reason: "User reported: In order to test this I had to create a planning record and approve P2, when I clicked approve button, I got 'Gate P2 approved' notification in bottom right corner but the approval window still there with 'processing approval' button spinning; then Add Evidence panel submit fails with 'Failed to save evidence' toast"
  severity: major
  test: 1
  root_cause: "Two bugs: (1) GateP2ReviewPanel.handleApproveConfirm never called setShowApproveDialog(false) — same-route navigation meant dialog never unmounted, leaving spinner frozen. Fixed by adding setShowApproveDialog(false) before navigate(). (2) All Phase 5 api.* calls used relative paths like /engagements/:id/evidence missing the /api/ prefix — Vite proxy only forwards /api/* to backend, so all calls returned HTML 404 instead of JSON. Fixed /api/ prefix in 10 files: AddEvidencePanel, DeleteEvidenceButton, EvidenceDetailPage, LinkObjectivePopover, ApproveP3ConfirmDialog, ReturnP3ConfirmDialog, SufficiencyStatusSelect, AddFindingDialog, FindingCard, useEvidence, useFindings."
  artifacts:
    - path: "frontend/src/components/engagements/GateP2ReviewPanel.tsx"
      issue: "handleApproveConfirm missing setShowApproveDialog(false) before navigate"
    - path: "frontend/src/components/evidence/AddEvidencePanel.tsx"
      issue: "api.post path missing /api/ prefix"
    - path: "frontend/src/hooks/useEvidence.ts"
      issue: "api.get paths missing /api/ prefix"
    - path: "frontend/src/hooks/useFindings.ts"
      issue: "api.get paths missing /api/ prefix"
  missing:
    - "setShowApproveDialog(false) in handleApproveConfirm (fixed)"
    - "setShowReturnDialog(false) in handleReturnConfirm (fixed)"
    - "/api/ prefix on all evidence/findings/p3/sufficiency api.* calls (fixed)"
  debug_session: ""

- truth: "QA user can navigate to the Gate P3 Review page from within the app (without typing a URL); Findings tab shows correct P3 gate readiness"
  status: failed
  reason: "User reported: Didn't understand where to test this — no navigation link to P3 Review page in the app. Also found P3 Gate Status: BLOCKED — 0 objective(s) need evidence showing even when objective is In Review with evidence linked"
  severity: minor
  test: 12
  root_cause: "Two issues: (1) No in-app navigation link to /engagements/:id/evidence/p3-review. Added 'Gate P3 Review →' button to Findings tab header for QA/AD. (2) ObjectiveSufficiencySummary.allPass used every(o=>o.status==='sufficient') which is stricter than the backend gate check (only blocks on evidence_needed or 0 evidence). Fixed allPass to: all objectives have evidence AND none are evidence_needed — matching backend logic."
  artifacts:
    - path: "frontend/src/pages/engagements/FindingsListPage.tsx"
      issue: "No link to P3 Review; ObjectiveSufficiencySummary allPass too strict vs backend"
  missing:
    - "Gate P3 Review link on Findings tab for QA/AD users (added)"
    - "Fix allPass to match backend logic: not evidence_needed AND evidence_count > 0 (fixed)"
  debug_session: ""

- truth: "After P3 approval, engagement advances to Draft phase in the UI; P3 Review page shows 'already approved' state and prevents re-approval"
  status: failed
  reason: "User reported: phase didn't advance to draft and also when Gate P3 is approved, the findings still show it 'In review' and I can still go ahead and approve it"
  severity: major
  test: 13
  root_cause: "Two issues: (1) P3 Review page had no check for whether P3 was already approved — decision panel stayed visible and re-approval was possible. Backend also lacked idempotency guard. Fixed: backend now returns 409 on duplicate P3 approval; frontend GateP3ReviewPage fetches engagement phase on mount and shows 'Already Approved' banner + hides decision panel when phase=draft/readiness/closed. (2) FindingsListPage ObjectiveSufficiencySummary allPass used every(o=>sufficient) which is stricter than gate — objects in 'in_review' showed false BLOCKED. Fixed allPass to match backend: evidence_count>0 and not evidence_needed."
  artifacts:
    - path: "backend/src/services/findings.service.ts"
      issue: "recordP3Decision missing idempotency check for duplicate approval"
    - path: "frontend/src/pages/engagements/GateP3ReviewPage.tsx"
      issue: "No check for already-approved P3; decision panel always visible"
    - path: "frontend/src/pages/engagements/FindingsListPage.tsx"
      issue: "ObjectiveSufficiencySummary allPass stricter than backend gate logic"
  missing:
    - "409 guard in recordP3Decision for duplicate approval (added)"
    - "p3AlreadyApproved state in GateP3ReviewPage based on engagement phase (added)"
    - "Fix allPass to match backend logic (added)"
  debug_session: ""

- truth: "After linking an objective via LinkObjectivePopover, the linked objective appears in the Linked Objectives section"
  status: failed
  reason: "User reported: When I try to link object and click save button, I do not see any objective linked to it"
  severity: major
  test: 6
  root_cause: "EvidenceDetailPage.handleObjectiveLinked used an optimistic update that looked up the objective in coverage?.objectives. If coverage was null/not-yet-loaded, the lookup returned undefined and the if-guard silently skipped the update — nothing appeared. Fixed by replacing the optimistic update with a full fetchEvidence() re-fetch after linking."
  artifacts:
    - path: "frontend/src/components/evidence/EvidenceDetailPage.tsx"
      issue: "handleObjectiveLinked: optimistic update silently failed when coverage was null; replaced with fetchEvidence() re-fetch"
  missing:
    - "Replace coverage-dependent optimistic update with fetchEvidence() call (fixed)"
  debug_session: ""

- truth: "Uploaded file filename appears attached to the evidence item after upload"
  status: failed
  reason: "User reported: Uploads but filename missing"
  severity: major
  test: 2
  root_cause: "Backend missing GET /evidence/:evidence_id/files endpoint — only POST (upload) and DELETE existed. Frontend EvidenceDetailPage fetched /api/engagements/:id/evidence/:evidenceId/files which returned 404. Added the missing GET endpoint to evidence.ts router."
  artifacts:
    - path: "backend/src/routes/evidence.ts"
      issue: "GET /:evidence_id/files route did not exist"
  missing:
    - "GET /api/engagements/:id/evidence/:evidence_id/files endpoint (added)"
  debug_session: ""

- truth: "Findings tab shows P3 Approved state (not objective sufficiency chips/checklist) when P3 is already approved"
  status: failed
  reason: "User reported: When P3 is already approved, Findings tab still shows objective 'In Review' and shows objective sufficiency chips + prerequisites checklist — confusing since P3 is done"
  severity: minor
  test: 15
  root_cause: "FindingsListPage had no awareness of engagement phase. ObjectiveSufficiencySummary always showed; P3PrerequisitesChecklist always showed regardless of P3 approval state. Fixed: fetch engagement phase on mount; when p3Approved=true, show green 'Gate P3 approved' banner instead of sufficiency summary and hide prerequisites checklist."
  artifacts:
    - path: "frontend/src/pages/engagements/FindingsListPage.tsx"
      issue: "No p3Approved state; always showed sufficiency/checklist even after P3 approved"
  missing:
    - "p3Approved state based on engagement phase (added)"
    - "Show 'Gate P3 approved' banner instead of sufficiency summary when approved (added)"
    - "Hide P3 prerequisites checklist when P3 already approved (added)"
  debug_session: ""
