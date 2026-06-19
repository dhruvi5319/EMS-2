---
status: diagnosed
trigger: "Gate P4 review page at /engagements/:id/gates/p4 is not accessible from the Engagement Shell via a navigation tab or link"
created: 2026-06-19T00:00:00Z
updated: 2026-06-19T00:00:00Z
---

## Current Focus

hypothesis: The Engagement Shell tab list (EngagementShellPage.tsx) has no tab or link pointing to /engagements/:id/gates/p4, and the GateStatusCard component does not link to that route either
test: Verified by reading EngagementShellPage.tsx tab array and GateStatusCard.tsx for any navigation to gates/p4
expecting: No such link exists — confirmed
next_action: DIAGNOSIS COMPLETE

## Symptoms

expected: From the Engagement Shell (/engagements/:id), user can find a tab or link to navigate to Gate P4 review page (/engagements/:id/gates/p4)
actual: No such tab or link exists on the Engagement Shell page
errors: No runtime error — this is a missing UI affordance
reproduction: Navigate to any engagement in draft phase → look for Gate P4 tab/link on the shell page
started: Discovered during Phase 6 UAT (Test 10)

## Eliminated

- hypothesis: Route /engagements/:id/gates/p4 is not registered in App.tsx
  evidence: App.tsx line 194-196 — the route IS correctly registered with GateP4ReviewPage component
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: GateP4ReviewPage.tsx does not exist or is broken
  evidence: File exists at /frontend/src/pages/engagements/GateP4ReviewPage.tsx (281 lines) and is fully implemented
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: GateStatusCard links to the P4 review page
  evidence: GateStatusCard.tsx (150 lines) — cards render gate status display only; the P4 card has no Link or navigate call to /gates/p4
  timestamp: 2026-06-19T00:00:00Z

## Evidence

- timestamp: 2026-06-19T00:00:00Z
  checked: EngagementShellPage.tsx lines 274-291 — the tab array
  found: Tabs defined: ['overview', 'team', 'planning', 'evidence', 'findings', 'draft', 'gate-history', 'audit']. No 'gate-p4' or similar entry.
  implication: There is no tab for Gate P4 Review in the Engagement Shell

- timestamp: 2026-06-19T00:00:00Z
  checked: EngagementShellPage.tsx full file (350 lines)
  found: No import of GateP4ReviewPage. No <Link> to /gates/p4. No navigate() call to /gates/p4. No button labeled "Gate P4" or similar.
  implication: The Shell page has zero navigation affordance to the P4 review route

- timestamp: 2026-06-19T00:00:00Z
  checked: App.tsx lines 192-196
  found: Route IS registered: path="/engagements/:id/gates/p4" element={<GateP4ReviewPage />}
  implication: The page is reachable by direct URL, but there is no entry point from the Shell UI

- timestamp: 2026-06-19T00:00:00Z
  checked: GateStatusCard.tsx (150 lines) — the P4 card in GateStatusCardRow
  found: Cards are display-only. The P4 card shows status/badge but has no Link or onClick that navigates to /gates/p4
  implication: The visual Gate P4 card in the Shell does not serve as a navigation entry point

- timestamp: 2026-06-19T00:00:00Z
  checked: DraftProductPage.tsx line 92
  found: navigate(`/engagements/${engagementId}/gates/p4`) is called inside handleAdvance() when draft.status === 'ready_for_final_review'
  implication: The ONLY path to P4 review is via the Draft Product tab's "advance" action when the draft is in ready_for_final_review status — a contextual action, not a direct tab/link. This does not satisfy the requirement for a visible tab or navigation link.

- timestamp: 2026-06-19T00:00:00Z
  checked: GateStatusCardRow.tsx (45 lines)
  found: Renders GateStatusCard for each of ['A1', 'P2', 'P3', 'P4']. No link wrapping. No onClick navigation.
  implication: Confirms no click-through navigation from the Gate Status row to the P4 review page

## Resolution

root_cause: EngagementShellPage.tsx does not include a "Gate P4" tab or direct Link to /engagements/:id/gates/p4 in its tab list (lines 274-291). The only programmatic navigation to /gates/p4 in the entire app is an imperative navigate() call inside DraftProductPage.tsx's handleAdvance() function (line 92), which only fires when draft.status === 'ready_for_final_review'. There is no persistent, visible tab or link affording direct access to the P4 review page from the Engagement Shell.
fix: (diagnosis only — not applied)
verification: (diagnosis only — not applied)
files_changed: []
