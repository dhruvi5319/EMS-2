# Story Map
## Lightweight Engagement Management System (EMS)

| Field | Value |
|-------|-------|
| **Product Name** | Lightweight Engagement Management System (EMS) |
| **Version** | 1.0 |
| **Date** | 2026-06-04 |
| **Related PRD** | PRD-EMS.md |
| **Related Personas** | PERSONAS-EMS.md |
| **Related JTBD** | JTBD-EMS.md |
| **Related Journeys** | JOURNEYS-EMS.md |
| **Related User Stories** | UserStories-EMS.md |
| **Total Stories Mapped** | 79 (US-0.1 through US-17.5) |
| **Total Epics** | 18 (Epic 0 — Epic 17) |
| **Releases Defined** | 5 (R1–R5) |

---

## Overview

This Story Map organizes all 79 EMS user stories onto a two-dimensional grid:

- **X-axis (columns):** Journey stages, derived from JOURNEYS-EMS.md — the five primary journeys J1–J5 plus cross-cutting platform concerns
- **Y-axis (rows):** Activities and epics within each journey stage, ordered from foundational (top) to advanced detail (bottom)
- **NaC column:** Natural Acceptance Criteria derived from JTBD outcomes — each NaC is traceable to a specific JTBD-ID and journey stage
- **Release column:** Increment assignment based on the gate-sequenced workflow: A1 → P2 → P3 → P4

### Gate Sequence and Release Structure

The EMS workflow is gate-sequenced. Releases follow the logical gate order to ensure each release delivers a complete, testable end-to-end slice:

| Release | Theme | Gates Covered | Key Capabilities |
|---------|-------|--------------|-----------------|
| **R1 — MVP Core** | Platform shell + intake + Gate A1 + engagement shell | A1 | Login, navigation, request intake, A1 decision, engagement shell creation |
| **R2 — Planning** | Team/milestones + planning record + Gate P2 | P2 | Team assignments, milestones, planning baseline, P2 approval |
| **R3 — Evidence** | Evidence registry + objective linking + findings + Gate P3 | P3 | Evidence upload, evidence-to-objective links, gap view, findings, P3 approval |
| **R4 — Readiness** | Draft product + indexing + reference check + Gate P4 | P4 | Draft product, statement indexing, reference checks, P4 final approval |
| **R5 — Dashboards** | Portfolio dashboard + engagement detail dashboard + acceptance tests | — | Portfolio dashboard, engagement detail dashboard, CSV exports, acceptance tests |

### NaC Concept

**Natural Acceptance Criteria (NaC)** bridge JTBD outcomes to testable story criteria. Each NaC is derived from the intersection of:
1. A JTBD outcome (the "what matters" — e.g., "Minimize time to start work")
2. A journey stage context (the "when/where" — e.g., Intake, Planning Setup)
3. A user story (the "what is built")

NaC are **not invented** — they are derived from the JTBD NaC Preview table in JTBD-EMS.md, contextualized for the specific journey stage and story. They serve as the primary bridge between user intent (JTBD) and implementation verification (acceptance criteria).

### Map Entry ID Convention

Story map entries are referenced as **SM-{Epic}.{NN}** (e.g., SM-0.1, SM-2.1). These IDs correspond 1:1 with UserStory IDs (SM-2.1 = US-2.1 mapped to the story map).

---
## Story Map Matrix

### How to Read This Matrix

Each row represents one user story placed at the intersection of:
- **Journey Stage** (which phase of the EMS workflow)
- **Activity** (what the user is doing at that stage)

Columns: `SM-ID | Persona | Journey Stage | Activity/Epic | Story | NaC | Release`

---

### Section A: Platform Foundation (Cross-Cutting — All Journeys)

*Epic 0 (F0) and Epic 1 (F1) underpin every journey. They are mapped here as foundational pre-conditions.*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-0.1 | All roles | Platform: Arrive | Authenticate to access the system | US-0.1: Login to the Application | JTBD-01.1/02.1/03.1/04.1/05.1/06.1/07.1 → "Any user can access the system within 3 seconds; invalid credentials show a clear error without revealing field specifics; 5 failed attempts locks the account with an explanatory message" | R1 |
| SM-0.2 | All roles | Platform: Arrive | End session securely | US-0.2: Logout of the Application | JTBD-01.1 → "After logout, no protected route is accessible; browser back button does not re-enter the session" | R1 |
| SM-0.3 | All roles | Platform: Navigate | Move between application sections | US-0.3: Navigate via Main Menu | JTBD-02.3/07.1 → "All authenticated users reach any authorized section within 2 clicks from a persistent sidebar; unauthorized sections return HTTP 403" | R1 |
| SM-0.4 | All roles | Platform: Navigate | Find a specific engagement quickly | US-0.4: Search for Engagements | JTBD-07.2 → "Search by engagement ID or title returns up to 50 ranked results within 3 seconds, scoped to authorized records" | R1 |
| SM-0.5 | PER-01, PER-02 | Platform: Review | Confirm gate decisions and history are on record | US-0.5: View Audit Trail | JTBD-01.2/04.1/06.1 → "Audit trail displays events in reverse chronological order with actor, action, object, timestamp, and summary; gate decisions, uploads, and status changes all appear; filterable by action type and date range" | R1 |
| SM-0.6 | Admin | Platform: Administer | Assign roles to users | US-0.6: Assign User Roles (Admin) | JTBD-01.2 → "Admin can assign any predefined role; role assignment takes effect on the user's next request; at least one role must be assigned or the save fails with a validation error" | R1 |
| SM-1.1 | PER-02 | Platform: Persist | Trust that all records survive sessions and deployments | US-1.1: Persistent Core Records | JTBD-02.1/02.2/02.3 → "All ten core entities persist across sessions; gate decisions and audit events are immutable after creation; foreign key constraints prevent orphan records" | R1 |
| SM-1.2 | All roles | Platform: Validate | See only valid status and type options in forms | US-1.2: Enforce Allowed Values | JTBD-01.1/03.1 → "All enum fields reject invalid values with HTTP 422 and a clear field-level error; UI dropdowns show only the allowed values for each field; engagement phase transitions use the correct defined values" | R1 |

---

### Section B: Intake and Acceptance — Journey J1 (Gate A1)

*Epic 2 (F2) and Epic 3 (F3) — primary persona PER-01 (Marcus Reid, Acceptance Lead)*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-2.1 | PER-01 | J1: Create | Start capturing a new incoming request before all details are available | US-2.1: Create Draft Request | JTBD-01.1 → "Only AL/Admin can create requests; a new request saves as draft with at minimum a request_type; an audit event REQUEST_CREATED is written and the user lands on the request detail page" | R1 |
| SM-2.2 | PER-01 | J1: Complete | Fill in all required fields and move the request to the review queue | US-2.2: Complete and Submit Request | JTBD-01.1 → "Submission requires all five required fields; missing fields return HTTP 422 with per-field errors; successful submission sets status=submitted, records submitted_at, and writes REQUEST_SUBMITTED audit event" | R1 |
| SM-2.3 | PER-01 | J1: Complete | Attach the source document so the reviewer has the full decision package | US-2.3: Upload Intake Document | JTBD-01.1 → "File upload supports PDF, DOCX, and other allowed types up to 25 MB; upload writes REQUEST_DOCUMENT_UPLOADED; filename is confirmed after upload; unsupported types or oversized files return HTTP 422 with a clear message" | R1 |
| SM-2.4 | PER-01 | J1: Create | Correct or complete a request before submitting it | US-2.4: Edit Draft Request | JTBD-01.1 → "All fields editable while status=draft; editing is blocked after submission with HTTP 409; changes write REQUEST_UPDATED audit event; non-AL edit attempt returns HTTP 403" | R1 |
| SM-2.5 | PER-01, PER-07 | J1: Review | See the full request context including the A1 decision summary | US-2.5: View Request Detail | JTBD-01.2/01.3 → "Request detail shows all intake fields, intake document download link, submission timestamp, and A1 gate decision summary once a decision is made; audit trail link is visible on the detail page" | R1 |
| SM-3.1 | PER-01 | J1: Survey | Pick a request from the review queue and assess it before deciding | US-3.1: Review Submitted Request for A1 | JTBD-01.2/01.3 → "Review Queue shows all submitted requests; clicking a request opens the full detail page with all fields and intake document; A1 decision controls are visible only when status=submitted and only to AL role" | R1 |
| SM-3.2 | PER-01 | J1: Decide | Approve a request and trigger automatic engagement shell creation | US-3.2: Approve Request at Gate A1 | JTBD-01.2 → "AL selects risk level and enters rationale ≥10 chars; successful approval creates a GateDecision (A1/approved), an Engagement Shell (phase=planning, auto-generated job_code), sets request status=accepted, and writes GATE_A1_APPROVED; system redirects to new engagement shell" | R1 |
| SM-3.3 | PER-01 | J1: Decide | Decline a request with documented rationale | US-3.3: Decline Request at Gate A1 | JTBD-01.2 → "AL enters rationale ≥10 chars; successful decline creates GateDecision (A1/declined), sets request status=declined, writes GATE_A1_DECLINED; no engagement shell is created; declined request remains visible in portfolio dashboard and audit trail" | R1 |
| SM-3.4 | PER-02, PER-07 | J1: Confirm | See the A1 decision reflected on the request, engagement shell, and portfolio dashboard | US-3.4: A1 Decision Reflected Across System | JTBD-01.2/01.3 → "A1 decision summary card appears on request detail page; A1 gate status card is visible on the Engagement Shell; portfolio dashboard gate status column reflects A1 status; gate decision records remain visible even after the engagement is later closed" | R1 |

---
### Section C: Engagement Setup and Planning — Journey J2 (Gate P2)

*Epics 4–7 (F4–F7) — primary personas PER-02 (Diana Okafor, EM) and PER-04 (James Whitfield, QA)*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-4.1 | PER-02 | J2: Open Shell | Access the newly created engagement and understand its current state at a glance | US-4.1: View Engagement Shell | JTBD-02.1/02.3 → "Engagement shell displays job code, title, phase, status badge, risk level badge, owner, portfolio, created date, due date; gate status cards for A1/P2/P3/P4 show status, approver, and date; open blockers list and linked artifact counts are visible; unauthorized access returns HTTP 403" | R1 |
| SM-4.2 | PER-02 | J2: Complete Metadata | Update the engagement record as the engagement progresses | US-4.2: Edit Engagement Metadata | JTBD-02.1/02.3 → "Only EM/Admin can edit metadata; title must be non-empty; owner must be an active EM; status cannot be manually set to ready_for_issuance or closed; phase manual override requires a revision note ≥10 chars; changes write ENGAGEMENT_UPDATED" | R2 |
| SM-4.3 | PER-02 | J2–J5: Monitor | Know exactly what is preventing the next gate | US-4.3: See Open Blockers on Engagement Shell | JTBD-02.3 → "Blockers list is dynamically computed and shows all blocking conditions including planning not approved, objectives with no linked evidence, failed reference checks, P3 not approved when draft product exists; each blocker identifies the specific record affected; 'No open blockers' shown when none exist" | R2 |
| SM-4.4 | PER-02 | J2–J5: Navigate | Reach any engagement section in one click | US-4.4: Navigate to Linked Artifacts | JTBD-02.3 → "Navigation links present for Team, Planning Record, Evidence, Findings, Draft Product, Gate History, and Audit Trail; each link routes to the correct feature page; all authorized roles can see and use navigation links" | R2 |
| SM-5.1 | PER-02 | J2: Assign Team | Assign users to predefined roles to establish access and routing | US-5.1: Assign Team Members | JTBD-02.1 → "Only EM/Admin can assign team members; available roles include AL, EM, AN, QA, IR, PC, RO; duplicate user-role combinations return HTTP 409; selected user must be active; audit event TEAM_MEMBER_ASSIGNED is written; at least one EM must remain on the team" | R2 |
| SM-5.2 | PER-02 | J2: Assign Team | Remove team members when their contribution is complete | US-5.2: Remove Team Members | JTBD-02.1 → "Only EM/Admin can remove team members; removing the last EM is blocked with HTTP 409; QA Reviewer cannot be removed before P2 is approved; removal soft-deletes the TeamAssignment record and writes TEAM_MEMBER_REMOVED" | R2 |
| SM-5.3 | PER-02 | J2: Set Milestones | Define the engagement schedule in one session | US-5.3: Set Milestone Target Dates | JTBD-02.1/02.2 → "EM can set all four milestone dates: P2, P3, Draft Readiness, P4; dates must be in chronological order or return HTTP 422; invalid date format returns HTTP 422; dates can be left null (Not Started); changes write MILESTONES_UPDATED" | R2 |
| SM-5.4 | PER-02, PER-07 | J2–J5: Monitor | Identify which milestones need attention without manual calculations | US-5.4: View Milestone Status | JTBD-02.3/07.2 → "Milestone status computed automatically: not_started (null date), on_track (future date, gate not passed), at_risk (within 7 days, gate not passed), complete (gate approved), overdue (past date, gate not passed); status visible on both Engagement Shell and Engagement Detail Dashboard" | R2 |
| SM-6.1 | PER-02 | J2: Build Planning Record | Create a structured planning baseline for the engagement | US-6.1: Create Planning Record | JTBD-02.2 → "Only EM/AN/Admin can create planning records; only one planning record per engagement (duplicate returns error); created with status=draft; audit event PLANNING_RECORD_CREATED written; engagement must be active and not closed" | R2 |
| SM-6.2 | PER-02, PER-03 | J2: Build Planning Record | Add, edit, and organize the research objectives driving the engagement | US-6.2: Add and Manage Objectives | JTBD-02.2/03.1 → "Objective text is required; objectives can be reordered; deleting an objective linked to evidence is blocked with HTTP 409; at least one objective must exist before the planning record can be submitted for P2" | R2 |
| SM-6.3 | PER-02, PER-03 | J2: Build Planning Record | Complete all planning sections required for P2 submission | US-6.3: Complete Planning Sections | JTBD-02.2 → "Risk notes, data reliability notes, and independence status are required before P2 submission; independence status must be affirmed/pending/exception_noted; partial draft saves are permitted at any time; changes write PLANNING_RECORD_UPDATED" | R2 |
| SM-6.4 | PER-02 | J2: Submit for P2 | Submit the completed planning record for QA review in one action | US-6.4: Submit Planning Record for P2 | JTBD-02.2 → "Submission requires: ≥1 objective, non-empty risk notes, non-empty data reliability notes, independence status set, owner assigned, ≥1 QA Reviewer on team, ≥1 milestone date set; each missing prerequisite returns HTTP 422 with a specific P2_PREREQUISITE_FAILED message; successful submission writes PLANNING_SUBMITTED_FOR_REVIEW and places the record in the QA Reviewer's Review Queue" | R2 |
| SM-6.5 | PER-02 | J2: Revise | Modify the approved planning baseline with a revision note | US-6.5: Edit Approved Planning Record | JTBD-02.2 → "After P2 approval, planning fields are locked by default; EM can unlock via 'Request Revision' with a revision note ≥10 chars; changes save with status remaining approved and a PlanningRevision record created; audit event PLANNING_RECORD_REVISED written" | R2 |
| SM-7.1 | PER-04 | J2: Open P2 Review | View the submitted planning record with a completeness checklist before deciding | US-7.1: Review Planning Record for P2 | JTBD-04.1 → "QA Reviewer navigates to Review Queue and sees records with status=ready_for_review; planning record detail shows all required sections plus P2 prerequisite checklist with pass/fail indicators per item; only QA role sees approval/return controls" | R2 |
| SM-7.2 | PER-04 | J2: Approve P2 | Approve the planning baseline in a single auditable action | US-7.2: Approve Planning Baseline at P2 | JTBD-04.1 → "All P2 prerequisites must pass server-side; approval comment required ≥10 chars; successful approval sets planning_record.status=approved, engagement.phase=evidence, creates GateDecision (P2/approved), writes GATE_P2_APPROVED; non-QA returns HTTP 403" | R2 |
| SM-7.3 | PER-04 | J2: Return P2 | Return an incomplete planning record with specific revision comments | US-7.3: Return Planning Record for Revision | JTBD-04.1 → "Return comment required ≥10 chars; successful return sets planning_record.status=returned, creates GateDecision (P2/returned), writes GATE_P2_RETURNED; return comments immediately visible to EM; multiple return/resubmit cycles each create a new GateDecision" | R2 |
| SM-7.4 | PER-02 | J2: Confirm | See the P2 decision status on the engagement without asking the QA Reviewer | US-7.4: P2 Decision Status Visible | JTBD-04.1 → "P2 gate status card on Engagement Shell shows current outcome, approver, and date; full P2 gate history accessible from gate history view; approved baseline viewable in read-only mode by all team members; P2 approval timestamp and approver shown on planning record page" | R2 |

---
### Section D: Evidence Readiness — Journey J3 (Gate P3)

*Epics 8–10 (F8–F10) — primary personas PER-03 (Priya Nair, Analyst) and PER-04 (James Whitfield, QA)*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-8.1 | PER-03 | J3: Navigate to Evidence | Add a structured metadata record for a new piece of evidence | US-8.1: Add an Evidence Record | JTBD-03.1 → "Only AN/Admin can create evidence records; required fields: evidence_type, source, date_received, sensitivity; empty source returns HTTP 422; valid date required; EVIDENCE_ITEM_CREATED audit event written; record immediately visible in evidence list" | R3 |
| SM-8.2 | PER-03 | J3: Add Evidence Item | Attach the actual source documents to the evidence record | US-8.2: Upload Files to Evidence Record | JTBD-03.1 → "Allowed file types include PDF, DOCX, CSV, ZIP and others; max 50 MB per file and 20 files per item; oversized or unsupported files return HTTP 422 with clear messages; EVIDENCE_FILE_UPLOADED audit event written per file" | R3 |
| SM-8.3 | PER-03 | J3: Add Evidence Item | Restrict access to sensitive evidence items | US-8.3: Mark Evidence as Restricted | JTBD-03.1 → "Sensitivity can be Standard (default) or Restricted; restricted items visible only to AN, EM, QA, IR, PC, Admin assigned to the engagement; AL and RO cannot see restricted items or their download links; EVIDENCE_RESTRICTED audit event written on restriction change; unauthorized download returns HTTP 403" | R3 |
| SM-8.4 | PER-03, PER-04 | J3: Add Evidence Item | Assess evidence coverage by browsing the full evidence list | US-8.4: View and Filter Evidence List | JTBD-03.1/04.2 → "Evidence list shows evidence ID, type, source, date received, sensitivity badge, linked objective count, file count, uploaded by, and created date; filterable by type, sensitivity, date range, and linked/unlinked status; restricted items hidden from AL and RO" | R3 |
| SM-8.5 | PER-03 | J3: Add Evidence Item | Remove an incorrectly added evidence item | US-8.5: Delete Evidence Record | JTBD-03.1 → "Deletion blocked if evidence is linked to any objective, finding, or reference check statement with HTTP 409; successful deletion soft-deletes the record; EVIDENCE_ITEM_DELETED audit event written" | R3 |
| SM-9.1 | PER-03 | J3: Link to Objective | Connect collected evidence to the planning objectives it supports | US-9.1: Link Evidence to Objectives | JTBD-03.1 → "AN can link evidence to one or more objectives from either the evidence detail page or the objectives page; cross-engagement links return HTTP 422; duplicate links return HTTP 409; EVIDENCE_OBJECTIVE_LINKED audit event written per new link" | R3 |
| SM-9.2 | PER-03, PER-04 | J3: Check Gap View | Confirm each objective has appropriate evidence support | US-9.2: View Linked Evidence Per Objective | JTBD-03.1/04.2 → "Linked evidence list per objective shows evidence ID, type, source, date received, sensitivity badge, and linked findings count; restricted evidence follows same visibility rules as F8; accessible to all roles assigned to the engagement" | R3 |
| SM-9.3 | PER-03, PER-04 | J3: Check Gap View | Identify objectives with no linked evidence before Gate P3 | US-9.3: Identify Evidence Gaps | JTBD-03.1/04.2 → "Gap view shows objectives with zero linked evidence items; each row shows objective text (truncated at 100 chars), objective status, linked evidence count as 'No Evidence' badge, and days until evidence readiness milestone; any objective in gap view with status=evidence_needed is flagged as a P3 blocker; accessible via 'Show Gaps' toggle" | R3 |
| SM-9.4 | PER-03, PER-02 | J3: Check Gap View | Export evidence coverage for external reporting | US-9.4: Export Evidence Registry to CSV | JTBD-03.1 → "Export available to AL, EM, AN, QA, PC, RO, Admin (IR excluded); CSV includes 11 columns including Evidence ID, Type, Source, Sensitivity, Linked Objectives, and Files Attached; restricted items excluded for AL and RO; scoped to current engagement; EVIDENCE_CSV_EXPORTED audit event written" | R3 |
| SM-10.1 | PER-03 | J3: Create Findings | Document draft conclusions linked to supporting evidence | US-10.1: Create Finding Record | JTBD-03.2 → "Only AN/Admin can create findings; finding text required (empty returns HTTP 422); findings can only be created after P2 is approved (wrong phase returns HTTP 409); created with status=draft; FINDING_CREATED audit event written" | R3 |
| SM-10.2 | PER-03 | J3: Create Findings | Make every conclusion traceable to the evidence that supports it | US-10.2: Link Finding to Evidence | JTBD-03.2 → "AN can select one or more evidence items to link to a finding; cross-engagement links return HTTP 422; duplicate finding-evidence links return HTTP 409; a finding must have at least one linked evidence item before Gate P3 can pass; FINDING_EVIDENCE_LINKED audit event written" | R3 |
| SM-10.3 | PER-04 | J3: Verify P3 Readiness | Track evidence sufficiency per objective before approving P3 | US-10.3: Mark Objective Evidence Status | JTBD-04.2 → "QA, EM, and Admin can update objective evidence status; cannot mark in_review or sufficient with zero linked evidence; status transitions: evidence_needed → in_review (requires ≥1 evidence) → sufficient; regression allowed; OBJECTIVE_STATUS_UPDATED audit event written" | R3 |
| SM-10.4 | PER-04 | J3: Approve P3 | Approve evidence sufficiency when all objectives are covered | US-10.4: Approve Evidence Sufficiency at P3 | JTBD-04.2 → "P3 blocked if P2 not approved (HTTP 409); P3 blocked if any objective has status=evidence_needed (HTTP 409); P3 blocked if any objective has zero linked evidence (HTTP 409); P3 blocked if any finding has zero evidence links (HTTP 409); approval comment required ≥10 chars; successful approval creates GateDecision (P3/approved), sets engagement.phase=draft, writes GATE_P3_APPROVED; non-QA returns HTTP 403" | R3 |

---
### Section E: Draft Readiness — Journey J4 (Gate P4 Prerequisites)

*Epics 11–12 (F11–F12) — primary personas PER-03 (Priya, AN), PER-02 (Diana, EM), PER-05 (Carla, IR)*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-11.1 | PER-02 | J4: Create Draft | Establish a single tracked record for the working product | US-11.1: Create Draft Product Record | JTBD-02.1/03.2 → "Only EM/AN/Admin can create draft product; can only be created after P3 is approved (wrong phase returns HTTP 409); only one draft product per engagement (duplicate returns HTTP 409); required fields: title, version, owner_id; created with status=drafting; DRAFT_PRODUCT_CREATED audit event written" | R4 |
| SM-11.2 | PER-03, PER-02 | J4: Create Draft | Attach the working document to the draft record | US-11.2: Attach Draft File | JTBD-03.2 → "Allowed file types: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP; max 50 MB; only one file per draft (uploading replaces previous); file downloadable by all authorized roles; DRAFT_FILE_ATTACHED and DRAFT_FILE_DOWNLOADED audit events written" | R4 |
| SM-11.3 | PER-04, PER-02 | J4: Create Draft | Capture review feedback directly on the draft record | US-11.3: Record Review Comments on Draft | JTBD-04.1 → "EM, QA, AN, and Admin can add review comments; comments are non-empty when saved; comments are append-only (not editable after save) and include timestamp and reviewer name; DRAFT_COMMENT_ADDED audit event written" | R4 |
| SM-11.4 | PER-02 | J4: Create Draft | Advance the draft through its review stages | US-11.4: Advance Draft Status Through Review Stages | JTBD-02.3 → "Only permitted transitions allowed: Drafting → Under Review (EM); Under Review → Ready for Reference Check (EM); Under Review → Drafting (QA, return); Ready for Reference Check → Ready for Final Review (EM); invalid transitions return HTTP 409; advancing to Ready for Reference Check requires ≥1 draft statement; DRAFT_STATUS_CHANGED audit event written" | R4 |
| SM-12.1 | PER-03 | J4: Add Draft Statements | Add draft statement records linked to supporting evidence for reference check | US-12.1: Create Draft Statements (Indexing) | JTBD-03.3 → "Only AN/EM/Admin can create draft statements; statement text required (empty returns HTTP 422); draft product must exist (not found returns HTTP 404); statements can be created during drafting/under_review/ready_for_reference_check status; new statement created with reference_status=not_started; STATEMENT_CREATED audit event written" | R4 |
| SM-12.2 | PER-03 | J4: Add Draft Statements | Link each statement to the evidence that supports its claim | US-12.2: Link Statements to Evidence | JTBD-03.3 → "AN can link one or more evidence items to a statement; cross-engagement links return HTTP 422; duplicate statement-evidence links return HTTP 409; a statement must have at least one evidence link before reference check can begin; STATEMENT_EVIDENCE_LINKED audit event written" | R4 |
| SM-12.3 | PER-02 | J4: Monitor Reference Status | Assign indexed statements to the Independent Referencer for review | US-12.3: Assign Statement for Reference Check | JTBD-02.3/05.1 → "Only EM/Admin can assign statements; assigned user must have IR role and be on the engagement (invalid returns HTTP 422); statements without evidence links cannot be assigned (HTTP 422); assigned statements appear in IR's Review Queue; REFERENCE_CHECK_ASSIGNED audit event written" | R4 |
| SM-12.4 | PER-05 | J4: Open Reference Check Queue | Work through the reference check queue marking each statement Passed or Failed | US-12.4: Perform Reference Check (Pass or Fail) | JTBD-05.1 → "Only IR role can set reference status; IR can set status to in_review, passed, or failed; discrepancy notes required when status=failed (missing notes return HTTP 422); IR can access linked evidence files directly from statement review interface; REFERENCE_STATUS_CHANGED audit event written per change" | R4 |
| SM-12.5 | PER-05 | J4: Flag Failure | Route failed statements back to the Analyst with a tracked discrepancy note | US-12.5: Assign Failed Statement Back to Analyst | JTBD-05.2 → "When IR sets status=failed, statement can be assigned to an Analyst user; failed statements appear in Analyst's queue for correction; Analyst can update statement text or evidence links; Analyst sets revision_ready=true to notify IR; IR's Review Queue surfaces revised statement for re-check; REFERENCE_FAILED_DISCREPANCY audit event written" | R4 |
| SM-12.6 | PER-02 | J4: Monitor Reference Status | Waive a reference check for well-established facts | US-12.6: Waive a Reference Check | JTBD-06.2 → "Only EM/Admin can waive; waiver justification required ≥10 chars; successful waiver sets reference_status=waived with waived_by, waived_at, and waiver_justification recorded; waived statements count as complete for P4 prerequisite purposes; REFERENCE_CHECK_WAIVED audit event written" | R4 |
| SM-12.7 | PER-02, PER-06 | J4–J5: Monitor Reference Status | See reference check completion status across all draft statements | US-12.7: View Reference Check Progress | JTBD-06.2 → "Reference check progress view shows: total statements, counts by status (Not Started/In Review/Passed/Failed/Waived), and completion percentage ((Passed+Waived)/Total); all roles assigned to engagement and Admin can view; progress data matches the data used by P4 prerequisite checks" | R4 |

---

### Section F: Final Readiness — Journey J5 (Gate P4)

*Epic 13 (F13) — primary personas PER-06 (Tom Andrade, PC) and PER-02 (Diana Okafor, EM)*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-13.1 | PER-06 | J5: Review P4 Checklist | See all P4 prerequisites with explicit pass/fail indicators before approving | US-13.1: View Final Readiness Checklist | JTBD-06.1/06.2 → "Checklist visible to EM, PC, QA, and Admin; checklist items: (1) P3 approved, (2) no failed reference checks, (3) no in-review reference checks, (4) no not-started reference checks, (5) no open blockers; each item shows ✓ (pass) or ✗ (fail); failing items show explanation and link to affected records; 'Approve P4' button disabled until all items show ✓" | R4 |
| SM-13.2 | PER-06, PER-02 | J5: Approve P4 | Approve final readiness and set engagement status to Ready for Issuance | US-13.2: Approve Final Readiness at P4 | JTBD-06.1 → "P4 blocked if P3 not approved (HTTP 409); P4 blocked if any reference check is failed/in_review/not_started (HTTP 409); P4 blocked if open blockers exist (HTTP 409); final approval comment required ≥10 chars; approver selects outcome (Ready for Issuance or Closed); successful approval creates GateDecision (P4/approved), updates engagement status and phase, writes GATE_P4_APPROVED; engagement enters read-only state after P4 approval" | R4 |
| SM-13.3 | PER-02 | J5: Approve P4 | Close an engagement that will not be issued | US-13.3: Close Engagement Without Issuance | JTBD-06.1 → "Only EM/Admin can close; closing sets engagement.status=closed and engagement.phase=closed; closed engagement is read-only; all records and audit history remain visible; ENGAGEMENT_CLOSED audit event written" | R4 |
| SM-13.4 | PER-07, PER-02 | J5: Confirm | See the P4 decision reflected across the engagement shell, portfolio dashboard, and engagement detail dashboard | US-13.4: P4 Decision Reflected Across System | JTBD-07.1/07.2 → "P4 gate status card on Engagement Shell updates immediately after approval; engagement status badge updates to 'Ready for Issuance' or 'Closed'; portfolio dashboard reflects updated status immediately; P4 approval records are immutable and permanently visible in audit trail; gate decision history for P4 accessible from gate history view" | R4 |

---
### Section G: Dashboards and Reporting — Journeys J1–J5 (Cross-Cutting)

*Epics 14–15 (F14–F15) — primary personas PER-07 (Sandra Wu, RO), PER-02 (Diana, EM), PER-04 (James, QA)*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-14.1 | PER-07 | All journeys: Observe | Assess portfolio health in seconds with count cards | US-14.1: View Portfolio Summary Count Cards | JTBD-07.1 → "Count cards display Active Engagements, In Planning, In Evidence, In Draft, Ready for Issuance, Closed, High Risk, Pending Requests; counts reflect only authorized engagements; count cards update when filters are applied to the engagement list" | R5 |
| SM-14.2 | PER-02 | All journeys: Observe | Narrow the engagement list to actionable items | US-14.2: Filter the Engagement List | JTBD-07.1 → "Available filters: owner (multi-select), risk level, phase, status, due date range, gate status; filters use AND logic; applied filters persist in URL query parameters; clearing filters returns unfiltered list" | R5 |
| SM-14.3 | PER-07 | All journeys: Observe | Compare engagements at a glance in a sortable table | US-14.3: View Engagement List with Key Columns | JTBD-07.1 → "List columns: Engagement ID, Title, Phase, Status, Owner, Risk Level, Next Milestone, Gate Status (A1/P2/P3/P4), Due Date; all columns sortable; pagination defaults to 25 rows, configurable to 50 or 100; list loads within 3 seconds for ≤100 engagements" | R5 |
| SM-14.4 | PER-07 | All journeys: Export | Export the current engagement list for external briefings | US-14.4: Export Engagement Register to CSV | JTBD-07.1 → "Export available to AL, EM, AN, QA, PC, RO, Admin (IR excluded); CSV includes 14 columns including Engagement ID, Title, Phase, Status, Owner, Risk Level, and all gate status dates; export applies current active filters; ENGAGEMENT_REGISTER_EXPORTED audit event written" | R5 |
| SM-15.1 | PER-02 | All journeys: Open Engagement | See the engagement's current state in one glance | US-15.1: View Phase/Status/Owner Summary | JTBD-02.3 → "Summary section displays current phase, status badge, owner name and role, risk level badge, job code, title, due date, and days until due (or 'Overdue' if past); data is accurate to current state with no stale caching; all roles assigned to the engagement and Admin can view" | R5 |
| SM-15.2 | PER-02 | All journeys: Assess Gates | Know which gates are approved and which are pending without navigating away | US-15.2: View Gate Status Cards on Detail Dashboard | JTBD-02.3 → "Four gate cards displayed (A1, P2, P3, P4); each card shows gate label, status, approver name, decision date, and prerequisite status summary; each card links to full gate history for that gate type; cards reflect most recent gate decision" | R5 |
| SM-15.3 | PER-02 | All journeys: Monitor | Spot at-risk or overdue milestones without navigating to a separate page | US-15.3: View Milestone Timeline | JTBD-02.3 → "Milestone timeline shows four rows: P2 Target, P3 Target, Draft Readiness Target, P4 Target; each row shows target date and status per F05.4 rules; at-risk and overdue milestones are visually distinguished" | R5 |
| SM-15.4 | PER-04 | J3: Open P3 Review | Assess evidence sufficiency before entering the P3 review queue | US-15.4: View Evidence and Objective Progress Metrics | JTBD-04.2 → "Metrics displayed: total evidence items, objectives with evidence, objectives without evidence, evidence sufficiency progress percentage; warning badge appears if any objective has zero linked evidence; metrics update to reflect current state" | R5 |
| SM-15.5 | PER-06 | J4–J5: Monitor Reference Status | Know how close the engagement is to P4 readiness without contacting Carla | US-15.5: View Reference Check Completion Metrics | JTBD-06.2 → "Reference check metrics displayed: total statements, passed, waived, failed, in review, not started, completion % ((Passed+Waived)/Total); progress bar displays completion visually; if no draft product exists: 'Draft product not created yet'; dashboard loads all metrics within 3 seconds for ≤500 evidence items and ≤100 statements" | R5 |
| SM-15.6 | PER-02 | All journeys: Monitor | Know exactly what is preventing the next gate without checking multiple pages | US-15.6: View Open Blockers Panel | JTBD-02.3 → "Blockers panel lists all current blocking conditions; 'No open blockers' shown in green when none exist; each blocker labeled with a link to the affected record; blockers panel always visible (non-collapsible) when blockers exist" | R5 |

---

### Section H: User-Centered Design and Acceptance Tests — Cross-Cutting

*Epics 16–17 (F16–F17) — cross-cutting team artifacts and QA validation*

| SM-ID | Persona | Journey Stage | Activity | Story | Natural Acceptance Criteria | Release |
|-------|---------|--------------|----------|-------|-----------------------------|---------|
| SM-16.1 | PER-02, PER-04 | All journeys: Design | Reference persona definitions for design and requirement decisions | US-16.1: Define and Reference Target Personas | JTBD-02.2 → "Seven personas defined with role title, responsibilities, primary goals, and gate role; personas referenced in feature documentation with Primary/Secondary designations" | R5 |
| SM-16.2 | Dev team | All journeys: Design | Reference primary journey definitions for UX and test alignment | US-16.2: Define Primary User Journeys | JTBD-02.2 → "Five journeys defined (J1–J5) with primary persona, start condition, end condition, and features covered; feature-to-persona mapping table maintained" | R5 |
| SM-16.3 | QA team | All journeys: Test | Reference gate scenarios for acceptance test generation | US-16.3: Map Gate Scenarios for Acceptance Test Generation | JTBD-04.1/04.2/06.1 → "Six gate scenarios documented (S-A1-APPROVE, S-A1-DECLINE, S-P2-APPROVE, S-P2-RETURN, S-P3-APPROVE, S-P4-APPROVE) with positive and negative paths; scenarios linked to acceptance tests in F17" | R5 |
| SM-17.1 | QA team | J1: Test | Validate request submission and A1 gate behavior | US-17.1: Validate A1 Gate Tests | JTBD-01.2 → "8 acceptance tests cover: draft save, complete submission, missing field validation, A1 approval with engagement shell creation, A1 approve without risk level/rationale, A1 decline, A1 decision visible on portfolio dashboard" | R5 |
| SM-17.2 | QA team | J2: Test | Validate engagement setup and P2 gate behavior | US-17.2: Validate P2 Gate Tests | JTBD-02.2/04.1 → "8 acceptance tests cover: objective save, planning record submission, missing prerequisite validation, P2 approval with phase transition, P2 return with comments, post-P2 edit with revision note" | R5 |
| SM-17.3 | QA team | J3: Test | Validate evidence upload and P3 gate behavior | US-17.3: Validate P3 Gate Tests | JTBD-03.1/04.2 → "8 acceptance tests cover: evidence upload with audit event, file size validation, evidence-objective link creation, objective marked sufficient in gap view, P3 approval with phase transition, P3 blocked on evidence gaps, restricted evidence visibility by role" | R5 |
| SM-17.4 | QA team | J4–J5: Test | Validate reference check and P4 gate behavior | US-17.4: Validate P4 Gate Tests | JTBD-05.1/05.2/06.1 → "9 acceptance tests cover: statement creation, IR assignment, IR pass/fail, failed statement in Analyst queue, waiver behavior, P4 approval with status update, P4 blocked on incomplete checks and unmet P3" | R5 |
| SM-17.5 | QA team | All journeys: Test | Validate dashboard visibility and CSV export behavior | US-17.5: Validate Dashboard and Export Tests | JTBD-07.1/07.2 → "7 acceptance tests cover: portfolio dashboard count cards and columns, filter behavior, engagement register CSV export, engagement detail dashboard metrics and blockers, evidence registry CSV export with restricted item exclusion, audit trail display, RO role enforcement" | R5 |

---
## NaC Derivation Table

*Full traceability chain: JTBD Outcome → Journey Stage → Natural Acceptance Criteria → Stories*

Each NaC is derived directly from the JTBD NaC Preview in JTBD-EMS.md, then contextualized for the specific journey stage and mapped to the user stories it governs.

| NaC-ID | JTBD-ID | JTBD Outcome | Journey Stage | Natural Acceptance Criteria (Testable) | Governed Stories |
|--------|---------|-------------|--------------|----------------------------------------|-----------------|
| NaC-01.1 | JTBD-01.1 | Complete intake record submitted in under 5 min | J1: Create / Complete / Submit | Given a new request form, when all required fields are filled and an intake document is attached, then the record is submitted and all field values are persisted; given missing required fields, then HTTP 422 with per-field error messages is returned | US-2.1, US-2.2, US-2.3, US-2.4 |
| NaC-01.2 | JTBD-01.2 | A1 decision creates engagement shell automatically | J1: Decide / Confirm | Given a submitted request, when an Acceptance Lead approves with risk level and rationale, then an engagement shell is created, the request transitions to Accepted, and an audit event records actor, timestamp, and rationale; given a decline with rationale, then request is closed with no engagement created | US-3.1, US-3.2, US-3.3, US-3.4 |
| NaC-01.3 | JTBD-01.3 | All pending requests visible in one view | J1: Survey | Given multiple requests in various statuses, when the Acceptance Lead views the portfolio dashboard, then all requests are listed with current status visible and filterable by status, type, and due date without additional navigation | US-3.1, US-2.5, SM-14.x |
| NaC-02.1 | JTBD-02.1 | Engagement shell set up in under 20 min | J2: Open Shell / Assign Team / Set Milestones | Given a newly accepted engagement, when the Engagement Manager assigns team members and sets milestone dates, then all assignments and dates are saved and visible on the engagement detail page; engagement shell is pre-populated from the accepted request | US-4.1, US-4.2, US-5.1, US-5.2, US-5.3, US-5.4 |
| NaC-02.2 | JTBD-02.2 | Planning record submitted for P2 in one session | J2: Build Planning Record / Submit for P2 | Given an engagement in planning, when the Engagement Manager completes all required planning fields including at least one objective, then the record can be submitted for P2 review in a single action; given missing prerequisites, HTTP 422 with a specific P2_PREREQUISITE_FAILED message is returned | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5, US-7.1 |
| NaC-02.3 | JTBD-02.3 | Blockers and gate status visible on one page | J2–J5: Monitor | Given an active engagement, when the Engagement Manager opens the engagement detail page, then gate status, open blockers, evidence coverage gaps, and reference check completion are all visible without additional navigation; each blocker identifies the specific record affected | US-4.1, US-4.3, US-4.4, US-15.2, US-15.6 |
| NaC-03.1 | JTBD-03.1 | Evidence added and linked to objective in under 3 min | J3: Add Evidence / Link to Objective / Check Gap View | Given an engagement with planning objectives, when the Analyst adds an evidence item with required fields and links it to an objective, then the objective-evidence link is saved and the gap view reflects the updated coverage; objectives with zero evidence are immediately visible in the gap view | US-8.1, US-8.2, US-8.3, US-8.4, US-9.1, US-9.2, US-9.3, US-9.4 |
| NaC-03.2 | JTBD-03.2 | Finding linked to evidence; P3 blocked on gaps | J3: Create Findings / Verify P3 Readiness | Given an engagement approaching P3, when an objective has no linked evidence and the QA Reviewer attempts P3 approval, then the system blocks approval and surfaces the objective as Evidence Needed; when all objectives are sufficient, P3 approval succeeds | US-10.1, US-10.2, US-10.3, US-10.4 |
| NaC-03.3 | JTBD-03.3 | Discrepancy assignment in Analyst queue without email | J4: Add Draft Statements / Monitor Reference Status | Given a statement marked Failed by the Independent Referencer with a discrepancy note, when the assignment is saved, then the statement appears in the Analyst's task queue with statement text, evidence link, and discrepancy note visible; no email is required | US-12.1, US-12.2, US-12.5 |
| NaC-04.1 | JTBD-04.1 | P2 review and decision completed in under 15 min | J2: Open P2 Review / Approve P2 / Return P2 | Given a submitted planning record, when the QA Reviewer opens the P2 review page, then completeness status is shown before review begins and an approve or return decision with comments can be recorded in a single action; all P2 decisions create an audit event with actor, timestamp, and rationale | US-7.1, US-7.2, US-7.3, US-7.4 |
| NaC-04.2 | JTBD-04.2 | P3 blocked if any objective is Evidence Needed | J3: Open P3 Review / Approve P3 | Given an engagement where at least one objective is marked Evidence Needed, when the QA Reviewer attempts P3 approval, then the system blocks approval and identifies the specific objectives causing the block; evidence coverage per objective is visible in the same interface | US-10.3, US-10.4, US-9.3, US-15.4 |
| NaC-04.3 | JTBD-04.3 | Review queue visible without email discovery | J2–J3: Check Queue | Given multiple engagements with P2 or P3 submissions pending, when the QA Reviewer opens the review queue, then all pending submissions are listed with gate type (P2 or P3), engagement title, and submission date visible; sortable by submission date | US-7.1, US-10.4, US-14.1, US-14.3 |
| NaC-05.1 | JTBD-05.1 | Full reference check queue with evidence inline | J4: Open Reference Check Queue / Review First Statements / Mark Passed | Given an engagement in the reference check phase, when the Independent Referencer opens the reference check queue, then all draft statements are listed with evidence links accessible and reference status (Not Started/In Review/Passed/Failed) visible per statement; status can be updated per statement in ≤2 minutes | US-12.3, US-12.4, US-12.7 |
| NaC-05.2 | JTBD-05.2 | Failed statement routes to Analyst queue automatically | J4: Flag Failure / Assign to Analyst | Given a statement marked Failed with a discrepancy note, when the Independent Referencer saves the failed status, then the statement appears in the Analyst's queue automatically with the discrepancy note attached; the Independent Referencer can confirm routing within the same session | US-12.5 |
| NaC-06.1 | JTBD-06.1 | P4 approved with status set automatically | J5: Review P4 Checklist / Approve P4 | Given an engagement where all P4 prerequisites are met, when the Publishing Coordinator approves with comments, then the engagement status is set to Ready for Issuance and an audit event records actor, timestamp, and comment; the system blocks P4 approval if any prerequisite fails | US-13.1, US-13.2, US-13.4 |
| NaC-06.2 | JTBD-06.2 | P4 blocked while any reference check is Failed or In Review | J5: Confirm Reference Checks | Given an engagement with one or more statements in Failed or In Review status, when the Publishing Coordinator attempts P4 approval, then the system blocks approval and identifies the unresolved statements; reference check summary (total/passed/failed/in-review) is visible on the P4 readiness page | US-13.1, US-13.2, US-12.7, US-15.5 |
| NaC-07.1 | JTBD-07.1 | Portfolio dashboard reachable in under 30 sec | All journeys: Observe | Given a logged-in Read-Only Stakeholder, when they navigate to the portfolio dashboard, then all engagements are listed with phase, owner, risk, next milestone, and gate status visible without any drilldown; the dashboard is the default landing page after login and includes one-action CSV export | US-14.1, US-14.2, US-14.3, US-14.4 |
| NaC-07.2 | JTBD-07.2 | Engagement detail answers questions without training | All journeys: Open Engagement Detail | Given a specific engagement, when the Read-Only Stakeholder searches by title and opens the detail page, then current gate status, milestone dates, open blockers, and gate decision history are all visible on one page; the RO role enforces read-only access at the system level | US-15.1, US-15.2, US-15.3, US-15.6, US-0.4 |

---
## Release Planning

---

### Release 1 (R1): MVP Core
**Theme:** Platform shell + request intake + Gate A1 + engagement shell
**Gate Delivered:** A1 (Acceptance)
**Journey Enabled:** J1 complete (Intake and Acceptance) — first complete end-to-end path

#### Stories in R1

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-0.1 | US-0.1: Login to the Application | All | Epic 0 |
| SM-0.2 | US-0.2: Logout of the Application | All | Epic 0 |
| SM-0.3 | US-0.3: Navigate via Main Menu | All | Epic 0 |
| SM-0.4 | US-0.4: Search for Engagements | All | Epic 0 |
| SM-0.5 | US-0.5: View Audit Trail | PER-01, PER-02 | Epic 0 |
| SM-0.6 | US-0.6: Assign User Roles (Admin) | Admin | Epic 0 |
| SM-1.1 | US-1.1: Persistent Core Records | PER-02 | Epic 1 |
| SM-1.2 | US-1.2: Enforce Allowed Values | All | Epic 1 |
| SM-2.1 | US-2.1: Create Draft Request | PER-01 | Epic 2 |
| SM-2.2 | US-2.2: Complete and Submit Request | PER-01 | Epic 2 |
| SM-2.3 | US-2.3: Upload Intake Document | PER-01 | Epic 2 |
| SM-2.4 | US-2.4: Edit Draft Request | PER-01 | Epic 2 |
| SM-2.5 | US-2.5: View Request Detail | PER-01, PER-07 | Epic 2 |
| SM-3.1 | US-3.1: Review Submitted Request for A1 | PER-01 | Epic 3 |
| SM-3.2 | US-3.2: Approve Request at Gate A1 | PER-01 | Epic 3 |
| SM-3.3 | US-3.3: Decline Request at Gate A1 | PER-01 | Epic 3 |
| SM-3.4 | US-3.4: A1 Decision Reflected Across System | PER-02, PER-07 | Epic 3 |
| SM-4.1 | US-4.1: View Engagement Shell | PER-02 | Epic 4 |

**Total: 18 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-01 Marcus Reid (AL) | Full J1 journey: create, edit, submit request; review queue; approve/decline with rationale |
| PER-02 Diana Okafor (EM) | Receives accepted engagement shell; sees A1 decision reflected |
| PER-07 Sandra Wu (RO) | Sees A1 decision status on request detail and portfolio (read-only) |
| Admin | Can assign roles to all seven user types |
| All roles | Platform access: login, logout, navigation, search, audit trail |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-01.1 | Full — complete intake record created, submitted, and documented |
| JTBD-01.2 | Full — A1 approve/decline with rationale, engagement shell auto-created, audit event written |
| JTBD-01.3 | Partial — requests visible in submitted list; full dashboard in R5 |

#### Journey Completeness
- **J1 (Intake and Acceptance):** ✓ Complete — full path from request creation to A1 decision with engagement shell auto-creation
- **J2–J5:** Not yet started — engagement shell view only, no team/planning/evidence/readiness capabilities

#### Release Rationale
R1 establishes the governing framework (login, audit, RBAC) and delivers the first complete end-to-end governance checkpoint (Gate A1). Every downstream release depends on an accepted engagement existing in the system. R1 must ship before any other release is testable.

---
### Release 2 (R2): Planning
**Theme:** Team assignments + milestones + planning record + Gate P2
**Gate Delivered:** P2 (Planning Approval)
**Journey Enabled:** J2 complete (Planning Setup) — second complete end-to-end gate

#### Stories in R2

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-4.2 | US-4.2: Edit Engagement Metadata | PER-02 | Epic 4 |
| SM-4.3 | US-4.3: See Open Blockers on Engagement Shell | PER-02 | Epic 4 |
| SM-4.4 | US-4.4: Navigate to Linked Artifacts | PER-02 | Epic 4 |
| SM-5.1 | US-5.1: Assign Team Members | PER-02 | Epic 5 |
| SM-5.2 | US-5.2: Remove Team Members | PER-02 | Epic 5 |
| SM-5.3 | US-5.3: Set Milestone Target Dates | PER-02 | Epic 5 |
| SM-5.4 | US-5.4: View Milestone Status | PER-02, PER-07 | Epic 5 |
| SM-6.1 | US-6.1: Create Planning Record | PER-02 | Epic 6 |
| SM-6.2 | US-6.2: Add and Manage Objectives | PER-02, PER-03 | Epic 6 |
| SM-6.3 | US-6.3: Complete Planning Sections | PER-02, PER-03 | Epic 6 |
| SM-6.4 | US-6.4: Submit Planning Record for P2 | PER-02 | Epic 6 |
| SM-6.5 | US-6.5: Edit Approved Planning Record | PER-02 | Epic 6 |
| SM-7.1 | US-7.1: Review Planning Record for P2 | PER-04 | Epic 7 |
| SM-7.2 | US-7.2: Approve Planning Baseline at P2 | PER-04 | Epic 7 |
| SM-7.3 | US-7.3: Return Planning Record for Revision | PER-04 | Epic 7 |
| SM-7.4 | US-7.4: P2 Decision Status Visible | PER-02 | Epic 7 |

**Total: 16 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-02 Diana Okafor (EM) | Full J2 journey: complete engagement setup, assign team, set milestones, build planning record, submit for P2, see decision reflected; can edit post-P2 with revision note |
| PER-03 Priya Nair (AN) | Can add and manage objectives and complete planning sections (pre-P2 contribution) |
| PER-04 James Whitfield (QA) | Full P2 review workflow: review queue, completeness checklist, approve or return with comments |
| PER-07 Sandra Wu (RO) | Can see milestone status on engagement detail (read-only) |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-02.1 | Full — engagement shell completed with team and milestones in under 20 minutes |
| JTBD-02.2 | Full — planning record built and submitted for P2 in one session; system blocks incomplete submission |
| JTBD-04.1 | Full — QA Reviewer reviews planning completeness and records P2 decision in single action with audit event |
| JTBD-04.3 | Partial — review queue shows P2 submissions; full dashboard filtering in R5 |

#### Journey Completeness
- **J2 (Planning Setup):** ✓ Complete — full path from engagement setup through P2 approval, including return/resubmit cycle
- **J1:** Already complete from R1
- **J3–J5:** Not yet started

#### Release Rationale
R2 delivers the second governance gate (P2) and enables the engagement to advance to the evidence phase. Evidence collection (R3) depends on having an approved planning baseline with objectives defined. R2 must ship before R3.

---
### Release 3 (R3): Evidence
**Theme:** Evidence registry + objective linking + findings + Gate P3
**Gate Delivered:** P3 (Evidence Sufficiency)
**Journey Enabled:** J3 complete (Evidence Readiness) — third complete end-to-end gate

#### Stories in R3

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-8.1 | US-8.1: Add an Evidence Record | PER-03 | Epic 8 |
| SM-8.2 | US-8.2: Upload Files to Evidence Record | PER-03 | Epic 8 |
| SM-8.3 | US-8.3: Mark Evidence as Restricted | PER-03 | Epic 8 |
| SM-8.4 | US-8.4: View and Filter Evidence List | PER-03, PER-04 | Epic 8 |
| SM-8.5 | US-8.5: Delete Evidence Record | PER-03 | Epic 8 |
| SM-9.1 | US-9.1: Link Evidence to Objectives | PER-03 | Epic 9 |
| SM-9.2 | US-9.2: View Linked Evidence Per Objective | PER-03, PER-04 | Epic 9 |
| SM-9.3 | US-9.3: Identify Evidence Gaps | PER-03, PER-04 | Epic 9 |
| SM-9.4 | US-9.4: Export Evidence Registry to CSV | PER-03, PER-02 | Epic 9 |
| SM-10.1 | US-10.1: Create Finding Record | PER-03 | Epic 10 |
| SM-10.2 | US-10.2: Link Finding to Evidence | PER-03 | Epic 10 |
| SM-10.3 | US-10.3: Mark Objective Evidence Status | PER-04 | Epic 10 |
| SM-10.4 | US-10.4: Approve Evidence Sufficiency at P3 | PER-04 | Epic 10 |

**Total: 13 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-03 Priya Nair (AN) | Full J3 analyst journey: add evidence with metadata, upload files, set sensitivity, link to objectives, check gap view, create findings linked to evidence, export evidence registry to CSV |
| PER-04 James Whitfield (QA) | Full P3 review workflow: view evidence coverage per objective, mark objective evidence status, approve or return P3; evidence sufficiency view with gap indicators |
| PER-02 Diana Okafor (EM) | Can export evidence registry to CSV; sees evidence coverage gaps reflected in open blockers (from R2 blocker logic) |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-03.1 | Full — evidence added with metadata, uploaded, linked to objective, gap view updated; export in one action |
| JTBD-03.2 | Full — findings created and linked to evidence; P3 blocked on evidence gaps; QA sees sufficiency status |
| JTBD-04.2 | Full — evidence coverage per objective visible; P3 blocks on Evidence Needed objectives; P3 decision recorded with audit event |

#### Journey Completeness
- **J3 (Evidence Readiness):** ✓ Complete — full path from evidence upload through objective linking, findings creation, gap identification, and P3 approval
- **J1, J2:** Already complete from R1, R2
- **J4–J5:** Not yet started — draft product and reference checks in R4

#### Release Rationale
R3 delivers the third governance gate (P3) and the full evidence traceability foundation. The draft product and reference check features (R4) depend on evidence items existing and P3 being approved. R3 must ship before R4.

---
### Release 4 (R4): Readiness
**Theme:** Draft product + statement indexing + reference check + Gate P4
**Gate Delivered:** P4 (Final Readiness)
**Journey Enabled:** J4 and J5 complete (Draft Readiness + Final Readiness) — completes the full end-to-end engagement lifecycle

#### Stories in R4

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-11.1 | US-11.1: Create Draft Product Record | PER-02 | Epic 11 |
| SM-11.2 | US-11.2: Attach Draft File | PER-03, PER-02 | Epic 11 |
| SM-11.3 | US-11.3: Record Review Comments on Draft | PER-04, PER-02 | Epic 11 |
| SM-11.4 | US-11.4: Advance Draft Status Through Review Stages | PER-02 | Epic 11 |
| SM-12.1 | US-12.1: Create Draft Statements (Indexing) | PER-03 | Epic 12 |
| SM-12.2 | US-12.2: Link Statements to Evidence | PER-03 | Epic 12 |
| SM-12.3 | US-12.3: Assign Statement for Reference Check | PER-02 | Epic 12 |
| SM-12.4 | US-12.4: Perform Reference Check (Pass or Fail) | PER-05 | Epic 12 |
| SM-12.5 | US-12.5: Assign Failed Statement Back to Analyst | PER-05 | Epic 12 |
| SM-12.6 | US-12.6: Waive a Reference Check | PER-02 | Epic 12 |
| SM-12.7 | US-12.7: View Reference Check Progress | PER-02, PER-06 | Epic 12 |
| SM-13.1 | US-13.1: View Final Readiness Checklist | PER-06 | Epic 13 |
| SM-13.2 | US-13.2: Approve Final Readiness at P4 | PER-06, PER-02 | Epic 13 |
| SM-13.3 | US-13.3: Close Engagement Without Issuance | PER-02 | Epic 13 |
| SM-13.4 | US-13.4: P4 Decision Reflected Across System | PER-07, PER-02 | Epic 13 |

**Total: 15 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-02 Diana Okafor (EM) | Full J4/J5 EM journey: create draft product, advance draft status, assign statements for reference check, waive reference checks, view reference check progress, approve P4, close engagement |
| PER-03 Priya Nair (AN) | Full J4 analyst journey: create draft statements, link to evidence, resolve discrepancy assignments from IR queue |
| PER-04 James Whitfield (QA) | Can add review comments to draft; reviews draft status (QA can return draft to Drafting status) |
| PER-05 Carla Voss (IR) | Full J4 referencer journey: structured reference check queue with evidence inline, mark Passed/Failed/In Review, add discrepancy notes, assign failed statements back to Analyst |
| PER-06 Tom Andrade (PC) | Full J5 journey: view final readiness checklist, confirm reference check completion, approve P4 with comments, see engagement status update to Ready for Issuance |
| PER-07 Sandra Wu (RO) | Sees P4 decision reflected on portfolio dashboard and engagement detail (read-only) |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-03.3 | Full — draft statements linked to evidence in system; discrepancy assignments surface in Analyst queue automatically; no email required |
| JTBD-05.1 | Full — full reference check queue with evidence accessible inline; status updated per statement in ≤2 minutes |
| JTBD-05.2 | Full — failed statement with discrepancy note routed to Analyst queue automatically; Carla can confirm routing in-session |
| JTBD-06.1 | Full — P4 checklist shows all prerequisites; approval sets status to Ready for Issuance and writes audit event automatically |
| JTBD-06.2 | Full — reference check completion visible on P4 page; system blocks approval while any check is Failed or In Review |

#### Journey Completeness
- **J4 (Draft Readiness):** ✓ Complete — full path from draft product creation through statement indexing, reference check assignment, pass/fail/waive, and discrepancy resolution
- **J5 (Final Readiness):** ✓ Complete — full path from P4 checklist review through final approval and status update to Ready for Issuance
- **J1, J2, J3:** Already complete from R1–R3

After R4, the full engagement lifecycle (A1 → P2 → P3 → P4) is operational. All 5 primary journeys are completable.

#### Release Rationale
R4 completes the engagement lifecycle by delivering the terminal governance gate (P4). The reference check workflow (F12) requires evidence items (from R3) and a draft product. Gate P4 requires P3 to be approved. R4 depends on R3 and cannot ship before it.

---
### Release 5 (R5): Dashboards
**Theme:** Portfolio dashboard + engagement detail dashboard + acceptance tests + persona/journey artifacts
**Gate Delivered:** None (dashboards and test validation)
**Journey Enabled:** Full portfolio visibility across J1–J5; acceptance test suite

#### Stories in R5

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-14.1 | US-14.1: View Portfolio Summary Count Cards | PER-07 | Epic 14 |
| SM-14.2 | US-14.2: Filter the Engagement List | PER-02 | Epic 14 |
| SM-14.3 | US-14.3: View Engagement List with Key Columns | PER-07 | Epic 14 |
| SM-14.4 | US-14.4: Export Engagement Register to CSV | PER-07 | Epic 14 |
| SM-15.1 | US-15.1: View Phase/Status/Owner Summary | PER-02 | Epic 15 |
| SM-15.2 | US-15.2: View Gate Status Cards on Detail Dashboard | PER-02 | Epic 15 |
| SM-15.3 | US-15.3: View Milestone Timeline | PER-02 | Epic 15 |
| SM-15.4 | US-15.4: View Evidence and Objective Progress Metrics | PER-04 | Epic 15 |
| SM-15.5 | US-15.5: View Reference Check Completion Metrics | PER-06 | Epic 15 |
| SM-15.6 | US-15.6: View Open Blockers Panel | PER-02 | Epic 15 |
| SM-16.1 | US-16.1: Define and Reference Target Personas | PER-02, PER-04 | Epic 16 |
| SM-16.2 | US-16.2: Define Primary User Journeys | Dev team | Epic 16 |
| SM-16.3 | US-16.3: Map Gate Scenarios for Acceptance Tests | QA team | Epic 16 |
| SM-17.1 | US-17.1: Validate A1 Gate Tests | QA team | Epic 17 |
| SM-17.2 | US-17.2: Validate P2 Gate Tests | QA team | Epic 17 |
| SM-17.3 | US-17.3: Validate P3 Gate Tests | QA team | Epic 17 |
| SM-17.4 | US-17.4: Validate P4 Gate Tests | QA team | Epic 17 |
| SM-17.5 | US-17.5: Validate Dashboard and Export Tests | QA team | Epic 17 |

**Total: 18 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-07 Sandra Wu (RO) | Full portfolio visibility: count cards, sortable engagement list with all key columns, filters, CSV export, engagement detail page with gate history and read-only enforcement |
| PER-02 Diana Okafor (EM) | Engagement detail dashboard with consolidated gate cards, milestone timeline, evidence/reference metrics, and open blockers panel; advanced engagement list filtering |
| PER-04 James Whitfield (QA) | Evidence and objective progress metrics on detail dashboard; review queue filtering on portfolio dashboard |
| PER-06 Tom Andrade (PC) | Reference check completion metrics on detail dashboard, visible from the P4 approach page |
| QA team | Full acceptance test suite covering all gate paths (A1, P2, P3, P4), dashboard visibility, CSV exports, and RBAC enforcement |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-01.3 | Full — all pending requests visible in one filterable view; status always current |
| JTBD-04.3 | Full — single review queue shows all P2/P3 pending submissions with gate type and submission date; sortable |
| JTBD-07.1 | Full — portfolio dashboard reachable after login; all engagements listed with phase, owner, risk, milestone, gate status; CSV export in one action |
| JTBD-07.2 | Full — engagement detail page shows gate status, milestones, blockers, gate decision history; read-only enforced by role |
| JTBD-02.3 | Enhanced — engagement detail dashboard provides consolidated gate cards, milestone timeline, evidence progress metrics, and open blockers panel in one view |

#### Journey Completeness
- All five journeys (J1–J5) already complete from R1–R4
- R5 adds the observational and reporting layer: portfolio dashboard (visible to all roles), engagement detail dashboard (consolidated view for EM, QA, PC, RO), and acceptance test coverage
- R5 enables Sandra Wu (PER-07) to have a fully self-service experience that was not possible in R1–R4

#### Release Rationale
Dashboards (F14, F15) are classified as P1 (High) in the PRD and depend on engagement data from all prior releases to be meaningful. Acceptance tests (F17) validate the complete system built in R1–R4. R5 is the final release and delivers the reporting and validation layer on top of a fully operational lifecycle system.

---
## Coverage Analysis

---

### Persona Coverage by Release

| Persona | R1 MVP Core | R2 Planning | R3 Evidence | R4 Readiness | R5 Dashboards |
|---------|-------------|-------------|-------------|--------------|---------------|
| **PER-01** Marcus Reid (AL) | ✓ Primary (J1 complete) | — | — | — | ✓ Extended (dashboard view) |
| **PER-02** Diana Okafor (EM) | ✓ Receives shell | ✓ Primary (J2 complete) | ✓ Evidence export | ✓ Primary (J4, J5) | ✓ Extended (detail dashboard) |
| **PER-03** Priya Nair (AN) | — | ✓ Planning contributions | ✓ Primary (J3 complete) | ✓ Primary (indexing, discrepancy) | — |
| **PER-04** James Whitfield (QA) | — | ✓ Primary (P2 review) | ✓ Primary (P3 review) | ✓ Draft comments | ✓ Extended (metrics) |
| **PER-05** Carla Voss (IR) | — | — | — | ✓ Primary (J4 reference check) | — |
| **PER-06** Tom Andrade (PC) | — | — | — | ✓ Primary (J5 complete) | ✓ Extended (ref check metrics) |
| **PER-07** Sandra Wu (RO) | ✓ Partial (request detail) | ✓ Milestone status | — | ✓ P4 status visible | ✓ Primary (full dashboard) |
| **Admin** | ✓ User management | — | — | — | — |

**All 7 personas are served by R4.** R5 enhances the experience for PER-07 (primary dashboard consumer) and all monitoring personas.

---

### JTBD Coverage by Release

| JTBD-ID | Summary | R1 | R2 | R3 | R4 | R5 |
|---------|---------|----|----|----|----|-----|
| JTBD-01.1 | Complete intake in ≤5 min | ✓ Full | — | — | — | — |
| JTBD-01.2 | A1 decision with rationale, auto engagement shell | ✓ Full | — | — | — | — |
| JTBD-01.3 | All pending requests in one view | Partial | — | — | — | ✓ Full |
| JTBD-02.1 | Engagement shell set up ≤20 min | Partial (shell created) | ✓ Full | — | — | — |
| JTBD-02.2 | Planning baseline submitted for P2 in one session | — | ✓ Full | — | — | — |
| JTBD-02.3 | Gate status and blockers visible on one page | Partial (shell) | Partial (blocker logic) | Partial | Partial | ✓ Full (detail dashboard) |
| JTBD-03.1 | Evidence added and linked in ≤3 min; gap view | — | — | ✓ Full | — | — |
| JTBD-03.2 | Findings linked to evidence; P3 blocked on gaps | — | — | ✓ Full | — | — |
| JTBD-03.3 | Discrepancy in Analyst queue without email | — | — | — | ✓ Full | — |
| JTBD-04.1 | P2 review and decision ≤15 min, one action | — | ✓ Full | — | — | — |
| JTBD-04.2 | P3 blocked if any objective Evidence Needed | — | — | ✓ Full | — | — |
| JTBD-04.3 | Review queue without email discovery | — | Partial | Partial | — | ✓ Full |
| JTBD-05.1 | Full reference check queue with evidence inline | — | — | — | ✓ Full | — |
| JTBD-05.2 | Failed statement routes to Analyst queue automatically | — | — | — | ✓ Full | — |
| JTBD-06.1 | P4 approved with status set automatically | — | — | — | ✓ Full | — |
| JTBD-06.2 | P4 blocked while ref check Failed or In Review | — | — | — | ✓ Full | — |
| JTBD-07.1 | Portfolio dashboard reachable ≤30 sec | — | — | — | — | ✓ Full |
| JTBD-07.2 | Engagement detail answers questions without training | — | — | — | — | ✓ Full |

**All 18 JTBD outcomes are fully addressed by the end of R5.**

---

### Gap Analysis

#### Journey Stages Without Coverage

No journey stages are without coverage. All five primary journeys (J1–J5) are fully mapped:
- **J1 (Intake and Acceptance):** 9 stories — fully covered in R1
- **J2 (Planning Setup):** 16 stories — fully covered in R2
- **J3 (Evidence Readiness):** 13 stories — fully covered in R3
- **J4 (Draft Readiness):** 11 stories — fully covered in R4
- **J5 (Final Readiness):** 4 stories — fully covered in R4
- **Platform (Cross-cutting):** 8 stories — covered in R1
- **Dashboards (Cross-cutting):** 10 stories — covered in R5
- **Artifacts/Tests (Cross-cutting):** 8 stories — covered in R5

#### JTBD Without Stories

No JTBD outcomes are without associated stories. All 18 JTBD outcomes from JTBD-EMS.md map to at least one NaC derivation and are governed by at least two user stories.

#### Orphan Stories (Stories Not Mapped to a Journey Stage)

**No orphan stories.** All 79 user stories (US-0.1 through US-17.5) are placed in the story map matrix in one of the following sections:
- Section A (Platform Foundation): 8 stories (US-0.1–0.6, US-1.1–1.2)
- Section B (J1 Intake and Acceptance): 9 stories (US-2.1–2.5, US-3.1–3.4)
- Section C (J2 Planning Setup): 16 stories (US-4.1–4.4, US-5.1–5.4, US-6.1–6.5, US-7.1–7.4)
- Section D (J3 Evidence Readiness): 13 stories (US-8.1–8.5, US-9.1–9.4, US-10.1–10.4)
- Section E (J4 Draft Readiness): 11 stories (US-11.1–11.4, US-12.1–12.7)
- Section F (J5 Final Readiness): 4 stories (US-13.1–13.4)
- Section G (Dashboards): 10 stories (US-14.1–14.4, US-15.1–15.6)
- Section H (Artifacts/Tests): 8 stories (US-16.1–16.3, US-17.1–17.5)
- **Total: 79 stories ✓**

#### JTBD Outcomes That Are Partially Addressed in Early Releases

The following outcomes have partial coverage in early releases and reach full coverage in a later release:
- **JTBD-01.3** (pending requests in one view): Partial in R1 (request list view); Full in R5 (portfolio dashboard with filters)
- **JTBD-02.3** (gate status and blockers visible): Partial in R1 (shell view) and R2 (blocker logic); Full in R5 (engagement detail dashboard with all metrics)
- **JTBD-04.3** (review queue without email): Partial in R2/R3 (separate review queue per gate); Full in R5 (unified portfolio dashboard with review queue filter)

This is expected and acceptable — each release delivers a complete gate journey while the dashboard layer accumulates data across all prior releases.

---
## NaC-to-Acceptance Criteria Mapping

*Verifies that each Natural Acceptance Criteria aligns with the testable acceptance criteria in UserStories-EMS.md.*

| NaC-ID | NaC Statement (Key Clause) | Governed Stories | UserStory AC Alignment | Status |
|--------|---------------------------|-----------------|----------------------|--------|
| NaC-01.1 | Complete intake record submitted ≤5 min; missing fields return HTTP 422 with per-field errors | US-2.1, US-2.2, US-2.3, US-2.4 | US-2.2 AC: "Submission requires all fields; missing required fields return HTTP 422 with per-field error messages." US-2.3 AC: "Audit event REQUEST_DOCUMENT_UPLOADED written on successful upload." | ✓ Aligned |
| NaC-01.2 | A1 approve creates engagement shell + audit event; decline creates GateDecision with no shell | US-3.1, US-3.2, US-3.3, US-3.4 | US-3.2 AC: "Successful approval creates a GateDecision record and an Engagement record; audit event GATE_A1_APPROVED written." US-3.3 AC: "Successful decline creates a GateDecision record; no Engagement Shell created; GATE_A1_DECLINED written." | ✓ Aligned |
| NaC-01.3 | All requests listed with current status and filterable; no additional navigation | US-3.1, US-2.5 | US-3.1 AC: "Review Queue shows all requests with status=submitted; only AL role sees A1 decision controls." | ✓ Aligned (extended by R5 dashboard) |
| NaC-02.1 | Engagement shell pre-populated; team and milestones saved and visible | US-4.1, US-4.2, US-5.1, US-5.2, US-5.3, US-5.4 | US-4.1 AC: "Shell page displays job code, title, phase, status, risk level, owner, gate status cards, open blockers, linked artifact counts." US-5.3 AC: "Milestone dates in chronological order enforced; MILESTONES_UPDATED written." | ✓ Aligned |
| NaC-02.2 | Planning record submitted for P2 in one action; missing prerequisites return HTTP 422 | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5, US-7.1 | US-6.4 AC: "Submission requires ≥1 objective, non-empty risk notes, data reliability notes, independence status, owner, ≥1 QA Reviewer, ≥1 milestone date; each missing prerequisite returns HTTP 422 with specific P2_PREREQUISITE_FAILED error." | ✓ Aligned |
| NaC-02.3 | Gate status, blockers, evidence gaps, reference progress all visible without additional navigation | US-4.1, US-4.3, US-4.4, US-15.2, US-15.6 | US-4.3 AC: "Blockers list dynamically computed; each blocker identifies specific record affected; 'No open blockers' shown when none exist." US-15.2 AC: "Four gate cards with status, approver, date, prerequisite status summary." | ✓ Aligned |
| NaC-03.1 | Evidence added with metadata, uploaded, linked to objective; gap view updated | US-8.1, US-8.2, US-8.3, US-8.4, US-9.1, US-9.2, US-9.3, US-9.4 | US-8.1 AC: "Required fields enforced; EVIDENCE_ITEM_CREATED written; immediately visible in evidence list." US-9.3 AC: "Gap view shows objectives with zero linked evidence; evidence_needed objectives flagged as P3 blockers." | ✓ Aligned |
| NaC-03.2 | Findings linked to evidence; P3 blocked when any objective has status=evidence_needed | US-10.1, US-10.2, US-10.3, US-10.4 | US-10.4 AC: "P3 cannot be approved if any objective has status=evidence_needed; P3 cannot be approved if any objective has zero linked evidence; P3 cannot be approved if any finding has zero evidence links." | ✓ Aligned |
| NaC-03.3 | Failed statement appears in Analyst queue with statement text, evidence link, discrepancy note | US-12.1, US-12.2, US-12.5 | US-12.5 AC: "Failed statements appear in Analyst's queue for correction; Analyst can update statement text or evidence links; REFERENCE_FAILED_DISCREPANCY written when statement is failed with discrepancy notes." | ✓ Aligned |
| NaC-04.1 | Completeness status shown before review; approve or return recorded in single action with audit event | US-7.1, US-7.2, US-7.3, US-7.4 | US-7.1 AC: "P2 prerequisite checklist displayed with pass/fail indicators." US-7.2 AC: "Approval comment required ≥10 chars; GATE_P2_APPROVED written; non-QA returns HTTP 403." | ✓ Aligned |
| NaC-04.2 | P3 blocked if any objective Evidence Needed; specific objectives identified in the block message | US-10.3, US-10.4, US-9.3, US-15.4 | US-10.4 AC: "P3 cannot be approved if any objective has status=evidence_needed (returns HTTP 409)." US-10.3 AC: "Cannot mark in_review or sufficient if zero linked evidence items (returns HTTP 422)." | ✓ Aligned |
| NaC-04.3 | Review queue lists all P2/P3 pending submissions with gate type and submission date; sortable | US-7.1, US-10.4, US-14.1, US-14.3 | US-7.1 AC: "QA Reviewer navigates to Review Queue and sees planning records with status=ready_for_review." | ✓ Aligned (full queue sorting in R5) |
| NaC-05.1 | All draft statements in queue with evidence accessible inline; status updated per statement in ≤2 min | US-12.3, US-12.4, US-12.7 | US-12.4 AC: "IR can access linked evidence files directly from statement review interface; REFERENCE_STATUS_CHANGED written on each change." | ✓ Aligned |
| NaC-05.2 | Failed statement with discrepancy note in Analyst queue automatically; IR can confirm routing in-session | US-12.5 | US-12.5 AC: "Failed statements appear in Analyst's queue for correction; IR's Review Queue surfaces the revised statement for re-check." | ✓ Aligned |
| NaC-06.1 | P4 checklist shows all prerequisites; approval sets status to Ready for Issuance with audit event | US-13.1, US-13.2, US-13.4 | US-13.1 AC: "Checklist items: P3 approved, no failed/in-review/not-started ref checks, no open blockers; 'Approve P4' disabled until all items show ✓." US-13.2 AC: "Successful approval creates GateDecision (P4/approved), updates status and phase, writes GATE_P4_APPROVED." | ✓ Aligned |
| NaC-06.2 | P4 blocked while any reference check is Failed or In Review; reference check summary visible on P4 page | US-13.1, US-13.2, US-12.7, US-15.5 | US-13.2 AC: "P4 cannot be approved if any reference check is failed, in_review, or not_started (returns HTTP 409)." US-12.7 AC: "Reference check progress view shows total, by-status counts, and completion percentage." | ✓ Aligned |
| NaC-07.1 | Portfolio dashboard is default landing; all engagements listed with required columns; CSV export one action | US-14.1, US-14.2, US-14.3, US-14.4 | US-14.3 AC: "List columns include Engagement ID, Title, Phase, Status, Owner, Risk Level, Next Milestone, Gate Status, Due Date; loads within 3 seconds for ≤100 engagements." US-14.4 AC: "ENGAGEMENT_REGISTER_EXPORTED written on export." | ✓ Aligned |
| NaC-07.2 | Engagement detail page shows gate status, milestones, blockers, gate history; RO read-only enforced | US-15.1, US-15.2, US-15.3, US-15.6, US-0.4 | US-15.2 AC: "Four gate cards with status, approver, decision date, prerequisite status summary." US-15.6 AC: "Blockers panel always visible when blockers exist; each blocker labeled with link to affected record." | ✓ Aligned |

**Result: All 18 NaC are aligned with acceptance criteria in UserStories-EMS.md. No misalignments detected.**

---

## Validation Checklist

- [x] Every UserStory (US-0.1 through US-17.5) appears in the map — **79 stories mapped, 0 orphans**
- [x] Every mapped story has a NaC derived from a specific JTBD outcome
- [x] NaC Derivation Table has full traceability chains (JTBD-ID → Journey Stage → NaC text → Stories)
- [x] Release planning groups are defined — 5 releases, each with theme, gate, and stories
- [x] Each release enables at least one complete journey (R1=J1, R2=J2, R3=J3, R4=J4+J5, R5=full dashboard layer)
- [x] Coverage analysis identifies gaps, orphans, and partial JTBD coverage across releases
- [x] NaC-to-Acceptance Criteria mapping verifies alignment between NaC and UserStory ACs
- [x] All 18 JTBD outcomes are addressed
- [x] No JTBD outcomes without associated NaC
- [x] No journey stages without coverage

---

*Document generated: 2026-06-05*
*Source artifacts: PERSONAS-EMS.md v1.0, JTBD-EMS.md v1.0, JOURNEYS-EMS.md v1.0, UserStories-EMS.md v1.0, PRD-EMS.md v1.0*
*Release structure: Gate-sequenced A1 → P2 → P3 → P4 per PROJECT.md*
*Downstream consumers: Sprint planning, UX design, acceptance test scripts, stakeholder briefings*
