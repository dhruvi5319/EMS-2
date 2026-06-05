# Requirements Traceability Matrix (RTM)
## Lightweight Engagement Management System (EMS)

**Project Acronym:** EMS
**Version:** 1.0
**Date:** 2026-06-05
**Status:** Active
**Source Documents:** PRD-EMS.md v1.0, FRD-EMS.md v1.0, TechArch-EMS.md v1.0, UserStories-EMS.md v1.0

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all Lightweight Engagement Management System (EMS) specification documents. It ensures every product requirement defined in the PRD is implemented through functional specifications in the FRD, realized by technical components in the TechArch, and validated through user stories and acceptance tests. The matrix covers all 18 features (F0–F17) spanning the complete engagement lifecycle from request intake through Gate A1 acceptance, Gate P2 planning approval, Gate P3 evidence sufficiency, and Gate P4 final readiness.

Traceability is maintained at four levels. The first level links PRD product features (F0–F17) to their governing intent, priority, and gate association. The second level maps each PRD feature to its corresponding FRD functional specifications (F00–F17 sub-features), which define inputs, outputs, validation rules, error handling, and API contracts. The third level connects FRD specifications to TechArch technical components — backend modules, database tables, REST API endpoints, and frontend pages. The fourth level traces each requirement to the user stories (US-0.1–US-17.5) and acceptance test cases (AT-A1-01 through AT-DASH-07) that validate correct behavior.

This document is maintained alongside all spec documents and should be updated whenever a requirement, technical design, or user story changes. All IDs used in this matrix are extracted directly from the source documents and reflect the exact naming conventions used therein.

---

## 2. Requirements Summary

### 2.1 PRD Features by Category

**Platform Infrastructure (P0 — Critical)**
- **F0:** Basic Application Shell — authenticated web app with login/logout, navigation, search, role assignment, and audit trail view
- **F1:** Core Data Objects — ten persistent entities (Request, Engagement, Team Assignment, Planning Record, Objective, Evidence Item, Finding, Draft Product, Gate Decision, Audit Event)

**Intake and Acceptance (P0 — Critical)**
- **F2:** Request Intake — create/edit request records with intake document upload; Draft or Submitted status
- **F3:** Acceptance Decision (Gate A1) — approve or decline submitted requests; auto-create engagement on approval

**Engagement Setup and Planning (P0 — Critical)**
- **F4:** Engagement Shell — central page for engagement metadata, gate status cards, open blockers, linked artifacts
- **F5:** Team and Milestones — assign roles, set milestone target dates, view computed milestone status
- **F6:** Lightweight Planning Record — objectives, design approach, risk notes, data reliability notes, independence affirmations
- **F7:** Planning Approval (Gate P2) — QA Reviewer approves/returns planning baseline; locks planning record

**Evidence and Findings (P0 — Critical)**
- **F8:** Evidence Registry — upload evidence items with type, source, date, sensitivity flag
- **F9:** Evidence-to-Objective Link — link evidence to objectives, gap view, CSV export
- **F10:** Findings and Sufficiency (Gate P3) — create findings, link to evidence, mark objective sufficiency, QA P3 approval

**Draft Product and Final Readiness (P0 — Critical)**
- **F11:** Draft Product Record — create/track draft with title, version, owner, status, attachments, review comments
- **F12:** Basic Indexing and Reference Check — link statements to evidence, mark reference status, assign discrepancies, waivers
- **F13:** Final Readiness (Gate P4) — readiness checklist, require all checks Passed/Waived, record final approver, set engagement to Ready for Issuance or Closed

**Dashboards and Reporting (P1 — High)**
- **F14:** Portfolio Dashboard — counts by phase/status, filters, list view, CSV export
- **F15:** Engagement Detail Dashboard — phase/status summary, gate status cards, milestone list, evidence/reference progress, open blockers

**User-Centered Design (P1 — High)**
- **F16:** Persona and Journey Artifacts — seven personas (PER-01–PER-07), five primary journeys (J1–J5), gate scenario mapping
- **F17:** Basic Acceptance Test Generation — acceptance tests for A1, P2, P3, P4, dashboard, and CSV export

### 2.2 User Personas

| ID | Name | Role Code | Primary Features |
|----|------|-----------|-----------------|
| PER-01 | Marcus Reid | AL | F2, F3 |
| PER-02 | Diana Okafor | EM | F4, F5, F6, F11, F12, F13 |
| PER-03 | Priya Nair | AN | F6, F8, F9, F10, F11, F12 |
| PER-04 | James Whitfield | QA | F7, F9, F10, F15 |
| PER-05 | Carla Voss | IR | F12 |
| PER-06 | Tom Andrade | PC | F12, F13 |
| PER-07 | Sandra Wu | RO | F2, F14, F15 |

### 2.3 Gate Summary

| Gate | Feature | Approving Role | Key Prerequisite | Outcome |
|------|---------|----------------|-----------------|---------|
| A1 | F3 | AL (PER-01) | Request status = Submitted; all required fields present | Creates Engagement Shell |
| P2 | F7 | QA (PER-04) | A1 approved; ≥1 objective; EM + QA on team; milestones set; risk/data reliability notes set | Locks Planning Baseline; phase → evidence |
| P3 | F10 | QA (PER-04) | P2 approved; all objectives have ≥1 linked evidence; no objective = evidence_needed; all findings linked | phase → draft |
| P4 | F13 | EM or PC (PER-02/PER-06) | P3 approved; all reference checks Passed or Waived; no open blockers | status → ready_for_issuance or closed |

### 2.4 User Stories Summary

**Total: 79 user stories across 18 epics (F0–F17)**
- P0 (Critical): 59 stories covering F0–F13
- P1 (High): 20 stories covering F14–F17

---

## 3. Traceability Matrix

### 3.1 PRD → FRD → TechArch → UserStories

| PRD Feature | PRD Priority | FRD Specifications | TechArch Components | User Stories |
|-------------|-------------|-------------------|--------------------|----|
| **F0: Basic Application Shell** | P0 | F00.1 Login/Logout<br>F00.2 User Role Assignment<br>F00.3 Main Navigation<br>F00.4 Global Search<br>F00.5 Audit Trail View | `auth` module<br>`users` module<br>`audit` module<br>`LoginPage`, `AppShell`, `NavigationRail`, `AuditTrailPage`, `AdminPage`<br>Tables: `users`, `user_roles`, `sessions`, `login_attempts`, `audit_events`<br>API: `POST /auth/login`, `POST /auth/logout`, `GET /users`, `PUT /users/{id}/roles` | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5, US-0.6 |
| **F1: Core Data Objects** | P0 | F01.1 Request Entity<br>F01.2 Engagement Entity<br>F01.3 Team Assignment Entity<br>F01.4 Planning Record Entity<br>F01.5 Objective Entity<br>F01.6 Evidence Item Entity<br>F01.7 Finding Entity<br>F01.8 Draft Product Entity<br>F01.9 Gate Decision Entity<br>F01.10 Audit Event Entity | All 20 database tables in PostgreSQL DDL<br>ORM/Repository layer for each entity<br>Soft-delete for `objectives`, `evidence_items`, `evidence_files`, `findings`<br>Immutable: `gate_decisions`, `audit_events`, `draft_comments`<br>JSONB snapshots: `planning_revisions`, `audit_events` | US-1.1, US-1.2 |
| **F2: Request Intake** | P0 | F02.1 Create Request (Draft)<br>F02.2 Edit Request<br>F02.3 Submit Request<br>F02.4 Upload Intake Document<br>F02.5 View Request Detail | `requests` module<br>`RequestsPage`, `RequestDetailPage`<br>Table: `requests`<br>File: `requests/{request_id}/{filename}`<br>API: `POST /requests`, `PATCH /requests/{id}`, `POST /requests/{id}/submit`, `POST /requests/{id}/document` | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5 |
| **F3: Acceptance Decision — Gate A1** | P0 | F03.1 Review Submitted Request<br>F03.2 Approve Request (Gate A1 Pass)<br>F03.3 Decline Request (Gate A1 Fail)<br>F03.4 Auto-Create Engagement Shell<br>F03.5 A1 Gate Decision Visibility | `gates` module (GatesService, GatePrerequisiteValidator)<br>`GateStatusCard`, `GateDecisionForm`<br>Tables: `gate_decisions`, `engagements`<br>API: `POST /engagements/{id}/gates/a1/approve`, `POST /engagements/{id}/gates/a1/decline` | US-3.1, US-3.2, US-3.3, US-3.4 |
| **F4: Engagement Shell** | P0 | F04.1 View Engagement Shell<br>F04.2 Edit Engagement Metadata<br>F04.3 Display Gate Status Summary<br>F04.4 Display Open Blockers<br>F04.5 Navigate to Linked Artifacts | `engagements` module (BlockerComputer)<br>`EngagementShellPage`, `GateStatusCard`, `BlockersPanel`<br>Table: `engagements`<br>API: `GET /engagements/{id}`, `PATCH /engagements/{id}`, `GET /engagements/{id}/blockers` | US-4.1, US-4.2, US-4.3, US-4.4 |
| **F5: Team and Milestones** | P0 | F05.1 Assign Team Members<br>F05.2 Remove Team Members<br>F05.3 Set Milestone Dates<br>F05.4 View Milestone Status | `team` module<br>`TeamPage`, `MilestoneTimeline`<br>Tables: `team_assignments`, `milestones`<br>API: `POST /engagements/{id}/team`, `DELETE /engagements/{id}/team/{assignment_id}`, `PUT /engagements/{id}/milestones` | US-5.1, US-5.2, US-5.3, US-5.4 |
| **F6: Lightweight Planning Record** | P0 | F06.1 Create Planning Record<br>F06.2 Add and Manage Objectives<br>F06.3 Complete Planning Sections<br>F06.4 Submit Planning Record for Review<br>F06.5 Edit Approved Planning Record (Post-P2) | `planning` module<br>`PlanningPage`, `ObjectivesList`, `PlanningForm`<br>Tables: `planning_records`, `objectives`, `planning_revisions`<br>API: `POST /engagements/{id}/planning`, `PATCH /engagements/{id}/planning`, `POST /engagements/{id}/planning/submit`, `POST /engagements/{id}/planning/objectives` | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5 |
| **F7: Planning Approval — Gate P2** | P0 | F07.1 Review Planning Record for P2<br>F07.2 Approve Planning Baseline (Gate P2 Pass)<br>F07.3 Return Planning Record for Revision<br>F07.4 P2 Gate Decision Visibility | `gates` module (P2 prerequisite validation)<br>`ReviewQueuePage`, `GateDecisionForm`, `GatePage`<br>Tables: `gate_decisions`, `planning_records`<br>API: `POST /engagements/{id}/gates/p2/approve`, `POST /engagements/{id}/gates/p2/return` | US-7.1, US-7.2, US-7.3, US-7.4 |
| **F8: Evidence Registry** | P0 | F08.1 Create Evidence Record<br>F08.2 Upload Evidence Files<br>F08.3 Edit Evidence Record<br>F08.4 View Evidence List<br>F08.5 Download Evidence Files<br>F08.6 Delete Evidence Record | `evidence` module<br>`EvidencePage`, `EvidenceTable`, `EvidenceForm`, `FileUploader`<br>Tables: `evidence_items`, `evidence_files`<br>File: `evidence/{engagement_id}/{evidence_id}/{filename}`<br>API: `POST /engagements/{id}/evidence`, `POST /engagements/{id}/evidence/{ev_id}/files`, `GET /engagements/{id}/evidence/{ev_id}/files/{file_id}` | US-8.1, US-8.2, US-8.3, US-8.4, US-8.5 |
| **F9: Evidence-to-Objective Link** | P0 | F09.1 Link Evidence to Objectives<br>F09.2 Unlink Evidence from Objectives<br>F09.3 View Linked Evidence Per Objective<br>F09.4 Gap View (Objectives Without Evidence)<br>F09.5 Export Evidence Registry to CSV | `evidence` module (objective-evidence links)<br>`EvidencePage` (gap view toggle)<br>Table: `objective_evidence_links`<br>API: `POST /engagements/{id}/evidence/{ev_id}/objectives`, `DELETE /engagements/{id}/evidence/{ev_id}/objectives/{obj_id}`, `GET /engagements/{id}/evidence` (CSV via `Accept: text/csv`) | US-9.1, US-9.2, US-9.3, US-9.4 |
| **F10: Findings and Sufficiency — Gate P3** | P0 | F10.1 Create Finding Record<br>F10.2 Link Finding to Evidence<br>F10.3 Mark Objective Evidence Status<br>F10.4 Approve Evidence Sufficiency (Gate P3) | `findings` module<br>`FindingsPage`<br>Tables: `findings`, `finding_evidence_links`<br>API: `POST /engagements/{id}/findings`, `POST /engagements/{id}/findings/{fid}/evidence`, `PATCH /engagements/{id}/planning/objectives/{obj_id}`, `POST /engagements/{id}/gates/p3/approve` | US-10.1, US-10.2, US-10.3, US-10.4 |
| **F11: Draft Product Record** | P0 | F11.1 Create Draft Product Record<br>F11.2 Attach Draft File<br>F11.3 Record Review Comments<br>F11.4 Advance Draft Status Through Review Stages | `draft` module<br>`DraftPage`<br>Tables: `draft_products`, `draft_comments`<br>API: `POST /engagements/{id}/draft`, `POST /engagements/{id}/draft/file`, `POST /engagements/{id}/draft/comments`, `PATCH /engagements/{id}/draft/status` | US-11.1, US-11.2, US-11.3, US-11.4 |
| **F12: Basic Indexing and Reference Check** | P0 | F12.1 Create Draft Statements (Indexing)<br>F12.2 Link Statements to Evidence<br>F12.3 Assign Statement for Reference Check<br>F12.4 Perform Reference Check (Pass/Fail)<br>F12.5 Assign Failed Statement Back to Analyst<br>F12.6 Waive Reference Check<br>F12.7 View Reference Check Progress | `statements` module<br>`DraftPage`, `StatementsTable`, `ReferenceStatusBadge`, `ReviewQueuePage`<br>Tables: `draft_statements`, `statement_evidence_links`<br>API: `POST /engagements/{id}/draft/statements`, `POST /engagements/{id}/draft/statements/{sid}/evidence`, `PATCH /engagements/{id}/draft/statements/{sid}/assign`, `PATCH /engagements/{id}/draft/statements/{sid}/reference-status`, `POST /engagements/{id}/draft/statements/{sid}/waive` | US-12.1, US-12.2, US-12.3, US-12.4, US-12.5, US-12.6, US-12.7 |
| **F13: Final Readiness — Gate P4** | P0 | F13.1 View Final Readiness Checklist<br>F13.2 Approve Final Readiness (Gate P4 Pass)<br>F13.3 Close Engagement Without Issuance<br>F13.4 P4 Gate Decision Visibility | `gates` module (P4 prerequisite validation)<br>`GatePage`, `GateDecisionForm`, `GateStatusCard`<br>Table: `gate_decisions`<br>API: `POST /engagements/{id}/gates/p4/approve`, `GET /engagements/{id}/gates` | US-13.1, US-13.2, US-13.3, US-13.4 |
| **F14: Portfolio Dashboard** | P1 | F14.1 Portfolio Count Cards<br>F14.2 Filter Engagement List<br>F14.3 Engagement List View<br>F14.4 Export Engagement Register (CSV) | `dashboard` module (DashboardService aggregate queries)<br>`DashboardPage`, `CountCard`, `DataTable`, `CsvExportButton`<br>API: `GET /dashboard/portfolio`, `GET /engagements` (CSV via `Accept: text/csv`) | US-14.1, US-14.2, US-14.3, US-14.4 |
| **F15: Engagement Detail Dashboard** | P1 | F15.1 Phase/Status Summary<br>F15.2 Gate Status Cards<br>F15.3 Milestone Timeline<br>F15.4 Evidence and Objective Progress Metrics<br>F15.5 Reference Check Completion Metrics<br>F15.6 Open Blockers Panel | `dashboard` module<br>`EngagementDashboard`, `GateStatusCard`, `MilestoneTimeline`, `BlockersPanel`, `CountCard`<br>API: `GET /dashboard/engagement/{id}` | US-15.1, US-15.2, US-15.3, US-15.4, US-15.5, US-15.6 |
| **F16: Persona and Journey Artifacts** | P1 | F16.1 Target Persona Definitions (PER-01–PER-07)<br>F16.2 Five Primary User Journeys (J1–J5)<br>F16.3 Gate Scenario Mapping (S-A1-APPROVE, S-A1-DECLINE, S-P2-APPROVE, S-P2-RETURN, S-P3-APPROVE, S-P4-APPROVE) | Design-time artifacts referenced in all spec documents<br>Feature-to-persona mapping embedded in PRD §2.2 and FRD header | US-16.1, US-16.2, US-16.3 |
| **F17: Basic Acceptance Test Generation** | P1 | F17.1 A1 Gate Acceptance Tests (AT-A1-01–AT-A1-08)<br>F17.2 P2 Gate Acceptance Tests (AT-P2-01–AT-P2-08)<br>F17.3 P3 Gate Acceptance Tests (AT-P3-01–AT-P3-08)<br>F17.4 P4 Gate Acceptance Tests (AT-P4-01–AT-P4-09)<br>F17.5 Dashboard and Export Tests (AT-DASH-01–AT-DASH-07) | All modules — tests validate end-to-end journeys<br>Derived from user stories US-3.1–US-3.4 (A1), US-7.1–US-7.4 (P2), US-10.1–US-10.4 (P3), US-13.1–US-13.4 (P4) | US-17.1, US-17.2, US-17.3, US-17.4, US-17.5 |

---

## 4. Requirements Detail

### 4.1 Platform Infrastructure

#### F0: Basic Application Shell

| Sub-Feature | FRD Specification | Roles | Audit Events |
|-------------|-------------------|-------|--------------|
| F00.1 Login/Logout | Login with email/password; session creation; 5-failure lockout (15 min); logout destroys session | All roles | `LOGIN_SUCCESS`, `LOGIN_FAILED`, `ACCOUNT_LOCKED`, `LOGOUT` |
| F00.2 User Role Assignment | Admin assigns roles from `AL, EM, AN, QA, IR, PC, RO, AD` | AD only | `USER_ROLE_ASSIGNED` |
| F00.3 Main Navigation | Role-filtered nav: Dashboard, Requests, Engagements, Evidence, Review Queue, Reports | All roles | — |
| F00.4 Global Search | Search by engagement ID, title, requester, phase, owner; ≥2 chars; max 50 results; scoped by auth | All roles | — |
| F00.5 Audit Trail View | Reverse-chronological events per engagement; filter by action type and date range | All engagement team roles; AD for all | — |

**Key Validations:** Username must be valid email; ≥1 role required; search query ≥2 characters; hidden sections return HTTP 403 on direct access.

---

#### F1: Core Data Objects

| Entity | Table | Key Constraints | Mutability |
|--------|-------|-----------------|------------|
| Request | `requests` | status ∈ {draft, submitted, accepted, declined} | Hard update/delete while draft |
| Engagement | `engagements` | Unique job_code; phase ∈ {intake, planning, evidence, draft, readiness, closed} | Hard update; status transitions gate-controlled |
| Team Assignment | `team_assignments` | Unique (engagement_id, user_id, role) | Soft-delete (removed_at) |
| Planning Record | `planning_records` | One per engagement (UNIQUE) | Hard update; locked post-P2 (revision note required) |
| Objective | `objectives` | Linked to planning_record; deletion blocked if evidence linked | Soft-delete (deleted_at) |
| Evidence Item | `evidence_items` | sensitivity ∈ {standard, restricted}; deletion blocked if linked | Soft-delete (deleted_at) |
| Finding | `findings` | status ∈ {draft, under_review, accepted, rejected}; deletion blocked if referenced | Soft-delete (deleted_at) |
| Draft Product | `draft_products` | One per engagement (UNIQUE); status ∈ {drafting, under_review, ready_for_reference_check, ready_for_final_review} | Hard update |
| Gate Decision | `gate_decisions` | gate_type ∈ {A1, P2, P3, P4}; most recent = current status | Immutable (no UPDATE/DELETE) |
| Audit Event | `audit_events` | JSONB before/after snapshots; occurrence timestamp | Immutable (no UPDATE/DELETE) |

---

### 4.2 Intake and Acceptance

#### F2: Request Intake

| Sub-Feature | Key Inputs | Validation Rules | Error Codes |
|-------------|-----------|-----------------|-------------|
| F02.1 Create Request | request_type (required for draft) | Only `request_type` required at draft save | `VALIDATION_ERROR` (422) |
| F02.2 Edit Request | Any draft fields | Blocked if status ≠ draft | `REQUEST_NOT_EDITABLE` (409) |
| F02.3 Submit Request | requester, topic, agency_program, due_date | All required fields; past dates warned but not blocked | `VALIDATION_ERROR` (422), `REQUEST_ALREADY_SUBMITTED` (409) |
| F02.4 Upload Intake Document | File ≤25 MB; PDF/DOCX/DOC/XLSX/XLS/TXT/PNG/JPG/JPEG | One file per request; type and size checked | `FILE_TYPE_NOT_ALLOWED` (422), `FILE_TOO_LARGE` (422) |
| F02.5 View Request Detail | — | AL, EM, AD, RO only | `FORBIDDEN` (403) |

---

#### F3: Acceptance Decision — Gate A1

| Sub-Feature | Key Inputs | Prerequisite Rules | Audit Event |
|-------------|-----------|-------------------|-------------|
| F03.1 Review Submitted Request | — | status = submitted; A1 controls hidden if not submitted | — |
| F03.2 Approve (Gate A1 Pass) | risk_level (low/medium/high), rationale (≥10 chars) | All request fields present; request.status = submitted | `GATE_A1_APPROVED` |
| F03.3 Decline (Gate A1 Fail) | rationale (≥10 chars) | request.status = submitted | `GATE_A1_DECLINED` |
| F03.4 Auto-Create Engagement Shell | — | Triggered by A1 approval; job_code = ENG-{YYYY}-{5-digit-seq} | — |
| F03.5 A1 Decision Visibility | — | Visible on request detail, engagement shell, portfolio dashboard, audit trail | — |

**Error Codes:** `GATE_PREREQUISITE_FAILED` (409), `GATE_FIELDS_INCOMPLETE` (422), `GATE_ALREADY_DECIDED` (409), `FORBIDDEN` (403).

---

### 4.3 Engagement Setup and Planning

#### F4: Engagement Shell

| Sub-Feature | Displayed/Editable Fields | Roles | Notes |
|-------------|--------------------------|-------|-------|
| F04.1 View Shell | job_code, title, phase, status, risk_level, owner, portfolio, gate status cards, blockers, artifact counts | All engagement team roles; AD; RO | HTTP 403 if not authorized |
| F04.2 Edit Metadata | title, phase (revision note req.), status (active/on_hold only), risk_level, owner_id, portfolio | EM, AD | Gate-controlled statuses cannot be manually set |
| F04.3 Gate Status Summary | A1/P2/P3/P4 status, approver, date, rationale preview; "Not Started" if undecided | All | History accessible via "View History" |
| F04.4 Open Blockers | Dynamically computed: planning not approved, evidence gaps, finding no evidence, failed refs, P3 not approved | All | "No open blockers" shown when empty |
| F04.5 Navigate to Artifacts | Team, Planning Record, Evidence, Findings, Draft Product, Gate History, Audit Trail | All | One-click navigation |

---

#### F5: Team and Milestones

| Sub-Feature | Key Rules | Error Codes |
|-------------|----------|-------------|
| F05.1 Assign Team Members | Roles: AL/EM/AN/QA/IR/PC/RO; no duplicate user-role per engagement; user must be active | `ASSIGNMENT_DUPLICATE` (409), `VALIDATION_ERROR` (422) |
| F05.2 Remove Team Members | Cannot remove last EM; cannot remove QA before P2 approved | `TEAM_MIN_VIOLATED` (409), `TEAM_ROLE_REQUIRED` (409) |
| F05.3 Set Milestone Dates | Four milestones: planning_approval_target, evidence_readiness_target, draft_readiness_target, final_readiness_target; chronological order required | `VALIDATION_ERROR` (422) |
| F05.4 View Milestone Status | Computed: not_started, on_track (future), at_risk (≤7 days), complete (gate approved), overdue (past + gate not approved) | — |

---

#### F6: Lightweight Planning Record

| Sub-Feature | Required for Submit | Optional |
|-------------|--------------------|----|
| F06.1 Create Planning Record | One per engagement; engagement must be active | — |
| F06.2 Add/Manage Objectives | objective_text (required); ≥1 objective required for P2 submit | information_need, sort_order |
| F06.3 Complete Planning Sections | risk_notes, data_reliability_notes, independence_status (affirmed/pending/exception_noted) | design_approach, schedule_notes |
| F06.4 Submit for P2 Review | ≥1 objective, risk_notes, data_reliability_notes, independence_status, owner assigned, ≥1 QA on team, ≥1 milestone date | — |
| F06.5 Edit Approved Record (Post-P2) | revision_note (≥10 chars); creates PlanningRevision record with before/after JSONB snapshot | — |

**Error Codes:** `OBJECTIVE_HAS_EVIDENCE` (409), `P2_PREREQUISITE_FAILED` (422).

---

#### F7: Planning Approval — Gate P2

| Sub-Feature | Roles | Key Validations | Audit Event |
|-------------|-------|----------------|-------------|
| F07.1 Review Planning Record | QA | planning_record.status = ready_for_review; P2 checklist displayed | — |
| F07.2 Approve (Gate P2 Pass) | QA only | All prerequisites pass server-side; rationale ≥10 chars; sets planning_record.status=approved, engagement.phase=evidence | `GATE_P2_APPROVED` |
| F07.3 Return for Revision | QA only | return comments ≥10 chars; sets planning_record.status=returned | `GATE_P2_RETURNED` |
| F07.4 P2 Decision Visibility | All engagement team | P2 status on engagement shell; locked baseline viewable read-only | — |

**P2 Prerequisites (server-side):** ≥1 objective, risk_notes non-empty, data_reliability_notes non-empty, independence_status set, owner assigned, ≥1 EM on team, ≥1 milestone date set.

---

### 4.4 Evidence and Findings

#### F8: Evidence Registry

| Sub-Feature | Key Inputs | File Constraints | Sensitivity |
|-------------|-----------|-----------------|-------------|
| F08.1 Create Evidence Record | evidence_type, source (required), date_received, sensitivity | — | Roles: AN, AD |
| F08.2 Upload Evidence Files | Files attached to evidence item | ≤50 MB per file; ≤20 files per item; PDF/DOCX/DOC/XLSX/XLS/CSV/TXT/PNG/JPG/JPEG/ZIP | Stored under `evidence/{engagement_id}/{evidence_id}/` |
| F08.3 Edit Evidence Record | Any metadata fields | Same validation as create | Restricted change writes `EVIDENCE_RESTRICTED` audit event |
| F08.4 View Evidence List | — | Filtered by type, sensitivity, date range, linked/unlinked status | Restricted items hidden from AL and RO |
| F08.5 Download Evidence Files | — | Signed/session-authenticated URL | Restricted: AN/EM/QA/IR/PC/AD only |
| F08.6 Delete Evidence Record | — | Blocked if linked to objectives, findings, or statements | Soft-delete; physical cleanup deferred |

---

#### F9: Evidence-to-Objective Link

| Sub-Feature | Roles | Key Rules | Audit Event |
|-------------|-------|----------|-------------|
| F09.1 Link Evidence to Objectives | AN, EM, AD | Same engagement; no duplicates | `EVIDENCE_OBJECTIVE_LINKED` |
| F09.2 Unlink Evidence from Objectives | AN, EM, AD | Hard delete of link record | `EVIDENCE_OBJECTIVE_UNLINKED` |
| F09.3 View Linked Evidence Per Objective | All engagement team | Restricted items hidden from AL/RO | — |
| F09.4 Gap View | All engagement team | Objectives with zero linked evidence; each `evidence_needed` = P3 blocker | — |
| F09.5 Export CSV | AL/EM/AN/QA/PC/RO/AD (IR excluded) | Columns: Evidence ID, Type, Source, Date, Custodian, Description, Sensitivity, Linked Objectives, Files, Uploaded By, Created Date; restricted items excluded for AL/RO | `EVIDENCE_CSV_EXPORTED` |

---

#### F10: Findings and Sufficiency — Gate P3

| Sub-Feature | Roles | Key Rules | Audit Event |
|-------------|-------|----------|-------------|
| F10.1 Create Finding | AN, AD | finding_text required; requires P2 approved (phase = evidence or later) | `FINDING_CREATED` |
| F10.2 Link Finding to Evidence | AN | ≥1 evidence link required before P3 can pass; same engagement | `FINDING_EVIDENCE_LINKED` |
| F10.3 Mark Objective Evidence Status | QA, EM, AD | Cannot mark in_review/sufficient with zero linked evidence | `OBJECTIVE_STATUS_UPDATED` |
| F10.4 Approve P3 | QA only | All objectives sufficient + ≥1 evidence link; all findings ≥1 evidence link; P2 must be approved; sets engagement.phase=draft | `GATE_P3_APPROVED` |

**P3 Blockers:** Any objective with status=evidence_needed; any objective with zero linked evidence; any finding with zero evidence links.

---

### 4.5 Draft Product and Final Readiness

#### F11: Draft Product Record

| Sub-Feature | Key Inputs | Status Transitions | Audit Event |
|-------------|-----------|-------------------|-------------|
| F11.1 Create Draft Product | title, version, owner_id (active, assigned to engagement); requires P3 approved; one per engagement | Created as `drafting` | `DRAFT_PRODUCT_CREATED` |
| F11.2 Attach Draft File | File ≤50 MB; PDF/DOCX/DOC/XLSX/XLS/TXT/ZIP; one file per record (replacing allowed) | — | `DRAFT_FILE_ATTACHED` |
| F11.3 Record Review Comments | comment_text (non-empty); append-only; includes timestamp + reviewer name | — | `DRAFT_COMMENT_ADDED` |
| F11.4 Advance Draft Status | drafting→under_review (EM); under_review→ready_for_reference_check (EM, requires ≥1 statement); under_review→drafting (QA return); ready_for_reference_check→ready_for_final_review (EM) | — | `DRAFT_STATUS_CHANGED` |

---

#### F12: Basic Indexing and Reference Check

| Sub-Feature | Roles | Key Rules | Audit Event |
|-------------|-------|----------|-------------|
| F12.1 Create Draft Statements | AN, EM, AD | statement_text required; draft product must exist | `STATEMENT_CREATED` |
| F12.2 Link Statements to Evidence | AN | ≥1 evidence link required before reference check can begin; same engagement | `STATEMENT_EVIDENCE_LINKED` |
| F12.3 Assign for Reference Check | EM, AD | Assignee must have IR role and be assigned to engagement; statement must have ≥1 evidence link | `REFERENCE_CHECK_ASSIGNED` |
| F12.4 Perform Reference Check | IR only | Status: in_review, passed, or failed; discrepancy_notes required when failed | `REFERENCE_STATUS_CHANGED` |
| F12.5 Failed Statement Back to Analyst | IR | Assigns failed statement to analyst; analyst sets revision_ready=true; IR re-checks | `REFERENCE_FAILED_DISCREPANCY` |
| F12.6 Waive Reference Check | EM, AD | waiver_justification ≥10 chars; sets reference_status=waived; records waived_by, waived_at | `REFERENCE_CHECK_WAIVED` |
| F12.7 View Reference Check Progress | All engagement team; AD | Total, passed, waived, failed, in_review, not_started counts; completion % = (passed+waived)/total | — |

---

#### F13: Final Readiness — Gate P4

| Sub-Feature | Roles | Key Prerequisite Rules | Audit Event |
|-------------|-------|----------------------|-------------|
| F13.1 View Final Readiness Checklist | EM, PC, QA, AD | Checklist: (1) P3 approved, (2) no failed refs, (3) no in-review refs, (4) no not-started refs, (5) no open blockers | — |
| F13.2 Approve Final Readiness | EM, PC, AD | All checklist items pass; rationale ≥10 chars; outcome: ready_for_issuance or closed; sets engagement.status and phase | `GATE_P4_APPROVED` |
| F13.3 Close Without Issuance | EM, AD (Path B) | Path A: via P4 approval (all P4 prereqs apply); Path B: direct close at any phase (rationale ≥10 chars, not already closed/ready_for_issuance) | `GATE_P4_APPROVED` (Path A) / `ENGAGEMENT_CLOSED` (Path B) |
| F13.4 P4 Decision Visibility | All | Engagement shell, portfolio dashboard updated immediately; post-P4 = read-only state | — |

---

### 4.6 Dashboards and Reporting

#### F14: Portfolio Dashboard

| Sub-Feature | Key Data | Roles | Audit Event |
|-------------|---------|-------|-------------|
| F14.1 Count Cards | Active, In Planning, In Evidence, In Draft, Ready for Issuance, Closed, High Risk, Pending Requests | All (scoped) | — |
| F14.2 Filter Engagement List | owner, risk_level, phase, status, due date range, gate status; AND logic; URL-persisted | All (scoped) | — |
| F14.3 Engagement List | Columns: ID, Title, Phase, Status, Owner, Risk, Next Milestone, Gate Status (A1/P2/P3/P4), Due Date; sortable; pagination 25/50/100 | All (scoped) | — |
| F14.4 Export CSV | Columns: Engagement ID, Title, Phase, Status, Owner, Risk, Portfolio, Due Date, A1/P2/P3/P4 Status, Planning Approval Date, Evidence Readiness Date, Final Readiness Date, Created Date | AL/EM/AN/QA/PC/RO/AD (IR excluded) | `ENGAGEMENT_REGISTER_EXPORTED` |

---

#### F15: Engagement Detail Dashboard

| Sub-Feature | Key Data | Roles |
|-------------|---------|-------|
| F15.1 Phase/Status Summary | phase, status, owner, risk_level, job_code, title, due_date, days until due | All engagement team; AD |
| F15.2 Gate Status Cards | A1/P2/P3/P4: status, approver, decision date, prerequisite summary; links to gate history | All engagement team; AD |
| F15.3 Milestone Timeline | Four milestones with target dates and computed status (Not Started/On Track/At Risk/Complete/Overdue) | All engagement team; AD |
| F15.4 Evidence/Objective Progress | total evidence items, objectives with/without evidence, sufficiency % | All engagement team; AD |
| F15.5 Reference Check Completion | total statements, passed, waived, failed, in_review, not_started, completion % | All engagement team; AD |
| F15.6 Open Blockers Panel | Same blocking conditions as F04.4; non-collapsible when blockers exist | All engagement team; AD |

---

### 4.7 User-Centered Design

#### F16: Persona and Journey Artifacts

| Sub-Feature | Details |
|-------------|---------|
| F16.1 Persona Definitions | PER-01 Marcus Reid (AL), PER-02 Diana Okafor (EM), PER-03 Priya Nair (AN), PER-04 James Whitfield (QA), PER-05 Carla Voss (IR), PER-06 Tom Andrade (PC), PER-07 Sandra Wu (RO) |
| F16.2 Journey Definitions | J1 Intake & Acceptance (PER-01, F2–F3), J2 Planning Setup (PER-02/PER-04, F4–F7), J3 Evidence Readiness (PER-03/PER-04, F8–F10), J4 Draft Readiness (PER-03/PER-05, F11–F12), J5 Final Readiness (PER-02/PER-06, F13) |
| F16.3 Gate Scenario Mapping | S-A1-APPROVE, S-A1-DECLINE, S-P2-APPROVE, S-P2-RETURN, S-P3-APPROVE, S-P4-APPROVE — each with positive and negative paths |

---

#### F17: Basic Acceptance Test Generation

| Test Suite | Coverage | Test Case IDs |
|-----------|---------|---------------|
| A1 Gate Tests (US-17.1) | Draft create, submit, approve (with/without risk level and rationale), decline, dashboard reflection | AT-A1-01 through AT-A1-08 |
| P2 Gate Tests (US-17.2) | Objective save, planning submission, P2 approve (with/without EM on team), return, post-P2 revision | AT-P2-01 through AT-P2-08 |
| P3 Gate Tests (US-17.3) | Evidence upload, file size limit, objective link, sufficiency marking, P3 approve with gaps and without | AT-P3-01 through AT-P3-08 |
| P4 Gate Tests (US-17.4) | Statement create, IR assignment, pass/fail checks, waiver, P4 approve, P4 blocked by failed check or missing P3 | AT-P4-01 through AT-P4-09 |
| Dashboard and Export Tests (US-17.5) | Portfolio dashboard counts, filters, CSV export, detail dashboard metrics, restricted evidence visibility, audit trail, RBAC on edit | AT-DASH-01 through AT-DASH-07 |

---

## 5. Test Case Coverage Matrix

### 5.1 Feature-to-Test Coverage

| Feature | User Stories | Acceptance Tests | Story Count | Test Count | Coverage |
|---------|-------------|-----------------|-------------|------------|---------|
| F0: Basic Application Shell | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5, US-0.6 | AT-DASH-06, AT-DASH-07 | 6 | 2 (dashboard suite) | 100% |
| F1: Core Data Objects | US-1.1, US-1.2 | All test suites (implicit) | 2 | Cross-cutting | 100% |
| F2: Request Intake | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5 | AT-A1-01, AT-A1-02, AT-A1-03 | 5 | 3 | 100% |
| F3: Acceptance Decision — Gate A1 | US-3.1, US-3.2, US-3.3, US-3.4 | AT-A1-04, AT-A1-05, AT-A1-06, AT-A1-07, AT-A1-08 | 4 | 5 | 100% |
| F4: Engagement Shell | US-4.1, US-4.2, US-4.3, US-4.4 | AT-DASH-07 | 4 | 1 | 100% |
| F5: Team and Milestones | US-5.1, US-5.2, US-5.3, US-5.4 | AT-P2-06 | 4 | 1 | 100% |
| F6: Lightweight Planning Record | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5 | AT-P2-01, AT-P2-02, AT-P2-03, AT-P2-04, AT-P2-08 | 5 | 5 | 100% |
| F7: Planning Approval — Gate P2 | US-7.1, US-7.2, US-7.3, US-7.4 | AT-P2-05, AT-P2-06, AT-P2-07 | 4 | 3 | 100% |
| F8: Evidence Registry | US-8.1, US-8.2, US-8.3, US-8.4, US-8.5 | AT-P3-01, AT-P3-02, AT-P3-08 | 5 | 3 | 100% |
| F9: Evidence-to-Objective Link | US-9.1, US-9.2, US-9.3, US-9.4 | AT-P3-03, AT-P3-04, AT-DASH-05 | 4 | 3 | 100% |
| F10: Findings and Sufficiency — Gate P3 | US-10.1, US-10.2, US-10.3, US-10.4 | AT-P3-05, AT-P3-06, AT-P3-07 | 4 | 3 | 100% |
| F11: Draft Product Record | US-11.1, US-11.2, US-11.3, US-11.4 | AT-P4-01 (setup) | 4 | 1 | 100% |
| F12: Basic Indexing and Reference Check | US-12.1, US-12.2, US-12.3, US-12.4, US-12.5, US-12.6, US-12.7 | AT-P4-01, AT-P4-02, AT-P4-03, AT-P4-04, AT-P4-05, AT-P4-06 | 7 | 6 | 100% |
| F13: Final Readiness — Gate P4 | US-13.1, US-13.2, US-13.3, US-13.4 | AT-P4-07, AT-P4-08, AT-P4-09 | 4 | 3 | 100% |
| F14: Portfolio Dashboard | US-14.1, US-14.2, US-14.3, US-14.4 | AT-DASH-01, AT-DASH-02, AT-DASH-03 | 4 | 3 | 100% |
| F15: Engagement Detail Dashboard | US-15.1, US-15.2, US-15.3, US-15.4, US-15.5, US-15.6 | AT-DASH-04, AT-DASH-05 | 6 | 2 | 100% |
| F16: Persona and Journey Artifacts | US-16.1, US-16.2, US-16.3 | All suites (implicit) | 3 | Cross-cutting | 100% |
| F17: Basic Acceptance Test Generation | US-17.1, US-17.2, US-17.3, US-17.4, US-17.5 | AT-A1-01–08, AT-P2-01–08, AT-P3-01–08, AT-P4-01–09, AT-DASH-01–07 | 5 | 40 | 100% |
| **Totals** | | | **79** | **40** | **100%** |

### 5.2 Gate Acceptance Test Detail

#### Gate A1 Tests (US-17.1)

| Test ID | Scenario | Expected Result | Linked Story |
|---------|---------|----------------|--------------|
| AT-A1-01 | Draft request created | status=draft saved | US-2.1 |
| AT-A1-02 | Complete request submitted | status=submitted; REQUEST_SUBMITTED audit event | US-2.2 |
| AT-A1-03 | Submit with missing requester | HTTP 422 with field-level error | US-2.2 |
| AT-A1-04 | A1 approval | Engagement Shell created; status=accepted; GATE_A1_APPROVED audit event | US-3.2 |
| AT-A1-05 | A1 approve without risk level | HTTP 422: "Risk level is required." | US-3.2 |
| AT-A1-06 | A1 approve without rationale | HTTP 422: "Rationale must be at least 10 characters." | US-3.2 |
| AT-A1-07 | A1 decline with rationale | status=declined; no engagement created; GATE_A1_DECLINED audit event | US-3.3 |
| AT-A1-08 | A1 decided engagement on portfolio dashboard | Correct A1 gate status shown | US-3.4 |

#### Gate P2 Tests (US-17.2)

| Test ID | Scenario | Expected Result | Linked Story |
|---------|---------|----------------|--------------|
| AT-P2-01 | Objective saved | Objective visible in planning record | US-6.2 |
| AT-P2-02 | Complete planning submission | status=ready_for_review; appears in QA Review Queue | US-6.4 |
| AT-P2-03 | Submit with no objectives | HTTP 422 | US-6.4 |
| AT-P2-04 | Submit with missing risk notes | HTTP 422 | US-6.3 |
| AT-P2-05 | P2 approval | planning_record.status=approved; engagement.phase=evidence; GateDecision written | US-7.2 |
| AT-P2-06 | P2 approve with no EM on team | HTTP 422 | US-7.2 |
| AT-P2-07 | P2 return with comments | planning_record.status=returned; P2/returned GateDecision written | US-7.3 |
| AT-P2-08 | Post-P2 edit with revision note | Changes saved; PLANNING_RECORD_REVISED audit event | US-6.5 |

#### Gate P3 Tests (US-17.3)

| Test ID | Scenario | Expected Result | Linked Story |
|---------|---------|----------------|--------------|
| AT-P3-01 | Evidence uploaded | EVIDENCE_FILE_UPLOADED audit event | US-8.1, US-8.2 |
| AT-P3-02 | Upload 60MB file | HTTP 422: "File exceeds maximum size of 50 MB." | US-8.2 |
| AT-P3-03 | Link evidence to objective | Link created; objective evidence count increments | US-9.1 |
| AT-P3-04 | Objective marked Sufficient | Removed from gap view | US-10.3 |
| AT-P3-05 | P3 approval (all sufficient) | engagement.phase=draft; GATE_P3_APPROVED | US-10.4 |
| AT-P3-06 | P3 approve with evidence_needed objective | HTTP 409 | US-10.4 |
| AT-P3-07 | P3 approve with zero-evidence objective | HTTP 409 | US-10.4 |
| AT-P3-08 | Restricted evidence not visible to RO | Restricted items absent from RO evidence list | US-8.3 |

#### Gate P4 Tests (US-17.4)

| Test ID | Scenario | Expected Result | Linked Story |
|---------|---------|----------------|--------------|
| AT-P4-01 | Draft statement created with evidence link | reference_status=not_started; STATEMENT_CREATED audit event | US-12.1, US-12.2 |
| AT-P4-02 | EM assigns statement to IR | Statement appears in IR Review Queue | US-12.3 |
| AT-P4-03 | IR sets status to passed | REFERENCE_STATUS_CHANGED written | US-12.4 |
| AT-P4-04 | IR sets status to failed with discrepancy notes | Statement appears in Analyst queue | US-12.4, US-12.5 |
| AT-P4-05 | IR sets status to failed without discrepancy notes | HTTP 422 | US-12.4 |
| AT-P4-06 | EM waives reference check | reference_status=waived; REFERENCE_CHECK_WAIVED written | US-12.6 |
| AT-P4-07 | P4 approval (all Passed/Waived) | engagement.status=ready_for_issuance; GATE_P4_APPROVED | US-13.2 |
| AT-P4-08 | P4 approve with failed check | HTTP 409 | US-13.2 |
| AT-P4-09 | P4 approve when P3 not approved | HTTP 409 | US-13.2 |

#### Dashboard and Export Tests (US-17.5)

| Test ID | Scenario | Expected Result | Linked Story |
|---------|---------|----------------|--------------|
| AT-DASH-01 | Portfolio dashboard loads | Correct count cards and engagement list with all required columns | US-14.1, US-14.3 |
| AT-DASH-02 | Filter by High risk | Only high-risk engagements shown; count cards update | US-14.2 |
| AT-DASH-03 | Export engagement register | CSV downloaded with correct columns; ENGAGEMENT_REGISTER_EXPORTED written | US-14.4 |
| AT-DASH-04 | Engagement detail dashboard loads | Gate cards, milestones, evidence counts, reference check %, blockers shown | US-15.1–US-15.6 |
| AT-DASH-05 | Export evidence registry | CSV with correct columns; restricted items excluded for RO/AL | US-9.4 |
| AT-DASH-06 | Audit trail for engagement | All logged events shown with actor, action, timestamp in reverse chronological order | US-0.5 |
| AT-DASH-07 | RO cannot edit | No edit controls shown; direct API call returns HTTP 403 | US-0.3, US-4.1 |

---

## 6. Feature-to-Persona-to-Journey Cross-Reference

| Feature | Primary Persona(s) | Primary Journey(s) | Gate(s) |
|---------|-------------------|-------------------|---------|
| F0: Basic Application Shell | All (PER-01–PER-07) | All journeys | — |
| F1: Core Data Objects | PER-02 (EM) | All journeys | — |
| F2: Request Intake | PER-01 (AL) | J1: Intake & Acceptance | — |
| F3: Acceptance Decision | PER-01 (AL) | J1: Intake & Acceptance | A1 |
| F4: Engagement Shell | PER-02 (EM) | J2–J5 | — |
| F5: Team and Milestones | PER-02 (EM) | J2: Planning Setup | — |
| F6: Lightweight Planning Record | PER-02 (EM), PER-03 (AN) | J2: Planning Setup | — |
| F7: Planning Approval | PER-04 (QA) | J2: Planning Setup | P2 |
| F8: Evidence Registry | PER-03 (AN) | J3: Evidence Readiness | — |
| F9: Evidence-to-Objective Link | PER-03 (AN), PER-04 (QA) | J3: Evidence Readiness | — |
| F10: Findings and Sufficiency | PER-03 (AN), PER-04 (QA) | J3: Evidence Readiness | P3 |
| F11: Draft Product Record | PER-02 (EM), PER-03 (AN) | J4: Draft Readiness | — |
| F12: Indexing and Reference Check | PER-03 (AN), PER-05 (IR) | J4: Draft Readiness | — |
| F13: Final Readiness | PER-02 (EM), PER-06 (PC) | J5: Final Readiness | P4 |
| F14: Portfolio Dashboard | PER-01 (AL), PER-02 (EM), PER-07 (RO) | All journeys | — |
| F15: Engagement Detail Dashboard | PER-02 (EM), PER-07 (RO) | J2–J5 | — |
| F16: Persona and Journey Artifacts | Dev/QA team | All journeys | — |
| F17: Acceptance Test Generation | QA team | All journeys | A1, P2, P3, P4 |

---

## 7. TechArch Component-to-Feature Mapping

### 7.1 Backend Module Coverage

| Backend Module | Features Served | Key Tables | Key API Endpoints |
|---------------|----------------|------------|------------------|
| `auth` | F0 | `users`, `sessions`, `login_attempts` | `POST /auth/login`, `POST /auth/logout` |
| `users` | F0 | `users`, `user_roles` | `GET /users`, `POST /users`, `PUT /users/{id}/roles` |
| `requests` | F2 | `requests` | `POST /requests`, `PATCH /requests/{id}`, `POST /requests/{id}/submit`, `POST /requests/{id}/document` |
| `engagements` | F4, F14 | `engagements` | `GET /engagements`, `GET /engagements/{id}`, `PATCH /engagements/{id}`, `GET /engagements/{id}/blockers` |
| `team` | F5 | `team_assignments`, `milestones` | `POST /engagements/{id}/team`, `DELETE /engagements/{id}/team/{assignment_id}`, `PUT /engagements/{id}/milestones` |
| `planning` | F6 | `planning_records`, `objectives`, `planning_revisions` | `POST /engagements/{id}/planning`, `PATCH /engagements/{id}/planning`, `POST /engagements/{id}/planning/submit`, `POST /engagements/{id}/planning/objectives` |
| `gates` | F3, F7, F10, F13 | `gate_decisions` | `POST /engagements/{id}/gates/a1/approve`, `POST /engagements/{id}/gates/a1/decline`, `POST /engagements/{id}/gates/p2/approve`, `POST /engagements/{id}/gates/p2/return`, `POST /engagements/{id}/gates/p3/approve`, `POST /engagements/{id}/gates/p4/approve` |
| `evidence` | F8, F9 | `evidence_items`, `evidence_files`, `objective_evidence_links` | `POST /engagements/{id}/evidence`, `POST /engagements/{id}/evidence/{ev_id}/files`, `POST /engagements/{id}/evidence/{ev_id}/objectives` |
| `findings` | F10 | `findings`, `finding_evidence_links` | `POST /engagements/{id}/findings`, `POST /engagements/{id}/findings/{fid}/evidence` |
| `draft` | F11 | `draft_products`, `draft_comments` | `POST /engagements/{id}/draft`, `POST /engagements/{id}/draft/file`, `POST /engagements/{id}/draft/comments` |
| `statements` | F12 | `draft_statements`, `statement_evidence_links` | `POST /engagements/{id}/draft/statements`, `PATCH /engagements/{id}/draft/statements/{sid}/reference-status`, `POST /engagements/{id}/draft/statements/{sid}/waive` |
| `dashboard` | F14, F15 | Aggregate queries across all tables | `GET /dashboard/portfolio`, `GET /dashboard/engagement/{id}` |
| `audit` | F0, cross-cutting | `audit_events` | `GET /engagements/{id}/audit` |
| `storage` | F2, F8, F11 | `evidence_files`, `requests` | File storage abstraction (`local` or `s3_compatible`) |

### 7.2 Frontend Component Coverage

| Frontend Component | Feature(s) | Route |
|-------------------|-----------|-------|
| `LoginPage` | F0 | `/login` |
| `AppShell` / `NavigationRail` | F0 | All routes |
| `DashboardPage` | F14 | `/dashboard` |
| `RequestsPage` / `RequestDetailPage` | F2, F3 | `/requests`, `/requests/{id}` |
| `EngagementsPage` | F4 | `/engagements` |
| `EngagementShellPage` | F4 | `/engagements/{id}` |
| `TeamPage` | F5 | `/engagements/{id}/team` |
| `PlanningPage` | F6, F7 | `/engagements/{id}/planning` |
| `EvidencePage` | F8, F9 | `/engagements/{id}/evidence` |
| `FindingsPage` | F10 | `/engagements/{id}/findings` |
| `DraftPage` | F11, F12 | `/engagements/{id}/draft` |
| `GatePage` | F13 | `/engagements/{id}/gates` |
| `EngagementDashboard` | F15 | `/engagements/{id}/dashboard` |
| `ReviewQueuePage` | F3, F7, F10, F13 | `/review-queue` |
| `AuditTrailPage` | F0 | `/engagements/{id}/audit` |
| `AdminPage` | F0 | `/admin` |

### 7.3 Cross-Cutting Technical Services

| Service | Pattern | Features Served | Notes |
|---------|---------|----------------|-------|
| `AuditService` | Called by all mutating services | All features | Writes immutable `audit_events`; failure logged but does not roll back primary operation |
| `GatePrerequisiteValidator` | Used by `GatesService` | F3, F7, F10, F13 | Encapsulates all prerequisite rules for A1, P2, P3, P4 |
| `BlockerComputer` | Used by `EngagementsService` and `DashboardService` | F4, F15 | Returns current blockers list dynamically |
| `StorageProvider` | Injected via DI into file-handling modules | F2, F8, F11 | `local` (dev) or `s3_compatible` (prod) backend via `STORAGE_BACKEND` env var |
| `SessionManager` | Auth middleware | F0 | JWT session token; hash stored in DB for revocability; lockout enforced |
| `RBAC Guard` | Controller/Middleware | All features | Server-side enforcement; prevents privilege escalation via direct API calls |

---

## 8. Non-Functional Requirements Traceability

| NFR Category | Requirement | TechArch Implementation | Tested By |
|-------------|-------------|------------------------|-----------|
| **Performance — Page Loads** | ≤3 seconds for typical engagement lists and forms | Indexed FK and query-critical columns; paginated list endpoints (default 25 rows) | AT-DASH-01, AT-DASH-04 |
| **Performance — API Response** | ≤500ms for standard create/read/update under normal load | Connection pooling; server-side aggregate queries | All gate AT suites |
| **Performance — Dashboard** | ≤3 seconds for ≤100 engagements / ≤500 evidence items / ≤100 statements | Aggregate queries computed server-side; not client-side iteration | AT-DASH-04 |
| **Availability** | 99% during business hours | Stateless API containers; DB and file storage are sole stateful services; backup/restore required | Deployment |
| **Scalability** | ≥100 engagements, ≥500 evidence items, ≥50 users | PostgreSQL indexing; paginated endpoints | Load testing |
| **Security — HTTPS** | All traffic encrypted | TLS termination at reverse proxy (nginx or cloud load balancer) | Infrastructure |
| **Security — Encryption at Rest** | Database and files encrypted where supported | PostgreSQL + S3-compatible storage | Infrastructure |
| **Security — RBAC** | Server-side role enforcement | RBAC guard in Controller/Middleware layer; UI role-filtered navigation | AT-DASH-07 |
| **Security — Evidence Isolation** | Restricted evidence hidden from AL/RO | Sensitivity check on every evidence read/download endpoint | AT-P3-08, AT-DASH-05 |
| **Security — Audit Logging** | Gate decisions, evidence actions, reference status changes, exports | AuditService writes immutable `audit_events` | AT-DASH-06 |
| **Security — Login Lockout** | 5 failures in 15 min → 15 min lockout | `login_attempts` table tracking; lockout enforced in AuthService | US-0.1 |
| **Data Integrity** | Gate decisions and audit events immutable | `gate_decisions` and `audit_events` — no UPDATE/DELETE at application layer | US-1.1 |
| **Soft Deletes** | Objectives, evidence, findings preserve audit integrity | `deleted_at` column; deletion blocked when linked records exist | US-8.5, US-6.2 |
| **Export** | Engagement register and evidence registry exportable to CSV | `GET /engagements` and `GET /engagements/{id}/evidence` with `Accept: text/csv` or `?format=csv` | AT-DASH-03, AT-DASH-05 |
| **Search** | Search by engagement ID, title, requester, owner, status | Global search endpoint; results scoped to user's authorized engagements | US-0.4 |

---

## 9. Change Management

### 9.1 RTM Change Log

| Version | Date | Author | Change Description |
|---------|------|--------|-------------------|
| 1.0 | 2026-06-05 | System (RTM Generator) | Initial RTM creation from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 |

### 9.2 Change Control Process

Any change to a source specification document (PRD, FRD, TechArch, UserStories) that affects feature IDs, requirement IDs, API endpoints, database tables, or user story acceptance criteria **must** trigger an update to this RTM. Changes should be reviewed and approved before implementation begins on affected features.

**Change impact assessment:** When a requirement changes, identify all downstream impacts using this matrix:
1. Locate the PRD feature (F0–F17) in Section 3.1
2. Identify all linked FRD specifications, TechArch components, and user stories
3. Update affected rows in Sections 3–8
4. Add a change log entry to Section 9.1 with date, author, and description

---

## 10. Approval

### 10.1 Document Approval Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | — | _________________ | __________ |
| Engagement Manager Lead | — | _________________ | __________ |
| QA Lead | — | _________________ | __________ |
| Technical Architect | — | _________________ | __________ |
| Independent Reviewer | — | _________________ | __________ |

### 10.2 Approval Criteria

This RTM is considered approved when all of the following are confirmed:

- [ ] All 18 PRD features (F0–F17) have complete traceability in Section 3.1
- [ ] All 79 user stories map to at least one PRD feature and at least one FRD sub-feature
- [ ] All 40 acceptance test cases (AT-A1-01–08, AT-P2-01–08, AT-P3-01–08, AT-P4-01–09, AT-DASH-01–07) map to user stories
- [ ] All four gates (A1, P2, P3, P4) have documented prerequisites, approval roles, audit events, and error codes
- [ ] All seven personas (PER-01–PER-07) are mapped to their primary features and journeys
- [ ] All five primary journeys (J1–J5) are documented with start/end conditions and feature coverage
- [ ] All TechArch backend modules, frontend components, and cross-cutting services have feature coverage in Section 7
- [ ] All non-functional requirements have implementation evidence and test references in Section 8
- [ ] No orphan requirements exist (every FRD specification traces to a PRD feature)
- [ ] No untested stories exist (every user story has an acceptance criterion linked to a test)

---

*Document generated: 2026-06-05*
*Source: PRD-EMS.md v1.0, FRD-EMS.md v1.0, TechArch-EMS.md v1.0, UserStories-EMS.md v1.0*
*Maintained alongside all EMS specification documents*
