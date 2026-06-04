# Lightweight Engagement Management System (EMS)

## What This Is

A web-based application for managing a basic engagement lifecycle from request intake through final readiness. It provides a simple, governed workflow for capturing engagement requests, approving accepted engagements, setting up planning artifacts, collecting evidence, linking evidence to objectives, and preparing a draft product for final readiness review. The system is designed for teams that currently rely on disconnected documents, folders, emails, and spreadsheets to coordinate engagement work.

## Core Value

A simple engagement workflow with persistent records, clear status, role-based actions, and basic traceability from request to evidence-supported final readiness.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Platform Infrastructure
- [ ] **F0**: Basic application shell — authenticated web app with navigation, search, role assignment, and audit trail view
- [ ] **F1**: Core data objects — Request, Engagement, Team Assignment, Planning Record, Objective, Evidence Item, Finding, Draft Product, Gate Decision, Audit Event

#### Intake and Acceptance
- [ ] **F2**: Request intake — create/edit request records with type, requester, topic, agency, due date, intake document upload; Draft or Submitted status
- [ ] **F3**: Acceptance decision (Gate A1) — approve or decline submitted requests, create engagement shell on approval, write audit events

#### Engagement Setup and Planning
- [ ] **F4**: Engagement shell — central page for engagement metadata, gate status (A1/P2/P3/P4), blockers, linked artifacts
- [ ] **F5**: Team and milestones — assign roles, set milestone dates, view milestone status
- [ ] **F6**: Lightweight planning record — objectives, design approach, risk notes, data reliability notes, independence affirmations; Draft or Ready for Review
- [ ] **F7**: Planning approval (Gate P2) — QA Reviewer approves/returns planning baseline; locks approved planning record

#### Evidence and Findings
- [ ] **F8**: Evidence registry — upload evidence items with type, source, date, sensitivity flag; view by engagement
- [ ] **F9**: Evidence-to-objective link — link evidence to objectives, show linked evidence per objective, flag gaps; CSV export
- [ ] **F10**: Findings and sufficiency (Gate P3) — create findings, link to evidence, mark objective sufficiency, QA Reviewer P3 approval

#### Draft Product and Final Readiness
- [ ] **F11**: Draft product record — create/track draft with title, version, owner, status, attachments, review comments
- [ ] **F12**: Basic indexing and reference check — link draft statements to evidence, mark reference status (Not Started/In Review/Passed/Failed), assign discrepancies
- [ ] **F13**: Final readiness (Gate P4) — final readiness checklist, require all reference checks Passed or waived, record final approver; set engagement to Ready for Issuance or Closed

#### Dashboards and Reporting
- [ ] **F14**: Portfolio dashboard — counts by phase/status, filters, list view, CSV export of engagement register
- [ ] **F15**: Engagement detail dashboard — phase/status summary, gate status cards, milestone list, evidence/reference progress, open blockers

#### User-Centered Design
- [ ] **F16**: Persona and journey artifacts — define target personas and primary journeys, link features to personas and journeys
- [ ] **F17**: Basic acceptance test generation — acceptance tests for A1, P2, P3, P4, dashboard, and CSV export

### Out of Scope

- Full enterprise records management — out of scope for v1; narrow workflow slice only
- Full public website publishing workflow — not part of this engagement management scope
- Advanced agency comment deadline automation — defer to future
- Complex reminder/escalation/policy-engine behavior — too complex for v1
- Full sentence-by-sentence report production workflow — out of scope
- Full legal/methodology review case management — out of scope
- Full recommendation tracking after issuance — out of scope
- Full classified product workflow — out of scope
- Full records request workflow — out of scope
- Full cost accounting or labor integration — out of scope
- Advanced analytics or forecasting — out of scope
- External system synchronization beyond simple CSV export — out of scope
- Automated duplicate detection — out of scope
- Advanced document generation beyond basic templates — out of scope

## Context

- **Domain**: Engagement management for organizations that conduct structured engagements (e.g., audits, reviews, investigations) in response to congressional requests, mandates, or internal decisions.
- **Problem**: Teams use disconnected documents, folders, emails, and spreadsheets — creating unclear ownership, inconsistent status, limited traceability, and manual effort before reviews.
- **Users**: 7 roles — Engagement Acceptance Lead, Engagement Manager, Analyst, QA Reviewer, Independent Referencer, Publishing Coordinator, Read-Only Stakeholder (+ Admin).
- **Primary journeys**: Intake & acceptance → Planning setup → Evidence readiness → Draft readiness → Final readiness.
- **Gate model**: A1 (acceptance) → P2 (planning approval) → P3 (evidence sufficiency) → P4 (final readiness). Each gate records approver, timestamp, rationale.
- **Scope discipline**: This is a narrow but complete end-to-end slice. Advanced features are explicitly deferred.

## Constraints

- **Tech Stack**: React frontend, REST API backend, relational database, local/managed file storage, username/password or org identity provider, RBAC — per PRD Section 4.1. Equivalent technologies acceptable.
- **Deployment**: Single-tenant containerized web application; local dev environment required.
- **Performance**: Page loads ≤3s; API operations ≤500ms; 99% availability during business hours.
- **Scale**: Support ≥100 engagements, ≥500 evidence items, ≥50 users.
- **Security**: HTTPS, encryption at rest, role isolation, engagement isolation, restricted file access control, audit logging.
- **Scope**: One end-to-end path from request to final readiness only — no advanced workflows until the basic path is stable.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Narrow engagement slice first | Deliver a working end-to-end product quickly; validate before expanding | — Pending |
| Gate model: A1 → P2 → P3 → P4 | Clear, auditable governance checkpoints with role-specific approval authority | — Pending |
| Role-based access control (7 roles) | Minimal role separation prevents unauthorized actions without excessive complexity | — Pending |
| CSV export over full reporting | Simple export satisfies reporting needs without advanced analytics complexity | — Pending |
| No automation beyond basic workflow | Keeps implementation scope controlled; automation deferred until baseline is stable | — Pending |

---
*Last updated: 2026-06-04 after initialization*
