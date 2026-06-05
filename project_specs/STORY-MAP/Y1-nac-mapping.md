## NaC-to-Acceptance Criteria Mapping

*Verifies that each Natural Acceptance Criteria aligns with the testable acceptance criteria in UserStories-EMS.md.*

| NaC-ID | NaC Statement (Key Clause) | Governed Stories | UserStory AC Alignment | Status |
|--------|---------------------------|-----------------|----------------------|--------|
| NaC-01.1 | Complete intake record submitted ≤5 min; missing fields return HTTP 422 with per-field errors | US-2.1, US-2.2, US-2.3, US-2.4 | US-2.2 AC: "Submission requires all fields; missing required fields return HTTP 422 with per-field error messages." US-2.3 AC: "Audit event REQUEST_DOCUMENT_UPLOADED written on successful upload." | ✓ Aligned |
| NaC-01.2 | A1 approve creates engagement shell + audit event; decline creates GateDecision with no shell | US-3.1, US-3.2, US-3.3, US-3.4 | US-3.2 AC: "Successful approval creates a GateDecision record and an Engagement record; audit event GATE_A1_APPROVED written." US-3.3 AC: "Successful decline creates a GateDecision record; no Engagement Shell created; GATE_A1_DECLINED written." | ✓ Aligned |
| NaC-01.3 | All requests listed with current status and filterable; no additional navigation | US-3.1, US-2.5 | US-3.1 AC: "Review Queue shows all requests with status=submitted; only AL role sees A1 decision controls." | ✓ Aligned (extended by R5 dashboard) |
| NaC-02.1 | Engagement shell pre-populated; team and milestones saved and visible | US-4.1, US-4.2, US-5.1, US-5.2, US-5.3, US-5.4 | US-4.1 AC: "Shell page displays job code, title, phase, status, risk level, owner, gate status cards, open blockers, linked artifact counts." US-5.3 AC: "Milestone dates in chronological order enforced; MILESTONES_UPDATED written." | ✓ Aligned |
| NaC-02.2 | Planning record submitted for P2 in one action; missing prerequisites return HTTP 422 | US-6.1, US-6.2, US-6.3, US-6.4, US-6.5, US-7.1 | US-6.4 AC: "Submission requires ≥1 objective, non-empty risk notes, data reliability notes, independence status, owner, ≥1 QA Reviewer, ≥1 milestone date; each missing prerequisite returns HTTP 422 with specific P2_PREREQUISITE_FAILED error." | ✓ Aligned |
| NaC-02.3 | Gate status, blockers, evidence gaps, reference progress all visible without additional navigation | US-4.1, US-4.3, US-4.4, US-15.2, US-15.6 | US-4.3 AC: "Blockers list dynamically computed; each blocker identifies specific record affected; 'No open blockers' shown when none exist." US-15.2 AC: "Four gate cards with status, approver, date, prerequisite status summary." | ✓ Aligned |
| NaC-03.1 | Evidence added with metadata, uploaded, linked to objective; gap view updated | US-8.1, US-8.2, US-8.3, US-8.4, US-9.1, US-9.2, US-9.3, US-9.4 | US-8.1 AC: "Required fields enforced; EVIDENCE_ITEM_CREATED written; immediately visible in evidence list." US-9.3 AC: "Gap view shows objectives with zero linked evidence; evidence_needed objectives flagged as P3 blockers." | ✓ Aligned |
| NaC-03.2 | Findings linked to evidence; P3 blocked when any objective has status=evidence_needed | US-10.1, US-10.2, US-10.3, US-10.4 | US-10.4 AC: "P3 cannot be approved if any objective has status=evidence_needed; P3 cannot be approved if any objective has zero linked evidence; P3 cannot be approved if any finding has zero evidence links." | ✓ Aligned |
| NaC-03.3 | Failed statement appears in Analyst queue with statement text, evidence link, discrepancy note | US-12.1, US-12.2, US-12.5 | US-12.5 AC: "Failed statements appear in Analyst's queue for correction; Analyst can update statement text or evidence links; REFERENCE_FAILED_DISCREPANCY written when statement is failed with discrepancy notes." | ✓ Aligned |
| NaC-04.1 | Completeness status shown before review; approve or return recorded in single action with audit event | US-7.1, US-7.2, US-7.3, US-7.4 | US-7.1 AC: "P2 prerequisite checklist displayed with pass/fail indicators." US-7.2 AC: "Approval comment required ≥10 chars; GATE_P2_APPROVED written; non-QA returns HTTP 403." | ✓ Aligned |
| NaC-04.2 | P3 blocked if any objective Evidence Needed; specific objectives identified in the block message | US-10.3, US-10.4, US-9.3, US-15.4 | US-10.4 AC: "P3 cannot be approved if any objective has status=evidence_needed (returns HTTP 409)." US-10.3 AC: "Cannot mark in_review or sufficient if zero linked evidence items (returns HTTP 422)." | ✓ Aligned |
| NaC-04.3 | Review queue lists all P2/P3 pending submissions with gate type and submission date; sortable | US-7.1, US-10.4, US-14.1, US-14.3 | US-7.1 AC: "QA Reviewer navigates to Review Queue and sees planning records with status=ready_for_review." | ✓ Aligned (full queue sorting in R5) |
| NaC-05.1 | All draft statements in queue with evidence accessible inline; status updated per statement in ≤2 min | US-12.3, US-12.4, US-12.7 | US-12.4 AC: "IR can access linked evidence files directly from statement review interface; REFERENCE_STATUS_CHANGED written on each change." | ✓ Aligned |
| NaC-05.2 | Failed statement with discrepancy note in Analyst queue automatically; IR can confirm routing in-session | US-12.5 | US-12.5 AC: "Failed statements appear in Analyst's queue for correction; IR's Review Queue surfaces the revised statement for re-check." | ✓ Aligned |
| NaC-06.1 | P4 checklist shows all prerequisites; approval sets status to Ready for Issuance with audit event | US-13.1, US-13.2, US-13.4 | US-13.1 AC: "Checklist items: P3 approved, no failed/in-review/not-started ref checks, no open blockers; 'Approve P4' disabled until all items show ✓." US-13.2 AC: "Successful approval creates GateDecision (P4/approved), updates status and phase, writes GATE_P4_APPROVED." | ✓ Aligned |
| NaC-06.2 | P4 blocked while any reference check is Failed or In Review; reference check summary visible on P4 page | US-13.1, US-13.2, US-12.7, US-15.5 | US-13.2 AC: "P4 cannot be approved if any reference check is failed, in_review, or not_started (returns HTTP 409)." US-12.7 AC: "Reference check progress view shows total, by-status counts, and completion percentage." | ✓ Aligned |
| NaC-07.1 | Portfolio dashboard is default landing; all engagements listed with required columns; CSV export one action | US-14.1, US-14.2, US-14.3, US-14.4 | US-14.3 AC: "List columns include Engagement ID, Title, Phase, Status, Owner, Risk Level, Next Milestone, Gate Status, Due Date; loads within 3 seconds for ≤100 engagements." US-14.4 AC: "ENGAGEMENT_REGISTER_EXPORTED written on export." | ✓ Aligned |
| NaC-07.2 | Engagement detail page shows gate status, milestones, blockers, gate history; RO read-only enforced | US-15.1, US-15.2, US-15.3, US-15.6, US-0.4 | US-15.2 AC: "Four gate cards with status, approver, decision date, prerequisite status summary." US-15.6 AC: "Blockers panel always visible when blockers exist; each blocker labeled with link to affected record." | ✓ Aligned |

**Result: All 18 NaC are aligned with acceptance criteria in UserStories-EMS.md. No misalignments detected.**

---

## Validation Checklist

- [x] Every UserStory (US-0.1 through US-17.5) appears in the map — **79 stories mapped, 0 orphans**
- [x] Every mapped story has a NaC derived from a specific JTBD outcome
- [x] NaC Derivation Table has full traceability chains (JTBD-ID → Journey Stage → NaC text → Stories)
- [x] Release planning groups are defined — 5 releases, each with theme, gate, and stories
- [x] Each release enables at least one complete journey (R1=J1, R2=J2, R3=J3, R4=J4+J5, R5=full dashboard layer)
- [x] Coverage analysis identifies gaps, orphans, and partial JTBD coverage across releases
- [x] NaC-to-Acceptance Criteria mapping verifies alignment between NaC and UserStory ACs
- [x] All 18 JTBD outcomes are addressed
- [x] No JTBD outcomes without associated NaC
- [x] No journey stages without coverage

---

*Document generated: 2026-06-05*
*Source artifacts: PERSONAS-EMS.md v1.0, JTBD-EMS.md v1.0, JOURNEYS-EMS.md v1.0, UserStories-EMS.md v1.0, PRD-EMS.md v1.0*
*Release structure: Gate-sequenced A1 → P2 → P3 → P4 per PROJECT.md*
*Downstream consumers: Sprint planning, UX design, acceptance test scripts, stakeholder briefings*
