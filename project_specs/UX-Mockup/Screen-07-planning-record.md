# Screen-07: Planning Record (F6)

**Purpose:** Build the planning baseline — objectives, design approach, risk notes, independence; submit for P2  
**User Stories:** US-6.1, US-6.2, US-6.3, US-6.4, US-6.5  
**Personas:** Diana Okafor (EM), Priya Nair (AN)  
**Journeys:** JRN-02.1

---

## Layout — Planning Record (Draft state)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Planning Record              │
│        │  Status: [Draft]                    [Save Draft] [Submit P2→]│
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P2 READINESS CHECKLIST ───────────────────────────────  │
│        │  Before submitting for P2, all items must be complete:       │
│        │  ✓ ≥1 objective added                                        │
│        │  🔴 Risk notes required                                       │
│        │  🔴 Data reliability notes required                           │
│        │  ✓ Independence status set                                    │
│        │  ✓ Owner assigned                                             │
│        │  🔴 ≥1 QA Reviewer on team                                   │
│        │  ✓ ≥1 milestone date set                                      │
│        │  (Submit button disabled while any item shows 🔴)            │
│        │                                                              │
│        │  ── OBJECTIVES ─────────────────────────────────────────── │
│        │                                              [+ Add Objective]│
│        │                                                              │
│        │  ┌──┬─────────────────────────────────────────────────────┐  │
│        │  │⋮⋮│ Objective 1                               [Edit][✕] │  │
│        │  │  │ Assess adequacy of internal budget controls for     │  │
│        │  │  │ fiscal year 2026                                    │  │
│        │  │  │ Information need: [Annual audit reports, agency     │  │
│        │  │  │ budget submissions]                                 │  │
│        │  ├──┼─────────────────────────────────────────────────────┤  │
│        │  │⋮⋮│ Objective 2                               [Edit][✕] │  │
│        │  │  │ Evaluate data reliability of agency financial       │  │
│        │  │  │ reporting systems                                   │  │
│        │  │  │ Information need: [not set]                         │  │
│        │  ├──┼─────────────────────────────────────────────────────┤  │
│        │  │⋮⋮│ Objective 3                               [Edit][✕] │  │
│        │  │  │ Review compliance with reporting requirements       │  │
│        │  └──┴─────────────────────────────────────────────────────┘  │
│        │  ⋮⋮ = drag handle for reordering                            │
│        │                                                              │
│        │  ── PLANNING SECTIONS ──────────────────────────────────── │
│        │                                                              │
│        │  Design Approach  (optional)                                 │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Describe the methodology and analytical approach...    │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Schedule Notes  (optional)                                  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Key dates, phases, and scheduling constraints...       │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Risk Notes  * required for P2                              │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Document risks related to scope, timeline, or data...  │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Data Reliability Notes  * required for P2                  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Assess reliability, completeness, and limitations      │ │
│        │  │ of the primary data sources...                         │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  Independence Status  * required for P2                     │
│        │  ● Affirmed   ○ Pending   ○ Exception Noted                 │
│        │                                                              │
│        │  [Save Draft]                    [Submit for P2 Review →]   │
│        │  (saves any time)                (requires all checklist ✓) │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Add Objective Inline Form

```
  [+ Add Objective] ─────────────────────────────────────────────
  Objective Text *
  ┌──────────────────────────────────────────────────────────────┐
  │ Full text of the objective or research question...           │
  └──────────────────────────────────────────────────────────────┘

  Information Need (optional)
  ┌──────────────────────────────────────────────────────────────┐
  │ What information is needed to answer this objective?         │
  └──────────────────────────────────────────────────────────────┘

  [Cancel]                              [Save Objective]
```

---

## Layout — Approved State (Post-P2)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Planning Record · Status: [Approved] · P2: ✓ Feb 2, 2026  │
│        │                                        [Request Revision]   │
│        ├──────────────────────────────────────────────────────────────┤
│        │  ⚠ This planning record is approved and locked.              │
│        │    Click "Request Revision" to make changes (revision note  │
│        │    required).                                                │
│        │                                                              │
│        │  [All fields shown read-only — same layout, no edit controls]│
│        │                                                              │
│        │  Return Comments (if previously returned):                  │
│        │  ┌──────────────────────────────────────────────────────────┐│
│        │  │ [Return date] James Whitfield: "Please expand risk notes  ││
│        │  │  to address data access limitations..."                  ││
│        │  └──────────────────────────────────────────────────────────┘│
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | P2 readiness checklist | Top of page (sticky on scroll) |
| Primary | Objectives section with add/edit/reorder | Below checklist |
| Primary | Risk Notes + Data Reliability Notes (required) | Marked with asterisk |
| Secondary | Design Approach + Schedule Notes (optional) | Middle sections |
| Secondary | Independence Status | Below optional sections |
| Tertiary | Save Draft / Submit buttons | Bottom (also sticky footer) |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Draft (no objectives) | Checklist shows 🔴 for objective count | Submit disabled |
| Draft (partial) | Some checklist items green, some red | Submit disabled |
| Draft (complete) | All checklist items ✓ | Submit enabled; green "Ready to submit" |
| Saving draft | Save button spinner | "Saving..." |
| Submitted (ready_for_review) | All fields read-only; "Under review by QA" banner | "Submitted for P2 review. Awaiting QA Reviewer." |
| Returned | Yellow "Returned for revision" banner + return comments | "Returned: [comment]" |
| Approved (locked) | Green "Approved" banner; all fields read-only | "Approved — lock symbol on fields" |
| Revision mode (post-P2) | Fields unlocked; revision note field required | "Revision note required to save changes." |
| Deleting objective (linked) | Error modal | "Cannot delete this objective — it has linked evidence. Unlink evidence first." |

---
