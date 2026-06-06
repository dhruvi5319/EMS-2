---
phase: 04-engagement-setup-and-gate-p2
plan: "02"
subsystem: api
tags: [team-assignments, milestones, prerequisites, gate-p2, rbac, knex]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: DB schema with team_assignments, milestones, planning_records, gate_decisions tables
  - phase: 04-engagement-setup-and-gate-p2/04-01
    provides: engagementsRouter and routes/index.ts registration pattern

provides:
  - GET /api/engagements/:id/team — list team assignments with user details
  - POST /api/engagements/:id/team — add team member with duplicate guard
  - DELETE /api/engagements/:id/team/:assignment_id — remove member with QA/EM guards
  - GET /api/engagements/:id/milestones — 4-item milestone list with computed status
  - PUT /api/engagements/:id/milestones — upsert milestones with date order validation
  - GET /api/engagements/:id/gate/p2/prerequisites — 8-item P2 prerequisite checklist

affects:
  - 04-05-PLAN (Team UI)
  - 04-07-PLAN (Gate P2 Review panel)
  - 04-03-PLAN (planning service — independence_affirmations table)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "teamRouter with mergeParams:true mounted at /api/engagements/:id"
    - "Independence affirmations table queried with try/catch fallback for Plan 04-03 cross-dependency"
    - "Milestone status computed on read (not stored), based on target_date vs today"
    - "INSERT ... ON CONFLICT MERGE via knex .onConflict().merge() for upsert"

key-files:
  created:
    - backend/src/services/team.service.ts
    - backend/src/routes/team.ts
  modified:
    - backend/src/routes/index.ts

key-decisions:
  - "teamRouter mounted in routes/index.ts at /engagements/:id (not nested in engagements.ts) — simpler, avoids re-reading engagements.ts"
  - "8 P2 prerequisites (7 core + independence_affirmations) with try/catch fallback for Plan 04-03 table dependency"
  - "Milestone status computed on read from target_date vs today — not stored — so status stays accurate without triggers"
  - "removeTeamMember checks QA guard first (P2 gate_decisions query), then EM guard (count remaining) in single transaction"

patterns-established:
  - "Sub-router pattern: Router({ mergeParams: true }) mounted at /resource/:id in routes/index.ts"
  - "Error shape: { status, code } thrown from service, caught and forwarded by route handler"
  - "Always-4-items milestone list: synthetic { id: null } rows for missing milestone types"

# Metrics
duration: 3min
completed: 2026-06-05
---

# Phase 4 Plan 02: Team, Milestones, and P2 Prerequisites API Summary

**Team CRUD + milestone status computation + 8-item P2 prerequisites checklist backend API using knex with role-protection (EM/AD) and QA/EM removal guards**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-05T21:53:25Z
- **Completed:** 2026-06-05T21:56:50Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Team assignment CRUD with role validation (7 roles: AL, EM, AN, QA, IR, PC, RO), duplicate detection (409/DUPLICATE_ASSIGNMENT), and removal guards for sole QA (before P2) and last EM (409/TEAM_ROLE_REQUIRED)
- Milestone upsert with chronological date order enforcement (422) and status computation (not_started/on_track/at_risk/overdue/complete) based on target_date vs today
- 8-item P2 prerequisites check covering: objectives, owner, EM on team, QA on team, all milestones set, risk notes, data reliability notes, and independence status (with graceful fallback if independence_affirmations table doesn't exist yet)
- teamRouter registered in routes/index.ts at `/api/engagements/:id` with mergeParams:true

## Task Commits

Each task was committed atomically:

1. **Task 1: Team + Milestone service** — `47ffcc4` (feat)
2. **Task 2: Team router + routes/index.ts** — `bf2954f` (feat)

## Files Created/Modified
- `backend/src/services/team.service.ts` — listTeam, addTeamMember, removeTeamMember, listMilestones, upsertMilestones, checkP2Prerequisites
- `backend/src/routes/team.ts` — teamRouter with all 6 endpoints, RBAC guards, error handling
- `backend/src/routes/index.ts` — Added teamRouter import and mounted at `/engagements/:id`

## Decisions Made
- teamRouter mounted in `routes/index.ts` at `/api/engagements/:id` (not as a sub-router inside `engagements.ts`) for simplicity — plan allows either approach
- 8th prerequisite (`independence_status_complete`) queries `independence_affirmations` table via try/catch — gracefully defaults to `pass: false` with detail if table doesn't exist yet (Plan 04-03)
- Milestone status computed on read from `target_date` vs today (not stored in DB) — status stays accurate without DB triggers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

Pre-existing TypeScript configuration issue: The project-wide `tsconfig.json` only includes `lib: ["ES2022"]` (no Node.js globals), causing `Cannot find module 'express'` and `Cannot find name 'console'` errors across ALL route files (gate.ts, requests.ts, users.ts, team.ts, etc.). This was pre-existing before Plan 04-02 — team.ts follows the exact same pattern as other route files and adds only 7 errors of the same type. This is a project-wide misconfiguration (out of scope per deviation rules).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 6 team/milestone/P2-prerequisites endpoints available at correct paths
- teamRouter provides the complete F5 API surface for Wave 2 plans (04-05 Team UI, 04-07 Gate P2 Review)
- `checkP2Prerequisites` will automatically work with independence_affirmations once Plan 04-03 creates the table
- Ready for Plan 04-03 (Planning Record API + independence affirmations)

---
*Phase: 04-engagement-setup-and-gate-p2*
*Completed: 2026-06-05*

## Self-Check: PASSED

- FOUND: backend/src/services/team.service.ts
- FOUND: backend/src/routes/team.ts
- FOUND: .planning/phases/04-engagement-setup-and-gate-p2/04-02-SUMMARY.md
- FOUND commit: 47ffcc4 (feat(04-02): implement team, milestone, and P2 prerequisites service)
- FOUND commit: bf2954f (feat(04-02): add team router and register at /api/engagements/:id)
