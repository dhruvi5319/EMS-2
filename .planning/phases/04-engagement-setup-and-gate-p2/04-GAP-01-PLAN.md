---
phase: 04-engagement-setup-and-gate-p2
plan: GAP-01
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/src/services/engagements.service.ts
  - frontend/src/components/engagements/GateStatusCard.tsx
  - frontend/src/components/engagements/GateStatusCardRow.tsx
autonomous: true
gap_closure: true

features:
  implements: ["F4"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "Approved A1/P2/P3/P4 gates show emerald left border and 'Approved' badge"
    - "Returned gates show amber left border"
    - "Gates correctly report locked/unlocked based on prior gate approval"
  artifacts:
    - path: "backend/src/services/engagements.service.ts"
      provides: "toGateDecisionRecord translates passed→approved, failed→declined"
    - path: "frontend/src/components/engagements/GateStatusCard.tsx"
      provides: "Color map handles 'passed' as approved"
    - path: "frontend/src/components/engagements/GateStatusCardRow.tsx"
      provides: "isGateLocked handles 'passed' as approved"
  key_links:
    - from: "backend/src/services/engagements.service.ts"
      to: "frontend/src/components/engagements/GateStatusCard.tsx"
      via: "decision field: 'passed' must translate to 'approved' before reaching color map"

integration_contracts:
  requires: []
  provides:
    - artifact: "backend/src/services/engagements.service.ts"
      exports: ["toGateDecisionRecord"]
      shape: "decision field maps 'passed'→'approved', 'failed'→'declined'"
      verify: "grep -n \"decision: row.status\" backend/src/services/engagements.service.ts | head -1 && echo CONTRACT_OK"
---

<objective>
Fix gate status cards showing no color border for approved gates.

Purpose: The DB stores gate approval as `status='passed'`, but the frontend color map only checks `'approved'`. The translation must happen in the backend service so the contract is uniform.
Output: All gate cards correctly show emerald/amber/red/yellow borders based on their actual DB status.
</objective>

<feature_dependencies>
Implements: F4: Engagement Shell — Gate Status Cards
Depends on: None
Enables: None (fix only — no new features)
</feature_dependencies>

<execution_context>
@.planning/phases/04-engagement-setup-and-gate-p2/04-04-SUMMARY.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@backend/src/services/engagements.service.ts
@frontend/src/components/engagements/GateStatusCard.tsx
@frontend/src/components/engagements/GateStatusCardRow.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Translate DB status vocabulary in toGateDecisionRecord()</name>
  <files>backend/src/services/engagements.service.ts</files>
  <action>
In `toGateDecisionRecord()` (lines 53-72), the `decision` field is set to `row.status as string` which passes the DB value (`'passed'`, `'failed'`, `'returned'`) directly to consumers.

Translate the DB vocabulary to the UI vocabulary in the return statement:

```typescript
// Translate DB status → UI decision vocabulary
const STATUS_MAP: Record<string, string> = {
  passed: 'approved',
  failed: 'declined',
  returned: 'returned',
};

return {
  id: row.id as string,
  gate_name: row.gate_type as string,
  decision: STATUS_MAP[row.status as string] ?? (row.status as string),
  risk_level,
  rationale: row.rationale as string | null,
  decided_by: row.decided_by as string | null,
  decided_at: row.decided_at instanceof Date ? (row.decided_at as Date).toISOString() : (row.decided_at as string),
};
```

Place `STATUS_MAP` as a module-level const above `toGateDecisionRecord`. This ensures all downstream consumers (GateStatusCard, GateStatusCardRow, EngagementShellPage's p2Approved check) receive normalized vocabulary.
  </action>
  <verify>
grep -n "STATUS_MAP" backend/src/services/engagements.service.ts && grep -n "passed.*approved\|approved.*passed" backend/src/services/engagements.service.ts && echo "TRANSLATION_OK"
  </verify>
  <done>toGateDecisionRecord() returns `decision: 'approved'` when DB status is `'passed'`, and `decision: 'declined'` when DB status is `'failed'`.</done>
</task>

<task type="auto">
  <name>Task 2: Add 'passed' fallback to GateStatusCard color map and GateStatusCardRow lock check</name>
  <files>
frontend/src/components/engagements/GateStatusCard.tsx
frontend/src/components/engagements/GateStatusCardRow.tsx
  </files>
  <action>
**GateStatusCard.tsx** — defensive fallback in `getOutcomeStyle()`:

The primary fix is in the backend (Task 1). As defense-in-depth, add `'passed'` to the approved branch so old cached data or direct API calls still render correctly:

```typescript
// Line 45 — extend approved check:
if (d === 'approved' || d === 'approve' || d === 'passed') {
```

**GateStatusCardRow.tsx** — extend `isGateLocked()` approved check:

The `p2Approved` check in `EngagementShellPage` (line 294-298) already handles `'approved'`/`'approve'` but does NOT handle `'passed'`. After Task 1's backend fix this is moot, but also harden `GateStatusCardRow.isGateLocked()`:

```typescript
// Line 24 — extend approved check:
return d !== 'approved' && d !== 'approve' && d !== 'passed';
```

These are belt-and-suspenders guards. The canonical fix is the backend translation in Task 1.
  </action>
  <verify>
grep -n "passed" frontend/src/components/engagements/GateStatusCard.tsx && grep -n "passed" frontend/src/components/engagements/GateStatusCardRow.tsx && echo "FRONTEND_GUARD_OK"
  </verify>
  <done>GateStatusCard color map treats 'passed' as approved (emerald border). GateStatusCardRow.isGateLocked() treats 'passed' as not-locked.</done>
</task>

</tasks>

<verification>
1. Restart backend: `cd backend && npm run dev` — no TypeScript errors
2. Navigate to an engagement with an approved A1 gate
3. Confirm A1 gate card shows emerald left border (`border-l-emerald-500`) and "Approved" badge
4. Confirm subsequent gate cards (P2, P3, P4) correctly show locked/not-started state based on their own decisions
</verification>

<success_criteria>
- Gate cards with DB `status='passed'` display emerald left border and "Approved" label
- Gate cards with DB `status='failed'` display red left border and "Declined" label  
- Gate cards with DB `status='returned'` display amber left border and "Returned" label
- Unapproved prior gate correctly locks subsequent gate (isGateLocked works with translated values)
</success_criteria>

<output>
After completion, create `.planning/phases/04-engagement-setup-and-gate-p2/04-GAP-01-SUMMARY.md`
</output>
