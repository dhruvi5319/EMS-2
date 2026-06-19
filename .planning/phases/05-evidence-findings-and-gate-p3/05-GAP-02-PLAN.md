---
phase: 05-evidence-findings-and-gate-p3
plan: GAP-02
type: execute
wave: 1
depends_on: ["05-GAP-01"]
files_modified:
  - frontend/src/components/evidence/EvidenceDetailPage.tsx
  - frontend/src/pages/engagements/GateP3ReviewPage.tsx
  - frontend/src/pages/engagements/FindingsListPage.tsx
autonomous: true
gap_closure: true

features:
  implements: ["F8", "F9", "F10"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "After linking an objective via LinkObjectivePopover, the Linked Objectives section updates to show the newly linked objective"
    - "GateP3ReviewPage shows 'Already Approved' banner and hides the decision panel when engagement.phase is draft/readiness/closed"
    - "FindingsListPage shows Gate P3 approved green banner and hides sufficiency chips and prerequisites checklist when engagement.phase is draft/readiness/closed"
    - "FindingsListPage shows a Gate P3 Review link for QA/AD users"
    - "ObjectiveSufficiencySummary allPass logic matches backend: pass when all objectives have evidence_count > 0 AND none are evidence_needed"
  artifacts:
    - path: "frontend/src/components/evidence/EvidenceDetailPage.tsx"
      provides: "handleObjectiveLinked calls fetchEvidence() to re-fetch data instead of optimistic update"
    - path: "frontend/src/pages/engagements/GateP3ReviewPage.tsx"
      provides: "p3AlreadyApproved state fetches engagement phase; shows banner + hides decision panel when approved"
    - path: "frontend/src/pages/engagements/FindingsListPage.tsx"
      provides: "p3Approved state; Gate P3 Review link; approved banner; hidden checklist when p3 approved; corrected allPass logic"
  key_links:
    - from: "frontend/src/pages/engagements/FindingsListPage.tsx"
      to: "frontend/src/hooks/useEvidenceCoverage"
      via: "allPass derived from coverage.objectives: evidence_count > 0 AND status !== evidence_needed"
    - from: "frontend/src/pages/engagements/GateP3ReviewPage.tsx"
      to: "/api/engagements/:id"
      via: "useEffect fetches engagement.phase to set p3AlreadyApproved state"

integration_contracts:
  requires:
    - artifact: "backend/src/routes/evidence.ts"
      imports: ["GET /:evidence_id/files"]
      shape: "Response 200: { files: EvidenceFile[] }"
  provides:
    - artifact: "frontend/src/components/evidence/EvidenceDetailPage.tsx"
      exports: ["EvidenceDetailPage"]
      shape: "handleObjectiveLinked: calls fetchEvidence() — full re-fetch, no optimistic update"
      verify: "grep -n 'handleObjectiveLinked\\|fetchEvidence' frontend/src/components/evidence/EvidenceDetailPage.tsx && echo CONTRACT_OK"
    - artifact: "frontend/src/pages/engagements/GateP3ReviewPage.tsx"
      exports: ["GateP3ReviewPage"]
      shape: "p3AlreadyApproved state derived from engagement.phase; decision panel hidden when true"
      verify: "grep -n 'p3AlreadyApproved\\|p3Already' frontend/src/pages/engagements/GateP3ReviewPage.tsx && echo CONTRACT_OK"
    - artifact: "frontend/src/pages/engagements/FindingsListPage.tsx"
      exports: ["FindingsListPage"]
      shape: "p3Approved state; Gate P3 Review link for QA/AD; approved banner shown; checklist hidden when approved"
      verify: "grep -n 'p3Approved\\|p3-review\\|Gate P3 Review' frontend/src/pages/engagements/FindingsListPage.tsx && echo CONTRACT_OK"
---

<objective>
Gap closure: fix three frontend issues found during UAT.

1. **Linked objective not appearing after selection (UAT Test 6):** `EvidenceDetailPage.handleObjectiveLinked` used an optimistic update that looked up the objective in `coverage?.objectives`. When `coverage` was null or not yet loaded, the lookup returned undefined and the if-guard silently skipped the update — nothing appeared in the Linked Objectives section. Fix: replace optimistic update with a full `fetchEvidence()` re-fetch that always returns accurate data.

2. **Gate P3 Review page allows re-approval (UAT Test 13):** `GateP3ReviewPage` had no check for whether P3 was already approved — the decision panel remained visible and re-approval was possible even after P3 was done. Fix: add `p3AlreadyApproved` state that fetches `engagement.phase` on mount; when `draft/readiness/closed`, show an "Already Approved" banner and hide the decision panel entirely.

3. **Findings tab confusing after P3 approved + allPass logic mismatch (UAT Tests 13 & 15):**
   - `FindingsListPage` showed objective sufficiency chips and prerequisites checklist even when P3 was already approved, creating confusion. Fix: add `p3Approved` state (same pattern as GateP3ReviewPage); show green banner instead of chips when approved; hide checklist when approved.
   - `ObjectiveSufficiencySummary.allPass` used `every(o => o.sufficiency_status === 'sufficient')` which was stricter than the backend gate logic. The backend only blocks on `evidence_needed` or `evidence_count=0`. Fix: `allPass = all objectives have evidence_count > 0 AND none are evidence_needed`.
   - No navigation link to Gate P3 Review page existed for QA/AD users. Fix: add "Gate P3 Review →" button in the Findings page header.

Output: All three frontend UX gaps closed. Evidence linking shows result immediately. P3 Review page is idempotent in the UI. Findings tab correctly shows P3 status.
</objective>

<feature_dependencies>
Implements: F8 (evidence detail UX), F9 (objective linking UX), F10 (Gate P3 review UX, findings page UX)
Depends on: None (all self-contained frontend fixes)
Enables: None (fixes only)
</feature_dependencies>

<execution_context>
@.planning/phases/05-evidence-findings-and-gate-p3/05-05-SUMMARY.md
@.planning/phases/05-evidence-findings-and-gate-p3/05-06-SUMMARY.md
@.planning/phases/05-evidence-findings-and-gate-p3/05-07-SUMMARY.md
</execution_context>

<context>
@frontend/src/components/evidence/EvidenceDetailPage.tsx
@frontend/src/pages/engagements/GateP3ReviewPage.tsx
@frontend/src/pages/engagements/FindingsListPage.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix EvidenceDetailPage handleObjectiveLinked — replace optimistic update with fetchEvidence() re-fetch</name>
  <files>frontend/src/components/evidence/EvidenceDetailPage.tsx</files>
  <action>
In `frontend/src/components/evidence/EvidenceDetailPage.tsx`, find the `handleObjectiveLinked` callback.

**Current (broken):** The callback uses an optimistic update that looks up `coverage?.objectives` to find the newly linked objective. When `coverage` is null or stale, the update silently no-ops and nothing appears in the Linked Objectives section.

**Fix:** Replace the optimistic update with a simple `fetchEvidence()` call that re-fetches all evidence data (including the updated linked objectives list) from the backend:

```typescript
const handleObjectiveLinked = (_objectiveId: string) => {
  // Re-fetch full evidence data to get accurate linked objectives list
  fetchEvidence();
};
```

This ensures that after a successful link operation, the Linked Objectives section always reflects the actual server state.
  </action>
  <verify>
grep -A4 "handleObjectiveLinked" frontend/src/components/evidence/EvidenceDetailPage.tsx | grep "fetchEvidence" && echo "REFETCH_FIX_OK"
  </verify>
  <done>handleObjectiveLinked calls fetchEvidence() — linked objectives appear immediately after selection with no optimistic update race condition.</done>
</task>

<task type="auto">
  <name>Task 2: Add p3AlreadyApproved state to GateP3ReviewPage — show banner, hide decision panel when approved</name>
  <files>frontend/src/pages/engagements/GateP3ReviewPage.tsx</files>
  <action>
In `frontend/src/pages/engagements/GateP3ReviewPage.tsx`, add state and an effect to detect when P3 is already approved:

```typescript
const [p3AlreadyApproved, setP3AlreadyApproved] = useState(false);

useEffect(() => {
  if (!engagementId) return;
  api.get<{ engagement: { phase: string } }>(`/api/engagements/${engagementId}`)
    .then((res) => {
      if (res.ok) {
        const phase = res.data.engagement.phase;
        setP3AlreadyApproved(phase === 'draft' || phase === 'readiness' || phase === 'closed');
      }
    })
    .catch(() => {});
}, [engagementId]);
```

Then conditionally render in the decision panel area:
- When `p3AlreadyApproved` is true: show a green banner ("Gate P3 has already been approved. This engagement is in the Draft phase.") and do NOT render `P3DecisionPanel` or the approve/return confirm dialogs.
- When `p3AlreadyApproved` is false: show the decision panel as before (gated on `canDecide`).

```tsx
{canDecide && !p3AlreadyApproved && (
  <P3DecisionPanel ... />
)}
{p3AlreadyApproved && (
  <div style={{ ... green banner styles ... }} role="status">
    ✓ Gate P3 has already been approved. This engagement is in the Draft phase.
  </div>
)}
```
  </action>
  <verify>
grep -n "p3AlreadyApproved" frontend/src/pages/engagements/GateP3ReviewPage.tsx && echo "P3_ALREADY_APPROVED_OK"
grep -n "already.*approved\|Already.*Approved\|already been approved" frontend/src/pages/engagements/GateP3ReviewPage.tsx && echo "BANNER_OK"
  </verify>
  <done>GateP3ReviewPage detects engagement.phase on mount. When phase is draft/readiness/closed, decision panel is hidden and a green "already approved" banner is shown instead.</done>
</task>

<task type="auto">
  <name>Task 3: FindingsListPage — add p3Approved state, Gate P3 Review link, fix allPass, show approved banner</name>
  <files>frontend/src/pages/engagements/FindingsListPage.tsx</files>
  <action>
In `frontend/src/pages/engagements/FindingsListPage.tsx`, make four changes:

**1. Add p3Approved state** (same pattern as GateP3ReviewPage):
```typescript
const [p3Approved, setP3Approved] = useState(false);
useEffect(() => {
  if (!engagementId) return;
  api.get<{ engagement: { phase: string } }>(`/api/engagements/${engagementId}`)
    .then((res) => {
      if (res.ok) {
        const ph = res.data.engagement.phase;
        setP3Approved(ph === 'draft' || ph === 'readiness' || ph === 'closed');
      }
    })
    .catch(() => {});
}, [engagementId]);
```

**2. Add Gate P3 Review link** in the header section (only for QA/AD):
```tsx
{canReview && (
  <Link
    to={`/engagements/${engagementId}/evidence/p3-review`}
    style={{ ... button outline styles ... }}
  >
    Gate P3 Review →
  </Link>
)}
```

**3. Fix allPass logic** to match backend gate check:
```typescript
// Backend blocks on: evidence_count=0 OR sufficiency_status='evidence_needed'
// So allPass = every objective has evidence AND none are evidence_needed
const allPass = coverage
  ? coverage.objectives.length > 0 &&
    coverage.objectives.every(
      (o) => o.evidence_count > 0 && o.sufficiency_status !== 'evidence_needed'
    )
  : false;
```

**4. Show approved banner, hide checklist** when p3Approved:
```tsx
{/* Objective Sufficiency — replaced by approved banner when P3 done */}
{p3Approved ? (
  <div style={{ ... green banner ... }} role="status">
    ✓ Gate P3 approved — engagement is in Draft phase.
  </div>
) : (
  <ObjectiveSufficiencySummary objectives={coverage?.objectives ?? []} allPass={allPass} />
)}

{/* P3 Prerequisites Checklist — hidden when P3 already approved */}
{!p3Approved && <P3PrerequisitesChecklist blockers={blockers} allPass={allPass} />}
```
  </action>
  <verify>
grep -n "p3Approved" frontend/src/pages/engagements/FindingsListPage.tsx && echo "P3_APPROVED_STATE_OK"
grep -n "p3-review\|Gate P3 Review" frontend/src/pages/engagements/FindingsListPage.tsx && echo "LINK_OK"
grep -n "evidence_needed" frontend/src/pages/engagements/FindingsListPage.tsx && echo "ALLPASS_FIX_OK"
  </verify>
  <done>FindingsListPage: p3Approved state hides chips/checklist and shows green banner when P3 done. Gate P3 Review → link added for QA/AD. allPass matches backend gate logic (evidence_count > 0 AND not evidence_needed).</done>
</task>

</tasks>

<verification>
```bash
# 1. handleObjectiveLinked re-fetches
grep -A4 'handleObjectiveLinked' frontend/src/components/evidence/EvidenceDetailPage.tsx | grep 'fetchEvidence' && echo PASS

# 2. GateP3ReviewPage has p3AlreadyApproved state
grep 'p3AlreadyApproved' frontend/src/pages/engagements/GateP3ReviewPage.tsx && echo PASS

# 3. FindingsListPage has p3Approved state + review link + allPass fix
grep 'p3Approved\|p3-review\|evidence_needed' frontend/src/pages/engagements/FindingsListPage.tsx && echo PASS

# 4. TypeScript clean
cd frontend && npx tsc --noEmit 2>&1 | tail -5 && echo TYPESCRIPT_OK
```
</verification>

<success_criteria>
- Clicking "Link Objective" on EvidenceDetailPage and saving → the linked objective appears in the Linked Objectives section immediately
- Navigating to Gate P3 Review page after P3 approval → decision panel absent; green "already approved" banner shown
- Findings tab after P3 approval → sufficiency chips absent; green "Gate P3 approved" banner shown; prerequisites checklist absent
- Findings tab before P3 approval, all objectives have evidence and are In Review → allPass = true (not just sufficient)
- Gate P3 Review → link visible in Findings page header for QA/AD roles
</success_criteria>

<output>
After completion, create `.planning/phases/05-evidence-findings-and-gate-p3/05-GAP-02-SUMMARY.md`
</output>
