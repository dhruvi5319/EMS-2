---
status: diagnosed
phase: 06-draft-reference-check-gate-p4-and-dashboard
source: [06-01-SUMMARY.md, 06-02-SUMMARY.md, 06-03-SUMMARY.md, 06-04-SUMMARY.md, 06-05-SUMMARY.md, 06-06-SUMMARY.md, 06-07-SUMMARY.md]
started: 2026-06-07T00:40:00Z
updated: 2026-06-19T01:45:00Z
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
result: issue
reported: "File got uploaded, but as soon as I uploaded the file the Draft Product tab got back to its initial state where there were no drafts, but then I refreshed the page and it restored the created draft and also the uploaded doc. So there is one small issue in between."
severity: major

### 4. Add a Review Comment
expected: On the Draft Product page, a review comment thread section is visible. Typing a comment and submitting appends it to the thread with the author's name and timestamp. The thread is append-only (no edit/delete on existing comments).
result: pass

### 5. Add Draft Statements with Evidence Links
expected: Navigate to the Statements page for the draft (via a link/button from the Draft Product page or Engagement Shell). The page shows a 5-segment reference check progress bar at the top. Clicking "Add Statement" opens a dialog where you enter statement text and select one or more evidence items (multi-select). Submitting creates the statement in the table.
result: issue
reported: "Evidence multi-select broken"
severity: major

### 6. Reference Check Progress Bar
expected: The Statements page shows a segmented progress bar reflecting the distribution of statement statuses (Not Started / In Review / Passed / Failed / Waived). Each segment is color-coded: Passed = blue, Not Started = light gray, Failed = red, In Review = yellow, Waived = gray. Below the bar a gate status line shows "BLOCKED" or "READY" for Gate P4.
result: skipped
reason: Could not test — depends on Test 5 (Add Statement) which had a broken evidence multi-select

### 7. IR Statement Detail — Mark as Passed
expected: As a user with the IR (Independent Referencer) role assigned to a statement, navigating to that statement's detail page shows a reference check decision panel with radio options: Not Started / In Review / Passed / Failed. Selecting "Passed" and saving updates the statement status (visible in the list on the Statements page).
result: skipped
reason: Cannot test — no statements can be created due to broken evidence multi-select (Test 5)

### 8. IR Statement Detail — Mark as Failed with Discrepancy
expected: On the statement detail page, selecting "Failed" as the ref_status expands additional fields for discrepancy type and discrepancy notes. Filling these in and saving records the failure; the statement row in the Statements list shows a red indicator. The statement is assigned to an Analyst for correction.
result: skipped
reason: Cannot test — no statements can be created due to broken evidence multi-select (Test 5)

### 9. Analyst Correction Notice
expected: As an Analyst who has been assigned back a failed statement, the statement detail page shows an "AnalystCorrectionNotice" panel (amber/orange background with left border) describing the discrepancy from the Independent Referencer. A "Mark Revision Ready" checkbox or button allows the Analyst to send the statement back for re-check.
result: skipped
reason: Cannot test — no statements can be created due to broken evidence multi-select (Test 5)

### 10. Gate P4 Prerequisites Checklist
expected: Navigate to the Gate P4 review page (e.g. via a "Gate P4" tab or link on the Engagement Shell). The page shows a prerequisites checklist with 4 items: P3 approved, no failed reference checks, no in-review reference checks, and no not-started reference checks. Items that are not yet met display a red/warning indicator; items that pass show a green checkmark.
result: issue
reported: "Can't navigate to page — no link or tab found to reach the Gate P4 page"
severity: major

### 11. Approve Gate P4
expected: When all P4 prerequisites are satisfied (all statements Passed or Waived, P3 approved), the "Approve Gate P4" button becomes enabled. Clicking it opens a confirmation dialog. Confirming records the Gate P4 decision and transitions the engagement to "Ready for Issuance" or "Closed" status. An audit event is created (visible on the audit trail).
result: skipped
reason: Gate P4 page is not reachable (no navigation link found — Test 10)

### 12. Portfolio Dashboard — Stat Cards and Table
expected: Navigating to the Dashboard (e.g. /dashboard) shows 4 phase stat cards (Planning / Evidence / Draft / Readiness) with counts of engagements in each phase. Below is a sortable table listing engagements with columns for ID, title, phase, owner, risk level, next milestone, and gate status mini-icons. Clicking a column header sorts the table.
result: pass

### 13. Portfolio Dashboard — Filters and CSV Export
expected: The Portfolio Dashboard has filters for owner, risk level, due date, phase, and status. Applying a filter narrows the engagement list. A "Export CSV" button downloads a CSV file with all visible engagements.
result: issue
reported: "Do not see export to csv button on dashboard"
severity: major

## Summary

total: 13
passed: 4
issues: 4
pending: 0
skipped: 5

## Gaps

- truth: "After uploading a draft file, the Draft Product page continues to show the draft with the uploaded file name (no state reset)"
  status: failed
  reason: "User reported: File got uploaded, but as soon as I uploaded the file the Draft Product tab got back to its initial state where there were no drafts, but then I refreshed the page and it restored the created draft and also the uploaded doc."
  severity: major
  test: 3
  root_cause: "API response shape mismatch: backend POST /draft/file returns { file_ref, filename, size } but frontend uploadFile reads data.draft (undefined), calling setDraft(undefined), which causes the empty state guard to trigger"
  artifacts:
    - path: "frontend/src/hooks/useDraftProduct.ts"
      issue: "uploadFile reads response as { draft: DraftProduct } but backend returns { file_ref, filename, size } — data.draft is undefined, setDraft(undefined) wipes the draft state"
    - path: "backend/src/services/draft.service.ts"
      issue: "uploadDraftFile returns { file_ref, filename, size } with no DraftProduct object"
    - path: "backend/src/routes/draft.ts"
      issue: "Route passes raw uploadDraftFile result directly to res.json() without wrapping as { draft: ... }"
  missing:
    - "Fix frontend uploadFile to call fetchDraft() after successful upload (rather than reading draft from upload response)"
  debug_session: ".planning/debug/draft-upload-state-reset.md"

- truth: "Add Statement dialog has a working evidence multi-select (Command+Popover) that allows selecting one or more evidence items before submitting"
  status: failed
  reason: "User reported: Evidence multi-select broken"
  severity: major
  test: 5
  root_cause: "cmdk v1 focus-loss race condition in AddStatementForm.tsx — CommandItem missing onMouseDown={(e) => e.preventDefault()} causes Popover to dismiss before onSelect fires"
  artifacts:
    - path: "frontend/src/components/statements/AddStatementForm.tsx"
      issue: "CommandItem at ~line 172 missing onMouseDown={(e) => e.preventDefault()} — mousedown fires first, popover loses focus and unmounts before click/onSelect registers"
  missing:
    - "Add onMouseDown={(e) => e.preventDefault()} to CommandItem in AddStatementForm.tsx (same fix as AddMemberForm.tsx and LinkObjectivePopover.tsx)"
  debug_session: ".planning/debug/add-statement-evidence-multiselect.md"

- truth: "Gate P4 review page is accessible from the Engagement Shell (via a tab or link navigating to /engagements/:id/gates/p4)"
  status: failed
  reason: "User reported: Can't navigate to page — no link or tab found to reach the Gate P4 page"
  severity: major
  test: 10
  root_cause: "EngagementShellPage.tsx tab array (lines 274-291) omits a 'Gate P4' tab; no Link to /gates/p4 exists anywhere in the Shell — route is registered in App.tsx but has no UI entry point"
  artifacts:
    - path: "frontend/src/pages/EngagementShellPage.tsx"
      issue: "Tab array defines 8 tabs (overview, team, planning, evidence, findings, draft, gate-history, audit) — no Gate P4 tab or link to /engagements/:id/gates/p4"
    - path: "frontend/src/components/engagements/GateStatusCard.tsx"
      issue: "P4 gate status card is display-only — no navigation link to the P4 review page"
  missing:
    - "Add a Gate P4 navigation entry in EngagementShellPage.tsx — either a new tab, a link from the P4 GateStatusCard, or a button in the Draft Product page's 'Proceed to Gate P4' advance action"
  debug_session: ".planning/debug/gate-p4-navigation-missing.md"

- truth: "Portfolio Dashboard has an 'Export CSV' button that downloads a CSV file of all visible engagements"
  status: failed
  reason: "User reported: Do not see export to csv button on dashboard"
  severity: major
  test: 13
  root_cause: "canExport guard in PortfolioDashboardPage.tsx:34 uses !roles.includes('IR') — admin user is seeded with all roles including IR, so canExport is false and the button is never rendered"
  artifacts:
    - path: "frontend/src/pages/PortfolioDashboardPage.tsx"
      issue: "canExport = !user?.roles?.includes('IR') — too broad; admin user has IR in their roles so button is hidden even though admin should have export access"
    - path: "backend/seeds/001_admin_user.ts"
      issue: "Admin seeded with ALL_ROLES including IR — triggers the overly broad canExport exclusion"
  missing:
    - "Fix canExport to use an allowlist: const canExport = user?.roles?.some(r => ['AD','EM','AN','QA','AL','PC','RO'].includes(r)) ?? false"
  debug_session: ".planning/debug/dashboard-csv-export-missing.md"
