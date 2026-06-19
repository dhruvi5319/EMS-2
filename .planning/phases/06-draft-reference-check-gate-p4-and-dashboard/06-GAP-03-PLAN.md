---
phase: 06-draft-reference-check-gate-p4-and-dashboard
plan: GAP-03
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/src/services/statements.service.ts
autonomous: true
gap_closure: true

features:
  implements: ["F12", "F13"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "Waiver sets ref_status='waived' with mandatory discrepancy_notes (justification); service enforces this"
    - "Waiver is restricted to EM/AD roles; AN and IR cannot set ref_status='waived'"
  artifacts:
    - path: "backend/src/services/statements.service.ts"
      provides: "updateStatement enforces EM/AD for waiver + mandatory discrepancy_notes for waived status"
      contains: "waived"
  key_links:
    - from: "statements.service.ts updateStatement"
      to: "DB draft_statements.ref_status"
      via: "role check + discrepancy_notes validation before DB write"
      pattern: "waived.*EM.*AD|EM.*AD.*waived"

integration_contracts:
  requires: []
  provides:
    - artifact: "backend/src/services/statements.service.ts"
      exports: ["updateStatement"]
      shape: "updateStatement enforces: (1) ref_status='waived' only allowed for EM/AD roles; (2) discrepancy_notes required when ref_status='waived'"
      verify: "grep -n 'waived' backend/src/services/statements.service.ts | grep -i 'EM\\|AD\\|role\\|notes' && echo CONTRACT_OK"
---

<objective>
Fix the remaining VERIFICATION.md gap 2: waiver completeness in `statements.service.ts`.

**Background:** The VERIFICATION.md identified that `ref_status='waived'` was blocked by two issues:
1. DB check constraint missing 'waived' → **already fixed** by migration `010_statement_waived.ts`
2. Service `validStatuses` excluding 'waived' → **already fixed** (service now includes 'waived')

**Remaining gaps:**
- **No EM/AD role restriction for waiver.** The PATCH route allows AN/EM/IR/AD to call `updateStatement`, but `ref_status='waived'` should only be settable by EM or AD (per F13: "explicitly waived" is an EM/AD management action, not an IR decision). Currently AN and IR can set `ref_status='waived'` via the API.
- **No mandatory discrepancy_notes for waiver.** The service validates that `failed` status requires `discrepancy_notes`, but `waived` has no such requirement. The verification spec requires a justification string when waiving.
- **Stale comment** on line 254 says "waived is not in DB schema — plan spec was aspirational" — this is now incorrect (migration 010 adds 'waived') and should be updated.

**Fix:** In `updateStatement`, after checking `data.ref_status === 'failed'`, add an equivalent block for `data.ref_status === 'waived'` that:
1. Checks `userRoles.includes('EM') || userRoles.includes('AD')` — throws 403 if neither
2. Checks that `discrepancy_notes` (interpreted as justification text) is non-empty — throws 422 if missing

Purpose: Close the last VERIFICATION.md gap so the waiver feature is correctly restricted and validated end-to-end.

Output: Updated `statements.service.ts` with EM/AD role guard and mandatory notes for waiver.
</objective>

<feature_dependencies>
Implements: F12: Reference check waiver restricted to EM/AD with mandatory justification, F13: P4 prerequisites treat waived statements as non-blocking (waiver must be valid to count)
Depends on: None (fixes to existing Phase 6 code)
Enables: None (UAT re-test of waiver flow — Test 5 dependents)
</feature_dependencies>

<execution_context>
@/app/workspaces/.pivota-home/opencode-xdg/opencode/pivota_spec-framework/workflows/execute-plan.md
@/app/workspaces/.pivota-home/opencode-xdg/opencode/pivota_spec-framework/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/06-draft-reference-check-gate-p4-and-dashboard/06-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add waiver role guard and mandatory notes validation to updateStatement</name>
  <files>backend/src/services/statements.service.ts</files>
  <action>
In `backend/src/services/statements.service.ts`, find the `updateStatement` function (line ~224). Inside the `if (data.ref_status !== undefined)` block (line ~244), after the existing `if (data.ref_status === 'failed')` block (ends around line 263), add a new validation block for `'waived'`:

**Current code (around line 253-263):**
```typescript
    // Waiver pattern: 'failed' requires discrepancy_notes
    // (waived is not in DB schema — plan spec was aspirational)
    if (data.ref_status === 'failed') {
      const notes = data.discrepancy_notes ?? (existing.discrepancy_notes as string | null);
      if (!notes || notes.trim().length === 0) {
        throw Object.assign(
          new Error('Discrepancy notes are required when reference status is Failed.'),
          { status: 422 }
        );
      }
    }
```

**Replace with (update comment + add waiver block):**
```typescript
    // 'failed' requires discrepancy_notes (documenting the discrepancy found by IR)
    if (data.ref_status === 'failed') {
      const notes = data.discrepancy_notes ?? (existing.discrepancy_notes as string | null);
      if (!notes || notes.trim().length === 0) {
        throw Object.assign(
          new Error('Discrepancy notes are required when reference status is Failed.'),
          { status: 422 }
        );
      }
    }

    // 'waived' is restricted to EM/AD (management decision, not an IR action)
    // and requires a justification string in discrepancy_notes
    if (data.ref_status === 'waived') {
      const canWaive = userRoles.includes('EM') || userRoles.includes('AD');
      if (!canWaive) {
        throw Object.assign(
          new Error('Only Engagement Managers or Administrators can waive a reference check.'),
          { status: 403 }
        );
      }
      const justification = data.discrepancy_notes ?? (existing.discrepancy_notes as string | null);
      if (!justification || justification.trim().length === 0) {
        throw Object.assign(
          new Error('A justification (discrepancy_notes) is required when waiving a reference check.'),
          { status: 422 }
        );
      }
    }
```

**Why:** The `userRoles` parameter is already passed into `updateStatement` (it receives `req.user!.roles` from the route handler at line 85 of `statements.ts`). No signature change needed. The DB migration 010 already allows 'waived' at the database level — this guard ensures the application layer enforces the business rule.

Also update the stale comment at line 352 (which says "no 'waived' in DB schema") to:
```typescript
  // Block delete if ref_status is 'passed' or 'waived' (waived statements are
  // management decisions and should be un-waived before deletion)
```

Or if that line says something like `// Block delete if ref_status is 'passed' (no 'waived' in DB schema)`, simply change it to:
```typescript
  // Block delete if ref_status is 'passed'
```
  </action>
  <verify>
```bash
# Confirm waiver role check and notes validation are present
grep -n "waived\|canWaive\|EM.*AD\|Only Engagement" backend/src/services/statements.service.ts | head -20 && echo "WAIVER GUARDS OK"

# Confirm TypeScript compiles cleanly
npx tsc --noEmit -p backend/tsconfig.json 2>&1 | grep -v "rootDir\|error TS6059" | tail -5 && echo "BACKEND TS OK"
```
  </verify>
  <done>
- `updateStatement` checks `userRoles.includes('EM') || userRoles.includes('AD')` before allowing `ref_status='waived'`; throws 403 if caller is AN or IR
- `updateStatement` checks `discrepancy_notes` is non-empty when `ref_status='waived'`; throws 422 if missing
- Stale comment "waived is not in DB schema" is removed or corrected
- TypeScript compiles (the pre-existing `rootDir` error from `src/db/index.ts` is not caused by this change and can be ignored if it was already present)
  </done>
</task>

</tasks>

<verification>
```bash
# Role guard present
grep -n "canWaive\|EM.*waiv\|waiv.*EM\|Only Engagement" backend/src/services/statements.service.ts

# Notes validation for waiver present
grep -n "justification\|waived.*discrepancy\|discrepancy.*waived" backend/src/services/statements.service.ts

# TypeScript clean (ignore pre-existing rootDir error)
npx tsc --noEmit -p backend/tsconfig.json 2>&1 | grep -v "rootDir\|error TS6059" | tail -5
```
</verification>

<success_criteria>
1. `updateStatement` blocks AN and IR from setting `ref_status='waived'` with a 403 error
2. `updateStatement` requires non-empty `discrepancy_notes` when `ref_status='waived'`, returning 422 if missing
3. EM and AD users with a justification string can successfully waive a statement (no 403 or 422)
4. Stale comment about 'waived not in DB schema' is corrected
5. TypeScript compiles without new errors (pre-existing rootDir error is unrelated)
</success_criteria>

<output>
After completion, create `.planning/phases/06-draft-reference-check-gate-p4-and-dashboard/06-GAP-03-SUMMARY.md`
</output>
