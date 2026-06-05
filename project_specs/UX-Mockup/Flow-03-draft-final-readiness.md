# Flow-03: Draft Readiness + Reference Check → Gate P4 (J4, J5)

**User Stories:** US-11.1–11.4, US-12.1–12.7, US-13.1–13.4  
**Personas:** Diana Okafor (EM), Priya Nair (AN), Carla Voss (IR), Tom Andrade (PC)  
**Journeys:** JRN-03.2, JRN-05.1, JRN-06.1

---

## Flow 4A: Draft Product and Indexing (EM/AN)

**Trigger:** Gate P3 approved; engagement phase = draft  
**Entry:** Engagement Shell → Draft Product tab  
**Exit:** All statements indexed and assigned for reference check

```
[Draft Product Tab]
    │
    ├── [No draft product yet] → "Create Draft Product" button (EM/AN)
    │       │ title (required)
    │       │ version (required, e.g. "v1.0")
    │       │ owner_id (user assigned to engagement, required)
    │       │ [Create] → status: drafting; Audit: DRAFT_PRODUCT_CREATED
    │
    ├── Draft Product Record (single record per engagement):
    │       │ Title, version, owner, status badge
    │       │ File attachment section:
    │       │   Upload draft file (PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP; max 50MB)
    │       │   Replaces previous file on re-upload
    │       │   Audit: DRAFT_FILE_ATTACHED
    │       │
    │       │ Review Comments section (append-only):
    │       │   [Add Comment] → non-empty text → saved with timestamp + reviewer name
    │       │   Audit: DRAFT_COMMENT_ADDED
    │       │
    │       │ Status advancement buttons (EM):
    │       │   Drafting → "Submit for Review" → Under Review
    │       │   Under Review → "Ready for Reference Check"
    │       │     (requires ≥1 statement to exist)
    │       │   Ready for Ref Check → "Ready for Final Review"
    │       │   QA: Under Review → "Return to Drafting"
    │       │   Audit: DRAFT_STATUS_CHANGED
    │
    └── Statements / Indexing sub-section:
            │
            ├── "Add Statement" (AN/EM):
            │       │ statement_text (required)
            │       │ [Save] → reference_status: not_started
            │       │ Audit: STATEMENT_CREATED
            │
            ├── Each statement row:
            │       │ Statement text (truncated)
            │       │ "Linked / Not Linked" badge (evidence count)
            │       │ Reference status badge
            │       │ [Link Evidence] → multi-select evidence picker
            │       │   Audit: STATEMENT_EVIDENCE_LINKED
            │
            └── [Assign for Reference Check] (EM, per statement):
                    │ Select IR user (must have IR role on this engagement)
                    │ Statement must have ≥1 evidence link
                    │ Audit: REFERENCE_CHECK_ASSIGNED
                    │ Statement appears in IR's Review Queue
```

---

## Flow 4B: Reference Check (IR)

**Trigger:** IR opens reference check queue  
**Entry:** Review Queue → reference check items for this engagement  
**Exit:** Statements marked Passed, Waived, or Failed (with discrepancy and reassignment)

```
[Reference Check Queue (IR)]
    │ Progress bar: "5 of 7 complete (71%)"
    │ Counts: Not Started: 2, In Review: 0, Passed: 5, Failed: 0, Waived: 0
    │
    │ Statement list (sorted by: not_started first, then in_review)
    │
    ▼
[Statement Detail]
    │ Statement text (full)
    │ Linked evidence list:
    │   [filename] [Download] [View inline if PDF]
    │
    ├── Status actions (IR role only):
    │       [In Review] [Pass] [Fail]
    │
    ├── "Pass" → reference_status: passed
    │       Audit: REFERENCE_STATUS_CHANGED
    │       Toast: "Statement passed." → return to queue
    │
    ├── "Fail" → opens discrepancy panel:
    │       │ Discrepancy notes (required when Failed)
    │       │   Structured: category dropdown
    │       │     (Wrong evidence / Insufficient detail / Statement mismatch)
    │       │   + free text
    │       │ Assign to Analyst: user selector (AN role on engagement)
    │       │ [Save Failed] → reference_status: failed
    │       │   Audit: REFERENCE_STATUS_CHANGED + REFERENCE_FAILED_DISCREPANCY
    │       │   Confirmation: "Statement assigned to [Analyst name]."
    │       │   Statement appears in Analyst's queue
    │
    └── EM can waive a statement:
            │ [Waive] button (EM/AD only)
            │ Justification text (≥10 chars, required)
            │ reference_status: waived
            │ Audit: REFERENCE_CHECK_WAIVED
```

---

## Flow 4C: Analyst Discrepancy Resolution (AN)

**Trigger:** IR fails a statement → assigned to AN  
**Entry:** AN's Review Queue (or Findings/Statements tab)  
**Exit:** Statement updated → back to IR queue (status: in_review)

```
[Analyst Queue — Failed Statements]
    │ Badge: "1 failed statement needs correction"
    │
    ▼
[Statement Edit View]
    │ Statement text (editable)
    │ Discrepancy note from IR (read-only, prominent)
    │ Current linked evidence list
    │
    ├── AN updates statement text and/or relinking evidence
    │       [Relink Evidence] → evidence registry side panel (no full page reload)
    │
    └── [Mark Revision Ready] → revision_ready: true
            → reference_status: in_review
            → Confirmation: "Sent back to referencer (Carla Voss)"
            → Appears in IR's re-check queue
```

---

## Flow 4D: Gate P4 Final Readiness (PC/EM)

**Trigger:** All reference checks Passed or Waived; no open blockers  
**Entry:** Engagement Shell → Gate P4 card → "Review Final Readiness"  
**Exit:** Engagement status → ready_for_issuance or closed

```
[Gate P4 Final Readiness Page]
    │
    │ Final Readiness Checklist:
    │   ┌───────────────────────────────────────────────────────┐
    │   │ ✓  Gate P3 approved                                   │
    │   │ ✓  No failed reference checks (7 Passed)             │
    │   │ ✓  No in-review reference checks                     │
    │   │ ✓  No not-started reference checks                   │
    │   │ ✓  No open blockers                                   │
    │   └───────────────────────────────────────────────────────┘
    │   Reference check summary: "7 statements — 7 Passed, 0 Failed, 0 Waived"
    │
    │ Gate History panel (all gates A1–P3 with approver + date)
    │
    ├── "Approve Final Readiness" (PC or EM):
    │       │ Final approval comment (≥10 chars)
    │       │ Outcome selector (PC: "Ready for Issuance" only;
    │       │                   EM/AD: "Ready for Issuance" or "Closed")
    │       │
    │       ├── Any checklist item fails → button disabled + red item explanation
    │       │
    │       └── All pass + comment valid →
    │               [Confirmation dialog]
    │               "Approve final readiness? Engagement status will be updated to [outcome]."
    │               [Cancel] [Confirm Approve]
    │                   │
    │                   ▼
    │               GateDecision: P4=approved
    │               engagement.status → ready_for_issuance (or closed)
    │               Engagement enters read-only state
    │               Audit: GATE_P4_APPROVED
    │               Banner: "Gate P4 approved. Engagement is now Ready for Issuance."
    │
    └── EM close without issuance:
            [Close Engagement] button (EM/AD)
            Confirmation dialog: "This will close the engagement. All records remain visible."
            engagement.status → closed; phase → closed
            Audit: ENGAGEMENT_CLOSED
```

---
