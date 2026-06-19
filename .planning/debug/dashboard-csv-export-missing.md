---
status: diagnosed
trigger: "Export CSV button missing on Portfolio Dashboard at /dashboard"
created: 2026-06-19T00:00:00Z
updated: 2026-06-19T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — canExport evaluates to false because UAT user (admin) has the 'IR' role in their roles array, causing the Export CSV button to be hidden
test: Traced canExport logic in PortfolioDashboardPage.tsx line 34; confirmed admin seed assigns ALL roles including IR (seeds/001_admin_user.ts line 11)
expecting: Button renders only when canExport is true (i.e. user.roles does NOT include 'IR')
next_action: COMPLETE — root cause found

## Symptoms

expected: Portfolio Dashboard at /dashboard shows an "Export CSV" button that downloads a CSV file of all visible engagements
actual: User does not see an "Export CSV" button on the dashboard
errors: None reported (visual omission)
reproduction: Navigate to /dashboard (Portfolio Dashboard), look for Export CSV button
started: Discovered during UAT Phase 6, Test 13

## Eliminated

- hypothesis: Button is not implemented in JSX
  evidence: Button IS present in PortfolioDashboardPage.tsx lines 152-172, wrapped in {canExport && (...)}
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: exportCSV function is missing from usePortfolio hook
  evidence: exportCSV is fully implemented in usePortfolio.ts lines 147-176 and returned at line 223
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: Export button is inside DashboardFilterBar or EngagementRegisterTable
  evidence: Neither component contains any export/CSV button — it lives in the page component itself
  timestamp: 2026-06-19T00:00:00Z

## Evidence

- timestamp: 2026-06-19T00:00:00Z
  checked: PortfolioDashboardPage.tsx line 34
  found: `const canExport = !user?.roles?.includes('IR');` — button hidden when user has 'IR' role
  implication: The gate condition suppresses the button for any user whose roles array contains 'IR'

- timestamp: 2026-06-19T00:00:00Z
  checked: PortfolioDashboardPage.tsx lines 152-172
  found: Export CSV button is wrapped in `{canExport && (...)}` — only rendered when canExport is true
  implication: If canExport is false, the button is completely absent from the DOM (no visibility toggle, no CSS hidden — completely unrendered)

- timestamp: 2026-06-19T00:00:00Z
  checked: backend/seeds/001_admin_user.ts lines 10-12
  found: `const ALL_ROLES = ['AL', 'EM', 'AN', 'QA', 'IR', 'PC', 'RO', 'AD']` — admin user is seeded with ALL roles including 'IR'
  implication: The UAT tester logging in as 'admin' will have roles=['AL','EM','AN','QA','IR','PC','RO','AD']. Since roles includes 'IR', canExport = !true = false, hiding the button

- timestamp: 2026-06-19T00:00:00Z
  checked: backend/src/services/auth.service.ts lines 59-60, 102-103
  found: roles are fetched from user_roles table for every session; all roles assigned to the admin user (including IR) will be returned
  implication: Every API call returning the admin user will include 'IR' in the roles array, so canExport will always be false for admin

- timestamp: 2026-06-19T00:00:00Z
  checked: AuthContext.tsx line 9
  found: AuthUser type declares `roles: string[]` — no distinction between primary and secondary roles
  implication: 'IR' role in the array is enough to trigger the hide condition, regardless of other roles

## Resolution

root_cause: The admin user (used for UAT testing) is seeded with ALL roles including 'IR' (backend/seeds/001_admin_user.ts:11). The PortfolioDashboardPage.tsx (line 34) hides the Export CSV button for any user whose roles array includes 'IR' (`const canExport = !user?.roles?.includes('IR')`). Since the admin user has 'IR' in their roles, canExport evaluates to false, and the button is completely excluded from the JSX render (line 152). The button code itself is correct — the bug is that the role-gate logic is too broad: it hides the button for any user who has ANY 'IR' role, even users (like admin) who also have higher-privileged roles.
fix: NOT APPLIED (diagnose-only mode)
verification: NOT APPLIED
files_changed: []
