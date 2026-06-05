# Flow-02: Evidence Readiness → Gate P3 (J3)

**User Stories:** US-8.1–8.5, US-9.1–9.4, US-10.1–10.4  
**Personas:** Priya Nair (AN), James Whitfield (QA)  
**Journeys:** JRN-03.1, JRN-04.1

---

## Flow 3A: Upload Evidence and Link to Objectives (AN)

**Trigger:** Engagement in phase: evidence; AN navigates to Evidence tab  
**Entry:** Engagement Shell → Evidence tab  
**Exit:** Evidence items uploaded, linked, gap view clear

```
[Evidence Tab — Evidence List]
    │
    ├── "Add Evidence" button (AN role)
    │       │
    │       ▼
    │   [New Evidence Form]
    │       │ evidence_type: dropdown (document/dataset/interview_note/meeting_note/other)
    │       │ source: text (required)
    │       │ date_received: date picker (label: "Date Received — MM/DD/YYYY")
    │       │ sensitivity: toggle (Standard / Restricted)
    │       │ description: textarea (optional)
    │       │
    │       │ File upload section:
    │       │   Drag & drop zone OR "Browse files"
    │       │   Allowed: PDF, DOCX, DOC, XLSX, XLS, CSV, TXT, PNG, JPG, JPEG, ZIP
    │       │   Max 50MB per file; max 20 files
    │       │   Per-file: progress bar → ✓ filename confirmed
    │       │
    │       ├── "Save Evidence" → EvidenceItem created
    │       │       Audit: EVIDENCE_ITEM_CREATED + EVIDENCE_FILE_UPLOADED per file
    │       │       Toast: "Evidence saved."
    │       │
    │       └── On save confirmation screen:
    │               "Link to Objectives?" section (inline)
    │               Checklist of objectives for this engagement
    │               [Link Selected Objectives] button
    │               Audit: EVIDENCE_OBJECTIVE_LINKED per link
    │
    ├── [Evidence List row] → click → Evidence Detail
    │       Shows: metadata, files list, linked objectives, linked findings
    │       Actions: "Link/Unlink Objectives", "Delete" (blocked if linked)
    │
    └── "Show Gaps" toggle (or /evidence/gaps route):
            Gap View: objectives with 0 linked evidence
            Each row: objective text (truncated 100 chars), status badge, "No Evidence" badge
            "Days to P3 target" column
            P3 blocker flag if status = evidence_needed
```

---

## Flow 3B: Create Findings (AN)

**Trigger:** AN ready to draft findings (after P2 approved, evidence uploaded)  
**Entry:** Engagement Shell → Findings tab  
**Exit:** Findings created and linked to evidence; P3 checklist ready

```
[Findings Tab]
    │
    ├── "Add Finding" button (AN role)
    │       │ finding_text: textarea (required)
    │       │ [Save Finding] → status: draft
    │       │ Audit: FINDING_CREATED
    │       │
    │       └── Link evidence section (inline):
    │               Multi-select from evidence list for this engagement
    │               [Link Evidence] → FINDING_EVIDENCE_LINKED per link
    │
    └── [Finding row] → Edit/View detail
            Shows: finding text, status, linked evidence list
            QA can update objective evidence status here
```

---

## Flow 3C: P3 Gate Review (QA)

**Trigger:** QA opens P3 review from Review Queue (or EM requests P3 review)  
**Entry:** Review Queue → P3 evidence sufficiency item  
**Exit A (Approve):** engagement.phase → draft  
**Exit B (Return):** return comments sent to EM/AN

```
[P3 Evidence Sufficiency Review Page]
    │
    │ Objective Status Table:
    │   ┌──────────────────────┬───────────────┬──────────┬──────────────┐
    │   │ Objective (truncated)│ Evidence Count│ Status   │ Action (QA)  │
    │   ├──────────────────────┼───────────────┼──────────┼──────────────┤
    │   │ Obj 1: Assess...     │ 3 items       │ Sufficient│ [Change ▾]  │
    │   │ Obj 2: Evaluate...   │ 0 items  🔴   │Ev. Needed │ [Change ▾]  │
    │   │ Obj 3: Review...     │ 1 item        │ In Review │ [Change ▾]  │
    │   └──────────────────────┴───────────────┴──────────┴──────────────┘
    │
    │ Findings Table:
    │   Each finding: text preview, evidence link count
    │   Red indicator if 0 evidence links
    │
    ├── P3 Prerequisite Block (shown above Approve button):
    │   🔴 Objective 2 has no linked evidence
    │   🔴 Finding "Agency data shows..." has no linked evidence
    │   → "Approve P3" button disabled while any red items exist
    │
    ├── "Approve P3" (QA role):
    │       │ Approval comment (≥10 chars)
    │       └── Valid + all prerequisites pass →
    │               GateDecision: P3=approved
    │               engagement.phase → draft
    │               Audit: GATE_P3_APPROVED
    │               Banner: "Gate P3 approved. Engagement now in Draft phase."
    │
    └── "Return" (QA role):
            │ Return comment (≥10 chars)
            └── GateDecision: P3=returned
                    Audit: GATE_P3_RETURNED
                    Toast: "Returned for revision."
```

---
