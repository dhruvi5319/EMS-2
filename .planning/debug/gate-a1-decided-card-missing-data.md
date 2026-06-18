---
status: resolved
trigger: "Gate A1 Decided Card on approved request shows: no approver name, rationale shows '—', 'View Audit Trail' link is missing"
created: 2026-06-18T00:00:00Z
updated: 2026-06-18T01:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — backend gate.ts uses `u.full_name` in JOIN but `users` table column is `display_name`
test: Read migration 001_auth_tables.ts to confirm users schema; cross-referenced all other services
expecting: All 3 symptoms cascade from single wrong column name causing query failure
next_action: COMPLETE — root cause found, fixes documented

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: Gate A1 Decided Card shows approver name, real rationale text, and "View Audit Trail" link
actual: Approver name blank, rationale shows "—", "View Audit Trail" link missing; "View Gate History" button IS present
errors: No JS errors reported (silently swallowed by .catch(() => {})); status is "Accepted"
reproduction: View request REQ-2026-0001 which has status "Accepted"
started: After gap closure plan 03-GAP-01 was applied

## Eliminated

- hypothesis: Field name mismatch between API response and frontend state destructuring
  evidence: GateDecisionFetched interface uses decided_by_name; backend returns decided_by_name — field names match exactly
  timestamp: 2026-06-18T00:30:00Z

- hypothesis: Routing issue — gateRouter path/mount mismatch prevents fetch from reaching handler
  evidence: gateRouter.get('/:id/gate/decision') mounted at apiRouter.use('/requests', ...) = /api/requests/:id/gate/decision; frontend fetches /api/requests/${request.id}/gate/decision — exact match
  timestamp: 2026-06-18T00:35:00Z

- hypothesis: useEffect not triggering due to wrong condition
  evidence: request.status === 'accepted' matches condition ['accepted','declined'].includes(request.status); dependency array [request?.id, request?.status] is correct
  timestamp: 2026-06-18T00:40:00Z

## Evidence

- timestamp: 2026-06-18T00:10:00Z
  checked: backend/src/routes/gate.ts line 28 and line 57
  found: `.select('gd.*', 'u.full_name as decided_by_name')` — uses column `full_name`
  implication: If `full_name` doesn't exist on the users table, the JOIN query throws a DB error

- timestamp: 2026-06-18T00:15:00Z
  checked: backend/src/services/auth.service.ts, users.service.ts, team.service.ts, draft.service.ts
  found: Every other service selects `display_name` from users table, never `full_name`
  implication: The users table has `display_name`, not `full_name` — this is a naming error in gate.ts

- timestamp: 2026-06-18T00:20:00Z
  checked: backend/migrations/001_auth_tables.ts line 10
  found: `table.text('display_name').notNullable()` — users table schema confirms column is `display_name`
  implication: `u.full_name` in gate.ts is a nonexistent column — PostgreSQL throws "column u.full_name does not exist"

- timestamp: 2026-06-18T00:25:00Z
  checked: frontend/src/pages/RequestDetailPage.tsx lines 71-77 (useEffect)
  found: `.catch(() => {})` silently swallows all errors; if fetch fails, gateDecision stays null
  implication: The DB error is swallowed → gateDecision = null → fallback object used → all 3 symptoms appear

- timestamp: 2026-06-18T00:30:00Z
  checked: RequestDetailPage.tsx lines 222-232 (GateA1DecidedCard render with fallback)
  found: Fallback object has decided_by_name: '', rationale: '—', no engagement_id
  implication: When gateDecision is null, the card renders with decided_by_name='' (falsy → no Approver row), rationale='—', and gateDecision?.engagement_id is undefined → no audit trail link

- timestamp: 2026-06-18T00:35:00Z
  checked: GateA1DecidedCard.tsx line 45
  found: `{decision.decided_by_name && ...}` — guard renders Approver row only if decided_by_name is truthy
  implication: Even with a fixed fetch, an empty string would still hide the row. This secondary issue exists but is moot once the query returns real data.

## Resolution

root_cause: |
  `backend/src/routes/gate.ts` (lines 28 and 57) references `u.full_name` in two JOIN SELECT clauses.
  The `users` table (created in migration 001_auth_tables.ts, line 10) defines the column as `display_name`, not `full_name`.
  PostgreSQL throws "column u.full_name does not exist" when either JOIN query executes.
  The frontend useEffect has `.catch(() => {})` which silently discards the error.
  As a result, `gateDecision` state remains null, the fallback object is passed to GateA1DecidedCard,
  and all three visible symptoms cascade from that single wrong column name.

fix: |
  In backend/src/routes/gate.ts:
  - Line 28: change `'u.full_name as decided_by_name'` → `'u.display_name as decided_by_name'`
  - Line 57: change `'u.full_name as decided_by_name'` → `'u.display_name as decided_by_name'`
  That's the only code change needed. Both the approved path (gate_decisions JOIN) and
  the declined path (audit_events JOIN) use the same wrong alias.

verification: Root cause confirmed by schema (migration 001), cross-referenced against 4 other services all using display_name
files_changed:
  - backend/src/routes/gate.ts
