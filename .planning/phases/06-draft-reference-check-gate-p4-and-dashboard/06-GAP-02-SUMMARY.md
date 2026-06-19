---
phase: 06-draft-reference-check-gate-p4-and-dashboard
plan: GAP-02
subsystem: ui
tags: [react, navigation, tabs, role-based-access-control, engagement-shell]

# Dependency graph
requires:
  - phase: 06-draft-reference-check-gate-p4-and-dashboard
    provides: GateP4ReviewPage component, PortfolioDashboardPage with usePortfolio hook
provides:
  - Gate P4 tab in EngagementShellPage tab array navigating to GateP4ReviewPage inline
  - canExport allowlist in PortfolioDashboardPage for admin and non-IR roles
affects: [UAT Test 10, UAT Test 11, UAT Test 13]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tab embed pattern: GateP4ReviewPage uses useParams() so it works in-place inside TabsContent at /engagements/:id"
    - "Allowlist over blocklist: roles.some(r => allowlist.includes(r)) is robust to users holding multiple roles"

key-files:
  created: []
  modified:
    - frontend/src/pages/EngagementShellPage.tsx
    - frontend/src/pages/PortfolioDashboardPage.tsx
    - frontend/e2e/engagement-shell.spec.ts

key-decisions:
  - "Embed GateP4ReviewPage in TabsContent (not navigate-away) — useParams() works at /engagements/:id route context; keeps shell UX consistent"
  - "Allowlist [AD,EM,AN,QA,AL,PC,RO] over blocklist !includes('IR') — robust to admin holding all roles including IR"

patterns-established:
  - "Tab embed pattern: Standalone route pages using useParams() can be embedded in EngagementShell TabsContent without prop threading"
  - "canExport allowlist: roles.some(r => allowedRoles.includes(r)) ?? false for multi-role users"

# Metrics
duration: 2min
completed: 2026-06-19
---

# Phase 6 GAP-02: Gate P4 Shell Navigation + Portfolio Export Access Fix Summary

**Gate P4 tab added to EngagementShellPage tab array (positions 7th), embedding GateP4ReviewPage inline; Portfolio Dashboard canExport switched from blocklist to allowlist so admin with all roles sees Export CSV button**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-19T03:28:01Z
- **Completed:** 2026-06-19T03:29:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `{ value: 'gate-p4', label: 'Gate P4' }` tab to EngagementShellPage tab array (after Draft Product, before Gate History)
- Added `<TabsContent value="gate-p4"><GateP4ReviewPage /></TabsContent>` — GateP4ReviewPage embeds correctly since it uses `useParams()` to get engagement ID from the parent route context
- Fixed `canExport` in PortfolioDashboardPage from blocklist `!roles.includes('IR')` to allowlist `roles.some(r => ['AD','EM','AN','QA','AL','PC','RO'].includes(r)) ?? false`
- Added E2E test asserting Gate P4 tab is visible in the engagement shell

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Gate P4 tab to EngagementShellPage** - `fa2e3ce` (feat)
2. **Task 2: Fix canExport allowlist in PortfolioDashboardPage** - `fe1b8d0` (fix)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `frontend/src/pages/EngagementShellPage.tsx` — Import GateP4ReviewPage; add gate-p4 tab entry; add TabsContent block embedding GateP4ReviewPage
- `frontend/src/pages/PortfolioDashboardPage.tsx` — Replace blocklist canExport with allowlist; update JSX comment
- `frontend/e2e/engagement-shell.spec.ts` — Add test asserting Gate P4 tab visible in shell

## Decisions Made
- **Embed vs navigate for Gate P4 tab:** Chose embed (`<GateP4ReviewPage />` inside `TabsContent`) over navigate-away approach. `GateP4ReviewPage` uses `useParams<{ id: string }>()` to get the engagement ID, which is available from the parent route `/engagements/:id`, so embedding works without prop threading. This keeps the tab bar UX consistent with all other tabs.
- **Allowlist over blocklist for canExport:** `!roles.includes('IR')` evaluates to false for admin seeded with all roles (including IR). The allowlist `roles.some(r => [...].includes(r))` returns true if the user has any of the export-eligible roles, making it robust to multi-role users including admin.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UAT Tests 10, 11 (Gate P4 navigation) and Test 13 (CSV export) are now unblocked
- EngagementShellPage Gate P4 tab renders GateP4ReviewPage with prerequisites checklist, reference summary, and P4 decision panel
- Admin user (all roles including IR) now sees Export CSV button on Portfolio Dashboard

---
*Phase: 06-draft-reference-check-gate-p4-and-dashboard*
*Completed: 2026-06-19*

## Self-Check: PASSED

### Files Exist
- ✅ `frontend/src/pages/EngagementShellPage.tsx`
- ✅ `frontend/src/pages/PortfolioDashboardPage.tsx`
- ✅ `frontend/e2e/engagement-shell.spec.ts`

### Commits Exist
- ✅ `fa2e3ce` — feat(06-GAP-02): add Gate P4 tab to EngagementShellPage
- ✅ `fe1b8d0` — fix(06-GAP-02): replace canExport blocklist with allowlist in PortfolioDashboardPage
