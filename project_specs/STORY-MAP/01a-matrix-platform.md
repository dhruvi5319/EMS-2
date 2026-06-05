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
