---
phase: 03-intake-and-gate-a1
plan: "01"
subsystem: api
tags: [express, multer, knex, typescript, storage, rbac, file-upload]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "authenticateSession and requireRole middleware, db singleton, requests table from migration 002"
provides:
  - "StorageProvider interface: save/get/delete/getUrl contract"
  - "LocalStorageProvider: UUID-named files saved to uploads/ directory"
  - "uploadMiddleware: multer memory storage, 25MB limit, MIME type filtering"
  - "handleUploadErrors: converts MulterError/INVALID_FILE_TYPE to JSON 422 responses"
  - "requests.service.ts: listRequests/createRequest/getRequest/updateRequest/submitRequest/uploadIntakeDocument/deleteIntakeDocument"
  - "requestsRouter: GET/POST/PATCH /api/requests + POST /:id/submit + POST/DELETE /:id/intake-document"
  - "Static file serving for uploads/ via express.static"
affects: ["03-02", "03-03", "03-04"]

# Tech tracking
tech-stack:
  added: [multer, "@types/multer"]
  patterns:
    - "StorageProvider interface abstraction: swap local→S3 without changing service layer"
    - "Multer memory storage: file buffer passed directly to StorageProvider.save()"
    - "Object.assign(new Error(), { status, fields }): typed error objects for route error handling"
    - "REQ-YYYY-NNNNN display ID formatted at application layer from integer request_number column"

key-files:
  created:
    - backend/src/storage/storage.provider.ts
    - backend/src/storage/local.storage.ts
    - backend/src/middleware/upload.ts
    - backend/src/services/requests.service.ts
    - backend/src/routes/requests.ts
  modified:
    - backend/src/routes/index.ts
    - backend/src/index.ts

key-decisions:
  - "Multer memory storage (not disk): buffer passes directly to StorageProvider.save() — avoids temp file cleanup complexity"
  - "LocalStorageProvider singleton exported from local.storage.ts — single instance shared across service calls"
  - "MIME type filtering in multer fileFilter (not after) — rejects before reading file contents"
  - "Submit validation returns 422 with fields array — frontend can highlight specific missing fields"
  - "updateRequest enforces draft-only: 409 if status != draft — prevents edits to submitted requests"

patterns-established:
  - "StorageProvider abstraction: interface in storage.provider.ts, implementation in local.storage.ts — swap implementations without changing service layer"
  - "Route error pattern: Object.assign(new Error(msg), { status, fields }) — typed error propagation from service to route handler"

# Metrics
duration: 2min
completed: 2026-06-05
---

# Phase 3 Plan 01: Request Intake API Summary

**Full Request CRUD backend with multer upload middleware, LocalStorageProvider (UUID-named files in uploads/), submit validation (422+fields array), and file replacement on re-upload — all registered under /api/requests**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-05T20:39:16Z
- **Completed:** 2026-06-05T20:41:53Z
- **Tasks:** 2 completed
- **Files modified:** 7 (5 created, 2 modified)

## Accomplishments

- StorageProvider interface + LocalStorageProvider: UUID-named files saved to `uploads/` with ENOENT-safe delete
- multer upload middleware: memory storage, 25MB limit (422 on exceed), MIME type allowlist (422 on reject), JSON error wrapper
- Full request service: listRequests (status/requester/limit/offset filters), createRequest (Draft), updateRequest (Draft-only, 409 otherwise), submitRequest (validates 5 required fields → 422+fields array), uploadIntakeDocument (replaces existing file), deleteIntakeDocument
- requestsRouter: 7 endpoints wired to service, RBAC applied (AL/AD on write routes)
- routes/index.ts updated to register `/requests` route
- `uploads/` served as static files for local dev

## Task Commits

Each task was committed atomically:

1. **Task 1: StorageProvider interface, LocalStorageProvider, multer upload middleware** - `8f3fd4f` (feat)
2. **Task 2: Request CRUD service, router, routes/index registration** - `3e43725` (feat)

**Plan metadata:** (pending — see final commit)

## Files Created/Modified

- `backend/src/storage/storage.provider.ts` — StorageProvider interface with save/get/delete/getUrl
- `backend/src/storage/local.storage.ts` — LocalStorageProvider: UUID filenames, ENOENT-safe delete, singleton export
- `backend/src/middleware/upload.ts` — uploadMiddleware (multer single 'file', 25MB, MIME allowlist) + handleUploadErrors
- `backend/src/services/requests.service.ts` — Full CRUD service with submit validation and file replacement logic
- `backend/src/routes/requests.ts` — requestsRouter with 7 endpoints, authenticateSession, requireRole RBAC
- `backend/src/routes/index.ts` — Added requestsRouter import and `/requests` registration
- `backend/src/index.ts` — Added path import + express.static for uploads/ directory

## Decisions Made

- **Multer memory storage**: buffer passes directly to StorageProvider.save() — avoids temp file cleanup complexity
- **LocalStorageProvider singleton**: single instance shared across service calls — stateless between requests
- **MIME filtering in multer fileFilter**: rejects before reading file contents — more efficient than post-read validation
- **422 with fields array on submit**: frontend can highlight specific missing fields (request_type, requester_name, topic, agency_program, due_date)
- **updateRequest enforces draft-only**: 409 status if status ≠ draft — prevents edits to submitted/accepted/declined requests

## Deviations from Plan

None - plan executed exactly as written.

Note: Pre-existing TypeScript error in `backend/src/db/index.ts` (rootDir issue with knexfile.ts location) was present before this plan and is unrelated to changes made here. No new TypeScript errors introduced.

## Issues Encountered

None. The API endpoints cannot be verified against a live database in the execution environment (no running PostgreSQL), but TypeScript compiles cleanly (no new errors) and all contract verifications pass statically. Runtime verification is deferred to the verifier phase.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Request CRUD API complete; Plan 03-02 (Gate A1 backend) can now query submitted requests
- Plan 03-03 (Request intake UI) can wire to POST /api/requests and POST /api/requests/:id/submit
- Plan 03-04 (Request detail UI) can wire to GET /api/requests/:id
- All F2 API contracts implemented per TechArch spec
- File upload infrastructure ready for Plans 03-03/03-04

## Self-Check: PASSED

All 6 key files verified on disk. Both task commits (8f3fd4f, 3e43725) confirmed in git log.

---
*Phase: 03-intake-and-gate-a1*
*Completed: 2026-06-05*
