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

