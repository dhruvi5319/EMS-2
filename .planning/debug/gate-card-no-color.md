# Debug Session: Gate A1 Card — No Emerald Border

**Bug:** Approved A1 gate card shows no color border on `/engagements/:id`

---

## Root Cause

The `gate_decisions` database table stores the approval outcome in a column named **`status`** (values: `'pending'`, `'passed'`, `'failed'`, `'returned'`). When the A1 gate is approved, the value written to the DB is `'passed'`.

The backend service `toGateDecisionRecord()` in `engagements.service.ts` maps the DB row to the API response shape, but it maps `row.status` directly to the `decision` field:

```ts
// engagements.service.ts:66
decision: row.status as string,
```

So the API response for an approved A1 gate_decision is:
```json
{ "gate_name": "A1", "decision": "passed", ... }
```

In `GateStatusCard.tsx`, the `getOutcomeStyle()` function checks `decision.decision?.toLowerCase()` against:
- `'approved'` or `'approve'` → emerald border
- `'returned'` or `'return'` or `'return_for_revision'` → amber border
- `'declined'` or `'decline'` → red border
- `'pending'` or `'ready_for_review'` → yellow border

**`'passed'` is not in any branch.** It falls through all conditionals and hits the default fallback:
```ts
// GateStatusCard.tsx:87-94
return {
  border: 'border-l-4 border-l-slate-300',  // ← slate, not emerald
  bg: 'bg-white',
  ...
  label: decision.decision ?? 'Not Started',  // shows "passed" as label
  ...
};
```

This is why the A1 card shows no colored border — it renders with the default slate/white "unknown" style instead of the emerald "Approved" style.

---

## Evidence Summary

1. **DB schema** (`migrations/002_core_tables.ts:229`): `gate_decisions.status` is constrained to `'pending' | 'passed' | 'failed' | 'returned'`.

2. **A1 approval write** (`gate.service.ts:143`): When A1 is approved, the row is inserted with `status: 'passed'`.

3. **API mapping** (`engagements.service.ts:66`): `toGateDecisionRecord()` maps `row.status → decision`, so the API returns `decision: "passed"` for an approved A1 gate.

4. **Color mapping** (`GateStatusCard.tsx:45`): Only checks `d === 'approved' || d === 'approve'` for emerald. `'passed'` is never matched.

5. **Fallback** (`GateStatusCard.tsx:87-94`): Unrecognized decision values fall through to a slate border with no semantic color.

---

## Files Involved

| File | What's wrong |
|------|-------------|
| `backend/src/services/engagements.service.ts:66` | Maps DB `status` column directly to `decision` field — passes raw `"passed"` to the frontend instead of translating it to `"approved"` |
| `frontend/src/components/engagements/GateStatusCard.tsx:45` | Color mapping only handles `"approved"/"approve"`, not the `"passed"` value that the API actually sends |

---

## Suggested Fix Direction

**Option A (fix in backend):** In `toGateDecisionRecord()`, translate the DB `status` value to the semantic decision vocabulary the frontend expects:
```ts
// e.g., map 'passed' → 'approved', 'failed' → 'declined', 'returned' → 'returned'
decision: row.status === 'passed' ? 'approved' : row.status === 'failed' ? 'declined' : row.status as string,
```

**Option B (fix in frontend):** Add `'passed'` as a recognized value in the `getOutcomeStyle()` check:
```ts
if (d === 'approved' || d === 'approve' || d === 'passed') { ... emerald ... }
```

Option A is the cleaner fix — it normalizes the data at the API boundary so all consumers get consistent vocabulary.
