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

