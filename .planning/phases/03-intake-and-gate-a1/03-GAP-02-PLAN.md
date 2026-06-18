---
phase: 03-intake-and-gate-a1
plan: GAP-02
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/src/routes/gate.ts
autonomous: true
gap_closure: true

features:
  implements: ["F3"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "GET /api/requests/:id/gate/decision returns real approver display_name for both approved and declined paths (u.display_name, not u.full_name)"
    - "Gate A1 decided card shows real approver name (not blank), real rationale (not '—'), and View Audit Trail link is visible for accepted requests"
  artifacts:
    - path: "backend/src/routes/gate.ts"
      provides: "GET /api/requests/:id/gate/decision with correct column reference"
      exports: ["GET /:id/gate/decision"]

<objective>
Fix the `u.full_name` → `u.display_name` column name mismatch in `backend/src/routes/gate.ts`.

The users table defines the column as `display_name` (migration 001_auth_tables.ts line 10). Both JOIN SELECT clauses in the gate decision endpoint used the non-existent `u.full_name` alias, causing PostgreSQL to throw "column u.full_name does not exist". The frontend `.catch(() => {})` silently swallowed the error, leaving `gateDecision` null. This cascaded into: blank approver name, rationale showing '—', and View Audit Trail link absent.

The fix changes both SELECT clauses from `'u.full_name as decided_by_name'` to `'u.display_name as decided_by_name'`. This fix was applied directly during the debug session — this plan documents and verifies the change.
</objective>

<feature_dependencies>
<depends_on>
  <plan id="03-GAP-01" reason="GET /api/requests/:id/gate/decision endpoint was introduced in GAP-01; this plan fixes a column name bug in that endpoint"/>
</depends_on>
<enables>
  <feature id="F3" description="Gate A1 decided card shows real approver data after fix"/>
</enables>
</feature_dependencies>

## Tasks

### Task 1: Verify and confirm display_name fix in gate.ts

**Context:** The bug was `u.full_name` in both JOIN SELECT clauses of `GET /:id/gate/decision`. The fix changes both to `u.display_name`. The fix was applied during the debug diagnosis session.

**Verify the fix is in place:**

```bash
grep -n "display_name\|full_name" backend/src/routes/gate.ts
```

Expected: Both SELECT clauses use `u.display_name as decided_by_name`. No `full_name` references remain.

**If full_name is still present** (fix not yet applied), make the change:

In `backend/src/routes/gate.ts`:
- Approved path (gate_decisions JOIN): change `.select('gd.*', 'u.full_name as decided_by_name')` → `.select('gd.*', 'u.display_name as decided_by_name')`
- Declined path (audit_events JOIN): change `.select('ae.*', 'u.full_name as decided_by_name')` → `.select('ae.*', 'u.display_name as decided_by_name')`

**Commit:** `fix(gate): use display_name instead of full_name in gate decision JOIN`

### Task 2: Update RETEST-UAT to reflect gap closed

Update `.planning/phases/03-intake-and-gate-a1/03-RETEST-UAT.md`:

1. Change frontmatter `status: diagnosed` → `status: complete`
2. Update Test 3 result from `issue` → `pass`
3. Update summary: `issues: 1` → `issues: 0`, `passed: 2` → `passed: 3`
4. Remove or mark the gap as `status: resolved`

**Commit:** `docs(phase-3): mark RETEST-UAT gap-02 resolved — display_name fix confirmed`

## Self-Check

```bash
# Verify no full_name references remain
grep -n "full_name" backend/src/routes/gate.ts && echo "FAIL: full_name still present" || echo "PASS: no full_name references"

# Verify display_name used in both paths
grep -c "display_name as decided_by_name" backend/src/routes/gate.ts | grep -q "^2$" && echo "PASS: both paths use display_name" || echo "FAIL: not both paths updated"

# Verify RETEST-UAT updated
grep "status:" .planning/phases/03-intake-and-gate-a1/03-RETEST-UAT.md | head -1
```

Expected:
- No `full_name` in gate.ts
- 2 occurrences of `display_name as decided_by_name`
- RETEST-UAT `status: complete`
