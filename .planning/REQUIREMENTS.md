# Requirements: Lightweight Engagement Management System (EMS)

**Defined:** 2026-06-05
**Core Value:** A simple engagement workflow with persistent records, clear status, role-based actions, and basic traceability from request to evidence-supported final readiness.

## v1 Requirements

Requirements for initial release. Each maps to a roadmap phase.

### Platform Infrastructure

- [ ] **F0**: User can log in and log out; the application provides main navigation (Dashboard, Requests, Engagements, Evidence, Review Queue, Reports), basic search by engagement ID/title/requester/phase/owner, role assignment, and an audit trail view per engagement
- [ ] **F1**: The system maintains all ten core data objects — Request, Engagement, Team Assignment, Planning Record, Objective, Evidence Item, Finding, Draft Product, Gate Decision, and Audit Event — with their required fields as defined in the PRD data model

### Intake and Acceptance

- [ ] **F2**: Engagement Acceptance Lead can create and edit a request record capturing request type (congressional/mandate/internal), requester, topic, agency/program, due date, and notes; can upload one intake document; can save as Draft or Submitted; system validates required fields before submission
- [ ] **F3**: Authorized user can review a submitted request, record risk level (Low/Medium/High), approve with rationale (automatically creating an engagement shell), or decline with rationale; system writes an audit event for all A1 decisions and blocks A1 if required fields are missing

### Engagement Setup and Planning

- [ ] **F4**: Engagement Manager can view and edit an engagement shell showing job code, title, phase, status, owner, risk level, portfolio, milestones, current gate status (A1/P2/P3/P4), open blockers, and links to artifacts/evidence/findings/draft product
- [ ] **F5**: Engagement Manager can assign users to predefined roles and set milestone dates for planning approval, evidence readiness, draft readiness, and final readiness; user can view milestone status (Not Started, On Track, At Risk, Complete)
- [ ] **F6**: Engagement Manager/Analyst can create and edit a planning record capturing one or more objectives, design approach, risk notes, data reliability notes, and independence affirmation status for assigned team members; record can be saved as Draft or Ready for Review
- [ ] **F7**: QA Reviewer can review planning record completeness and either approve the planning baseline (locking it from normal edits) or return it for revision; system writes an audit event; P2 is blocked until at least one objective exists and owner, team, milestones, risk notes, data reliability notes, and independence status are all present

### Evidence and Findings

- [ ] **F8**: Analyst can add evidence records capturing type (document/dataset/interview note/meeting note/other), source, date received, custodian/provider, description, and sensitivity flag (Standard/Restricted); can upload one or more files per evidence item; can view evidence list by engagement
- [ ] **F9**: User can link one evidence item to one or more objectives; the system displays linked evidence under each objective and highlights objectives with no linked evidence; evidence registry can be exported to CSV
- [ ] **F10**: Analyst can create finding records and link each finding to one or more evidence items; QA Reviewer can mark each objective as Evidence Needed, In Review, or Sufficient; QA Reviewer can record P3 approval; P3 is blocked if any objective has no linked evidence or is marked Evidence Needed

### Draft Product and Final Readiness

- [ ] **F11**: Analyst/Engagement Manager can create a draft product record capturing title, version, owner, and status (Drafting/Under Review/Ready for Reference Check/Ready for Final Review); can attach a draft file or notes; can record review comments
- [ ] **F12**: Analyst can add draft statement records and link each statement to one or more evidence items; Independent Referencer can mark reference status (Not Started/In Review/Passed/Failed); can capture discrepancy notes when Failed and assign discrepancy back to Analyst for correction
- [ ] **F13**: Publishing Coordinator can view final readiness checklist and record P4 approval when all reference checks are Passed or explicitly waived and no open blockers remain; approval sets engagement status to Ready for Issuance or Closed and writes an audit event; P4 is blocked until P3 has passed

### Dashboards and Reporting

- [ ] **F14**: User can view a portfolio dashboard showing counts by phase and status, filters by owner/risk level/due date/phase/status, a list view with engagement ID/title/phase/owner/risk/next milestone/gate status, and can export the engagement list to CSV

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Dashboards (Deferred)

- **F15**: Engagement detail dashboard — phase/status summary, gate status cards (A1/P2/P3/P4), milestone list, evidence count and objectives without evidence, reference check completion percentage, open blockers list

### User-Centered Design (Deferred)

- **F16**: Persona and journey artifacts — link each feature to at least one persona and journey; use journeys to create acceptance tests for A1, P2, P3, and P4
- **F17**: Basic acceptance test generation — tests for request submission/A1, engagement setup/P2, evidence upload/P3, reference check/P4, dashboard visibility, and CSV export

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full enterprise records management | Narrow workflow slice only; enterprise records complexity out of scope |
| Full public website publishing workflow | Not part of engagement management scope |
| Advanced agency comment deadline automation | Too complex for v1; defer to future |
| Complex reminder/escalation/policy-engine behavior | Scope discipline — basic workflow first |
| Full sentence-by-sentence report production workflow | Out of scope per PRD |
| Full legal/methodology review case management | Out of scope per PRD |
| Full recommendation tracking after issuance | Out of scope per PRD |
| Full classified product workflow | Out of scope per PRD |
| Full records request workflow | Out of scope per PRD |
| Full cost accounting or labor integration | Out of scope per PRD |
| Advanced analytics or forecasting | Out of scope per PRD |
| External system synchronization beyond CSV export | Out of scope per PRD |
| Automated duplicate detection | Out of scope per PRD |
| Advanced document generation beyond basic templates | Out of scope per PRD |
| Real-time notifications/push alerts | Not in PRD scope; gate status visible in dashboard |
| Mobile app | Web-first; not in PRD scope |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| F0 | — | Pending |
| F1 | — | Pending |
| F2 | — | Pending |
| F3 | — | Pending |
| F4 | — | Pending |
| F5 | — | Pending |
| F6 | — | Pending |
| F7 | — | Pending |
| F8 | — | Pending |
| F9 | — | Pending |
| F10 | — | Pending |
| F11 | — | Pending |
| F12 | — | Pending |
| F13 | — | Pending |
| F14 | — | Pending |

**Coverage:**
- v1 requirements: 15 total (F0–F14)
- Mapped to phases: 0
- Unmapped: 15 ⚠️

---
*Requirements defined: 2026-06-05*
*Last updated: 2026-06-05 after initial definition*
