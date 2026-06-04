# User Stories
## Lightweight Engagement Management System (EMS)

**Project Acronym:** EMS
**Version:** 1.0
**Date:** 2026-06-04
**Status:** Active
**Source PRD:** PRD-EMS.md v1.0
**Source FRD:** FRD-EMS.md v1.0
**Source Personas:** PERSONAS-EMS.md v1.0

---

## Priority Definitions

| Priority | Label | Meaning |
|----------|-------|---------|
| **P0** | Critical | Required for MVP; blocking if absent |
| **P1** | High | Required before first user validation; not day-one blocking |
| **P2** | Medium | Included in early iterations; deferrable with justification |
| **P3** | Low | Nice-to-have; deferred to post-MVP |

---

## Personas Quick Reference

| ID | Name | Role |
|----|------|------|
| PER-01 | Marcus Reid | Engagement Acceptance Lead (AL) |
| PER-02 | Diana Okafor | Engagement Manager (EM) |
| PER-03 | Priya Nair | Analyst (AN) |
| PER-04 | James Whitfield | QA Reviewer (QA) |
| PER-05 | Carla Voss | Independent Referencer (IR) |
| PER-06 | Tom Andrade | Publishing Coordinator (PC) |
| PER-07 | Sandra Wu | Read-Only Stakeholder (RO) |

---

## Epic 0: Basic Application Shell (F0)

*Foundational authenticated web container with navigation, search, role assignment, and audit trail. Every other feature depends on this.*

---

### US-0.1: Login to the Application
**As a** system user (all roles), **I want to** log in with my username and password, **so that** I can access the application securely and see only the features and records my role allows.

**Acceptance Criteria:**
- [ ] Unauthenticated access to any protected route redirects to the login page
- [ ] Valid credentials create a session and redirect to the dashboard
- [ ] Invalid credentials show an error message without revealing which field is wrong
- [ ] After 5 consecutive failed login attempts within 15 minutes, the account is locked for 15 minutes and an audit event is written
- [ ] Locked account shows the message: "Account locked due to repeated failures. Try again in 15 minutes."
- [ ] Page loads within 3 seconds under normal conditions

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Logout of the Application
**As a** system user (all roles), **I want to** log out of the application, **so that** my session is destroyed and no one else can access my account from the same browser.

**Acceptance Criteria:**
- [ ] Clicking Logout destroys the server-side session
- [ ] After logout, accessing any protected route redirects to the login page
- [ ] Browser back button after logout does not re-enter the application

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Navigate the Application via Main Menu
**As a** system user (all roles), **I want to** navigate to key sections (Dashboard, Requests, Engagements, Evidence, Review Queue, Reports) from a persistent sidebar, **so that** I can move between areas quickly without hunting for links.

**Acceptance Criteria:**
- [ ] Navigation sections are visible to all authenticated users (with role-based visibility applied)
- [ ] Sections not applicable to the user's role are hidden from the navigation
- [ ] Direct URL access to a hidden section returns HTTP 403
- [ ] Active section is highlighted in the navigation rail
- [ ] Navigation renders within 3 seconds of login

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Search for Engagements Globally
**As a** system user (all roles), **I want to** search by engagement ID, title, requester, phase, or owner name from a global search bar, **so that** I can find a specific engagement quickly without browsing through lists.

**Acceptance Criteria:**
- [ ] Search accepts queries of at least 2 characters; shorter queries show a validation message
- [ ] Results return up to 50 matching engagements ranked by relevance
- [ ] Each result shows engagement ID, title, phase, owner, and status
- [ ] Results are scoped to engagements the user is authorized to view
- [ ] Search completes and renders results within 3 seconds

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.5: View Audit Trail for an Engagement
**As a** Marcus Reid (AL) or Diana Okafor (EM), **I want to** view the full audit trail for an engagement, **so that** I can confirm when gate decisions, evidence uploads, and status changes occurred and who made them.

**Acceptance Criteria:**
- [ ] Audit trail is accessible from the Engagement Shell Audit Trail tab
- [ ] Events display in reverse chronological order with actor name, action, object type, object ID, timestamp, and summary
- [ ] Users can filter audit events by action type and date range
- [ ] All roles assigned to an engagement can view its audit trail; Admin can view all audit trails
- [ ] Gate decisions, evidence uploads, evidence links, reference status changes, and exports all appear in the audit trail

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.6: Assign User Roles (Admin)
**As an** Admin, **I want to** assign one or more roles to a user, **so that** users have the correct permissions to perform their tasks in the system.

**Acceptance Criteria:**
- [ ] Only Admin can access User Management
- [ ] Admin can assign roles from the predefined list: AL, EM, AN, QA, IR, PC, RO, AD
- [ ] At least one role must be assigned; the save action fails with a validation error if no role is selected
- [ ] Role assignment writes an audit event
- [ ] New permissions take effect on the user's next request

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: Core Data Objects (F1)

*Persistent entities that underpin the entire engagement lifecycle. All other features create, read, update, or relate these objects.*

---

### US-1.1: Ensure All Core Records Are Persistent
**As a** Diana Okafor (EM), **I want to** trust that engagement records, gate decisions, evidence items, and audit events are durably stored, **so that** nothing is lost between sessions and the engagement history is always available.

**Acceptance Criteria:**
- [ ] All ten core entities (Request, Engagement, Team Assignment, Planning Record, Objective, Evidence Item, Finding, Draft Product, Gate Decision, Audit Event) persist across sessions and deployments
- [ ] Gate decisions and audit events are immutable after creation — no UPDATE or DELETE is permitted
- [ ] Soft-delete is used for records that must be removed from active use while preserving audit history
- [ ] Required fields for each entity are enforced at the database level with NOT NULL constraints
- [ ] Foreign key references are enforced; orphan records cannot be created

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Enforce Allowed Values for Status and Type Fields
**As a** system user, **I want to** see only valid status and type options in all forms and APIs, **so that** data remains consistent and reports are reliable.

**Acceptance Criteria:**
- [ ] Enum fields (request_type, phase, status, risk_level, sensitivity, reference_status, etc.) reject values not in the defined list with HTTP 422
- [ ] Invalid enum values produce a clear field-level error message
- [ ] UI dropdowns display only the allowed values for each field
- [ ] Engagement phase transitions driven by gate approvals use the correct values: intake → planning → evidence → draft → readiness → closed

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Request Intake (F2)

*Allow Marcus Reid (Acceptance Lead) to create and submit a complete intake request. Journey: Intake and Acceptance (J1).*

---

### US-2.1: Create a New Request Record as Draft
**As a** Marcus Reid (AL), **I want to** create a new request record and save it as a draft, **so that** I can start capturing intake information and return to complete it before submitting.

**Acceptance Criteria:**
- [ ] Only AL and Admin can create requests
- [ ] The form requires at minimum a `request_type` to save as draft; all other fields are optional at draft save
- [ ] Saved draft has `status = draft` and is visible in the Requests list
- [ ] An audit event `REQUEST_CREATED` is written on save
- [ ] System redirects to the request detail page after saving

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Complete and Submit a Request
**As a** Marcus Reid (AL), **I want to** fill in all required fields and submit a completed request, **so that** it enters the acceptance review queue for Gate A1 decision.

**Acceptance Criteria:**
- [ ] Submission requires all fields: request_type, requester, topic, agency_program, due_date
- [ ] Missing required fields at submission return HTTP 422 with per-field error messages
- [ ] Successful submission sets `status = submitted` and records `submitted_at` timestamp
- [ ] Submitted request appears in the A1 Review Queue
- [ ] Audit event `REQUEST_SUBMITTED` is written on successful submission
- [ ] A past due_date triggers a warning but does not block submission (mandates may have retrospective dates)

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Upload an Intake Document
**As a** Marcus Reid (AL), **I want to** attach an intake document (e.g., congressional letter or mandate memo) to a request, **so that** the acceptance reviewer has the source document for their decision.

**Acceptance Criteria:**
- [ ] File upload is available while the request is in draft status
- [ ] Allowed file types: PDF, DOCX, DOC, XLSX, XLS, TXT, PNG, JPG, JPEG
- [ ] Maximum file size is 25 MB; files over this limit return HTTP 422 with a clear error
- [ ] Only one intake document is stored per request; uploading a new file replaces the previous one
- [ ] `intake_document_ref` and `intake_document_name` are stored on the request record
- [ ] Audit event `REQUEST_DOCUMENT_UPLOADED` is written on successful upload
- [ ] Unsupported file types return HTTP 422 with the allowed types listed

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: Edit a Draft Request
**As a** Marcus Reid (AL), **I want to** edit a request while it is in draft status, **so that** I can correct or complete information before submitting.

**Acceptance Criteria:**
- [ ] All fields can be updated while `status = draft`
- [ ] Editing is blocked once the request has been submitted, accepted, or declined; attempting to edit returns HTTP 409 with message "Request cannot be edited after submission."
- [ ] Changes write audit event `REQUEST_UPDATED`
- [ ] A non-AL user attempting to edit a request receives HTTP 403

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.5: View a Request Detail Page
**As a** Marcus Reid (AL) or Sandra Wu (RO), **I want to** view the full details of a request, **so that** I can see its current status, intake document, and Gate A1 decision summary in one place.

**Acceptance Criteria:**
- [ ] Request detail page shows: request type, requester, topic, agency/program, due date, notes, status badge, intake document download link, submission timestamp, A1 gate decision summary (if decided)
- [ ] Intake document is downloadable from the detail page
- [ ] A1 gate decision summary is visible once a decision has been made
- [ ] Audit trail link is visible on the detail page

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Acceptance Decision — Gate A1 (F3)

*Allow Marcus Reid (AL) to approve or decline a submitted request. Gate A1 is the first governance checkpoint. Journey: Intake and Acceptance (J1).*

---

### US-3.1: Review a Submitted Request for Acceptance
**As a** Marcus Reid (AL), **I want to** review a submitted request from the Review Queue, **so that** I can assess whether to accept it and create an engagement, or decline it with documented rationale.

**Acceptance Criteria:**
- [ ] Review Queue shows all requests with `status = submitted`
- [ ] Clicking a request opens the full detail page with all fields, intake document, and submission timestamp
- [ ] A1 decision controls (Approve / Decline) are only rendered when `status = submitted`
- [ ] Only users with role AL can see and use A1 decision controls

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Approve a Request at Gate A1
**As a** Marcus Reid (AL), **I want to** approve a submitted request with a risk level assessment and rationale, **so that** an Engagement Shell is automatically created and the team can begin setup.

**Acceptance Criteria:**
- [ ] AL must select a risk level (Low, Medium, or High) and enter a rationale (minimum 10 characters) before approving
- [ ] Missing risk level returns HTTP 422: "Risk level is required for A1 approval."
- [ ] Rationale shorter than 10 characters returns HTTP 422: "Rationale must be at least 10 characters."
- [ ] Successful approval creates a `GateDecision` record (gate_type=A1, status=approved) and an `Engagement` record
- [ ] Engagement Shell is created with phase=planning, status=active, job_code auto-generated as ENG-YYYY-NNNNN
- [ ] Request status updates to `accepted`
- [ ] Audit event `GATE_A1_APPROVED` is written
- [ ] System redirects to the new Engagement Shell after approval
- [ ] A request already accepted or declined cannot be re-decided; returns HTTP 409

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Decline a Request at Gate A1
**As a** Marcus Reid (AL), **I want to** decline a request with documented rationale, **so that** the team knows the request will not proceed and the decision is on record.

**Acceptance Criteria:**
- [ ] AL must enter rationale (minimum 10 characters) before declining
- [ ] Missing or short rationale returns HTTP 422: "Rationale must be at least 10 characters."
- [ ] Successful decline creates a `GateDecision` record (gate_type=A1, status=declined)
- [ ] Request status updates to `declined`
- [ ] No Engagement Shell is created on decline
- [ ] Audit event `GATE_A1_DECLINED` is written
- [ ] Declined request is visible in the portfolio dashboard and audit trail

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: See the A1 Decision Reflected Across the System
**As a** Diana Okafor (EM) or Sandra Wu (RO), **I want to** see the A1 gate decision status on the request detail page, engagement shell, and portfolio dashboard, **so that** I know the current acceptance state without asking Marcus.

**Acceptance Criteria:**
- [ ] A1 decision summary card appears on the request detail page after a decision
- [ ] A1 gate status card is visible on the Engagement Shell gate status section
- [ ] Portfolio dashboard gate status column reflects A1 status
- [ ] Gate decision history (including past decisions) is accessible from the gate history view
- [ ] Gate decision records remain visible even if the engagement is later closed

**Priority:** P0 | **Feature Ref:** F3

---

## Epic 4: Engagement Shell (F4)

*Central system-of-record page for an accepted engagement. All downstream features reference this page. Journey: Planning Setup (J2).*

---

### US-4.1: View the Engagement Shell
**As a** Diana Okafor (EM), **I want to** open an accepted engagement's shell page and see all core metadata, gate status, blockers, and artifact counts in one view, **so that** I can understand the engagement's current state without navigating to multiple pages.

**Acceptance Criteria:**
- [ ] Shell page displays: job code, title, phase, status badge, risk level badge, owner, portfolio, created date, due date
- [ ] Gate status cards for A1, P2, P3, and P4 show status, approver, and decision date (or "Not Started" if undecided)
- [ ] Open blockers list is visible and dynamically computed
- [ ] Linked artifact counts are shown: team members, objectives, evidence items, findings, draft product status
- [ ] Unauthorized user access returns HTTP 403

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.2: Edit Engagement Metadata
**As a** Diana Okafor (EM), **I want to** update the engagement title, phase, status, risk level, owner, and portfolio, **so that** the engagement record stays accurate as the engagement progresses.

**Acceptance Criteria:**
- [ ] Only EM and Admin can edit engagement metadata
- [ ] Title must be non-empty; empty title returns HTTP 422: "Title is required."
- [ ] Owner must reference an active user with EM role; invalid owner returns HTTP 422
- [ ] Status cannot be manually set to `ready_for_issuance` or `closed`; those transitions require gate approval
- [ ] Phase manual override requires a revision note (minimum 10 characters)
- [ ] Changes write audit event `ENGAGEMENT_UPDATED`
- [ ] Non-EM role attempting to edit returns HTTP 403

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.3: See Open Blockers on the Engagement Shell
**As a** Diana Okafor (EM), **I want to** see a computed list of open blockers on the engagement shell, **so that** I know exactly what is preventing the next gate from being submitted or approved.

**Acceptance Criteria:**
- [ ] Blockers list is dynamically computed and displays all blocking conditions
- [ ] Blocker conditions include: planning record not approved, objectives with no linked evidence, findings with no linked evidence, failed or in-review reference checks, P3 not approved when draft product exists
- [ ] When no blockers exist, the message "No open blockers" is displayed
- [ ] Each blocker message identifies the specific record (e.g., objective text, statement prefix) affected

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.4: Navigate to Linked Artifacts from the Engagement Shell
**As a** Diana Okafor (EM), **I want to** navigate directly to the team, planning record, evidence, findings, draft product, gate history, and audit trail from the engagement shell, **so that** I can reach any engagement section in one click.

**Acceptance Criteria:**
- [ ] Navigation links are present for: Team, Planning Record, Evidence, Findings, Draft Product, Gate History, Audit Trail
- [ ] Each link routes to the correct feature page for the engagement
- [ ] All roles authorized on the engagement can see and use the navigation links

**Priority:** P0 | **Feature Ref:** F4

---

## Epic 5: Team and Milestones (F5)

*Allow Diana Okafor (EM) to assign team roles and set milestone target dates. Journey: Planning Setup (J2).*

---

### US-5.1: Assign Team Members to an Engagement
**As a** Diana Okafor (EM), **I want to** assign specific users to roles on an engagement, **so that** each person has the appropriate access and action permissions for their function.

**Acceptance Criteria:**
- [ ] Only EM and Admin can assign team members
- [ ] Available roles: AL, EM, AN, QA, IR, PC, RO
- [ ] The same user-role combination cannot be added twice to the same engagement; duplicate returns HTTP 409
- [ ] The selected user must be an active account; inactive user returns HTTP 422
- [ ] Audit event `TEAM_MEMBER_ASSIGNED` is written on successful assignment
- [ ] At least one EM must remain on the team; removing the last EM returns HTTP 409: "Cannot remove the last Engagement Manager from the team."

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.2: Remove Team Members from an Engagement
**As a** Diana Okafor (EM), **I want to** remove team members when their role on the engagement is complete, **so that** access is limited to active contributors.

**Acceptance Criteria:**
- [ ] Only EM and Admin can remove team members
- [ ] Removal of the last EM on an engagement is blocked with HTTP 409
- [ ] QA Reviewer cannot be removed if P2 has not yet been approved
- [ ] Removal soft-deletes the TeamAssignment record
- [ ] Audit event `TEAM_MEMBER_REMOVED` is written on removal

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.3: Set Milestone Target Dates
**As a** Diana Okafor (EM), **I want to** set target dates for Planning Approval (P2), Evidence Readiness (P3), Draft Readiness, and Final Readiness (P4), **so that** the team has a visible schedule and the dashboard can show milestone health.

**Acceptance Criteria:**
- [ ] EM can set or update all four milestone dates: planning_approval_target, evidence_readiness_target, draft_readiness_target, final_readiness_target
- [ ] Milestone dates must be in chronological order (P3 ≥ P2, Draft ≥ P3, P4 ≥ Draft); invalid order returns HTTP 422: "Milestone dates must be in chronological order."
- [ ] Invalid date format (non-YYYY-MM-DD) returns HTTP 422
- [ ] Milestone dates can be left null (Not Started)
- [ ] Audit event `MILESTONES_UPDATED` is written on save

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.4: View Milestone Status
**As a** Diana Okafor (EM) or Sandra Wu (RO), **I want to** see the current status of each milestone (Not Started, On Track, At Risk, Complete, Overdue), **so that** I can identify which milestones need attention without performing my own calculations.

**Acceptance Criteria:**
- [ ] Milestone status is computed automatically based on target date and gate approval status
- [ ] Status is `not_started` when target date is null
- [ ] Status is `on_track` when target date is in the future and the associated gate has not passed
- [ ] Status is `at_risk` when target date is within 7 days and the associated gate has not passed
- [ ] Status is `complete` when the associated gate has been approved
- [ ] Status is `overdue` when target date is in the past and the associated gate has not passed
- [ ] Milestone status is visible on both the Engagement Shell and the Engagement Detail Dashboard

**Priority:** P0 | **Feature Ref:** F5

---

## Epic 6: Lightweight Planning Record (F6)

*Allow Diana Okafor (EM) and Priya Nair (AN) to build the planning baseline. Journey: Planning Setup (J2).*

---

### US-6.1: Create a Planning Record
**As a** Diana Okafor (EM), **I want to** create a new planning record for an accepted engagement, **so that** there is a single, structured place to capture objectives, design approach, risk notes, and independence status.

**Acceptance Criteria:**
- [ ] Only EM, AN, and Admin can create a planning record
- [ ] Only one planning record can exist per engagement; creating a second returns an error
- [ ] Planning record is created with `status = draft`
- [ ] Audit event `PLANNING_RECORD_CREATED` is written on creation
- [ ] The engagement must be active and not closed to create a planning record

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.2: Add and Manage Objectives
**As a** Diana Okafor (EM) or Priya Nair (AN), **I want to** add, edit, reorder, and delete objectives on the planning record, **so that** the research questions driving the engagement are clearly documented.

**Acceptance Criteria:**
- [ ] Objective text (required) and information need (optional) can be entered for each objective
- [ ] Objectives can be reordered using sort order controls
- [ ] Objective text must be non-empty; empty text returns HTTP 422: "Objective text is required."
- [ ] Deleting an objective linked to evidence is blocked with HTTP 409: "Cannot delete this objective — it has linked evidence items. Unlink evidence first."
- [ ] At least one objective must exist before the planning record can be submitted for P2 review

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.3: Complete Planning Sections
**As a** Diana Okafor (EM) or Priya Nair (AN), **I want to** fill in design approach, schedule notes, risk notes, data reliability notes, and independence affirmation status, **so that** the planning baseline is complete enough to submit for P2 review.

**Acceptance Criteria:**
- [ ] Design approach and schedule notes are optional (can be saved as draft without them)
- [ ] Risk notes, data reliability notes, and independence status are required before submission for P2
- [ ] Independence status must be one of: affirmed, pending, exception_noted
- [ ] Partial saves (draft saves) are permitted at any time
- [ ] Audit event `PLANNING_RECORD_UPDATED` is written on each save

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.4: Submit Planning Record for P2 Review
**As a** Diana Okafor (EM), **I want to** submit the completed planning record for QA review, **so that** it enters James Whitfield's review queue for Gate P2 approval.

**Acceptance Criteria:**
- [ ] Submission requires: ≥1 objective, non-empty risk notes, non-empty data reliability notes, independence status set, owner assigned, ≥1 QA Reviewer on team, ≥1 milestone date set
- [ ] Each missing prerequisite returns HTTP 422 with a specific `P2_PREREQUISITE_FAILED` error message
- [ ] Successful submission sets `planning_record.status = ready_for_review`
- [ ] Audit event `PLANNING_SUBMITTED_FOR_REVIEW` is written
- [ ] Planning record appears in the QA Reviewer's Review Queue after submission

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.5: Edit an Approved Planning Record (Post-P2)
**As a** Diana Okafor (EM), **I want to** modify the planning record after P2 approval by providing a revision note, **so that** legitimate updates to the baseline are recorded without invalidating the prior gate decision.

**Acceptance Criteria:**
- [ ] After P2 approval, all planning record fields are locked in the UI by default
- [ ] EM can click "Request Revision" to unlock fields; system requires a revision note (minimum 10 characters)
- [ ] Revision note shorter than 10 characters returns HTTP 422
- [ ] Changes are saved; planning record status remains `approved`; a PlanningRevision record is created with before/after snapshot
- [ ] Audit event `PLANNING_RECORD_REVISED` is written

**Priority:** P0 | **Feature Ref:** F6

---

## Epic 7: Planning Approval — Gate P2 (F7)

*Allow James Whitfield (QA) to approve or return the planning baseline. Journey: Planning Setup (J2).*

---

### US-7.1: Review the Planning Record for P2
**As a** James Whitfield (QA), **I want to** view the submitted planning record with a completeness checklist, **so that** I can assess whether the planning baseline meets all requirements before approving.

**Acceptance Criteria:**
- [ ] QA Reviewer navigates to the Review Queue and sees planning records with `status = ready_for_review`
- [ ] Planning record detail shows: design approach, schedule notes, risk notes, data reliability notes, independence status, objectives list, team summary, milestone dates
- [ ] P2 prerequisite checklist is displayed with pass/fail indicators for each item
- [ ] Only QA role can see the P2 approval/return controls

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.2: Approve the Planning Baseline at Gate P2
**As a** James Whitfield (QA), **I want to** approve the planning baseline with an approval comment, **so that** the planning record is locked, the engagement advances to the evidence phase, and the team can begin evidence collection.

**Acceptance Criteria:**
- [ ] All P2 prerequisites must pass server-side before approval: ≥1 objective, non-empty risk notes, non-empty data reliability notes, independence status set, owner assigned, ≥1 EM on team, ≥1 milestone date set
- [ ] Approval comment is required (minimum 10 characters); missing comment returns HTTP 422
- [ ] Successful approval sets `planning_record.status = approved` and `engagement.phase = evidence`
- [ ] `GateDecision` record is created (gate_type=P2, status=approved) with approver, timestamp, and rationale
- [ ] Audit event `GATE_P2_APPROVED` is written
- [ ] A non-QA role attempting to approve returns HTTP 403

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.3: Return the Planning Record for Revision
**As a** James Whitfield (QA), **I want to** return an incomplete planning record with specific revision comments, **so that** Diana knows exactly what to fix before resubmitting.

**Acceptance Criteria:**
- [ ] Return comment is required (minimum 10 characters); missing comment returns HTTP 422
- [ ] Successful return sets `planning_record.status = returned`
- [ ] `GateDecision` record is created (gate_type=P2, status=returned) with approver, timestamp, and return comments
- [ ] Return comments are visible to the EM on the planning record page
- [ ] Audit event `GATE_P2_RETURNED` is written
- [ ] Multiple return/re-submit cycles are allowed; each cycle creates a new GateDecision record

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.4: See P2 Decision Status on the Engagement
**As a** Diana Okafor (EM), **I want to** see the P2 gate decision (approved, returned) on the engagement shell and planning record page, **so that** I know the current review state without asking James.

**Acceptance Criteria:**
- [ ] P2 gate status card on the Engagement Shell shows current outcome, approver, and date
- [ ] Full P2 gate history is accessible from the gate history view
- [ ] Approved planning baseline is viewable in read-only mode by all engagement team members
- [ ] P2 approval timestamp and approver are shown on the planning record page

**Priority:** P0 | **Feature Ref:** F7

---

## Epic 8: Evidence Registry (F8)

*Allow Priya Nair (AN) to add evidence records and upload files. Journey: Evidence Readiness (J3).*

---

### US-8.1: Add an Evidence Record
**As a** Priya Nair (AN), **I want to** create a new evidence record with type, source, date received, sensitivity flag, and optional description, **so that** each piece of evidence has a structured, traceable metadata record in the system.

**Acceptance Criteria:**
- [ ] Only AN and Admin can create evidence records
- [ ] Required fields: evidence_type (document/dataset/interview_note/meeting_note/other), source, date_received, sensitivity (standard/restricted)
- [ ] Source must be non-empty; empty source returns HTTP 422: "Source is required."
- [ ] Date received must be a valid date (future dates allowed for evidence received in advance)
- [ ] Audit event `EVIDENCE_ITEM_CREATED` is written on creation
- [ ] Evidence record is immediately visible in the engagement evidence list

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.2: Upload Files to an Evidence Record
**As a** Priya Nair (AN), **I want to** upload one or more files to an evidence record, **so that** the actual source documents are stored in the system and accessible to authorized reviewers.

**Acceptance Criteria:**
- [ ] Allowed file types: PDF, DOCX, DOC, XLSX, XLS, CSV, TXT, PNG, JPG, JPEG, ZIP
- [ ] Maximum file size per file is 50 MB; oversized file returns HTTP 422: "File exceeds maximum size of 50 MB."
- [ ] Maximum 20 files per evidence item; exceeding limit returns HTTP 422: "Maximum of 20 files per evidence item."
- [ ] Unsupported file types return HTTP 422 with the allowed types listed
- [ ] Audit event `EVIDENCE_FILE_UPLOADED` is written for each successfully uploaded file

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.3: Mark Evidence as Restricted
**As a** Priya Nair (AN), **I want to** flag sensitive evidence items as "Restricted," **so that** only authorized roles can view or download those files.

**Acceptance Criteria:**
- [ ] Sensitivity can be set to "Standard" (default) or "Restricted" during creation or editing
- [ ] Restricted evidence items are visible only to AN, EM, QA, IR, PC, and Admin assigned to the engagement
- [ ] AL and RO cannot see restricted evidence items or their download links
- [ ] Changing an item from standard to restricted writes audit event `EVIDENCE_RESTRICTED`
- [ ] Unauthorized download of a restricted file returns HTTP 403: "You are not authorized to download restricted evidence files."

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.4: View and Filter the Evidence List
**As a** Priya Nair (AN) or James Whitfield (QA), **I want to** view all evidence items for an engagement with their type, source, sensitivity, and linked objective counts, **so that** I can quickly assess evidence coverage without opening each record.

**Acceptance Criteria:**
- [ ] Evidence list shows: evidence ID (short), type, source, date received, sensitivity badge, linked objectives count, file count, uploaded by, created date
- [ ] List can be filtered by evidence type, sensitivity, date range, and linked/unlinked status
- [ ] Restricted items are hidden from AL and RO users
- [ ] Standard evidence is visible to all roles assigned to the engagement

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.5: Delete an Evidence Record
**As a** Priya Nair (AN), **I want to** delete an evidence record that was added in error, **so that** the registry only contains valid, relevant items.

**Acceptance Criteria:**
- [ ] Deletion is blocked if the evidence item is linked to any objective, finding, or reference check statement; returns HTTP 409: "Cannot delete evidence item — it is linked to objectives or findings. Unlink first."
- [ ] Successful deletion soft-deletes the record (sets deleted_at); physical files are cleaned up separately
- [ ] Audit event `EVIDENCE_ITEM_DELETED` is written on successful deletion

**Priority:** P0 | **Feature Ref:** F8

---

## Epic 9: Evidence-to-Objective Link (F9)

*Allow Priya Nair (AN) to link evidence to objectives and identify gaps. Journey: Evidence Readiness (J3).*

---

### US-9.1: Link Evidence to Planning Objectives
**As a** Priya Nair (AN), **I want to** link evidence items to one or more planning objectives, **so that** the system can show which objectives are supported and which have gaps.

**Acceptance Criteria:**
- [ ] AN can link an evidence item to one or more objectives from either the evidence detail page or the objectives page
- [ ] Evidence item and objectives must belong to the same engagement; cross-engagement links return HTTP 422
- [ ] Duplicate links (same evidence + same objective) return HTTP 409: "This evidence item is already linked to this objective."
- [ ] Audit event `EVIDENCE_OBJECTIVE_LINKED` is written for each new link

**Priority:** P0 | **Feature Ref:** F9

---

### US-9.2: View Linked Evidence Per Objective
**As a** Priya Nair (AN) or James Whitfield (QA), **I want to** see a list of evidence items linked to each objective, **so that** I can confirm each objective has appropriate evidence support.

**Acceptance Criteria:**
- [ ] For each objective, the linked evidence list shows: evidence ID (short), type, source, date received, sensitivity badge, linked findings count
- [ ] Restricted evidence items follow the same visibility rules as F8 (hidden for AL and RO)
- [ ] Access is available to all roles assigned to the engagement and Admin

**Priority:** P0 | **Feature Ref:** F9

---

### US-9.3: Identify Evidence Gaps with the Gap View
**As a** Priya Nair (AN) or James Whitfield (QA), **I want to** see a filtered view of objectives with no linked evidence, **so that** I can prioritize collecting evidence for uncovered objectives before Gate P3.

**Acceptance Criteria:**
- [ ] Gap view shows objectives with zero linked evidence items
- [ ] Each row shows: objective text (truncated at 100 chars), objective status, linked evidence count (shown as "No Evidence" badge), days until evidence readiness milestone
- [ ] Any objective in the gap view with `status = evidence_needed` is flagged as a P3 blocker
- [ ] Gap view is accessible via a "Show Gaps" toggle or dedicated route

**Priority:** P0 | **Feature Ref:** F9

---

### US-9.4: Export the Evidence Registry to CSV
**As a** Priya Nair (AN) or Diana Okafor (EM), **I want to** export the evidence registry to a CSV file, **so that** I can share evidence coverage information in external reports or reviews.

**Acceptance Criteria:**
- [ ] Export button is available to: AL, EM, AN, QA, PC, RO, Admin (IR is excluded)
- [ ] CSV includes columns: Evidence ID, Evidence Type, Source, Date Received, Custodian, Description, Sensitivity, Linked Objectives, Files Attached, Uploaded By, Created Date
- [ ] Restricted items are excluded from exports for AL and RO users
- [ ] Export is scoped to the current engagement only
- [ ] Audit event `EVIDENCE_CSV_EXPORTED` is written on export

**Priority:** P0 | **Feature Ref:** F9

---

## Epic 10: Findings and Sufficiency — Gate P3 (F10)

*Allow Priya Nair (AN) to create findings and James Whitfield (QA) to approve Gate P3. Journey: Evidence Readiness (J3).*

---

### US-10.1: Create a Finding Record
**As a** Priya Nair (AN), **I want to** create a finding record to capture a draft conclusion or observation, **so that** there is a structured record of each key finding linked to its supporting evidence.

**Acceptance Criteria:**
- [ ] Only AN and Admin can create findings
- [ ] Finding text is required; empty text returns HTTP 422: "Finding text is required."
- [ ] Findings can only be created after P2 is approved (engagement in `phase = evidence` or later); wrong phase returns HTTP 409
- [ ] Finding is created with `status = draft`
- [ ] Audit event `FINDING_CREATED` is written on creation

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.2: Link a Finding to Evidence Items
**As a** Priya Nair (AN), **I want to** link each finding to one or more evidence items, **so that** every conclusion is traceable to the evidence that supports it.

**Acceptance Criteria:**
- [ ] AN can select one or more evidence items to link to a finding
- [ ] Evidence items must belong to the same engagement; cross-engagement links return HTTP 422
- [ ] Duplicate finding-evidence links return HTTP 409: "This evidence item is already linked to this finding."
- [ ] A finding must have at least one linked evidence item before Gate P3 can pass
- [ ] Audit event `FINDING_EVIDENCE_LINKED` is written on link creation

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.3: Mark Objective Evidence Status
**As a** James Whitfield (QA), **I want to** update each objective's evidence status (Evidence Needed, In Review, Sufficient), **so that** the team can track readiness and I can confirm all objectives are covered before approving P3.

**Acceptance Criteria:**
- [ ] QA, EM, and Admin can update objective evidence status
- [ ] Cannot mark an objective `in_review` or `sufficient` if it has zero linked evidence items; returns HTTP 422
- [ ] Status transitions: evidence_needed → in_review (requires ≥1 linked evidence); in_review → sufficient; regression (sufficient → in_review or evidence_needed) is allowed
- [ ] Audit event `OBJECTIVE_STATUS_UPDATED` is written on each status change

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.4: Approve Evidence Sufficiency at Gate P3
**As a** James Whitfield (QA), **I want to** approve Gate P3 when all objectives are marked sufficient and all findings have evidence links, **so that** the engagement can advance to draft readiness work.

**Acceptance Criteria:**
- [ ] P3 cannot be approved if Gate P2 is not approved; returns HTTP 409: "Gate P2 must be approved before P3 can pass."
- [ ] P3 cannot be approved if any objective has `status = evidence_needed`; returns HTTP 409
- [ ] P3 cannot be approved if any objective has zero linked evidence items; returns HTTP 409
- [ ] P3 cannot be approved if any finding has zero evidence links; returns HTTP 409
- [ ] Approval comment is required (minimum 10 characters)
- [ ] Successful approval creates `GateDecision` (gate_type=P3, status=approved) and sets `engagement.phase = draft`
- [ ] Audit event `GATE_P3_APPROVED` is written
- [ ] Only QA role can approve P3; non-QA returns HTTP 403

**Priority:** P0 | **Feature Ref:** F10

---

## Epic 11: Draft Product Record (F11)

*Allow Diana Okafor (EM) and Priya Nair (AN) to create and track the draft product through review stages. Journey: Draft Readiness (J4).*

---

### US-11.1: Create a Draft Product Record
**As a** Diana Okafor (EM), **I want to** create a draft product record with title, version, and owner, **so that** the team has a single tracked record for the working product from findings to final readiness.

**Acceptance Criteria:**
- [ ] Only EM, AN, and Admin can create a draft product record
- [ ] Draft product can only be created after Gate P3 is approved (engagement in `phase = draft` or later)
- [ ] Only one draft product record per engagement; creating a second returns HTTP 409: "A draft product record already exists for this engagement."
- [ ] Required fields: title, version, owner_id (must be an active user assigned to the engagement)
- [ ] Draft product is created with `status = drafting`
- [ ] Audit event `DRAFT_PRODUCT_CREATED` is written on creation

**Priority:** P0 | **Feature Ref:** F11

---

### US-11.2: Attach a Draft File
**As a** Priya Nair (AN) or Diana Okafor (EM), **I want to** attach the draft product file to the draft record, **so that** team members can access the working document directly from the system.

**Acceptance Criteria:**
- [ ] Allowed file types: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP
- [ ] Maximum file size is 50 MB; oversized file returns HTTP 422
- [ ] Only one file per draft product record; uploading a new file replaces the previous one
- [ ] File is downloadable by all roles assigned to the engagement and Admin
- [ ] Audit events `DRAFT_FILE_ATTACHED` and `DRAFT_FILE_DOWNLOADED` are written for respective actions

**Priority:** P0 | **Feature Ref:** F11

---

### US-11.3: Record Review Comments on a Draft
**As a** James Whitfield (QA) or Diana Okafor (EM), **I want to** add review comments to the draft product record, **so that** feedback is tracked in the system alongside the draft rather than in a separate email chain.

**Acceptance Criteria:**
- [ ] EM, QA, AN, and Admin can add review comments
- [ ] Review comments are non-empty when saved; empty comment returns a validation error
- [ ] Comments are append-only and not editable after save; each saved comment includes timestamp and reviewer name
- [ ] Audit event `DRAFT_COMMENT_ADDED` is written on each comment save

**Priority:** P0 | **Feature Ref:** F11

---

### US-11.4: Advance the Draft Status Through Review Stages
**As a** Diana Okafor (EM), **I want to** advance the draft product through its review stages (Drafting → Under Review → Ready for Reference Check → Ready for Final Review), **so that** the team always knows where the draft stands in the review process.

**Acceptance Criteria:**
- [ ] Only the following status transitions are permitted: Drafting → Under Review (EM); Under Review → Ready for Reference Check (EM); Under Review → Drafting (QA, for return); Ready for Reference Check → Ready for Final Review (EM); Ready for Final Review → Under Review (EM, if issues arise)
- [ ] Invalid transitions return HTTP 409: "Status cannot transition from {from} to {to}."
- [ ] Advancing to Ready for Reference Check requires at least one draft statement to exist; missing statements return HTTP 409
- [ ] Audit event `DRAFT_STATUS_CHANGED` is written on each status change

**Priority:** P0 | **Feature Ref:** F11

---

## Epic 12: Basic Indexing and Reference Check (F12)

*Allow Priya Nair (AN) to index statements and Carla Voss (IR) to perform reference checks. Journey: Draft Readiness (J4).*

---

### US-12.1: Create Draft Statements (Indexing)
**As a** Priya Nair (AN), **I want to** add draft statement records to the draft product and link each statement to supporting evidence, **so that** every claim has a traceable evidence basis before reference check begins.

**Acceptance Criteria:**
- [ ] Only AN, EM, and Admin can create draft statements
- [ ] Statement text is required; empty text returns HTTP 422
- [ ] Draft product must exist for the engagement; if not found returns HTTP 404
- [ ] Statements can be created while draft product status is `drafting`, `under_review`, or `ready_for_reference_check`
- [ ] New statement is created with `reference_status = not_started`
- [ ] Audit event `STATEMENT_CREATED` is written on creation

**Priority:** P0 | **Feature Ref:** F12

---

### US-12.2: Link Statements to Evidence Items
**As a** Priya Nair (AN), **I want to** link each draft statement to one or more evidence items, **so that** the Independent Referencer can verify each claim against the evidence before Gate P4.

**Acceptance Criteria:**
- [ ] AN can link one or more evidence items to a statement
- [ ] Evidence items must belong to the same engagement; cross-engagement links return HTTP 422
- [ ] Duplicate statement-evidence links return HTTP 409
- [ ] A statement must have at least one evidence link before its reference check can begin
- [ ] Audit event `STATEMENT_EVIDENCE_LINKED` is written on link creation

**Priority:** P0 | **Feature Ref:** F12

---

### US-12.3: Assign a Statement for Reference Check
**As a** Diana Okafor (EM), **I want to** assign indexed statements to an Independent Referencer for review, **so that** Carla has a structured queue of assignments rather than receiving a Word document by email.

**Acceptance Criteria:**
- [ ] Only EM and Admin can assign statements for reference check
- [ ] Assigned user must have role IR and be assigned to the engagement; invalid assignment returns HTTP 422
- [ ] Statements without evidence links cannot be assigned; returns HTTP 422: "Statement must be linked to at least one evidence item before reference check can begin."
- [ ] Assigned statements appear in the IR's Review Queue
- [ ] Audit event `REFERENCE_CHECK_ASSIGNED` is written on assignment

**Priority:** P0 | **Feature Ref:** F12

---

### US-12.4: Perform a Reference Check (Pass or Fail)
**As a** Carla Voss (IR), **I want to** open each assigned statement, review the linked evidence, and mark the reference status as Passed, Failed, or In Review, **so that** the verification result is tracked in the system rather than in a separate spreadsheet.

**Acceptance Criteria:**
- [ ] Only IR role can set reference status
- [ ] IR can set status to: `in_review`, `passed`, or `failed`
- [ ] Discrepancy notes are required when status is `failed`; missing notes return HTTP 422: "Discrepancy notes are required when reference status is Failed."
- [ ] IR can access the linked evidence files directly from the statement review interface
- [ ] Audit event `REFERENCE_STATUS_CHANGED` is written on each status change

**Priority:** P0 | **Feature Ref:** F12

---

### US-12.5: Assign a Failed Statement Back to the Analyst
**As a** Carla Voss (IR), **I want to** record a discrepancy and route the failed statement back to Priya for correction, **so that** the feedback loop is tracked in the system without relying on email.

**Acceptance Criteria:**
- [ ] When IR sets status to `failed`, the statement can be assigned to an analyst user (optional routing)
- [ ] Failed statements appear in the Analyst's queue for correction
- [ ] Analyst can update statement text or evidence links to address the discrepancy
- [ ] Analyst sets `revision_ready = true` to notify IR the statement is ready for re-check
- [ ] IR's Review Queue surfaces the revised statement for re-check
- [ ] Audit event `REFERENCE_FAILED_DISCREPANCY` is written when a statement is failed with discrepancy notes

**Priority:** P0 | **Feature Ref:** F12

---

### US-12.6: Waive a Reference Check
**As a** Diana Okafor (EM), **I want to** waive a reference check for a statement with documented justification, **so that** well-established facts that do not need evidence verification do not block Gate P4.

**Acceptance Criteria:**
- [ ] Only EM and Admin can waive a reference check
- [ ] Waiver justification is required (minimum 10 characters); missing justification returns HTTP 422
- [ ] Successful waiver sets `reference_status = waived` and records waived_by, waived_at, and waiver_justification
- [ ] Waived statements count as complete for P4 prerequisite purposes
- [ ] Audit event `REFERENCE_CHECK_WAIVED` is written on waiver

**Priority:** P0 | **Feature Ref:** F12

---

### US-12.7: View Reference Check Progress
**As a** Diana Okafor (EM) or Tom Andrade (PC), **I want to** see the reference check completion status across all draft statements, **so that** I know how many checks remain before the engagement is ready for Gate P4.

**Acceptance Criteria:**
- [ ] Reference check progress view shows: total statements, counts by status (Not Started, In Review, Passed, Failed, Waived), and completion percentage ((Passed + Waived) / Total)
- [ ] All roles assigned to the engagement and Admin can view reference check progress
- [ ] Progress data is the same data used by Gate P4 prerequisite checks

**Priority:** P0 | **Feature Ref:** F12

---

## Epic 13: Final Readiness — Gate P4 (F13)

*Allow Tom Andrade (PC) and Diana Okafor (EM) to complete final readiness. Journey: Final Readiness (J5).*

---

### US-13.1: View the Final Readiness Checklist
**As a** Tom Andrade (PC), **I want to** see a checklist of all P4 prerequisites with explicit pass/fail indicators, **so that** I know exactly which conditions are satisfied and which must still be resolved before I can approve.

**Acceptance Criteria:**
- [ ] Checklist is visible to EM, PC, QA, and Admin
- [ ] Checklist items: (1) P3 approved, (2) no failed reference checks, (3) no in-review reference checks, (4) no not-started reference checks, (5) no open blockers
- [ ] Each item shows a green ✓ (pass) or red ✗ (fail) indicator
- [ ] Failing items display a brief explanation and a link to the affected records
- [ ] "Approve P4" button is disabled until all checklist items show ✓

**Priority:** P0 | **Feature Ref:** F13

---

### US-13.2: Approve Final Readiness at Gate P4
**As a** Tom Andrade (PC) or Diana Okafor (EM), **I want to** approve Gate P4 with a final comment and set the engagement status to Ready for Issuance, **so that** the product is formally marked ready and the decision is recorded in the audit trail.

**Acceptance Criteria:**
- [ ] P4 cannot be approved if P3 is not approved; returns HTTP 409: "Gate P3 must be approved before P4 can pass."
- [ ] P4 cannot be approved if any reference check is `failed`; returns HTTP 409
- [ ] P4 cannot be approved if any reference check is `in_review`; returns HTTP 409
- [ ] P4 cannot be approved if any reference check is `not_started`; returns HTTP 409
- [ ] P4 cannot be approved if open blockers exist; returns HTTP 409
- [ ] Final approval comment is required (minimum 10 characters)
- [ ] Approver selects outcome: "Ready for Issuance" or "Closed" (PC always selects Ready for Issuance; EM/Admin can select either)
- [ ] Successful approval creates `GateDecision` (gate_type=P4, status=approved), updates engagement status and phase
- [ ] Audit event `GATE_P4_APPROVED` is written
- [ ] After P4 approval, the engagement enters a read-only state

**Priority:** P0 | **Feature Ref:** F13

---

### US-13.3: Close an Engagement Without Issuance
**As a** Diana Okafor (EM), **I want to** close an engagement that will not be issued, **so that** the record is finalized with clear status and no further edits are permitted.

**Acceptance Criteria:**
- [ ] Only EM and Admin can close an engagement
- [ ] Closing sets `engagement.status = closed` and `engagement.phase = closed`
- [ ] A closed engagement is read-only; no further edits, uploads, or gate approvals are permitted
- [ ] All records and audit history remain visible on a closed engagement
- [ ] Audit event `ENGAGEMENT_CLOSED` is written

**Priority:** P0 | **Feature Ref:** F13

---

### US-13.4: See P4 Decision Reflected Across the System
**As a** Sandra Wu (RO) or Diana Okafor (EM), **I want to** see the P4 gate decision and final engagement status immediately reflected on the engagement shell, portfolio dashboard, and engagement detail dashboard, **so that** the team and stakeholders know the engagement is complete without any manual update.

**Acceptance Criteria:**
- [ ] P4 gate status card on Engagement Shell updates immediately after approval
- [ ] Engagement status badge updates to "Ready for Issuance" or "Closed"
- [ ] Portfolio dashboard reflects the updated status immediately
- [ ] P4 approval records are immutable and permanently visible in the audit trail
- [ ] Gate decision history for P4 is accessible from the gate history view

**Priority:** P0 | **Feature Ref:** F13

---

## Epic 14: Portfolio Dashboard (F14)

*Provide Marcus Reid (AL), Diana Okafor (EM), and Sandra Wu (RO) with a high-level portfolio view. Journey: All journeys.*

---

### US-14.1: View Portfolio Summary Count Cards
**As a** Sandra Wu (RO), **I want to** see count cards summarizing engagements by phase, status, and risk at the top of the portfolio dashboard, **so that** I can assess portfolio health in seconds without reading every row.

**Acceptance Criteria:**
- [ ] Count cards display: Active Engagements, In Planning, In Evidence, In Draft, Ready for Issuance, Closed, High Risk, Pending Requests
- [ ] Counts reflect only engagements the user is authorized to view
- [ ] Count cards update when filters are applied to the engagement list

**Priority:** P1 | **Feature Ref:** F14

---

### US-14.2: Filter the Engagement List
**As a** Diana Okafor (EM), **I want to** filter the engagement list by owner, risk level, phase, status, due date, and gate status, **so that** I can quickly narrow the list to the engagements I need to act on.

**Acceptance Criteria:**
- [ ] Available filters: owner (multi-select), risk level (Low/Medium/High), phase (multi-select), status (multi-select), due date range, gate status (composite)
- [ ] Filters use AND logic across filter types
- [ ] Applied filters persist in URL query parameters for bookmarking
- [ ] Clearing filters returns the unfiltered list

**Priority:** P1 | **Feature Ref:** F14

---

### US-14.3: View the Engagement List with Key Columns
**As a** Sandra Wu (RO), **I want to** see the engagement list showing ID, title, phase, status, owner, risk, next milestone, gate status, and due date in a sortable table, **so that** I can compare engagements at a glance and click through to any one.

**Acceptance Criteria:**
- [ ] List columns: Engagement ID, Title, Phase, Status, Owner, Risk Level, Next Milestone, Gate Status (A1/P2/P3/P4), Due Date
- [ ] All columns are sortable ascending/descending
- [ ] Pagination defaults to 25 rows; configurable to 50 or 100; total count is shown
- [ ] Row click navigates to the Engagement Shell
- [ ] List loads within 3 seconds for ≤100 engagements

**Priority:** P1 | **Feature Ref:** F14

---

### US-14.4: Export the Engagement Register to CSV
**As a** Sandra Wu (RO), **I want to** export the current filtered engagement list to CSV, **so that** I can use it in external briefings and reports without manually copying data.

**Acceptance Criteria:**
- [ ] Export button is available to: AL, EM, AN, QA, PC, RO, Admin (IR excluded)
- [ ] CSV includes columns: Engagement ID, Title, Phase, Status, Owner, Risk Level, Portfolio, Due Date, A1/P2/P3/P4 Status, Planning Approval Date, Evidence Readiness Date, Final Readiness Date, Created Date
- [ ] Export applies current active filters; exports all visible engagements if no filters are active
- [ ] Audit event `ENGAGEMENT_REGISTER_EXPORTED` is written on export

**Priority:** P1 | **Feature Ref:** F14

---

## Epic 15: Engagement Detail Dashboard (F15)

*Provide Diana Okafor (EM) and Sandra Wu (RO) with a single consolidated view of engagement progress. Journey: All journeys.*

---

### US-15.1: View Phase, Status, and Owner Summary
**As a** Diana Okafor (EM), **I want to** see the engagement's phase, status, owner, risk level, job code, title, due date, and days until due at the top of the detail dashboard, **so that** I always know the engagement's current state in one glance.

**Acceptance Criteria:**
- [ ] Summary section displays: current phase, status badge, owner name and role, risk level badge, job code, title, due date, days until due (or "Overdue" if past)
- [ ] Data is accurate to the current state with no stale caching
- [ ] All roles assigned to the engagement and Admin can view the summary

**Priority:** P1 | **Feature Ref:** F15

---

### US-15.2: View Gate Status Cards on the Detail Dashboard
**As a** Diana Okafor (EM), **I want to** see compact gate status cards for A1, P2, P3, and P4 on the detail dashboard, **so that** I know which gates are approved and which are still pending without navigating away.

**Acceptance Criteria:**
- [ ] Four gate cards displayed: A1, P2, P3, P4
- [ ] Each card shows: gate label, status (Approved/Declined/Returned/Not Started), approver name, decision date, prerequisite status summary
- [ ] Each card links to the full gate history for that gate type
- [ ] Cards reflect the most recent gate decision

**Priority:** P1 | **Feature Ref:** F15

---

### US-15.3: View the Milestone Timeline
**As a** Diana Okafor (EM), **I want to** see the milestone timeline with target dates and computed statuses on the detail dashboard, **so that** I can spot at-risk or overdue milestones without navigating to a separate page.

**Acceptance Criteria:**
- [ ] Milestone timeline shows four rows: Planning Approval (P2) Target, Evidence Readiness (P3) Target, Draft Readiness Target, Final Readiness (P4) Target
- [ ] Each row shows target date and status (Not Started / On Track / At Risk / Complete / Overdue) per F05.4 rules
- [ ] At-risk and overdue milestones are visually distinguished

**Priority:** P1 | **Feature Ref:** F15

---

### US-15.4: View Evidence and Objective Progress Metrics
**As a** James Whitfield (QA), **I want to** see evidence and objective progress metrics on the detail dashboard, **so that** I can assess evidence sufficiency before entering the P3 review queue.

**Acceptance Criteria:**
- [ ] Metrics displayed: total evidence items, objectives with evidence, objectives without evidence, evidence sufficiency progress percentage
- [ ] If any objective has zero linked evidence, a warning badge appears: "X objective(s) have no evidence."
- [ ] Metrics update to reflect the current state of evidence items and links

**Priority:** P1 | **Feature Ref:** F15

---

### US-15.5: View Reference Check Completion Metrics
**As a** Tom Andrade (PC), **I want to** see reference check completion metrics (Passed, Waived, Failed, In Review, Not Started, and a completion percentage) on the detail dashboard, **so that** I know how close the engagement is to P4 readiness without asking Carla directly.

**Acceptance Criteria:**
- [ ] Reference check metrics displayed: total statements, passed, waived, failed, in review, not started, completion % ((Passed + Waived) / Total)
- [ ] A progress bar displays completion percentage visually
- [ ] If no draft product exists, the section shows: "Draft product not created yet."
- [ ] Dashboard loads all metrics within 3 seconds for ≤500 evidence items and ≤100 statements

**Priority:** P1 | **Feature Ref:** F15

---

### US-15.6: View the Open Blockers Panel
**As a** Diana Okafor (EM), **I want to** see a consolidated open blockers panel on the detail dashboard, **so that** I know exactly what is preventing the next gate without checking multiple pages.

**Acceptance Criteria:**
- [ ] Blockers panel lists all current blocking conditions from F04.4 (same logic as Engagement Shell)
- [ ] When no blockers: shows "✓ No open blockers" in green
- [ ] When blockers exist: each blocker is labeled with a link to the affected record
- [ ] Blockers panel is always visible (non-collapsible) when blockers exist

**Priority:** P1 | **Feature Ref:** F15

---

## Epic 16: Persona and Journey Artifacts (F16)

*Maintain persona definitions and journey maps to guide design and generate acceptance tests. Journey: All journeys.*

---

### US-16.1: Define and Reference Target Personas
**As a** Diana Okafor (EM) or James Whitfield (QA), **I want to** find a documented summary of all 7 user personas with their role, responsibilities, and goals, **so that** requirement and design decisions are grounded in real user needs.

**Acceptance Criteria:**
- [ ] Seven personas are defined: Engagement Acceptance Lead, Engagement Manager, Analyst, QA Reviewer, Independent Referencer, Publishing Coordinator, Read-Only Stakeholder
- [ ] Each persona includes: role title, responsibilities, primary goals, and gate role
- [ ] Personas are referenced in feature documentation with Primary/Secondary user designations

**Priority:** P1 | **Feature Ref:** F16

---

### US-16.2: Define the Five Primary User Journeys
**As a** development team member, **I want to** reference the five primary journeys (J1–J5) with their start conditions, end conditions, primary personas, and covered features, **so that** acceptance tests and UX flows are aligned to real user goals.

**Acceptance Criteria:**
- [ ] Five journeys are defined: J1 Intake and Acceptance, J2 Planning Setup, J3 Evidence Readiness, J4 Draft Readiness, J5 Final Readiness
- [ ] Each journey includes: primary persona, start condition, end condition, and features covered
- [ ] Feature-to-persona mapping table is maintained linking F0–F17 to their primary journeys and personas

**Priority:** P1 | **Feature Ref:** F16

---

### US-16.3: Map Gate Scenarios for Acceptance Test Generation
**As a** QA team member or Admin, **I want to** reference gate scenario specifications (positive and negative paths for A1, P2, P3, P4), **so that** acceptance tests cover both the happy path and all blocking conditions.

**Acceptance Criteria:**
- [ ] Six gate scenarios are documented: S-A1-APPROVE, S-A1-DECLINE, S-P2-APPROVE, S-P2-RETURN, S-P3-APPROVE, S-P4-APPROVE
- [ ] Each scenario specifies: positive path (passes) and negative path (blocked) with expected system responses
- [ ] Scenarios are directly linked to acceptance tests in F17

**Priority:** P1 | **Feature Ref:** F16

---

## Epic 17: Basic Acceptance Test Generation (F17)

*Provide a compact set of acceptance tests for all gate journeys, dashboards, and exports. Journey: All journeys.*

---

### US-17.1: Validate Request Submission and Gate A1 Behavior
**As a** QA team member, **I want to** run acceptance tests that verify the complete A1 path (draft create → submit → approve → decline), **so that** I can confirm Gate A1 blocks incomplete requests and creates an engagement shell on approval.

**Acceptance Criteria:**
- [ ] AT-A1-01: Draft request saves successfully with `status = draft`
- [ ] AT-A1-02: Complete request submission sets `status = submitted` and writes `REQUEST_SUBMITTED` audit event
- [ ] AT-A1-03: Submit with missing requester field returns HTTP 422 with field-level error
- [ ] AT-A1-04: A1 approval creates Engagement Shell, sets `status = accepted`, writes `GATE_A1_APPROVED`
- [ ] AT-A1-05: A1 approve without risk level returns HTTP 422: "Risk level is required."
- [ ] AT-A1-06: A1 approve without rationale returns HTTP 422: "Rationale must be at least 10 characters."
- [ ] AT-A1-07: A1 decline with rationale sets `status = declined`, no engagement created, writes `GATE_A1_DECLINED`
- [ ] AT-A1-08: A1 decided engagement appears on Portfolio Dashboard with correct A1 gate status

**Priority:** P1 | **Feature Ref:** F17

---

### US-17.2: Validate Engagement Setup and Gate P2 Behavior
**As a** QA team member, **I want to** run acceptance tests that verify the complete P2 path (add objective → submit for review → approve → return), **so that** I can confirm Gate P2 blocks incomplete planning records and locks the baseline on approval.

**Acceptance Criteria:**
- [ ] AT-P2-01: Objective saves and is visible in the planning record
- [ ] AT-P2-02: Complete planning record submission sets `status = ready_for_review` and appears in QA Review Queue
- [ ] AT-P2-03: Submit with no objectives returns HTTP 422
- [ ] AT-P2-04: Submit with missing risk notes returns HTTP 422
- [ ] AT-P2-05: P2 approval sets `planning_record.status = approved`, `engagement.phase = evidence`, writes gate decision
- [ ] AT-P2-06: P2 approve with no EM on team returns HTTP 422
- [ ] AT-P2-07: P2 return with comments sets `status = returned`, writes `P2/returned` gate decision
- [ ] AT-P2-08: Post-P2 edit with revision note saves changes and writes `PLANNING_RECORD_REVISED` audit event

**Priority:** P1 | **Feature Ref:** F17

---

### US-17.3: Validate Evidence Upload and Gate P3 Behavior
**As a** QA team member, **I want to** run acceptance tests that verify the complete P3 path (upload evidence → link to objective → mark sufficient → approve P3), **so that** I can confirm Gate P3 blocks evidence gaps and approves when all objectives are sufficient.

**Acceptance Criteria:**
- [ ] AT-P3-01: Evidence record created with file upload writes `EVIDENCE_FILE_UPLOADED` audit event
- [ ] AT-P3-02: Uploading a 60MB file returns HTTP 422: "File exceeds maximum size of 50 MB."
- [ ] AT-P3-03: Linking evidence to objective creates link and increments objective evidence count
- [ ] AT-P3-04: Marking objective Sufficient removes it from the gap view
- [ ] AT-P3-05: P3 approval with all objectives sufficient sets `engagement.phase = draft` and writes `GATE_P3_APPROVED`
- [ ] AT-P3-06: P3 approve with any `evidence_needed` objective returns HTTP 409
- [ ] AT-P3-07: P3 approve with any objective having zero evidence returns HTTP 409
- [ ] AT-P3-08: Restricted evidence item is not visible to RO user in the evidence list

**Priority:** P1 | **Feature Ref:** F17

---

### US-17.4: Validate Reference Check and Gate P4 Behavior
**As a** QA team member, **I want to** run acceptance tests that verify the complete P4 path (create statement → assign → pass/fail reference check → approve P4), **so that** I can confirm Gate P4 blocks incomplete checks and approves when all checks are resolved.

**Acceptance Criteria:**
- [ ] AT-P4-01: Draft statement created with evidence link, `reference_status = not_started`, audit event written
- [ ] AT-P4-02: EM assigns statement to IR; statement appears in IR Review Queue
- [ ] AT-P4-03: IR sets status to `passed`; audit event `REFERENCE_STATUS_CHANGED` written
- [ ] AT-P4-04: IR sets status to `failed` with discrepancy notes; statement appears in Analyst queue
- [ ] AT-P4-05: IR sets status to `failed` without discrepancy notes; returns HTTP 422
- [ ] AT-P4-06: EM waives reference check with justification; `reference_status = waived`, audit event written
- [ ] AT-P4-07: P4 approval with all checks Passed/Waived sets `engagement.status = ready_for_issuance`, writes `GATE_P4_APPROVED`
- [ ] AT-P4-08: P4 approve with any failed check returns HTTP 409
- [ ] AT-P4-09: P4 approve when P3 not approved returns HTTP 409

**Priority:** P1 | **Feature Ref:** F17

---

### US-17.5: Validate Dashboard Visibility and CSV Export Behavior
**As a** QA team member, **I want to** run acceptance tests that verify the portfolio dashboard, engagement detail dashboard, CSV exports, and access controls, **so that** I can confirm visibility and export functions work correctly for all authorized roles.

**Acceptance Criteria:**
- [ ] AT-DASH-01: Portfolio dashboard shows correct count cards and engagement list with all required columns
- [ ] AT-DASH-02: Filtering by High risk shows only high-risk engagements; count cards update
- [ ] AT-DASH-03: Exporting engagement register downloads CSV with correct columns and writes `ENGAGEMENT_REGISTER_EXPORTED` audit event
- [ ] AT-DASH-04: Engagement detail dashboard shows gate cards, milestones, evidence counts, reference check %, and blockers
- [ ] AT-DASH-05: Exporting evidence registry downloads CSV with correct columns; restricted items excluded for RO/AL
- [ ] AT-DASH-06: Audit trail for an engagement shows all logged events with actor, action, and timestamp in reverse chronological order
- [ ] AT-DASH-07: RO user cannot see edit controls on the Engagement Shell; direct API call to edit endpoint returns HTTP 403

**Priority:** P1 | **Feature Ref:** F17

---

## Story Index

| Story ID | Title | Priority | Feature Ref | Primary Persona | Journey |
|----------|-------|----------|-------------|-----------------|---------|
| US-0.1 | Login to the Application | P0 | F0 | All roles | All |
| US-0.2 | Logout of the Application | P0 | F0 | All roles | All |
| US-0.3 | Navigate via Main Menu | P0 | F0 | All roles | All |
| US-0.4 | Search for Engagements | P0 | F0 | All roles | All |
| US-0.5 | View Audit Trail | P0 | F0 | PER-01, PER-02 | All |
| US-0.6 | Assign User Roles (Admin) | P0 | F0 | Admin | All |
| US-1.1 | Persistent Core Records | P0 | F1 | PER-02 | All |
| US-1.2 | Enforce Allowed Values | P0 | F1 | All roles | All |
| US-2.1 | Create Draft Request | P0 | F2 | PER-01 | J1 |
| US-2.2 | Complete and Submit Request | P0 | F2 | PER-01 | J1 |
| US-2.3 | Upload Intake Document | P0 | F2 | PER-01 | J1 |
| US-2.4 | Edit Draft Request | P0 | F2 | PER-01 | J1 |
| US-2.5 | View Request Detail | P0 | F2 | PER-01, PER-07 | J1 |
| US-3.1 | Review Submitted Request for A1 | P0 | F3 | PER-01 | J1 |
| US-3.2 | Approve Request at Gate A1 | P0 | F3 | PER-01 | J1 |
| US-3.3 | Decline Request at Gate A1 | P0 | F3 | PER-01 | J1 |
| US-3.4 | A1 Decision Reflected Across System | P0 | F3 | PER-02, PER-07 | J1 |
| US-4.1 | View Engagement Shell | P0 | F4 | PER-02 | J2–J5 |
| US-4.2 | Edit Engagement Metadata | P0 | F4 | PER-02 | J2 |
| US-4.3 | See Open Blockers | P0 | F4 | PER-02 | J2–J5 |
| US-4.4 | Navigate to Linked Artifacts | P0 | F4 | PER-02 | J2–J5 |
| US-5.1 | Assign Team Members | P0 | F5 | PER-02 | J2 |
| US-5.2 | Remove Team Members | P0 | F5 | PER-02 | J2 |
| US-5.3 | Set Milestone Target Dates | P0 | F5 | PER-02 | J2 |
| US-5.4 | View Milestone Status | P0 | F5 | PER-02, PER-07 | J2–J5 |
| US-6.1 | Create Planning Record | P0 | F6 | PER-02 | J2 |
| US-6.2 | Add and Manage Objectives | P0 | F6 | PER-02, PER-03 | J2 |
| US-6.3 | Complete Planning Sections | P0 | F6 | PER-02, PER-03 | J2 |
| US-6.4 | Submit Planning Record for P2 | P0 | F6 | PER-02 | J2 |
| US-6.5 | Edit Approved Planning Record | P0 | F6 | PER-02 | J2 |
| US-7.1 | Review Planning Record for P2 | P0 | F7 | PER-04 | J2 |
| US-7.2 | Approve Planning Baseline at P2 | P0 | F7 | PER-04 | J2 |
| US-7.3 | Return Planning Record for Revision | P0 | F7 | PER-04 | J2 |
| US-7.4 | P2 Decision Status Visible | P0 | F7 | PER-02 | J2 |
| US-8.1 | Add an Evidence Record | P0 | F8 | PER-03 | J3 |
| US-8.2 | Upload Files to Evidence Record | P0 | F8 | PER-03 | J3 |
| US-8.3 | Mark Evidence as Restricted | P0 | F8 | PER-03 | J3 |
| US-8.4 | View and Filter Evidence List | P0 | F8 | PER-03, PER-04 | J3 |
| US-8.5 | Delete Evidence Record | P0 | F8 | PER-03 | J3 |
| US-9.1 | Link Evidence to Objectives | P0 | F9 | PER-03 | J3 |
| US-9.2 | View Linked Evidence Per Objective | P0 | F9 | PER-03, PER-04 | J3 |
| US-9.3 | Identify Evidence Gaps | P0 | F9 | PER-03, PER-04 | J3 |
| US-9.4 | Export Evidence Registry to CSV | P0 | F9 | PER-03, PER-02 | J3 |
| US-10.1 | Create Finding Record | P0 | F10 | PER-03 | J3 |
| US-10.2 | Link Finding to Evidence | P0 | F10 | PER-03 | J3 |
| US-10.3 | Mark Objective Evidence Status | P0 | F10 | PER-04 | J3 |
| US-10.4 | Approve Evidence Sufficiency at P3 | P0 | F10 | PER-04 | J3 |
| US-11.1 | Create Draft Product Record | P0 | F11 | PER-02 | J4 |
| US-11.2 | Attach Draft File | P0 | F11 | PER-03, PER-02 | J4 |
| US-11.3 | Record Review Comments | P0 | F11 | PER-04, PER-02 | J4 |
| US-11.4 | Advance Draft Status | P0 | F11 | PER-02 | J4 |
| US-12.1 | Create Draft Statements (Indexing) | P0 | F12 | PER-03 | J4 |
| US-12.2 | Link Statements to Evidence | P0 | F12 | PER-03 | J4 |
| US-12.3 | Assign Statement for Reference Check | P0 | F12 | PER-02 | J4 |
| US-12.4 | Perform Reference Check (Pass/Fail) | P0 | F12 | PER-05 | J4 |
| US-12.5 | Assign Failed Statement Back to Analyst | P0 | F12 | PER-05 | J4 |
| US-12.6 | Waive a Reference Check | P0 | F12 | PER-02 | J4 |
| US-12.7 | View Reference Check Progress | P0 | F12 | PER-02, PER-06 | J4–J5 |
| US-13.1 | View Final Readiness Checklist | P0 | F13 | PER-06 | J5 |
| US-13.2 | Approve Final Readiness at P4 | P0 | F13 | PER-06, PER-02 | J5 |
| US-13.3 | Close Engagement Without Issuance | P0 | F13 | PER-02 | J5 |
| US-13.4 | P4 Decision Reflected Across System | P0 | F13 | PER-07, PER-02 | J5 |
| US-14.1 | View Portfolio Summary Count Cards | P1 | F14 | PER-07 | All |
| US-14.2 | Filter the Engagement List | P1 | F14 | PER-02 | All |
| US-14.3 | View Engagement List with Key Columns | P1 | F14 | PER-07 | All |
| US-14.4 | Export Engagement Register to CSV | P1 | F14 | PER-07 | All |
| US-15.1 | View Phase/Status/Owner Summary | P1 | F15 | PER-02 | J2–J5 |
| US-15.2 | View Gate Status Cards on Detail Dashboard | P1 | F15 | PER-02 | J2–J5 |
| US-15.3 | View Milestone Timeline | P1 | F15 | PER-02 | J2–J5 |
| US-15.4 | View Evidence and Objective Progress | P1 | F15 | PER-04 | J3 |
| US-15.5 | View Reference Check Completion Metrics | P1 | F15 | PER-06 | J4–J5 |
| US-15.6 | View Open Blockers Panel | P1 | F15 | PER-02 | J2–J5 |
| US-16.1 | Define and Reference Target Personas | P1 | F16 | PER-02, PER-04 | All |
| US-16.2 | Define Primary User Journeys | P1 | F16 | Dev team | All |
| US-16.3 | Map Gate Scenarios for Acceptance Tests | P1 | F16 | QA team | All |
| US-17.1 | Validate A1 Gate Tests | P1 | F17 | QA team | J1 |
| US-17.2 | Validate P2 Gate Tests | P1 | F17 | QA team | J2 |
| US-17.3 | Validate P3 Gate Tests | P1 | F17 | QA team | J3 |
| US-17.4 | Validate P4 Gate Tests | P1 | F17 | QA team | J5 |
| US-17.5 | Validate Dashboard and Export Tests | P1 | F17 | QA team | All |

**Total stories: 79 across 18 epics (F0–F17)**

---

*Document generated: 2026-06-04*
*Source: PRD-EMS.md v1.0, FRD-EMS.md v1.0, PERSONAS-EMS.md v1.0*
*Downstream consumers: UX design, sprint planning, acceptance test scripts*
