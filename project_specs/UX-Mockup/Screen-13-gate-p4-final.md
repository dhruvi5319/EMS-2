# Screen-13: Gate P4 Final Readiness (F13)

**Purpose:** Final readiness checklist; PC/EM approve P4 setting engagement to Ready for Issuance  
**User Stories:** US-13.1, US-13.2, US-13.3, US-13.4  
**Personas:** Tom Andrade (PC), Diana Okafor (EM)  
**Journeys:** JRN-06.1

---

## Layout — P4 Final Readiness Checklist

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Final Readiness (P4)         │
│        │  Phase: Readiness   Risk: Medium   Owner: Diana Okafor        │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P4 PREREQUISITES CHECKLIST ───────────────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ ✓  Gate P3 approved (March 15, 2026 — James Whitfield)  │ │
│        │  │    Evidence sufficiency confirmed for all objectives     │ │
│        │  │                                                         │ │
│        │  │ ✓  No failed reference checks                           │ │
│        │  │    All failed statements resolved                        │ │
│        │  │                                                         │ │
│        │  │ ✓  No in-review reference checks                        │ │
│        │  │    All statements marked final status                    │ │
│        │  │                                                         │ │
│        │  │ ✓  No not-started reference checks                      │ │
│        │  │    All 7 statements: Passed (6) · Waived (1)            │ │
│        │  │                                                         │ │
│        │  │ ✓  No open blockers                                     │ │
│        │  │    All engagement prerequisites resolved                 │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  All prerequisites met.                                       │
│        │                                                              │
│        │  ── REFERENCE CHECK SUMMARY ────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  7 statements   Passed: 6  ·  Waived: 1  ·  Failed: 0  │ │
│        │  │  In Review: 0  ·  Not Started: 0                        │ │
│        │  │  Completion: 100% ✓                                     │ │
│        │  │  [View All Statements →]                                │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── GATE HISTORY SUMMARY ───────────────────────────────── │
│        │  A1  Approved  Jan 15, 2026  Marcus Reid                    │
│        │  P2  Approved  Feb 3, 2026   James Whitfield                │
│        │  P3  Approved  Mar 15, 2026  James Whitfield                │
│        │  P4  Pending                                                 │
│        │  [View Full Gate History →]                                  │
│        │                                                              │
│        │  ── P4 APPROVAL (PC and EM roles only) ─────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Outcome *                                              │ │
│        │  │  ● Ready for Issuance                                   │ │
│        │  │  ○ Closed (EM/Admin only)                               │ │
│        │  │                                                         │ │
│        │  │  Final Approval Comment *  (minimum 10 characters)      │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ e.g., All reference checks confirmed. Product is  │  │ │
│        │  │  │ ready for issuance.                               │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │  [12 / 10] ✓                                            │ │
│        │  │                                                         │ │
│        │  │                        [✓ Approve Final Readiness]      │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Blocked State (prerequisites not met)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Final Readiness (P4)         │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── P4 PREREQUISITES CHECKLIST ───────────────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ ✓  Gate P3 approved                                     │ │
│        │  │                                                         │ │
│        │  │ 🔴 Failed reference checks — 1 statement failed         │ │
│        │  │    Statement 2: "Agency lacks data validation docs..."   │ │
│        │  │    [View Statement →]                                    │ │
│        │  │                                                         │ │
│        │  │ 🔴 In-review reference checks — 1 statement in review   │ │
│        │  │    Statement 3: "Quarterly reconciliation gaps..."       │ │
│        │  │    [View Statement →]                                    │ │
│        │  │                                                         │ │
│        │  │ ✓  No not-started reference checks                      │ │
│        │  │ ✓  No open blockers                                     │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ⛔ 2 prerequisites are not met. Resolve before approving.   │
│        │                                                              │
│        │  ── P4 APPROVAL ────────────────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  [✓ Approve Final Readiness]  ← Disabled until all ✓   │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

Failing checklist items show a direct link to the blocking record. Approve button is fully disabled (not just grayed out styling — no click event, ARIA disabled).

---

## Post-Approval State

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001                                 │
│        │  Status: [Ready for Issuance ✓]   Phase: Readiness            │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ ✓ Gate P4 Approved — April 30, 2026                     │ │
│        │  │   Approved by: Tom Andrade (PC)                         │ │
│        │  │   "All reference checks confirmed. Product is ready     │ │
│        │  │    for issuance."                                        │ │
│        │  │   Outcome: Ready for Issuance                           │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  This engagement is now read-only.                           │
│        │  All records and audit history remain accessible.            │
│        │  No further edits, uploads, or gate approvals are permitted. │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Prerequisites checklist with ✓/🔴 status + links to failing records | Top of page — full width |
| Primary | Reference check summary inline | Below checklist |
| Primary | Approve P4 button (enabled only when all ✓) | Bottom of page; always visible |
| Secondary | Gate history summary | Middle section |
| Tertiary | Outcome selector (PC always Ready for Issuance) | Within approval panel |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Prerequisites not met | Red 🔴 items + links to blockers; approve disabled | "Resolve failing items to enable approval." |
| All prerequisites met | All green ✓; approve button enabled | "All prerequisites met. You may approve." |
| Approving | Button spinner; form locked | "Submitting P4 approval…" |
| P4 approved | Full read-only state; green status banner | "Gate P4 approved. Engagement is Ready for Issuance." |
| Closed outcome | Blue status banner | "Engagement closed without issuance." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Prerequisite checklist | Computed read-only display | Refreshed on page load; links to failing records |
| View Statement link | Inline navigation link | Routes directly to the failing statement |
| Outcome radio | Radio group | PC sees only Ready for Issuance; EM/AD see both |
| Final comment | Textarea (required, ≥10 chars) | Real-time char count with green/red indicator |
| Approve button | Primary button (PC/EM only) | Disabled if any 🔴 item; confirmation dialog before action |
| View Full Gate History | Navigation link | Routes to /engagements/{id}/gates |

---
