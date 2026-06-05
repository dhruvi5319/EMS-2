# Flow-01: Planning Setup → Gate P2 (J2)

**User Stories:** US-4.1, US-4.2, US-5.1, US-5.2, US-5.3, US-6.1, US-6.2, US-6.3, US-6.4, US-7.1, US-7.2, US-7.3, US-7.4  
**Personas:** Diana Okafor (EM), James Whitfield (QA)  
**Journeys:** JRN-02.1, JRN-04.1

---

## Flow 2A: Engagement Setup (EM)

**Trigger:** A1 approved → EM opens new Engagement Shell  
**Entry:** Engagement Shell (phase: planning)  
**Exit:** Planning record submitted for P2 review

```
[Engagement Shell — planning phase]
    │ Pre-populated: title (from request.topic), risk_level (from A1 decision)
    │ Empty: portfolio, team, milestones, planning record
    │
    ├── Tab: Metadata (default)
    │       │ EM edits: title, portfolio, owner (must be EM role user)
    │       │ EM clicks "Save" → Audit: ENGAGEMENT_UPDATED
    │       │
    ├── Tab: Team
    │       │ EM clicks "Add Team Member"
    │       │ → Searchable user dropdown + role selector
    │       │ → Click "Add" → TeamAssignment created
    │       │     Audit: TEAM_MEMBER_ASSIGNED
    │       │ Required: ≥1 QA Reviewer before P2 submission
    │       │
    │       │ Milestone section (same tab):
    │       │ → Date pickers for P2, P3, Draft, P4 targets
    │       │ → Chronological order enforced
    │       │ → Audit: MILESTONES_UPDATED
    │       │
    └── Tab: Planning Record
            │
            ├── [No record yet] → "Start Planning Record" button
            │       │
            │       ▼
            │   Planning Record created (status: draft)
            │   Audit: PLANNING_RECORD_CREATED
            │
            ├── Objectives section:
            │       │ "Add Objective" → text (required) + info need (optional)
            │       │ Drag handles for reordering
            │       │ Delete (blocked if evidence linked)
            │       │
            ├── Planning sections (save as draft at any time):
            │       │ Design Approach (optional)
            │       │ Schedule Notes (optional)
            │       │ Risk Notes (required for P2) *
            │       │ Data Reliability Notes (required for P2) *
            │       │ Independence Status (required for P2) * [affirmed/pending/exception_noted]
            │       │ * Red asterisk; turns green when filled
            │       │
            └── P2 Submission:
                    │ Pre-submit checklist (all must be green):
                    │   ✓ ≥1 objective
                    │   ✓ Risk notes present
                    │   ✓ Data reliability notes present
                    │   ✓ Independence status set
                    │   ✓ Owner assigned
                    │   ✓ ≥1 QA Reviewer on team
                    │   ✓ ≥1 milestone date set
                    │
                    ├── Any red items → "Submit for P2 Review" button disabled
                    │
                    └── All green → "Submit for P2 Review" enabled
                            │ Click → status: ready_for_review
                            │ Audit: PLANNING_SUBMITTED_FOR_REVIEW
                            │ Toast: "Submitted to QA Reviewer (James Whitfield)"
                            │ Planning record appears in QA's Review Queue
```

---

## Flow 2B: P2 Review Decision (QA)

**Trigger:** QA opens planning record from Review Queue  
**Entry:** Review Queue (items with status = ready_for_review)  
**Exit A (Approve):** Planning record locked; engagement phase → evidence  
**Exit B (Return):** Planning record → returned; EM notified; item removed from QA queue

```
[Review Queue]
    │ Shows: engagement name, submission date, "P2 Planning Review" label
    │ Sorted by: submitted_at ASC
    │
    ▼
[P2 Review Page]
    │
    │ Completeness Checklist (system-computed, displayed at top):
    │   ✓ ≥1 objective present
    │   ✓ Risk notes: present
    │   ✓ Data reliability notes: present
    │   ✓ Independence status: affirmed
    │   ✓ Owner assigned
    │   ✓ ≥1 milestone date
    │   ✓ ≥1 QA Reviewer on team
    │
    │ Full planning record displayed below (read-only)
    │ Objectives list
    │ Team summary
    │ Milestone dates
    │
    ├── "Approve" (QA role only):
    │       │ Approval comment (≥10 chars, required)
    │       │ [Approve] button
    │       │
    │       ├── Comment too short ──▶ Inline error
    │       └── Valid + all checklist items pass ──▶
    │               GateDecision: P2=approved
    │               planning_record.status → approved (locked)
    │               engagement.phase → evidence
    │               Audit: GATE_P2_APPROVED
    │               Banner: "Gate P2 approved. Engagement now in Evidence phase."
    │               Redirect → Engagement Shell
    │
    └── "Return for Revision" (QA role only):
            │ Return comment (≥10 chars, required)
            │ [Return] button
            │
            ├── Comment too short ──▶ Inline error
            └── Valid ──▶
                    GateDecision: P2=returned
                    planning_record.status → returned
                    Audit: GATE_P2_RETURNED
                    Return comment visible to EM on planning record page
                    Toast: "Planning record returned for revision."
                    Redirect → Review Queue
```

**Post-P2 Edit (EM):**
- All planning fields locked (read-only) after approval
- "Request Revision" button → EM enters revision note (≥10 chars) → fields unlock
- Save → `planning_record.status` remains `approved`; PlanningRevision record created
- Audit: PLANNING_RECORD_REVISED

---
