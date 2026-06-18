---
phase: 04-engagement-setup-and-gate-p2
plan: GAP-03
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/components/engagements/TeamPanel.tsx
  - frontend/src/components/engagements/MilestoneTable.tsx
  - frontend/src/App.tsx
  - backend/migrations/002_core_tables.ts
autonomous: true
gap_closure: true

features:
  implements: ["F5"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "Clicking Save Milestones with an API error shows a destructive toast (not blank screen)"
    - "Invalid date order shows a validation error message in MilestoneTable"
    - "Uncaught React render errors show a fallback UI instead of blank screen"
    - "MilestoneTable rows render without React key warnings"
    - "DB CHECK constraint allows 'overdue' as a valid milestone status"
  artifacts:
    - path: "frontend/src/components/engagements/TeamPanel.tsx"
      provides: "handleSaveMilestones wrapped in try/catch with destructive toast on error"
    - path: "frontend/src/components/engagements/MilestoneTable.tsx"
      provides: "handleSave has catch block surfacing error to UI; Fragment has key prop"
    - path: "frontend/src/App.tsx"
      provides: "ErrorBoundary wrapping tab panel content"
    - path: "backend/migrations/002_core_tables.ts"
      provides: "milestone status CHECK constraint includes 'overdue'"
  key_links:
    - from: "MilestoneTable.handleSave"
      to: "TeamPanel.handleSaveMilestones"
      via: "onSave prop — both must catch errors to prevent unhandled rejection"
    - from: "ErrorBoundary"
      to: "EngagementShellPage tab panels"
      via: "wraps TabsContent children in AppRoutes"

integration_contracts:
  requires: []
  provides:
    - artifact: "frontend/src/components/engagements/TeamPanel.tsx"
      exports: ["TeamPanel"]
      shape: "handleSaveMilestones has try/catch with toast on error"
      verify: "grep -n 'try' frontend/src/components/engagements/TeamPanel.tsx && grep -n 'catch' frontend/src/components/engagements/TeamPanel.tsx && echo CONTRACT_OK"
    - artifact: "frontend/src/App.tsx"
      exports: ["ErrorBoundary"]
      shape: "React class component with componentDidCatch, renders fallback on error"
      verify: "grep -n 'ErrorBoundary' frontend/src/App.tsx && echo CONTRACT_OK"
---

<objective>
Fix milestone save blank screen: add error handling at every layer (MilestoneTable, TeamPanel, ErrorBoundary) and fix the DB CHECK constraint to allow 'overdue'.

Purpose: When `upsertMilestones()` throws any API error, the unhandled exception propagates through try/finally-only handlers and with no ErrorBoundary, React unmounts the entire tree → blank screen. This plan adds try/catch at both handler levels, adds an ErrorBoundary as last-resort safety net, fixes the React Fragment key warning, and adds 'overdue' to the DB CHECK constraint.
Output: Milestone save errors surface as toast notifications; the page stays visible; the DB constraint matches the service's type definition.
</objective>

<feature_dependencies>
Implements: F5: Team Assignments — Milestones
Depends on: None
Enables: None (fix only)
</feature_dependencies>

<execution_context>
@.planning/phases/04-engagement-setup-and-gate-p2/04-05-SUMMARY.md
</execution_context>

<context>
@.planning/PROJECT.md
@frontend/src/components/engagements/TeamPanel.tsx
@frontend/src/components/engagements/MilestoneTable.tsx
@frontend/src/App.tsx
@backend/migrations/002_core_tables.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add try/catch error handling to TeamPanel, MilestoneTable, and ErrorBoundary to App</name>
  <files>
frontend/src/components/engagements/TeamPanel.tsx
frontend/src/components/engagements/MilestoneTable.tsx
frontend/src/App.tsx
  </files>
  <action>
**TeamPanel.tsx — wrap handleSaveMilestones in try/catch (lines 109-115)**

Current code (no catch):
```typescript
async function handleSaveMilestones(
  updates: Array<{ milestone_type: string; target_date: string }>,
) {
  const result = await upsertMilestones(engagementId, updates);
  setMilestones(result.milestones);
  toast({ title: 'Milestones saved.' });
}
```

Replace with:
```typescript
async function handleSaveMilestones(
  updates: Array<{ milestone_type: string; target_date: string }>,
) {
  try {
    const result = await upsertMilestones(engagementId, updates);
    setMilestones(result.milestones);
    toast({ title: 'Milestones saved.' });
  } catch (err: unknown) {
    const e = err as { message?: string };
    toast({
      title: 'Failed to save milestones',
      description: e.message ?? 'An error occurred. Please try again.',
      variant: 'destructive',
    });
  }
}
```

**MilestoneTable.tsx — add catch block to handleSave (lines 84-98) and fix Fragment key**

Current code:
```typescript
async function handleSave() {
  if (!validateDateOrder()) return;

  const updates = MILESTONE_ORDER.filter((type) => dates[type]).map((type) => ({
    milestone_type: type,
    target_date: dates[type]!.toISOString().split('T')[0],
  }));

  setSaving(true);
  try {
    await onSave(updates);
  } finally {
    setSaving(false);
  }
}
```

Replace with:
```typescript
async function handleSave() {
  if (!validateDateOrder()) return;

  const updates = MILESTONE_ORDER.filter((type) => dates[type]).map((type) => ({
    milestone_type: type,
    target_date: dates[type]!.toISOString().split('T')[0],
  }));

  setSaving(true);
  try {
    await onSave(updates);
  } catch (err: unknown) {
    const e = err as { message?: string };
    // Surface error via the date errors state so it's visible inline
    setDateErrors({ _save: e.message ?? 'Failed to save milestones. Please try again.' } as Record<string, string>);
  } finally {
    setSaving(false);
  }
}
```

Also fix the React Fragment missing key warning in the `return` JSX (lines ~122-178). The outer `<>...</>` Fragment in the `MILESTONE_ORDER.map()` does not have a key. Replace `<>` with `<React.Fragment key={type}>`:

```tsx
// At the top of the file, ensure React is imported:
import React, { useState } from 'react';

// In the map:
return (
  <React.Fragment key={type}>
    <TableRow className="h-12">
      {/* ... row content unchanged ... */}
    </TableRow>
    {dateErrors[type] && (
      <TableRow key={`${type}-error`}>
        <TableCell colSpan={3} className="py-0 pb-2">
          <p className="text-xs text-destructive">{dateErrors[type]}</p>
        </TableCell>
      </TableRow>
    )}
  </React.Fragment>
);
```

Also add a general save error display below the table (before the Save button), showing `dateErrors['_save']` if present:
```tsx
{dateErrors['_save'] && (
  <p className="text-xs text-destructive">{dateErrors['_save']}</p>
)}
```

**App.tsx — add ErrorBoundary class component before AppRoutes**

Add the ErrorBoundary class BEFORE the `AppRoutes` function. Also wrap the `<AppShell />` route element's children (the tab content area) with `<ErrorBoundary>`. Since EngagementShellPage is accessed through the main shell route, the most practical placement is wrapping the entire authenticated shell content.

Add this class component definition before `function AppRoutes()`:

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md px-6">
            <p className="text-xl font-semibold text-foreground">Something went wrong.</p>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Add `import React from 'react';` at the top of App.tsx (currently it imports from 'react-router-dom' but React class components need the React import).

Wrap the authenticated content in the Route element's children with ErrorBoundary:

```tsx
<Route
  element={
    <ProtectedRoute>
      <ErrorBoundary>
        <AppShell />
      </ErrorBoundary>
    </ProtectedRoute>
  }
>
```

This ensures any uncaught render error inside the authenticated shell shows the fallback UI instead of a blank screen.
  </action>
  <verify>
grep -n "try" frontend/src/components/engagements/TeamPanel.tsx | grep -i "save\|milestone" && echo "TEAMPANEL_TRY_OK"
grep -n "catch" frontend/src/components/engagements/TeamPanel.tsx && echo "TEAMPANEL_CATCH_OK"
grep -n "catch" frontend/src/components/engagements/MilestoneTable.tsx && echo "MILESTONE_CATCH_OK"
grep -n "React.Fragment" frontend/src/components/engagements/MilestoneTable.tsx && echo "FRAGMENT_KEY_OK"
grep -n "ErrorBoundary" frontend/src/App.tsx && echo "ERROR_BOUNDARY_OK"
  </verify>
  <done>
- TeamPanel.handleSaveMilestones has try/catch showing destructive toast on error
- MilestoneTable.handleSave has catch block surfacing error inline
- MilestoneTable map uses React.Fragment with key prop (no key warning)
- ErrorBoundary class exists in App.tsx and wraps authenticated shell
- App builds without TypeScript errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Add 'overdue' to milestone status CHECK constraint migration</name>
  <files>backend/migrations/002_core_tables.ts</files>
  <action>
The `team.service.ts` `MilestoneStatus` type includes `'overdue'` (line 13) and `computeMilestoneStatus()` returns `'overdue'` for past-due milestones (line 70). However, the DB CHECK constraint in `002_core_tables.ts` does NOT include `'overdue'`:

```
table.check("status IN ('not_started','on_track','at_risk','complete')");
```

This means writing a milestone with a computed `overdue` status will violate the constraint if the status column is ever written with that value. While `upsertMilestones` writes `'not_started'` and status is computed on read, the mismatch is a latent bug.

Find the milestones table definition in `002_core_tables.ts` and update the CHECK constraint to include `'overdue'`:

**Current** (approximate line 69):
```typescript
table.check("status IN ('not_started','on_track','at_risk','complete')");
```

**Replace with:**
```typescript
table.check("status IN ('not_started','on_track','at_risk','overdue','complete')");
```

This makes the DB schema consistent with the TypeScript type definition and the service logic.

**Note:** This is a migration file change. Since the migration has already run in any existing environment, this fix is defensive — it ensures the constraint in source matches intent. In development environments doing a fresh `knex migrate:latest`, the correct constraint will be applied. In already-migrated environments, no manual `ALTER TABLE` is needed since the service writes only `'not_started'` to the column (status is computed on read).
  </action>
  <verify>
grep -n "overdue" backend/migrations/002_core_tables.ts && echo "OVERDUE_IN_CONSTRAINT_OK"
  </verify>
  <done>
- Migration 002_core_tables.ts CHECK constraint includes 'overdue' in the allowed status values
- The constraint matches the TypeScript MilestoneStatus type definition
  </done>
</task>

</tasks>

<verification>
1. Navigate to an engagement → Team tab
2. Set milestone dates and click "Save Milestones"
3. Confirm milestones save successfully and page does NOT go blank
4. Test error path: if API fails (e.g., disconnect backend), confirm a destructive toast appears (not blank screen)
5. Open browser console and confirm no React "missing key" warnings for MilestoneTable rows
6. TypeScript build: `cd frontend && npm run build` — no errors
</verification>

<success_criteria>
- Setting valid milestone dates saves successfully with "Milestones saved." toast
- API errors during milestone save show a destructive toast; page stays visible
- No blank screen on any milestone interaction error
- No "Each child in a list should have a unique key" React warnings for MilestoneTable
- ErrorBoundary renders fallback UI if a render-time exception occurs in the shell
- DB migration source correctly lists 'overdue' in CHECK constraint
</success_criteria>

<output>
After completion, create `.planning/phases/04-engagement-setup-and-gate-p2/04-GAP-03-SUMMARY.md`
</output>
