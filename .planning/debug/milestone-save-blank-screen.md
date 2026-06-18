# Debug Session: Milestone Save → Blank Screen

**Symptom:** Screen goes blank/white after clicking "Save Milestones" in the Team tab.

**Test:** Phase 4 UAT — Test 7

---

## ROOT CAUSE

### Primary cause: Database CHECK constraint vs. computed status mismatch → backend 500 → unhandled frontend exception → React component tree crash → blank screen

There are **two compounding bugs** that together produce the blank screen.

---

## Bug 1 (Backend) — DB CHECK constraint rejects `'overdue'` status value

**File:** `backend/migrations/002_core_tables.ts:69`

```ts
table.check("status IN ('not_started','on_track','at_risk','complete')");
```

The `milestones` table CHECK constraint only allows:
`not_started`, `on_track`, `at_risk`, `complete`

**But** `computeMilestoneStatus()` in `backend/src/services/team.service.ts:55-71` can also return `'overdue'`:

```ts
function computeMilestoneStatus(...): MilestoneStatus {
  if (completed_at) return 'complete';
  if (!target_date) return 'not_started';
  ...
  if (diffDays >= 7) return 'on_track';
  if (diffDays >= 0) return 'at_risk';
  return 'overdue';   // ← NOT in DB CHECK constraint
}
```

The `upsertMilestones` function inserts with `status: 'not_started'` (hardcoded — "will be computed on read"), so the upsert itself won't fail. However, the `listMilestones` function called at the end of `upsertMilestones` calls `mapMilestone` which calls `computeMilestoneStatus`. If a milestone's target date is in the past, `computeMilestoneStatus` returns `'overdue'`, but this is only stored temporarily in memory — the DB doesn't enforce it on read. **However**, the TypeScript `MilestoneStatus` type in `frontend/src/lib/team.api.ts:18` does not include `'overdue'` either... wait, it does. Let me re-examine.

---

## Bug 1 (Revised — Backend) — `upsertMilestones` returns `'overdue'` status from `computeMilestoneStatus`, which IS a valid value in the service type but NOT in the DB schema

**File:** `backend/migrations/002_core_tables.ts:69`

```
status IN ('not_started','on_track','at_risk','complete')
```

Missing: `'overdue'`

**File:** `backend/src/services/team.service.ts:13`

```ts
export type MilestoneStatus = 'not_started' | 'on_track' | 'at_risk' | 'overdue' | 'complete';
```

`'overdue'` IS a valid service-layer status. The `computeMilestoneStatus` function correctly returns `'overdue'` for past-due milestones. The upsert correctly inserts with `status: 'not_started'` (hardcoded), but the **DB CHECK constraint is missing `'overdue'`**. If any code path tries to write `'overdue'` to the DB (e.g., if a future refactor adds computed status writes), it would fail with a DB constraint error.

---

## Bug 2 (Frontend) — `handleSaveMilestones` has NO try/catch → unhandled rejection crashes React

**File:** `frontend/src/components/engagements/TeamPanel.tsx:109-115`

```ts
async function handleSaveMilestones(
  updates: Array<{ milestone_type: string; target_date: string }>,
) {
  const result = await upsertMilestones(engagementId, updates);  // ← throws on API error
  setMilestones(result.milestones);                              // ← not reached if above throws
  toast({ title: 'Milestones saved.' });                        // ← not reached
}
```

There is **no try/catch**. If `upsertMilestones` throws (e.g., network error, 422 validation error, 500 server error), the exception propagates unhandled.

**File:** `frontend/src/components/engagements/MilestoneTable.tsx:84-98`

```ts
async function handleSave() {
  if (!validateDateOrder()) return;
  ...
  setSaving(true);
  try {
    await onSave(updates);   // ← calls handleSaveMilestones, which throws
  } finally {
    setSaving(false);        // ← finally runs, BUT no catch
  }
}
```

The `MilestoneTable.handleSave` has a `try/finally` but **no `catch`**. The exception propagates out of the button's `onClick` handler as an **unhandled Promise rejection**.

---

## Bug 3 (Frontend) — No Error Boundary anywhere in the component tree

**File:** `frontend/src/App.tsx` (entire file)
**File:** `frontend/src/pages/EngagementShellPage.tsx` (entire file)

There is **no React ErrorBoundary** wrapping `TeamPanel`, `MilestoneTable`, or anywhere in the app. Without an ErrorBoundary, an uncaught render error causes React to **unmount the entire component tree**, producing a blank/white screen.

---

## Bug 4 (Frontend) — React Fragment key missing in MilestoneTable map

**File:** `frontend/src/components/engagements/MilestoneTable.tsx:122-177`

```tsx
return (
  <>                        {/* ← Fragment has NO key prop */}
    <TableRow key={type}>   {/* ← key is on the TableRow, not the Fragment */}
    ...
    {dateErrors[type] && (
      <TableRow key={`${type}-error`}>
    )}
  </>
);
```

The `key` prop is placed on the inner `<TableRow>` rather than on the outer `<>` Fragment. This violates React's list-rendering requirements and can cause reconciliation bugs. The correct pattern is `<React.Fragment key={type}>`. While this is a separate warning, it can contribute to rendering instability.

---

## Exact Crash Path

1. User sets milestone dates and clicks "Save Milestones"
2. `MilestoneTable.handleSave()` validates date order (passes) and calls `await onSave(updates)`
3. `TeamPanel.handleSaveMilestones()` calls `await upsertMilestones(engagementId, updates)`
4. `upsertMilestones` in `team.api.ts` calls `api.put(...)` which calls `fetch(...)`
5. **If the API returns a non-200 status** (422 validation, 403 auth, 500 server error), `upsertMilestones` throws `{ status, message }`
6. The exception propagates through `handleSaveMilestones` (no catch) → propagates through `MilestoneTable.handleSave`'s `try/finally` (no catch) → becomes an **unhandled Promise rejection**
7. The unhandled rejection is not caught by any ErrorBoundary (none exist)
8. React sees an uncaught error and **unmounts the entire tree** → **blank screen**

### Most Likely Trigger in UAT Test 7

The user is likely not an EM or AD role (or the session expired), so the PUT `/api/engagements/:id/milestones` endpoint returns **403 Forbidden** from the `requireRole('EM', 'AD')` middleware. The frontend throws on `if (!res.ok) throw { status: res.status, message: res.error }`, which then propagates unhandled → blank screen.

Alternatively, if the test environment has any network or DB issue, a 500 error would produce the same result.

---

## Files Involved

| File | Issue |
|------|-------|
| `frontend/src/components/engagements/TeamPanel.tsx:109-115` | `handleSaveMilestones` has no try/catch — error from `upsertMilestones` propagates unhandled |
| `frontend/src/components/engagements/MilestoneTable.tsx:84-98` | `handleSave` has try/finally but no catch — unhandled rejection escapes onClick handler |
| `frontend/src/App.tsx` | No ErrorBoundary in the app — unhandled React errors unmount the full tree → blank screen |
| `frontend/src/pages/EngagementShellPage.tsx` | No ErrorBoundary wrapping TeamPanel |
| `frontend/src/components/engagements/MilestoneTable.tsx:122-177` | React Fragment key missing in .map() — key on inner `<TableRow>` not on `<>` |
| `backend/migrations/002_core_tables.ts:69` | DB CHECK constraint missing `'overdue'` status value (service layer can return this) |

---

## Suggested Fix Direction

1. **Immediate fix (highest priority):** Add `try/catch` in `TeamPanel.handleSaveMilestones` to catch API errors and show a toast error instead of propagating:
   ```ts
   async function handleSaveMilestones(updates) {
     try {
       const result = await upsertMilestones(engagementId, updates);
       setMilestones(result.milestones);
       toast({ title: 'Milestones saved.' });
     } catch (err) {
       const e = err as { status?: number; message?: string };
       toast({ title: 'Failed to save milestones', description: e.message ?? 'An error occurred.', variant: 'destructive' });
     }
   }
   ```

2. **Add an ErrorBoundary** wrapping the `<TabsContent value="team">` or at the App level to prevent full blank screens.

3. **Fix React Fragment key:** Change `<>` to `<React.Fragment key={type}>` in `MilestoneTable.tsx`.

4. **Fix DB schema:** Add `'overdue'` to the milestone status CHECK constraint in a migration.
