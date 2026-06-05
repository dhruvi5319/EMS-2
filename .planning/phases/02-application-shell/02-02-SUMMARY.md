---
phase: 02-application-shell
plan: "02"
subsystem: ui
tags: [rbac, navigation, role-filtering, sidebar, react-router, lucide, typescript]

# Dependency graph
requires:
  - phase: 02-application-shell
    plan: "01"
    provides: shadcn CSS variable tokens, Badge component, cn() helper, @/ path alias
  - phase: 01-foundation
    provides: AuthContext with user.roles[], NavLink from react-router-dom
provides:
  - RoleFilteredNav: 6×8 role matrix filtering (6 nav sections × 8 roles)
  - NavItem: NavLink with active state (4px primary border, primary text, muted bg), collapsed tooltip
  - ReviewQueueBadge: accent count pill for Review Queue nav item
  - Sidebar: responsive (56px icon-rail at ≤1024px, hamburger overlay at <768px)
  - ForbiddenPage: 403 page with ShieldX icon, 'Access Denied' h1, back link
  - RoleGuard: route wrapper rendering ForbiddenPage in-place when role check fails
  - Guarded routes: /requests, /evidence, /review-queue, /reports, /admin/users all role-protected
affects:
  - 02-03 (ForbiddenPage already implemented here; TopBar/search integration)
  - 02-04 (GlobalSearchBar integrates into existing TopBar)
  - 02-05 (UserManagement: /admin/users already guarded by AD role)
  - 02-06 (AuditTrail: /engagements/:id/audit route already registered)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - RBAC nav filtering via NAV_SECTIONS array with allowedRoles[] (empty = all roles)
    - RoleGuard component renders ForbiddenPage in-place (URL stays, content shows 403)
    - Responsive sidebar via window.matchMedia('(max-width: 1024px)') in useEffect

key-files:
  created:
    - frontend/src/components/layout/NavItem.tsx
    - frontend/src/components/layout/ReviewQueueBadge.tsx
    - frontend/src/components/layout/RoleFilteredNav.tsx
    - frontend/src/pages/ForbiddenPage.tsx
  modified:
    - frontend/src/components/layout/Sidebar.tsx
    - frontend/src/components/layout/AppShell.tsx
    - frontend/src/App.tsx

key-decisions:
  - "RoleGuard renders ForbiddenPage in-place (not redirect to /403) — URL stays the same, sidebar/topbar remain visible"
  - "NAV_SECTIONS uses empty allowedRoles[] for 'all roles' sections (Dashboard, Engagements) — avoids enumerating all 8 roles"
  - "ReviewQueueBadge count hardcoded to 0 as placeholder — real API integration deferred to Phase 3+"

patterns-established:
  - "Role filtering pattern: section.allowedRoles.some(role => userRoles.includes(role))"
  - "Responsive collapse via matchMedia in useEffect — not Tailwind-only, enables JS-driven collapsed prop"
  - "RoleGuard shape: export function RoleGuard({ roles: string[], children }) — wraps route element"

# Metrics
duration: 2min
completed: 2026-06-05
---

# Phase 2 Plan 02: Role-Filtered Navigation Summary

**RBAC-filtered sidebar navigation with 6×8 role matrix, responsive collapse (56px at ≤1024px / hamburger at <768px), ForbiddenPage 403 screen, and RoleGuard route wrapper across all protected routes**

## Performance

- **Duration:** 2 min
- **Started:** 2026-06-05T19:30:13Z
- **Completed:** 2026-06-05T19:32:09Z
- **Tasks:** 2 completed
- **Files modified:** 7 files (4 created, 3 modified)

## Accomplishments

- Built complete role-filtered navigation system: AN user sees Dashboard/Engagements/Evidence only; RO user sees Dashboard/Requests/Engagements/Reports only; multi-role users see union of allowed sections
- NavItem renders 4px primary left border + primary text + muted background on active route; collapses to 56px icon-only mode with hover tooltip
- Sidebar collapses to 56px icon-only rail at ≤1024px and renders full-screen hamburger overlay at <768px
- ForbiddenPage renders ShieldX 48px icon, "Access Denied" h1 (text-xl font-semibold), exact UI-SPEC copy, "← Go back to Dashboard" link
- RoleGuard renders ForbiddenPage in-place when user.roles has no intersection with required roles; /admin/users guarded by AD only

## Task Commits

Each task was committed atomically:

1. **Task 1: RoleFilteredNav, NavItem, ReviewQueueBadge, Sidebar upgrade** - `5889485` (feat)
2. **Task 2: ForbiddenPage, RoleGuard, and App.tsx route updates** - `06c08ba` (feat)

**Plan metadata:** see docs commit below

## Files Created/Modified

**Created:**
- `frontend/src/components/layout/NavItem.tsx` — NavLink with 4px primary left border active state, collapsed tooltip, badge slot
- `frontend/src/components/layout/ReviewQueueBadge.tsx` — Accent count pill (99+ cap), null when count=0
- `frontend/src/components/layout/RoleFilteredNav.tsx` — 6-section nav with 6×8 role matrix; filters by user.roles from AuthContext
- `frontend/src/pages/ForbiddenPage.tsx` — 403 page: ShieldX icon, 'Access Denied' h1, body text, back link

**Modified:**
- `frontend/src/components/layout/Sidebar.tsx` — Full replacement: responsive collapse (matchMedia), hamburger overlay, RoleFilteredNav integration, user info footer
- `frontend/src/components/layout/AppShell.tsx` — Added transition-all duration-200 for sidebar width transitions
- `frontend/src/App.tsx` — Added RoleGuard export, ForbiddenPage import, guarded routes for /requests /evidence /review-queue /reports /admin/users /403

## Decisions Made

- **RoleGuard renders in-place, not redirect:** When role check fails, ForbiddenPage renders as route content (sidebar + topbar stay visible). URL stays at the unauthorized path. This matches UI-SPEC Screen E and is better UX than redirect.
- **empty allowedRoles = all roles:** Dashboard and Engagements use `allowedRoles: []` to mean "all 8 roles allowed" — avoids enumerating all roles and makes the intent clear.
- **ReviewQueueBadge count = 0 placeholder:** Count hardcoded to 0 (badge renders null when count=0) — real pending review count requires API integration deferred to Phase 3+.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — build passes cleanly (1537 modules, 0 TypeScript errors).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Role-filtered navigation complete: all 6 sections with exact 6×8 role matrix, responsive behavior, active state styling
- ForbiddenPage and RoleGuard ready for use by all upcoming plans
- /admin/users already guarded (AD only) — ready for 02-05 UserManagement implementation
- /engagements/:id/audit route registered — ready for 02-06 AuditTrail implementation
- Ready for plan 02-03: GlobalSearchBar (TopBar has space for search integration)

## Self-Check: PASSED

All 7 key files verified present on disk. Both commits (5889485, 06c08ba) confirmed in git log.

---
*Phase: 02-application-shell*
*Completed: 2026-06-05*
