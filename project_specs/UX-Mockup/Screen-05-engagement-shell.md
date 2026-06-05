# Screen-05: Engagement Shell (F4)

**Purpose:** Central hub for an engagement — metadata, gate status, blockers, artifact navigation  
**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4, US-3.4, US-7.4  
**Personas:** Diana Okafor (EM), all roles assigned to engagement  
**Journeys:** JRN-02.1, JRN-02.2

---

## Layout

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001                                │
│        │                                              [Edit Metadata] │
│        ├──────────────────────────────────────────────────────────────┤
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  ENG-2026-00001 · Agency Budget Review 2026             │ │
│        │  │  Phase: [Evidence] · Status: [Active] · Risk: [Medium]  │ │
│        │  │  Owner: Diana Okafor · Portfolio: Financial Management  │ │
│        │  │  Created: Jan 15, 2026 · Due: Apr 30, 2026             │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── GATE STATUS CARDS ────────────────────────────────────  │
│        │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│        │  │    A1     │  │    P2     │  │    P3     │  │   P4    │ │
│        │  │ ✓Approved │  │ ✓Approved │  │  Pending  │  │Not Start│ │
│        │  │ M. Reid   │  │J. Whitfld │  │           │  │  ----   │ │
│        │  │ Jan 15    │  │  Feb 2    │  │           │  │         │ │
│        │  │[History ▾]│  │[History ▾]│  │           │  │[Locked] │ │
│        │  └───────────┘  └───────────┘  └───────────┘  └─────────┘ │
│        │                                                              │
│        │  ── OPEN BLOCKERS ────────────────────────────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  🔴 Objective "Evaluate data reliability" has no linked  │ │
│        │  │     evidence.  [View →]                                  │ │
│        │  │  🔴 Finding "Agency budget data shows..." has no linked  │ │
│        │  │     evidence.  [View →]                                  │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── ARTIFACT COUNTS ──────────────────────────────────────  │
│        │  Team: 4 members · Objectives: 3 · Evidence: 8 items       │
│        │  Findings: 2 · Draft Product: In Progress                  │
│        │                                                              │
│        │  ── TAB NAVIGATION ───────────────────────────────────────  │
│        │  [Overview] [Team] [Planning Record] [Evidence]             │
│        │  [Findings] [Draft Product] [Gate History] [Audit Trail]   │
│        │                                                              │
│        │  ══ TAB CONTENT BELOW (changes by selected tab) ══          │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Engagement ID, title, phase/status/risk | Header card |
| Primary | Gate status cards (A1/P2/P3/P4) | Below header |
| Primary | Open blockers | Red alert panel |
| Secondary | Artifact counts | Summary row |
| Secondary | Tab navigation | Always visible |
| Tertiary | Edit button | Top-right (EM/AD only) |

---

## Gate Status Cards

Each card:
- Gate label + current outcome badge
- Approver name + date (if decided)
- Rationale preview (first 100 chars, "..." if truncated)
- [History ▾] dropdown — shows all historical decisions for this gate type
- If locked (gate prerequisites not met): card is grayed with "Locked — prerequisite gates must be approved first"

---

## Open Blockers Panel

- Displayed even when blockers = 0 (shows green "✅ No open blockers")
- Each blocker: icon 🔴 + description naming specific record + deep link
- Blockers are auto-computed on page load; no manual refresh needed
- Types:
  - Planning record not approved (P2 required)
  - Objective '{text}' has no linked evidence
  - Objective '{text}' is still In Review
  - Finding '{text prefix}...' has no linked evidence
  - Reference check for statement '{prefix}...' is {status}
  - Gate P3 must be approved before P4 can proceed

---

## Edit Metadata Panel (EM/AD only)

When [Edit Metadata] clicked, inline form opens (or modal):

```
Title *                   [Agency Budget Review 2026          ]
Status                    [Active ▾]  (cannot set closed/RFI via edit)
Risk Level                [○ Low  ● Medium  ○ High]
Owner *                   [Diana Okafor ▾]  (must have EM role)
Portfolio                 [Financial Management               ]
Phase override            [Evidence ▾]  (requires revision note)
Revision Note (if phase override): [                         ]
                          Minimum 10 characters

[Cancel]                  [Save Changes]
```

---

## Tab Content Areas

| Tab | Content |
|-----|---------|
| Overview | Gate cards + blockers + artifact counts (default view) |
| Team | Team assignment list + milestones (Screen-06) |
| Planning Record | Planning record form/view (Screen-07) |
| Evidence | Evidence list + gap view (Screen-09) |
| Findings | Findings list (Screen-10) |
| Draft Product | Draft record + statements + reference check (Screen-11/12) |
| Gate History | Full gate decision history for all gates |
| Audit Trail | Timestamped event log (Screen-14) |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All panels loaded | — |
| Loading | Skeleton for gate cards + blockers | — |
| No blockers | Green checkmark panel | "✅ No open blockers" |
| Editing metadata | Inline form replaces header card | Save/Cancel buttons |
| Engagement closed | All action buttons removed; gray "Closed" banner | "This engagement is closed and read-only." |
| Unauthorized | HTTP 403 → redirect to dashboard | "You are not authorized to view this engagement." |

---
