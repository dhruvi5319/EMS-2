# Jobs-to-be-Done (JTBD)
## Lightweight Engagement Management System (EMS)

| Field | Value |
|-------|-------|
| **Product Name** | Lightweight Engagement Management System (EMS) |
| **Version** | 1.0 |
| **Date** | 2026-06-04 |
| **Related Personas** | PERSONAS-EMS.md (PER-01 through PER-07) |
| **Related PRD** | PRD-EMS.md |
| **Related Project** | .planning/PROJECT.md |

---

## JTBD Summary Table

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---------|---------|----------------------------|----------|
| JTBD-01.1 | PER-01 Marcus Reid (Acceptance Lead) | When reviewing an incoming request, capture all required intake fields to enable an informed A1 decision | P0 |
| JTBD-01.2 | PER-01 Marcus Reid (Acceptance Lead) | When deciding on a submitted request, record approve or decline with rationale so the decision is durable and visible | P0 |
| JTBD-01.3 | PER-01 Marcus Reid (Acceptance Lead) | When managing multiple pending requests, see all current statuses at a glance so I can prioritize follow-up | P1 |
| JTBD-02.1 | PER-02 Diana Okafor (Engagement Manager) | When an engagement is accepted, set up the full engagement shell so the team has a single system of record from day one | P0 |
| JTBD-02.2 | PER-02 Diana Okafor (Engagement Manager) | When building the planning baseline, capture and submit all required planning fields so P2 can be approved in one session | P0 |
| JTBD-02.3 | PER-02 Diana Okafor (Engagement Manager) | When managing an active engagement, see gate status, blockers, and milestone health without leaving the engagement page | P0 |
| JTBD-03.1 | PER-03 Priya Nair (Analyst) | When collecting evidence, add and link each item to objectives so I can see which objectives still have gaps | P0 |
| JTBD-03.2 | PER-03 Priya Nair (Analyst) | When preparing for P3, create finding records linked to evidence so the QA Reviewer can assess sufficiency | P0 |
| JTBD-03.3 | PER-03 Priya Nair (Analyst) | When supporting reference checks, link draft statements to evidence and resolve discrepancies from my queue without relying on email | P0 |
| JTBD-04.1 | PER-04 James Whitfield (QA Reviewer) | When a planning baseline arrives for review, assess completeness and record an approve or return decision with comments in a single action | P0 |
| JTBD-04.2 | PER-04 James Whitfield (QA Reviewer) | When a P3 submission arrives, confirm every objective has sufficient evidence and record my approval so the engagement can advance | P0 |
| JTBD-04.3 | PER-04 James Whitfield (QA Reviewer) | When managing concurrent reviews, see all engagements awaiting my action so I can prioritize my review queue | P1 |
| JTBD-05.1 | PER-05 Carla Voss (Independent Referencer) | When performing reference checks, work through a structured statement queue with evidence linked in place so I can mark each item Passed or Failed without leaving the system | P0 |
| JTBD-05.2 | PER-05 Carla Voss (Independent Referencer) | When I flag a failed statement, assign the discrepancy back to the Analyst and confirm it is tracked so nothing falls through email | P0 |
| JTBD-06.1 | PER-06 Tom Andrade (Publishing Coordinator) | When approving final readiness, verify all P4 prerequisites are met and record my approval so the engagement is formally closed in the system | P0 |
| JTBD-06.2 | PER-06 Tom Andrade (Publishing Coordinator) | When preparing for P4, confirm that all reference checks are resolved before I proceed so my sign-off is not based on incomplete information | P0 |
| JTBD-07.1 | PER-07 Sandra Wu (Read-Only Stakeholder) | When preparing for a briefing or status report, view the current portfolio in one screen so I can answer questions without contacting the team | P1 |
| JTBD-07.2 | PER-07 Sandra Wu (Read-Only Stakeholder) | When a stakeholder asks about a specific engagement, drill into that record and see gate status, milestones, and blockers immediately | P1 |

---

## PER-01: Marcus Reid — Engagement Acceptance Lead

---

### JTBD-01.1: Complete Intake Record for an Informed Decision

**Job Statement:**
When I receive a new congressional request, mandate, or internal proposal, I want to capture all required intake fields — type, requester, topic, agency, due date, and supporting document — in one form, so I can ensure the acceptance decision is based on complete information without hunting across emails and folders.

**Current Alternatives:**
- Manually assembles intake details from email threads, shared drive files, and personal notes
- Creates a spreadsheet row per request, often missing fields that arrive later
- Attaches intake documents by renaming files in a shared folder — no formal link to the request record

**Hiring Criteria:**
- Single intake form captures all required fields with inline validation before submission
- Supports upload of one intake document tied to the request record
- Saves as Draft so he can return to complete it before submitting
- Required fields are clearly labeled and flagged before the form can be submitted

**Success Measure:** Marcus can create and submit a complete request record — including an attached intake document — in under 5 minutes with no fields left blank.

**Related Features:** F2, F1
**Priority:** P0

---

### JTBD-01.2: Durable Accept/Decline Decision with Recorded Rationale

**Job Statement:**
When I am ready to decide on a submitted request, I want to record an A1 approve or decline decision with a rationale in a single action, so I can ensure the decision is auditable, the engagement shell is created automatically on approval, and the decision is visible to the team without a separate communication step.

**Current Alternatives:**
- Records decisions in personal notes files that are not shared reliably
- Sends an acceptance email to the team and separately updates the spreadsheet — two manual steps
- Declined requests are closed only in his personal tracker; others may not know the status

**Hiring Criteria:**
- Approve and Decline actions are available from the request detail page with a rationale text field
- Approval automatically creates an engagement shell — no separate manual setup required
- Decline closes the request and records the rationale visibly in the system
- Both outcomes write an audit event with actor, timestamp, and rationale

**Success Measure:** A1 approval creates an engagement shell with zero manual follow-up steps; the decision is visible in the audit trail and portfolio dashboard within seconds.

**Related Features:** F3, F4, F0
**Priority:** P0

---

### JTBD-01.3: Single-View Status of All Pending Requests

**Job Statement:**
When I arrive at work and need to determine where each pending request stands, I want to see all current requests with their status and key metadata in one view, so I can answer "where does that request stand?" without piecing information together from multiple files.

**Current Alternatives:**
- Opens a personal spreadsheet maintained in a shared drive — often out of sync after others touch it
- Relies on email timestamps to reconstruct the sequence of events for a given request
- No quick way to see which requests are overdue or awaiting his action specifically

**Hiring Criteria:**
- Dashboard lists all pending requests with current status (Draft, Submitted, Accepted, Declined)
- Filters allow him to narrow by status, request type, or due date
- Status is always current — not dependent on a manual refresh or offline sync

**Success Measure:** Marcus can identify which requests need his action and which are waiting on others within 30 seconds of viewing the portfolio dashboard, with no additional navigation.

**Related Features:** F14, F0
**Priority:** P1

---

## PER-02: Diana Okafor — Engagement Manager

---

### JTBD-02.1: Full Engagement Shell Setup After Acceptance

**Job Statement:**
When an engagement is accepted at Gate A1, I want to complete the engagement shell — job code, title, owner, risk level, team assignments, and milestone dates — in a single session, so I can establish the system of record that the entire team will rely on from day one without re-entering data across multiple tools.

**Current Alternatives:**
- Creates a new spreadsheet per engagement and manually populates team roles and milestone dates
- Maintains a separate roster document for team assignments that quickly falls out of sync
- Job code and title exist in email; she must copy them manually into the tracker

**Hiring Criteria:**
- Engagement shell is pre-populated with data from the accepted request (type, requester, due date)
- She can assign team members to predefined roles from within the shell
- Milestone dates can be set with status indicators (Not Started, On Track, At Risk, Complete)
- All changes are saved in the engagement record and reflected on the detail dashboard immediately

**Success Measure:** Diana can complete a full engagement shell setup — including team assignments and milestone dates — in under 20 minutes starting from the newly created shell.

**Related Features:** F4, F5, F1
**Priority:** P0

---

### JTBD-02.2: Planning Baseline Ready for P2 in a Single Session

**Job Statement:**
When the team is ready to define scope and approach, I want to build a complete planning record — objectives, design approach, schedule, risk notes, data reliability notes, and independence affirmations — and submit it for P2 review in one session, so I can establish the approved baseline that protects the team from scope ambiguity throughout the engagement.

**Current Alternatives:**
- Drafts planning details in a Word document shared by email — no formal version control or approval record
- Independence affirmations are collected via email reply and copied manually into the planning file
- No clear indicator of when the planning record is complete enough to submit for approval

**Hiring Criteria:**
- Planning form contains all required fields with completion indicators
- System blocks P2 submission until all required fields (including at least one objective) are present
- Independence affirmation status is captured per team member in the planning record
- Submitting for P2 requires one action; the QA Reviewer receives the submission automatically

**Success Measure:** Diana can build and submit a complete planning record for P2 — including all required fields and at least one objective — in a single working session without leaving the system.

**Related Features:** F6, F7, F5
**Priority:** P0

---

### JTBD-02.3: Gate Status and Blocker Visibility Without Chasing

**Job Statement:**
When I am managing an active engagement, I want to see gate status, open blockers, evidence coverage gaps, and milestone health on the engagement detail page, so I can identify what is blocking progress and act on it without chasing team members or checking multiple files.

**Current Alternatives:**
- Checks gate status by reviewing email threads with the QA Reviewer and Independent Referencer
- Tracks blockers in a personal notes document that is not visible to other team members
- Evidence progress is inferred from the shared drive folder — she counts files manually

**Hiring Criteria:**
- Engagement detail page shows current gate status for A1, P2, P3, and P4 at a glance
- Open blockers are listed on the same page with enough detail to act on them
- Evidence progress shows objectives with and without linked evidence
- Reference check completion percentage is visible from the engagement page

**Success Measure:** Diana can identify all current blockers and gate prerequisites on a single engagement within 60 seconds of opening the engagement detail page with no additional navigation.

**Related Features:** F15, F4, F9, F12
**Priority:** P0

---

## PER-03: Priya Nair — Analyst

---

### JTBD-03.1: Add Evidence and Immediately See Objective Coverage Gaps

**Job Statement:**
When I collect a new piece of evidence — a document, dataset, or interview note — I want to add it with the required metadata, upload the file, and link it to one or more objectives, so I can immediately see which objectives still have no linked evidence and prioritize my collection work without maintaining a separate tracking spreadsheet.

**Current Alternatives:**
- Saves evidence files in a shared drive folder organized by engagement — no structured metadata record
- Tracks evidence-to-objective mapping in a personal spreadsheet that others cannot see
- Objective gaps are discovered late, often only when the QA Reviewer raises them during P3 review

**Hiring Criteria:**
- Evidence form captures type, source, date received, sensitivity flag, and file upload in one step
- After saving, she can link the evidence item to one or more objectives from the same view
- A gap view shows all objectives that have no linked evidence — visible without additional navigation
- Evidence list is filterable by objective and exportable to CSV

**Success Measure:** Priya can add an evidence item, upload the file, link it to an objective, and verify objective gap status in under 3 minutes.

**Related Features:** F8, F9, F1
**Priority:** P0

---

### JTBD-03.2: Create Findings Linked to Evidence for P3 Sufficiency Review

**Job Statement:**
When an engagement approaches Gate P3, I want to create finding records linked to the supporting evidence and mark each objective's sufficiency status, so the QA Reviewer can assess evidence completeness without relying on my verbal explanation of which documents back which conclusions.

**Current Alternatives:**
- Writes findings in a separate Word document with informal references to file names in the shared drive
- The QA Reviewer must navigate the shared drive independently to verify that evidence exists
- Evidence gaps are not visible until the QA Reviewer manually builds a checklist

**Hiring Criteria:**
- Each finding record can be linked to one or more evidence items from within the finding form
- Objective sufficiency status (Evidence Needed, In Review, Sufficient) is visible per objective
- System blocks P3 submission if any objective is still marked Evidence Needed
- Finding records are associated with the engagement and visible to the QA Reviewer

**Success Measure:** Priya can create a finding record, link it to evidence, and update objective sufficiency status in under 5 minutes; the QA Reviewer sees the updated status without any offline communication.

**Related Features:** F10, F8, F9
**Priority:** P0

---

### JTBD-03.3: Link Draft Statements to Evidence and Resolve Discrepancies from Queue

**Job Statement:**
When the engagement moves into the indexing phase, I want to add draft statement records linked to supporting evidence and resolve any discrepancy assignments that come back from the Independent Referencer, so I can close the reference check loop quickly without relying on email to discover what needs correction.

**Current Alternatives:**
- Receives a list of statements in a Word document with informal evidence citations — no structured link
- Learns about discrepancies through email from the Independent Referencer, which may arrive late or go to the wrong inbox
- Must manually search for the failed statement and evidence to understand what correction is needed

**Hiring Criteria:**
- Draft statement records can be added and linked to evidence items from within the indexing interface
- Failed statements assigned back by the Independent Referencer surface in her task queue automatically
- Each discrepancy assignment shows the statement, the failed reference status, and the discrepancy note
- She can update the evidence link or add a correction note and resubmit for reference check

**Success Measure:** When a statement is failed by the Independent Referencer, Priya receives it in her queue — with the statement text, linked evidence, and discrepancy note visible — within the same session, with no email required.

**Related Features:** F12, F8
**Priority:** P0

---

## PER-04: James Whitfield — QA Reviewer

---

### JTBD-04.1: Review Planning Baseline and Record P2 Decision in a Single Action

**Job Statement:**
When a planning baseline is submitted for Gate P2, I want to review the completeness of all required planning fields — objectives, design approach, schedule, risk notes, data reliability notes, and independence status — and record an approve or return decision with comments in one action, so I can close the review loop quickly and create a durable record of what I approved or what must change.

**Current Alternatives:**
- Receives an email notification with a link to a shared drive folder, then opens multiple files to assess completeness
- Builds his own Word document checklist for each engagement to track what is and is not present
- Return comments are sent by email and not formally linked to the planning record — teams may dispute them later

**Hiring Criteria:**
- Planning review page shows all required fields with a completeness indicator before he begins
- He can approve or return with comments from a single action — no separate email or document required
- Return comments are recorded in the system and visible to the Engagement Manager immediately
- All P2 decisions are written to the audit trail with his name, timestamp, and rationale

**Success Measure:** James can complete a full P2 review — assessing all required fields and recording an approval or return decision — in under 15 minutes, with the decision immediately visible to the team.

**Related Features:** F7, F6, F0
**Priority:** P0

---

### JTBD-04.2: Confirm Evidence Sufficiency Per Objective and Approve P3

**Job Statement:**
When a P3 submission arrives, I want to see evidence coverage for every objective — including which objectives have no linked evidence or are still marked Evidence Needed — and approve or return the gate with comments, so I can confirm that the analytical team has sufficient support before draft readiness work begins.

**Current Alternatives:**
- Reviews evidence files in the shared drive and cross-references a planning document to identify which objectives are covered
- Has no structured view of objectives with missing or insufficient evidence — must build his own
- P3 return comments are communicated by email and not formally tracked against the engagement record

**Hiring Criteria:**
- Evidence sufficiency view shows all objectives with their linked evidence count and current sufficiency status
- System blocks P3 approval if any objective is still marked Evidence Needed
- He can record approval or return with comments from the same interface
- P3 decision is written to the audit trail with actor, timestamp, and comment

**Success Measure:** James can review evidence coverage for all objectives, identify any gaps, and record a P3 decision — all within the same page — in under 15 minutes.

**Related Features:** F10, F9, F8, F0
**Priority:** P0

---

### JTBD-04.3: See All Engagements Awaiting Review in a Single Queue

**Job Statement:**
When I begin my workday, I want to see every engagement currently waiting for my P2 or P3 review action in one place, so I can sequence my reviews by urgency without depending on email notifications or personal follow-up to discover what is in my queue.

**Current Alternatives:**
- Learns about pending reviews through email from Engagement Managers — timing is inconsistent
- Maintains a personal list of engagements he is tracking for review — no automatic updates when status changes
- Has no visibility into how long a submission has been waiting for his action

**Hiring Criteria:**
- Dashboard or review queue shows all engagements in a submitted-for-review state filtered to his role
- Each row shows engagement title, gate type awaiting review (P2 or P3), and submission date
- Clicking a row opens the relevant review directly

**Success Measure:** James can see all engagements awaiting his review, ranked or sortable by submission date, within 30 seconds of opening the review queue — without email or manual discovery.

**Related Features:** F14, F15, F0
**Priority:** P1

---

## PER-05: Carla Voss — Independent Referencer

---

### JTBD-05.1: Work Through a Structured Reference Check Queue With Evidence Inline

**Job Statement:**
When I am assigned to perform reference checks on an engagement, I want to see all draft statements in a structured queue — each with the linked evidence accessible directly in the interface — so I can mark each statement Passed, Failed, or In Review without navigating to a separate drive or document.

**Current Alternatives:**
- Receives a Word document listing statements with informal file path references — no direct links to evidence
- Opens the shared drive in a separate window and searches manually for each evidence file
- Records her review results in a personal spreadsheet and emails it back to the Engagement Manager

**Hiring Criteria:**
- Reference check queue shows all draft statements assigned for the engagement in one list view
- Each statement row shows current reference status (Not Started, In Review, Passed, Failed)
- Evidence items linked to the statement are accessible — viewable or downloadable — directly from the statement row
- She can update reference status with a single action per statement

**Success Measure:** Carla can access the full reference check queue, open a linked evidence file, and mark a statement Passed or Failed in under 2 minutes per statement — without leaving the reference check interface.

**Related Features:** F12, F8
**Priority:** P0

---

### JTBD-05.2: Assign Failed Statements Back to the Analyst With a Tracked Discrepancy Note

**Job Statement:**
When I mark a statement as Failed, I want to add a discrepancy note and assign it back to the Analyst in the system, so the correction loop is tracked as a record — not an email — and I can confirm every failed statement is resolved before the engagement advances to Gate P4.

**Current Alternatives:**
- Sends a discrepancy email to the Engagement Manager, who forwards it to the Analyst — a two-step relay with no tracking
- Has no visibility into whether the Analyst acted on the discrepancy or when
- Must re-check the shared spreadsheet manually to see if the statement was corrected and resubmitted

**Hiring Criteria:**
- Failing a statement prompts her to add a discrepancy note before saving
- The failed statement with note is automatically added to the Analyst's work queue — no email required
- She can see the current resolution status of each failed statement she assigned
- All failed and assigned statements are visible on the reference check completion view

**Success Measure:** After marking a statement Failed and adding a discrepancy note, the statement appears in the Analyst's queue automatically — Carla can confirm this within the same session with no email sent.

**Related Features:** F12, F13
**Priority:** P0

---

## PER-06: Tom Andrade — Publishing Coordinator

---

### JTBD-06.1: Verify All P4 Prerequisites and Record Final Readiness Approval

**Job Statement:**
When I receive an engagement for final readiness review, I want to see a checklist that explicitly shows all Gate P4 prerequisites — P3 passed, all reference checks resolved, no open blockers — and record my approval in a single action, so the engagement status is updated to Ready for Issuance and an audit event is written without any separate communication or document filing.

**Current Alternatives:**
- Calls or emails the Independent Referencer to confirm reference checks are complete — no in-system verification
- Records his sign-off in a shared Word document filed in the engagement folder — editable and not durable
- Manually updates a status field in the shared spreadsheet after signing off — a separate step that is often delayed

**Hiring Criteria:**
- Final readiness page shows each P4 prerequisite with a clear pass/fail indicator
- System prevents P4 approval if any reference check is Failed or In Review — no override without a waiver
- Approve action requires a comment field and sets engagement status to Ready for Issuance or Closed automatically
- P4 approval creates an audit event with his name, timestamp, and comment

**Success Measure:** Tom can complete the entire P4 readiness review and record a final approval — with all prerequisites verified in-system — in under 10 minutes, with the engagement status automatically updated.

**Related Features:** F13, F12, F0
**Priority:** P0

---

### JTBD-06.2: Confirm All Reference Checks Are Resolved Before Signing Off

**Job Statement:**
When I am preparing to approve Gate P4, I want to see the reference check completion status — including any Failed or In Review items — from the final readiness page, so I can confirm there are no outstanding issues before my approval and avoid signing off on an engagement that is not actually ready.

**Current Alternatives:**
- Contacts the Independent Referencer directly by phone or email to ask whether all checks are done
- Reviews the reference spreadsheet emailed by the Independent Referencer — which may be outdated by the time it reaches him
- Has no system-enforced block that prevents him from signing off when checks are incomplete

**Hiring Criteria:**
- Reference check summary is visible on the P4 readiness page, showing total statements, Passed count, and any Failed or In Review items
- System enforces a hard block: P4 cannot be approved while any statement is Failed or In Review
- Explicitly waived statements are shown with the waiver notation so he can confirm intent

**Success Measure:** Tom can verify full reference check completion status — including any outstanding items — from the P4 readiness page without contacting the Independent Referencer, in under 2 minutes.

**Related Features:** F12, F13, F15
**Priority:** P0

---

## PER-07: Sandra Wu — Read-Only Stakeholder

---

### JTBD-07.1: View Current Portfolio Status for Briefings and Reports

**Job Statement:**
When I am preparing for an executive briefing or compiling a weekly status report, I want to see all engagements with their current phase, owner, risk level, next milestone, and gate status in a single dashboard view, so I can answer portfolio-level questions accurately without contacting the Engagement Manager or waiting for a manually compiled summary.

**Current Alternatives:**
- Receives a weekly status email from the Engagement Manager — often 2–3 days out of date
- Calls or emails the Engagement Manager when a stakeholder asks an unexpected question mid-week
- Has no ability to self-serve current status between weekly updates

**Hiring Criteria:**
- Portfolio dashboard is accessible within 30 seconds of login with no additional navigation
- Each row shows engagement ID, title, phase, owner, risk level, next milestone, and gate status — visible without any drilldown
- Dashboard reflects the current state of the system — not a cached or scheduled snapshot
- Engagement list can be exported to CSV in one action for external reporting

**Success Measure:** Sandra can reach the portfolio dashboard and answer a question about any engagement's current phase, owner, and gate status within 60 seconds of opening the application — without contacting anyone.

**Related Features:** F14, F0
**Priority:** P1

---

### JTBD-07.2: Drill Into a Specific Engagement to Answer Targeted Questions

**Job Statement:**
When a stakeholder or executive asks about a specific engagement ahead of a meeting or hearing, I want to open that engagement's detail page and immediately see gate status, milestone dates, and open blockers, so I can provide an accurate, current answer without needing to contact the team or learn a complex navigation path.

**Current Alternatives:**
- Emails the Engagement Manager to request a status update — response time varies
- Cannot access the shared drive files without knowing the folder structure — navigating is slow and error-prone
- Gate decisions and their rationale are not visible to her at all in the current setup

**Hiring Criteria:**
- She can reach an engagement detail page by searching by title or engagement ID from the portfolio view
- Detail page shows current phase, gate status for all gates, next milestone, and open blockers — all on one screen
- She cannot accidentally edit any record — her role enforces read-only access at the system level
- Gate decision history (approver, date, rationale) is visible from the detail page

**Success Measure:** Sandra can open a specific engagement and find current gate status, milestone dates, and open blockers within 60 seconds — without asking anyone and without requiring training.

**Related Features:** F15, F4, F0
**Priority:** P1

---

## Outcome-to-Feature Traceability

| JTBD-ID | Related Feature(s) | Expected Outcome |
|---------|-------------------|------------------|
| JTBD-01.1 | F2, F1 | Complete intake record created and submitted with no fields missing; intake document attached |
| JTBD-01.2 | F3, F4, F0 | A1 decision recorded with rationale; engagement shell auto-created on approval; audit event written |
| JTBD-01.3 | F14, F0 | All pending requests visible in one filterable dashboard view; status always current |
| JTBD-02.1 | F4, F5, F1 | Engagement shell fully populated with team and milestones in under 20 minutes; pre-populated from request |
| JTBD-02.2 | F6, F7, F5 | Complete planning record submitted for P2 in one session; system blocks submission if required fields missing |
| JTBD-02.3 | F15, F4, F9, F12 | All gate status, blockers, evidence coverage, and reference progress visible on one engagement page |
| JTBD-03.1 | F8, F9, F1 | Evidence added with metadata and file; linked to objectives; gap view shows uncovered objectives immediately |
| JTBD-03.2 | F10, F8, F9 | Finding records linked to evidence; objective sufficiency statuses visible to QA Reviewer; P3 blocked if gaps exist |
| JTBD-03.3 | F12, F8 | Draft statements linked to evidence in system; discrepancy assignments surface in Analyst queue automatically |
| JTBD-04.1 | F7, F6, F0 | Planning completeness visible before review begins; P2 decision recorded with comments in one action; audit event written |
| JTBD-04.2 | F10, F9, F8, F0 | Evidence coverage per objective visible; P3 blocked on gaps; decision recorded with actor and timestamp |
| JTBD-04.3 | F14, F15, F0 | Single review queue shows all P2/P3 pending submissions with submission date; no email dependency |
| JTBD-05.1 | F12, F8 | All statements in structured queue with evidence accessible inline; reference status updated per statement in ≤2 min |
| JTBD-05.2 | F12, F13 | Failed statement with discrepancy note routed to Analyst queue automatically; Carla can confirm routing in-session |
| JTBD-06.1 | F13, F12, F0 | P4 checklist shows all prerequisites; approval sets status to Ready for Issuance and writes audit event automatically |
| JTBD-06.2 | F12, F13, F15 | Reference check completion visible on P4 page; system blocks approval while any check is Failed or In Review |
| JTBD-07.1 | F14, F0 | Portfolio dashboard shows all engagements with full status row; CSV export in one action; no manual compilation |
| JTBD-07.2 | F15, F4, F0 | Engagement detail page shows gate status, milestones, blockers, and gate history; read-only enforced by role |

---

## NaC Preview

> **Note:** These are candidate Natural Acceptance Criteria statements. They will be refined and scoped by the Story Map and NaC generator downstream. Each row expresses a testable outcome directly derived from the JTBD success measure.

| JTBD-ID | Outcome | Candidate Natural Acceptance Criteria |
|---------|---------|--------------------------------------|
| JTBD-01.1 | Complete intake record submitted in under 5 min | Given a new request form, when all required fields are filled and an intake document is attached, then the record can be submitted and all field values are persisted |
| JTBD-01.2 | A1 decision creates engagement shell automatically | Given a submitted request, when an Acceptance Lead approves with rationale, then an engagement shell is created, the request transitions to Accepted, and an audit event records actor, timestamp, and rationale |
| JTBD-01.3 | All pending requests visible in one view | Given multiple requests in various statuses, when the Acceptance Lead views the portfolio dashboard, then all requests are listed with current status visible without additional navigation |
| JTBD-02.1 | Engagement shell set up in under 20 min | Given a newly accepted engagement, when the Engagement Manager assigns team members and sets milestone dates, then all assignments and dates are saved and visible on the engagement detail page |
| JTBD-02.2 | Planning record submitted for P2 in one session | Given an engagement in planning, when the Engagement Manager completes all required planning fields including at least one objective, then the record can be submitted for P2 review in a single action |
| JTBD-02.3 | Blockers and gate status visible on one page | Given an active engagement, when the Engagement Manager opens the engagement detail page, then gate status, open blockers, evidence coverage gaps, and reference check completion are all visible without additional navigation |
| JTBD-03.1 | Evidence added and linked to objective in under 3 min | Given an engagement with planning objectives, when the Analyst adds an evidence item with required fields and links it to an objective, then the objective-evidence link is saved and the gap view reflects the updated coverage |
| JTBD-03.2 | Finding linked to evidence; P3 blocked on gaps | Given an engagement approaching P3, when an objective has no linked evidence and the QA Reviewer attempts P3 approval, then the system blocks approval and surfaces the objective as Evidence Needed |
| JTBD-03.3 | Discrepancy assignment in Analyst queue without email | Given a statement marked Failed by the Independent Referencer with a discrepancy note, when the assignment is saved, then the statement appears in the Analyst's task queue with statement text, evidence link, and discrepancy note visible |
| JTBD-04.1 | P2 review and decision completed in under 15 min | Given a submitted planning record, when the QA Reviewer opens the P2 review page, then completeness status is shown before review begins and an approve or return decision with comments can be recorded in a single action |
| JTBD-04.2 | P3 blocked if any objective is Evidence Needed | Given an engagement where at least one objective is marked Evidence Needed, when the QA Reviewer attempts P3 approval, then the system blocks approval and identifies the specific objectives causing the block |
| JTBD-04.3 | Review queue visible without email discovery | Given multiple engagements with P2 or P3 submissions pending, when the QA Reviewer opens the review queue, then all pending submissions are listed with gate type and submission date visible |
| JTBD-05.1 | Full reference check queue with evidence inline | Given an engagement in the reference check phase, when the Independent Referencer opens the reference check queue, then all draft statements are listed with evidence links accessible and reference status visible per statement |
| JTBD-05.2 | Failed statement routes to Analyst queue automatically | Given a statement marked Failed with a discrepancy note, when the Independent Referencer saves the failed status, then the statement appears in the Analyst's queue automatically with the discrepancy note attached |
| JTBD-06.1 | P4 approved with status set automatically | Given an engagement where all P4 prerequisites are met, when the Publishing Coordinator approves with comments, then the engagement status is set to Ready for Issuance and an audit event records actor, timestamp, and comment |
| JTBD-06.2 | P4 blocked while any reference check is Failed or In Review | Given an engagement with one or more statements in Failed or In Review status, when the Publishing Coordinator attempts P4 approval, then the system blocks approval and identifies the unresolved statements |
| JTBD-07.1 | Portfolio dashboard reachable in under 30 sec | Given a logged-in Read-Only Stakeholder, when they navigate to the portfolio dashboard, then all engagements are listed with phase, owner, risk, next milestone, and gate status visible without any drilldown or additional navigation |
| JTBD-07.2 | Engagement detail answers questions without training | Given a specific engagement, when the Read-Only Stakeholder searches by title and opens the detail page, then current gate status, milestone dates, open blockers, and gate decision history are all visible on one page |

---

*Document generated: 2026-06-04*
*Derived from: PERSONAS-EMS.md, PRD-EMS.md, .planning/PROJECT.md*
*Downstream consumers: User Journey Maps, Story Map, NaC Generator, Acceptance Test Generator*
