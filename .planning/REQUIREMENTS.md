# Requirements: Lightweight Engagement Management System (EMS)

**Source:** PRD-EMS.md v1.0, FRD-EMS.md v1.0  
**Version:** 1.0  

---

## Platform Infrastructure

### F0 — Basic Application Shell (P0)
- Login and logout with username/password
- Account lockout after 5 failed attempts
- User role assignment (Admin only)
- Main navigation: Dashboard, Requests, Engagements, Evidence, Review Queue, Reports
- Role-filtered navigation (sections visible only to authorized roles)
- Direct URL access to unauthorized section returns 403
- Basic search by engagement ID, title, requester, phase, and owner (scoped to access)
- Audit trail view per engagement (filterable by action type and date range)

### F1 — Core Data Objects (P0)
20 database tables covering:
- Request, Engagement, Team Assignment, Milestones
- Planning Record, Objective, Planning Revision
- Evidence Item, Evidence File, Objective-Evidence Link
- Finding, Finding-Evidence Link
- Draft Product, Draft Statement, Statement-Evidence Link, Draft Comment
- Gate Decision, Audit Event
- Users, User Roles, Sessions, Login Attempts

---

## Intake and Acceptance

### F2 — Request Intake (P0)
- Capture: request type (congressional_request / mandate / internal_proposal), requester, topic, agency/program, due date, notes
- Upload one intake document (PDF/DOCX/etc., ≤25 MB); uploading again replaces previous file
- Save as Draft without all fields
- Submit validates all required fields; blocks on missing data
- Status: draft → submitted → accepted / declined

### F3 — Acceptance Decision — Gate A1 (P0)
- Review submitted request details
- Record risk level: low / medium / high
- Approve with rationale → auto-creates Engagement shell in `phase=planning` with job code `ENG-{YYYY}-{5-digit-seq}`
- Decline with rationale → request status = declined; no engagement created
- All A1 decisions create an immutable GateDecision record and AuditEvent
- A1 decision visible on request detail page and audit trail

---

## Engagement Setup and Planning

### F4 — Engagement Shell (P0)
- Display: job code, title, phase, status, risk level, owner, portfolio
- Display: gate status cards for A1, P2, P3, P4
- Display: open blockers
- Display: links to team, milestones, planning, evidence, findings, draft
- Edit basic metadata by authorized roles (EM, AD)

### F5 — Team and Milestones (P0)
- Assign users to predefined roles: AL, EM, AN, QA, IR, PC, RO
- Remove team members (EM or AD)
- Set milestone dates: planning approval, evidence readiness, draft readiness, final readiness
- Milestone status computed from target date vs today: Not Started / On Track / At Risk / Complete / Overdue
- No duplicate (user, role) pairs per engagement

### F6 — Lightweight Planning Record (P0)
- Add one or more objectives (text + information need)
- Capture: design approach, schedule notes, risk notes, data reliability notes
- Capture: independence affirmation status (affirmed / pending / exception_noted)
- Save as Draft or submit as Ready for Review
- Post-P2-approval edits require revision note; record reverts to draft until re-approved

### F7 — Planning Approval — Gate P2 (P0)
- QA Reviewer reviews planning completeness
- Approve planning baseline → locks planning record
- Return planning record for revision with comments
- P2 prerequisites (ALL must be met):
  1. At least one objective exists
  2. Engagement has an owner
  3. At least one EM on team
  4. At least one QA on team
  5. At least one milestone date set
  6. risk_notes is non-empty
  7. data_reliability_notes is non-empty
  8. independence_status is set
- GateDecision and AuditEvent written on approve or return

---

## Evidence and Findings

### F8 — Evidence Registry (P0)
- Add evidence item: type (document / dataset / interview_note / meeting_note / other), source, date received, custodian, description, sensitivity (standard / restricted)
- Upload one or more files per evidence item (≤25 MB each)
- Restricted evidence visible only to privileged roles (AN, EM, QA, IR, PC, AD); AL and RO excluded
- View evidence list by engagement

### F9 — Evidence-to-Objective Link (P0)
- Link one evidence item to one or more objectives
- Display linked evidence under each objective
- Show objectives with no linked evidence (gap view)
- Export evidence registry to CSV

### F10 — Findings and Sufficiency — Gate P3 (P0)
- Create finding records (finding text, status: draft / under_review / accepted / rejected)
- Link findings to one or more evidence items
- QA Reviewer marks each objective: evidence_needed / in_review / sufficient
- P3 prerequisites (ALL must be met):
  1. P2 has passed
  2. Every objective has at least one linked evidence item
  3. No objective is marked evidence_needed
- QA Reviewer approves P3 → engagement.phase advances to `draft`
- GateDecision and AuditEvent written on approval
- P3 is idempotent (second approval attempt returns 409)

---

## Draft Product and Final Readiness

### F11 — Draft Product Record (P0)
- Create draft product: title, version, owner, status
- Status progression: drafting → under_review → ready_for_reference_check → ready_for_final_review
- Attach draft file (upload/replace) or draft notes
- Append-only review comments (immutable once posted)

### F12 — Basic Indexing and Reference Check (P0)
- Add draft statement records (statement text, sort order)
- Link each statement to one or more evidence items
- IR marks reference status: not_started / in_review / passed / failed / waived
- Capture discrepancy notes when status = failed
- Assign discrepancy back to Analyst (assigned_to_analyst field)
- EM or AD can waive a statement (requires discrepancy_notes as justification)

### F13 — Final Readiness — Gate P4 (P0)
- Show final readiness prerequisites checklist
- P4 prerequisites (ALL must be met):
  1. P3 has passed
  2. No reference check is in_review or failed (all must be passed or waived)
  3. No open blockers
- PC records P4 approval → engagement.status = ready_for_issuance OR closed with audit event
- GateDecision and AuditEvent written on approval

---

## Dashboards and Reporting

### F14 — Portfolio Dashboard (P1)
- Count cards by phase and status
- Filter by: owner, risk level, due date, phase, status
- Sortable list: engagement ID, title, phase, owner, risk, next milestone, gate status
- Export engagement list to CSV (roles: AD, EM, AN, QA, AL, PC, RO — excluding IR)

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Page loads ≤ 3s; API responses ≤ 500ms |
| Availability | 99% during business hours |
| Scale | ≥100 engagements, ≥500 evidence items, ≥50 users |
| Auth | bcrypt cost ≥12; account lockout after 5 failed attempts; lockout duration 15 min |
| Session | 8-hour expiry; revocable via DB hash deletion |
| File upload | Max 25 MB per file; multipart/form-data |
| Pagination | Default 25 rows, max 100 per page |
| CSV export | Content-Disposition: attachment; text/csv |
| Audit | All gate decisions, evidence uploads, evidence links, reference status changes, exports |
| Accessibility | Form labels, keyboard navigation, readable contrast |
| Data integrity | Gate decisions, audit events, draft comments are immutable at application layer |
| Soft deletes | objectives, evidence_items, evidence_files, findings use deleted_at |

---

## Gate Prerequisite Summary

| Gate | Key Prerequisites |
|------|-----------------|
| A1 | Request is submitted; all required fields present |
| P2 | ≥1 objective; owner set; EM on team; QA on team; ≥1 milestone; risk_notes; data_reliability_notes; independence_status |
| P3 | P2 passed; all objectives have ≥1 evidence link; no objective marked evidence_needed |
| P4 | P3 passed; no reference check in_review or failed; no open blockers |
