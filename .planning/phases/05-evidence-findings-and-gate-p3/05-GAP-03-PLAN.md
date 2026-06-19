---
phase: 05-evidence-findings-and-gate-p3
plan: GAP-03
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/components/evidence/GapObjectiveCard.tsx
  - backend/src/routes/evidence.ts
  - backend/src/routes/objectivecoverage.ts
autonomous: true
gap_closure: true

features:
  implements: ["F9"]
  depends_on: ["F8"]
  enables: []

must_haves:
  truths:
    - "Gap cards in the evidence coverage view display the text 'P3 Blocker' (not 'Blocker')"
    - "POST /api/engagements/:id/evidence/:evidence_id/objectives returns 200 (not 404)"
    - "After linking an objective via the LinkObjectivePopover, the objective appears immediately in the Linked Objectives section without a page refresh"
  artifacts:
    - path: "frontend/src/components/evidence/GapObjectiveCard.tsx"
      provides: "Gap card with P3 Blocker visible text"
      contains: "P3 Blocker"
    - path: "backend/src/routes/evidence.ts"
      provides: "POST /:evidence_id/objectives and DELETE /:evidence_id/objectives/:objective_id handlers inside evidenceRouter"
      exports: ["evidenceRouter"]
    - path: "backend/src/routes/objectivecoverage.ts"
      provides: "GET /evidence/:evidence_id/objectives, GET /objectives/coverage, PUT /objectives/sufficiency (link/unlink routes removed)"
  key_links:
    - from: "frontend/src/components/evidence/EvidenceDetailPage.tsx"
      to: "POST /api/engagements/:id/evidence/:evidence_id/objectives"
      via: "api.post call in LinkObjectivePopover onSave handler"
      pattern: "evidence.*objectives|objectives.*evidence"
    - from: "backend/src/routes/evidence.ts"
      to: "backend/src/services/objectivecoverage.service.ts"
      via: "linkEvidenceToObjectives / unlinkEvidenceFromObjective imports"
      pattern: "linkEvidenceToObjectives|unlinkEvidenceFromObjective"

integration_contracts:
  requires: []
  provides:
    - artifact: "frontend/src/components/evidence/GapObjectiveCard.tsx"
      exports: ["GapObjectiveCard"]
      shape: "React component rendering 'P3 Blocker' visible text in XCircle span"
      verify: "grep -n 'P3 Blocker' frontend/src/components/evidence/GapObjectiveCard.tsx && echo CONTRACT_OK"
    - artifact: "backend/src/routes/evidence.ts"
      exports: ["evidenceRouter"]
      shape: "Router with POST /:evidence_id/objectives and DELETE /:evidence_id/objectives/:objective_id"
      verify: "grep -n 'evidence_id/objectives' backend/src/routes/evidence.ts && echo CONTRACT_OK"
---

<objective>
Fix two UAT failures from Phase 5 UAT (Tests 4 and 6):

1. **Gap 1 (minor):** `GapObjectiveCard` renders "Blocker" instead of "P3 Blocker" as visible text. The `aria-label` already reads "P3 Blocker" but the visible `<span>` content only shows "Blocker". One-character change.

2. **Gap 2 (major):** Linking evidence to an objective silently fails with a 404 because of a routing conflict. `evidenceRouter` is mounted at `/:id/evidence` (line 105 of engagements.ts) and `objectiveCoverageRouter` is mounted at `/:id` (line 115). A `POST` to `/api/engagements/:id/evidence/:evidence_id/objectives` is intercepted by `evidenceRouter` first (correct prefix match), but `evidenceRouter` has no matching route for `/:evidence_id/objectives` POST, so Express returns 404 before `objectiveCoverageRouter` ever sees the request.

**Fix strategy for Gap 2:** Move the link (`POST /:evidence_id/objectives`) and unlink (`DELETE /:evidence_id/objectives/:objective_id`) route handlers into `evidenceRouter`, removing them from `objectiveCoverageRouter`. The GET routes in `objectiveCoverageRouter` that do NOT start with `/evidence/` are unaffected — they match different path segments and are not intercepted by `evidenceRouter`.

Purpose: Unblocks UAT Tests 4, 6, and the dependent Test 7 (gap view update after linking).
Output: Updated `GapObjectiveCard.tsx`, `evidence.ts`, `objectivecoverage.ts`.
</objective>

<feature_dependencies>
Implements: F9: Evidence-to-objective links and coverage gap view
Depends on: F8: Evidence registry (evidence items must exist to link)
Enables: None (gap closures within phase 5 scope)
</feature_dependencies>

<execution_context>
@/app/workspaces/.pivota-home/opencode-xdg/opencode/pivota_spec-framework/workflows/execute-plan.md
@/app/workspaces/.pivota-home/opencode-xdg/opencode/pivota_spec-framework/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/05-evidence-findings-and-gate-p3/05-GAP-02-SUMMARY.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix GapObjectiveCard visible label text ("Blocker" → "P3 Blocker")</name>
  <files>frontend/src/components/evidence/GapObjectiveCard.tsx</files>
  <action>
In `frontend/src/components/evidence/GapObjectiveCard.tsx`, find the `<span>` that renders the P3 Blocker indicator (around line 94–105). It currently reads:

```tsx
<span
  className="flex items-center gap-1"
  aria-label="P3 Blocker"
  style={{
    color: 'hsl(0 72% 38%)',
    fontSize: 12,
    fontWeight: 400,
  }}
>
  <XCircle size={16} style={{ color: 'hsl(0 72% 51%)' }} />
  Blocker
</span>
```

Change the visible text node from `Blocker` to `P3 Blocker`. The `aria-label` already says "P3 Blocker" — this change makes the visible text match. No other changes to this file.

After the edit the span should read:
```tsx
<span
  className="flex items-center gap-1"
  aria-label="P3 Blocker"
  style={{
    color: 'hsl(0 72% 38%)',
    fontSize: 12,
    fontWeight: 400,
  }}
>
  <XCircle size={16} style={{ color: 'hsl(0 72% 51%)' }} />
  P3 Blocker
</span>
```
  </action>
  <verify>
grep -n 'P3 Blocker' frontend/src/components/evidence/GapObjectiveCard.tsx
# Expected: two matches — one for aria-label="P3 Blocker" and one for the visible text node
grep -c 'P3 Blocker' frontend/src/components/evidence/GapObjectiveCard.tsx
# Expected: 2
grep -n '>Blocker<' frontend/src/components/evidence/GapObjectiveCard.tsx
# Expected: no matches (old text removed)
  </verify>
  <done>
`GapObjectiveCard.tsx` contains the text "P3 Blocker" as a visible text node (not only in aria-label). The old standalone `Blocker` text node is gone. `grep -c 'P3 Blocker' frontend/src/components/evidence/GapObjectiveCard.tsx` returns 2.
  </done>
</task>

<task type="auto">
  <name>Task 2: Fix routing conflict — move link/unlink routes into evidenceRouter</name>
  <files>
    backend/src/routes/evidence.ts
    backend/src/routes/objectivecoverage.ts
  </files>
  <action>
**Root cause:** `POST /api/engagements/:id/evidence/:evidence_id/objectives` is intercepted by `evidenceRouter` (mounted at `/:id/evidence`) before reaching `objectiveCoverageRouter` (mounted at `/:id`). `evidenceRouter` has no handler for `/:evidence_id/objectives` POST, so Express returns 404.

**Fix: Move the two link/unlink route handlers from `objectivecoverage.ts` into `evidence.ts`.**

---

### Step A — Update `backend/src/routes/evidence.ts`

1. Add the following imports at the top of the file (after existing imports), importing the two service functions needed:

```typescript
import {
  linkEvidenceToObjectives,
  unlinkEvidenceFromObjective,
} from '../services/objectivecoverage.service';
```

2. Append the following two route handlers at the **end** of `evidence.ts`, after the existing `GET /:evidence_id/files/:file_id/download` handler:

```typescript
// POST /api/engagements/:id/evidence/:evidence_id/objectives — link evidence to one or more objectives
// Moved here from objectivecoverage.ts to avoid routing conflict:
// evidenceRouter is mounted at /:id/evidence and intercepts this path before objectiveCoverageRouter.
// Role access: AN, EM, AD
evidenceRouter.post(
  '/:evidence_id/objectives',
  requireRole('AN', 'EM', 'AD'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { objective_ids } = req.body;
      if (!Array.isArray(objective_ids) || objective_ids.length === 0) {
        res.status(422).json({ error: 'objective_ids must be a non-empty array.' });
        return;
      }
      const result = await linkEvidenceToObjectives(
        req.params.id,
        req.params.evidence_id,
        objective_ids,
        req.user!.id
      );
      res.json(result);
    } catch (err: unknown) {
      handleError(err, res, 'POST /evidence/:evidence_id/objectives');
    }
  }
);

// DELETE /api/engagements/:id/evidence/:evidence_id/objectives/:objective_id — unlink evidence from an objective
// Moved here from objectivecoverage.ts for the same routing conflict reason.
// Role access: AN, EM, AD
evidenceRouter.delete(
  '/:evidence_id/objectives/:objective_id',
  requireRole('AN', 'EM', 'AD'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await unlinkEvidenceFromObjective(
        req.params.id,
        req.params.evidence_id,
        req.params.objective_id
      );
      res.json(result);
    } catch (err: unknown) {
      handleError(err, res, 'DELETE /evidence/:evidence_id/objectives/:objective_id');
    }
  }
);
```

---

### Step B — Update `backend/src/routes/objectivecoverage.ts`

Remove the two route handlers that were moved to `evidence.ts`:

1. Remove the `POST /evidence/:evidence_id/objectives` handler (lines 39–69 of the current file):
   - The block starting with `// POST /evidence/:evidence_id/objectives — link evidence to one or more objectives`
   - Through the closing `});` of that handler

2. Remove the `DELETE /evidence/:evidence_id/objectives/:objective_id` handler (lines 71–95 of the current file):
   - The block starting with `// DELETE /evidence/:evidence_id/objectives/:objective_id — unlink evidence from an objective`
   - Through the closing `});` of that handler

3. Remove the now-unused imports: `linkEvidenceToObjectives` and `unlinkEvidenceFromObjective` from the import block at the top. Keep `getObjectiveCoverage`, `getLinkedObjectivesForEvidence`, and `setSufficiency`.

The remaining routes in `objectivecoverage.ts` after cleanup:
- `GET /evidence/:evidence_id/objectives` — still needed (read-only fetch, path is also under /evidence but GET requests from the detail page call this correctly)
- `GET /objectives/coverage` — unaffected
- `PUT /objectives/sufficiency` — unaffected

**Note on the remaining GET /evidence/:evidence_id/objectives in objectivecoverage.ts:**
This GET route is mounted at `/:id` (not `/:id/evidence`), so Express resolves it as `/api/engagements/:id/evidence/:evidence_id/objectives` via objectiveCoverageRouter. However, `evidenceRouter` intercepts paths prefixed with `/:id/evidence` — GET requests to `/:evidence_id/objectives` would also be caught by evidenceRouter since there is no matching GET route there for that path. 

To ensure the GET works reliably, also add the GET handler for `/:evidence_id/objectives` to `evidence.ts` alongside the POST and DELETE:

```typescript
// GET /api/engagements/:id/evidence/:evidence_id/objectives — objectives linked to this evidence item
// Mirrored from objectivecoverage.ts — evidenceRouter intercepts this path.
// Role access: all authenticated roles
evidenceRouter.get(
  '/:evidence_id/objectives',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const objectives = await getLinkedObjectivesForEvidence(
        req.params.id,
        req.params.evidence_id
      );
      res.json({ objectives });
    } catch (err: unknown) {
      handleError(err, res, 'GET /evidence/:evidence_id/objectives');
    }
  }
);
```

Add `getLinkedObjectivesForEvidence` to the objectivecoverage.service import in `evidence.ts`:
```typescript
import {
  linkEvidenceToObjectives,
  unlinkEvidenceFromObjective,
  getLinkedObjectivesForEvidence,
} from '../services/objectivecoverage.service';
```

And remove `getLinkedObjectivesForEvidence` from `objectivecoverage.ts` imports (it is now unused there since GET /evidence/:evidence_id/objectives is also unreachable from objectiveCoverageRouter for the same interception reason).

**Final state of imports in objectivecoverage.ts after cleanup:**
```typescript
import {
  getObjectiveCoverage,
  setSufficiency,
} from '../services/objectivecoverage.service';
```

**Final state of the objectivecoverage.ts routes** (only these two should remain):
- `GET /objectives/coverage`
- `PUT /objectives/sufficiency`
  </action>
  <verify>
# Verify link/unlink routes exist in evidence.ts
grep -n 'evidence_id/objectives' backend/src/routes/evidence.ts
# Expected: POST /:evidence_id/objectives, DELETE /:evidence_id/objectives/:objective_id, GET /:evidence_id/objectives all present

# Verify link/unlink routes are gone from objectivecoverage.ts
grep -n 'linkEvidence\|unlinkEvidence\|getLinkedObjectives' backend/src/routes/objectivecoverage.ts
# Expected: no matches

# Verify objectivecoverage.ts only has coverage and sufficiency routes
grep -n 'objectiveCoverageRouter\.' backend/src/routes/objectivecoverage.ts
# Expected: GET /objectives/coverage and PUT /objectives/sufficiency only

# Verify TypeScript compiles without errors
cd backend && npx tsc --noEmit 2>&1 | head -30 && echo "TSC OK"
  </verify>
  <done>
- `evidence.ts` has three new route handlers: `GET /:evidence_id/objectives`, `POST /:evidence_id/objectives`, `DELETE /:evidence_id/objectives/:objective_id`
- `objectivecoverage.ts` only contains `GET /objectives/coverage` and `PUT /objectives/sufficiency`
- `linkEvidenceToObjectives`, `unlinkEvidenceFromObjective`, `getLinkedObjectivesForEvidence` are imported in `evidence.ts` and removed from `objectivecoverage.ts`
- TypeScript compiles cleanly (`npx tsc --noEmit` exits 0)
- `POST /api/engagements/:id/evidence/:evidence_id/objectives` returns 200 (not 404) when called with valid data
  </done>
</task>

</tasks>

<verification>
After both tasks complete, verify the full fix end-to-end:

```bash
# 1. Confirm visible text change
grep -n 'P3 Blocker' frontend/src/components/evidence/GapObjectiveCard.tsx
# Must show two lines: aria-label and text node

# 2. Confirm routing fix in evidence.ts
grep -n 'evidence_id/objectives' backend/src/routes/evidence.ts
# Must show GET, POST, DELETE handlers

# 3. Confirm objectivecoverage.ts is clean
grep -c 'linkEvidence\|unlinkEvidence\|getLinkedObjectives' backend/src/routes/objectivecoverage.ts
# Must be 0

# 4. TypeScript compilation
cd backend && npx tsc --noEmit 2>&1 | grep -E 'error TS' | head -10
# Must be empty (no TypeScript errors)
```
</verification>

<success_criteria>
1. `GapObjectiveCard` visible text on gap cards reads "P3 Blocker" — not just in aria-label but as rendered text
2. `POST /api/engagements/:id/evidence/:evidence_id/objectives` is handled by `evidenceRouter` (not silently rejected with 404)
3. `DELETE /api/engagements/:id/evidence/:evidence_id/objectives/:objective_id` is handled by `evidenceRouter`
4. `GET /api/engagements/:id/evidence/:evidence_id/objectives` is handled by `evidenceRouter`
5. `objectivecoverage.ts` retains only `/objectives/coverage` (GET) and `/objectives/sufficiency` (PUT) — no duplicate link/unlink routes
6. Backend TypeScript compiles without errors
7. UAT Test 4 re-run: gap cards display "P3 Blocker" label visibly
8. UAT Test 6 re-run: selecting an objective via LinkObjectivePopover causes it to appear in the Linked Objectives section immediately (onLinked callback fires, re-fetch succeeds with 200)
</success_criteria>

<output>
After completion, create `.planning/phases/05-evidence-findings-and-gate-p3/05-GAP-03-SUMMARY.md`
</output>
