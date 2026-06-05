# Product Requirements Document (PRD)
## Lightweight Engagement Management System (EMS)

**Project Acronym:** EMS
**Version:** 1.0
**Date:** 2026-06-04
**Status:** Active

---

## 1. Executive Summary

The Lightweight Engagement Management System (EMS) is a web-based application for managing a basic engagement lifecycle from request intake through final readiness. It provides a simple, governed workflow for capturing engagement requests, approving accepted engagements, setting up planning artifacts, collecting evidence, linking evidence to objectives, and preparing a draft product for final readiness review.

The system is designed for teams that currently rely on disconnected documents, folders, emails, and spreadsheets to coordinate engagement work. The initial release focuses on a narrow but complete end-to-end slice — from request capture through Gate A1 (acceptance), Gate P2 (planning approval), Gate P3 (evidence sufficiency), and Gate P4 (final readiness) — delivering a working system of record without requiring a full enterprise platform.

### 1.1 Core Capabilities

- **Request Intake** — Capture request type, requester, topic, agency or program, due date, and supporting intake document
- **Acceptance Governance** — Approve or decline an engagement using Gate A1 with rationale and timestamp
- **Engagement Shell** — Single system-of-record page for job code, title, phase, risk level, owner, team, milestones, and status
- **Basic Planning** — Capture objectives, design approach, schedule, risk notes, data reliability notes, and independence affirmations
- **Planning Approval** — Approve the planning baseline using Gate P2
- **Evidence Registry** — Upload evidence items with source, date, type, and sensitivity flag
- **Evidence Traceability** — Link evidence to objectives and mark evidence sufficiency using Gate P3
- **Draft Product Tracking** — Create and update a simple draft product record with review status and comments
- **Basic Indexing and Reference Check** — Link draft statements to supporting evidence and record independent reference status
- **Final Readiness** — Complete Gate P4 when required references are complete and final review has no open blockers
- **Dashboard Views** — Portfolio and engagement-level status visibility
- **Audit Trail** — Capture key changes, approvals, and gate decisions

### 1.2 Core Value

A simple engagement workflow with persistent records, clear status, role-based actions, and basic traceability from request to evidence-supported final readiness.

---

## 1.3 Key Terminology

| Term | Definition |
|------|------------|
| **Engagement** | A structured body of work performed in response to a request, mandate, or internal decision. |
| **Request** | The intake record that initiates the engagement workflow. |
| **Engagement Shell** | The main record for an accepted engagement, including metadata, phase, status, owner, team, milestones, and artifacts. |
| **Gate A1** | Acceptance approval gate. Passing A1 creates an engagement shell. |
| **Gate P2** | Planning approval gate. Passing P2 locks the lightweight planning baseline. |
| **Gate P3** | Evidence readiness gate. Passing P3 confirms evidence is sufficient to proceed to draft readiness work. |
| **Gate P4** | Final readiness gate. Passing P4 confirms reference checks and final review are complete. |
| **Planning Baseline** | The approved set of objectives, design approach, schedule, risk notes, data reliability notes, and independence affirmations. |
| **Objective** | A research question or work objective that evidence and findings must support. |
| **Evidence Item** | A document, dataset, interview note, or other item collected to support engagement objectives. |
| **Finding** | A draft conclusion or observation supported by evidence. |
| **Draft Product** | A working report or product record prepared from findings and reviewed before final readiness. |
| **Indexing** | Linking a draft statement or finding to supporting evidence. |
| **Reference Check** | Independent verification that indexed statements are supported by the linked evidence. |
| **Audit Event** | A timestamped record of an important action, such as approval, status change, upload, or review decision. |

---

## 1.4 Scope and Non-Goals

### In Scope

- Basic web application for engagement intake, tracking, and status management
- Request intake for congressional requests, mandates, and internal proposals
- Acceptance decision workflow with Gate A1 approval or decline
- Engagement shell with core metadata and status
- Team assignment for a defined set of roles
- Basic milestone tracking
- Lightweight planning artifacts: objectives, design approach, schedule, risk notes, data reliability notes, and independence affirmations
- Gate P2 planning approval
- Evidence registry with upload metadata
- Evidence-to-objective linking
- Evidence sufficiency status and Gate P3 readiness
- Basic draft product record
- Basic indexing and independent reference check
- Gate P4 final readiness
- Portfolio dashboard and engagement detail dashboard
- Audit trail for important workflow actions
- CSV export for engagement list and evidence registry

### Out of Scope

- Full enterprise records management
- Full public website publishing workflow
- Advanced agency comment deadline automation
- Complex reminder, escalation, and policy-engine behavior
- Full sentence-by-sentence report production workflow
- Full legal or methodology review case management
- Full recommendation tracking after issuance
- Full classified product workflow
- Full records request workflow
- Full cost accounting or labor integration
- Advanced analytics or forecasting
- External system synchronization beyond simple CSV export
- Automated duplicate detection
- Advanced document generation beyond basic templates

---

## 2. Problem Statement

Engagement work requires coordination across request intake, acceptance, planning, evidence collection, review, and readiness decisions. Without a simple system of record, teams must rely on disconnected documents, folders, emails, and spreadsheets. This creates unclear ownership, inconsistent status, limited traceability, and manual effort when preparing for reviews.

The product must provide a lightweight but persistent workflow that allows users to create an engagement, move it through basic gates, maintain evidence links, and see current status without requiring a full enterprise platform.

### 2.1 Current Pain Points

1. **Fragmented intake records** — Request details and supporting materials are scattered across files or messages with no single source of truth.
2. **Unclear acceptance status** — Teams have no simple way to know whether an engagement is pending, accepted, or declined.
3. **Manual engagement setup** — Core engagement metadata, team members, and milestones need to be entered and viewed in one place.
4. **Planning artifacts lack a simple baseline** — Objectives, schedule, risk, and data reliability notes need a basic approval point before work proceeds.
5. **Evidence is hard to connect to objectives** — Users need an easy way to upload evidence and link it to the work it supports.
6. **Readiness decisions are not always visible** — Gate status should be easy to see and tied to who approved it and when.
7. **Draft support can be unclear** — Draft findings need basic linkage to evidence before final readiness.
8. **Manual status reporting** — Leads need a simple dashboard for phase, risk, owner, milestone, and gate status.
9. **Limited auditability** — Important decisions should create durable timestamped records visible to authorized stakeholders.

### 2.2 Target Users

| Persona | Description |
|---------|-------------|
| **Engagement Acceptance Lead** | Reviews incoming requests, prepares acceptance decision packages, and approves or declines engagements. |
| **Engagement Manager** | Owns the engagement after acceptance, manages team setup, planning, milestones, evidence readiness, and gate submissions. |
| **Analyst** | Uploads evidence, links evidence to objectives, drafts findings, and supports indexing. |
| **QA Reviewer** | Reviews planning completeness, evidence sufficiency, and gate readiness. |
| **Independent Referencer** | Reviews whether draft statements are supported by linked evidence. |
| **Publishing Coordinator** | Reviews final readiness fields and marks the product ready after Gate P4 is complete. |
| **Read-Only Stakeholder** | Views engagement status, phase, milestones, and readiness without editing records. |
| **Admin** | Manages users, roles, and system configuration. |

### 2.3 Primary User Journeys

| Journey | Primary Persona | Outcome |
|---------|-----------------|---------|
| **Intake and acceptance** | Engagement Acceptance Lead | A request is recorded and either accepted into an engagement shell or declined with rationale. |
| **Planning setup** | Engagement Manager | The accepted engagement has objectives, milestones, roles, and a lightweight approved planning baseline. |
| **Evidence readiness** | Analyst and QA Reviewer | Evidence is uploaded, linked to objectives, and marked sufficient or needing work. |
| **Draft readiness** | Analyst and Independent Referencer | Draft findings are linked to evidence and reference status is completed. |
| **Final readiness** | Engagement Manager and Publishing Coordinator | The engagement reaches final readiness through Gate P4 with no open blockers. |

**Business rules applicable to all journeys:**
- Each engagement must have an owner.
- Each engagement must have a current phase and status.
- Each gate decision must record approver, date/time, status, and rationale or comment.
- Each evidence item must include source, date received, and evidence type.
- Each draft finding must link to at least one evidence item before final readiness.

---

## 3. Product Vision

The product vision is to provide a simple, end-to-end engagement management workflow that gives teams one place to track intake, planning, evidence, findings, gates, and readiness.

The product should be easy to understand, easy to navigate, and focused on a small number of meaningful actions. It should not try to replace all external documents, publishing systems, or enterprise collaboration tools. Instead, it should provide enough structured workflow and traceability to manage a basic engagement from request to final readiness.

### 3.1 Strategic Goals

1. **Simple end-to-end workflow** — Support the full basic path from request intake to final readiness.
2. **Single engagement record** — Keep core engagement metadata, phase, owner, risk, team, milestones, and gate state in one place.
3. **Visible governance** — Make Gate A1, P2, P3, and P4 status visible and auditable.
4. **Basic evidence traceability** — Allow users to link evidence to objectives and findings.
5. **Minimal role separation** — Provide separate actions for acceptance, management, analysis, QA review, and reference check without excessive complexity.
6. **Fast status reporting** — Provide a dashboard that shows current phase, risk, owner, and blockers.
7. **Low operational complexity** — Avoid advanced automation and integrations until the basic workflow is stable.
8. **Expandable foundation** — Use simple data structures that can later support more advanced workflow, comments, publishing, records, and reporting features.

---

## 4. Technical Architecture

### 4.1 Tech Stack

| Layer | Technology / Approach |
|-------|------------------------|
| **Frontend** | React or equivalent web UI framework |
| **Backend** | REST API or equivalent service layer |
| **Database** | Relational database for engagement, artifact, evidence, gate, and audit records |
| **File Storage** | Local or managed file storage for intake documents, evidence files, and draft attachments |
| **Authentication** | Built-in username/password or organization identity provider |
| **Authorization** | Role-based access control at user and engagement levels |
| **Export** | CSV export for engagement register and evidence registry |
| **Audit Logging** | Application-level audit table for important workflow events |

### 4.2 Deployment Model

| Model | Description |
|-------|-------------|
| **Single-tenant web application** | One organization uses the application as a dedicated instance. |
| **Containerized deployment** | Application is deployed as a containerized service with a database and file storage volume. |
| **Local development deployment** | Developers can run the frontend, backend, database, and file storage locally for development and testing. |

---

## 5. Feature Requirements

### 5.1 Platform Infrastructure

---

#### F0: Basic Application Shell

**Description:** Provide a web application shell for authenticated users to access dashboards, engagement records, forms, and review queues. This is the foundational scaffolding every other feature depends on.

**Capabilities:**
- Login and logout
- User role assignment
- Main navigation: Dashboard, Requests, Engagements, Evidence, Review Queue, Reports
- Basic search by engagement ID, title, requester, phase, and owner
- Audit trail view for each engagement

**Priority:** P0 (Critical — MVP requirement)

---

#### F1: Core Data Objects

**Description:** Maintain a small set of persistent entities required for the basic engagement lifecycle. All other features create, read, update, or relate these objects.

**Capabilities:**
- Request
- Engagement
- Team Assignment
- Planning Record
- Objective
- Evidence Item
- Finding
- Draft Product
- Gate Decision
- Audit Event

**Required Fields by Entity:**

| Entity | Required Fields |
|--------|-----------------|
| **Request** | Request ID, request type, requester, topic, agency/program, due date, status, intake document |
| **Engagement** | Engagement ID, job code, title, phase, status, risk level, owner, portfolio, created date |
| **Team Assignment** | User, role, engagement, assignment date |
| **Planning Record** | Objectives summary, design approach, schedule notes, risk notes, data reliability notes, independence status |
| **Objective** | Objective ID, objective text, information need, status |
| **Evidence Item** | Evidence ID, type, source, date received, sensitivity flag, linked objective, upload reference |
| **Finding** | Finding ID, finding text, linked evidence, status |
| **Draft Product** | Draft ID, engagement, version, status, review comments |
| **Gate Decision** | Gate type, status, approver, date/time, rationale/comment |
| **Audit Event** | Actor, action, object, timestamp, before/after summary |

**Priority:** P0 (Critical — MVP requirement)

---

### 5.2 Intake and Acceptance

---

#### F2: Request Intake

**Description:** Allow an Engagement Acceptance Lead to create and edit a request record. The request is the starting point of every engagement and must capture enough information for an informed acceptance decision.

**Capabilities:**
- Capture request type: congressional request, mandate, or internal proposal
- Capture requester, topic, agency/program, due date, and notes
- Upload one intake document
- Save request as Draft or Submitted
- Validate required fields before submission

**Priority:** P0 (Critical — MVP requirement)

---

#### F3: Acceptance Decision — Gate A1

**Description:** Allow an authorized user to approve or decline a submitted request. Gate A1 is the first formal governance checkpoint. Approval automatically creates an engagement shell; decline closes the request with rationale.

**Capabilities:**
- Review submitted request details
- Record risk level: Low, Medium, or High
- Approve with rationale
- Decline with rationale
- Create engagement shell automatically on approval
- Write audit event for all A1 decisions

**Acceptance Criteria:**
- A submitted request cannot pass A1 without all required fields present.
- A1 approval creates an engagement shell and transitions the request to Accepted status.
- A1 decline closes the request and records rationale.
- A1 decision is visible in the portfolio dashboard and audit trail.

**Priority:** P0 (Critical — MVP requirement)

---

### 5.3 Engagement Setup and Planning

---

#### F4: Engagement Shell

**Description:** Provide a central page for managing core engagement information after Gate A1 approval. The engagement shell is the primary system-of-record record that all downstream artifacts, gates, and dashboards reference.

**Capabilities:**
- Display job code, title, phase, status, owner, risk level, portfolio, and milestones
- Edit basic metadata by authorized roles
- Show current gate status for A1, P2, P3, and P4
- Show open blockers
- Show linked artifacts, evidence, findings, and draft product

**Priority:** P0 (Critical — MVP requirement)

---

#### F5: Team and Milestones

**Description:** Allow the Engagement Manager to assign a small team and set basic milestone dates. Role clarity is essential for gate approvals and workflow routing.

**Capabilities:**
- Assign users to predefined roles
- Set milestone dates for planning approval, evidence readiness, draft readiness, and final readiness
- View milestone status as Not Started, On Track, At Risk, or Complete

**Priority:** P0 (Critical — MVP requirement)

---

#### F6: Lightweight Planning Record

**Description:** Capture enough planning detail to define scope, objectives, schedule, risk, and evidence approach. The planning record serves as the baseline that Gate P2 approves and locks.

**Capabilities:**
- Add one or more objectives
- Capture design approach
- Capture risk notes
- Capture data reliability notes
- Capture independence affirmation status for assigned team members
- Save planning record as Draft or Ready for Review

**Priority:** P0 (Critical — MVP requirement)

---

#### F7: Planning Approval — Gate P2

**Description:** Allow a QA Reviewer to approve the lightweight planning baseline. Gate P2 locks the planning record, creating an approved baseline against which all subsequent evidence and findings work is measured.

**Capabilities:**
- Review planning record completeness
- Approve planning baseline
- Return planning record for revision with comments
- Lock approved planning record from normal edits
- Write audit event for approval or return

**Acceptance Criteria:**
- P2 cannot pass until at least one objective exists.
- P2 cannot pass until all of the following are present: an owner assigned to the engagement, at least one Engagement Manager on the team, at least one QA Reviewer on the team, at least one milestone date set, non-empty risk notes, non-empty data reliability notes, and independence status set.
- After P2 approval, changes to the planning record require a new revision note.

**Priority:** P0 (Critical — MVP requirement)

---

### 5.4 Evidence and Findings

---

#### F8: Evidence Registry

**Description:** Allow Analysts to add evidence records and upload supporting files. The evidence registry provides the traceable foundation for all findings, indexing, and reference checks.

**Capabilities:**
- Add evidence type: document, dataset, interview note, meeting note, or other
- Capture source, date received, custodian or provider, and description
- Mark sensitivity flag: Standard or Restricted
- Upload one or more files per evidence item
- View evidence list by engagement

**Priority:** P0 (Critical — MVP requirement)

---

#### F9: Evidence-to-Objective Link

**Description:** Allow users to link evidence items to planning objectives, providing traceability from objectives through evidence and enabling gap identification before Gate P3.

**Capabilities:**
- Link one evidence item to one or more objectives
- Display linked evidence under each objective
- Show objectives with no linked evidence (gap view)
- Export evidence registry to CSV

**Priority:** P0 (Critical — MVP requirement)

---

#### F10: Findings and Sufficiency — Gate P3

**Description:** Allow the team to record basic findings and determine whether evidence is sufficient to proceed to draft readiness work. Gate P3 confirms that no objective has an evidence gap.

**Capabilities:**
- Create finding records
- Link findings to evidence items
- Mark each objective as Evidence Needed, In Review, or Sufficient
- Record QA Reviewer approval for P3
- Block P3 if any objective is still marked Evidence Needed

**Acceptance Criteria:**
- Each finding must link to at least one evidence item.
- P3 cannot pass if any objective has no linked evidence.
- P3 cannot pass if any objective is marked Evidence Needed.
- P3 approval records approver, date/time, and comment.

**Priority:** P0 (Critical — MVP requirement)

---

### 5.5 Draft Product and Final Readiness

---

#### F11: Draft Product Record

**Description:** Provide a simple draft product record tied to the engagement, allowing the team to track the working product through review stages before reference check and final readiness.

**Capabilities:**
- Create a draft product record
- Capture draft title, version, owner, and status
- Attach draft file or draft notes
- Record review comments
- Set draft status: Drafting, Under Review, Ready for Reference Check, Ready for Final Review

**Priority:** P0 (Critical — MVP requirement)

---

#### F12: Basic Indexing and Reference Check

**Description:** Allow draft findings or statements to be linked to evidence and independently checked. This is the core traceability step before Gate P4 can be approved.

**Capabilities:**
- Add draft statement records
- Link each statement to one or more evidence items
- Mark reference status: Not Started, In Review, Passed, or Failed
- Capture discrepancy notes when reference status is Failed
- Assign discrepancy back to Analyst for correction

**Priority:** P0 (Critical — MVP requirement)

---

#### F13: Final Readiness — Gate P4

**Description:** Allow final readiness approval when reference checks are complete and no open blockers remain. Gate P4 is the terminal governance checkpoint that sets the engagement status to Ready for Issuance or Closed.

**Capabilities:**
- Show final readiness checklist
- Require all reference checks to be Passed or explicitly waived
- Require no open blocker status
- Record final approver, date/time, and comments
- Set engagement status to Ready for Issuance or Closed

**Acceptance Criteria:**
- P4 cannot pass unless P3 has passed.
- P4 cannot pass while any reference check is Failed or In Review.
- P4 approval updates engagement status and writes an audit event.

**Priority:** P0 (Critical — MVP requirement)

---

### 5.6 Dashboards and Reporting

---

#### F14: Portfolio Dashboard

**Description:** Provide a basic dashboard for viewing all requests and engagements across the organization. Gives leads and stakeholders a quick view of portfolio health by phase, risk, and gate status.

**Capabilities:**
- Counts by phase and status
- Filters by owner, risk level, due date, phase, and status
- List view with engagement ID, title, phase, owner, risk, next milestone, and gate status
- Export engagement list to CSV

**Priority:** P1 (High)

---

#### F15: Engagement Detail Dashboard

**Description:** Provide a single engagement dashboard showing progress and blockers. Gives the Engagement Manager and team a consolidated view of all gates, milestones, evidence progress, and open issues.

**Capabilities:**
- Phase/status summary
- Gate status cards for A1, P2, P3, and P4
- Milestone list
- Evidence count and objectives without evidence
- Reference check completion percentage
- Open blockers list

**Priority:** P1 (High)

---

### 5.7 User-Centered Design and Persona Modeling

---

#### F16: Persona and Journey Artifacts

**Description:** Maintain lightweight persona and journey artifacts to support requirement clarity and user validation. These artifacts ensure the system is designed around real user needs and provide a basis for acceptance test generation.

**Capabilities:**
- Define the target personas listed in Section 2.2
- Define the primary journeys listed in Section 2.3
- Link each feature to at least one persona and one journey
- Use journeys to create acceptance tests for A1, P2, P3, and P4

**Priority:** P1 (High)

---

#### F17: Basic Acceptance Test Generation

**Description:** Generate a small set of acceptance tests from the primary journeys and gate rules to validate that the system's core workflow behaviors are correct and usable.

**Capabilities:**
- Test request submission and A1 approval/decline
- Test engagement setup and P2 approval
- Test evidence upload and P3 approval
- Test reference check and P4 approval
- Test dashboard visibility and CSV export

**Priority:** P1 (High)

---

## 6. Security and Compliance

### 6.1 Authentication and Authorization

- Users must log in before accessing the system.
- Actions are limited by role: Acceptance Lead, Engagement Manager, Analyst, QA Reviewer, Independent Referencer, Publishing Coordinator, Read-Only Stakeholder, and Admin.
- Users may only view or edit engagements they are authorized to access.
- Only authorized roles can approve Gate A1, P2, P3, and P4.
- Evidence marked Restricted must only be visible to authorized roles assigned to the engagement.
- Admin users can manage users, roles, and system configuration.

### 6.2 Data Protection

- Application traffic must use HTTPS.
- Database and uploaded files must be encrypted at rest where supported by the deployment environment.
- Uploaded files must be associated with an engagement and access-controlled by role.
- Evidence records must support a Restricted sensitivity flag for basic access control.
- Retention policy is TBD and should be configurable.

### 6.3 Audit and Compliance

- The system must log: request submission, A1/P2/P3/P4 gate decisions, evidence uploads, evidence links, reference status changes, and final readiness changes.
- Audit events must include actor, action, object, timestamp, and summary of change.
- Admin users should be able to export audit events for an engagement.
- Gate decision history must remain visible even after later phase transitions.

### 6.4 Isolation and Containment

- Users must not be able to perform actions outside their role permissions.
- Users must not be able to view or edit engagements outside their access scope.
- Restricted evidence files must not be downloadable by unauthorized users.
- Development, test, and production environments should be separated.

### 6.5 Security Monitoring

- Track repeated failed login attempts.
- Audit CSV exports and evidence downloads.
- Log views or downloads of Restricted evidence.
- Log user role and permission changes made by Admin.

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Standard page loads must complete within 3 seconds for typical engagement lists and forms. |
| **API Response Time** | Standard create, update, and read operations must complete within 500ms under normal load. |
| **Availability** | Target availability is 99% during normal business hours. |
| **Scalability** | Initial implementation must support at least 100 engagements, 500 evidence items, and 50 users. |
| **Usability** | A new user must be able to identify engagement phase, owner, next gate, and blockers from the engagement detail page without training documentation. |
| **Accessibility** | UI must follow common accessibility practices for form labels, keyboard navigation, and readable contrast. |
| **Data Integrity** | Gate decisions, audit events, and uploaded evidence metadata must not be silently deleted or overwritten. |
| **Search** | Users must be able to search by engagement ID, title, requester, owner, and status. |
| **Export** | Engagement register and evidence registry must be exportable to CSV. |
| **Maintainability** | Core lifecycle states and role permissions should be configurable without changing business logic where practical. |
| **Backup and Restore** | Database and uploaded files must support backup and restore using standard deployment tooling. |

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| **Request creation time** | A user can create and submit a complete request in under 5 minutes. |
| **A1 completion** | A submitted request can be approved and automatically converted to an engagement shell with no manual steps. |
| **Planning completeness** | An Engagement Manager can create a planning record with objectives, milestones, risk notes, data reliability notes, and independence status before submitting for P2. |
| **P2 gate behavior** | P2 blocks incomplete planning records and approves complete records with a single action. |
| **Evidence traceability** | Each objective can show linked evidence or a visible gap indicator. |
| **P3 gate behavior** | P3 blocks objectives with missing or insufficient evidence and passes when all objectives are marked Sufficient. |
| **Draft reference coverage** | Each draft statement can be linked to evidence and marked Passed or Failed by an Independent Referencer. |
| **P4 gate behavior** | P4 blocks incomplete or failed reference checks and approves when all checks are complete or waived. |
| **Dashboard visibility** | Portfolio dashboard shows phase, owner, risk, next milestone, and gate status for all engagements in a single view. |
| **Audit coverage** | A1, P2, P3, P4, evidence upload, evidence linking, and reference status changes all create audit events. |
| **Export functionality** | Engagement register and evidence registry can both be exported to CSV with one action. |

---

## 9. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope expands beyond the basic slice | Implementation becomes slow and harder to validate | Keep scope focused on one end-to-end lifecycle path; defer advanced workflows explicitly. |
| Gate logic becomes too complex | Users may not understand why records are blocked | Use simple, visible prerequisites for A1, P2, P3, and P4 with clear error messaging. |
| Evidence workflow becomes overloaded with metadata | Users may spend too much time managing fields | Require only basic evidence fields in the initial implementation; defer advanced metadata. |
| Role permissions are too restrictive | Users may be blocked from completing ordinary work | Start with a small role model and allow Admin to adjust permissions. |
| Role permissions are too loose | Sensitive or restricted information may be exposed | Enforce RBAC and Restricted evidence controls from the start. |
| Users expect full publication automation | Product may be judged against functionality not in scope | Clearly define Gate P4 final readiness as the endpoint for this version. |
| Dashboards become too detailed | Product becomes visually heavy and harder to build | Limit dashboards to phase, status, risk, owner, milestone, gates, and blockers only. |
| Audit trail is incomplete | Governance value is weakened | Require audit events for gate decisions, evidence actions, reference status changes, and exports. |
| File storage and metadata become inconsistent | Evidence traceability may break | Always store evidence metadata in the database and link files by stable file reference. |
| Future requirements need deeper workflow | Rework may be required | Use extensible entities for requests, engagements, artifacts, evidence, findings, gate decisions, and audit events. |

---

## 10. Feature Index

| ID | Feature | Category | Priority | Gate(s) |
|----|---------|----------|----------|---------|
| **F0** | Basic Application Shell | Platform Infrastructure | P0 | — |
| **F1** | Core Data Objects | Platform Infrastructure | P0 | — |
| **F2** | Request Intake | Intake and Acceptance | P0 | — |
| **F3** | Acceptance Decision — Gate A1 | Intake and Acceptance | P0 | A1 |
| **F4** | Engagement Shell | Engagement Setup | P0 | — |
| **F5** | Team and Milestones | Engagement Setup | P0 | — |
| **F6** | Lightweight Planning Record | Planning | P0 | — |
| **F7** | Planning Approval — Gate P2 | Planning | P0 | P2 |
| **F8** | Evidence Registry | Evidence and Findings | P0 | — |
| **F9** | Evidence-to-Objective Link | Evidence and Findings | P0 | — |
| **F10** | Findings and Sufficiency — Gate P3 | Evidence and Findings | P0 | P3 |
| **F11** | Draft Product Record | Draft and Final Readiness | P0 | — |
| **F12** | Basic Indexing and Reference Check | Draft and Final Readiness | P0 | — |
| **F13** | Final Readiness — Gate P4 | Draft and Final Readiness | P0 | P4 |
| **F14** | Portfolio Dashboard | Dashboards and Reporting | P1 | — |
| **F15** | Engagement Detail Dashboard | Dashboards and Reporting | P1 | — |
| **F16** | Persona and Journey Artifacts | User-Centered Design | P1 | — |
| **F17** | Basic Acceptance Test Generation | User-Centered Design | P1 | — |

**Priority key:**
- **P0 (Critical)** — Required for MVP; blocking if absent
- **P1 (High)** — Required before first user validation; not day-one blocking
- **P2 (Medium)** — Included in early iterations; deferrable with justification
- **P3 (Low)** — Nice-to-have; deferred to post-MVP

---

*Document generated: 2026-06-04*
*Source: Lightweight Engagement Management System PRD (Reference) + EMS PROJECT.md*
