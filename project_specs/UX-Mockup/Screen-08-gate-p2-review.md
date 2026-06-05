# Screen-08: Gate P2 Review (F7)

**Purpose:** QA Reviewer reviews planning completeness, approves or returns with comments  
**User Stories:** US-7.1, US-7.2, US-7.3, US-7.4  
**Personas:** James Whitfield (QA)  
**Journeys:** JRN-04.1

---

## Layout — P2 Review Page

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Review Queue > ENG-2026-00001 — P2 Planning Review          │
│        │  Submitted: February 1, 2026 · By: Diana Okafor             │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P2 COMPLETENESS CHECKLIST ─────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  ✓  ≥1 objective present (3 objectives)                 │ │
│        │  │  ✓  Risk notes: present                                 │ │
│        │  │  ✓  Data reliability notes: present                     │ │
│        │  │  ✓  Independence status: Affirmed                       │ │
│        │  │  ✓  Owner assigned: Diana Okafor                        │ │
│        │  │  ✓  ≥1 milestone date set (4 dates)                     │ │
│        │  │  ✓  ≥1 QA Reviewer on team: James Whitfield             │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  All items pass. You may approve this planning baseline.     │
│        │                                                              │
│        │  ── PLANNING RECORD (Read-Only) ────────────────────────── │
│        │                                                              │
│        │  OBJECTIVES                                                  │
│        │  1. Assess adequacy of internal budget controls...           │
│        │     Info need: Annual audit reports, agency budget submissions│
│        │  2. Evaluate data reliability of financial reporting...      │
│        │  3. Review compliance with reporting requirements...         │
│        │                                                              │
│        │  DESIGN APPROACH                                             │
│        │  [design approach text]                                      │
│        │                                                              │
│        │  SCHEDULE NOTES                                              │
│        │  [schedule notes text]                                       │
│        │                                                              │
│        │  RISK NOTES                                                  │
│        │  [risk notes text]                                           │
│        │                                                              │
│        │  DATA RELIABILITY NOTES                                      │
│        │  [data reliability notes text]                               │
│        │                                                              │
│        │  INDEPENDENCE STATUS: Affirmed                               │
│        │                                                              │
│        │  TEAM SUMMARY                                                │
│        │  Diana Okafor (EM) · James Whitfield (QA) · Priya Nair (AN) │
│        │                                                              │
│        │  MILESTONES                                                  │
│        │  P2 Target: Feb 2  · P3 Target: Mar 15                     │
│        │  Draft: Apr 1  ·  P4 Target: Apr 30                        │
│        │                                                              │
│        │  ── P2 DECISION (QA role only) ─────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Decision Comment *                                     │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ e.g., Planning baseline meets all P2 requirements.│  │ │
│        │  │  │ Objectives are well-defined.                      │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │  Minimum 10 characters  [12 / 10] ✓                    │ │
│        │  │                                                         │ │
│        │  │  [Return for Revision]         [✓ Approve P2]          │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Completeness checklist (all must be ✓ to approve) | Top of page |
| Primary | P2 decision panel with comment + buttons | Bottom, always visible |
| Secondary | Full planning record content | Middle (scrollable) |
| Tertiary | Team summary + milestone dates | End of planning record section |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (all pass) | Checklist all green; Approve button active | "All items pass. You may approve." |
| Checklist fails | Red items in checklist; Approve button disabled | "Resolve failing items before approving." |
| Comment too short | Red underline on textarea | "Minimum 10 characters" |
| Approving | Button spinner | "Processing approval..." |
| Approved | Redirect to Engagement Shell; banner | "Gate P2 approved. Engagement now in Evidence phase." |
| Returning | Return dialog confirmation | "Confirm return for revision?" |
| Returned | Redirect to Review Queue; banner | "Planning record returned for revision." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Completeness checklist | Read-only computed display | Updated on page load |
| Decision comment | Textarea (required, ≥10 chars) | Real-time char count |
| Return for Revision | Secondary button (destructive) | Requires comment; confirmation dialog |
| Approve P2 | Primary button | Disabled until comment ≥10 chars; disabled if checklist fails |

---

## Review Queue Entry Point

```
┌──────────────────────────────────────────────────────────────────┐
│ Review Queue                                                     │
├──────────────────────────────────────────────────────────────────┤
│ Type           │ Engagement      │ Submitted    │ Days Waiting   │
├────────────────┼─────────────────┼──────────────┼────────────────┤
│ P2 Planning    │ ENG-2026-00001  │ Feb 1, 2026  │ 1 day          │
│ Review         │ Budget Review   │              │                │
├────────────────┼─────────────────┼──────────────┼────────────────┤
│ P3 Evidence    │ ENG-2026-00003  │ Jan 28, 2026 │ 4 days ⚠       │
│ Sufficiency    │ Freight Safety  │              │                │
└──────────────────────────────────────────────────────────────────┘
```

Items sorted by submitted_at ascending (oldest first). Days Waiting > 3 shown with ⚠ indicator.

---
