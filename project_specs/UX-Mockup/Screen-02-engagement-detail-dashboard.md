# Screen-02: Engagement Detail Dashboard (F15)

**Purpose:** Single-engagement progress view — gates, milestones, evidence progress, blockers  
**User Stories:** US-4.1, US-5.4, US-9.3, US-10.3  
**Personas:** Diana Okafor (EM), James Whitfield (QA), Sandra Wu (RO)  
**Journeys:** JRN-02.2, JRN-04.1, JRN-07.1

---

## Layout

```
┌────────┬─────────────────────────────────────────────────────────────┐
│ NAV    │  ENG-2026-00001 · Agency Budget Review 2026                 │
│        │  Phase: [Evidence ●] · Status: [Active] · Risk: [Medium]   │
│        │  Owner: Diana Okafor · Portfolio: Financial Management      │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── GATE STATUS ─────────────────────────────────────────   │
│        │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│        │  │   A1     │ │   P2     │ │   P3     │ │   P4     │     │
│        │  │ Approved │ │ Approved │ │ Pending  │ │Not Started│    │
│        │  │ M. Reid  │ │ J. Whitf │ │          │ │          │     │
│        │  │ Jan 15   │ │ Feb 2    │ │          │ │          │     │
│        │  │[History] │ │[History] │ │[Submit]  │ │[Locked]  │     │
│        │  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── MILESTONES ────────────────────────────────────────     │
│        │  ┌──────────────────────────┬───────────┬────────────┐     │
│        │  │ Milestone                │ Target    │ Status     │     │
│        │  ├──────────────────────────┼───────────┼────────────┤     │
│        │  │ Planning Approval (P2)   │ Feb 2     │ ✓ Complete │     │
│        │  │ Evidence Readiness (P3)  │ Mar 15    │ ⚠ At Risk  │     │
│        │  │ Draft Readiness          │ Apr 1     │ ○ On Track │     │
│        │  │ Final Readiness (P4)     │ Apr 30    │ ○ On Track │     │
│        │  └──────────────────────────┴───────────┴────────────┘     │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── EVIDENCE PROGRESS ─────────────────────────────────     │
│        │  Objectives: 3 total                                        │
│        │  ✓ Obj 1: Assess budget controls (2 items linked)           │
│        │  ⚠ Obj 2: Evaluate data reliability (0 items) ← BLOCKER    │
│        │  ◑ Obj 3: Review reporting compliance (1 item, In Review)   │
│        │                                                             │
│        │  Evidence total: 8 items · [View Evidence →]               │
│        │  Reference Check: 0 of 0 complete (N/A — not in Draft yet) │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── OPEN BLOCKERS ─────────────────────────────────────     │
│        │  🔴 Objective "Evaluate data reliability" has no linked     │
│        │     evidence.  [View Objective →]                           │
│        │  🔴 2 findings have no linked evidence.  [View Findings →]  │
│        ├─────────────────────────────────────────────────────────────┤
│        │  ── QUICK NAVIGATION ──────────────────────────────────     │
│        │  [Team] [Planning Record] [Evidence] [Findings]             │
│        │  [Draft Product] [Gate History] [Audit Trail]               │
└────────┴─────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Engagement ID, title, phase/status/risk badges | Header row |
| Primary | Gate status cards (A1/P2/P3/P4) | First panel |
| Primary | Open blockers list | Prominent panel with red indicators |
| Secondary | Milestone table | Second panel |
| Secondary | Evidence/objective progress | Third panel |
| Tertiary | Quick navigation links | Footer |

---

## Gate Status Cards

Each card shows:
- Gate label (A1, P2, P3, P4)
- Outcome badge: "Approved" (green) / "Pending" (yellow) / "Not Started" (gray) / "Returned" (orange) / "Declined" (red)
- Approver name (if decided)
- Decision date (if decided)
- [History] link → gate history view (all decisions for that gate type)
- [Submit] / [Review] link (role-appropriate action, if available)

Card locking logic:
- P3 card locked (grayed) if P2 not approved
- P4 card locked if P3 not approved

---

## Milestone Status Visual Indicators

| Status | Icon | Color |
|--------|------|-------|
| Not Started | ○ | Gray |
| On Track | ○ | Green |
| At Risk | ⚠ | Yellow |
| Overdue | 🔴 | Red |
| Complete | ✓ | Green (filled) |

At Risk = target within 7 days and gate not yet approved.

---

## Evidence Progress

Shows per-objective:
- Objective text (truncated 80 chars)
- Linked evidence count
- Objective status badge (Evidence Needed 🔴 / In Review ◑ / Sufficient ✓)
- Blocker flag if `status = evidence_needed`
- [View gap] link from blocker to evidence gap view

---

## Open Blockers Panel

- Red alert box, not collapsible
- Each blocker: plain-language description with specific record name + "View →" deep link
- "No open blockers" message (green) when all clear
- Blockers computed dynamically on each page load

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All panels populated | — |
| Loading | Skeleton panels | — |
| No blockers | Green "No open blockers" in blockers panel | "No open blockers" |
| All gates complete | All four gate cards green | Engagement in read-only state |
| Closed engagement | Gray header badge; all action buttons hidden | "This engagement is closed." banner |

---
