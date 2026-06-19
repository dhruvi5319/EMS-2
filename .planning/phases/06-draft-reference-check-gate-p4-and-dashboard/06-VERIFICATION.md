---
phase: 06-draft-reference-check-gate-p4-and-dashboard
verified: 2026-06-19T04:00:00Z
status: human_needed
score: 21/21 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 17/21
  gaps_closed:
    - "POST /api/engagements/:id/draft/comments — useDraftProduct now sends { comment_text } (line 137)"
    - "Waiver sets ref_status='waived' — migration 010 adds 'waived' to DB constraint; service validStatuses includes 'waived'; canWaive guard enforces EM/AD; discrepancy_notes mandatory"
    - "POST /api/engagements/:id/gate/p4 — ApproveP4ConfirmDialog now uses /api/ prefix (line 42)"
    - "GET /api/engagements/:id/gate/p4/prerequisites — GateP4ReviewPage now uses /api/ prefix (line 38)"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Navigate to Draft Product tab on an engagement in draft phase and add a review comment"
    expected: "Comment appears in the thread with author name and timestamp; 201 response from backend"
    why_human: "Field rename fix (text → comment_text) needs runtime browser verification"
  - test: "Waive a statement as an EM user — enter a justification note and confirm"
    expected: "Statement shows 'Waived' badge; P4 prerequisites no longer blocked by that statement"
    why_human: "DB constraint fix (migration 010) requires migration run; enforcement is database-level"
  - test: "Attempt to waive a statement as an AN/IR user"
    expected: "403 response; no status change; user sees error message"
    why_human: "EM/AD role guard in updateStatement needs runtime verification with real session tokens"
  - test: "Navigate to the Gate P4 tab on an engagement shell; verify prerequisites checklist loads"
    expected: "Checklist populates with 4 items (P3 status, passed checks, in-review checks, not-started checks); correct pass/fail indicators shown"
    why_human: "API path fix (/api/ prefix) requires runtime browser verification through Vite proxy"
  - test: "As a PC user, approve Gate P4 — enter ≥10 char comment, select outcome, confirm in dialog"
    expected: "Redirect to engagement shell with green P4 approved banner; engagement phase/status updated"
    why_human: "API path fix and post-approval navigation state persistence must be observed in browser"
  - test: "Portfolio dashboard CSV export applies current filters (e.g. Phase = Draft)"
    expected: "Downloaded CSV contains only draft-phase engagements with all 16 expected columns; Admin user (all roles including IR) sees Export CSV button"
    why_human: "Allowlist canExport fix and CSV blob download require browser execution; IR-only user must not see button"
  - test: "AddStatementForm evidence picker — click an evidence item in the Popover CommandItem"
    expected: "Item is checked/selected and selection badge appears; Popover stays open for multi-select"
    why_human: "onMouseDown preventDefault fix for cmdk v1 focus-loss race condition requires browser interaction"
---

# Phase 6: Draft Product, Reference Check, Gate P4, and Dashboard — Verification Report

**Phase Goal:** The team can create and track a draft product, an Independent Referencer can check all statements against evidence, and the Publishing Coordinator can approve Gate P4, completing the engagement; the portfolio dashboard shows all engagements  
**Verified:** 2026-06-19T04:00:00Z  
**Status:** human_needed — all automated checks pass; 7 items flagged for browser verification  
**Re-verification:** Yes — after gap closure (GAP-01, GAP-02, GAP-03)

---

## Re-Verification Summary

The previous verification (2026-06-07) found 4 gaps across 3 concerns. Three gap closure plans (GAP-01, GAP-02, GAP-03) were executed and committed between `a83236a` and `fe1b8d0`. All 4 previously-failed truths are now **VERIFIED** by static analysis.

| Gap | Previous Status | Fixed By | New Status |
|-----|----------------|----------|------------|
| `useDraftProduct` sends `{ text }` not `{ comment_text }` | ✗ FAILED | GAP-01 (commit `a83236a` + `d9969b7`) | ✓ VERIFIED |
| DB constraint excludes 'waived'; service excludes 'waived' | ✗ FAILED | GAP-03 (commit `6988ba6`) + migration `010_statement_waived.ts` | ✓ VERIFIED |
| `ApproveP4ConfirmDialog` missing `/api/` prefix | ✗ FAILED | GAP-02 (commit `fa2e3ce`) | ✓ VERIFIED |
| `GateP4ReviewPage` missing `/api/` prefix | ✗ FAILED | GAP-02 (commit `fa2e3ce`) | ✓ VERIFIED |

---

## Goal Achievement

### Observable Truths

#### Plan 06-01: Draft Product Backend API (F11)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | POST /api/engagements/:id/draft creates draft record, returns 201 | ✓ VERIFIED | `draftRouter.post('/')` calls `createDraft()` with engagement phase guard |
| 2 | GET /api/engagements/:id/draft returns draft or 404 | ✓ VERIFIED | `draftRouter.get('/')` calls `getDraft()`, returns 404 when null |
| 3 | PATCH /api/engagements/:id/draft updates metadata/status; validates transitions | ✓ VERIFIED | `ALLOWED_TRANSITIONS` map enforced in `updateDraft()` service |
| 4 | POST /api/engagements/:id/draft/file uploads file (max 50MB); returns `{ draft: DraftProduct }` | ✓ VERIFIED | `draft.ts` line 128-129: re-fetches via `getDraft()` and returns `{ draft }` |
| 5 | DELETE /api/engagements/:id/draft/file removes draft file | ✓ VERIFIED | `draftRouter.delete('/file')` calls `deleteDraftFile()` |
| 6 | GET /api/engagements/:id/draft/comments returns list newest-first | ✓ VERIFIED | `listDraftComments()` JOINs users, orders by commented_at DESC |
| 7 | POST /api/engagements/:id/draft/comments appends new comment (no edit) | ✓ VERIFIED | `useDraftProduct.ts` line 137: sends `{ comment_text: text }`; backend line 167: destructures `{ comment_text }` — field names now match |
| 8 | Draft creation blocked if engagement.phase != 'draft' | ✓ VERIFIED | `createDraft()` checks `engagement.phase !== 'draft'`, throws 422 |

#### Plan 06-02: Statements + Reference Check Backend API (F12)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 9 | POST /api/engagements/:id/statements creates with ≥1 evidence_id; returns 201 | ✓ VERIFIED | `createStatement()` validates `evidence_ids.length >= 1`, throws 422 otherwise |
| 10 | GET /api/engagements/:id/statements returns list filterable by ref_status | ✓ VERIFIED | `listStatements()` accepts ref_status filter, priority CASE sort |
| 11 | PATCH /api/engagements/:id/statements/:statement_id updates status/discrepancy | ✓ VERIFIED | `updateStatement()` handles ref_status, discrepancy_notes, assigned_to |
| 12 | DELETE /api/engagements/:id/statements/:statement_id removes statement | ✓ VERIFIED | `deleteStatement()` blocks on passed/waived status; cascade removes evidence links |
| 13 | Waiver sets ref_status='waived'; restricted to EM/AD; discrepancy_notes mandatory | ✓ VERIFIED | Migration 010 adds 'waived' to DB constraint; `validStatuses` line 245 includes 'waived'; `canWaive` guard at line 267; justification check at line 274–280 |
| 14 | Discrepancy assignment creates AuditEvent STATEMENT_DISCREPANCY_ASSIGNED | ✓ VERIFIED | `updateStatement()` inserts audit_event when ref_status=failed + assigned_to set |
| 15 | Creating statement with 0 evidence_ids returns 422 | ✓ VERIFIED | `createStatement()` throws 422 when evidence_ids.length < 1 |

#### Plan 06-03: Gate P4 Backend API (F13) + Portfolio API (F14)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 16 | GET /api/engagements/:id/gate/p4/prerequisites returns { met, blockers } | ✓ VERIFIED | `checkP4Prerequisites()` checks 4 blocker types; route registered at `/prerequisites` |
| 17 | POST /api/engagements/:id/gate/p4 sets engagement status + creates GateDecision + AuditEvent | ✓ VERIFIED | Backend: `recordP4Decision()` transactional; Frontend: `ApproveP4ConfirmDialog` line 42 now uses `/api/` prefix |
| 18 | P4 blocked when any statement has ref_status in_review or failed, or P3 not approved | ✓ VERIFIED | gatep4.service checks p3_not_approved, has_failed_checks, has_in_review_checks, has_not_started_checks |
| 19 | GET /api/engagements returns paginated list with filter+sort | ✓ VERIFIED | `listEngagements()` with full F14 filter/sort; /export registered before /:id |
| 20 | GET /api/engagements/export returns text/csv with all 16 columns | ✓ VERIFIED | `exportEngagements()` with csvEscape(), Content-Disposition header; route ordering correct |

#### Plans 06-04 through 06-07: UI Layer (F11-F14)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 21 | GET /api/engagements/:id/gate/p4/prerequisites fetched on page load to drive checklist | ✓ VERIFIED | `GateP4ReviewPage.tsx` line 38: `api.get('/api/engagements/${engagementId}/gate/p4/prerequisites')` — /api/ prefix present |
| 22 | POST /api/engagements/:id/gate/p4 called on confirm dialog submit | ✓ VERIFIED | `ApproveP4ConfirmDialog.tsx` line 42: `api.post('/api/engagements/${engagementId}/gate/p4', ...)` — /api/ prefix present |

**Score:** 21/21 truths verified (0 gaps)

---

### New Gap Closure Must-Haves

All 5 new must-haves from GAP-01 and GAP-02 verified:

| Must-Have | Status | Evidence |
|-----------|--------|----------|
| `backend/src/routes/draft.ts` POST /file returns `{ draft: DraftProduct }` | ✓ VERIFIED | Lines 128-129: calls `getDraft()` then `res.json({ draft })` — consistent shape with GET/POST/PATCH |
| `AddStatementForm.tsx` CommandItem has `onMouseDown={(e) => e.preventDefault()}` | ✓ VERIFIED | Line 176: `onMouseDown={(e) => e.preventDefault()}` present on CommandItem inside Popover |
| `EngagementShellPage.tsx` tab array includes `{ value: 'gate-p4', label: 'Gate P4' }` | ✓ VERIFIED | Line 282: `{ value: 'gate-p4', label: 'Gate P4' }` in tab array; TabsContent renders `<GateP4ReviewPage />` at line 342 |
| `PortfolioDashboardPage.tsx` canExport uses `roles?.some()` allowlist | ✓ VERIFIED | Line 35: `roles?.some(r => ['AD', 'EM', 'AN', 'QA', 'AL', 'PC', 'RO'].includes(r)) ?? false` |
| `statements.service.ts` updateStatement enforces EM/AD for waiver + mandatory discrepancy_notes | ✓ VERIFIED | Lines 266-280: `canWaive = userRoles.includes('EM') \|\| userRoles.includes('AD')` + justification check |

---

### Required Artifacts

All originally required artifacts continue to exist and pass the minimum-lines check. No regressions detected.

| Artifact | Lines | Status | Notes |
|----------|-------|--------|-------|
| `backend/src/services/draft.service.ts` | 390 | ✓ VERIFIED | Unchanged from initial verification |
| `backend/src/routes/draft.ts` | 179 | ✓ VERIFIED | Modified by GAP-01: POST /file now re-fetches via getDraft() and returns `{ draft }` |
| `backend/src/services/statements.service.ts` | 396 | ✓ VERIFIED | Modified by GAP-03: canWaive guard + mandatory notes + waived delete-block added |
| `backend/migrations/010_statement_waived.ts` | 26 | ✓ NEW | Adds 'waived' to draft_statements CHECK constraint; picked up by knex directory-based runner |
| `backend/src/routes/statements.ts` | 115 | ✓ VERIFIED | Unchanged |
| `backend/src/services/gatep4.service.ts` | ~430 | ✓ VERIFIED | Unchanged |
| `backend/src/routes/gatep4.ts` | 80 | ✓ VERIFIED | Unchanged |
| `frontend/src/hooks/useDraftProduct.ts` | 160 | ✓ VERIFIED | Modified by GAP-01 team: sends `{ comment_text: text }` at line 137; normalizes response at lines 127, 140 |
| `frontend/src/components/statements/AddStatementForm.tsx` | 249 | ✓ VERIFIED | Modified by GAP-01: `onMouseDown={(e) => e.preventDefault()}` at line 176 |
| `frontend/src/pages/engagements/GateP4ReviewPage.tsx` | 281 | ✓ VERIFIED | `/api/` prefix now present (line 38) |
| `frontend/src/components/gatep4/ApproveP4ConfirmDialog.tsx` | 113 | ✓ VERIFIED | `/api/` prefix now present (line 42) |
| `frontend/src/pages/EngagementShellPage.tsx` | 356 | ✓ VERIFIED | Modified by GAP-02: Gate P4 tab added (line 282); TabsContent embeds GateP4ReviewPage (line 342) |
| `frontend/src/pages/PortfolioDashboardPage.tsx` | 207 | ✓ VERIFIED | Modified by GAP-02: canExport now allowlist at line 35 |
| `frontend/src/pages/DraftProductPage.tsx` | 330 | ✓ VERIFIED | Unchanged |
| `frontend/src/components/draft/DraftStatusStepper.tsx` | 107 | ✓ VERIFIED | Unchanged |
| `frontend/src/pages/StatementsPage.tsx` | 222 | ✓ VERIFIED | Unchanged |
| `frontend/src/hooks/useStatements.ts` | 176 | ✓ VERIFIED | `waiveStatement` sends `{ ref_status: 'waived', discrepancy_notes: justification }` — aligned with service |
| `frontend/src/pages/engagements/StatementDetailPage.tsx` | 465 | ✓ VERIFIED | Unchanged |
| `frontend/src/components/gatep4/P4PrerequisitesChecklist.tsx` | 141 | ✓ VERIFIED | Unchanged |
| `frontend/src/components/gatep4/P4DecisionPanel.tsx` | 225 | ✓ VERIFIED | Unchanged |
| `frontend/src/components/dashboard/GateMiniStatusRow.tsx` | 104 | ✓ VERIFIED | Unchanged |
| `frontend/src/hooks/usePortfolio.ts` | 220 | ✓ VERIFIED | Unchanged |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `useDraftProduct.ts` | `/api/engagements/:id/draft/comments` POST | `{ comment_text: text }` in body (line 137) | ✓ WIRED | Backend destructures `{ comment_text }` at draft.ts line 167 — field names now match |
| `draft.ts` POST /file | `{ draft: DraftProduct }` response | `getDraft()` re-fetch + `res.json({ draft })` (lines 128-129) | ✓ WIRED | `useDraftProduct.uploadFile` reads `data.draft` at line 105-106 — shapes now consistent |
| `AddStatementForm.tsx` CommandItem | Radix Popover | `onMouseDown={(e) => e.preventDefault()}` (line 176) | ✓ WIRED | Prevents focus-loss race before onSelect fires — canonical cmdk v1 + Radix fix |
| `GateP4ReviewPage.tsx` | `/api/engagements/:id/gate/p4/prerequisites` | `api.get('/api/engagements/${engagementId}/gate/p4/prerequisites')` (line 38) | ✓ WIRED | /api/ prefix now present; Vite proxy will route correctly |
| `ApproveP4ConfirmDialog.tsx` | `/api/engagements/:id/gate/p4` | `api.post('/api/engagements/${engagementId}/gate/p4', ...)` (line 42) | ✓ WIRED | /api/ prefix now present |
| `EngagementShellPage.tsx` | `GateP4ReviewPage` | Tab array entry + `<TabsContent value="gate-p4"><GateP4ReviewPage /></TabsContent>` | ✓ WIRED | Import at line 14; tab at line 282; TabsContent at lines 341-343 |
| `PortfolioDashboardPage.tsx` | Export CSV visibility | `canExport = roles?.some(r => allowlist.includes(r))` (line 35) | ✓ WIRED | Allowlist includes AD/EM/AN/QA/AL/PC/RO; admin with all roles (including IR) gets access |
| `statements.service.ts updateStatement` | EM/AD role guard for 'waived' | `canWaive = userRoles.includes('EM') \|\| userRoles.includes('AD')` (line 267) | ✓ WIRED | Throws 403 if not EM or AD |
| `statements.service.ts updateStatement` | Mandatory justification for waiver | Checks `justification` empty → throws 422 (lines 274-280) | ✓ WIRED | Uses `discrepancy_notes` field — no new DB column needed |
| `migration 010_statement_waived.ts` | `draft_statements` CHECK constraint | Drops old constraint; adds new with 'waived' in the ANY array | ✓ WIRED | Picked up by `knexfile.ts` directory-based runner (`./migrations`, extension: `ts`) |

---

### Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| F11: Draft product record — CRUD, file upload, comment thread | ✓ SATISFIED | Comment field mismatch fixed (GAP-01); POST /file now returns consistent `{ draft }` shape |
| F12: Draft statements — evidence linking, ref check status, waiver, discrepancy | ✓ SATISFIED | Waiver (ref_status='waived') unblocked by migration 010; EM/AD guard + mandatory notes enforced by service (GAP-03) |
| F13: Gate P4 — prerequisites, PC/EM/AD approval, terminal status | ✓ SATISFIED | /api/ prefix fixes applied to both GateP4ReviewPage and ApproveP4ConfirmDialog (GAP-02); Gate P4 tab added to EngagementShellPage (GAP-02) |
| F14: Portfolio dashboard — phase stat cards, filters, sortable table, CSV export | ✓ SATISFIED | canExport allowlist fix ensures admin sees Export button (GAP-02); all other paths unchanged |

---

### Anti-Patterns Scan (Post-Gap-Closure)

Previously identified blockers — all cleared:

| File | Pattern | Previous Severity | Current Status |
|------|---------|-------------------|----------------|
| `useDraftProduct.ts` line 135 | Sent `{ text }` not `{ comment_text }` | 🛑 Blocker | ✅ CLEARED — now sends `{ comment_text: text }` |
| `GateP4ReviewPage.tsx` line 38 | Missing `/api/` prefix | 🛑 Blocker | ✅ CLEARED — `/api/` prefix present |
| `ApproveP4ConfirmDialog.tsx` line 42 | Missing `/api/` prefix | 🛑 Blocker | ✅ CLEARED — `/api/` prefix present |
| `backend/migrations/002_core_tables.ts` | Constraint excluded 'waived' | 🛑 Blocker | ✅ CLEARED — migration 010 extends constraint |
| `statements.service.ts` | validStatuses excluded 'waived' | 🛑 Blocker | ✅ CLEARED — 'waived' in validStatuses; canWaive guard added |

No new anti-patterns introduced by gap closure commits. Pre-existing non-blocking issues remain (schema drift for `discrepancy_type`/`assigned_back_to` — Warning severity only, documented in initial verification).

---

### Human Verification Required

All automated static-analysis checks pass. The following items require browser-level verification:

#### 1. Draft Comment Submission (field rename fix)
**Test:** On a draft-phase engagement, open the Draft Product tab, type a review comment, and click Submit  
**Expected:** Comment appears in thread with correct author name, timestamp, and text; backend returns 201  
**Why human:** The `{ comment_text }` fix spans hook → backend; field name contract is only testable at runtime through the actual HTTP stack

#### 2. Waiver Flow — Successful Waiver (EM user)
**Test:** As an EM user, navigate to Statements page, find a statement, click "Waive", enter a justification note (non-empty), confirm  
**Expected:** Statement shows "Waived" badge; P4 prerequisites no longer list that statement as a blocker  
**Why human:** Migration 010 must be run against the actual DB first; constraint enforcement and guard logic are database + session-level

#### 3. Waiver Flow — Blocked for Non-EM/AD (role guard)
**Test:** As an AN or IR user, attempt to waive a statement  
**Expected:** 403 response; statement status unchanged; UI shows an error message  
**Why human:** Role guard in `updateStatement` requires a real authenticated session with correct role claims

#### 4. Gate P4 Prerequisites Checklist Load
**Test:** Navigate to any engagement's shell page, click the Gate P4 tab; verify the prerequisites checklist populates  
**Expected:** 4 checklist items (P3 gate status, passed ref checks, in-review, not-started) appear with pass/fail indicators; no network errors in devtools  
**Why human:** /api/ prefix fix routes through Vite proxy — needs runtime browser verification

#### 5. Gate P4 Approval
**Test:** As a PC user, go to Gate P4 tab; with all prerequisites met, enter ≥10 char comment, select "Ready for Issuance", click Approve, confirm in dialog  
**Expected:** Toast "Gate P4 approved."; redirect to engagement shell; green P4 approved banner visible; engagement status updated in header  
**Why human:** Post-approval navigation state (`p4Approved: true`) and banner persistence must be observed in browser

#### 6. Portfolio Dashboard CSV Export (canExport allowlist)
**Test (admin):** Log in as admin user (all roles including IR); verify Export CSV button is visible; set a filter (Phase = Draft); click Export  
**Expected:** Button is visible for admin; CSV downloads with only draft-phase engagements and 16 expected columns  
**Test (IR-only):** Log in as IR-only user; verify Export CSV button is NOT visible  
**Why human:** `roles?.some()` allowlist logic and Blob download require browser execution; multi-role user sessions can only be tested at runtime

#### 7. AddStatementForm Evidence Picker (onMouseDown fix)
**Test:** Open Add Statement dialog; click the evidence picker Popover trigger; click an evidence item in the CommandItem list  
**Expected:** Evidence item is checked/selected; selection badge appears; Popover stays open for multi-select (does not close on click)  
**Why human:** The cmdk v1 + Radix Popover focus-loss race condition is a browser interaction timing issue that cannot be verified statically

---

### Positive Findings (Carried Forward)

- `/export` route correctly registered before `/:id` (critical ordering verified ✓)
- P4 outcome restricted to 'ready_for_issuance' for PC-only users (`!isPC` guard on Closed radio)
- Post-P4 approval navigation sends `{ p4Approved: true, p4Outcome, p4JobCode }` state; EngagementShellPage reads it correctly with green banner and dismiss button
- DraftStatusStepper is custom Tailwind (not shadcn) — 4 steps with correct labels and 3-state nodes
- ALLOWED_TRANSITIONS in draft.service.ts enforces server-side FSM correctly
- All sub-routers mounted in correct order in engagements.ts
- `useStatements.ts` `waiveStatement` sends `discrepancy_notes: justification` — fully aligned with updated service validation
- Migration 010 `down()` function safely reverts waived rows before dropping constraint
- canExport allowlist approach is robust to admin holding all roles (AD+EM+IR+...) — any allowed role grants access

---

_Verified: 2026-06-19T04:00:00Z_  
_Verifier: Claude (pivota_spec-verifier)_  
_Re-verification after: GAP-01 (a83236a, d9969b7), GAP-02 (fa2e3ce, fe1b8d0), GAP-03 (6988ba6)_
