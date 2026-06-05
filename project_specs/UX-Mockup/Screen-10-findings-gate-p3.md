# Screen-10: Findings & Gate P3 (F10)

**Purpose:** Create findings linked to evidence; QA marks objective sufficiency and approves P3  
**User Stories:** US-10.1, US-10.2, US-10.3, US-10.4  
**Personas:** Priya Nair (AN), James Whitfield (QA)  
**Journeys:** JRN-03.1, JRN-04.1

---

## Layout — Findings List (Analyst view)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Findings                     │
│        │  Phase: Evidence   [+ Add Finding]                           │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  OBJECTIVE SUFFICIENCY SUMMARY                               │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │  Obj 1  [Sufficient ✓]      Obj 2  [Evidence Needed🔴]│   │
│        │  │  Obj 3  [In Review ○]                                 │    │
│        │  │  P3 Gate Status: BLOCKED — 1 objective has no evidence│    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌────────────────────────────────────────────────────────┐  │
│        │  │ FD-001  [Draft]                              [Edit][✕] │  │
│        │  │ Budget controls show systematic weaknesses in quarterly │  │
│        │  │ reconciliation processes for FY2026.                   │  │
│        │  │ Evidence: E-001 (Interview Note) · E-002 (Dataset)     │  │
│        │  │ Objectives: Obj 1 ✓                                    │  │
│        │  ├────────────────────────────────────────────────────────┤  │
│        │  │ FD-002  [Draft]                              [Edit][✕] │  │
│        │  │ Agency financial reporting systems lack documented      │  │
│        │  │ data validation procedures.                             │  │
│        │  │ Evidence: None linked 🔴                                │  │
│        │  │ Objectives: Obj 3                                       │  │
│        │  └────────────────────────────────────────────────────────┘  │
│        │                                                              │
│        │  P3 GATE PREREQUISITES (visible to all)                      │
│        │  🔴 Obj 2 has no linked evidence (P3 blocker)               │
│        │  🔴 FD-002 has no linked evidence (P3 blocker)              │
│        │  ✓  P2 approved                                              │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Add Finding Form (Modal)

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Finding                                               [✕]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Finding Text *                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Budget controls show systematic weaknesses in     │    │
│  │ quarterly reconciliation processes...                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  💡 Tip: Describe a clear conclusion or observation supported   │
│     by your evidence.                                            │
│                                                                  │
│  Link to Evidence (required before P3) *                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ☑ E-001  Interview Note — Agency Budget Office           │    │
│  │ ☑ E-002  Dataset — OMB Budget [Restricted]              │    │
│  │ ☐ E-003  Document — GAO Archive                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ⚠  At least one evidence item must be linked before P3.        │
│                                                                  │
│  [Cancel]                                    [Save Finding]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layout — P3 Evidence Sufficiency Review (QA view)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Review Queue > ENG-2026-00001 — P3 Evidence Sufficiency     │
│        │  Submitted: March 15, 2026 · Phase: Evidence                 │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── OBJECTIVE SUFFICIENCY TABLE ───────────────────────── │
│        │  ┌──────────────────────────────────┬────────────┬───────┐  │
│        │  │ Objective                        │ Evidence   │Status │  │
│        │  ├──────────────────────────────────┼────────────┼───────┤  │
│        │  │ Obj 1: Assess adequacy of        │ 2 items    │[Set ▾]│  │
│        │  │ internal budget controls...      │ ✓ Sufficient│Suff. │  │
│        │  ├──────────────────────────────────┼────────────┼───────┤  │
│        │  │ Obj 2: Evaluate data reliability │ 0 items    │[Set ▾]│  │
│        │  │ of financial reporting...        │ 🔴 No evid.│Evid.  │  │
│        │  │                                  │            │Needed │  │
│        │  ├──────────────────────────────────┼────────────┼───────┤  │
│        │  │ Obj 3: Review compliance with    │ 1 item     │[Set ▾]│  │
│        │  │ reporting requirements...        │ ○ In Review│In Rev.│  │
│        │  └──────────────────────────────────┴────────────┴───────┘  │
│        │  QA can set status: Evidence Needed / In Review / Sufficient │
│        │  Cannot mark In Review or Sufficient with 0 evidence items   │
│        │                                                              │
│        │  ── FINDINGS LIST ──────────────────────────────────────── │
│        │  FD-001: Budget controls show weaknesses...                  │
│        │         Evidence: E-001, E-002 ✓                             │
│        │  FD-002: Agency financial reporting lacks procedures...      │
│        │         Evidence: None linked 🔴                             │
│        │                                                              │
│        │  ── P3 PREREQUISITES CHECKLIST ────────────────────────── │
│        │  🔴 Obj 2 has status Evidence Needed (P3 blocked)           │
│        │  🔴 FD-002 has no linked evidence (P3 blocked)              │
│        │  ✓  P2 approved                                              │
│        │  ✓  Obj 1 has ≥1 linked evidence item                       │
│        │                                                              │
│        │  ── P3 DECISION (QA role only) ─────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │  Decision Comment *                                     │ │
│        │  │  ┌───────────────────────────────────────────────────┐  │ │
│        │  │  │ e.g., Returning — Objective 2 has no linked       │  │ │
│        │  │  │ evidence. FD-002 must be linked before P3.        │  │ │
│        │  │  └───────────────────────────────────────────────────┘  │ │
│        │  │  [Return for Revision]    [✓ Approve P3] (disabled🔴)  │ │
│        │  └─────────────────────────────────────────────────────────┘ │
└────────┴──────────────────────────────────────────────────────────────┘
```

Approve P3 button is disabled while any prerequisite shows 🔴.

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Objective sufficiency summary + P3 gate status | Top of page |
| Primary | P3 prerequisites checklist (QA view) | Above decision panel |
| Secondary | Findings list with evidence links | Main scrollable area |
| Secondary | P3 decision panel (QA only) | Bottom, sticky if space |
| Tertiary | Objective status dropdown controls | Within objective table |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| All objectives sufficient | Green summary bar; Approve active | "All objectives are sufficient. P3 ready to approve." |
| Evidence gap exists | Red badges on objectives/findings | Named blocker: "Objective 2 has no linked evidence." |
| No findings yet | Empty state | "No findings added. Add findings and link to evidence before P3." |
| Approving P3 | Button spinner | "Processing P3 approval…" |
| P3 approved | Redirect + banner on Engagement Shell | "Gate P3 approved. Engagement now in Draft phase." |
| Returning P3 | Return dialog | "Confirm return? Add return comment." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| + Add Finding | Primary button | Modal with finding text + evidence link selector |
| Objective status dropdown | Select (QA/EM/AD only) | Sets evidence_needed / in_review / sufficient; blocked without evidence |
| Approve P3 | Primary button (QA only) | Disabled while any prerequisite fails |
| Return for Revision | Secondary button (QA only) | Requires comment ≥10 chars |
| Evidence link selector | Multi-select | Filtered to current engagement's evidence |

---
