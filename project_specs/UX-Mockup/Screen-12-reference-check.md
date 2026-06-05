# Screen-12: Reference Check / Indexing (F12)

**Purpose:** Link draft statements to evidence; IR marks pass/fail; EM waives; failed statements routed to Analyst  
**User Stories:** US-12.1, US-12.2, US-12.3, US-12.4, US-12.5, US-12.6, US-12.7  
**Personas:** Priya Nair (AN), Carla Voss (IR), Diana Okafor (EM), Tom Andrade (PC)  
**Journeys:** JRN-03.2, JRN-05.1

---

## Layout — Reference Check Queue (All roles)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Draft Product > Statements   │
│        │  Status: [Ready for Reference Check]                         │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  REFERENCE CHECK PROGRESS                                    │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │  7 statements   ■■■■■■■□□□  5 complete (71%)         │    │
│        │  │  Passed: 4 · Waived: 1 · Failed: 1 · In Review: 1   │    │
│        │  │  Not Started: 0                                       │    │
│        │  │  P4 Status: BLOCKED — 1 Failed, 1 In Review          │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  FILTERS: [Status ▾]  [Assigned To ▾]  [Search...]          │
│        │  [+ Add Statement]   (AN, EM, AD only)                       │
│        │                                                              │
│        │  ┌────┬─────────────────────┬──────────┬──────────┬───────┐  │
│        │  │ #  │ Statement           │ Evidence │ Assigned │Status │  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 1  │ Budget controls show│ 2 items ✓│ C. Voss  │[Pass] │  │
│        │  │    │ weaknesses in...    │          │          │ ✓     │  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 2  │ Agency lacks data   │ 1 item ✓ │ C. Voss  │[Fail] │  │
│        │  │    │ validation docs...  │          │          │ 🔴    │  │
│        │  │    │ Discrepancy: Wrong  │          │          │       │  │
│        │  │    │ evidence linked     │          │  P. Nair │Analyst│  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 3  │ Quarterly reconcil- │ 2 items ✓│ C. Voss  │[In    │  │
│        │  │    │ iation gaps exist...│          │          │Review]│  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 4  │ Reporting deadlines │ 1 item ✓ │ C. Voss  │[Pass] │  │
│        │  │    │ met for FY2025...   │          │          │ ✓     │  │
│        │  ├────┼─────────────────────┼──────────┼──────────┼───────┤  │
│        │  │ 5  │ Internal controls   │ 1 item ✓ │ EM       │[Waive]│  │
│        │  │    │ meet OMB Circ A-123 │          │ waived   │ ○     │  │
│        │  └────┴─────────────────────┴──────────┴──────────┴───────┘  │
└────────┴──────────────────────────────────────────────────────────────┘
```

Status badges: [Pass] = green ✓; [Fail] = red 🔴; [In Review] = amber ○; [Waive] = grey ○; [Not Started] = empty

---

## Layout — Statement Detail (IR view — reviewing a statement)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Statements > Statement 2                                     │
│        │  Assigned to: Carla Voss (IR) · Status: In Review           │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  STATEMENT TEXT                                              │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Agency lacks documented data validation procedures for  │ │
│        │  │ financial reporting systems.                             │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  LINKED EVIDENCE                                             │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ E-001  Interview Note — Agency Budget Office             │ │
│        │  │ [↓ Download]  [Preview ▸]                               │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── REFERENCE CHECK DECISION (IR only) ──────────────────  │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Status *                                               │ │
│        │  │  ○ In Review  ○ Passed  ● Failed                        │ │
│        │  │                                                         │ │
│        │  │  Discrepancy Type *  (required when Failed)             │ │
│        │  │  ┌────────────────────────────────────────────────┐    │ │
│        │  │  │ Wrong evidence linked                      ▾   │    │ │
│        │  │  └────────────────────────────────────────────────┘    │ │
│        │  │  Options: Wrong evidence / Missing evidence /           │ │
│        │  │           Statement mismatch / Insufficient detail      │ │
│        │  │                                                         │ │
│        │  │  Discrepancy Notes *  (required when Failed)            │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ The cited interview transcript does not contain   │  │ │
│        │  │  │ the specific figure referenced in this statement. │  │ │
│        │  │  │ A different evidence item is needed.              │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │                                                         │ │
│        │  │  Assign Back To (optional routing)                      │ │
│        │  │  ┌────────────────────────────────────────────────┐    │ │
│        │  │  │ Priya Nair (Analyst)                       ▾   │    │ │
│        │  │  └────────────────────────────────────────────────┘    │ │
│        │  │                                                         │ │
│        │  │  [← Previous]     [Save & Next →]    [Save Status]     │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  Confirmation after save: "Statement assigned to Priya Nair.  │
│        │  Reference check queue updated."                              │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Analyst Correction View (Priya's queue — failed statement)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  My Queue > Statement 2 (Returned — Needs Correction)         │
│        │  Failed by: Carla Voss · March 20, 2026                      │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ⚠ DISCREPANCY FROM REFERENCER                               │
│        │  Type: Wrong evidence linked                                 │
│        │  Note: "The cited interview transcript does not contain the  │
│        │  specific figure referenced. A different evidence item is    │
│        │  needed."                                                    │
│        │                                                              │
│        │  STATEMENT TEXT                 [Edit statement text]         │
│        │  Agency lacks documented data validation procedures for       │
│        │  financial reporting systems.                                  │
│        │                                                              │
│        │  LINKED EVIDENCE               [Update Evidence Links]        │
│        │  ✕ E-001  Interview Note (remove?)                           │
│        │  + Select replacement evidence from registry...              │
│        │                                                              │
│        │  CORRECTION NOTE (recommended)                               │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Replaced E-001 with E-002 (OMB Dataset) which directly  │ │
│        │  │ references the validation procedure gaps.               │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  [☑ Mark as Revision Ready — Send Back to Referencer]        │
└────────┴──────────────────────────────────────────────────────────────┘
```

After marking revision ready, the statement returns to Carla's review queue automatically. Banner: "Sent back to referencer."

---

## Layout — Waive Reference Check (EM action)

```
┌─────────────────────────────────────────────────────────────────┐
│  Waive Reference Check — Statement 5                       [✕]  │
├─────────────────────────────────────────────────────────────────┤
│  ⚠ Waiving removes this statement from P4 blocking checks.     │
│                                                                  │
│  Waiver Justification *  (minimum 10 characters)                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ This statement cites OMB Circular A-123 directly. The  │    │
│  │ reference is to an authoritative government standard   │    │
│  │ that does not require independent evidence verification.│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Cancel]                          [Waive Reference Check]       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Progress bar: total / by status / P4 gate status | Top of queue |
| Primary | Statement list with status badges | Main content area |
| Primary | Discrepancy panel (IR view) | Statement detail — prominent top box |
| Secondary | Evidence links for each statement | Statement detail |
| Secondary | Assign-back routing (IR view) | Decision panel |
| Tertiary | Filters, search, statement count | Above statement list |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Not Started | Grey badge; unassigned | "Not yet assigned for reference check." |
| In Review | Amber badge; assigned to IR | "Under review by [IR name]." |
| Passed | Green ✓ badge | "Reference check passed." |
| Failed | Red 🔴 badge + discrepancy visible | Discrepancy note shown inline; analyst routing shown |
| Waived | Grey ○ badge + waiver justification | "Waived by [EM name] — [justification]." |
| All complete (P4 ready) | Green progress bar; P4 unblocked | "All reference checks complete. P4 prerequisites met." |
| Analyst correction queue | Amber banner with discrepancy | "Returned for correction — discrepancy note from [IR name]." |
| Revision ready | Blue badge | "Sent back to referencer for re-check." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| + Add Statement | Primary button (AN/EM/AD) | Opens statement form with text + evidence link selector |
| Statement row | Clickable row | Opens statement detail |
| Status select | Radio group (IR only) | Failed triggers discrepancy fields |
| Discrepancy type | Dropdown (required on Failed) | Structured options reduce ambiguity |
| Discrepancy notes | Textarea (required on Failed) | Cannot save Failed without notes |
| Assign back | User select (IR, optional) | Routes to analyst queue automatically |
| Waive | EM action from row menu | Confirmation modal with justification field |
| Mark revision ready | Checkbox (AN) | Sends to IR queue; banner confirms |
| Save & Next | Navigation button (IR) | Saves current status and opens next statement |
| Preview evidence | Inline viewer link | Opens PDF/DOCX in side panel where possible |

---
