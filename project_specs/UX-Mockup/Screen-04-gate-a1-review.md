# Screen-04: Request Review / Gate A1 (F3)

**Purpose:** AL reviews submitted request, records risk level, approves or declines  
**User Stories:** US-3.1, US-3.2, US-3.3, US-3.4  
**Personas:** Marcus Reid (AL)  
**Journeys:** JRN-01.2

---

## Layout — A1 Decision Panel (rendered on Request Detail when status=submitted, role=AL)

The A1 decision controls are embedded in the Request Detail page as a distinct panel below the request fields. They are visible **only** when `request.status = submitted` AND the current user has role AL.

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Requests > REQ-2026-00003                                   │
│        │  Congressional Request · [Submitted] · Submitted Jan 15, 2026│
│        ├──────────────────────────────────────────────────────────────┤
│        │  [Intake document, request fields, notes — see Screen-03]    │
│        │                                                              │
│        │  ── GATE A1: ACCEPTANCE DECISION ─────────────────────────  │
│        │  ┌────────────────────────────────────────────────────────┐  │
│        │  │  ⚖  Record your acceptance decision for this request.  │  │
│        │  │     This decision is permanent and creates an audit    │  │
│        │  │     event.                                             │  │
│        │  │                                                        │  │
│        │  │  Risk Level *                                          │  │
│        │  │  ○ Low    ● Medium    ○ High                          │  │
│        │  │                                                        │  │
│        │  │  Decision Rationale *                                  │  │
│        │  │  ┌──────────────────────────────────────────────────┐  │  │
│        │  │  │ e.g., Scope aligns with mandate; medium risk     │  │  │
│        │  │  │ based on timeline and agency response capacity.  │  │  │
│        │  │  └──────────────────────────────────────────────────┘  │  │
│        │  │  Minimum 10 characters [8 / 10] ←shows count          │  │
│        │  │                                                        │  │
│        │  │  [✗ Decline Request]          [✓ Approve Request →]   │  │
│        │  │   (requires rationale)         (requires risk + rationale)│
│        │  └────────────────────────────────────────────────────────┘  │
│        │                                                              │
│        │  [View Audit Trail →]                                        │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Confirmation Dialog — Approve

```
┌──────────────────────────────────────────────────────────────────┐
│                     Approve Request                              │
│                                                                  │
│  You are about to approve this request:                          │
│  "Agency Budget Review 2026"                                     │
│                                                                  │
│  Risk Level: Medium                                              │
│                                                                  │
│  This will:                                                      │
│  • Create a new Engagement Shell (ENG-2026-NNNNN)               │
│  • Record your decision with a timestamp                         │
│  • This action cannot be undone.                                 │
│                                                                  │
│              [Cancel]    [Confirm Approve ✓]                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Confirmation Dialog — Decline

```
┌──────────────────────────────────────────────────────────────────┐
│                     Decline Request                              │
│                                                                  │
│  You are about to decline this request:                          │
│  "Agency Budget Review 2026"                                     │
│                                                                  │
│  No engagement will be created. This decision is permanent.      │
│                                                                  │
│              [Cancel]    [Confirm Decline ✗]                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Post-Decision State — Approved

```
┌──────────────────────────────────────────────────────────────────┐
│  ✅ Engagement ENG-2026-00001 created.  [View Engagement Shell →] │
└──────────────────────────────────────────────────────────────────┘

── GATE A1 DECISION (Read-Only) ─────────────────────────────────
Status:    ✓ Approved
Risk Level: Medium
Approver:  Marcus Reid
Date:       January 15, 2026 at 2:41 PM
Rationale: "Scope aligns with mandate; medium risk based on
            timeline and agency response capacity."
[View Gate History →]
```

---

## Post-Decision State — Declined

```
── GATE A1 DECISION (Read-Only) ─────────────────────────────────
Status:    ✗ Declined
Approver:  Marcus Reid
Date:       January 15, 2026 at 2:41 PM
Rationale: "Scope is outside current mandate boundaries per
            legal review. Declined pending clarification."
[View Gate History →]
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Risk Level radio buttons | Top of A1 panel |
| Primary | Rationale textarea | Middle of A1 panel |
| Primary | Approve / Decline buttons | Bottom of A1 panel |
| Secondary | Character count guidance | Below rationale |
| Secondary | Confirmation dialogs | Modal overlay |
| Tertiary | Post-decision read-only card | Replaces A1 panel after decision |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (undecided) | A1 panel visible; both buttons present | — |
| No risk level | "Approve" button: missing risk level inline error on click | "Risk level is required for A1 approval." |
| Rationale too short | Red underline on textarea; character counter red | "Minimum 10 characters" |
| Confirming approve | Confirmation modal | "Confirm Approve" button |
| Confirming decline | Confirmation modal | "Confirm Decline" button |
| Submitting | Confirm button: spinner + "Processing..." disabled | "Processing..." |
| Already decided | A1 panel replaced by read-only decision card | — |
| Non-AL role | A1 panel not rendered | (Invisible; no disabled controls) |

---
