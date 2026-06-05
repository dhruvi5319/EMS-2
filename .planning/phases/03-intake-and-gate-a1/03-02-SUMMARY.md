---
phase: 03-intake-and-gate-a1
plan: "02"
subsystem: api
tags: [gate, engagement, audit-events, knex, transaction, rbac, express, typescript]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "DB migrations (002_core_tables: gate_decisions, engagements, audit_events, requests tables), db singleton, authenticateSession + requireRole middleware"
  - phase: 03-intake-and-gate-a1
    provides: "requestsRouter from plan 03-01 (requests table, request.status=submitted precondition)"
provides:
  - "recordA1Decision service: validates inputs, updates request status, creates GateDecision (approve), creates Engagement shell with ENG-YYYY-NNNNN job code (approve), writes GATE_A1_APPROVED/DECLINED audit event"
  - "POST /api/requests/:id/gate/a1 — requires AL/AD role + authenticateSession"
  - "gateRouter registered in routes/index.ts alongside requestsRouter"
affects: ["03-03", "03-04", "03-05", "04-01"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Atomic DB transaction: all writes (request status, gate_decision, engagement, audit_event) in single db.transaction()"
    - "Job code generation: COUNT existing engagements + 1 within transaction for sequence, formatted as ENG-{YYYY}-{5-digit-seq}"
    - "Schema-adapted error objects: throw Object.assign(new Error(), { status, fields }) pattern for route error handling"
    - "RBAC: requireRole('AL', 'AD') applied per-route via factory middleware from Phase 1"

key-files:
  created:
    - backend/src/services/gate.service.ts
    - backend/src/routes/gate.ts
  modified:
    - backend/src/routes/index.ts

key-decisions:
  - "gate_decisions.engagement_id is NOT NULL in actual DB schema — decline path cannot store a gate_decisions row; decline returns synthetic GateDecision object built from audit event data"
  - "No engagement_number serial column in DB — job code sequence derived from COUNT(engagements)+1 within transaction"
  - "audit_events schema uses object_type/object_id/after_state JSONB (not entity_type/metadata) — plan code adapted to actual column names"
  - "gateRouter mounted at /requests in apiRouter so full path resolves to /api/requests/:id/gate/a1 via /:id/gate/a1 in gateRouter"
  - "engagement.created_by set to actorId (AL who approved), owner_id set to request.created_by (original requester)"

patterns-established:
  - "Gate service pattern: validate inputs → check preconditions → atomic transaction → return API-shaped response"
  - "Dual-mount pattern: requestsRouter + gateRouter both mounted at /requests — Express matches most specific route handler first"

# Metrics
duration: 2min
completed: 2026-06-05
---

# Phase 3 Plan 02: Gate A1 Decision Backend Summary

**Atomic Gate A1 service with engagement shell auto-creation (ENG-YYYY-NNNNN job code), immutable gate decisions, and dual audit trail (GATE_A1_APPROVED/DECLINED events) adapted to actual DB schema constraints**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-05T20:39:55Z
- **Completed:** 2026-06-05T20:42:19Z
- **Tasks:** 2 completed
- **Files modified:** 3

## Accomplishments

- `recordA1Decision` service with full input validation (decision required; approved: risk_level + rationale ≥10 chars; declined: rationale ≥10 chars), 422/409/404 error handling
- Atomic DB transaction: request status update → engagement creation → gate_decision record (approve) → audit_event — all or nothing
- Job code format `ENG-{YYYY}-{5-digit-seq}` generated via COUNT(engagements)+1 within transaction
- POST `/api/requests/:id/gate/a1` route with `authenticateSession` + `requireRole('AL', 'AD')`
- Both `requestsRouter` and `gateRouter` registered in `routes/index.ts`

## Task Commits

Each task was committed atomically:

1. **Task 1: Gate A1 service with atomic transaction + engagement auto-create** - `065b8ba` (feat)
2. **Task 2: Gate A1 router + register in routes/index.ts** - `bdaef9c` (feat)

**Plan metadata:** (pending — see final commit)

## Files Created/Modified

- `backend/src/services/gate.service.ts` — `recordA1Decision` with validation, atomic transaction, engagement shell, gate_decision (approve path), audit events
- `backend/src/routes/gate.ts` — `gateRouter` with POST /:id/gate/a1, authenticateSession, requireRole(AL, AD), error handling (422/409/404/500)
- `backend/src/routes/index.ts` — Added `gateRouter` import and `apiRouter.use('/requests', gateRouter)` registration

## Decisions Made

- **gate_decisions schema constraint**: The actual DB schema has `engagement_id NOT NULL` in `gate_decisions` — impossible to store a gate decision row for a declined request (no engagement created). Decline path returns a synthetic `GateDecision` object matching the API contract shape, built from audit event data. The API consumer receives the same response shape either way.
- **No engagement_number serial**: The DB migration has no `engagement_number` auto-increment column (plan's assumption). Job code sequence uses `COUNT(engagements)+1` within the transaction instead.
- **Audit events column mapping**: Plan code used `entity_type`, `entity_id`, `metadata`, `actor_roles` columns — actual schema uses `object_type`, `object_id`, `after_state` JSONB. Metadata stored in `after_state` JSON.
- **Dual-mount pattern**: Both `requestsRouter` and `gateRouter` mounted at `/requests` — Express routes to the first matching handler; the gate route path `/:id/gate/a1` won't conflict with requests routes since they have different path patterns.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Adapted to actual gate_decisions schema (engagement_id NOT NULL)**
- **Found during:** Task 1 (service implementation)
- **Issue:** Plan code used `request_id`, `gate_name`, `decision`, `risk_level` columns on `gate_decisions` table. Actual schema has `engagement_id` (NOT NULL FK), `gate_type`, `status` with CHECK constraint `('pending','passed','failed','returned')`. For decline path, engagement_id NOT NULL makes storing a gate_decision row impossible.
- **Fix:** Approve path stores real `gate_decisions` row with engagement_id. Decline path returns synthetic GateDecision built from audit event; API contract response shape is identical for consumers.
- **Files modified:** backend/src/services/gate.service.ts
- **Verification:** TypeScript compiles, all route verification checks pass
- **Committed in:** 065b8ba (Task 1 commit)

**2. [Rule 1 - Bug] No engagement_number serial column — used COUNT-based sequence**
- **Found during:** Task 1 (job code generation)
- **Issue:** Plan assumes `engagements.engagement_number` auto-increment column. Actual DB schema has no such column; `job_code` is NOT NULL UNIQUE but generated externally.
- **Fix:** Count existing engagements within transaction and use `COUNT+1` as sequence number for job code.
- **Files modified:** backend/src/services/gate.service.ts
- **Verification:** formatJobCode() verified to produce ENG-{YYYY}-{NNNNN} format
- **Committed in:** 065b8ba (Task 1 commit)

**3. [Rule 1 - Bug] Adapted audit_events column names to actual schema**
- **Found during:** Task 1 (audit event insertion)
- **Issue:** Plan code used `actor_roles`, `entity_type`, `entity_id`, `metadata` columns. Actual schema has `object_type`, `object_id`, `after_state` (JSONB), no `actor_roles` or `metadata` columns.
- **Fix:** Mapped `entity_type`→`object_type`, `entity_id`→`object_id`; stored actor_roles and metadata in `after_state` JSONB.
- **Files modified:** backend/src/services/gate.service.ts
- **Verification:** TypeScript compiles, insert structure matches actual schema
- **Committed in:** 065b8ba (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (all Rule 1 - Bug: schema mismatch adaptations)
**Impact on plan:** All fixes necessary to work with actual DB schema. API contract response shape is identical to plan spec — consumers are unaffected. No scope creep.

## Issues Encountered

- Plan 03-01 had already executed before 03-02, so `routes/index.ts` already had `requestsRouter` imported and registered. The plan says 03-02 "owns" the canonical index.ts — merged both without conflict by adding `gateRouter` to the existing file structure.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Gate A1 decision endpoint fully functional; Phase 4 (Engagement Setup) can depend on engagement shells being created here
- `POST /api/requests/:id/gate/a1` ready for integration testing
- Engagement shell created with `phase='planning'`, `status='active'`, `job_code=ENG-{YYYY}-{seq}` — Phase 4 can extend this shell

## Self-Check: PASSED

All 3 key files verified on disk. Both task commits (065b8ba, bdaef9c) confirmed in git log.

---
*Phase: 03-intake-and-gate-a1*
*Completed: 2026-06-05*
