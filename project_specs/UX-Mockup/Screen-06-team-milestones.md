# Screen-06: Team & Milestones (F5)

**Purpose:** Assign engagement team roles; set milestone target dates; view milestone status  
**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4  
**Personas:** Diana Okafor (EM)  
**Journeys:** JRN-02.1

---

## Layout — Team Tab

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Team                        │
│        ├──────────────────────────────────────────────────────────────┤
│        │  ── TEAM MEMBERS ─────────────────────────────────────────  │
│        │                                              [+ Add Member] │
│        │                                                              │
│        │  ┌──────────────────┬──────────────────┬────────────────────┐
│        │  │ Name             │ Role             │ Actions            │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Diana Okafor     │ Engagement Mgr   │ [Remove] (blocked  │
│        │  │                  │                  │ — last EM)         │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ James Whitfield  │ QA Reviewer      │ [Remove]           │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Priya Nair       │ Analyst          │ [Remove]           │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Carla Voss       │ Indep. Referencer│ [Remove]           │
│        │  ├──────────────────┼──────────────────┼────────────────────┤
│        │  │ Tom Andrade      │ Publishing Coord.│ [Remove]           │
│        │  └──────────────────┴──────────────────┴────────────────────┘
│        │                                                              │
│        │  ── ADD TEAM MEMBER ─────────────────────────────────────  │
│        │  (appears when [+ Add Member] clicked)                      │
│        │  ┌──────────────────────────────────┐  ┌──────────────────┐ │
│        │  │ Search users...               🔍 │  │ Select role  ▾  │ │
│        │  └──────────────────────────────────┘  └──────────────────┘ │
│        │  [Add to Team]                                              │
│        │                                                              │
│        │  ── MILESTONES ───────────────────────────────────────────  │
│        │                                                             │
│        │  ┌──────────────────────────┬───────────┬────────────────┐  │
│        │  │ Milestone                │ Target    │ Status         │  │
│        │  ├──────────────────────────┼───────────┼────────────────┤  │
│        │  │ Planning Approval (P2)   │[📅 Feb 02]│ ✓ Complete     │  │
│        │  │ Evidence Readiness (P3)  │[📅 Mar 15]│ ⚠ At Risk      │  │
│        │  │ Draft Readiness          │[📅 Apr 01]│ ○ On Track     │  │
│        │  │ Final Readiness (P4)     │[📅 Apr 30]│ ○ On Track     │  │
│        │  └──────────────────────────┴───────────┴────────────────┘  │
│        │  [Save Milestones]                                          │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Team member list with roles | Top section |
| Primary | Milestone dates + status | Bottom section |
| Secondary | Add member form (expanded on click) | Below team list |
| Secondary | Save Milestones button | Below milestone table |

---

## Team Assignment Rules (displayed as inline guidance)

- EM: minimum 1 required; last EM cannot be removed
- QA: minimum 1 required before P2 submission
- The same user can hold multiple roles on one engagement
- Inactive users cannot be added (validation at save)

---

## Add Member Form

```
Search users:   [Search by name or email         🔍]
                ↓ (dropdown results as user types)
                  Diana Okafor — Engagement Manager
                  Priya Nair — Analyst
                  ...

Role:           [Engagement Manager              ▾]
                (Options: AL, EM, AN, QA, IR, PC, RO)

[Add to Team]
```

Validation:
- User must be active
- User-role combination must be unique on this engagement
- Error inline: "This user already holds this role on the engagement."

---

## Milestone Date Editing

- Inline date pickers per row (edit in place)
- Chronological order enforced: P3 ≥ P2, Draft ≥ P3, P4 ≥ Draft
- Error if out of order: "Milestone dates must be in chronological order."
- Null dates allowed ("Not Set")
- [Save Milestones] → single save action for all four dates
- Audit: MILESTONES_UPDATED

---

## Milestone Status Indicators

| Status | Icon | Color | Condition |
|--------|------|-------|-----------|
| Not Started | — | Gray | Target date is null |
| On Track | ○ | Green | Target in future, gate not passed |
| At Risk | ⚠ | Yellow | Target within 7 days, gate not passed |
| Overdue | 🔴 | Red | Target in past, gate not passed |
| Complete | ✓ | Green | Gate approved |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Team list + milestone table populated | — |
| Adding member | Search dropdown expands | Results filtered as user types |
| Duplicate role error | Inline error below Add form | "This user already holds this role." |
| Last EM removal blocked | Remove button grayed or error on click | "Cannot remove the last Engagement Manager." |
| Saving milestones | Save button: spinner | "Saving..." |
| Date order error | Red border on out-of-order date | "Milestone dates must be in chronological order." |
| Empty team | "No team members assigned yet" message | Add member prompt |

---
