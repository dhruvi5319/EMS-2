# Project: Lightweight Engagement Management System (EMS)

**Acronym:** EMS  
**Version:** 1.0  
**Milestone:** v1.0  
**Status:** planning  
**Created:** 2026-06-04  

---

## Core Value

A simple engagement workflow with persistent records, clear status, role-based actions, and basic traceability from request to evidence-supported final readiness.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | React | 18.x |
| Frontend build tool | Vite | 5.x |
| Frontend router | React Router | 6.x |
| Frontend state | TanStack Query | 5.x |
| Frontend styling | Tailwind CSS | 3.x |
| Frontend components | shadcn/ui (Radix UI) | Latest |
| Frontend language | TypeScript | 5.x |
| Backend runtime | Node.js | 20 LTS |
| Backend framework | Express.js | 4.x |
| Backend language | TypeScript | 5.x |
| Query builder / ORM | Knex.js | 3.x |
| Database | PostgreSQL | 15+ |
| File storage (dev) | Local filesystem | — |
| File storage (prod) | S3-compatible | — |
| Auth | bcryptjs + session tokens | — |
| Validation | Zod | 3.x |
| Testing (backend) | Jest + Supertest | Latest |
| Testing (frontend) | Vitest + Testing Library | Latest |
| E2E testing | Playwright | Latest |
| Containers | Docker + docker-compose | Latest |
| Reverse proxy | nginx | 1.25+ |

---

## Architecture

**Pattern:** Layered monolith — React SPA frontend + Node.js REST API backend + PostgreSQL  
**Deployment:** Single-tenant containerized (docker-compose for dev, 4 services: app, frontend, db, storage)  
**Auth:** JWT/session-cookie hybrid; session hash stored in `sessions` table for revocability  
**RBAC:** Enforced server-side at middleware layer; same rules mirrored client-side in navigation  
**File storage:** Abstracted via `IStorageProvider`; `local` for dev, `s3_compatible` for prod  
**Audit:** Append-only `audit_events` table; written by all mutating services  
**Gate decisions:** Immutable `gate_decisions` rows; most recent row = current gate status  

---

## Roles

| Code | Role Name | Key Capabilities |
|------|-----------|-----------------|
| AL | Engagement Acceptance Lead | Create/submit requests, Gate A1 decisions |
| EM | Engagement Manager | Manage engagement shell, team, milestones, planning |
| AN | Analyst | Upload evidence, link evidence, create findings, draft statements |
| QA | QA Reviewer | Review planning (P2), evidence sufficiency (P3) |
| IR | Independent Referencer | Mark reference check status (P4 path) |
| PC | Publishing Coordinator | Gate P4 final readiness approval |
| RO | Read-Only Stakeholder | View-only access within access scope |
| AD | Admin | User + role management, system configuration |

---

## Database — 20 Tables

**Auth (4):** `users`, `user_roles`, `sessions`, `login_attempts`  
**Requests (1):** `requests`  
**Engagements (1):** `engagements`  
**Team (2):** `team_assignments`, `milestones`  
**Planning (3):** `planning_records`, `objectives`, `planning_revisions`  
**Evidence (3):** `evidence_items`, `evidence_files`, `objective_evidence_links`  
**Findings (2):** `findings`, `finding_evidence_links`  
**Draft (4):** `draft_products`, `draft_statements`, `statement_evidence_links`, `draft_comments`  
**Gates (1):** `gate_decisions`  
**Audit (1):** `audit_events`  

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Layered monolith over microservices | Single-tenant, narrow scope; avoids distributed systems complexity |
| PostgreSQL as sole datastore | JSONB for audit snapshots; gen_random_uuid(); ACID guarantees |
| REST over GraphQL | Simple CRUD + workflow endpoints; easier to test |
| JWT/session-cookie hybrid | Per-session revocability via DB-stored hash |
| Server-side RBAC enforcement | Prevents privilege escalation via direct API calls |
| Soft deletes for mutable entities | Preserves audit integrity; objectives/evidence/findings use deleted_at |
| Append-only audit events | Tamper-evident record of all workflow actions |
| File storage abstraction | Same codebase runs locally (filesystem) and in production (S3) |
| bcryptjs over bcrypt | Pure JS; avoids Alpine Linux native module compilation in Docker |
| shadcn/ui (Radix UI) for components | Accessible UI primitives; new-york template style |
| Knex.js over Prisma/TypeORM | Direct SQL control; supports raw SQL for complex aggregates |

---

## Feature Index

| ID | Feature | Phase |
|----|---------|-------|
| F0 | Basic Application Shell | 1–2 |
| F1 | Core Data Objects | 1 |
| F2 | Request Intake | 3 |
| F3 | Acceptance Decision — Gate A1 | 3 |
| F4 | Engagement Shell | 4 |
| F5 | Team and Milestones | 4 |
| F6 | Lightweight Planning Record | 4 |
| F7 | Planning Approval — Gate P2 | 4 |
| F8 | Evidence Registry | 5 |
| F9 | Evidence-to-Objective Link | 5 |
| F10 | Findings and Sufficiency — Gate P3 | 5 |
| F11 | Draft Product Record | 6 |
| F12 | Basic Indexing and Reference Check | 6 |
| F13 | Final Readiness — Gate P4 | 6 |
| F14 | Portfolio Dashboard | 6 |

---

## Spec Documents

- `project_specs/PRD-EMS.md` — Product Requirements Document
- `project_specs/FRD-EMS.md` — Functional Requirements Document
- `project_specs/TechArch-EMS.md` — Technical Architecture Document
- `project_specs/UX-Mockup-EMS.md` — UX Mockups
- `project_specs/PERSONAS-EMS.md` — Personas
- `project_specs/JOURNEYS-EMS.md` — User Journeys
- `project_specs/UserStories-EMS.md` — User Stories
- `project_specs/RTM-EMS.md` — Requirements Traceability Matrix
