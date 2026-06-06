---
phase: 05-evidence-findings-and-gate-p3
plan: "01"
subsystem: api
tags: [evidence, file-upload, multer, sensitivity-access-control, rbac, csv-export]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: auth/RBAC middleware, DB tables (evidence_items, evidence_files, objective_evidence_links, finding_evidence_links)
  - phase: 04-engagement-setup-and-gate-p2
    provides: engagementsRouter that evidenceRouter is mounted into
provides:
  - evidenceRouter with all F8 endpoints mounted at /api/engagements/:id/evidence
  - evidence.service.ts with listEvidence, createEvidence, updateEvidence, deleteEvidence, uploadFile, deleteFile, getEvidenceFile
affects:
  - 05-02 (evidence-objective links need evidence_items)
  - 05-03 (findings need evidence_items)
  - 05-04 and beyond (UI plans consuming these endpoints)

# Tech tracking
tech-stack:
  added: [multer (memoryStorage for buffer upload)]
  patterns:
    - sensitivity-based access control via canViewRestricted() role check
    - /export route registered before /:evidence_id to prevent route capture
    - DB column mapping (evidence_id→evidence_item_id, file_ref→storage_key, filename→original_filename)

key-files:
  created:
    - backend/src/services/evidence.service.ts
    - backend/src/routes/evidence.ts
  modified:
    - backend/src/routes/engagements.ts

key-decisions:
  - "Adapted to actual DB schema: evidence_files uses evidence_id (not evidence_item_id), filename (not original_filename), file_ref (not storage_key) — mapped in toEvidenceFile()"
  - "Actual link tables are objective_evidence_links and finding_evidence_links (not evidence_objective_links) — both use evidence_id column"
  - "storageProvider.get() returns Buffer (no getStream) — download route sends buffer directly via res.send()"
  - "deleteEvidence: storage cleanup outside transaction to avoid rollback on storage error; DB changes are atomic"
  - "EvidenceFile interface preserves original field names (evidence_item_id, storage_key) as facade over actual DB columns"

patterns-established:
  - "canViewRestricted(roles): checks PRIVILEGED_ROLES set [AN,EM,QA,IR,PC,AD] — AL/RO excluded from restricted evidence"
  - "Upload validation order: MIME type → file size → file count → storage save"

# Metrics
duration: 4min
completed: 2026-06-06
---

# Phase 5 Plan 01: Evidence API (F8) Summary

**Evidence CRUD, multi-file upload (multer memoryStorage), sensitivity-based access control (AL/RO excluded from restricted), and delete-blocked-if-linked enforcement**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-06T21:33:37Z
- **Completed:** 2026-06-06T21:37:14Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Complete F8 evidence service with 7 exported functions covering full CRUD + file ops
- Sensitivity-based access control: `canViewRestricted()` excludes restricted items for AL/RO viewers
- Delete protection: 409 returned when evidence linked to objectives or findings
- File upload with multer memoryStorage: MIME validation, 50MB limit, 20-file per item cap
- CSV export endpoint with `/export` registered before `/:evidence_id` to prevent route capture
- Download route serves file buffer from StorageProvider with 403 for restricted evidence

## Task Commits

Each task was committed atomically:

1. **Task 1: Evidence service — CRUD, file upload, sensitivity access control** - `e0dcf27` (feat)
2. **Task 2: Evidence router — all F8 endpoints with RBAC, mounted in engagements.ts** - `04ab6ba` (feat)

## Files Created/Modified
- `backend/src/services/evidence.service.ts` — 7 service functions: listEvidence, createEvidence, updateEvidence, deleteEvidence, uploadFile, deleteFile, getEvidenceFile
- `backend/src/routes/evidence.ts` — evidenceRouter with 8 endpoints (list, create, update, delete, upload, delete-file, export CSV, download)
- `backend/src/routes/engagements.ts` — added evidenceRouter import + mount at `/:id/evidence`

## Decisions Made
- Adapted to actual DB schema: `evidence_files` columns differ from plan spec (`evidence_id` not `evidence_item_id`, `file_ref` not `storage_key`, `filename` not `original_filename`). Mapped in `toEvidenceFile()` mapper to preserve exported interface contract.
- Link tables are `objective_evidence_links` and `finding_evidence_links` (not the `evidence_objective_links` table in the plan spec). Both use `evidence_id` column.
- `storageProvider` has no `getStream()` method — only `get()` returning Buffer. Download route uses `res.send(buffer)` instead of stream pipe.
- Storage deletion in `deleteEvidence` occurs outside the DB transaction to prevent rollback if storage throws; DB changes remain atomic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Adapted DB schema column names from plan spec**
- **Found during:** Task 1 (evidence service implementation)
- **Issue:** Plan spec used column names `evidence_item_id`, `storage_key`, `original_filename` but actual migration 002 defines `evidence_id`, `file_ref`, `filename`. Using plan spec names would cause runtime DB errors.
- **Fix:** Used actual DB column names in all queries; added `toEvidenceFile()` mapper that translates DB columns to the exported `EvidenceFile` interface (which preserves spec names for API consumers).
- **Files modified:** backend/src/services/evidence.service.ts
- **Verification:** grep confirms correct DB column names in queries

**2. [Rule 1 - Bug] Adapted link table names from plan spec**
- **Found during:** Task 1 (deleteEvidence implementation)
- **Issue:** Plan spec referenced `evidence_objective_links` but actual migration creates `objective_evidence_links`. Also `finding_evidence_links` uses `evidence_id` (not `evidence_item_id`).
- **Fix:** Used `objective_evidence_links` and `finding_evidence_links` with correct `evidence_id` column
- **Files modified:** backend/src/services/evidence.service.ts
- **Verification:** grep confirms correct table and column names

**3. [Rule 1 - Bug] Used storageProvider.get() instead of getStream()**
- **Found during:** Task 2 (download route implementation)
- **Issue:** Plan spec showed `StorageProvider.getStream()` but `StorageProvider` interface only defines `get()` returning Buffer; no `getStream()` exists.
- **Fix:** Download route calls `storageProvider.get(storage_key)` → `res.send(buffer)` instead of stream pipe
- **Files modified:** backend/src/routes/evidence.ts
- **Verification:** LocalStorageProvider.get() signature confirmed, res.send() works for Buffer

---

**Total deviations:** 3 auto-fixed (3 Rule 1 - Bug, all schema/API contract adaptations)
**Impact on plan:** All fixes required for correct operation against actual DB schema. No scope creep — same behavior, correct column/table names.

## Issues Encountered
- Pre-existing TypeScript errors across codebase (`@types/node` missing, `lib: ["ES2022"]` without dom types) — my files have same pre-existing errors as planning.service.ts, requests.service.ts, all route files. Not introduced by this plan.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- F8 Evidence API complete: all CRUD, file upload, sensitivity access control
- Plans 05-02 (evidence-objective links), 05-03 (findings), and all UI plans can now use these endpoints
- evidenceRouter properly mounted at `/api/engagements/:id/evidence`

---
*Phase: 05-evidence-findings-and-gate-p3*
*Completed: 2026-06-06*
