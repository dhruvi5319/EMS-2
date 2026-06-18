---
status: diagnosed
phase: 03-intake-and-gate-a1
source: [03-GAP-01-SUMMARY.md]
started: 2026-06-18T15:35:00Z
updated: 2026-06-18T15:50:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Intake Document Upload
expected: On a draft request detail page (as AL/AD user), the file upload zone is visible and functional — accepts PDF/DOCX up to 25MB via drag-and-drop or browse button. Shows drag-over highlight, progress bar while uploading, green success chip on completion, and error messages for oversized or wrong-type files. Uploading a second file replaces the first.
result: pass

### 2. Gate A1 Approve Flow (no blank screen)
expected: On a submitted request, fill in Risk Level and Rationale (10+ chars), click Approve, confirm in AlertDialog. The page stays on the request detail — NO blank screen. A green success banner appears in-place showing the generated job code (e.g. ENG-2026-00001) and a "View Engagement Shell →" link.
result: pass

### 3. Gate A1 Decided Card (real data + navigation)
expected: On an already-approved request, the Gate A1 section shows a read-only decided card with: real approver name (not placeholder), risk level badge, formatted date, rationale in italics. "View Gate History →" button navigates to the engagement audit trail. "View Audit Trail →" link (bottom of page) also navigates correctly to the engagement audit trail — not /dashboard.
result: issue
reported: "I opened a submitted request and it is not showing any approver name. The following is everything that I could see: Requests > REQ-2026-0001 Congressional Request Accepted test Submitted June 18, 2026 at 11:35 AM Intake Document LLM Black Hat Applications.pdf Request Details Request Type Congressional Request Requester Dhruvi Agency / Program Pivota Topic test Due Date June 22, 2026 Notes No notes provided. Gate A1 Decision ✓ Approved Date June 18, 2026 at 11:35 AM Rationale '—' View Gate History. I do not see 'View Audit Trail' link now"
severity: major

## Summary

total: 3
passed: 2
issues: 1
pending: 0
skipped: 0

## Gaps

- truth: "Gate A1 decided card shows real approver name, risk level badge, formatted date, rationale in italics; View Gate History navigates to engagement audit trail; View Audit Trail link visible and navigates correctly"
  status: failed
  reason: "User reported: No approver name shown, rationale shows '—', View Gate History present but View Audit Trail link missing"
  severity: major
  test: 3
  root_cause: "backend/src/routes/gate.ts lines 28 and 57 used 'u.full_name as decided_by_name' but the users table column is 'display_name' (per migration 001). PostgreSQL threw 'column u.full_name does not exist'; the catch() in the frontend useEffect swallowed the 500 error silently, leaving gateDecision null and showing the fallback (blank name, '—' rationale). View Audit Trail was absent because it only renders when gateDecision?.engagement_id is truthy."
  artifacts:
    - path: "backend/src/routes/gate.ts"
      issue: "Lines 28 and 57: 'u.full_name' should be 'u.display_name' — column name mismatch with users table schema"
  missing:
    - "Changed 'u.full_name' to 'u.display_name' in both SELECT clauses (approved path line 28, declined path line 57) — FIXED during diagnosis"
  debug_session: ".planning/debug/gate-a1-decided-card-missing-data.md"
