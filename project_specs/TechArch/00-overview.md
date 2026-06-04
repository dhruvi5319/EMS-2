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

