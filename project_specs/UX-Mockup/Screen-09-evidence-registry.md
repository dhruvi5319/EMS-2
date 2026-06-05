# Screen-09: Evidence Registry (F8, F9)

**Purpose:** Upload evidence items, link to objectives, view gaps, export CSV  
**User Stories:** US-8.1, US-8.2, US-8.3, US-8.4, US-8.5, US-9.1, US-9.2, US-9.3, US-9.4  
**Personas:** Priya Nair (AN), James Whitfield (QA), Diana Okafor (EM)  
**Journeys:** JRN-03.1

---

## Layout — Evidence Registry List

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Evidence                     │
│        │  Phase: Evidence   [+ Add Evidence]   [Export CSV ↓]         │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  OBJECTIVE COVERAGE SUMMARY                                  │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │  3 objectives   ■■■■■■□□□□  2 covered · 1 gap        │    │
│        │  │  [Show Gaps ▼]                                        │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  FILTERS: [Type ▾] [Sensitivity ▾] [Date Range ▾]           │
│        │           [Linked ▾]  [Search evidence...]                   │
│        │                                                              │
│        │  ┌────┬────────────┬──────────┬───────┬───────┬────┬────┐   │
│        │  │ ID │ Type       │ Source   │ Date  │ Sens. │Obj │File│   │
│        │  ├────┼────────────┼──────────┼───────┼───────┼────┼────┤   │
│        │  │E01 │Interview   │ Agency   │Mar 5  │Std    │ 2  │ 1  │   │
│        │  │    │Note        │ Staff    │       │       │    │    │   │
│        │  │    │            │          │       │       │[View →]  │   │
│        │  ├────┼────────────┼──────────┼───────┼───────┼────┼────┤   │
│        │  │E02 │Dataset     │ OMB      │Mar 3  │[Restr]│ 1  │ 2  │   │
│        │  │    │            │ Budget   │       │       │    │    │   │
│        │  │    │            │          │       │       │[View →]  │   │
│        │  ├────┼────────────┼──────────┼───────┼───────┼────┼────┤   │
│        │  │E03 │Document    │ GAO      │Feb 28 │Std    │ 0  │🔴No│   │
│        │  │    │            │ Archive  │       │       │    │Obj │   │
│        │  │    │            │          │       │       │[View →]  │   │
│        │  └────┴────────────┴──────────┴───────┴───────┴────┴────┘   │
│        │  Showing 3 of 3 items                                        │
└────────┴──────────────────────────────────────────────────────────────┘
```

**Column key:** ID = short evidence ID; Obj = linked objective count; File = attached file count; 🔴 = unlinked (no objectives)

---

## Layout — Add Evidence Form (Modal / Side Panel)

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Evidence Item                                          [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Evidence Type *                                                 │
│  ┌─────────────────────────────────┐                            │
│  │ Interview Note              ▾   │                            │
│  └─────────────────────────────────┘                            │
│  Options: Document / Dataset / Interview Note /                  │
│           Meeting Note / Other                                   │
│                                                                  │
│  Source *                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Agency Budget Office, Staff Interview             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Date Received *   [MM/DD/YYYY]                                  │
│  ┌──────────────┐                                               │
│  │ 03/05/2026   │                                               │
│  └──────────────┘                                               │
│  ℹ Date evidence was received, not date of event                │
│                                                                  │
│  Custodian / Provider                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Director Jane Smith                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Sensitivity *                                                   │
│  ○ Standard (visible to all engagement team members)            │
│  ○ Restricted (visible to AN, EM, QA, IR, PC only)             │
│                                                                  │
│  Description                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ── LINK TO OBJECTIVES (optional, can add after saving) ──      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☐ Obj 1: Assess adequacy of internal budget controls... │    │
│  │ ☐ Obj 2: Evaluate data reliability...                   │    │
│  │ ☐ Obj 3: Review compliance...                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ── UPLOAD FILES ───────────────────────────────────────────    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [📎 Choose Files]  or drag & drop here                 │    │
│  │  Allowed: PDF, DOCX, DOC, XLSX, XLS, CSV, TXT, PNG,    │    │
│  │           JPG, JPEG, ZIP · Max 50MB per file · Max 20   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Cancel]                              [Save Evidence Item]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layout — Evidence Detail Page

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Evidence > E-001             │
│        │  [Standard]  Interview Note  ·  Mar 5, 2026                  │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  SOURCE         Agency Budget Office — Staff Interview        │
│        │  CUSTODIAN      Director Jane Smith                          │
│        │  DATE RECEIVED  March 5, 2026                               │
│        │  UPLOADED BY    Priya Nair · March 5, 2026 14:32            │
│        │  DESCRIPTION    Interview transcript re: FY2026 budget       │
│        │                                                              │
│        │  ── LINKED OBJECTIVES ──────────────────────────────────── │
│        │  ✓ Obj 1: Assess adequacy of internal budget controls...    │
│        │  ✓ Obj 3: Review compliance with reporting requirements...  │
│        │  [+ Link to another objective]                               │
│        │                                                              │
│        │  ── ATTACHED FILES ─────────────────────────────────────── │
│        │  📄 interview-transcript-2026-03-05.pdf (2.4 MB)   [↓]     │
│        │  [+ Upload additional file]                                  │
│        │                                                              │
│        │  ── LINKED FINDINGS ────────────────────────────────────── │
│        │  FD-001: Budget controls show systematic weakness in...     │
│        │                                                              │
│        │  [Edit Evidence]  [Delete Evidence]  [View Audit Trail]     │
└────────┴──────────────────────────────────────────────────────────────┘
```

Delete is blocked if the evidence is linked to any objective, finding, or reference statement (HTTP 409 inline error).

---

## Layout — Gap View (Show Gaps toggle)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Evidence Gap View — Objectives with No Evidence                     │
│  [← Back to Evidence List]                            [Hide Gaps ▲]  │
├──────────────────────────────────────────────────────────────────────┤
│  1 of 3 objectives have no linked evidence (P3 blocker)              │
│                                                                       │
│  ┌─────────────────────────────────────────────┬──────────┬────────┐ │
│  │ Objective                                   │ Evidence │ P3     │ │
│  ├─────────────────────────────────────────────┼──────────┼────────┤ │
│  │ Obj 2: Evaluate data reliability of agency  │ 🔴 None  │Blocker │ │
│  │ financial reporting systems [evidence_needed]│          │        │ │
│  │ 12 days until evidence milestone            │ [Link →] │        │ │
│  └─────────────────────────────────────────────┴──────────┴────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Objective coverage summary bar + gap count | Top of evidence list |
| Primary | Evidence list with sensitivity badges + link counts | Main content |
| Secondary | Add evidence form with inline objective linking | Modal/panel |
| Secondary | Gap view (toggle) | Below coverage bar |
| Tertiary | Filters, search, export | Action bar above list |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Evidence list with coverage bar | Coverage bar shows linked/total count |
| No evidence yet | Empty state illustration | "No evidence added yet. Add your first evidence item." + [+ Add Evidence] |
| Gap exists | Red badge on coverage bar; gap row in list | "🔴 No objectives linked" badge on evidence row |
| File uploading | Progress bar in upload area | "Uploading… 45%" |
| File too large | Inline error under upload area | "File exceeds maximum size of 50 MB." |
| Restricted evidence (AL/RO view) | Row hidden entirely | Restricted items do not appear |
| Saving | Button spinner | "Saving…" |
| Save success | Modal closes; list updates | Toast: "Evidence item saved." |
| Delete blocked | Inline error in delete confirmation | "Cannot delete — linked to objectives or findings. Unlink first." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| + Add Evidence | Primary button | Opens slide-in panel with evidence form |
| Export CSV | Secondary button | Downloads CSV scoped to current engagement; restricted items excluded for AL/RO |
| Show Gaps | Toggle link | Filters list to show only objectives with zero linked evidence |
| Evidence row | Clickable row | Opens evidence detail page |
| Link to objective checkbox | Multi-select in form | Inline objective selector on save confirmation |
| Delete Evidence | Destructive button | Confirmation dialog; blocked if linked |
| Sensitivity toggle | Radio in form | Clearly explains visibility scope |

---
