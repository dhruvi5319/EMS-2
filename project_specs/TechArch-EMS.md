# Technical Architecture Document
## Lightweight Engagement Management System (EMS)

**Project Acronym:** EMS  
**Version:** 1.0  
**Date:** 2026-06-04  
**Status:** Active  
**Source Documents:** PRD-EMS.md v1.0, FRD-EMS.md v1.0  

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

The EMS uses a **layered monolith** architecture with a clear separation between a React single-page application (SPA) frontend and a REST API backend. This pattern was selected because:

- The scope is a single-tenant, single-organization system with a narrow, well-defined feature set.
- A monolith avoids the operational overhead of microservices for a team-sized initial deployment.
- The layered structure (UI → API → Service → Repository → Database) provides clean separation of concerns and supports future decomposition if scale demands it.
- All state lives in a single PostgreSQL database, making backup, restore, and migration straightforward.

The backend follows a **service-layer pattern**:

```
Controller  →  Service  →  Repository  →  PostgreSQL
    ↑               ↑
  Auth             Audit
Middleware         Event
                  Emitter
```

RBAC enforcement happens in the Controller/Middleware layer. Business logic (gate prerequisite validation, blocker computation, status transitions) lives in the Service layer. Data access is isolated to Repository classes.

---

### 1.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EMS — System Boundary                       │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React SPA (Frontend)                       │  │
│  │                                                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │  Dashboard   │  │  Engagement  │  │  Evidence /      │   │  │
│  │  │  Portfolio   │  │  Shell       │  │  Findings /      │   │  │
│  │  │  Detail      │  │  Planning    │  │  Draft / Ref.    │   │  │
│  │  │  (F14, F15)  │  │  (F04–F07)   │  │  Check (F08–F12) │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Review Queue │ Requests │ Auth/Login │ User Mgmt    │    │  │
│  │  │  (F00, F03, F07, F10, F13)                           │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────┬────────────────────────────────────┘  │
│                             │  HTTPS (TLS at reverse proxy)         │
│  ┌──────────────────────────▼────────────────────────────────────┐  │
│  │                   REST API Backend (Node.js)                  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Auth Middleware  │  RBAC Guard  │  Request Logger   │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐  │  │
│  │  │  Auth /     │ │  Engagement  │ │  Evidence /           │  │  │
│  │  │  Users      │ │  Requests /  │ │  Findings /           │  │  │
│  │  │  Controller │ │  Gates       │ │  Draft / Statements   │  │  │
│  │  └─────────────┘ └──────────────┘ └──────────────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │       Service Layer (Gate logic, Blocker compute,    │    │  │
│  │  │        Audit event emission, Status transitions)     │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                               │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │               Repository Layer (SQL / ORM)           │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────┬────────────────────────────────────┘  │
│                             │                                        │
│          ┌──────────────────┼───────────────────────┐               │
│          │                  │                       │               │
│  ┌───────▼──────┐  ┌────────▼────────┐  ┌──────────▼──────┐       │
│  │  PostgreSQL  │  │  File Storage   │  │  (Future:        │       │
│  │  Database    │  │  (Local / S3)   │  │   OIDC Provider) │       │
│  └──────────────┘  └─────────────────┘  └─────────────────┘       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Deployment Topology

The EMS is deployed as a **single-tenant containerized application**. One instance serves one organization.

```
┌─────────────────────────────────────────────────────┐
│                  Production Deployment               │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │            Reverse Proxy / TLS              │   │
│  │        (nginx or cloud load balancer)       │   │
│  │   • TLS termination (HTTPS enforced)        │   │
│  │   • Routes /api/* → backend container       │   │
│  │   • Routes /*    → frontend static assets   │   │
│  └────────────────────┬────────────────────────┘   │
│                       │                             │
│          ┌────────────┼─────────────┐               │
│          │            │             │               │
│  ┌───────▼──────┐  ┌──▼──────────┐  │               │
│  │  Frontend    │  │  Backend    │  │               │
│  │  Container   │  │  Container  │  │               │
│  │  (React SPA  │  │  (Node.js   │  │               │
│  │  static      │  │  REST API)  │  │               │
│  │  files via   │  │  Port 3000  │  │               │
│  │  nginx)      │  └──────┬──────┘  │               │
│  └──────────────┘         │         │               │
│                      ┌────┴────┐    │               │
│                      │   DB    │    │               │
│                      │  (PG)   │    │               │
│                      └─────────┘    │               │
│                                     │               │
│  ┌──────────────────────────────────▼─────────┐    │
│  │         File Storage Volume / Bucket       │    │
│  │     (./data/files  or  S3-compatible)      │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Local Development                      │
│                                                     │
│  docker-compose up                                   │
│   ├── app      (Node.js API, port 3000)              │
│   ├── frontend (React dev server, port 5173)         │
│   ├── db       (PostgreSQL, port 5432)               │
│   └── storage  (local volume at ./data/files)        │
└─────────────────────────────────────────────────────┘
```

**Deployment characteristics:**
- Single-tenant: one organization, one database, one instance.
- Containerized: all services run in Docker containers managed by docker-compose (dev) or Kubernetes/equivalent (production).
- Stateless API containers: session state is stored in the database (`sessions` table); containers can be restarted without data loss.
- Database and file storage are the only stateful services; both require backup and restore procedures.

---

### 1.4 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Layered monolith over microservices** | Single-tenant, narrow feature scope; avoids distributed systems complexity for an initial deployment. Decomposable later if needed. |
| **PostgreSQL as the sole datastore** | All entities are relational (gates reference engagements, evidence links objectives, etc.). JSONB support needed for audit snapshots. PostgreSQL 15+ provides `gen_random_uuid()` natively. |
| **REST over GraphQL** | Simple CRUD + workflow endpoints; REST is well-understood, easier to test with curl/Postman, and aligns with the FRD API catalog. |
| **JWT / session-cookie hybrid** | Session records stored in `sessions` table for revocability (lockout, logout). Token is a signed JWT used as the lookup key; hash stored in DB. |
| **Server-side RBAC enforcement** | All authorization checks happen in the API layer (not just in the UI). This prevents privilege escalation via direct API calls. |
| **Soft deletes for mutable entities** | Evidence items, objectives, findings use `deleted_at` rather than physical deletion, preserving audit integrity. Gate decisions and audit events are immutable (no DELETE permitted at application layer). |
| **File storage abstraction** | File storage is accessed through a storage abstraction layer configured by `STORAGE_BACKEND` env var (`local` or `s3_compatible`). This allows the same codebase to run locally (filesystem) and in production (S3). |
| **Append-only audit events** | Audit events are written at the application layer and never updated or deleted, providing a tamper-evident record of all workflow actions. |

---

### 1.5 Performance Targets

| Target | Requirement |
|--------|-------------|
| Page loads | ≤ 3 seconds for typical engagement lists and forms |
| API response time | ≤ 500ms for standard create/read/update operations under normal load |
| Dashboard load | ≤ 3 seconds for ≤100 engagements / ≤500 evidence items / ≤100 statements |
| Availability | 99% during normal business hours |
| Scale | ≥100 engagements, ≥500 evidence items, ≥50 users |

Performance is achieved through:
- Indexed foreign keys and query-critical columns (see DDL in Section 3).
- Paginated list endpoints (default 25 rows).
- Dashboard aggregate queries computed server-side (not client-side iteration).
- Connection pooling on the database connection.

---

## 2. Component Architecture

### 2.1 Backend Components

The backend is a Node.js REST API service organized into the following layers and modules:

```
src/
├── app.ts                    # Express app setup, middleware registration
├── server.ts                 # HTTP server entry point
├── config/
│   └── env.ts               # Environment variable validation and export
├── middleware/
│   ├── auth.ts              # Session token validation, user context injection
│   ├── rbac.ts              # Role-based access control guard factory
│   └── logger.ts            # Request logging
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.repository.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.repository.ts
│   ├── requests/
│   │   ├── requests.controller.ts
│   │   ├── requests.service.ts
│   │   └── requests.repository.ts
│   ├── engagements/
│   │   ├── engagements.controller.ts
│   │   ├── engagements.service.ts
│   │   └── engagements.repository.ts
│   ├── team/
│   │   ├── team.controller.ts
│   │   ├── team.service.ts
│   │   └── team.repository.ts
│   ├── planning/
│   │   ├── planning.controller.ts
│   │   ├── planning.service.ts
│   │   └── planning.repository.ts
│   ├── gates/
│   │   ├── gates.controller.ts
│   │   ├── gates.service.ts       # Gate prerequisite validation, engagement phase transitions
│   │   └── gates.repository.ts
│   ├── evidence/
│   │   ├── evidence.controller.ts
│   │   ├── evidence.service.ts
│   │   └── evidence.repository.ts
│   ├── findings/
│   │   ├── findings.controller.ts
│   │   ├── findings.service.ts
│   │   └── findings.repository.ts
│   ├── draft/
│   │   ├── draft.controller.ts
│   │   ├── draft.service.ts
│   │   └── draft.repository.ts
│   ├── statements/
│   │   ├── statements.controller.ts
│   │   ├── statements.service.ts
│   │   └── statements.repository.ts
│   ├── dashboard/
│   │   ├── dashboard.controller.ts
│   │   └── dashboard.service.ts  # Aggregate query composition
│   └── audit/
│       ├── audit.controller.ts
│       ├── audit.service.ts       # Audit event writer (called by all services)
│       └── audit.repository.ts
├── storage/
│   ├── storage.interface.ts      # IStorageProvider contract
│   ├── local.storage.ts          # Filesystem implementation
│   └── s3.storage.ts             # S3-compatible implementation
├── db/
│   ├── connection.ts             # PostgreSQL connection pool
│   └── migrations/               # SQL migration files
└── shared/
    ├── errors.ts                 # AppError class, error code enum
    ├── validation.ts             # Shared validators (email, date, enum)
    └── types.ts                  # Shared TypeScript types
```

#### 2.1.1 Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| **auth** | Login/logout, session creation/revocation, login attempt tracking, account lockout |
| **users** | User CRUD, role assignment (Admin only), current user profile |
| **requests** | Request lifecycle: create draft, edit, submit, upload intake document |
| **engagements** | Engagement metadata CRUD, engagement list/filter, blocker computation, CSV export |
| **team** | Team assignment add/remove, milestone date management |
| **planning** | Planning record CRUD, objective management, submit for P2, post-P2 revision |
| **gates** | Gate prerequisite validation, gate decision creation, engagement phase/status transitions for A1/P2/P3/P4 |
| **evidence** | Evidence item CRUD, file upload/download, objective-evidence link management, gap view, CSV export |
| **findings** | Finding CRUD, finding-evidence link management |
| **draft** | Draft product CRUD, file attachment, status transitions, review comments |
| **statements** | Draft statement CRUD, statement-evidence links, reference status updates, waiver |
| **dashboard** | Portfolio summary aggregates, engagement detail metrics |
| **audit** | Append-only audit event writer, audit log query/export |
| **storage** | File I/O abstraction over local filesystem or S3-compatible bucket |

#### 2.1.2 Cross-Cutting Services

| Service | Pattern | Notes |
|---------|---------|-------|
| **AuditService** | Called by all mutating services | Writes immutable `audit_events` row; never throws (failure is logged but does not roll back the primary operation) |
| **GatePrerequisiteValidator** | Used by GatesService | Encapsulates all gate prerequisite rules (A1, P2, P3, P4) in testable functions |
| **BlockerComputer** | Used by EngagementsService and DashboardService | Returns the current list of blockers for an engagement |
| **StorageProvider** | Injected via DI into modules that handle files | Abstracts `put`, `get`, `delete` operations |

---

### 2.2 Frontend Components

The React SPA is organized into feature modules that mirror the FRD feature set:

```
src/
├── main.tsx                  # App entry point
├── App.tsx                   # Router root, auth context provider
├── api/
│   ├── client.ts            # Axios/fetch wrapper with auth token injection and error handling
│   └── endpoints/           # Per-module API call functions (typed with interfaces from Section 4)
├── auth/
│   ├── LoginPage.tsx
│   ├── AuthContext.tsx       # Current user, roles, token refresh
│   └── ProtectedRoute.tsx    # Redirects unauthenticated users
├── layout/
│   ├── AppShell.tsx          # Navigation sidebar, top bar, breadcrumbs
│   └── NavigationRail.tsx    # Role-filtered nav links
├── pages/
│   ├── DashboardPage.tsx     # Portfolio dashboard (F14)
│   ├── RequestsPage.tsx      # Request list (F02)
│   ├── RequestDetailPage.tsx # Request form + A1 controls (F02, F03)
│   ├── EngagementsPage.tsx   # Engagement list
│   ├── EngagementShellPage.tsx # Engagement hub (F04)
│   ├── TeamPage.tsx          # Team + milestones (F05)
│   ├── PlanningPage.tsx      # Planning record (F06, F07)
│   ├── EvidencePage.tsx      # Evidence list + gap view (F08, F09)
│   ├── FindingsPage.tsx      # Findings list (F10)
│   ├── DraftPage.tsx         # Draft product + statements (F11, F12)
│   ├── GatePage.tsx          # Gate readiness checklist (F13)
│   ├── EngagementDashboard.tsx # Engagement detail dashboard (F15)
│   ├── ReviewQueuePage.tsx   # Pending gate actions for current user
│   ├── AuditTrailPage.tsx    # Audit events (F00.5)
│   └── AdminPage.tsx         # User and role management (F00.2)
├── components/
│   ├── gates/
│   │   ├── GateStatusCard.tsx    # A1/P2/P3/P4 status display widget
│   │   └── GateDecisionForm.tsx  # Approve/return/decline form
│   ├── evidence/
│   │   ├── EvidenceTable.tsx
│   │   ├── EvidenceForm.tsx
│   │   └── FileUploader.tsx      # Handles multipart upload
│   ├── planning/
│   │   ├── ObjectivesList.tsx
│   │   └── PlanningForm.tsx
│   ├── draft/
│   │   ├── StatementsTable.tsx
│   │   └── ReferenceStatusBadge.tsx
│   ├── dashboard/
│   │   ├── CountCard.tsx
│   │   ├── BlockersPanel.tsx
│   │   └── MilestoneTimeline.tsx
│   └── shared/
│       ├── StatusBadge.tsx
│       ├── ConfirmDialog.tsx
│       ├── DataTable.tsx         # Sortable, paginated table
│       └── CsvExportButton.tsx
└── hooks/
    ├── useCurrentUser.ts
    ├── useEngagement.ts
    └── useBlockers.ts
```

#### 2.2.1 Frontend Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **React SPA with client-side routing** | Users need fast in-app navigation between engagement pages without full page reloads. |
| **Role-filtered navigation** | Navigation items visible to a role are determined client-side by the current user's roles; API enforces the same rules server-side. |
| **API client wrapper** | Centralizes auth token injection, error response normalization, and redirect-to-login on 401. |
| **TypeScript throughout** | All API request/response types are defined as TypeScript interfaces (see Section 4) to catch shape mismatches at compile time. |
| **Optimistic UI disabled for gate actions** | Gate approvals have irreversible effects; UI waits for API response before updating state. |
| **CSV export via Content-Disposition** | Server generates CSV and returns `Content-Type: text/csv` with `Content-Disposition: attachment`; browser triggers download automatically. |

---

## 3. Data Model

### 3.1 Entity Relationship Diagram

```
users ──────────────────────────────────────────────────────────────────┐
  │ id (PK)                                                             │
  │                                                                     │
  ├─ user_roles (user_id FK)                                            │
  ├─ sessions (user_id FK)                                              │
  ├─ login_attempts (email)                                             │
  │                                                                     │
requests (created_by FK → users)                                        │
  │ id (PK)                                                             │
  │                                                                     │
  └──► engagements (request_id FK → requests, owner_id FK → users) ────┘
          │ id (PK)                                                      
          │                                                              
          ├──► team_assignments (engagement_id FK, user_id FK → users)  
          ├──► milestones (engagement_id FK, UNIQUE)                    
          ├──► planning_records (engagement_id FK, UNIQUE)              
          │       │                                                      
          │       ├──► objectives (planning_record_id FK)               
          │       │       │                                              
          │       │       └──► objective_evidence_links                 
          │       │               (objective_id FK, evidence_item_id FK)
          │       └──► planning_revisions (planning_record_id FK)       
          │                                                              
          ├──► evidence_items (engagement_id FK, uploaded_by FK → users)
          │       │                                                      
          │       ├──► evidence_files (evidence_item_id FK)             
          │       ├──► objective_evidence_links (evidence_item_id FK)   
          │       ├──► finding_evidence_links (evidence_item_id FK)     
          │       └──► statement_evidence_links (evidence_item_id FK)   
          │                                                              
          ├──► findings (engagement_id FK, created_by FK → users)       
          │       │                                                      
          │       └──► finding_evidence_links (finding_id FK)           
          │                                                              
          ├──► draft_products (engagement_id FK, UNIQUE)                
          │       │                                                      
          │       ├──► draft_statements (draft_product_id FK)           
          │       │       │                                              
          │       │       └──► statement_evidence_links (statement_id FK)
          │       └──► draft_comments (draft_product_id FK)             
          │                                                              
          ├──► gate_decisions (engagement_id FK, approver_id FK → users)
          └──► audit_events (engagement_id FK, actor_id FK → users)     
```

**Entity count:** 20 tables across 8 domain groups: Auth, Requests, Engagements, Team, Planning, Evidence, Findings, Draft, Gates, Audit.

**Immutable tables (no UPDATE/DELETE at application layer):**
- `gate_decisions`
- `audit_events`
- `draft_comments`

**Soft-delete tables (`deleted_at` column):**
- `objectives`
- `evidence_items`
- `evidence_files`
- `findings`

---

### 3.2 Full Database DDL

All tables use PostgreSQL syntax. UUIDs are generated by `gen_random_uuid()`. All timestamps are `TIMESTAMPTZ` (UTC). PostgreSQL 15+ required.

---

#### §Auth — Users and Roles

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    full_name       VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(10) NOT NULL CHECK (role IN ('AL','EM','AN','QA','IR','PC','RO','AD')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    UNIQUE (user_id, role)
);

CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ
);

CREATE TABLE login_attempts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL,
    succeeded   BOOLEAN NOT NULL,
    ip_address  VARCHAR(45),
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### §Requests

```sql
CREATE TABLE requests (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type            VARCHAR(30) NOT NULL CHECK (request_type IN ('congressional_request','mandate','internal_proposal')),
    requester               VARCHAR(255),
    topic                   VARCHAR(500),
    agency_program          VARCHAR(255),
    due_date                DATE,
    notes                   TEXT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft','submitted','accepted','declined')),
    intake_document_ref     VARCHAR(1000),
    intake_document_name    VARCHAR(255),
    submitted_at            TIMESTAMPTZ,
    created_by              UUID NOT NULL REFERENCES users(id),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_by ON requests(created_by);
```

---

#### §Engagements

```sql
CREATE TABLE engagements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id  UUID REFERENCES requests(id),
    job_code    VARCHAR(100) NOT NULL UNIQUE,
    title       VARCHAR(500) NOT NULL,
    phase       VARCHAR(20) NOT NULL DEFAULT 'planning'
                    CHECK (phase IN ('intake','planning','evidence','draft','readiness','closed')),
    status      VARCHAR(30) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','on_hold','ready_for_issuance','closed')),
    risk_level  VARCHAR(10) NOT NULL CHECK (risk_level IN ('low','medium','high')),
    owner_id    UUID NOT NULL REFERENCES users(id),
    portfolio   VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_engagements_owner ON engagements(owner_id);
CREATE INDEX idx_engagements_phase ON engagements(phase);
CREATE INDEX idx_engagements_status ON engagements(status);

-- Auto-increment job code sequence per year
CREATE SEQUENCE engagement_seq_2026 START 1;
-- (Create a new sequence each year: engagement_seq_YYYY)
```

---

#### §Team

```sql
CREATE TABLE team_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id   UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    role            VARCHAR(10) NOT NULL CHECK (role IN ('AL','EM','AN','QA','IR','PC','RO')),
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by     UUID REFERENCES users(id),
    removed_at      TIMESTAMPTZ,
    UNIQUE (engagement_id, user_id, role)
);

CREATE TABLE milestones (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id               UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE UNIQUE,
    planning_approval_target    DATE,
    evidence_readiness_target   DATE,
    draft_readiness_target      DATE,
    final_readiness_target      DATE,
    updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### §Planning

```sql
CREATE TABLE planning_records (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id           UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE UNIQUE,
    design_approach         TEXT,
    schedule_notes          TEXT,
    risk_notes              TEXT,
    data_reliability_notes  TEXT,
    independence_status     VARCHAR(20) CHECK (independence_status IN ('affirmed','pending','exception_noted')),
    status                  VARCHAR(20) NOT NULL DEFAULT 'draft'
                                CHECK (status IN ('draft','ready_for_review','approved','returned')),
    approved_at             TIMESTAMPTZ,
    approved_by             UUID REFERENCES users(id),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE objectives (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id       UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    planning_record_id  UUID NOT NULL REFERENCES planning_records(id) ON DELETE CASCADE,
    objective_text      TEXT NOT NULL,
    information_need    TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'evidence_needed'
                            CHECK (status IN ('evidence_needed','in_review','sufficient')),
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_objectives_planning_record ON objectives(planning_record_id);
CREATE INDEX idx_objectives_engagement ON objectives(engagement_id);

CREATE TABLE planning_revisions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planning_record_id  UUID NOT NULL REFERENCES planning_records(id),
    revised_by          UUID NOT NULL REFERENCES users(id),
    revision_note       TEXT NOT NULL,
    before_snapshot     JSONB,
    after_snapshot      JSONB,
    revised_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

#### §Evidence

```sql
CREATE TABLE evidence_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id   UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    evidence_type   VARCHAR(20) NOT NULL
                        CHECK (evidence_type IN ('document','dataset','interview_note','meeting_note','other')),
    source          VARCHAR(500) NOT NULL,
    date_received   DATE NOT NULL,
    custodian       VARCHAR(255),
    description     TEXT,
    sensitivity     VARCHAR(15) NOT NULL DEFAULT 'standard'
                        CHECK (sensitivity IN ('standard','restricted')),
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_evidence_engagement ON evidence_items(engagement_id);
CREATE INDEX idx_evidence_sensitivity ON evidence_items(sensitivity);

CREATE TABLE evidence_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_item_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    file_ref        VARCHAR(1000) NOT NULL,
    file_name       VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE objective_evidence_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    objective_id    UUID NOT NULL REFERENCES objectives(id) ON DELETE CASCADE,
    evidence_item_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    linked_by       UUID NOT NULL REFERENCES users(id),
    linked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (objective_id, evidence_item_id)
);
```

---

#### §Findings

```sql
CREATE TABLE findings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id   UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    finding_text    TEXT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','under_review','accepted','rejected')),
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE finding_evidence_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id      UUID NOT NULL REFERENCES findings(id) ON DELETE CASCADE,
    evidence_item_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    linked_by       UUID NOT NULL REFERENCES users(id),
    linked_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (finding_id, evidence_item_id)
);
```

---

#### §Draft

```sql
CREATE TABLE draft_products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id   UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE UNIQUE,
    title           VARCHAR(500) NOT NULL,
    version         VARCHAR(50) NOT NULL,
    owner_id        UUID NOT NULL REFERENCES users(id),
    status          VARCHAR(30) NOT NULL DEFAULT 'drafting'
                        CHECK (status IN ('drafting','under_review','ready_for_reference_check','ready_for_final_review')),
    review_comments TEXT,
    file_ref        VARCHAR(1000),
    file_name       VARCHAR(255),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE draft_statements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_product_id    UUID NOT NULL REFERENCES draft_products(id) ON DELETE CASCADE,
    statement_text      TEXT NOT NULL,
    reference_status    VARCHAR(20) NOT NULL DEFAULT 'not_started'
                            CHECK (reference_status IN ('not_started','in_review','passed','failed','waived')),
    assigned_to_ir      UUID REFERENCES users(id),
    assigned_to_analyst UUID REFERENCES users(id),
    discrepancy_notes   TEXT,
    revision_ready      BOOLEAN NOT NULL DEFAULT FALSE,
    waived_by           UUID REFERENCES users(id),
    waived_at           TIMESTAMPTZ,
    waiver_justification TEXT,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_statements_draft_product ON draft_statements(draft_product_id);
CREATE INDEX idx_statements_ref_status ON draft_statements(reference_status);

CREATE TABLE statement_evidence_links (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_id        UUID NOT NULL REFERENCES draft_statements(id) ON DELETE CASCADE,
    evidence_item_id    UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    linked_by           UUID NOT NULL REFERENCES users(id),
    linked_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (statement_id, evidence_item_id)
);

CREATE TABLE draft_comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_product_id UUID NOT NULL REFERENCES draft_products(id) ON DELETE CASCADE,
    author_id       UUID NOT NULL REFERENCES users(id),
    author_name     VARCHAR(255) NOT NULL,
    comment_text    TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Note: No UPDATE or DELETE permitted (append-only)
);
```

---

#### §Gates

```sql
CREATE TABLE gate_decisions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id   UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    gate_type       VARCHAR(5) NOT NULL CHECK (gate_type IN ('A1','P2','P3','P4')),
    status          VARCHAR(15) NOT NULL CHECK (status IN ('approved','declined','returned')),
    approver_id     UUID NOT NULL REFERENCES users(id),
    decided_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rationale       TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Note: No UPDATE or DELETE permitted on this table (enforced at application layer)
);

CREATE INDEX idx_gate_decisions_engagement ON gate_decisions(engagement_id);
CREATE INDEX idx_gate_decisions_gate_type ON gate_decisions(gate_type);
```

---

#### §Audit

```sql
CREATE TABLE audit_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id   UUID REFERENCES engagements(id),
    actor_id        UUID NOT NULL REFERENCES users(id),
    actor_name      VARCHAR(255) NOT NULL,
    action          VARCHAR(100) NOT NULL,
    object_type     VARCHAR(100) NOT NULL,
    object_id       UUID,
    summary         TEXT NOT NULL,
    before_snapshot JSONB,
    after_snapshot  JSONB,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- Note: No UPDATE or DELETE permitted on this table (enforced at application layer)
);

CREATE INDEX idx_audit_engagement ON audit_events(engagement_id);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_action ON audit_events(action);
CREATE INDEX idx_audit_occurred_at ON audit_events(occurred_at DESC);
```

---

### 3.3 Enum Reference

| Table | Column | Allowed Values |
|-------|--------|---------------|
| `user_roles` | `role` | `AL`, `EM`, `AN`, `QA`, `IR`, `PC`, `RO`, `AD` |
| `team_assignments` | `role` | `AL`, `EM`, `AN`, `QA`, `IR`, `PC`, `RO` |
| `requests` | `request_type` | `congressional_request`, `mandate`, `internal_proposal` |
| `requests` | `status` | `draft`, `submitted`, `accepted`, `declined` |
| `engagements` | `phase` | `intake`, `planning`, `evidence`, `draft`, `readiness`, `closed` |
| `engagements` | `status` | `active`, `on_hold`, `ready_for_issuance`, `closed` |
| `engagements` | `risk_level` | `low`, `medium`, `high` |
| `planning_records` | `independence_status` | `affirmed`, `pending`, `exception_noted` |
| `planning_records` | `status` | `draft`, `ready_for_review`, `approved`, `returned` |
| `objectives` | `status` | `evidence_needed`, `in_review`, `sufficient` |
| `evidence_items` | `evidence_type` | `document`, `dataset`, `interview_note`, `meeting_note`, `other` |
| `evidence_items` | `sensitivity` | `standard`, `restricted` |
| `findings` | `status` | `draft`, `under_review`, `accepted`, `rejected` |
| `draft_products` | `status` | `drafting`, `under_review`, `ready_for_reference_check`, `ready_for_final_review` |
| `draft_statements` | `reference_status` | `not_started`, `in_review`, `passed`, `failed`, `waived` |
| `gate_decisions` | `gate_type` | `A1`, `P2`, `P3`, `P4` |
| `gate_decisions` | `status` | `approved`, `declined`, `returned` |

---

### 3.4 Immutability and Soft-Delete Summary

| Table | Strategy | Notes |
|-------|----------|-------|
| `gate_decisions` | Immutable (no UPDATE/DELETE) | Multiple rows for same gate are permitted; most recent = current status |
| `audit_events` | Immutable (no UPDATE/DELETE) | Append-only at all times |
| `draft_comments` | Immutable (no UPDATE/DELETE) | Append-only comment history |
| `objectives` | Soft delete (`deleted_at`) | Deletion blocked if evidence is linked |
| `evidence_items` | Soft delete (`deleted_at`) | Deletion blocked if linked to objectives/findings/statements |
| `evidence_files` | Soft delete (`deleted_at`) | Physical file removal deferred to scheduled cleanup |
| `findings` | Soft delete (`deleted_at`) | Deletion blocked if referenced by statements |
| All others | Hard update/delete permitted | Standard CRUD |

---

## 4. API Design

### 4.1 API Conventions

- **Base path:** `/api/v1`
- **Content-Type:** `application/json` (all endpoints except file uploads)
- **File uploads:** `multipart/form-data`
- **CSV export:** Triggered by `Accept: text/csv` header or `?format=csv` query parameter
- **Authentication:** Required on all endpoints. Session token in `Authorization: Bearer <token>` header or session cookie.
- **Pagination:** List endpoints support `?page=1&per_page=25` (default 25, max 100).

**Standard success envelope:**
```json
{
  "data": { },
  "meta": { "timestamp": "2026-06-04T00:00:00Z" }
}
```

**Standard error envelope:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "errors": [ { "field": "field_name", "message": "..." } ]
  }
}
```

---

### 4.2 TypeScript Interface Definitions

```typescript
// ─── Shared ────────────────────────────────────────────────────────────

type UUID = string;
type ISODateString = string;    // "YYYY-MM-DD"
type ISOTimestamp = string;     // ISO 8601 UTC

type RoleCode = 'AL' | 'EM' | 'AN' | 'QA' | 'IR' | 'PC' | 'RO' | 'AD';

// ─── Auth ──────────────────────────────────────────────────────────────

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: UUID;
    email: string;
    full_name: string;
    roles: RoleCode[];
  };
}

// ─── Users ─────────────────────────────────────────────────────────────

interface User {
  id: UUID;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: RoleCode[];
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
  roles: RoleCode[];
}

interface UpdateUserRolesRequest {
  roles: RoleCode[];
}

// ─── Requests ──────────────────────────────────────────────────────────

type RequestType = 'congressional_request' | 'mandate' | 'internal_proposal';
type RequestStatus = 'draft' | 'submitted' | 'accepted' | 'declined';

interface Request {
  id: UUID;
  request_type: RequestType;
  requester: string | null;
  topic: string | null;
  agency_program: string | null;
  due_date: ISODateString | null;
  notes: string | null;
  status: RequestStatus;
  intake_document_ref: string | null;
  intake_document_name: string | null;
  submitted_at: ISOTimestamp | null;
  created_by: UUID;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

interface CreateRequestRequest {
  request_type: RequestType;
  requester?: string;
  topic?: string;
  agency_program?: string;
  due_date?: ISODateString;
  notes?: string;
}

interface UpdateRequestRequest {
  requester?: string;
  topic?: string;
  agency_program?: string;
  due_date?: ISODateString;
  notes?: string;
}

// ─── Engagements ───────────────────────────────────────────────────────

type EngagementPhase = 'intake' | 'planning' | 'evidence' | 'draft' | 'readiness' | 'closed';
type EngagementStatus = 'active' | 'on_hold' | 'ready_for_issuance' | 'closed';
type RiskLevel = 'low' | 'medium' | 'high';

interface Engagement {
  id: UUID;
  request_id: UUID | null;
  job_code: string;
  title: string;
  phase: EngagementPhase;
  status: EngagementStatus;
  risk_level: RiskLevel;
  owner_id: UUID;
  owner_name?: string;
  portfolio: string | null;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

interface UpdateEngagementRequest {
  title?: string;
  phase?: EngagementPhase;
  status?: 'active' | 'on_hold';
  risk_level?: RiskLevel;
  owner_id?: UUID;
  portfolio?: string;
  revision_note?: string;  // required if phase changes
}

interface Blocker {
  type: string;
  message: string;
  object_id?: UUID;
}

// ─── Team and Milestones ────────────────────────────────────────────────

type TeamRole = 'AL' | 'EM' | 'AN' | 'QA' | 'IR' | 'PC' | 'RO';

interface TeamAssignment {
  id: UUID;
  engagement_id: UUID;
  user_id: UUID;
  user_name?: string;
  role: TeamRole;
  assigned_at: ISOTimestamp;
  assigned_by: UUID;
  removed_at: ISOTimestamp | null;
}

interface AddTeamMemberRequest {
  user_id: UUID;
  role: TeamRole;
}

type MilestoneStatus = 'not_started' | 'on_track' | 'at_risk' | 'complete' | 'overdue';

interface Milestones {
  id: UUID;
  engagement_id: UUID;
  planning_approval_target: ISODateString | null;
  evidence_readiness_target: ISODateString | null;
  draft_readiness_target: ISODateString | null;
  final_readiness_target: ISODateString | null;
  updated_at: ISOTimestamp;
  // computed status fields
  planning_approval_status: MilestoneStatus;
  evidence_readiness_status: MilestoneStatus;
  draft_readiness_status: MilestoneStatus;
  final_readiness_status: MilestoneStatus;
}

interface UpdateMilestonesRequest {
  planning_approval_target?: ISODateString | null;
  evidence_readiness_target?: ISODateString | null;
  draft_readiness_target?: ISODateString | null;
  final_readiness_target?: ISODateString | null;
}

// ─── Planning ──────────────────────────────────────────────────────────

type IndependenceStatus = 'affirmed' | 'pending' | 'exception_noted';
type PlanningStatus = 'draft' | 'ready_for_review' | 'approved' | 'returned';

interface PlanningRecord {
  id: UUID;
  engagement_id: UUID;
  design_approach: string | null;
  schedule_notes: string | null;
  risk_notes: string | null;
  data_reliability_notes: string | null;
  independence_status: IndependenceStatus | null;
  status: PlanningStatus;
  approved_at: ISOTimestamp | null;
  approved_by: UUID | null;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

interface UpdatePlanningRequest {
  design_approach?: string;
  schedule_notes?: string;
  risk_notes?: string;
  data_reliability_notes?: string;
  independence_status?: IndependenceStatus;
  revision_note?: string;  // required if planning_record.status = 'approved'
}

type ObjectiveStatus = 'evidence_needed' | 'in_review' | 'sufficient';

interface Objective {
  id: UUID;
  engagement_id: UUID;
  planning_record_id: UUID;
  objective_text: string;
  information_need: string | null;
  status: ObjectiveStatus;
  sort_order: number;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
  deleted_at: ISOTimestamp | null;
  linked_evidence_count?: number;
}

interface CreateObjectiveRequest {
  objective_text: string;
  information_need?: string;
  sort_order?: number;
}

interface PlanningRevision {
  id: UUID;
  planning_record_id: UUID;
  revised_by: UUID;
  revision_note: string;
  before_snapshot: object | null;
  after_snapshot: object | null;
  revised_at: ISOTimestamp;
}

// ─── Gates ────────────────────────────────────────────────────────────

type GateType = 'A1' | 'P2' | 'P3' | 'P4';
type GateStatus = 'approved' | 'declined' | 'returned';

interface GateDecision {
  id: UUID;
  engagement_id: UUID;
  gate_type: GateType;
  status: GateStatus;
  approver_id: UUID;
  approver_name?: string;
  decided_at: ISOTimestamp;
  rationale: string;
  created_at: ISOTimestamp;
}

interface ApproveA1Request {
  risk_level: RiskLevel;
  rationale: string;  // min 10 chars
}

interface DeclineA1Request {
  rationale: string;  // min 10 chars
}

interface ApproveP2Request {
  rationale: string;  // min 10 chars
}

interface ReturnP2Request {
  rationale: string;  // min 10 chars
}

interface ApproveP3Request {
  rationale: string;  // min 10 chars
}

type P4Outcome = 'ready_for_issuance' | 'closed';

interface ApproveP4Request {
  outcome: P4Outcome;
  rationale: string;  // min 10 chars
}

// ─── Evidence ─────────────────────────────────────────────────────────

type EvidenceType = 'document' | 'dataset' | 'interview_note' | 'meeting_note' | 'other';
type Sensitivity = 'standard' | 'restricted';

interface EvidenceItem {
  id: UUID;
  engagement_id: UUID;
  evidence_type: EvidenceType;
  source: string;
  date_received: ISODateString;
  custodian: string | null;
  description: string | null;
  sensitivity: Sensitivity;
  uploaded_by: UUID;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
  deleted_at: ISOTimestamp | null;
  files?: EvidenceFile[];
  linked_objectives?: UUID[];
}

interface CreateEvidenceRequest {
  evidence_type: EvidenceType;
  source: string;
  date_received: ISODateString;
  custodian?: string;
  description?: string;
  sensitivity: Sensitivity;
}

interface EvidenceFile {
  id: UUID;
  evidence_item_id: UUID;
  file_ref: string;
  file_name: string;
  file_size_bytes: number | null;
  uploaded_by: UUID;
  uploaded_at: ISOTimestamp;
  deleted_at: ISOTimestamp | null;
}

interface LinkEvidenceToObjectivesRequest {
  objective_ids: UUID[];
}

// ─── Findings ─────────────────────────────────────────────────────────

type FindingStatus = 'draft' | 'under_review' | 'accepted' | 'rejected';

interface Finding {
  id: UUID;
  engagement_id: UUID;
  finding_text: string;
  status: FindingStatus;
  created_by: UUID;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
  deleted_at: ISOTimestamp | null;
  linked_evidence?: UUID[];
}

interface CreateFindingRequest {
  finding_text: string;
}

interface LinkFindingToEvidenceRequest {
  evidence_item_ids: UUID[];
}

// ─── Draft Product ────────────────────────────────────────────────────

type DraftProductStatus = 'drafting' | 'under_review' | 'ready_for_reference_check' | 'ready_for_final_review';

interface DraftProduct {
  id: UUID;
  engagement_id: UUID;
  title: string;
  version: string;
  owner_id: UUID;
  status: DraftProductStatus;
  review_comments: string | null;
  file_ref: string | null;
  file_name: string | null;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
}

interface CreateDraftProductRequest {
  title: string;
  version: string;
  owner_id: UUID;
}

interface UpdateDraftProductRequest {
  title?: string;
  version?: string;
  owner_id?: UUID;
}

interface UpdateDraftStatusRequest {
  status: DraftProductStatus;
}

interface DraftComment {
  id: UUID;
  draft_product_id: UUID;
  author_id: UUID;
  author_name: string;
  comment_text: string;
  created_at: ISOTimestamp;
}

interface AddDraftCommentRequest {
  comment_text: string;
}

// ─── Statements ───────────────────────────────────────────────────────

type ReferenceStatus = 'not_started' | 'in_review' | 'passed' | 'failed' | 'waived';

interface DraftStatement {
  id: UUID;
  draft_product_id: UUID;
  statement_text: string;
  reference_status: ReferenceStatus;
  assigned_to_ir: UUID | null;
  assigned_to_analyst: UUID | null;
  discrepancy_notes: string | null;
  revision_ready: boolean;
  waived_by: UUID | null;
  waived_at: ISOTimestamp | null;
  waiver_justification: string | null;
  sort_order: number;
  created_at: ISOTimestamp;
  updated_at: ISOTimestamp;
  linked_evidence?: UUID[];
}

interface CreateStatementRequest {
  statement_text: string;
  sort_order?: number;
}

interface UpdateReferenceStatusRequest {
  reference_status: 'in_review' | 'passed' | 'failed';
  discrepancy_notes?: string;  // required if reference_status = 'failed'
}

interface AssignStatementRequest {
  assigned_to_ir?: UUID;
  assigned_to_analyst?: UUID;
}

interface WaiveStatementRequest {
  waiver_justification: string;  // min 10 chars
}

// ─── Dashboard ────────────────────────────────────────────────────────

interface PortfolioCounts {
  active: number;
  in_planning: number;
  in_evidence: number;
  in_draft: number;
  ready_for_issuance: number;
  closed: number;
  high_risk: number;
  pending_requests: number;
}

interface PortfolioDashboardResponse {
  counts: PortfolioCounts;
  engagements: EngagementListRow[];
}

interface EngagementListRow {
  id: UUID;
  job_code: string;
  title: string;
  phase: EngagementPhase;
  status: EngagementStatus;
  owner_name: string;
  risk_level: RiskLevel;
  next_milestone: { label: string; target_date: ISODateString; status: MilestoneStatus } | null;
  gate_status: {
    A1: GateStatus | 'not_started';
    P2: GateStatus | 'not_started';
    P3: GateStatus | 'not_started';
    P4: GateStatus | 'not_started';
  };
  due_date: ISODateString | null;
}

interface EvidenceMetrics {
  total: number;
  objectives_with_evidence: number;
  objectives_without_evidence: number;
  sufficiency_pct: number;
}

interface ReferenceMetrics {
  total: number;
  passed: number;
  waived: number;
  failed: number;
  in_review: number;
  not_started: number;
  completion_pct: number;
}

interface EngagementDetailDashboardResponse {
  phase_summary: {
    phase: EngagementPhase;
    status: EngagementStatus;
    owner_name: string;
    risk_level: RiskLevel;
    job_code: string;
    title: string;
    due_date: ISODateString | null;
  };
  gate_status: {
    A1: GateDecision | null;
    P2: GateDecision | null;
    P3: GateDecision | null;
    P4: GateDecision | null;
  };
  milestones: Milestones;
  evidence_metrics: EvidenceMetrics;
  reference_metrics: ReferenceMetrics;
  blockers: Blocker[];
}

// ─── Audit ────────────────────────────────────────────────────────────

interface AuditEvent {
  id: UUID;
  engagement_id: UUID | null;
  actor_id: UUID;
  actor_name: string;
  action: string;
  object_type: string;
  object_id: UUID | null;
  summary: string;
  before_snapshot: object | null;
  after_snapshot: object | null;
  occurred_at: ISOTimestamp;
}
```

---

### 4.3 Full REST API Endpoint Catalog

All endpoints prefixed with `/api/v1`. Authentication required on all.

#### §Auth and Users

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `POST` | `/auth/login` | Login; returns session token | Public |
| `POST` | `/auth/logout` | Logout; revokes session | Authenticated |
| `GET` | `/users/me` | Get current user profile | Authenticated |
| `GET` | `/users` | List all users | AD |
| `POST` | `/users` | Create user | AD |
| `GET` | `/users/{id}` | Get user by ID | AD |
| `PATCH` | `/users/{id}` | Update user fields | AD |
| `PUT` | `/users/{id}/roles` | Replace user role list | AD |

#### §Requests

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/requests` | List requests (filterable by status) | AL, AD, RO |
| `POST` | `/requests` | Create request (draft) | AL, AD |
| `GET` | `/requests/{id}` | Get request detail | AL, AD, EM, RO |
| `PATCH` | `/requests/{id}` | Update request (draft only) | AL, AD |
| `POST` | `/requests/{id}/submit` | Submit request for A1 | AL, AD |
| `POST` | `/requests/{id}/document` | Upload intake document (multipart) | AL, AD |
| `GET` | `/requests/{id}/document` | Download intake document | AL, AD, EM |

#### §Engagements

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements` | List engagements (filterable; scoped) | All |
| `GET` | `/engagements` (CSV) | Export engagement register (`Accept: text/csv`) | AL, EM, AN, QA, PC, RO, AD |
| `GET` | `/engagements/{id}` | Get engagement detail | All (scoped) |
| `PATCH` | `/engagements/{id}` | Update engagement metadata | EM, AD |
| `GET` | `/engagements/{id}/blockers` | Get computed blockers list | All (scoped) |

#### §Team and Milestones

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/team` | List team assignments | All (scoped) |
| `POST` | `/engagements/{id}/team` | Add team member | EM, AD |
| `DELETE` | `/engagements/{id}/team/{assignment_id}` | Remove team member | EM, AD |
| `GET` | `/engagements/{id}/milestones` | Get milestone dates and computed status | All (scoped) |
| `PUT` | `/engagements/{id}/milestones` | Set/update all milestone dates | EM, AD |

#### §Planning

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/planning` | Get planning record | All (scoped) |
| `POST` | `/engagements/{id}/planning` | Create planning record | EM, AD |
| `PATCH` | `/engagements/{id}/planning` | Update planning record | EM, AN, AD |
| `POST` | `/engagements/{id}/planning/submit` | Submit for P2 review | EM, AD |
| `GET` | `/engagements/{id}/planning/objectives` | List objectives | All (scoped) |
| `POST` | `/engagements/{id}/planning/objectives` | Add objective | EM, AN, AD |
| `PATCH` | `/engagements/{id}/planning/objectives/{obj_id}` | Update objective | EM, AN, AD |
| `DELETE` | `/engagements/{id}/planning/objectives/{obj_id}` | Delete objective (blocked if evidence linked) | EM, AD |
| `GET` | `/engagements/{id}/planning/revisions` | List planning revisions | EM, QA, AD |

#### §Gates

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/gates` | List all gate decisions | All (scoped) |
| `GET` | `/engagements/{id}/gates/{gate_type}` | Get gate decisions for one gate type | All (scoped) |
| `POST` | `/engagements/{id}/gates/a1/approve` | Approve Gate A1 | AL |
| `POST` | `/engagements/{id}/gates/a1/decline` | Decline Gate A1 | AL |
| `POST` | `/engagements/{id}/gates/p2/approve` | Approve Gate P2 | QA |
| `POST` | `/engagements/{id}/gates/p2/return` | Return Gate P2 | QA |
| `POST` | `/engagements/{id}/gates/p3/approve` | Approve Gate P3 | QA |
| `POST` | `/engagements/{id}/gates/p4/approve` | Approve Gate P4 | EM, PC, AD |

#### §Evidence

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/evidence` | List evidence items (restricted items filtered) | All (scoped) |
| `GET` | `/engagements/{id}/evidence` (CSV) | Export evidence registry | AL, EM, AN, QA, PC, RO, AD |
| `POST` | `/engagements/{id}/evidence` | Create evidence item | AN, AD |
| `GET` | `/engagements/{id}/evidence/{ev_id}` | Get evidence item detail | All (scoped) |
| `PATCH` | `/engagements/{id}/evidence/{ev_id}` | Update evidence item | AN, AD |
| `DELETE` | `/engagements/{id}/evidence/{ev_id}` | Soft-delete evidence item | AN, AD |
| `POST` | `/engagements/{id}/evidence/{ev_id}/files` | Upload evidence file (multipart) | AN, AD |
| `GET` | `/engagements/{id}/evidence/{ev_id}/files/{file_id}` | Download evidence file | All (scoped; restricted enforced) |
| `POST` | `/engagements/{id}/evidence/{ev_id}/objectives` | Link evidence to objectives | AN, EM, AD |
| `DELETE` | `/engagements/{id}/evidence/{ev_id}/objectives/{obj_id}` | Unlink evidence from objective | AN, EM, AD |
| `GET` | `/engagements/{id}/evidence/gaps` | List objectives with no linked evidence | All (scoped) |

#### §Findings

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/findings` | List findings | All (scoped) |
| `POST` | `/engagements/{id}/findings` | Create finding | AN, AD |
| `GET` | `/engagements/{id}/findings/{f_id}` | Get finding detail | All (scoped) |
| `PATCH` | `/engagements/{id}/findings/{f_id}` | Update finding | AN, AD |
| `DELETE` | `/engagements/{id}/findings/{f_id}` | Soft-delete finding | AN, AD |
| `POST` | `/engagements/{id}/findings/{f_id}/evidence` | Link finding to evidence | AN, AD |
| `DELETE` | `/engagements/{id}/findings/{f_id}/evidence/{ev_id}` | Unlink finding from evidence | AN, AD |

#### §Draft Product

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/draft` | Get draft product | All (scoped) |
| `POST` | `/engagements/{id}/draft` | Create draft product | EM, AN, AD |
| `PATCH` | `/engagements/{id}/draft` | Update draft product | EM, AN, AD |
| `POST` | `/engagements/{id}/draft/file` | Attach draft file (multipart) | EM, AN, AD |
| `GET` | `/engagements/{id}/draft/file` | Download draft file | All (scoped) |
| `PATCH` | `/engagements/{id}/draft/status` | Advance/change draft status | EM, QA, AD |
| `GET` | `/engagements/{id}/draft/comments` | List review comments | All (scoped) |
| `POST` | `/engagements/{id}/draft/comments` | Add review comment (append-only) | EM, AN, QA, AD |

#### §Statements

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/draft/statements` | List draft statements | All (scoped) |
| `POST` | `/engagements/{id}/draft/statements` | Create draft statement | AN, EM, AD |
| `PATCH` | `/engagements/{id}/draft/statements/{s_id}` | Update statement | AN, EM, AD |
| `DELETE` | `/engagements/{id}/draft/statements/{s_id}` | Delete statement | AN, EM, AD |
| `POST` | `/engagements/{id}/draft/statements/{s_id}/evidence` | Link statement to evidence | AN, EM, AD |
| `DELETE` | `/engagements/{id}/draft/statements/{s_id}/evidence/{ev_id}` | Unlink statement from evidence | AN, EM, AD |
| `PATCH` | `/engagements/{id}/draft/statements/{s_id}/reference-status` | Set reference status | IR |
| `POST` | `/engagements/{id}/draft/statements/{s_id}/assign` | Assign to IR or Analyst | EM, AD |
| `POST` | `/engagements/{id}/draft/statements/{s_id}/waive` | Waive reference check | EM, AD |

#### §Dashboard

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/dashboard/portfolio` | Portfolio summary counts and engagement list | All |
| `GET` | `/dashboard/engagements/{id}` | Engagement detail dashboard metrics | All (scoped) |

#### §Audit

| Method | Path | Description | Permitted Roles |
|--------|------|-------------|-----------------|
| `GET` | `/engagements/{id}/audit` | List audit events for engagement | All (scoped); AD sees all |
| `GET` | `/engagements/{id}/audit` (CSV) | Export audit log (`Accept: text/csv`) | AD |

---

### 4.4 Gate API Examples

**POST /api/v1/engagements/{id}/gates/a1/approve**
```json
// Request
{
  "risk_level": "medium",
  "rationale": "Request meets all criteria; risk is manageable."
}
// Response 201
{
  "data": {
    "gate_decision": {
      "id": "uuid",
      "gate_type": "A1",
      "status": "approved",
      "approver_id": "uuid",
      "decided_at": "2026-06-04T10:00:00Z",
      "rationale": "Request meets all criteria; risk is manageable."
    },
    "engagement": {
      "id": "uuid",
      "job_code": "ENG-2026-00001",
      "phase": "planning",
      "status": "active"
    }
  }
}
```

**POST /api/v1/engagements/{id}/gates/p4/approve**
```json
// Request
{
  "outcome": "ready_for_issuance",
  "rationale": "All reference checks passed. No open blockers. Final review complete."
}
// Response 201
{
  "data": {
    "gate_decision": { "gate_type": "P4", "status": "approved", ... },
    "engagement": { "status": "ready_for_issuance", "phase": "readiness" }
  }
}
```

**PATCH /api/v1/engagements/{id}/draft/statements/{s_id}/reference-status**
```json
// Request (failed)
{
  "reference_status": "failed",
  "discrepancy_notes": "Statement claims 45% but evidence shows 32% in Table 3."
}
// Response 200
{
  "data": { "id": "uuid", "reference_status": "failed", "discrepancy_notes": "..." }
}
```

---

## 5. Security Architecture

### 5.1 Authentication

**Mechanism:** Built-in username/password authentication (v1). OIDC/SAML deferred to post-MVP.

**Flow:**
```
User → POST /auth/login (email, password)
  → Server hashes password with bcrypt (cost ≥ 12)
  → Compares hash against users.password_hash
  → On match: generates a random token, stores hash in sessions table
  → Returns token to client
  → Client includes token in Authorization: Bearer <token> header on all requests
  → Server looks up token_hash in sessions table on each request
  → Validates session is not expired and not revoked
  → Injects user context (id, roles) into request
```

**Session storage:**
- Sessions are stored in the `sessions` table (not purely stateless JWTs).
- This enables hard revocation on logout and account lockout without key rotation.
- Session expiry: 8 hours (configurable via `SESSION_EXPIRY_HOURS`).
- On logout: `sessions.revoked_at` is set; the token is immediately invalid.

**Password security:**
- Passwords hashed with bcrypt, cost factor ≥ 12.
- Passwords never stored in plaintext or reversible encoding.
- Password reset flow is deferred to post-MVP (Admin can reset via API).

**Account lockout:**
- After 5 consecutive failed login attempts within 15 minutes, the account is locked for 15 minutes.
- Lockout is tracked via the `login_attempts` table (email + timestamp + succeeded flag).
- Lockout duration is configurable via `LOCKOUT_DURATION_MINUTES`.
- All failed login attempts and lockout events are written to `audit_events`.

**Future provision:** The auth module is designed with an interface abstraction so that an OIDC/SAML provider can replace the built-in password auth by swapping the auth service implementation without modifying feature logic.

---

### 5.2 Authorization (RBAC)

**Model:** Role-Based Access Control enforced server-side on every API endpoint.

**Role codes and capabilities:**

| Role | Code | Key Capabilities |
|------|------|-----------------|
| Engagement Acceptance Lead | AL | Create/submit requests; Gate A1 approve/decline; view dashboards; export |
| Engagement Manager | EM | Edit engagement metadata; manage team/milestones; planning record; Draft product; Gate P4 approve |
| Analyst | AN | Upload evidence; link evidence to objectives; create findings; index statements |
| QA Reviewer | QA | Gate P2 approve/return; Gate P3 approve; update objective status; draft comments |
| Independent Referencer | IR | Perform reference checks; set reference status |
| Publishing Coordinator | PC | Gate P4 approve (always Ready for Issuance path) |
| Read-Only Stakeholder | RO | View dashboards, engagement list, and details; no edits |
| Admin | AD | All actions; user/role management; audit log export |

**Enforcement layers:**

1. **Navigation layer (frontend):** Navigation items are filtered by role client-side. Routes not visible to a role are hidden.
2. **API middleware layer (backend):** Every endpoint is decorated with an RBAC guard specifying allowed roles. Requests from roles not in the allowed list return `HTTP 403 FORBIDDEN` before reaching the controller.
3. **Service layer (backend):** Business logic validates role-specific prerequisites (e.g., only the last approved gate decision counts; only the approver's role is checked at gate submission).

**Engagement-level scoping:**
- Users may only view or edit engagements they are authorized to access.
- Access is determined by team membership (`team_assignments` table) or Admin role.
- AL and AD see all engagements. All other roles see only engagements they are assigned to (unless configured otherwise by Admin).
- Enforcement is applied at the Repository layer via a scoping predicate on all engagement queries.

**Restricted evidence access:**
- Evidence items with `sensitivity = restricted` are filtered out of list responses for AL and RO users.
- Download requests for restricted files check both team membership and role before issuing the download URL.
- Restricted evidence access is audited: `EVIDENCE_FILE_DOWNLOADED` events are always written.

---

### 5.3 Gate Authorization Matrix

| Gate | Approve | Decline | Return |
|------|---------|---------|--------|
| A1 | AL | AL | — |
| P2 | QA | — | QA |
| P3 | QA | — | — |
| P4 | EM, PC, AD | — | — |

Gate decisions create immutable `gate_decisions` rows. The current gate state is always the most recent decision for that `gate_type` on the engagement.

---

### 5.4 Data Protection

**Transport security:**
- All application traffic must use HTTPS/TLS.
- TLS is terminated at the reverse proxy (nginx or cloud load balancer).
- The application container runs on HTTP internally within the container network.
- HTTP-only clients are redirected to HTTPS by the reverse proxy.

**Encryption at rest:**
- Database: PostgreSQL storage encryption is handled at the deployment environment level (encrypted EBS, managed database with encryption-at-rest enabled).
- File storage: S3-compatible storage must have server-side encryption (SSE) enabled. For local development, filesystem-level encryption is recommended but not enforced.
- Passwords: Stored as bcrypt hashes only — never in plaintext.

**File access control:**
- Files are not publicly accessible by direct URL (no public bucket ACLs).
- File downloads are always served through the API after an RBAC + sensitivity check.
- The API generates a signed URL (S3) or streams the file with session authentication (local storage).
- File paths include `engagement_id` and `evidence_id` to prevent enumeration.

**Data integrity:**
- Gate decisions and audit events cannot be updated or deleted at the application layer (enforced in the Repository layer; service layer will throw if an UPDATE/DELETE is attempted on these tables).
- Soft deletes are used for entities where history must be preserved.
- Before/after snapshots are stored in `audit_events.before_snapshot` and `after_snapshot` (JSONB) for important state changes.

---

### 5.5 Audit Logging

All audit events are written to the `audit_events` table. Events are immutable, timestamped, and include actor, action, affected object, and a human-readable summary.

**Mandatory audit events:**

| Event Code | Trigger |
|-----------|---------|
| `USER_LOGIN` | Successful login |
| `USER_LOGIN_FAILED` | Failed login attempt |
| `USER_ACCOUNT_LOCKED` | Account locked after repeated failures |
| `USER_ROLE_ASSIGNED` | Admin assigns role to user |
| `USER_ROLE_REMOVED` | Admin removes role from user |
| `REQUEST_CREATED` | Request draft created |
| `REQUEST_UPDATED` | Request edited |
| `REQUEST_SUBMITTED` | Request submitted for A1 |
| `REQUEST_DOCUMENT_UPLOADED` | Intake document uploaded |
| `GATE_A1_APPROVED` | A1 gate approved |
| `GATE_A1_DECLINED` | A1 gate declined |
| `ENGAGEMENT_UPDATED` | Engagement metadata edited |
| `TEAM_MEMBER_ASSIGNED` | Team member added |
| `TEAM_MEMBER_REMOVED` | Team member removed |
| `MILESTONES_UPDATED` | Milestone dates changed |
| `PLANNING_RECORD_CREATED` | Planning record created |
| `PLANNING_RECORD_UPDATED` | Planning record edited |
| `PLANNING_SUBMITTED_FOR_REVIEW` | Planning submitted for P2 |
| `PLANNING_RECORD_REVISED` | Post-P2 revision made |
| `GATE_P2_APPROVED` | P2 gate approved |
| `GATE_P2_RETURNED` | P2 gate returned |
| `EVIDENCE_ITEM_CREATED` | Evidence item created |
| `EVIDENCE_ITEM_UPDATED` | Evidence item updated |
| `EVIDENCE_ITEM_DELETED` | Evidence item soft-deleted |
| `EVIDENCE_FILE_UPLOADED` | Evidence file uploaded |
| `EVIDENCE_FILE_DOWNLOADED` | Evidence file downloaded |
| `EVIDENCE_RESTRICTED` | Evidence sensitivity changed to restricted |
| `EVIDENCE_OBJECTIVE_LINKED` | Evidence linked to objective |
| `EVIDENCE_OBJECTIVE_UNLINKED` | Evidence unlinked from objective |
| `EVIDENCE_CSV_EXPORTED` | Evidence registry exported to CSV |
| `FINDING_CREATED` | Finding created |
| `FINDING_EVIDENCE_LINKED` | Finding linked to evidence |
| `OBJECTIVE_STATUS_UPDATED` | Objective evidence status updated |
| `GATE_P3_APPROVED` | P3 gate approved |
| `DRAFT_PRODUCT_CREATED` | Draft product created |
| `DRAFT_PRODUCT_UPDATED` | Draft product updated |
| `DRAFT_FILE_ATTACHED` | Draft file attached |
| `DRAFT_FILE_DOWNLOADED` | Draft file downloaded |
| `DRAFT_STATUS_CHANGED` | Draft status advanced |
| `DRAFT_COMMENT_ADDED` | Review comment added |
| `STATEMENT_CREATED` | Draft statement created |
| `STATEMENT_EVIDENCE_LINKED` | Statement linked to evidence |
| `REFERENCE_CHECK_ASSIGNED` | Statement assigned to IR |
| `REFERENCE_STATUS_CHANGED` | Reference status updated |
| `REFERENCE_FAILED_DISCREPANCY` | Reference check failed with discrepancy |
| `REFERENCE_CHECK_WAIVED` | Reference check waived |
| `GATE_P4_APPROVED` | P4 gate approved |
| `ENGAGEMENT_CLOSED` | Engagement closed |
| `ENGAGEMENT_REGISTER_EXPORTED` | Engagement register exported to CSV |
| `AUDIT_LOG_EXPORTED` | Audit log exported (Admin) |

**Audit event access:**
- All roles assigned to an engagement may view its audit trail.
- Admin may view all audit trails and export audit logs to CSV.
- Audit events are displayed in reverse chronological order with filters for action type and date range.

---

### 5.6 Security Monitoring

The following events are specifically monitored/flagged:

| Monitor | Mechanism |
|---------|-----------|
| Repeated failed logins | `login_attempts` table; triggers lockout after 5 failures in 15 min |
| CSV exports | `audit_events`: `ENGAGEMENT_REGISTER_EXPORTED`, `EVIDENCE_CSV_EXPORTED` |
| Restricted file downloads | `audit_events`: `EVIDENCE_FILE_DOWNLOADED` (always written, regardless of sensitivity) |
| Admin role changes | `audit_events`: `USER_ROLE_ASSIGNED`, `USER_ROLE_REMOVED` |
| Audit log exports | `audit_events`: `AUDIT_LOG_EXPORTED` |

**Environment isolation:**
- Development, test, and production environments are separated.
- Production environment variables (`DATABASE_URL`, `SESSION_SECRET`, storage credentials) are not shared with development.
- Development uses a local PostgreSQL instance and local file storage with no connection to production data.

---

## 6. Technology Stack

### 6.1 Stack Summary

| Layer | Technology | Version | Purpose | Rationale |
|-------|-----------|---------|---------|-----------|
| **Frontend framework** | React | 18.x | SPA web UI | PRD-specified; mature ecosystem; excellent TypeScript support |
| **Frontend build tool** | Vite | 5.x | Dev server + production build | Fast HMR in development; minimal config |
| **Frontend router** | React Router | 6.x | Client-side routing | De-facto standard for React SPAs |
| **Frontend state** | React Query (TanStack Query) | 5.x | Server state management, caching | Simplifies async data fetching, loading states, and cache invalidation without Redux overhead |
| **Frontend styling** | Tailwind CSS | 3.x | Utility-first CSS | Fast to build; consistent spacing and typography without custom CSS overhead |
| **Frontend component kit** | Headless UI / Radix UI | Latest | Accessible UI primitives | Pre-built accessible modals, dropdowns, and dialogs |
| **Frontend language** | TypeScript | 5.x | Type safety | Catches API shape mismatches at compile time |
| **Backend runtime** | Node.js | 20 LTS | Server runtime | Large ecosystem; native async/await; JSON handling |
| **Backend framework** | Express.js | 4.x | HTTP routing + middleware | Minimal, flexible; well-understood patterns |
| **Backend language** | TypeScript | 5.x | Type safety | Shared type definitions possible between frontend and backend |
| **ORM / query builder** | Knex.js | 3.x | SQL query builder + migrations | Type-safe queries without the overhead of a full ORM; supports raw SQL for complex aggregates |
| **Database** | PostgreSQL | 15+ | Primary relational datastore | JSONB for audit snapshots; `gen_random_uuid()`; ACID guarantees; standard backup tooling |
| **File storage (dev)** | Local filesystem | — | File persistence in development | `./data/files/` directory mounted as Docker volume |
| **File storage (prod)** | S3-compatible object storage | — | File persistence in production | AWS S3, MinIO, or equivalent; configured via env vars |
| **Authentication** | bcrypt + session tokens | — | Password hashing + session management | bcrypt cost ≥ 12; sessions stored in PostgreSQL `sessions` table |
| **Password hashing** | bcryptjs | 2.x | bcrypt implementation for Node.js | Pure JS; no native binding; easy to install in Docker |
| **HTTP client (frontend)** | Axios | 1.x | API calls from React | Interceptors for auth token injection and 401 handling |
| **Validation (backend)** | Zod | 3.x | Request body validation | Schema-first validation with TypeScript inference |
| **Testing (backend)** | Jest + Supertest | Latest | Unit + integration tests | Standard Node.js testing stack |
| **Testing (frontend)** | Vitest + Testing Library | Latest | Component + integration tests | Vite-native test runner |
| **Container runtime** | Docker + docker-compose | Latest | Local dev + production container | Consistent environment; docker-compose for dev orchestration |
| **Reverse proxy** | nginx | 1.25+ | TLS termination + static file serving | Terminates HTTPS; serves React SPA static assets |
| **Linting / formatting** | ESLint + Prettier | Latest | Code quality | Consistent style across frontend and backend |
| **CSV generation** | Built-in (stream to response) | — | CSV export | No third-party library required; standard string generation |

---

### 6.2 Key Dependency Rationale

**Why React Query over Redux?**  
The EMS data model is server-authoritative. React Query handles server state (fetching, caching, background refresh, optimistic updates) without needing a client-side store. Redux would add boilerplate for no benefit in this use case.

**Why Knex over Prisma/TypeORM?**  
The FRD provides precise DDL with custom CHECK constraints, sequences, and JSONB columns. Knex gives direct control over the SQL without ORM magic obscuring the query plan. Complex dashboard aggregate queries are written as raw SQL via `knex.raw()` for clarity and performance.

**Why Express over Fastify/Hono?**  
Familiarity and ecosystem maturity. Express middleware patterns (auth, RBAC, logging) are well-understood and have a large community. The EMS API volume does not require Fastify's throughput optimizations.

**Why PostgreSQL over MySQL/SQLite?**  
- `JSONB` for `before_snapshot`/`after_snapshot` in audit events.
- `gen_random_uuid()` native in PostgreSQL 13+.
- `TIMESTAMPTZ` (timezone-aware timestamps) for correct UTC storage.
- PostgreSQL 15 recommended for improved performance and `MERGE` support.
- SQLite is excluded: concurrent write access from multiple containers requires a proper server-side database.

---

### 6.3 File Storage Configuration

| Environment | Backend | Configuration |
|------------|---------|---------------|
| Local development | `local` | Files stored at `./data/files/`; Docker volume mount |
| Production | `s3_compatible` | AWS S3, MinIO, Azure Blob (S3-compatible API), or GCS |

Storage abstraction interface:
```typescript
interface IStorageProvider {
  put(path: string, data: Buffer, mimeType: string): Promise<string>; // returns file_ref
  get(fileRef: string): Promise<{ stream: NodeJS.ReadableStream; mimeType: string }>;
  delete(fileRef: string): Promise<void>;
  exists(fileRef: string): Promise<boolean>;
}
```

---

### 6.4 Environment Variables

| Variable | Required | Default | Purpose |
|----------|---------|---------|---------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (`postgres://user:pass@host:5432/db`) |
| `SESSION_SECRET` | Yes | — | HMAC secret for session token signing |
| `STORAGE_BACKEND` | Yes | `local` | `local` or `s3_compatible` |
| `STORAGE_BUCKET` | Prod only | — | S3 bucket name |
| `STORAGE_BASE_PATH` | Yes (local) | `./data/files` | Base path for local file storage |
| `STORAGE_ENDPOINT` | S3 only | — | S3-compatible endpoint URL |
| `STORAGE_ACCESS_KEY_ID` | S3 only | — | S3 access key |
| `STORAGE_SECRET_ACCESS_KEY` | S3 only | — | S3 secret key |
| `MAX_LOGIN_ATTEMPTS` | No | `5` | Failed login threshold before lockout |
| `LOCKOUT_DURATION_MINUTES` | No | `15` | Account lockout duration |
| `SESSION_EXPIRY_HOURS` | No | `8` | Session token lifetime |
| `PORT` | No | `3000` | Backend HTTP listen port |
| `NODE_ENV` | No | `development` | `development`, `test`, `production` |
| `CORS_ORIGIN` | Prod | — | Allowed CORS origin (frontend URL) |
| `LOG_LEVEL` | No | `info` | Log verbosity: `debug`, `info`, `warn`, `error` |

---

## 7. Integration Points

### 7.1 File Storage

**Purpose:** Persist intake documents (F02), evidence files (F08), and draft product attachments (F11).

**v1 integration type:** Abstracted storage layer configurable at startup via `STORAGE_BACKEND` environment variable.

| Mode | Backend | When Used |
|------|---------|-----------|
| `local` | Local filesystem at `./data/files/` | Local development; docker-compose volume mount |
| `s3_compatible` | AWS S3, MinIO, Azure Blob, GCS (S3-compatible API) | Production deployment |

**Storage path conventions:**

| Use Case | Path |
|----------|------|
| Intake document | `requests/{request_id}/{original_filename}` |
| Evidence file | `evidence/{engagement_id}/{evidence_id}/{original_filename}` |
| Draft attachment | `draft/{engagement_id}/{draft_id}/{original_filename}` |

**Contract:**

| Operation | Trigger | Behavior |
|-----------|---------|---------|
| Upload | POST to file endpoint | System writes file to storage path; records `file_ref` and `file_name` in database |
| Download | GET file endpoint | System checks RBAC + sensitivity; returns signed/authenticated URL or streams file content |
| Delete | Soft-delete flow | Physical delete is deferred; scheduled cleanup process removes orphaned files |

**Security requirements:**
- Files must not be publicly accessible via direct URL (no public bucket ACLs).
- Access must be granted only through the API after RBAC and sensitivity checks.
- S3 production bucket must have server-side encryption (SSE) enabled.
- Restricted evidence files receive an additional sensitivity check before the download URL is issued.

---

### 7.2 Authentication Provider

**v1:** Built-in username/password authentication.

**Contract:**
- Passwords hashed with bcrypt, cost factor ≥ 12.
- Sessions stored in the `sessions` table; expiry configurable (default 8 hours).
- Login attempts tracked in `login_attempts`; lockout after 5 failures in 15 minutes.
- Lockout duration configurable via `LOCKOUT_DURATION_MINUTES`.

**Future provision:** Auth module uses an `IAuthProvider` interface. Post-MVP, an OIDC/SAML provider can be plugged in by implementing the interface without changing feature logic. The `sessions` table and token mechanism are designed to be replaceable.

---

### 7.3 CSV Export

**Purpose:** Engagement register export (F14) and evidence registry export (F09).

**Integration type:** Server-generated CSV streaming (no external library or system required).

**Contract:**
- Server generates CSV in memory from a database query and streams the response.
- Triggered by `Accept: text/csv` header or `?format=csv` query parameter on the relevant GET endpoint.
- Response headers: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="{type}_{engagement_id}_{date}.csv"`.

**Engagement register columns:**
```
Engagement ID, Title, Phase, Status, Owner, Risk Level, Portfolio, Due Date,
A1 Status, P2 Status, P3 Status, P4 Status,
Planning Approval Date, Evidence Readiness Date, Final Readiness Date, Created Date
```

**Evidence registry columns:**
```
Evidence ID, Evidence Type, Source, Date Received, Custodian, Description,
Sensitivity, Linked Objectives, Files Attached, Uploaded By, Created Date
```

**Access control:** Restricted evidence items are excluded from the evidence CSV for AL and RO users. IR users do not have export permissions for the engagement register.

---

### 7.4 PostgreSQL Database

**Purpose:** Primary data store for all EMS entities.

**Version:** PostgreSQL 15+ (required for `gen_random_uuid()` and JSONB support).

**Connection:** Configurable via `DATABASE_URL` environment variable.

**Connection pooling:** Knex.js connection pool (min 2, max 10 connections by default; configurable).

**Backup:** Standard `pg_dump` tooling or cloud snapshot. Backup schedule is the responsibility of the deployment operator. Restore must be tested before production deployment.

**Migration strategy:** Knex.js migration files in `src/db/migrations/`. Migrations run automatically at startup in development; must be applied manually (or via CI) in production before container restart.

---

### 7.5 HTTPS / TLS

**Requirement:** All application traffic must use HTTPS/TLS.

**Implementation:**
- TLS is terminated at the reverse proxy (nginx or cloud load balancer).
- The application container runs on HTTP internally within the container network.
- Reverse proxy configuration must enforce HTTPS and redirect HTTP requests.

```
Internet → nginx (TLS termination, HTTPS) → backend container (HTTP, internal)
                                           → frontend static assets (HTTP, internal)
```

---

### 7.6 Container Deployment

**Local development (docker-compose):**

```yaml
# docker-compose.yml (simplified)
services:
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    environment:
      - VITE_API_URL=http://localhost:3000

  app:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgres://ems:ems@db:5432/ems
      - SESSION_SECRET=dev-secret-change-in-prod
      - STORAGE_BACKEND=local
      - STORAGE_BASE_PATH=/data/files
    volumes:
      - ./data/files:/data/files
    depends_on: [db]

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=ems
      - POSTGRES_PASSWORD=ems
      - POSTGRES_DB=ems
    ports: ["5432:5432"]
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

**Production deployment:**
- All services containerized; orchestrated via Kubernetes, ECS, or equivalent.
- Frontend served as static assets via nginx (not a Node.js server).
- Backend container is stateless; scales horizontally if needed.
- Database and file storage are the only stateful services.
- Secrets managed via environment variables injected at runtime (not baked into images).

---

### 7.7 Deferred and Out-of-Scope Integrations

| Integration | Status | Reason |
|------------|--------|--------|
| Email / push notifications | Deferred post-MVP | Audit events provision for a future notification module |
| OIDC / SAML identity provider | Deferred post-MVP | Built-in auth sufficient for v1; auth module designed for future substitution |
| External records management system | Out of scope v1 | Full records management not required |
| Advanced analytics / BI tool | Out of scope v1 | CSV export sufficient for v1 reporting needs |
| External publication / workflow system | Out of scope v1 | Gate P4 is the terminal point for this version |
| Recommendation tracking system | Out of scope v1 | — |

---

## 8. Non-Functional Requirements Summary

| Category | Requirement | Implementation Approach |
|----------|-------------|------------------------|
| **Page load time** | ≤ 3 seconds | React Query caching; paginated list endpoints; indexed queries |
| **API response time** | ≤ 500ms for standard operations | Connection pooling; indexed FK columns; dashboard aggregates computed server-side |
| **Availability** | 99% during business hours | Single-tenant containerized deployment; database backup/restore; health check endpoint |
| **Scalability** | ≥100 engagements, ≥500 evidence items, ≥50 users | Standard PostgreSQL indexes; pagination; stateless API containers |
| **Accessibility** | WCAG-aligned form labels, keyboard nav, readable contrast | Headless UI / Radix UI components; Tailwind accessible color tokens |
| **Data integrity** | Gate decisions and audit events must not be deleted/overwritten | Application-layer immutability enforcement in Repository; no DELETE routes on these tables |
| **Search** | Engagement ID, title, requester, owner, status | Full-text `ILIKE` queries (or `pg_trgm` index for larger datasets); indexed columns |
| **Export** | Engagement register and evidence registry to CSV | Server-streaming CSV with `Content-Disposition: attachment` |
| **Backup and restore** | Standard tooling | `pg_dump`/`pg_restore`; S3 bucket versioning for files |
| **HTTPS** | All traffic encrypted in transit | TLS at reverse proxy; HTTP-to-HTTPS redirect |
| **Encryption at rest** | Database and file storage | Encrypted EBS / managed database; S3 SSE |

---

*Document assembled from chunks: 00-overview, 01-components, 02-data-model, 03-api, 04-security, 05-tech-stack, 06-integrations*  
*Source: PRD-EMS.md v1.0, FRD-EMS.md v1.0*  
*Generated: 2026-06-04*
