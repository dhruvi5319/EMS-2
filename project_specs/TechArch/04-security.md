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

