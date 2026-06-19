---
status: diagnosed
trigger: "UAT Test 5 Phase 6 - evidence multi-select in Add Statement dialog is broken"
created: 2026-06-19T00:00:00Z
updated: 2026-06-19T00:00:00Z
symptoms_prefilled: true
goal: find_root_cause_only
---

## Current Focus

hypothesis: CONFIRMED — cmdk v1 focus-loss race condition: CommandItem in AddStatementForm is missing onMouseDown={(e) => e.preventDefault()}
test: Read AddStatementForm.tsx and compared to AddMemberForm.tsx (which has the fix)
expecting: Confirmed — AddStatementForm lacks the onMouseDown fix; clicking a CommandItem causes the Popover to lose focus and close before onSelect fires, so no selection registers
next_action: (diagnosis complete — root cause found)

## Symptoms

expected: Evidence multi-select (Command+Popover) in Add Statement dialog allows selecting one or more evidence items before submitting
actual: Evidence multi-select is broken — user cannot select evidence items
errors: None reported (UI-level failure, no JS errors)
reproduction: Navigate to Statements page for a draft engagement, click "Add Statement", attempt to use evidence multi-select
started: Discovered during UAT Phase 6 Test 5

## Eliminated

- hypothesis: API endpoint missing (GET /api/engagements/:id/evidence)
  evidence: Route IS registered in backend/src/routes/evidence.ts line 111 and mounted at engagements.ts line 105. API exists and returns { evidence: EvidenceItem[], total: number }.
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: Response shape mismatch (frontend expects res.data.evidence, backend returns something else)
  evidence: Backend listEvidence() returns { evidence: [...], total: N } (evidence.service.ts line 241). Frontend reads res.data.evidence (AddStatementForm.tsx line 61). Shape matches.
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: State management error in handleToggleEvidence
  evidence: handleToggleEvidence (AddStatementForm.tsx lines 66-70) correctly toggles IDs with functional setState. No bug here.
  timestamp: 2026-06-19T00:00:00Z

## Evidence

- timestamp: 2026-06-19T00:00:00Z
  checked: AddStatementForm.tsx lines 171-193 — CommandItem rendering
  found: CommandItem has only `onSelect={() => handleToggleEvidence(item.id)}`. No `onMouseDown` handler present.
  implication: In cmdk v1, clicking a CommandItem inside a Popover triggers a mousedown event that causes the Popover's focus-trap to close the popover BEFORE the click/onSelect event fires. The result: onSelect never fires, evidence item is never toggled.

- timestamp: 2026-06-19T00:00:00Z
  checked: AddMemberForm.tsx line 118 — the Phase 4 fix reference
  found: `onMouseDown={(e) => e.preventDefault()}` was added to button elements in AddMemberForm to prevent this exact race condition.
  implication: The fix pattern is known and proven in this codebase. AddStatementForm was not written with this fix applied.

- timestamp: 2026-06-19T00:00:00Z
  checked: LinkObjectivePopover.tsx line 138 — another cmdk popover in the codebase
  found: `onMouseDown={(e) => e.preventDefault()}` present on its CommandItem-equivalent button.
  implication: Every other Command+Popover in the codebase has this fix. AddStatementForm is the only one missing it.

- timestamp: 2026-06-19T00:00:00Z
  checked: backend/src/routes/evidence.ts lines 111-129 and engagements.ts lines 104-105
  found: GET /api/engagements/:id/evidence is properly registered and returns { evidence: EvidenceItem[], total: number }. Evidence items include `id`, `source`, `evidence_type` matching the EvidenceOption interface in AddStatementForm.tsx.
  implication: The API works correctly — the bug is purely in the frontend event handling.

## Resolution

root_cause: cmdk v1 focus-loss race condition in AddStatementForm.tsx. The CommandItem for each evidence option (lines 172-193) is missing `onMouseDown={(e) => e.preventDefault()}`. When a user clicks an evidence item, the mousedown event fires first and causes the Popover's focus-trap to close, which unmounts the CommandList before the click/onSelect event can fire. As a result, `handleToggleEvidence` is never called and no evidence is ever selected.

fix: (not applied — diagnosis only) Add `onMouseDown={(e) => e.preventDefault()}` to the CommandItem at AddStatementForm.tsx line 172.

verification: (not applied)
files_changed: []
