# Flow-00: Intake and Acceptance (J1)

**User Stories:** US-0.1, US-2.1, US-2.2, US-2.3, US-2.4, US-3.1, US-3.2, US-3.3, US-3.4  
**Personas:** Marcus Reid (AL)  
**Journeys:** JRN-01.1, JRN-01.2

---

## Flow 1A: Create and Submit a Request

**Trigger:** AL clicks "New Request" from Requests list or Dashboard  
**Entry:** Requests list page  
**Exit:** Request submitted → appears in A1 Review Queue

```
[Requests List]
    │
    ▼
[New Request Form]
    │ Enter request_type (required to save draft)
    │ Enter requester, topic, agency/program, due_date
    │ (Optional) Upload intake document
    │
    ├── "Save as Draft" ─────────────▶ [Request Detail — Draft state]
    │       │                               │
    │       │                          "Edit" button available
    │       │                          Toast: "Draft saved [timestamp]"
    │       │
    └── "Submit" ──▶ [Validation check]
                          │
                          ├── Missing required fields ──▶ [Inline field errors]
                          │                                 (remain on form)
                          │
                          └── All fields valid ──▶ [Request Detail — Submitted]
                                                        │
                                                        Toast: "Request submitted"
                                                        Status badge: "Submitted"
                                                        Appears in AL's Review Queue
```

**Key UX Rules:**
- `request_type` dropdown required before "Save as Draft" enables
- "Submit" button disabled until required-for-submit fields are populated (real-time validation)
- Past `due_date` triggers a yellow warning banner: "Due date is in the past. This is permitted for retrospective mandates." — does not block submission
- File upload shows progress indicator + filename confirmation
- After draft save: toast "Draft saved" with timestamp; redirects to request detail page
- After submission: status badge changes from "Draft" → "Submitted"; edit controls removed

---

## Flow 1B: A1 Review and Decision

**Trigger:** AL opens a submitted request from Review Queue  
**Entry:** Review Queue or Requests list (filtered: Submitted)  
**Exit A (Approve):** Engagement Shell auto-created → AL redirected to new Engagement Shell  
**Exit B (Decline):** Request status → Declined → AL returns to requests list

```
[Review Queue / Requests List]
    │ Filter: status = Submitted
    │ Sorted by: due_date ASC (oldest first)
    │
    ▼
[Request Detail Page — Submitted]
    │
    │ AL reviews: type, requester, topic, agency, due_date, notes
    │ AL downloads / reviews intake document
    │
    ├── A1 Decision Panel (visible only to AL)
    │       │
    │       ├── "Approve" path:
    │       │       │ Select risk_level: Low / Medium / High (required)
    │       │       │ Enter rationale (≥10 chars)
    │       │       │ Click "Approve"
    │       │       │
    │       │       ├── Missing risk_level ──▶ Inline error: "Risk level is required"
    │       │       ├── Rationale too short ──▶ Inline error: "Min 10 characters"
    │       │       │
    │       │       └── Valid ──▶ [Confirmation dialog]
    │       │                         "Approve engagement? This creates a new Engagement Shell."
    │       │                         [Cancel] [Confirm Approve]
    │       │                              │
    │       │                              ▼
    │       │                    Auto-create Engagement Shell
    │       │                    GateDecision: A1=approved
    │       │                    Request status → accepted
    │       │                    Audit: GATE_A1_APPROVED
    │       │                    Banner: "Engagement ENG-2026-NNNNN created. View it →"
    │       │                    Redirect → Engagement Shell
    │       │
    │       └── "Decline" path:
    │               │ Enter rationale (≥10 chars)
    │               │ Click "Decline"
    │               │
    │               ├── Rationale too short ──▶ Inline error
    │               │
    │               └── Valid ──▶ [Confirmation dialog]
    │                                 "Decline this request? This action cannot be undone."
    │                                 [Cancel] [Confirm Decline]
    │                                      │
    │                                      ▼
    │                             GateDecision: A1=declined
    │                             Request status → declined
    │                             Audit: GATE_A1_DECLINED
    │                             Toast: "Request declined and recorded."
    │                             Redirect → Requests list
    │
    └── (Already decided) ──▶ A1 Decision Panel hidden; decision summary card shown read-only
```

**Key UX Rules:**
- A1 decision controls only render when `request.status = submitted` AND user role = AL
- Risk level dropdown placed visually before approve/decline buttons
- Rationale textarea: placeholder text with example ("e.g., Scope aligns with program mandate; medium risk based on timeline.")
- Minimum character count soft indicator: "10 characters minimum — [X / 10]"
- Confirmation dialogs for both approve and decline (irreversible actions)
- Post-approval: success banner with direct link to the new Engagement Shell

---
