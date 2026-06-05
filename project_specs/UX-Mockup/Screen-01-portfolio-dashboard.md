# Screen-01: Portfolio Dashboard (F14)

**Purpose:** Overview of all engagements + requests; entry point for all roles post-login  
**User Stories:** US-0.3, US-0.4, US-3.4  
**Personas:** All roles (default landing page)  
**Journeys:** JRN-01.2, JRN-02.2, JRN-07.1

---

## Layout

```
┌────────┬────────────────────────────────────────────────────────────┐
│ NAV    │  Portfolio Dashboard                        [Export CSV ↓] │
│        ├────────────────────────────────────────────────────────────┤
│ ● Dash │  Summary Cards                                             │
│ Requests│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ Engage-│  │ Planning │ │ Evidence │ │  Draft   │ │Readiness │   │
│ ments  │  │    4     │ │    6     │ │    2     │ │    1     │   │
│ Review │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│ Queue  ├────────────────────────────────────────────────────────────┤
│ Reports│  Filters:                                                  │
│        │  [Phase ▾] [Risk ▾] [Owner ▾] [Due Date ▾] [Status ▾]   │
│        │  [🔍 Search by ID, title, requester...         ] [Clear]  │
│        ├────────────────────────────────────────────────────────────┤
│        │  ┌──────┬──────────────────┬────────┬──────────┬────────┐ │
│        │  │ ID   │ Title            │ Phase  │ Owner    │ Risk   │ │
│        │  ├──────┼──────────────────┼────────┼──────────┼────────┤ │
│        │  │ENG-  │ Agency Budget    │Evidence│ D. Okafor│ Medium │ │
│        │  │2026- │ Review 2026      │        │          │        │ │
│        │  │00001 │                  │  P3 ✓  │ P4 —    │⚠ BLOCKED│ │
│        │  ├──────┼──────────────────┼────────┼──────────┼────────┤ │
│        │  │ENG-  │ Congressional    │Planning│ D. Okafor│  High  │ │
│        │  │2026- │ Request: Freight │        │          │        │ │
│        │  │00002 │ Safety           │  P2 ●  │ P3 —    │On Track│ │
│        │  ├──────┼──────────────────┼────────┼──────────┼────────┤ │
│        │  │ REQ  │ [Draft Request]  │ Draft  │ M. Reid  │   —    │ │
│        │  │2026- │ Mandate: Climate │        │          │        │ │
│        │  │00003 │ Oversight        │        │          │        │ │
│        │  └──────┴──────────────────┴────────┴──────────┴────────┘ │
│        │  Showing 1–20 of 47 items              [< 1 2 3 ... >]    │
└────────┴────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Summary count cards by phase | Top of content area |
| Primary | Engagement list with phase + gate status | Main table |
| Secondary | Filter controls | Above table |
| Secondary | Search bar | Above table (global) |
| Tertiary | Export CSV | Top-right corner |
| Tertiary | Pagination | Below table |

---

## Summary Count Cards

Four cards showing count of active engagements per phase:
- **Planning** — phase = planning
- **Evidence** — phase = evidence  
- **Draft** — phase = draft
- **Readiness** — phase = readiness

Cards are clickable → filters the table to that phase.

---

## Table Columns

| Column | Content | Sortable |
|--------|---------|----------|
| ID | Engagement ID (ENG-YYYY-NNNNN) or Request ID | Yes |
| Title | Engagement/Request title (truncated 60 chars) | Yes |
| Phase | Phase badge with color coding | Yes |
| Owner | Owner name | Yes |
| Risk | Risk badge (Low/Medium/High) | Yes |
| Next Milestone | Label + date + status (On Track/At Risk/Overdue) | Yes |
| Gate Status | A1/P2/P3/P4 mini-badges (✓=approved, ●=pending, —=not started) | No |
| Blocked | ⚠ badge if any open blockers exist | No |

---

## Phase Badges (color coding)

| Phase | Color |
|-------|-------|
| Planning | Blue |
| Evidence | Teal |
| Draft | Purple |
| Readiness | Orange |
| Ready for Issuance | Green |
| Closed | Gray |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Table populated; all phases shown | — |
| Loading | Skeleton rows (shimmer) | — |
| Filtered | Table subset shown; active filter chips above table | Filter chips with "×" to clear |
| Empty (no results) | Illustration + "No engagements match your filters." | "Clear filters" link |
| Empty (no data) | Illustration + "No engagements yet." | "Create first request" link (AL only) |
| Search active | Table filters as user types (debounced 300ms) | Match highlight in results |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Summary count cards | Clickable filter shortcut | Filters table to that phase |
| Filter dropdowns | Multi-select dropdowns | Apply on select; active filter chips appear |
| Search bar | Text input (global) | Queries ID/title/requester/owner; min 2 chars |
| Table row | Clickable | Opens Request Detail or Engagement Shell |
| Export CSV | Button | Downloads all visible rows (respects filters + role) |
| Blocked badge | Icon + tooltip | Hover/focus shows "X open blockers — click to view" |

---

## Role-Based Visibility

| Column / Feature | AL | EM | AN | QA | IR | PC | RO | AD |
|------------------|----|----|----|----|----|----|----|-----|
| Requests in list | ✓ | ✓ | — | — | — | — | ✓ | ✓ |
| Export CSV | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Restricted evidence badge | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |

---
