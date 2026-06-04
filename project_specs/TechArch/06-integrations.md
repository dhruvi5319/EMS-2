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
