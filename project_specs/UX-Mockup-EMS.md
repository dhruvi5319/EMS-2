# UX Mockup — Lightweight Engagement Management System (EMS)

**Project:** EMS — Lightweight Engagement Management System  
**Generated:** 2026-06-04  
**Based on:** UserStories-EMS.md, JOURNEYS-EMS.md, PRD-EMS.md, FRD-EMS.md, PROJECT.md  
**Version:** 1.0

---

## Overview

### UX Approach

The EMS is a governance-first workflow tool, not a collaborative document editor. Every design decision prioritizes:

1. **Governance clarity** — Gate status, approver, date, and rationale must always be visible and unambiguous.
2. **Role-oriented action surfaces** — Each role sees only their permitted actions; no cluttered UI with disabled controls.
3. **Proactive status** — Users should never have to ask "what is blocking this?" — blockers are surfaced automatically.
4. **Required-field clarity before submission** — Inline validation with a "ready to submit" indicator prevents late-failure rework.
5. **Audit trail confidence** — Every action writes a durable, visible record; users trust the system as the source of truth.

### Design Principles

| Principle | Application |
|-----------|-------------|
| **Single source of truth** | Engagement Shell is the hub; all artifacts navigate back to it |
| **Gates are visible** | A1/P2/P3/P4 status cards appear on every engagement-related page |
| **Blockers are named** | Blocker messages name specific records (objective text, statement prefix), not vague categories |
| **Submit-readiness signaling** | Required-field checklist with green/red indicators appears before every gate submission |
| **Minimal navigation depth** | Maximum 2 clicks from dashboard to any action; key sections in persistent sidebar |
| **Role isolation** | Decision controls (Approve/Decline/Return) render only for the permitted role |

### Information Architecture

```
App
├── Login
├── Dashboard (Portfolio) [default landing]
├── Requests
│   ├── New Request
│   └── Request Detail
├── Engagements
│   └── Engagement Shell [hub]
│       ├── Team & Milestones
│       ├── Planning Record
│       ├── Evidence
│       │   └── Evidence Detail
│       ├── Findings
│       ├── Draft Product
│       │   └── Reference Check (Indexing)
│       ├── Gate History
│       └── Audit Trail
└── Review Queue
```

### Engagement Lifecycle Flow

```
Request (draft) → Request (submitted) → [Gate A1: AL approves/declines]
    │
    ▼ Approved
Engagement Shell (phase: planning)
    │
    ├── Team assigned + Milestones set
    ├── Planning Record (draft → ready_for_review)
    │       ↓
    │   [Gate P2: QA approves/returns]
    │       ↓ Approved → phase: evidence
    │
    ├── Evidence uploaded + linked to objectives
    ├── Findings created + linked to evidence
    │       ↓
    │   [Gate P3: QA approves/returns]
    │       ↓ Approved → phase: draft
    │
    ├── Draft Product created
    ├── Statements indexed + linked to evidence
    ├── Reference checks (IR: pass/fail)
    │       ↓
    │   [Gate P4: PC/EM approves]
    │       ↓ Approved → status: ready_for_issuance / closed
    │
    └── [Read-only — engagement closed]
```

### Role Color Coding (used across wireframes)

| Role | Abbreviation | Primary Action |
|------|--------------|----------------|
| Engagement Acceptance Lead | AL | Gate A1 approve/decline |
| Engagement Manager | EM | Setup, planning, metadata |
| Analyst | AN | Evidence, findings, statements |
| QA Reviewer | QA | Gates P2, P3 review |
| Independent Referencer | IR | Reference check pass/fail |
| Publishing Coordinator | PC | Gate P4 final approval |
| Read-Only Stakeholder | RO | View only |
| Admin | AD | User/role management |

### Layout Shell

All authenticated pages share this outer shell:

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡ EMS]  [Global Search ___________________]  [User ▾] [Logout] │
├────────┬─────────────────────────────────────────────────────────┤
│ NAV    │                                                          │
│        │   PAGE CONTENT AREA                                      │
│ Dash   │                                                          │
│ Requests│                                                         │
│ Engage-│                                                          │
│ ments  │                                                          │
│ Review │                                                          │
│ Queue  │                                                          │
│ Reports│                                                          │
│        │                                                          │
│ [Role] │                                                          │
└────────┴─────────────────────────────────────────────────────────┘
```

- Sidebar: 220px fixed; collapses to icon-only on tablet/mobile
- Content area: responsive fluid, max-width 1280px centered
- Active nav item: highlighted with accent border + bold
- Role badge shown at bottom of sidebar

---
# Flow-00: Intake and Acceptance (J1)

**User Stories:** US-0.1, US-2.1, US-2.2, US-2.3, US-2.4, US-3.1, US-3.2, US-3.3, US-3.4  
**Personas:** Marcus Reid (AL)  
**Journeys:** JRN-01.1, JRN-01.2

---

## Flow 1A: Create and Submit a Request

**Trigger:** AL clicks "New Request" from Requests list or Dashboard  
**Entry:** Requests list page  
**Exit:** Request submitted → appears in A1 Review Queue

```
[Requests List]
    │
    ▼
[New Request Form]
    │ Enter request_type (required to save draft)
    │ Enter requester, topic, agency/program, due_date
    │ (Optional) Upload intake document
    │
    ├── "Save as Draft" ─────────────▶ [Request Detail — Draft state]
    │       │                               │
    │       │                          "Edit" button available
    │       │                          Toast: "Draft saved [timestamp]"
    │       │
    └── "Submit" ──▶ [Validation check]
                          │
                          ├── Missing required fields ──▶ [Inline field errors]
                          │                                 (remain on form)
                          │
                          └── All fields valid ──▶ [Request Detail — Submitted]
                                                        │
                                                        Toast: "Request submitted"
                                                        Status badge: "Submitted"
                                                        Appears in AL's Review Queue
```

**Key UX Rules:**
- `request_type` dropdown required before "Save as Draft" enables
- "Submit" button disabled until required-for-submit fields are populated (real-time validation)
- Past `due_date` triggers a yellow warning banner: "Due date is in the past. This is permitted for retrospective mandates." — does not block submission
- File upload shows progress indicator + filename confirmation
- After draft save: toast "Draft saved" with timestamp; redirects to request detail page
- After submission: status badge changes from "Draft" → "Submitted"; edit controls removed

---

## Flow 1B: A1 Review and Decision

**Trigger:** AL opens a submitted request from Review Queue  
**Entry:** Review Queue or Requests list (filtered: Submitted)  
**Exit A (Approve):** Engagement Shell auto-created → AL redirected to new Engagement Shell  
**Exit B (Decline):** Request status → Declined → AL returns to requests list

```
[Review Queue / Requests List]
    │ Filter: status = Submitted
    │ Sorted by: due_date ASC (oldest first)
    │
    ▼
[Request Detail Page — Submitted]
    │
    │ AL reviews: type, requester, topic, agency, due_date, notes
    │ AL downloads / reviews intake document
    │
    ├── A1 Decision Panel (visible only to AL)
    │       │
    │       ├── "Approve" path:
    │       │       │ Select risk_level: Low / Medium / High (required)
    │       │       │ Enter rationale (≥10 chars)
    │       │       │ Click "Approve"
    │       │       │
    │       │       ├── Missing risk_level ──▶ Inline error: "Risk level is required"
    │       │       ├── Rationale too short ──▶ Inline error: "Min 10 characters"
    │       │       │
    │       │       └── Valid ──▶ [Confirmation dialog]
    │       │                         "Approve engagement? This creates a new Engagement Shell."
    │       │                         [Cancel] [Confirm Approve]
    │       │                              │
    │       │                              ▼
    │       │                    Auto-create Engagement Shell
    │       │                    GateDecision: A1=approved
    │       │                    Request status → accepted
    │       │                    Audit: GATE_A1_APPROVED
    │       │                    Banner: "Engagement ENG-2026-NNNNN created. View it →"
    │       │                    Redirect → Engagement Shell
    │       │
    │       └── "Decline" path:
    │               │ Enter rationale (≥10 chars)
    │               │ Click "Decline"
    │               │
    │               ├── Rationale too short ──▶ Inline error
    │               │
    │               └── Valid ──▶ [Confirmation dialog]
    │                                 "Decline this request? This action cannot be undone."
    │                                 [Cancel] [Confirm Decline]
    │                                      │
    │                                      ▼
    │                             GateDecision: A1=declined
    │                             Request status → declined
    │                             Audit: GATE_A1_DECLINED
    │                             Toast: "Request declined and recorded."
    │                             Redirect → Requests list
    │
    └── (Already decided) ──▶ A1 Decision Panel hidden; decision summary card shown read-only
```

**Key UX Rules:**
- A1 decision controls only render when `request.status = submitted` AND user role = AL
- Risk level dropdown placed visually before approve/decline buttons
- Rationale textarea: placeholder text with example ("e.g., Scope aligns with program mandate; medium risk based on timeline.")
- Minimum character count soft indicator: "10 characters minimum — [X / 10]"
- Confirmation dialogs for both approve and decline (irreversible actions)
- Post-approval: success banner with direct link to the new Engagement Shell

---
# Flow-01: Planning Setup → Gate P2 (J2)

**User Stories:** US-4.1, US-4.2, US-5.1, US-5.2, US-5.3, US-6.1, US-6.2, US-6.3, US-6.4, US-7.1, US-7.2, US-7.3, US-7.4  
**Personas:** Diana Okafor (EM), James Whitfield (QA)  
**Journeys:** JRN-02.1, JRN-04.1

---

## Flow 2A: Engagement Setup (EM)

**Trigger:** A1 approved → EM opens new Engagement Shell  
**Entry:** Engagement Shell (phase: planning)  
**Exit:** Planning record submitted for P2 review

```
[Engagement Shell — planning phase]
    │ Pre-populated: title (from request.topic), risk_level (from A1 decision)
    │ Empty: portfolio, team, milestones, planning record
    │
    ├── Tab: Metadata (default)
    │       │ EM edits: title, portfolio, owner (must be EM role user)
    │       │ EM clicks "Save" → Audit: ENGAGEMENT_UPDATED
    │       │
    ├── Tab: Team
    │       │ EM clicks "Add Team Member"
    │       │ → Searchable user dropdown + role selector
    │       │ → Click "Add" → TeamAssignment created
    │       │     Audit: TEAM_MEMBER_ASSIGNED
    │       │ Required: ≥1 QA Reviewer before P2 submission
    │       │
    │       │ Milestone section (same tab):
    │       │ → Date pickers for P2, P3, Draft, P4 targets
    │       │ → Chronological order enforced
    │       │ → Audit: MILESTONES_UPDATED
    │       │
    └── Tab: Planning Record
            │
            ├── [No record yet] → "Start Planning Record" button
            │       │
            │       ▼
            │   Planning Record created (status: draft)
            │   Audit: PLANNING_RECORD_CREATED
            │
            ├── Objectives section:
            │       │ "Add Objective" → text (required) + info need (optional)
            │       │ Drag handles for reordering
            │       │ Delete (blocked if evidence linked)
            │       │
            ├── Planning sections (save as draft at any time):
            │       │ Design Approach (optional)
            │       │ Schedule Notes (optional)
            │       │ Risk Notes (required for P2) *
            │       │ Data Reliability Notes (required for P2) *
            │       │ Independence Status (required for P2) * [affirmed/pending/exception_noted]
            │       │ * Red asterisk; turns green when filled
            │       │
            └── P2 Submission:
                    │ Pre-submit checklist (all must be green):
                    │   ✓ ≥1 objective
                    │   ✓ Risk notes present
                    │   ✓ Data reliability notes present
                    │   ✓ Independence status set
                    │   ✓ Owner assigned
                    │   ✓ ≥1 QA Reviewer on team
                    │   ✓ ≥1 milestone date set
                    │
                    ├── Any red items → "Submit for P2 Review" button disabled
                    │
                    └── All green → "Submit for P2 Review" enabled
                            │ Click → status: ready_for_review
                            │ Audit: PLANNING_SUBMITTED_FOR_REVIEW
                            │ Toast: "Submitted to QA Reviewer (James Whitfield)"
                            │ Planning record appears in QA's Review Queue
```

---

## Flow 2B: P2 Review Decision (QA)

**Trigger:** QA opens planning record from Review Queue  
**Entry:** Review Queue (items with status = ready_for_review)  
**Exit A (Approve):** Planning record locked; engagement phase → evidence  
**Exit B (Return):** Planning record → returned; EM notified; item removed from QA queue

```
[Review Queue]
    │ Shows: engagement name, submission date, "P2 Planning Review" label
    │ Sorted by: submitted_at ASC
    │
    ▼
[P2 Review Page]
    │
    │ Completeness Checklist (system-computed, displayed at top):
    │   ✓ ≥1 objective present
    │   ✓ Risk notes: present
    │   ✓ Data reliability notes: present
    │   ✓ Independence status: affirmed
    │   ✓ Owner assigned
    │   ✓ ≥1 milestone date
    │   ✓ ≥1 QA Reviewer on team
    │
    │ Full planning record displayed below (read-only)
    │ Objectives list
    │ Team summary
    │ Milestone dates
    │
    ├── "Approve" (QA role only):
    │       │ Approval comment (≥10 chars, required)
    │       │ [Approve] button
    │       │
    │       ├── Comment too short ──▶ Inline error
    │       └── Valid + all checklist items pass ──▶
    │               GateDecision: P2=approved
    │               planning_record.status → approved (locked)
    │               engagement.phase → evidence
    │               Audit: GATE_P2_APPROVED
    │               Banner: "Gate P2 approved. Engagement now in Evidence phase."
    │               Redirect → Engagement Shell
    │
    └── "Return for Revision" (QA role only):
            │ Return comment (≥10 chars, required)
            │ [Return] button
            │
            ├── Comment too short ──▶ Inline error
            └── Valid ──▶
                    GateDecision: P2=returned
                    planning_record.status → returned
                    Audit: GATE_P2_RETURNED
                    Return comment visible to EM on planning record page
                    Toast: "Planning record returned for revision."
                    Redirect → Review Queue
```

**Post-P2 Edit (EM):**
- All planning fields locked (read-only) after approval
- "Request Revision" button → EM enters revision note (≥10 chars) → fields unlock
- Save → `planning_record.status` remains `approved`; PlanningRevision record created
- Audit: PLANNING_RECORD_REVISED

---
# Flow-02: Evidence Readiness → Gate P3 (J3)

**User Stories:** US-8.1–8.5, US-9.1–9.4, US-10.1–10.4  
**Personas:** Priya Nair (AN), James Whitfield (QA)  
**Journeys:** JRN-03.1, JRN-04.1

---

## Flow 3A: Upload Evidence and Link to Objectives (AN)

**Trigger:** Engagement in phase: evidence; AN navigates to Evidence tab  
**Entry:** Engagement Shell → Evidence tab  
**Exit:** Evidence items uploaded, linked, gap view clear

```
[Evidence Tab — Evidence List]
    │
    ├── "Add Evidence" button (AN role)
    │       │
    │       ▼
    │   [New Evidence Form]
    │       │ evidence_type: dropdown (document/dataset/interview_note/meeting_note/other)
    │       │ source: text (required)
    │       │ date_received: date picker (label: "Date Received — MM/DD/YYYY")
    │       │ sensitivity: toggle (Standard / Restricted)
    │       │ description: textarea (optional)
    │       │
    │       │ File upload section:
    │       │   Drag & drop zone OR "Browse files"
    │       │   Allowed: PDF, DOCX, DOC, XLSX, XLS, CSV, TXT, PNG, JPG, JPEG, ZIP
    │       │   Max 50MB per file; max 20 files
    │       │   Per-file: progress bar → ✓ filename confirmed
    │       │
    │       ├── "Save Evidence" → EvidenceItem created
    │       │       Audit: EVIDENCE_ITEM_CREATED + EVIDENCE_FILE_UPLOADED per file
    │       │       Toast: "Evidence saved."
    │       │
    │       └── On save confirmation screen:
    │               "Link to Objectives?" section (inline)
    │               Checklist of objectives for this engagement
    │               [Link Selected Objectives] button
    │               Audit: EVIDENCE_OBJECTIVE_LINKED per link
    │
    ├── [Evidence List row] → click → Evidence Detail
    │       Shows: metadata, files list, linked objectives, linked findings
    │       Actions: "Link/Unlink Objectives", "Delete" (blocked if linked)
    │
    └── "Show Gaps" toggle (or /evidence/gaps route):
            Gap View: objectives with 0 linked evidence
            Each row: objective text (truncated 100 chars), status badge, "No Evidence" badge
            "Days to P3 target" column
            P3 blocker flag if status = evidence_needed
```

---

## Flow 3B: Create Findings (AN)

**Trigger:** AN ready to draft findings (after P2 approved, evidence uploaded)  
**Entry:** Engagement Shell → Findings tab  
**Exit:** Findings created and linked to evidence; P3 checklist ready

```
[Findings Tab]
    │
    ├── "Add Finding" button (AN role)
    │       │ finding_text: textarea (required)
    │       │ [Save Finding] → status: draft
    │       │ Audit: FINDING_CREATED
    │       │
    │       └── Link evidence section (inline):
    │               Multi-select from evidence list for this engagement
    │               [Link Evidence] → FINDING_EVIDENCE_LINKED per link
    │
    └── [Finding row] → Edit/View detail
            Shows: finding text, status, linked evidence list
            QA can update objective evidence status here
```

---

## Flow 3C: P3 Gate Review (QA)

**Trigger:** QA opens P3 review from Review Queue (or EM requests P3 review)  
**Entry:** Review Queue → P3 evidence sufficiency item  
**Exit A (Approve):** engagement.phase → draft  
**Exit B (Return):** return comments sent to EM/AN

```
[P3 Evidence Sufficiency Review Page]
    │
    │ Objective Status Table:
    │   ┌──────────────────────┬───────────────┬──────────┬──────────────┐
    │   │ Objective (truncated)│ Evidence Count│ Status   │ Action (QA)  │
    │   ├──────────────────────┼───────────────┼──────────┼──────────────┤
    │   │ Obj 1: Assess...     │ 3 items       │ Sufficient│ [Change ▾]  │
    │   │ Obj 2: Evaluate...   │ 0 items  🔴   │Ev. Needed │ [Change ▾]  │
    │   │ Obj 3: Review...     │ 1 item        │ In Review │ [Change ▾]  │
    │   └──────────────────────┴───────────────┴──────────┴──────────────┘
    │
    │ Findings Table:
    │   Each finding: text preview, evidence link count
    │   Red indicator if 0 evidence links
    │
    ├── P3 Prerequisite Block (shown above Approve button):
    │   🔴 Objective 2 has no linked evidence
    │   🔴 Finding "Agency data shows..." has no linked evidence
    │   → "Approve P3" button disabled while any red items exist
    │
    ├── "Approve P3" (QA role):
    │       │ Approval comment (≥10 chars)
    │       └── Valid + all prerequisites pass →
    │               GateDecision: P3=approved
    │               engagement.phase → draft
    │               Audit: GATE_P3_APPROVED
    │               Banner: "Gate P3 approved. Engagement now in Draft phase."
    │
    └── "Return" (QA role):
            │ Return comment (≥10 chars)
            └── GateDecision: P3=returned
                    Audit: GATE_P3_RETURNED
                    Toast: "Returned for revision."
```

---
# Flow-03: Draft Readiness + Reference Check → Gate P4 (J4, J5)

**User Stories:** US-11.1–11.4, US-12.1–12.7, US-13.1–13.4  
**Personas:** Diana Okafor (EM), Priya Nair (AN), Carla Voss (IR), Tom Andrade (PC)  
**Journeys:** JRN-03.2, JRN-05.1, JRN-06.1

---

## Flow 4A: Draft Product and Indexing (EM/AN)

**Trigger:** Gate P3 approved; engagement phase = draft  
**Entry:** Engagement Shell → Draft Product tab  
**Exit:** All statements indexed and assigned for reference check

```
[Draft Product Tab]
    │
    ├── [No draft product yet] → "Create Draft Product" button (EM/AN)
    │       │ title (required)
    │       │ version (required, e.g. "v1.0")
    │       │ owner_id (user assigned to engagement, required)
    │       │ [Create] → status: drafting; Audit: DRAFT_PRODUCT_CREATED
    │
    ├── Draft Product Record (single record per engagement):
    │       │ Title, version, owner, status badge
    │       │ File attachment section:
    │       │   Upload draft file (PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP; max 50MB)
    │       │   Replaces previous file on re-upload
    │       │   Audit: DRAFT_FILE_ATTACHED
    │       │
    │       │ Review Comments section (append-only):
    │       │   [Add Comment] → non-empty text → saved with timestamp + reviewer name
    │       │   Audit: DRAFT_COMMENT_ADDED
    │       │
    │       │ Status advancement buttons (EM):
    │       │   Drafting → "Submit for Review" → Under Review
    │       │   Under Review → "Ready for Reference Check"
    │       │     (requires ≥1 statement to exist)
    │       │   Ready for Ref Check → "Ready for Final Review"
    │       │   QA: Under Review → "Return to Drafting"
    │       │   Audit: DRAFT_STATUS_CHANGED
    │
    └── Statements / Indexing sub-section:
            │
            ├── "Add Statement" (AN/EM):
            │       │ statement_text (required)
            │       │ [Save] → reference_status: not_started
            │       │ Audit: STATEMENT_CREATED
            │
            ├── Each statement row:
            │       │ Statement text (truncated)
            │       │ "Linked / Not Linked" badge (evidence count)
            │       │ Reference status badge
            │       │ [Link Evidence] → multi-select evidence picker
            │       │   Audit: STATEMENT_EVIDENCE_LINKED
            │
            └── [Assign for Reference Check] (EM, per statement):
                    │ Select IR user (must have IR role on this engagement)
                    │ Statement must have ≥1 evidence link
                    │ Audit: REFERENCE_CHECK_ASSIGNED
                    │ Statement appears in IR's Review Queue
```

---

## Flow 4B: Reference Check (IR)

**Trigger:** IR opens reference check queue  
**Entry:** Review Queue → reference check items for this engagement  
**Exit:** Statements marked Passed, Waived, or Failed (with discrepancy and reassignment)

```
[Reference Check Queue (IR)]
    │ Progress bar: "5 of 7 complete (71%)"
    │ Counts: Not Started: 2, In Review: 0, Passed: 5, Failed: 0, Waived: 0
    │
    │ Statement list (sorted by: not_started first, then in_review)
    │
    ▼
[Statement Detail]
    │ Statement text (full)
    │ Linked evidence list:
    │   [filename] [Download] [View inline if PDF]
    │
    ├── Status actions (IR role only):
    │       [In Review] [Pass] [Fail]
    │
    ├── "Pass" → reference_status: passed
    │       Audit: REFERENCE_STATUS_CHANGED
    │       Toast: "Statement passed." → return to queue
    │
    ├── "Fail" → opens discrepancy panel:
    │       │ Discrepancy notes (required when Failed)
    │       │   Structured: category dropdown
    │       │     (Wrong evidence / Insufficient detail / Statement mismatch)
    │       │   + free text
    │       │ Assign to Analyst: user selector (AN role on engagement)
    │       │ [Save Failed] → reference_status: failed
    │       │   Audit: REFERENCE_STATUS_CHANGED + REFERENCE_FAILED_DISCREPANCY
    │       │   Confirmation: "Statement assigned to [Analyst name]."
    │       │   Statement appears in Analyst's queue
    │
    └── EM can waive a statement:
            │ [Waive] button (EM/AD only)
            │ Justification text (≥10 chars, required)
            │ reference_status: waived
            │ Audit: REFERENCE_CHECK_WAIVED
```

---

## Flow 4C: Analyst Discrepancy Resolution (AN)

**Trigger:** IR fails a statement → assigned to AN  
**Entry:** AN's Review Queue (or Findings/Statements tab)  
**Exit:** Statement updated → back to IR queue (status: in_review)

```
[Analyst Queue — Failed Statements]
    │ Badge: "1 failed statement needs correction"
    │
    ▼
[Statement Edit View]
    │ Statement text (editable)
    │ Discrepancy note from IR (read-only, prominent)
    │ Current linked evidence list
    │
    ├── AN updates statement text and/or relinking evidence
    │       [Relink Evidence] → evidence registry side panel (no full page reload)
    │
    └── [Mark Revision Ready] → revision_ready: true
            → reference_status: in_review
            → Confirmation: "Sent back to referencer (Carla Voss)"
            → Appears in IR's re-check queue
```

---

## Flow 4D: Gate P4 Final Readiness (PC/EM)

**Trigger:** All reference checks Passed or Waived; no open blockers  
**Entry:** Engagement Shell → Gate P4 card → "Review Final Readiness"  
**Exit:** Engagement status → ready_for_issuance or closed

```
[Gate P4 Final Readiness Page]
    │
    │ Final Readiness Checklist:
    │   ┌───────────────────────────────────────────────────────┐
    │   │ ✓  Gate P3 approved                                   │
    │   │ ✓  No failed reference checks (7 Passed)             │
    │   │ ✓  No in-review reference checks                     │
    │   │ ✓  No not-started reference checks                   │
    │   │ ✓  No open blockers                                   │
    │   └───────────────────────────────────────────────────────┘
    │   Reference check summary: "7 statements — 7 Passed, 0 Failed, 0 Waived"
    │
    │ Gate History panel (all gates A1–P3 with approver + date)
    │
    ├── "Approve Final Readiness" (PC or EM):
    │       │ Final approval comment (≥10 chars)
    │       │ Outcome selector (PC: "Ready for Issuance" only;
    │       │                   EM/AD: "Ready for Issuance" or "Closed")
    │       │
    │       ├── Any checklist item fails → button disabled + red item explanation
    │       │
    │       └── All pass + comment valid →
    │               [Confirmation dialog]
    │               "Approve final readiness? Engagement status will be updated to [outcome]."
    │               [Cancel] [Confirm Approve]
    │                   │
    │                   ▼
    │               GateDecision: P4=approved
    │               engagement.status → ready_for_issuance (or closed)
    │               Engagement enters read-only state
    │               Audit: GATE_P4_APPROVED
    │               Banner: "Gate P4 approved. Engagement is now Ready for Issuance."
    │
    └── EM close without issuance:
            [Close Engagement] button (EM/AD)
            Confirmation dialog: "This will close the engagement. All records remain visible."
            engagement.status → closed; phase → closed
            Audit: ENGAGEMENT_CLOSED
```

---
# Screen-00: Login / Authentication

**Purpose:** Authenticate user; enforce account lockout; redirect to Portfolio Dashboard  
**User Stories:** US-0.1, US-0.2  
**Personas:** All roles  
**Journeys:** All (entry point)

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    [EMS Logo / Wordmark]                        │
│               Engagement Management System                      │
│                                                                 │
│         ┌───────────────────────────────────────┐              │
│         │         Sign in to your account       │              │
│         │                                       │              │
│         │  Username (email)                     │              │
│         │  ┌───────────────────────────────┐    │              │
│         │  │ email@agency.gov              │    │              │
│         │  └───────────────────────────────┘    │              │
│         │                                       │              │
│         │  Password                             │              │
│         │  ┌───────────────────────────────┐    │              │
│         │  │ ••••••••••••••                │    │              │
│         │  └───────────────────────────────┘    │              │
│         │                              [👁 Show] │              │
│         │                                       │              │
│         │  ┌───────────────────────────────┐    │              │
│         │  │          Sign In              │    │              │
│         │  └───────────────────────────────┘    │              │
│         │                                       │              │
│         │  [Error state area — hidden by default│              │
│         │   shows message when auth fails]      │              │
│         │                                       │              │
│         └───────────────────────────────────────┘              │
│                                                                 │
│              © 2026 Engagement Management System                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Username + Password fields | Center card |
| Primary | Sign In button | Below fields, full width |
| Secondary | Error message | Below button, inside card |
| Tertiary | Branding | Above card |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty form fields, Sign In active | — |
| Typing | Field border highlights | Real-time: none (no partial validation) |
| Loading | Sign In button: spinner + "Signing in..." disabled | "Signing in..." |
| Invalid credentials | Red error banner below button | "Invalid username or password." (generic — no field disclosure) |
| Account locked | Red error banner | "Account locked due to repeated failures. Try again in 15 minutes." |
| Missing fields | Sign In triggers inline errors per field | "Username is required" / "Password is required" |
| Success | Redirects to /dashboard | — |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Username field | Email text input | Auto-focus on load; Enter → move to Password |
| Password field | Password input | Show/hide toggle; Enter → submit |
| Show password toggle | Icon button | Toggles input type password ↔ text |
| Sign In button | Primary CTA | Submits form; disabled during loading state |
| Error message | Alert (role="alert") | Screen-reader announced; appears below button |

---

## Error Messages

| Scenario | Message |
|----------|---------|
| Invalid credentials | "Invalid username or password." |
| Account locked | "Account locked due to repeated failures. Try again in 15 minutes." |
| Missing username | Field error: "Username is required." |
| Missing password | Field error: "Password is required." |

**Error message design:** Generic invalid-credentials message (no field disclosure — do not reveal which field is wrong). Error appears in a red alert box, not as a toast.

---
# Screen-01: Portfolio Dashboard (F14)

**Purpose:** Overview of all engagements + requests; entry point for all roles post-login  
**User Stories:** US-0.3, US-0.4, US-3.4  
**Personas:** All roles (default landing page)  
**Journeys:** JRN-01.2, JRN-02.2, JRN-07.1

---

## Layout

```
┌────────┬────────────────────────────────────────────────────────────┐
│ NAV    │  Portfolio Dashboard                        [Export CSV ↓] │
│        ├────────────────────────────────────────────────────────────┤
│ ● Dash │  Summary Cards                                             │
│ Requests│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ Engage-│  │ Planning │ │ Evidence │ │  Draft   │ │Readiness │   │
│ ments  │  │    4     │ │    6     │ │    2     │ │    1     │   │
│ Review │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│ Queue  ├────────────────────────────────────────────────────────────┤
│ Reports│  Filters:                                                  │
│        │  [Phase ▾] [Risk ▾] [Owner ▾] [Due Date ▾] [Status ▾]   │
│        │  [🔍 Search by ID, title, requester...         ] [Clear]  │
│        ├────────────────────────────────────────────────────────────┤
│        │  ┌──────┬──────────────────┬────────┬──────────┬────────┐ │
│        │  │ ID   │ Title            │ Phase  │ Owner    │ Risk   │ │
│        │  ├──────┼──────────────────┼────────┼──────────┼────────┤ │
│        │  │ENG-  │ Agency Budget    │Evidence│ D. Okafor│ Medium │ │
│        │  │2026- │ Review 2026      │        │          │        │ │
│        │  │00001 │                  │  P3 ✓  │ P4 —    │⚠ BLOCKED│ │
│        │  ├──────┼──────────────────┼────────┼──────────┼────────┤ │
│        │  │ENG-  │ Congressional    │Planning│ D. Okafor│  High  │ │
│        │  │2026- │ Request: Freight │        │          │        │ │
│        │  │00002 │ Safety           │  P2 ●  │ P3 —    │On Track│ │
│        │  ├──────┼──────────────────┼────────┼──────────┼────────┤ │
│        │  │ REQ  │ [Draft Request]  │ Draft  │ M. Reid  │   —    │ │
│        │  │2026- │ Mandate: Climate │        │          │        │ │
│        │  │00003 │ Oversight        │        │          │        │ │
│        │  └──────┴──────────────────┴────────┴──────────┴────────┘ │
│        │  Showing 1–20 of 47 items              [< 1 2 3 ... >]    │
└────────┴────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Summary count cards by phase | Top of content area |
| Primary | Engagement list with phase + gate status | Main table |
| Secondary | Filter controls | Above table |
| Secondary | Search bar | Above table (global) |
| Tertiary | Export CSV | Top-right corner |
| Tertiary | Pagination | Below table |

---

## Summary Count Cards

Four cards showing count of active engagements per phase:
- **Planning** — phase = planning
- **Evidence** — phase = evidence  
- **Draft** — phase = draft
- **Readiness** — phase = readiness

Cards are clickable → filters the table to that phase.

---

## Table Columns

| Column | Content | Sortable |
|--------|---------|----------|
| ID | Engagement ID (ENG-YYYY-NNNNN) or Request ID | Yes |
| Title | Engagement/Request title (truncated 60 chars) | Yes |
| Phase | Phase badge with color coding | Yes |
| Owner | Owner name | Yes |
| Risk | Risk badge (Low/Medium/High) | Yes |
| Next Milestone | Label + date + status (On Track/At Risk/Overdue) | Yes |
| Gate Status | A1/P2/P3/P4 mini-badges (✓=approved, ●=pending, —=not started) | No |
| Blocked | ⚠ badge if any open blockers exist | No |

---

## Phase Badges (color coding)

| Phase | Color |
|-------|-------|
| Planning | Blue |
| Evidence | Teal |
| Draft | Purple |
| Readiness | Orange |
| Ready for Issuance | Green |
| Closed | Gray |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Table populated; all phases shown | — |
| Loading | Skeleton rows (shimmer) | — |
| Filtered | Table subset shown; active filter chips above table | Filter chips with "×" to clear |
| Empty (no results) | Illustration + "No engagements match your filters." | "Clear filters" link |
| Empty (no data) | Illustration + "No engagements yet." | "Create first request" link (AL only) |
| Search active | Table filters as user types (debounced 300ms) | Match highlight in results |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Summary count cards | Clickable filter shortcut | Filters table to that phase |
| Filter dropdowns | Multi-select dropdowns | Apply on select; active filter chips appear |
| Search bar | Text input (global) | Queries ID/title/requester/owner; min 2 chars |
| Table row | Clickable | Opens Request Detail or Engagement Shell |
| Export CSV | Button | Downloads all visible rows (respects filters + role) |
| Blocked badge | Icon + tooltip | Hover/focus shows "X open blockers — click to view" |

---

## Role-Based Visibility

| Column / Feature | AL | EM | AN | QA | IR | PC | RO | AD |
|------------------|----|----|----|----|----|----|----|-----|
| Requests in list | ✓ | ✓ | — | — | — | — | ✓ | ✓ |
| Export CSV | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Restricted evidence badge | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |

---
# Screen-02: Engagement Detail Dashboard (F15)

**Purpose:** Single-engagement progress view — gates, milestones, evidence progress, blockers  
**User Stories:** US-4.1, US-5.4, US-9.3, US-10.3  
**Personas:** Diana Okafor (EM), James Whitfield (QA), Sandra Wu (RO)  
**Journeys:** JRN-02.2, JRN-04.1, JRN-07.1

---

## Layout

```
┌────────┬─────────────────────────────────────────────────────────────┐
│ NAV    │  ENG-2026-00001 · Agency Budget Review 2026                 │
│        │  Phase: [Evidence ●] · Status: [Active] · Risk: [Medium]   │
│        │  Owner: Diana Okafor · Portfolio: Financial Management      │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── GATE STATUS ─────────────────────────────────────────   │
│        │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│        │  │   A1     │ │   P2     │ │   P3     │ │   P4     │     │
│        │  │ Approved │ │ Approved │ │ Pending  │ │Not Started│    │
│        │  │ M. Reid  │ │ J. Whitf │ │          │ │          │     │
│        │  │ Jan 15   │ │ Feb 2    │ │          │ │          │     │
│        │  │[History] │ │[History] │ │[Submit]  │ │[Locked]  │     │
│        │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── MILESTONES ────────────────────────────────────────     │
│        │  ┌──────────────────────────┬───────────┬────────────┐     │
│        │  │ Milestone                │ Target    │ Status     │     │
│        │  ├──────────────────────────┼───────────┼────────────┤     │
│        │  │ Planning Approval (P2)   │ Feb 2     │ ✓ Complete │     │
│        │  │ Evidence Readiness (P3)  │ Mar 15    │ ⚠ At Risk  │     │
│        │  │ Draft Readiness          │ Apr 1     │ ○ On Track │     │
│        │  │ Final Readiness (P4)     │ Apr 30    │ ○ On Track │     │
│        │  └──────────────────────────┴───────────┴────────────┘     │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── EVIDENCE PROGRESS ─────────────────────────────────     │
│        │  Objectives: 3 total                                        │
│        │  ✓ Obj 1: Assess budget controls (2 items linked)           │
│        │  ⚠ Obj 2: Evaluate data reliability (0 items) ← BLOCKER    │
│        │  ◑ Obj 3: Review reporting compliance (1 item, In Review)   │
│        │                                                             │
│        │  Evidence total: 8 items · [View Evidence →]               │
│        │  Reference Check: 0 of 0 complete (N/A — not in Draft yet) │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── OPEN BLOCKERS ─────────────────────────────────────     │
│        │  🔴 Objective "Evaluate data reliability" has no linked     │
│        │     evidence.  [View Objective →]                           │
│        │  🔴 2 findings have no linked evidence.  [View Findings →]  │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── QUICK NAVIGATION ──────────────────────────────────     │
│        │  [Team] [Planning Record] [Evidence] [Findings]             │
│        │  [Draft Product] [Gate History] [Audit Trail]               │
└────────┴─────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Engagement ID, title, phase/status/risk badges | Header row |
| Primary | Gate status cards (A1/P2/P3/P4) | First panel |
| Primary | Open blockers list | Prominent panel with red indicators |
| Secondary | Milestone table | Second panel |
| Secondary | Evidence/objective progress | Third panel |
| Tertiary | Quick navigation links | Footer |

---

## Gate Status Cards

Each card shows:
- Gate label (A1, P2, P3, P4)
- Outcome badge: "Approved" (green) / "Pending" (yellow) / "Not Started" (gray) / "Returned" (orange) / "Declined" (red)
- Approver name (if decided)
- Decision date (if decided)
- [History] link → gate history view (all decisions for that gate type)
- [Submit] / [Review] link (role-appropriate action, if available)

Card locking logic:
- P3 card locked (grayed) if P2 not approved
- P4 card locked if P3 not approved

---

## Milestone Status Visual Indicators

| Status | Icon | Color |
|--------|------|-------|
| Not Started | ○ | Gray |
| On Track | ○ | Green |
| At Risk | ⚠ | Yellow |
| Overdue | 🔴 | Red |
| Complete | ✓ | Green (filled) |

At Risk = target within 7 days and gate not yet approved.

---

## Evidence Progress

Shows per-objective:
- Objective text (truncated 80 chars)
- Linked evidence count
- Objective status badge (Evidence Needed 🔴 / In Review ◑ / Sufficient ✓)
- Blocker flag if `status = evidence_needed`
- [View gap] link from blocker to evidence gap view

---

## Open Blockers Panel

- Red alert box, not collapsible
- Each blocker: plain-language description with specific record name + "View →" deep link
- "No open blockers" message (green) when all clear
- Blockers computed dynamically on each page load

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All panels populated | — |
| Loading | Skeleton panels | — |
| No blockers | Green "No open blockers" in blockers panel | "No open blockers" |
| All gates complete | All four gate cards green | Engagement in read-only state |
| Closed engagement | Gray header badge; all action buttons hidden | "This engagement is closed." banner |

---
# Screen-03: Request Intake Form (F2)

**Purpose:** Create/edit a request record; upload intake document; submit for A1 review  
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5  
**Personas:** Marcus Reid (AL)  
**Journeys:** JRN-01.1

---

## Layout — New / Edit Form

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Requests > New Request                    [Save as Draft]   │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── REQUEST DETAILS ──────────────────────────────────────  │
│        │                                                              │
│        │  Request Type *                                              │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │ Congressional Request                             ▾  │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  (Options: Congressional Request / Mandate / Internal Proposal)│
│        │                                                              │
│        │  Requester *               Agency / Program *               │
│        │  ┌─────────────────────┐   ┌──────────────────────────┐    │
│        │  │ Name or organization│   │ Agency or program name   │    │
│        │  └─────────────────────┘   └──────────────────────────┘    │
│        │                                                              │
│        │  Topic *                                                     │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │ Brief description of the engagement topic           │    │
│        │  │                                                     │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  500 characters max                                          │
│        │                                                              │
│        │  Due Date *                                                  │
│        │  ┌─────────────────────┐                                    │
│        │  │ MM/DD/YYYY     [📅] │                                    │
│        │  └─────────────────────┘                                    │
│        │  ⚠ Past date warning (non-blocking): "Due date is in the    │
│        │    past. Permitted for retrospective mandates."              │
│        │                                                              │
│        │  Notes                                                       │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │ Optional — additional context or background         │    │
│        │  │                                                     │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  5000 characters max                                         │
│        │                                                              │
│        │  ── INTAKE DOCUMENT ──────────────────────────────────────  │
│        │                                                              │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │  📄 Drag and drop intake document here              │    │
│        │  │     or  [Browse files]                              │    │
│        │  │     PDF, DOCX, DOC, XLSX, XLS, TXT, PNG, JPG        │    │
│        │  │     Max file size: 25 MB                            │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  [File uploaded: congressional-letter-2026.pdf  ✓  ✕]      │
│        │                                                              │
│        │  ── ACTIONS ──────────────────────────────────────────────  │
│        │  [Save as Draft]                [Submit Request →]          │
│        │  (requires request_type only)   (requires all * fields)     │
│        │                                                              │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Request Detail Page (View Mode)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Requests > REQ-2026-00003                                   │
│        │  Congressional Request · [Submitted] · Submitted Jan 15, 2026│
│        ├──────────────────────────────────────────────────────────────┤
│        │  ┌────────────────────────────────────────────────────────┐  │
│        │  │ INTAKE DOCUMENT                                        │  │
│        │  │ 📄 congressional-letter-2026.pdf  [Download ↓]        │  │
│        │  └────────────────────────────────────────────────────────┘  │
│        │                                                              │
│        │  Request Type: Congressional Request                        │
│        │  Requester: Senate Committee on Finance                     │
│        │  Topic: Agency Budget Review 2026                           │
│        │  Agency/Program: Office of Budget Management                │
│        │  Due Date: April 30, 2026                                   │
│        │  Notes: [notes text]                                        │
│        │  Submitted: January 15, 2026 at 2:34 PM by Marcus Reid     │
│        │                                                              │
│        │  ── GATE A1 DECISION ─────────────────────────────────────  │
│        │  [Not decided yet]   — A1 decision controls shown here      │
│        │                         when status = submitted AND role=AL  │
│        │                                                              │
│        │  [View Audit Trail →]                                        │
│        │                                                              │
│        │  (Edit button visible if status=draft AND role=AL)          │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Request type, requester, topic | Top of form |
| Primary | Submit / Save as Draft actions | Bottom of form; also sticky footer on scroll |
| Secondary | Intake document upload | Mid-form; prominent drag-drop zone |
| Secondary | Due date with warning | Mid-form |
| Tertiary | Notes | Near bottom |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| New (empty) | All fields blank; only request_type required for save | — |
| Draft | Status badge "Draft"; Edit button shown; Submit available | Toast on save: "Draft saved [time]" |
| Saving (draft) | Save button: spinner + "Saving..." | "Saving..." |
| File uploading | Progress bar per file | "Uploading filename.pdf..." → "✓ filename.pdf" |
| File error (type) | Red error under drop zone | "File type not permitted. Allowed: PDF, DOCX, ..." |
| File error (size) | Red error under drop zone | "File exceeds maximum size of 25 MB." |
| Validation errors (submit) | Red border + message per field | Per-field messages |
| Submitted | Status badge "Submitted"; all fields read-only; Edit removed | Toast: "Request submitted successfully." |
| Past due date | Yellow warning banner | "Due date is in the past. Permitted for retrospective mandates." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Request Type | Dropdown (required) | Enables "Save as Draft" |
| Requester / Topic / Agency / Due Date | Text / date inputs | Required for Submit; optional for Draft |
| Notes | Textarea | Optional; char count shown |
| File upload zone | Drag-drop + browse | Single file; replaces existing on re-upload |
| Save as Draft | Secondary button | Saves with status=draft; redirects to detail |
| Submit Request | Primary button | Full validation; redirects to detail (submitted) |

---
# Screen-04: Request Review / Gate A1 (F3)

**Purpose:** AL reviews submitted request, records risk level, approves or declines  
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4  
**Personas:** Marcus Reid (AL)  
**Journeys:** JRN-01.2

---

## Layout — A1 Decision Panel (rendered on Request Detail when status=submitted, role=AL)

The A1 decision controls are embedded in the Request Detail page as a distinct panel below the request fields. They are visible **only** when `request.status = submitted` AND the current user has role AL.

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Requests > REQ-2026-00003                                   │
│        │  Congressional Request · [Submitted] · Submitted Jan 15, 2026│
│        ├──────────────────────────────────────────────────────────────┤
│        │  [Intake document, request fields, notes — see Screen-03]    │
│        │                                                              │
│        │  ── GATE A1: ACCEPTANCE DECISION ─────────────────────────  │
│        │  ┌────────────────────────────────────────────────────────┐  │
│        │  │  ⚖  Record your acceptance decision for this request.  │  │
│        │  │     This decision is permanent and creates an audit    │  │
│        │  │     event.                                             │  │
│        │  │                                                        │  │
│        │  │  Risk Level *                                          │  │
│        │  │  ○ Low    ● Medium    ○ High                          │  │
│        │  │                                                        │  │
│        │  │  Decision Rationale *                                  │  │
│        │  │  ┌──────────────────────────────────────────────────┐  │  │
│        │  │  │ e.g., Scope aligns with mandate; medium risk     │  │  │
│        │  │  │ based on timeline and agency response capacity.  │  │  │
│        │  │  └──────────────────────────────────────────────────┘  │  │
│        │  │  Minimum 10 characters [8 / 10] ←shows count          │  │
│        │  │                                                        │  │
│        │  │  [✗ Decline Request]          [✓ Approve Request →]   │  │
│        │  │   (requires rationale)         (requires risk + rationale)│
│        │  └────────────────────────────────────────────────────────┘  │
│        │                                                              │
│        │  [View Audit Trail →]                                        │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Confirmation Dialog — Approve

```
┌──────────────────────────────────────────────────────────────────┐
│                     Approve Request                              │
│                                                                  │
│  You are about to approve this request:                          │
│  "Agency Budget Review 2026"                                     │
│                                                                  │
│  Risk Level: Medium                                              │
│                                                                  │
│  This will:                                                      │
│  • Create a new Engagement Shell (ENG-2026-NNNNN)               │
│  • Record your decision with a timestamp                         │
│  • This action cannot be undone.                                 │
│                                                                  │
│              [Cancel]    [Confirm Approve ✓]                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Confirmation Dialog — Decline

```
┌──────────────────────────────────────────────────────────────────┐
│                     Decline Request                              │
│                                                                  │
│  You are about to decline this request:                          │
│  "Agency Budget Review 2026"                                     │
│                                                                  │
│  No engagement will be created. This decision is permanent.      │
│                                                                  │
│              [Cancel]    [Confirm Decline ✗]                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Post-Decision State — Approved

```
┌──────────────────────────────────────────────────────────────────┐
│  ✅ Engagement ENG-2026-00001 created.  [View Engagement Shell →] │
└──────────────────────────────────────────────────────────────────┘

── GATE A1 DECISION (Read-Only) ─────────────────────────────────
Status:    ✓ Approved
Risk Level: Medium
Approver:  Marcus Reid
Date:       January 15, 2026 at 2:41 PM
Rationale: "Scope aligns with mandate; medium risk based on
            timeline and agency response capacity."
[View Gate History →]
```

---

## Post-Decision State — Declined

```
── GATE A1 DECISION (Read-Only) ─────────────────────────────────
Status:    ✗ Declined
Approver:  Marcus Reid
Date:       January 15, 2026 at 2:41 PM
Rationale: "Scope is outside current mandate boundaries per
            legal review. Declined pending clarification."
[View Gate History →]
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Risk Level radio buttons | Top of A1 panel |
| Primary | Rationale textarea | Middle of A1 panel |
| Primary | Approve / Decline buttons | Bottom of A1 panel |
| Secondary | Character count guidance | Below rationale |
| Secondary | Confirmation dialogs | Modal overlay |
| Tertiary | Post-decision read-only card | Replaces A1 panel after decision |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (undecided) | A1 panel visible; both buttons present | — |
| No risk level | "Approve" button: missing risk level inline error on click | "Risk level is required for A1 approval." |
| Rationale too short | Red underline on textarea; character counter red | "Minimum 10 characters" |
| Confirming approve | Confirmation modal | "Confirm Approve" button |
| Confirming decline | Confirmation modal | "Confirm Decline" button |
| Submitting | Confirm button: spinner + "Processing..." disabled | "Processing..." |
| Already decided | A1 panel replaced by read-only decision card | — |
| Non-AL role | A1 panel not rendered | (Invisible; no disabled controls) |

---
# Screen-05: Engagement Shell (F4)

**Purpose:** Central hub for an engagement — metadata, gate status, blockers, artifact navigation  
**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4, US-3.4, US-7.4  
**Personas:** Diana Okafor (EM), all roles assigned to engagement  
**Journeys:** JRN-02.1, JRN-02.2

---

## Layout

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001                                │
│        │                                              [Edit Metadata] │
│        ├──────────────────────────────────────────────────────────────┤
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  ENG-2026-00001 · Agency Budget Review 2026             │ │
│        │  │  Phase: [Evidence] · Status: [Active] · Risk: [Medium]  │ │
│        │  │  Owner: Diana Okafor · Portfolio: Financial Management  │ │
│        │  │  Created: Jan 15, 2026 · Due: Apr 30, 2026             │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── GATE STATUS CARDS ────────────────────────────────────  │
│        │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│        │  │    A1     │  │    P2     │  │    P3     │  │   P4    │ │
│        │  │ ✓Approved │  │ ✓Approved │  │  Pending  │  │Not Start│ │
│        │  │ M. Reid   │  │J. Whitfld │  │           │  │  ----   │ │
│        │  │ Jan 15    │  │  Feb 2    │  │           │  │         │ │
│        │  │[History ▾]│  │[History ▾]│  │           │  │[Locked] │ │
│        │  └───────────┘  └───────────┘  └───────────┘  └─────────┘ │
│        │                                                              │
│        │  ── OPEN BLOCKERS ────────────────────────────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  🔴 Objective "Evaluate data reliability" has no linked  │ │
│        │  │     evidence.  [View →]                                  │ │
│        │  │  🔴 Finding "Agency budget data shows..." has no linked  │ │
│        │  │     evidence.  [View →]                                  │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── ARTIFACT COUNTS ──────────────────────────────────────  │
│        │  Team: 4 members · Objectives: 3 · Evidence: 8 items       │
│        │  Findings: 2 · Draft Product: In Progress                  │
│        │                                                              │
│        │  ── TAB NAVIGATION ───────────────────────────────────────  │
│        │  [Overview] [Team] [Planning Record] [Evidence]             │
│        │  [Findings] [Draft Product] [Gate History] [Audit Trail]   │
│        │                                                              │
│        │  ══ TAB CONTENT BELOW (changes by selected tab) ══          │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Engagement ID, title, phase/status/risk | Header card |
| Primary | Gate status cards (A1/P2/P3/P4) | Below header |
| Primary | Open blockers | Red alert panel |
| Secondary | Artifact counts | Summary row |
| Secondary | Tab navigation | Always visible |
| Tertiary | Edit button | Top-right (EM/AD only) |

---

## Gate Status Cards

Each card:
- Gate label + current outcome badge
- Approver name + date (if decided)
- Rationale preview (first 100 chars, "..." if truncated)
- [History ▾] dropdown — shows all historical decisions for this gate type
- If locked (gate prerequisites not met): card is grayed with "Locked — prerequisite gates must be approved first"

---

## Open Blockers Panel

- Displayed even when blockers = 0 (shows green "✅ No open blockers")
- Each blocker: icon 🔴 + description naming specific record + deep link
- Blockers are auto-computed on page load; no manual refresh needed
- Types:
  - Planning record not approved (P2 required)
  - Objective '{text}' has no linked evidence
  - Objective '{text}' is still In Review
  - Finding '{text prefix}...' has no linked evidence
  - Reference check for statement '{prefix}...' is {status}
  - Gate P3 must be approved before P4 can proceed

---

## Edit Metadata Panel (EM/AD only)

When [Edit Metadata] clicked, inline form opens (or modal):

```
Title *                   [Agency Budget Review 2026          ]
Status                    [Active ▾]  (cannot set closed/RFI via edit)
Risk Level                [○ Low  ● Medium  ○ High]
Owner *                   [Diana Okafor ▾]  (must have EM role)
Portfolio                 [Financial Management               ]
Phase override            [Evidence ▾]  (requires revision note)
Revision Note (if phase override): [                         ]
                          Minimum 10 characters

[Cancel]                  [Save Changes]
```

---

## Tab Content Areas

| Tab | Content |
|-----|---------|
| Overview | Gate cards + blockers + artifact counts (default view) |
| Team | Team assignment list + milestones (Screen-06) |
| Planning Record | Planning record form/view (Screen-07) |
| Evidence | Evidence list + gap view (Screen-09) |
| Findings | Findings list (Screen-10) |
| Draft Product | Draft record + statements + reference check (Screen-11/12) |
| Gate History | Full gate decision history for all gates |
| Audit Trail | Timestamped event log (Screen-14) |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All panels loaded | — |
| Loading | Skeleton for gate cards + blockers | — |
| No blockers | Green checkmark panel | "✅ No open blockers" |
| Editing metadata | Inline form replaces header card | Save/Cancel buttons |
| Engagement closed | All action buttons removed; gray "Closed" banner | "This engagement is closed and read-only." |
| Unauthorized | HTTP 403 → redirect to dashboard | "You are not authorized to view this engagement." |

---
# Screen-06: Team & Milestones (F5)

**Purpose:** Assign engagement team roles; set milestone target dates; view milestone status  
**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4  
**Personas:** Diana Okafor (EM)  
**Journeys:** JRN-02.1

---

## Layout — Team Tab

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Team                        │
│        ├──────────────────────────────────────────────────────────────┤
│        │  ── TEAM MEMBERS ─────────────────────────────────────────  │
│        │                                              [+ Add Member] │
│        │                                                              │
│        │  ┌──────────────────┬──────────────────┬────────────────────┐
│        │  │ Name             │ Role             │ Actions            │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Diana Okafor     │ Engagement Mgr   │ [Remove] (blocked  │
│        │  │                  │                  │ — last EM)         │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ James Whitfield  │ QA Reviewer      │ [Remove]           │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Priya Nair       │ Analyst          │ [Remove]           │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Carla Voss       │ Indep. Referencer│ [Remove]           │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Tom Andrade      │ Publishing Coord.│ [Remove]           │
│        │  └──────────────────┴──────────────────┴────────────────────┘
│        │                                                              │
│        │  ── ADD TEAM MEMBER ─────────────────────────────────────  │
│        │  (appears when [+ Add Member] clicked)                      │
│        │  ┌──────────────────────────────────┐  ┌──────────────────┐ │
│        │  │ Search users...               🔍 │  │ Select role  ▾  │ │
│        │  └──────────────────────────────────┘  └──────────────────┘ │
│        │  [Add to Team]                                              │
│        │                                                              │
│        │  ── MILESTONES ───────────────────────────────────────────  │
│        │                                                             │
│        │  ┌──────────────────────────┬───────────┬────────────────┐  │
│        │  │ Milestone                │ Target    │ Status         │  │
│        │  ├──────────────────────────┼───────────┼────────────────┤  │
│        │  │ Planning Approval (P2)   │[📅 Feb 02]│ ✓ Complete     │  │
│        │  │ Evidence Readiness (P3)  │[📅 Mar 15]│ ⚠ At Risk      │  │
│        │  │ Draft Readiness          │[📅 Apr 01]│ ○ On Track     │  │
│        │  │ Final Readiness (P4)     │[📅 Apr 30]│ ○ On Track     │  │
│        │  └──────────────────────────┴───────────┴────────────────┘  │
│        │  [Save Milestones]                                          │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Team member list with roles | Top section |
| Primary | Milestone dates + status | Bottom section |
| Secondary | Add member form (expanded on click) | Below team list |
| Secondary | Save Milestones button | Below milestone table |

---

## Team Assignment Rules (displayed as inline guidance)

- EM: minimum 1 required; last EM cannot be removed
- QA: minimum 1 required before P2 submission
- The same user can hold multiple roles on one engagement
- Inactive users cannot be added (validation at save)

---

## Add Member Form

```
Search users:   [Search by name or email         🔍]
                ↓ (dropdown results as user types)
                  Diana Okafor — Engagement Manager
                  Priya Nair — Analyst
                  ...

Role:           [Engagement Manager              ▾]
                (Options: AL, EM, AN, QA, IR, PC, RO)

[Add to Team]
```

Validation:
- User must be active
- User-role combination must be unique on this engagement
- Error inline: "This user already holds this role on the engagement."

---

## Milestone Date Editing

- Inline date pickers per row (edit in place)
- Chronological order enforced: P3 ≥ P2, Draft ≥ P3, P4 ≥ Draft
- Error if out of order: "Milestone dates must be in chronological order."
- Null dates allowed ("Not Set")
- [Save Milestones] → single save action for all four dates
- Audit: MILESTONES_UPDATED

---

## Milestone Status Indicators

| Status | Icon | Color | Condition |
|--------|------|-------|-----------|
| Not Started | — | Gray | Target date is null |
| On Track | ○ | Green | Target in future, gate not passed |
| At Risk | ⚠ | Yellow | Target within 7 days, gate not passed |
| Overdue | 🔴 | Red | Target in past, gate not passed |
| Complete | ✓ | Green | Gate approved |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Team list + milestone table populated | — |
| Adding member | Search dropdown expands | Results filtered as user types |
| Duplicate role error | Inline error below Add form | "This user already holds this role." |
| Last EM removal blocked | Remove button grayed or error on click | "Cannot remove the last Engagement Manager." |
| Saving milestones | Save button: spinner | "Saving..." |
| Date order error | Red border on out-of-order date | "Milestone dates must be in chronological order." |
| Empty team | "No team members assigned yet" message | Add member prompt |

---
# Screen-07: Planning Record (F6)

**Purpose:** Build the planning baseline — objectives, design approach, risk notes, independence; submit for P2  
**User Stories:** US-6.1, US-6.2, US-6.3, US-6.4, US-6.5  
**Personas:** Diana Okafor (EM), Priya Nair (AN)  
**Journeys:** JRN-02.1

---

## Layout — Planning Record (Draft state)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Planning Record              │
│        │  Status: [Draft]                    [Save Draft] [Submit P2→]│
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P2 READINESS CHECKLIST ───────────────────────────────  │
│        │  Before submitting for P2, all items must be complete:       │
│        │  ✓ ≥1 objective added                                        │
│        │  🔴 Risk notes required                                       │
│        │  🔴 Data reliability notes required                           │
│        │  ✓ Independence status set                                    │
│        │  ✓ Owner assigned                                             │
│        │  🔴 ≥1 QA Reviewer on team                                   │
│        │  ✓ ≥1 milestone date set                                      │
│        │  (Submit button disabled while any item shows 🔴)            │
│        │                                                              │
│        │  ── OBJECTIVES ─────────────────────────────────────────── │
│        │                                              [+ Add Objective]│
│        │                                                              │
│        │  ┌──┬─────────────────────────────────────────────────────┐  │
│        │  │⋮⋮│ Objective 1                               [Edit][✕] │  │
│        │  │  │ Assess adequacy of internal budget controls for     │  │
│        │  │  │ fiscal year 2026                                    │  │
│        │  │  │ Information need: [Annual audit reports, agency     │  │
│        │  │  │ budget submissions]                                 │  │
│        │  ├──┼─────────────────────────────────────────────────────┤  │
│        │  │⋮⋮│ Objective 2                               [Edit][✕] │  │
│        │  │  │ Evaluate data reliability of agency financial       │  │
│        │  │  │ reporting systems                                   │  │
│        │  │  │ Information need: [not set]                         │  │
│        │  ├──┼─────────────────────────────────────────────────────┤  │
│        │  │⋮⋮│ Objective 3                               [Edit][✕] │  │
│        │  │  │ Review compliance with reporting requirements       │  │
│        │  └──┴─────────────────────────────────────────────────────┘  │
│        │  ⋮⋮ = drag handle for reordering                            │
│        │                                                              │
│        │  ── PLANNING SECTIONS ──────────────────────────────────── │
│        │                                                              │
│        │  Design Approach  (optional)                                 │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Describe the methodology and analytical approach...    │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Schedule Notes  (optional)                                  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Key dates, phases, and scheduling constraints...       │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Risk Notes  * required for P2                              │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Document risks related to scope, timeline, or data...  │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Data Reliability Notes  * required for P2                  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Assess reliability, completeness, and limitations      │ │
│        │  │ of the primary data sources...                         │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Independence Status  * required for P2                     │
│        │  ● Affirmed   ○ Pending   ○ Exception Noted                 │
│        │                                                              │
│        │  [Save Draft]                    [Submit for P2 Review →]   │
│        │  (saves any time)                (requires all checklist ✓) │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Add Objective Inline Form

```
  [+ Add Objective] ─────────────────────────────────────────────
  Objective Text *
  ┌──────────────────────────────────────────────────────────────┐
  │ Full text of the objective or research question...           │
  └──────────────────────────────────────────────────────────────┘

  Information Need (optional)
  ┌──────────────────────────────────────────────────────────────┐
  │ What information is needed to answer this objective?         │
  └──────────────────────────────────────────────────────────────┘

  [Cancel]                              [Save Objective]
```

---

## Layout — Approved State (Post-P2)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Planning Record · Status: [Approved] · P2: ✓ Feb 2, 2026  │
│        │                                        [Request Revision]   │
│        ├──────────────────────────────────────────────────────────────┤
│        │  ⚠ This planning record is approved and locked.              │
│        │    Click "Request Revision" to make changes (revision note  │
│        │    required).                                                │
│        │                                                              │
│        │  [All fields shown read-only — same layout, no edit controls]│
│        │                                                              │
│        │  Return Comments (if previously returned):                  │
│        │  ┌──────────────────────────────────────────────────────────┐│
│        │  │ [Return date] James Whitfield: "Please expand risk notes  ││
│        │  │  to address data access limitations..."                  ││
│        │  └──────────────────────────────────────────────────────────┘│
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | P2 readiness checklist | Top of page (sticky on scroll) |
| Primary | Objectives section with add/edit/reorder | Below checklist |
| Primary | Risk Notes + Data Reliability Notes (required) | Marked with asterisk |
| Secondary | Design Approach + Schedule Notes (optional) | Middle sections |
| Secondary | Independence Status | Below optional sections |
| Tertiary | Save Draft / Submit buttons | Bottom (also sticky footer) |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Draft (no objectives) | Checklist shows 🔴 for objective count | Submit disabled |
| Draft (partial) | Some checklist items green, some red | Submit disabled |
| Draft (complete) | All checklist items ✓ | Submit enabled; green "Ready to submit" |
| Saving draft | Save button spinner | "Saving..." |
| Submitted (ready_for_review) | All fields read-only; "Under review by QA" banner | "Submitted for P2 review. Awaiting QA Reviewer." |
| Returned | Yellow "Returned for revision" banner + return comments | "Returned: [comment]" |
| Approved (locked) | Green "Approved" banner; all fields read-only | "Approved — lock symbol on fields" |
| Revision mode (post-P2) | Fields unlocked; revision note field required | "Revision note required to save changes." |
| Deleting objective (linked) | Error modal | "Cannot delete this objective — it has linked evidence. Unlink evidence first." |

---
# Screen-08: Gate P2 Review (F7)

**Purpose:** QA Reviewer reviews planning completeness, approves or returns with comments  
**User Stories:** US-7.1, US-7.2, US-7.3, US-7.4  
**Personas:** James Whitfield (QA)  
**Journeys:** JRN-04.1

---

## Layout — P2 Review Page

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Review Queue > ENG-2026-00001 — P2 Planning Review          │
│        │  Submitted: February 1, 2026 · By: Diana Okafor             │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P2 COMPLETENESS CHECKLIST ─────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  ✓  ≥1 objective present (3 objectives)                 │ │
│        │  │  ✓  Risk notes: present                                 │ │
│        │  │  ✓  Data reliability notes: present                     │ │
│        │  │  ✓  Independence status: Affirmed                       │ │
│        │  │  ✓  Owner assigned: Diana Okafor                        │ │
│        │  │  ✓  ≥1 milestone date set (4 dates)                     │ │
│        │  │  ✓  ≥1 QA Reviewer on team: James Whitfield             │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  All items pass. You may approve this planning baseline.     │
│        │                                                              │
│        │  ── PLANNING RECORD (Read-Only) ────────────────────────── │
│        │                                                              │
│        │  OBJECTIVES                                                  │
│        │  1. Assess adequacy of internal budget controls...           │
│        │     Info need: Annual audit reports, agency budget submissions│
│        │  2. Evaluate data reliability of financial reporting...      │
│        │  3. Review compliance with reporting requirements...         │
│        │                                                              │
│        │  DESIGN APPROACH                                             │
│        │  [design approach text]                                      │
│        │                                                              │
│        │  SCHEDULE NOTES                                              │
│        │  [schedule notes text]                                       │
│        │                                                              │
│        │  RISK NOTES                                                  │
│        │  [risk notes text]                                           │
│        │                                                              │
│        │  DATA RELIABILITY NOTES                                      │
│        │  [data reliability notes text]                               │
│        │                                                              │
│        │  INDEPENDENCE STATUS: Affirmed                               │
│        │                                                              │
│        │  TEAM SUMMARY                                                │
│        │  Diana Okafor (EM) · James Whitfield (QA) · Priya Nair (AN) │
│        │                                                              │
│        │  MILESTONES                                                  │
│        │  P2 Target: Feb 2  · P3 Target: Mar 15                     │
│        │  Draft: Apr 1  ·  P4 Target: Apr 30                        │
│        │                                                              │
│        │  ── P2 DECISION (QA role only) ─────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Decision Comment *                                     │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ e.g., Planning baseline meets all P2 requirements.│  │ │
│        │  │  │ Objectives are well-defined.                      │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │  Minimum 10 characters  [12 / 10] ✓                    │ │
│        │  │                                                         │ │
│        │  │  [Return for Revision]         [✓ Approve P2]          │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Completeness checklist (all must be ✓ to approve) | Top of page |
| Primary | P2 decision panel with comment + buttons | Bottom, always visible |
| Secondary | Full planning record content | Middle (scrollable) |
| Tertiary | Team summary + milestone dates | End of planning record section |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (all pass) | Checklist all green; Approve button active | "All items pass. You may approve." |
| Checklist fails | Red items in checklist; Approve button disabled | "Resolve failing items before approving." |
| Comment too short | Red underline on textarea | "Minimum 10 characters" |
| Approving | Button spinner | "Processing approval..." |
| Approved | Redirect to Engagement Shell; banner | "Gate P2 approved. Engagement now in Evidence phase." |
| Returning | Return dialog confirmation | "Confirm return for revision?" |
| Returned | Redirect to Review Queue; banner | "Planning record returned for revision." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Completeness checklist | Read-only computed display | Updated on page load |
| Decision comment | Textarea (required, ≥10 chars) | Real-time char count |
| Return for Revision | Secondary button (destructive) | Requires comment; confirmation dialog |
| Approve P2 | Primary button | Disabled until comment ≥10 chars; disabled if checklist fails |

---

## Review Queue Entry Point

```
┌──────────────────────────────────────────────────────────────────┐
│ Review Queue                                                     │
├──────────────────────────────────────────────────────────────────┤
│ Type           │ Engagement      │ Submitted    │ Days Waiting   │
├────────────────┼─────────────────┼──────────────┼────────────────┤
│ P2 Planning    │ ENG-2026-00001  │ Feb 1, 2026  │ 1 day          │
│ Review         │ Budget Review   │              │                │
├────────────────┼─────────────────┼──────────────┼────────────────┤
│ P3 Evidence    │ ENG-2026-00003  │ Jan 28, 2026 │ 4 days ⚠       │
│ Sufficiency    │ Freight Safety  │              │                │
└──────────────────────────────────────────────────────────────────┘
```

Items sorted by submitted_at ascending (oldest first). Days Waiting > 3 shown with ⚠ indicator.

---
# Screen-09: Evidence Registry (F8, F9)

**Purpose:** Upload evidence items, link to objectives, view gaps, export CSV  
**User Stories:** US-8.1, US-8.2, US-8.3, US-8.4, US-8.5, US-9.1, US-9.2, US-9.3, US-9.4  
**Personas:** Priya Nair (AN), James Whitfield (QA), Diana Okafor (EM)  
**Journeys:** JRN-03.1

---

## Layout — Evidence Registry List

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Evidence                     │
│        │  Phase: Evidence   [+ Add Evidence]   [Export CSV ↓]         │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  OBJECTIVE COVERAGE SUMMARY                                  │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │  3 objectives   ■■■■■■□□□□  2 covered · 1 gap        │    │
│        │  │  [Show Gaps ▼]                                        │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  FILTERS: [Type ▾] [Sensitivity ▾] [Date Range ▾]           │
│        │           [Linked ▾]  [Search evidence...]                   │
│        │                                                              │
│        │  ┌────┬────────────┬──────────┬───────┬───────┬────┬────┐   │
│        │  │ ID │ Type       │ Source   │ Date  │ Sens. │Obj │File│   │
│        │  ├────┼────────────┼──────────┼───────┼───────┼────┼────┤   │
│        │  │E01 │Interview   │ Agency   │Mar 5  │Std    │ 2  │ 1  │   │
│        │  │    │Note        │ Staff    │       │       │    │    │   │
│        │  │    │            │          │       │       │[View →]  │   │
│        │  ├────┼────────────┼──────────┼───────┼───────┼────┼────┤   │
│        │  │E02 │Dataset     │ OMB      │Mar 3  │[Restr]│ 1  │ 2  │   │
│        │  │    │            │ Budget   │       │       │    │    │   │
│        │  │    │            │          │       │       │[View →]  │   │
│        │  ├────┼────────────┼──────────┼───────┼───────┼────┼────┤   │
│        │  │E03 │Document    │ GAO      │Feb 28 │Std    │ 0  │🔴No│   │
│        │  │    │            │ Archive  │       │       │    │Obj │   │
│        │  │    │            │          │       │       │[View →]  │   │
│        │  └────┴────────────┴──────────┴───────┴───────┴────┴────┘   │
│        │  Showing 3 of 3 items                                        │
└────────┴──────────────────────────────────────────────────────────────┘
```

**Column key:** ID = short evidence ID; Obj = linked objective count; File = attached file count; 🔴 = unlinked (no objectives)

---

## Layout — Add Evidence Form (Modal / Side Panel)

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Evidence Item                                          [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Evidence Type *                                                 │
│  ┌─────────────────────────────────┐                            │
│  │ Interview Note              ▾   │                            │
│  └─────────────────────────────────┘                            │
│  Options: Document / Dataset / Interview Note /                  │
│           Meeting Note / Other                                   │
│                                                                  │
│  Source *                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Agency Budget Office, Staff Interview             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Date Received *   [MM/DD/YYYY]                                  │
│  ┌──────────────┐                                               │
│  │ 03/05/2026   │                                               │
│  └──────────────┘                                               │
│  ℹ Date evidence was received, not date of event                │
│                                                                  │
│  Custodian / Provider                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Director Jane Smith                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Sensitivity *                                                   │
│  ○ Standard (visible to all engagement team members)            │
│  ○ Restricted (visible to AN, EM, QA, IR, PC only)             │
│                                                                  │
│  Description                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ── LINK TO OBJECTIVES (optional, can add after saving) ──      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☐ Obj 1: Assess adequacy of internal budget controls... │    │
│  │ ☐ Obj 2: Evaluate data reliability...                   │    │
│  │ ☐ Obj 3: Review compliance...                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ── UPLOAD FILES ───────────────────────────────────────────    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [📎 Choose Files]  or drag & drop here                 │    │
│  │  Allowed: PDF, DOCX, DOC, XLSX, XLS, CSV, TXT, PNG,    │    │
│  │           JPG, JPEG, ZIP · Max 50MB per file · Max 20   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Cancel]                              [Save Evidence Item]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layout — Evidence Detail Page

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Evidence > E-001             │
│        │  [Standard]  Interview Note  ·  Mar 5, 2026                  │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  SOURCE         Agency Budget Office — Staff Interview        │
│        │  CUSTODIAN      Director Jane Smith                          │
│        │  DATE RECEIVED  March 5, 2026                               │
│        │  UPLOADED BY    Priya Nair · March 5, 2026 14:32            │
│        │  DESCRIPTION    Interview transcript re: FY2026 budget       │
│        │                                                              │
│        │  ── LINKED OBJECTIVES ──────────────────────────────────── │
│        │  ✓ Obj 1: Assess adequacy of internal budget controls...    │
│        │  ✓ Obj 3: Review compliance with reporting requirements...  │
│        │  [+ Link to another objective]                               │
│        │                                                              │
│        │  ── ATTACHED FILES ─────────────────────────────────────── │
│        │  📄 interview-transcript-2026-03-05.pdf (2.4 MB)   [↓]     │
│        │  [+ Upload additional file]                                  │
│        │                                                              │
│        │  ── LINKED FINDINGS ────────────────────────────────────── │
│        │  FD-001: Budget controls show systematic weakness in...     │
│        │                                                              │
│        │  [Edit Evidence]  [Delete Evidence]  [View Audit Trail]     │
└────────┴──────────────────────────────────────────────────────────────┘
```

Delete is blocked if the evidence is linked to any objective, finding, or reference statement (HTTP 409 inline error).

---

## Layout — Gap View (Show Gaps toggle)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Evidence Gap View — Objectives with No Evidence                     │
│  [← Back to Evidence List]                            [Hide Gaps ▲]  │
├──────────────────────────────────────────────────────────────────────┤
│  1 of 3 objectives have no linked evidence (P3 blocker)              │
│                                                                       │
│  ┌─────────────────────────────────────────────┬──────────┬────────┐ │
│  │ Objective                                   │ Evidence │ P3     │ │
│  ├─────────────────────────────────────────────┼──────────┼────────┤ │
│  │ Obj 2: Evaluate data reliability of agency  │ 🔴 None  │Blocker │ │
│  │ financial reporting systems [evidence_needed]│          │        │ │
│  │ 12 days until evidence milestone            │ [Link →] │        │ │
│  └─────────────────────────────────────────────┴──────────┴────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Objective coverage summary bar + gap count | Top of evidence list |
| Primary | Evidence list with sensitivity badges + link counts | Main content |
| Secondary | Add evidence form with inline objective linking | Modal/panel |
| Secondary | Gap view (toggle) | Below coverage bar |
| Tertiary | Filters, search, export | Action bar above list |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Evidence list with coverage bar | Coverage bar shows linked/total count |
| No evidence yet | Empty state illustration | "No evidence added yet. Add your first evidence item." + [+ Add Evidence] |
| Gap exists | Red badge on coverage bar; gap row in list | "🔴 No objectives linked" badge on evidence row |
| File uploading | Progress bar in upload area | "Uploading… 45%" |
| File too large | Inline error under upload area | "File exceeds maximum size of 50 MB." |
| Restricted evidence (AL/RO view) | Row hidden entirely | Restricted items do not appear |
| Saving | Button spinner | "Saving…" |
| Save success | Modal closes; list updates | Toast: "Evidence item saved." |
| Delete blocked | Inline error in delete confirmation | "Cannot delete — linked to objectives or findings. Unlink first." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| + Add Evidence | Primary button | Opens slide-in panel with evidence form |
| Export CSV | Secondary button | Downloads CSV scoped to current engagement; restricted items excluded for AL/RO |
| Show Gaps | Toggle link | Filters list to show only objectives with zero linked evidence |
| Evidence row | Clickable row | Opens evidence detail page |
| Link to objective checkbox | Multi-select in form | Inline objective selector on save confirmation |
| Delete Evidence | Destructive button | Confirmation dialog; blocked if linked |
| Sensitivity toggle | Radio in form | Clearly explains visibility scope |

---
# Screen-10: Findings & Gate P3 (F10)

**Purpose:** Create findings linked to evidence; QA marks objective sufficiency and approves P3  
**User Stories:** US-10.1, US-10.2, US-10.3, US-10.4  
**Personas:** Priya Nair (AN), James Whitfield (QA)  
**Journeys:** JRN-03.1, JRN-04.1

---

## Layout — Findings List (Analyst view)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Findings                     │
│        │  Phase: Evidence   [+ Add Finding]                           │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  OBJECTIVE SUFFICIENCY SUMMARY                               │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │  Obj 1  [Sufficient ✓]      Obj 2  [Evidence Needed🔴]│   │
│        │  │  Obj 3  [In Review ○]                                 │    │
│        │  │  P3 Gate Status: BLOCKED — 1 objective has no evidence│    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌────────────────────────────────────────────────────────┐  │
│        │  │ FD-001  [Draft]                              [Edit][✕] │  │
│        │  │ Budget controls show systematic weaknesses in quarterly │  │
│        │  │ reconciliation processes for FY2026.                   │  │
│        │  │ Evidence: E-001 (Interview Note) · E-002 (Dataset)     │  │
│        │  │ Objectives: Obj 1 ✓                                    │  │
│        │  ├────────────────────────────────────────────────────────┤  │
│        │  │ FD-002  [Draft]                              [Edit][✕] │  │
│        │  │ Agency financial reporting systems lack documented      │  │
│        │  │ data validation procedures.                             │  │
│        │  │ Evidence: None linked 🔴                                │  │
│        │  │ Objectives: Obj 3                                       │  │
│        │  └────────────────────────────────────────────────────────┘  │
│        │                                                              │
│        │  P3 GATE PREREQUISITES (visible to all)                      │
│        │  🔴 Obj 2 has no linked evidence (P3 blocker)               │
│        │  🔴 FD-002 has no linked evidence (P3 blocker)              │
│        │  ✓  P2 approved                                              │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Add Finding Form (Modal)

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Finding                                               [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Finding Text *                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Budget controls show systematic weaknesses in     │    │
│  │ quarterly reconciliation processes...                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  💡 Tip: Describe a clear conclusion or observation supported   │
│     by your evidence.                                            │
│                                                                  │
│  Link to Evidence (required before P3) *                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☑ E-001  Interview Note — Agency Budget Office           │    │
│  │ ☑ E-002  Dataset — OMB Budget [Restricted]              │    │
│  │ ☐ E-003  Document — GAO Archive                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ⚠  At least one evidence item must be linked before P3.        │
│                                                                  │
│  [Cancel]                                    [Save Finding]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layout — P3 Evidence Sufficiency Review (QA view)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Review Queue > ENG-2026-00001 — P3 Evidence Sufficiency     │
│        │  Submitted: March 15, 2026 · Phase: Evidence                 │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── OBJECTIVE SUFFICIENCY TABLE ───────────────────────── │
│        │  ┌──────────────────────────────────┬────────────┬───────┐  │
│        │  │ Objective                        │ Evidence   │Status │  │
│        │  ├──────────────────────────────────┼────────────┼───────┤  │
│        │  │ Obj 1: Assess adequacy of        │ 2 items    │[Set ▾]│  │
│        │  │ internal budget controls...      │ ✓ Sufficient│Suff. │  │
│        │  ├──────────────────────────────────┼────────────┼───────┤  │
│        │  │ Obj 2: Evaluate data reliability │ 0 items    │[Set ▾]│  │
│        │  │ of financial reporting...        │ 🔴 No evid.│Evid.  │  │
│        │  │                                  │            │Needed │  │
│        │  ├──────────────────────────────────┼────────────┼───────┤  │
│        │  │ Obj 3: Review compliance with    │ 1 item     │[Set ▾]│  │
│        │  │ reporting requirements...        │ ○ In Review│In Rev.│  │
│        │  └──────────────────────────────────┴────────────┴───────┘  │
│        │  QA can set status: Evidence Needed / In Review / Sufficient │
│        │  Cannot mark In Review or Sufficient with 0 evidence items   │
│        │                                                              │
│        │  ── FINDINGS LIST ──────────────────────────────────────── │
│        │  FD-001: Budget controls show weaknesses...                  │
│        │         Evidence: E-001, E-002 ✓                             │
│        │  FD-002: Agency financial reporting lacks procedures...      │
│        │         Evidence: None linked 🔴                             │
│        │                                                              │
│        │  ── P3 PREREQUISITES CHECKLIST ────────────────────────── │
│        │  🔴 Obj 2 has status Evidence Needed (P3 blocked)           │
│        │  🔴 FD-002 has no linked evidence (P3 blocked)              │
│        │  ✓  P2 approved                                              │
│        │  ✓  Obj 1 has ≥1 linked evidence item                       │
│        │                                                              │
│        │  ── P3 DECISION (QA role only) ─────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Decision Comment *                                     │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ e.g., Returning — Objective 2 has no linked       │  │ │
│        │  │  │ evidence. FD-002 must be linked before P3.        │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │  [Return for Revision]    [✓ Approve P3] (disabled🔴)  │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

Approve P3 button is disabled while any prerequisite shows 🔴.

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Objective sufficiency summary + P3 gate status | Top of page |
| Primary | P3 prerequisites checklist (QA view) | Above decision panel |
| Secondary | Findings list with evidence links | Main scrollable area |
| Secondary | P3 decision panel (QA only) | Bottom, sticky if space |
| Tertiary | Objective status dropdown controls | Within objective table |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| All objectives sufficient | Green summary bar; Approve active | "All objectives are sufficient. P3 ready to approve." |
| Evidence gap exists | Red badges on objectives/findings | Named blocker: "Objective 2 has no linked evidence." |
| No findings yet | Empty state | "No findings added. Add findings and link to evidence before P3." |
| Approving P3 | Button spinner | "Processing P3 approval…" |
| P3 approved | Redirect + banner on Engagement Shell | "Gate P3 approved. Engagement now in Draft phase." |
| Returning P3 | Return dialog | "Confirm return? Add return comment." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| + Add Finding | Primary button | Modal with finding text + evidence link selector |
| Objective status dropdown | Select (QA/EM/AD only) | Sets evidence_needed / in_review / sufficient; blocked without evidence |
| Approve P3 | Primary button (QA only) | Disabled while any prerequisite fails |
| Return for Revision | Secondary button (QA only) | Requires comment ≥10 chars |
| Evidence link selector | Multi-select | Filtered to current engagement's evidence |

---
# Screen-11: Draft Product (F11)

**Purpose:** Create and track the draft product through review stages; attach file; record review comments  
**User Stories:** US-11.1, US-11.2, US-11.3, US-11.4  
**Personas:** Diana Okafor (EM), Priya Nair (AN), James Whitfield (QA)  
**Journeys:** JRN-03.2

---

## Layout — Draft Product Record (Drafting state)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Draft Product                │
│        │  Status: [Drafting]         [Advance to Under Review →]      │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── DRAFT METADATA ─────────────────────────────────────── │
│        │  Title         Review of Budget Control Systems FY2026        │
│        │  Version       v1.0                                          │
│        │  Owner         Priya Nair                                    │
│        │  Created       April 2, 2026                                 │
│        │                                                              │
│        │  ── DRAFT FILE ATTACHMENT ──────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Current file:  draft-report-v1.0.docx  (1.8 MB)  [↓]   │ │
│        │  │                                                         │ │
│        │  │ Replace file:  [📎 Choose File]  or drag & drop         │ │
│        │  │ Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP            │ │
│        │  │ Max size: 50 MB · One file per draft record              │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── REVIEW COMMENTS ────────────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ James Whitfield (QA) · April 3, 2026 09:14              │ │
│        │  │ Section 3 needs stronger evidence citation for finding  │ │
│        │  │ FD-002. Please revise before advancing to review.       │ │
│        │  ├─────────────────────────────────────────────────────────┤ │
│        │  │ Add Comment                                             │ │
│        │  │ ┌───────────────────────────────────────────────────┐  │ │
│        │  │ │                                                   │  │ │
│        │  │ └───────────────────────────────────────────────────┘  │ │
│        │  │ [Save Comment]                                         │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  Comments are append-only and cannot be edited after save.   │
│        │                                                              │
│        │  ── DRAFT STATEMENTS (Indexing) ──────────────────────────  │
│        │  3 statements  ·  2 linked to evidence  ·  1 unlinked 🔴    │
│        │  [View Statements / Reference Check →]                       │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Status Progression Bar

```
Drafting → Under Review → Ready for Ref. Check → Ready for Final Review
   ●─────────────○──────────────────○──────────────────────○
  [Current]   [Next step]                            [Final]
```

Status transitions permitted:
- **Drafting → Under Review** (EM action)
- **Under Review → Ready for Reference Check** (EM action; requires ≥1 statement)
- **Under Review → Drafting** (QA return action)
- **Ready for Reference Check → Ready for Final Review** (EM action)
- **Ready for Final Review → Under Review** (EM rollback)

---

## Layout — Create Draft Product Form (first-time)

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Draft Product Record                               [✕]  │
├─────────────────────────────────────────────────────────────────┤
│  ℹ Gate P3 must be approved before creating a draft product.    │
│                                                                  │
│  Title *                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Review of Budget Control Systems FY2026           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Version *                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ v1.0                                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Owner *                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Priya Nair                                          ▾   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Must be an active user assigned to this engagement              │
│                                                                  │
│  [Cancel]                          [Create Draft Product]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Status badge + status progression bar | Top of page |
| Primary | Draft file attachment (download + replace) | Upper content area |
| Secondary | Review comments thread | Middle content area |
| Secondary | Statements/indexing summary with link | Below comments |
| Tertiary | Draft metadata (title, version, owner, date) | Upper metadata block |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| No draft product yet | Empty state with create button | "No draft product record. Create one after P3 is approved." |
| P3 not yet approved | Create button disabled | "Gate P3 must be approved to create a draft product." |
| Drafting | Orange status badge; advance button available | "Advance to Under Review when ready." |
| Under Review | Blue status badge | Comments thread active; QA can return to Drafting |
| Ready for Ref Check | Teal status badge; statement count shown | "All statements must be indexed before advancing." |
| Ready for Final Review | Green status badge | "Proceed to Gate P4 checklist." |
| File uploading | Progress bar | "Uploading… 67%" |
| Comment saved | Appended to thread | Toast: "Comment saved." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Advance status button | Primary button (EM only) | Advances to next permitted status; blocked if statements missing |
| Return to Drafting | Secondary button (QA only) | Returns status from Under Review → Drafting |
| File chooser | File input | Single-file; replaces existing; drag-drop supported |
| Add Comment | Textarea + Save button | Non-empty; append-only; EM/QA/AN/AD permitted |
| View Statements link | Navigation link | Routes to reference check / indexing screen |

---
# Screen-12: Reference Check / Indexing (F12)

**Purpose:** Link draft statements to evidence; IR marks pass/fail; EM waives; failed statements routed to Analyst  
**User Stories:** US-12.1, US-12.2, US-12.3, US-12.4, US-12.5, US-12.6, US-12.7  
**Personas:** Priya Nair (AN), Carla Voss (IR), Diana Okafor (EM), Tom Andrade (PC)  
**Journeys:** JRN-03.2, JRN-05.1

---

## Layout — Reference Check Queue (All roles)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Draft Product > Statements   │
│        │  Status: [Ready for Reference Check]                         │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  REFERENCE CHECK PROGRESS                                    │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │  7 statements   ■■■■■■■□□□  5 complete (71%)         │    │
│        │  │  Passed: 4 · Waived: 1 · Failed: 1 · In Review: 1   │    │
│        │  │  Not Started: 0                                       │    │
│        │  │  P4 Status: BLOCKED — 1 Failed, 1 In Review          │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  FILTERS: [Status ▾]  [Assigned To ▾]  [Search...]          │
│        │  [+ Add Statement]   (AN, EM, AD only)                       │
│        │                                                              │
│        │  ┌────┬─────────────────────┬──────────┬──────────┬───────┐  │
│        │  │ #  │ Statement           │ Evidence │ Assigned │Status │  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 1  │ Budget controls show│ 2 items ✓│ C. Voss  │[Pass] │  │
│        │  │    │ weaknesses in...    │          │          │ ✓     │  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 2  │ Agency lacks data   │ 1 item ✓ │ C. Voss  │[Fail] │  │
│        │  │    │ validation docs...  │          │          │ 🔴    │  │
│        │  │    │ Discrepancy: Wrong  │          │          │       │  │
│        │  │    │ evidence linked     │          │  P. Nair │Analyst│  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 3  │ Quarterly reconcil- │ 2 items ✓│ C. Voss  │[In    │  │
│        │  │    │ iation gaps exist...│          │          │Review]│  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 4  │ Reporting deadlines │ 1 item ✓ │ C. Voss  │[Pass] │  │
│        │  │    │ met for FY2025...   │          │          │ ✓     │  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 5  │ Internal controls   │ 1 item ✓ │ EM       │[Waive]│  │
│        │  │    │ meet OMB Circ A-123 │          │ waived   │ ○     │  │
│        │  └────┴─────────────────────┴──────────┴──────────┴───────┘  │
└────────┴──────────────────────────────────────────────────────────────┘
```

Status badges: [Pass] = green ✓; [Fail] = red 🔴; [In Review] = amber ○; [Waive] = grey ○; [Not Started] = empty

---

## Layout — Statement Detail (IR view — reviewing a statement)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Statements > Statement 2                                     │
│        │  Assigned to: Carla Voss (IR) · Status: In Review           │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  STATEMENT TEXT                                              │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Agency lacks documented data validation procedures for  │ │
│        │  │ financial reporting systems.                             │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  LINKED EVIDENCE                                             │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ E-001  Interview Note — Agency Budget Office             │ │
│        │  │ [↓ Download]  [Preview ▸]                               │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── REFERENCE CHECK DECISION (IR only) ──────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Status *                                               │ │
│        │  │  ○ In Review  ○ Passed  ● Failed                        │ │
│        │  │                                                         │ │
│        │  │  Discrepancy Type *  (required when Failed)             │ │
│        │  │  ┌────────────────────────────────────────────────┐    │ │
│        │  │  │ Wrong evidence linked                      ▾   │    │ │
│        │  │  └────────────────────────────────────────────────┘    │ │
│        │  │  Options: Wrong evidence / Missing evidence /           │ │
│        │  │           Statement mismatch / Insufficient detail      │ │
│        │  │                                                         │ │
│        │  │  Discrepancy Notes *  (required when Failed)            │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ The cited interview transcript does not contain   │  │ │
│        │  │  │ the specific figure referenced in this statement. │  │ │
│        │  │  │ A different evidence item is needed.              │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │                                                         │ │
│        │  │  Assign Back To (optional routing)                      │ │
│        │  │  ┌────────────────────────────────────────────────┐    │ │
│        │  │  │ Priya Nair (Analyst)                       ▾   │    │ │
│        │  │  └────────────────────────────────────────────────┘    │ │
│        │  │                                                         │ │
│        │  │  [← Previous]     [Save & Next →]    [Save Status]     │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  Confirmation after save: "Statement assigned to Priya Nair.  │
│        │  Reference check queue updated."                              │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Analyst Correction View (Priya's queue — failed statement)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  My Queue > Statement 2 (Returned — Needs Correction)         │
│        │  Failed by: Carla Voss · March 20, 2026                      │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ⚠ DISCREPANCY FROM REFERENCER                               │
│        │  Type: Wrong evidence linked                                 │
│        │  Note: "The cited interview transcript does not contain the  │
│        │  specific figure referenced. A different evidence item is    │
│        │  needed."                                                    │
│        │                                                              │
│        │  STATEMENT TEXT                 [Edit statement text]         │
│        │  Agency lacks documented data validation procedures for       │
│        │  financial reporting systems.                                  │
│        │                                                              │
│        │  LINKED EVIDENCE               [Update Evidence Links]        │
│        │  ✕ E-001  Interview Note (remove?)                           │
│        │  + Select replacement evidence from registry...              │
│        │                                                              │
│        │  CORRECTION NOTE (recommended)                               │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Replaced E-001 with E-002 (OMB Dataset) which directly  │ │
│        │  │ references the validation procedure gaps.               │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  [☑ Mark as Revision Ready — Send Back to Referencer]        │
└────────┴──────────────────────────────────────────────────────────────┘
```

After marking revision ready, the statement returns to Carla's review queue automatically. Banner: "Sent back to referencer."

---

## Layout — Waive Reference Check (EM action)

```
┌─────────────────────────────────────────────────────────────────┐
│  Waive Reference Check — Statement 5                       [✕]  │
├─────────────────────────────────────────────────────────────────┤
│  ⚠ Waiving removes this statement from P4 blocking checks.     │
│                                                                  │
│  Waiver Justification *  (minimum 10 characters)                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ This statement cites OMB Circular A-123 directly. The  │    │
│  │ reference is to an authoritative government standard   │    │
│  │ that does not require independent evidence verification.│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Cancel]                          [Waive Reference Check]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Progress bar: total / by status / P4 gate status | Top of queue |
| Primary | Statement list with status badges | Main content area |
| Primary | Discrepancy panel (IR view) | Statement detail — prominent top box |
| Secondary | Evidence links for each statement | Statement detail |
| Secondary | Assign-back routing (IR view) | Decision panel |
| Tertiary | Filters, search, statement count | Above statement list |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Not Started | Grey badge; unassigned | "Not yet assigned for reference check." |
| In Review | Amber badge; assigned to IR | "Under review by [IR name]." |
| Passed | Green ✓ badge | "Reference check passed." |
| Failed | Red 🔴 badge + discrepancy visible | Discrepancy note shown inline; analyst routing shown |
| Waived | Grey ○ badge + waiver justification | "Waived by [EM name] — [justification]." |
| All complete (P4 ready) | Green progress bar; P4 unblocked | "All reference checks complete. P4 prerequisites met." |
| Analyst correction queue | Amber banner with discrepancy | "Returned for correction — discrepancy note from [IR name]." |
| Revision ready | Blue badge | "Sent back to referencer for re-check." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| + Add Statement | Primary button (AN/EM/AD) | Opens statement form with text + evidence link selector |
| Statement row | Clickable row | Opens statement detail |
| Status select | Radio group (IR only) | Failed triggers discrepancy fields |
| Discrepancy type | Dropdown (required on Failed) | Structured options reduce ambiguity |
| Discrepancy notes | Textarea (required on Failed) | Cannot save Failed without notes |
| Assign back | User select (IR, optional) | Routes to analyst queue automatically |
| Waive | EM action from row menu | Confirmation modal with justification field |
| Mark revision ready | Checkbox (AN) | Sends to IR queue; banner confirms |
| Save & Next | Navigation button (IR) | Saves current status and opens next statement |
| Preview evidence | Inline viewer link | Opens PDF/DOCX in side panel where possible |

---
# Screen-13: Gate P4 Final Readiness (F13)

**Purpose:** Final readiness checklist; PC/EM approve P4 setting engagement to Ready for Issuance  
**User Stories:** US-13.1, US-13.2, US-13.3, US-13.4  
**Personas:** Tom Andrade (PC), Diana Okafor (EM)  
**Journeys:** JRN-06.1

---

## Layout — P4 Final Readiness Checklist

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Final Readiness (P4)         │
│        │  Phase: Readiness   Risk: Medium   Owner: Diana Okafor        │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P4 PREREQUISITES CHECKLIST ───────────────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ ✓  Gate P3 approved (March 15, 2026 — James Whitfield)  │ │
│        │  │    Evidence sufficiency confirmed for all objectives     │ │
│        │  │                                                         │ │
│        │  │ ✓  No failed reference checks                           │ │
│        │  │    All failed statements resolved                        │ │
│        │  │                                                         │ │
│        │  │ ✓  No in-review reference checks                        │ │
│        │  │    All statements marked final status                    │ │
│        │  │                                                         │ │
│        │  │ ✓  No not-started reference checks                      │ │
│        │  │    All 7 statements: Passed (6) · Waived (1)            │ │
│        │  │                                                         │ │
│        │  │ ✓  No open blockers                                     │ │
│        │  │    All engagement prerequisites resolved                 │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  All prerequisites met.                                       │
│        │                                                              │
│        │  ── REFERENCE CHECK SUMMARY ────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  7 statements   Passed: 6  ·  Waived: 1  ·  Failed: 0  │ │
│        │  │  In Review: 0  ·  Not Started: 0                        │ │
│        │  │  Completion: 100% ✓                                     │ │
│        │  │  [View All Statements →]                                │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── GATE HISTORY SUMMARY ───────────────────────────────── │
│        │  A1  Approved  Jan 15, 2026  Marcus Reid                    │
│        │  P2  Approved  Feb 3, 2026   James Whitfield                │
│        │  P3  Approved  Mar 15, 2026  James Whitfield                │
│        │  P4  Pending                                                 │
│        │  [View Full Gate History →]                                  │
│        │                                                              │
│        │  ── P4 APPROVAL (PC and EM roles only) ─────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Outcome *                                              │ │
│        │  │  ● Ready for Issuance                                   │ │
│        │  │  ○ Closed (EM/Admin only)                               │ │
│        │  │                                                         │ │
│        │  │  Final Approval Comment *  (minimum 10 characters)      │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ e.g., All reference checks confirmed. Product is  │  │ │
│        │  │  │ ready for issuance.                               │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │  [12 / 10] ✓                                            │ │
│        │  │                                                         │ │
│        │  │                        [✓ Approve Final Readiness]      │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Blocked State (prerequisites not met)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Final Readiness (P4)         │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P4 PREREQUISITES CHECKLIST ───────────────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ ✓  Gate P3 approved                                     │ │
│        │  │                                                         │ │
│        │  │ 🔴 Failed reference checks — 1 statement failed         │ │
│        │  │    Statement 2: "Agency lacks data validation docs..."   │ │
│        │  │    [View Statement →]                                    │ │
│        │  │                                                         │ │
│        │  │ 🔴 In-review reference checks — 1 statement in review   │ │
│        │  │    Statement 3: "Quarterly reconciliation gaps..."       │ │
│        │  │    [View Statement →]                                    │ │
│        │  │                                                         │ │
│        │  │ ✓  No not-started reference checks                      │ │
│        │  │ ✓  No open blockers                                     │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ⛔ 2 prerequisites are not met. Resolve before approving.   │
│        │                                                              │
│        │  ── P4 APPROVAL ────────────────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  [✓ Approve Final Readiness]  ← Disabled until all ✓   │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

Failing checklist items show a direct link to the blocking record. Approve button is fully disabled (not just grayed out styling — no click event, ARIA disabled).

---

## Post-Approval State

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001                                 │
│        │  Status: [Ready for Issuance ✓]   Phase: Readiness            │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ ✓ Gate P4 Approved — April 30, 2026                     │ │
│        │  │   Approved by: Tom Andrade (PC)                         │ │
│        │  │   "All reference checks confirmed. Product is ready     │ │
│        │  │    for issuance."                                        │ │
│        │  │   Outcome: Ready for Issuance                           │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  This engagement is now read-only.                           │
│        │  All records and audit history remain accessible.            │
│        │  No further edits, uploads, or gate approvals are permitted. │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Prerequisites checklist with ✓/🔴 status + links to failing records | Top of page — full width |
| Primary | Reference check summary inline | Below checklist |
| Primary | Approve P4 button (enabled only when all ✓) | Bottom of page; always visible |
| Secondary | Gate history summary | Middle section |
| Tertiary | Outcome selector (PC always Ready for Issuance) | Within approval panel |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Prerequisites not met | Red 🔴 items + links to blockers; approve disabled | "Resolve failing items to enable approval." |
| All prerequisites met | All green ✓; approve button enabled | "All prerequisites met. You may approve." |
| Approving | Button spinner; form locked | "Submitting P4 approval…" |
| P4 approved | Full read-only state; green status banner | "Gate P4 approved. Engagement is Ready for Issuance." |
| Closed outcome | Blue status banner | "Engagement closed without issuance." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Prerequisite checklist | Computed read-only display | Refreshed on page load; links to failing records |
| View Statement link | Inline navigation link | Routes directly to the failing statement |
| Outcome radio | Radio group | PC sees only Ready for Issuance; EM/AD see both |
| Final comment | Textarea (required, ≥10 chars) | Real-time char count with green/red indicator |
| Approve button | Primary button (PC/EM only) | Disabled if any 🔴 item; confirmation dialog before action |
| View Full Gate History | Navigation link | Routes to /engagements/{id}/gates |

---
# Screen-14: Audit Trail View (F0)

**Purpose:** Timestamped event log per engagement; filter by action type and date range  
**User Stories:** US-0.5  
**Personas:** Marcus Reid (AL), Diana Okafor (EM), all engagement team members  
**Journeys:** JRN-04.1 (step 6 — audit trail confirmation)

---

## Layout — Audit Trail Tab

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Audit Trail                  │
│        │  All events for this engagement · [Export CSV ↓] (Admin)     │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  FILTERS: [Action Type ▾]  [Date From _____]  [To _____]    │
│        │  [Apply]  [Clear]                                            │
│        │                                                              │
│        │  ── TIMELINE (reverse chronological) ──────────────────── │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Apr 30, 2026  14:22:07  Tom Andrade (PC)             │    │
│        │  │ GATE_P4_APPROVED                                      │    │
│        │  │ Gate P4 approved for ENG-2026-00001.                 │    │
│        │  │ Outcome: Ready for Issuance. Comment: "All reference  │    │
│        │  │ checks confirmed."                                    │    │
│        │  │ [Engagement]                                          │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Apr 28, 2026  09:15:33  Carla Voss (IR)              │    │
│        │  │ REFERENCE_STATUS_CHANGED                              │    │
│        │  │ Statement 2 status changed from Failed → Passed after │    │
│        │  │ analyst correction. Previously: wrong evidence linked. │    │
│        │  │ [Statement 2]                                         │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Apr 25, 2026  16:47:01  Priya Nair (AN)              │    │
│        │  │ REFERENCE_FAILED_DISCREPANCY                          │    │
│        │  │ Statement 2 failed — discrepancy noted. Wrong         │    │
│        │  │ evidence linked. Assigned back to Priya Nair (AN).    │    │
│        │  │ [Statement 2]                                         │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Mar 15, 2026  11:05:22  James Whitfield (QA)         │    │
│        │  │ GATE_P3_APPROVED                                      │    │
│        │  │ Gate P3 approved. All objectives marked Sufficient.   │    │
│        │  │ Engagement advances to Draft phase.                   │    │
│        │  │ [Engagement]  [Gate Decision]                         │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Mar 10, 2026  13:28:44  Priya Nair (AN)              │    │
│        │  │ EVIDENCE_OBJECTIVE_LINKED                             │    │
│        │  │ Evidence E-002 linked to Objective 2.                │    │
│        │  │ [Evidence E-002]  [Objective 2]                       │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Feb 3, 2026  10:12:55  James Whitfield (QA)          │    │
│        │  │ GATE_P2_APPROVED                                      │    │
│        │  │ Gate P2 approved. Planning baseline locked.           │    │
│        │  │ Comment: "Planning baseline meets all requirements."  │    │
│        │  │ [Planning Record]  [Gate Decision]                    │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Jan 15, 2026  09:00:00  Marcus Reid (AL)             │    │
│        │  │ GATE_A1_APPROVED                                      │    │
│        │  │ Request REQ-00042 accepted. Engagement ENG-2026-00001 │    │
│        │  │ auto-created. Risk: Medium. Rationale: "Congressional │    │
│        │  │ request with clear mandate..."                        │    │
│        │  │ [Request REQ-00042]  [Engagement]                    │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  Showing events 1–20 of 47   [Load More]                     │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Individual event cards: timestamp, actor, action code, summary | Main scroll area |
| Secondary | Action type + date range filters | Top of page |
| Secondary | Linked object references (clickable) | Bottom of each event card |
| Tertiary | Export CSV (Admin only) | Top action bar |

---

## Event Card Anatomy

Each card contains:
1. **Timestamp** — ISO format, local timezone display (e.g., "Apr 30, 2026 14:22:07")
2. **Actor name + role badge** — e.g., "Tom Andrade (PC)"
3. **Action code** — machine-readable, displayed as monospace label (e.g., `GATE_P4_APPROVED`)
4. **Human-readable summary** — full sentence describing what changed
5. **Object links** — click-through to the affected record (engagement, gate decision, evidence, statement)

---

## Audit Event Action Codes (visible in UI)

| Action Code | Trigger |
|-------------|---------|
| `REQUEST_CREATED` | New request saved as draft |
| `REQUEST_SUBMITTED` | Request submitted for A1 |
| `REQUEST_DOCUMENT_UPLOADED` | Intake document attached |
| `GATE_A1_APPROVED` | A1 approval decision |
| `GATE_A1_DECLINED` | A1 decline decision |
| `ENGAGEMENT_UPDATED` | Engagement metadata edited |
| `TEAM_MEMBER_ASSIGNED` | User added to team |
| `TEAM_MEMBER_REMOVED` | User removed from team |
| `MILESTONES_UPDATED` | Milestone dates changed |
| `PLANNING_RECORD_CREATED` | Planning record initiated |
| `PLANNING_RECORD_UPDATED` | Planning record saved |
| `PLANNING_SUBMITTED_FOR_REVIEW` | Submitted to P2 queue |
| `GATE_P2_APPROVED` | P2 approval |
| `GATE_P2_RETURNED` | P2 return for revision |
| `PLANNING_RECORD_REVISED` | Post-P2 planning revision |
| `EVIDENCE_ITEM_CREATED` | Evidence record created |
| `EVIDENCE_FILE_UPLOADED` | File attached to evidence |
| `EVIDENCE_RESTRICTED` | Sensitivity changed to Restricted |
| `EVIDENCE_OBJECTIVE_LINKED` | Evidence linked to objective |
| `EVIDENCE_ITEM_DELETED` | Evidence record deleted |
| `EVIDENCE_CSV_EXPORTED` | Evidence registry exported |
| `FINDING_CREATED` | Finding record created |
| `FINDING_EVIDENCE_LINKED` | Evidence linked to finding |
| `OBJECTIVE_STATUS_UPDATED` | Objective evidence status changed |
| `GATE_P3_APPROVED` | P3 approval |
| `DRAFT_PRODUCT_CREATED` | Draft product record created |
| `DRAFT_FILE_ATTACHED` | Draft file uploaded |
| `DRAFT_COMMENT_ADDED` | Review comment added |
| `DRAFT_STATUS_CHANGED` | Draft product status advanced |
| `STATEMENT_CREATED` | Draft statement added |
| `STATEMENT_EVIDENCE_LINKED` | Statement linked to evidence |
| `REFERENCE_CHECK_ASSIGNED` | Statement assigned to IR |
| `REFERENCE_STATUS_CHANGED` | IR marks pass/fail/in-review |
| `REFERENCE_FAILED_DISCREPANCY` | Statement failed with notes |
| `REFERENCE_CHECK_WAIVED` | EM waives reference check |
| `GATE_P4_APPROVED` | P4 final approval |
| `ENGAGEMENT_CLOSED` | Engagement closed |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Chronological event cards | Latest event first |
| Filtered | Filtered event list | "Showing X events matching filter" |
| No events yet | Empty state | "No audit events recorded yet." |
| Export triggered (Admin) | Download initiated | Toast: "Audit log exported to CSV." |
| Load more | Pagination button | "Load More (showing 20 of 47)" |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Action Type filter | Multi-select dropdown | Filters by action code category |
| Date range | Date inputs (From / To) | Filters event cards by date range |
| Apply / Clear | Form buttons | Apply triggers filter; Clear resets |
| Object links in cards | Inline links | Navigate to referenced record |
| Export CSV | Action button (Admin only) | Downloads all events for engagement |
| Load More | Pagination button | Appends next 20 events |

---
# Interaction Patterns (EMS)

---

## Pattern: Gate Decision Panel

**When to use:** Any screen where a gate approval or return action occurs (A1, P2, P3, P4)  
**Behavior:**
1. Decision panel is rendered at the bottom of the review page (sticky on scroll if page is long)
2. Comment/rationale textarea is required; real-time character counter shows current/minimum
3. Primary action button (Approve/Accept) is disabled until:
   - All prerequisite checklist items show ✓
   - Comment meets minimum character requirement
4. Destructive action (Return/Decline) uses secondary button styling; triggers a confirmation modal
5. On success: API call → success toast → redirect to next appropriate page

**Confirmation modal for irreversible gate actions:**
```
┌─────────────────────────────────────────────────────────────┐
│  Confirm Gate P2 Approval                                    │
├─────────────────────────────────────────────────────────────┤
│  You are about to approve the planning baseline for         │
│  ENG-2026-00001. This will lock the planning record and     │
│  advance the engagement to the Evidence phase.              │
│                                                             │
│  This action cannot be undone.                              │
│                                                             │
│  [Cancel]                      [Confirm Approval]           │
└─────────────────────────────────────────────────────────────┘
```

**Used in:** Screen-04 (A1), Screen-08 (P2), Screen-10 (P3), Screen-13 (P4)

---

## Pattern: Prerequisites / Readiness Checklist

**When to use:** Before any gate submission or approval  
**Behavior:**
- Checklist computed in real-time from backend state
- Each item shows: ✓ (green, pass) or 🔴 (red, fail) with brief description
- Failing items include a link to the blocking record
- "Submit" or "Approve" button disabled while any item shows 🔴
- On all-pass: summary message "All prerequisites met." appears above the action button

**Visual states:**
```
✓  [Item label — pass state]          ← green text
🔴 [Item label — fail state]          ← red text + link to fix
   [→ View affected record]
```

**Used in:** Screen-07 (P2 submission readiness), Screen-08 (P2 approval checklist), Screen-10 (P3 checklist), Screen-13 (P4 checklist)

---

## Pattern: Inline Required Field Validation

**When to use:** All forms with required fields (request intake, planning record, gate decision panels)  
**Behavior:**
- Validation triggers on field blur (not on keystroke) to avoid premature error messages
- Error message appears immediately below the invalid field in red
- Field border turns red on invalid; green on valid
- Form submit button disabled until all required fields are valid
- Soft warnings (e.g., past due date) use amber styling and do not block submission

**Field states:**
```
┌─────────────────────────────────────┐
│ Field Label *                       │  ← asterisk = required
│ [field value                      ] │  ← border: default grey
└─────────────────────────────────────┘
                                          (valid: green border)
                                          (invalid: red border + error below)
  ⚠ "This field is required."            ← error text below
```

**Used in:** Screen-03 (request intake), Screen-07 (planning record), all gate decision panels

---

## Pattern: File Upload with Progress Feedback

**When to use:** Intake document upload (F2), evidence file upload (F8), draft file attachment (F11)  
**Behavior:**
1. Drop zone or "Choose Files" button opens file picker
2. On selection: immediate type/size validation before upload begins
3. Type error: red inline message listing allowed types
4. Size error: red inline message with limit
5. Valid file: upload begins with progress bar (0–100%)
6. Upload success: filename + size displayed with ✓; remove button available
7. Upload error: red inline message with retry option

**Upload area states:**
```
IDLE:
┌─────────────────────────────────────────┐
│  [📎 Choose File]  or drag & drop here  │
│  Allowed: PDF, DOCX, ...  Max: 25 MB    │
└─────────────────────────────────────────┘

UPLOADING:
┌─────────────────────────────────────────┐
│  report-v1.pdf                          │
│  ████████████░░░░░░  65%               │
└─────────────────────────────────────────┘

SUCCESS:
┌─────────────────────────────────────────┐
│  ✓ report-v1.pdf (2.1 MB)  [✕ Remove]  │
└─────────────────────────────────────────┘

ERROR:
┌─────────────────────────────────────────┐
│  ⚠ File exceeds maximum size of 25 MB. │
│  [Choose a different file]              │
└─────────────────────────────────────────┘
```

**Used in:** Screen-03 (intake document), Screen-09 (evidence files), Screen-11 (draft file)

---

## Pattern: Toast Notifications

**When to use:** Non-blocking success and informational feedback after actions  
**Behavior:**
- Toast appears top-right, slides in, auto-dismisses after 4 seconds
- User can manually dismiss with ✕
- Colors: green = success, amber = warning, red = error (for non-inline errors)
- Multiple toasts stack vertically

**Examples:**
- "Draft saved." (green)
- "Request submitted." (green)
- "Evidence item saved." (green)
- "Comment saved." (green)
- "Statement assigned to Priya Nair." (green)
- "File storage unavailable. Please try again." (red)

---

## Pattern: Status Badges

**When to use:** Phase, gate status, sensitivity, and milestone status indicators across all screens  
**Consistent badge colors:**

| Status / Value | Badge Color |
|----------------|-------------|
| Draft | Grey |
| Submitted | Blue |
| Accepted / Active | Green |
| Declined / Closed | Red |
| Planning phase | Purple |
| Evidence phase | Teal |
| Draft phase | Orange |
| Readiness phase | Indigo |
| Ready for Issuance | Green (strong) |
| Approved (gate) | Green |
| Returned (gate) | Amber |
| Not Started (gate/milestone) | Grey |
| On Track (milestone) | Green |
| At Risk (milestone) | Amber |
| Overdue (milestone) | Red |
| Complete (milestone) | Green (strong) |
| Standard (sensitivity) | Grey |
| Restricted (sensitivity) | Red |
| Evidence Needed | Red |
| In Review | Amber |
| Sufficient | Green |
| Passed (ref check) | Green |
| Failed (ref check) | Red |
| Waived (ref check) | Grey |

---

## Pattern: Empty States

**When to use:** Lists with no items yet  
**Behavior:** Show a centered illustration + message + primary action button (if user has permission)

**Standard empty state structure:**
```
         [  icon / illustration  ]

         No [items] yet.
         [Brief context sentence.]

         [Primary Action Button]
```

**Examples by screen:**
- Evidence list: "No evidence added yet. Add your first evidence item." + [+ Add Evidence]
- Findings list: "No findings yet. Create findings after uploading evidence." + [+ Add Finding]
- Team: "No team members assigned. Add team members to get started." + [+ Add Team Member]
- Audit trail: "No audit events recorded yet."
- Review queue: "No items awaiting your review." (no action button for empty state)

---

## Pattern: Confirmation Dialogs

**When to use:** Destructive or irreversible actions (gate returns, declines, evidence deletion, team removal)  
**Behavior:**
- Modal overlay, cannot be dismissed by clicking outside (intentional — prevents accidental dismissal)
- Clear title naming the action
- Brief consequence description
- Cancel (left, secondary) and Confirm (right, destructive/primary) buttons
- Confirm button uses the action's label (e.g., "Delete Evidence", "Decline Request") not generic "OK"

---

## Pattern: Review Queue

**When to use:** Review Queue page for AL, QA, IR, PC; also surfaced as a badge count in sidebar navigation  
**Behavior:**
- Shows all items pending the current user's action across all engagements
- Columns: Type (gate/reference check), Engagement ID, Submitted date, Days waiting
- Items ≥3 days old flagged with ⚠ indicator
- Sorted by submitted_at ascending (oldest first) by default
- Clicking any row opens the review page directly

**Sidebar badge:**
```
Review Queue  [3]   ← badge shows count of pending items for this role
```

---

## Pattern: Sensitive Data Handling (Restricted Evidence)

**When to use:** Any page that can display evidence items  
**Behavior:**
- Restricted evidence items are not returned in API responses for AL and RO users
- Restricted items do not appear as empty rows — they are fully absent
- If a user navigates directly to a restricted evidence URL, they receive HTTP 403 and a friendly "Not authorized" page
- Evidence lists show a count only for items the user can see; no indication of hidden items

---
# Responsive Considerations (EMS)

---

## Breakpoints

| Breakpoint | Width | Layout Mode |
|------------|-------|-------------|
| Desktop | > 1024px | Full sidebar + content area |
| Tablet | 768px – 1024px | Collapsed icon-only sidebar + content area |
| Mobile | < 768px | Hamburger menu overlay + stacked content |

---

## Desktop (> 1024px)

**Sidebar:** 220px fixed left; always visible; full text labels + role badge at bottom  
**Content area:** Fluid, max-width 1280px, centered with 32px horizontal padding  
**Tables:** All columns visible; horizontal scroll not needed at standard engagement scale  
**Forms:** Two-column layout for short fields (e.g., date + type side-by-side); single-column for long text areas  
**Modals:** Centered, max-width 600px, backdrop blur  
**Gate status cards:** Horizontal row of 4 cards (A1, P2, P3, P4) across the top of the engagement shell  

```
┌────────────────────────────────────────────────────────────────────┐
│ [A1: Approved ✓]  [P2: Approved ✓]  [P3: In Progress]  [P4: —]    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Tablet (768px – 1024px)

**Sidebar:** Collapses to 56px icon-only rail; hover/tap reveals full labels in tooltip  
**Content area:** Fluid, 16px horizontal padding  
**Tables:** Horizontal scroll enabled; priority columns (ID, Status, Phase) pinned left; secondary columns (Owner, Due Date) scroll off-screen to right  
**Forms:** Single-column layout for all fields  
**Modals:** Full-width with 16px margins  
**Gate status cards:** Wrap to 2×2 grid  

```
┌─────────────────────────────────────────┐
│ [A1: Approved ✓]  [P2: Approved ✓]     │
│ [P3: In Progress] [P4: —]              │
└─────────────────────────────────────────┘
```

**Navigation:**
```
[≡]  Dashboard  Requests  Engagements  Queue  Reports
  ↑ icon-only rail (56px) — tap to expand
```

---

## Mobile (< 768px)

**Navigation:** Hamburger (≡) button in top bar opens full overlay menu; menu closes on item tap or ✕  
**Content area:** 100% width, 12px horizontal padding  
**Tables (Portfolio Dashboard list):**  
- Column priority order: Engagement ID, Title, Phase, Status — other columns collapsed into expandable detail row
- Each row expands on tap to show: Owner, Risk Level, Next Milestone, Gate Status  
**Forms:** Single-column; date pickers use native mobile date input  
**Gate status cards:** Vertically stacked, full-width, collapsible  
**File upload:** Uses native file picker; drag-drop disabled (no desktop drag support)  
**Modals / panels:** Full-screen takeover with back arrow instead of modal overlay  
**Review comments:** Collapsed by default; "Show Comments (3)" tap to expand  

```
┌──────────────────────────────┐
│ [≡ EMS]           [🔍][User] │
├──────────────────────────────┤
│                              │
│  ENG-2026-00001              │
│  Budget Review   [Planning]  │
│                              │
│  ▼ (tap to expand)          │
│  Owner: Diana Okafor         │
│  Risk: Medium                │
│  Next: P2 — Feb 2            │
│  A1 ✓ P2 ○ P3 ○ P4 ○       │
└──────────────────────────────┘
```

---

## Priority Rules for Responsive Degradation

When screen space is reduced, the following elements take priority in this order:

1. **Action controls** — Gate decision buttons, submit buttons, primary CTAs always visible without scroll
2. **Status indicators** — Phase, gate status, blocker badges always visible
3. **Required field errors** — Inline validation never hidden by layout
4. **Secondary metadata** — Portfolio, custodian, audit timestamps can collapse/hide
5. **Column data in tables** — Non-critical columns hide at smaller breakpoints

---

## Touch Targets

All interactive elements must meet a minimum 44×44px touch target on mobile and tablet (per WCAG 2.5.5 Target Size guideline). This applies to:
- Navigation items
- Table row actions (Edit, Delete, View)
- Radio buttons and checkboxes (expanded tap area)
- Form submit and cancel buttons
- Badge/status dropdowns

---

## Sidebar Navigation Responsive Behavior

```
Desktop                Tablet                 Mobile
┌────────┐             ┌──┐                   ┌──────────────────────┐
│ NAV    │             │  │                   │  [≡ EMS]          [✕]│
│ Dash   │             │🏠│                   │  Dashboard           │
│ Request│             │📋│                   │  Requests            │
│ Engage │ ──────────▶ │🏢│ ──────────────▶   │  Engagements         │
│ Review │             │📥│                   │  Review Queue    [3] │
│ Reports│             │📊│                   │  Reports             │
│ [Role] │             │  │                   │  [Logout]            │
└────────┘             └──┘                   └──────────────────────┘
220px fixed          56px icons             Full-screen overlay
```

---
# Accessibility Notes (EMS)

---

## Standards Target

WCAG 2.1 Level AA compliance. The system is a governance tool used by professional staff; AA is appropriate and sufficient.

---

## Color and Contrast

| Requirement | Implementation |
|-------------|----------------|
| Minimum 4.5:1 contrast ratio for normal text | All text on white/light backgrounds must meet this threshold |
| Minimum 3:1 contrast for large text (18pt+) | Section headings and status badge text |
| Status communication must not rely on color alone | Every status badge includes text label (not color-only dots) |
| Error states | Red border + red icon + error text (not border color alone) |
| Success states | Green border + ✓ icon + description text |
| Required field indicators | Asterisk (*) + "Required" in ARIA label |

**Status badge example (color + text always paired):**
```
[● Approved]   not just  [●]
[🔴 Evidence Needed]   not just a red dot
```

---

## Keyboard Navigation

All interactive elements must be operable with keyboard only:

| Element | Keyboard Behavior |
|---------|------------------|
| Navigation sidebar | Tab through items; Enter to navigate; focus ring visible |
| Dropdown menus | Enter/Space to open; arrow keys to navigate options; Escape to close |
| Modals | Focus trapped inside modal when open; Escape closes modal; focus returns to trigger element |
| Tables | Tab navigates cells; row actions accessible via keyboard |
| File upload | Enter on "Choose File" button opens native file picker |
| Date pickers | Standard keyboard input (YYYY-MM-DD); native date input on mobile |
| Form submission | Enter in last field or Tab to submit button; button is focusable |
| Gate decision buttons | Tab to button; focus ring visible; disabled buttons excluded from tab order |
| Accordion / expand rows | Enter/Space to toggle expand; arrow keys for next/previous |

**Focus ring:** Never suppressed (no `outline: none` without replacement). Use a clearly visible 2px solid focus indicator with sufficient contrast.

---

## Screen Reader Considerations

### Page Structure

- Each page has a single `<h1>` matching the breadcrumb page title
- Section headings use `<h2>` / `<h3>` hierarchy (not styled `<div>` elements)
- Landmark regions: `<nav>`, `<main>`, `<aside>` (for side panels), `<footer>`
- Skip navigation link at top of every page: "Skip to main content"

### Forms

- All form labels use `<label>` with `for` attribute pointing to input `id`
- Required fields: `aria-required="true"` on input + asterisk (*) in label
- Error messages: `aria-describedby` linking input to its error message element; `aria-invalid="true"` on invalid inputs
- Fieldsets with `<legend>` for grouped inputs (radio buttons for gate outcomes, objective selectors)

### Status and Live Regions

- Gate prerequisite checklist: `role="status"` or `aria-live="polite"` so updates are announced when prerequisites change
- Toast notifications: `role="alert"` with `aria-live="assertive"` for errors; `aria-live="polite"` for success toasts
- File upload progress: `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Loading states: `aria-busy="true"` on the container while loading

### Tables

- Evidence list, portfolio dashboard list, audit trail, reference check queue: use `<table>` with proper `<th scope="col">` headers
- Row-level actions use `aria-label` including the row identifier (e.g., "Edit evidence item E-001")
- Sortable columns use `aria-sort="ascending"` / `aria-sort="descending"`

### Buttons and Icons

- Icon-only buttons (close ✕, remove ×, download ↓): `aria-label` describing the action and target (e.g., `aria-label="Remove team member Priya Nair"`)
- Disabled buttons: `disabled` attribute (not just visual styling) so screen readers skip them; add `aria-disabled="true"` for informational context when needed
- "Approve P4" when disabled: tooltip or `aria-describedby` pointing to text "Resolve failing prerequisites to enable approval"

### Navigation

- Active navigation item: `aria-current="page"` on the active `<a>` element
- Review Queue badge count: `aria-label="Review Queue, 3 items pending"` on the nav item
- Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>` structure; current page has `aria-current="page"`

---

## ARIA Labels Reference (Key Elements)

| Element | ARIA Pattern |
|---------|-------------|
| Main navigation | `<nav aria-label="Main navigation">` |
| Breadcrumb | `<nav aria-label="Breadcrumb">` |
| Gate status cards section | `<section aria-label="Gate status">` |
| Prerequisite checklist | `<ul role="list" aria-label="P2 prerequisites checklist">` |
| Evidence list table | `<table aria-label="Evidence items for ENG-2026-00001">` |
| File upload drop zone | `role="region" aria-label="File upload area"` |
| Toast container | `role="alert" aria-live="polite"` |
| Progress bar | `role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Reference check progress"` |
| Status badge | `<span aria-label="Status: Approved">` |
| Comment thread | `<section aria-label="Review comments" aria-live="polite">` |

---

## Form Accessibility Patterns

### Required Field with Error State
```html
<label for="rationale">
  Decision Rationale <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<textarea
  id="rationale"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="rationale-error"
></textarea>
<p id="rationale-error" role="alert">
  Rationale must be at least 10 characters.
</p>
```

### Gate Decision Radio Group
```html
<fieldset>
  <legend>Outcome</legend>
  <label><input type="radio" name="outcome" value="ready_for_issuance"> Ready for Issuance</label>
  <label><input type="radio" name="outcome" value="closed"> Closed</label>
</fieldset>
```

---

## Restricted Evidence Accessibility

- Restricted evidence items are fully absent from the DOM for unauthorized users (not hidden with CSS)
- No "X items hidden" count is shown to AL/RO — absence is silent and intentional
- Evidence detail pages for restricted items return a 403 page with a readable error message: "You are not authorized to view this evidence item."

---

## Motion and Animation

- No essential information is conveyed through animation alone
- Progress bar updates are also announced via `aria-valuenow` changes
- Transitions (slide-in panel, modal appear) use `prefers-reduced-motion` media query to disable animation for users who have requested reduced motion
- Toast auto-dismiss timer is paused when user has focus on the toast

---

## Testing Checklist

Before release, each screen should be verified with:
- [ ] Keyboard-only navigation (no mouse)
- [ ] Screen reader (NVDA + Firefox, VoiceOver + Safari)
- [ ] Browser zoom to 200% — no content clipped or lost
- [ ] Contrast checker on all text elements (4.5:1 minimum)
- [ ] Color-blind simulation (protanopia, deuteranopia) — status still distinguishable by text
- [ ] Mobile tap target size ≥ 44×44px on all interactive elements

---
