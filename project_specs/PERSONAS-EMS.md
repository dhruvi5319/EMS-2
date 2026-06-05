# Persona Profiles
## Lightweight Engagement Management System (EMS)

| Field | Value |
|-------|-------|
| **Product Name** | Lightweight Engagement Management System (EMS) |
| **Version** | 1.0 |
| **Date** | 2026-06-04 |
| **Related PRD** | PRD-EMS.md |
| **Related Project** | .planning/PROJECT.md |
| **Derived From** | PRD Section 2.2 — Target Users |

---

## Persona Summary Table

| ID | Name | Role Title | Primary Goal | Gate Role |
|----|------|-----------|--------------|-----------|
| PER-01 | Marcus Reid | Engagement Acceptance Lead | Accept or decline incoming requests with clear rationale and no information gaps | A1 approver |
| PER-02 | Diana Okafor | Engagement Manager | Own the engagement from setup to final readiness with one trusted system of record | P2 submitter, P4 coordinator |
| PER-03 | Priya Nair | Analyst | Upload evidence, link it to objectives, draft findings, and support indexing cleanly | Evidence contributor, P3 support |
| PER-04 | James Whitfield | QA Reviewer | Review planning and evidence completeness and approve gates with confidence | P2 approver, P3 approver |
| PER-05 | Carla Voss | Independent Referencer | Verify that each indexed draft statement is supported by the linked evidence | P4 prerequisite (reference checks) |
| PER-06 | Tom Andrade | Publishing Coordinator | Confirm final readiness fields are complete and mark the product ready after P4 | P4 final mark |
| PER-07 | Sandra Wu | Read-Only Stakeholder | Monitor engagement progress, phase, and readiness without affecting records | Observer across all phases |

---

## PER-01: Marcus Reid

**Role Title:** Engagement Acceptance Lead

**Role & Context:**
Marcus is a senior program officer who serves as the designated acceptance authority for incoming engagement requests. He receives congressional requests, mandates, and internal proposals through email, shared drives, and occasional direct handoffs — currently tracked in a spreadsheet he maintains himself. His day begins by checking whether any new requests need review and ends with documenting his decisions in a folder that no one else has reliable access to. He has 8–12 requests in various stages of review at any time and spends approximately 2–3 hours per week on acceptance-related work. He reports to a division director who expects timely and well-documented acceptance decisions. The single most painful moment in his workday is being asked "where does that request stand?" and having to piece together the answer from three different files.

**Goals:**
- Submit complete, well-documented intake records that capture all required fields for an informed decision (F2)
- Approve or decline requests through a single, auditable action with rationale recorded automatically (F3)
- Confirm that an engagement shell is created immediately on approval without manual follow-up (F3, F4)
- See all pending requests in one place with their current status (F14)
- Trust that declined requests are closed with rationale visible to others (F3)

**Pain Points:**
- Request details and intake documents are scattered across emails and shared folders with no single source (PRD §2.1 Pain 1)
- No simple way to communicate acceptance status to the broader team (PRD §2.1 Pain 2)
- Decision rationale is currently recorded only in personal notes and not durable (PRD §2.1 Pain 9)
- Post-decision, he must manually create an engagement record in a separate tracker (PRD §2.1 Pain 3)

**Technical Expertise:** Intermediate — comfortable with web-based forms and list views; not a power user; relies on clear field labels and predictable navigation.

**Top Tasks:**
1. Create and submit a new request record with intake document attached (F2 — multiple times per week, high)
2. Review a submitted request and record an A1 accept or decline decision with rationale (F3 — several times per week, critical)
3. Confirm the engagement shell was created after A1 approval (F3, F4 — every acceptance, high)
4. Check the current status of all pending requests from the portfolio dashboard (F14 — daily, medium)
5. View the audit trail to confirm a past decision is recorded correctly (F0 — as needed, medium)

**Success Criteria:**
- Can submit a complete request record in under 5 minutes
- A1 decision creates an engagement shell with no manual follow-up step required
- All acceptance decisions (approve and decline) are visible in the audit trail with actor, date, and rationale
- Can see all pending and recently decided requests in a single dashboard view

---

## PER-02: Diana Okafor

**Role Title:** Engagement Manager

**Role & Context:**
Diana is an experienced engagement manager who typically runs 2–4 concurrent engagements at different stages. She is responsible for everything between acceptance and final issuance: assembling the team, setting milestone dates, building the planning record, tracking evidence progress, and shepherding the engagement through gates P2, P3, and P4. She is the primary user of the engagement shell and spends the bulk of her workday inside it. Currently, she maintains a master spreadsheet per engagement tracking team roles, milestone dates, risk level, and gate status — a setup that breaks down whenever another team member edits the wrong cell or the spreadsheet gets out of sync with reality. She works closely with analysts, the QA Reviewer, and the Publishing Coordinator. She is the person accountable when a gate submission is delayed.

**Goals:**
- Set up the engagement shell with job code, title, owner, risk level, team, and milestone dates immediately after A1 (F4, F5)
- Build and submit a complete planning baseline for P2 review with objectives, design approach, schedule, risk notes, data reliability notes, and independence status (F6, F7)
- See current gate status, open blockers, and milestone health in one place at any time (F4, F15)
- Know exactly what is blocking a gate submission without chasing team members (F4, F15)
- Submit the engagement for P4 when all reference checks are complete (F13)

**Pain Points:**
- Core engagement metadata, team, and milestone tracking are spread across multiple documents with no single source (PRD §2.1 Pain 3)
- Planning artifacts have no formal baseline or approval point, making it unclear what was agreed before work started (PRD §2.1 Pain 4)
- Gate status is not visible from a single record — she must check several files or ask team members (PRD §2.1 Pain 6)
- Producing a weekly status report for the program director takes 3–4 hours of manual compilation (PRD §2.1 Pain 8)

**Technical Expertise:** Intermediate to advanced — comfortable with structured web forms, dashboards, and filtered list views; uses search frequently; comfortable exporting CSV for external reporting.

**Top Tasks:**
1. Set up team assignments and milestone dates for a newly accepted engagement (F5 — every acceptance, critical)
2. Create and complete the planning record and submit for P2 (F6, F7 — once per engagement, critical)
3. Review gate status and open blockers on the engagement detail dashboard (F15 — daily, high)
4. Update engagement metadata (phase, status, risk level) as the engagement progresses (F4 — frequently, high)
5. Review evidence coverage and objective gaps before gate submission (F9, F10 — weekly, high)
6. Coordinate final readiness checklist and submit for P4 approval (F13 — once per engagement, critical)

**Success Criteria:**
- Can set up a complete engagement shell with team and milestones in under 20 minutes
- Planning baseline with all required fields can be created and submitted for P2 in a single session
- Gate status, blockers, and milestone health are visible without leaving the engagement page
- Weekly status reporting takes under 30 minutes using dashboard and CSV export

---

## PER-03: Priya Nair

**Role Title:** Analyst

**Role & Context:**
Priya is a mid-career analyst assigned to one to three engagements at a time. Her core work is collecting and organizing evidence — documents, datasets, interview notes, and meeting notes — and connecting that evidence to the research objectives the planning baseline defines. She also writes draft findings and supports the indexing process by linking draft statements to the evidence that backs them. Today, Priya's evidence files sit in a shared drive organized by engagement folder, with no formal tracking of which document maps to which objective. When a QA Reviewer or Independent Referencer needs to trace a finding back to evidence, Priya must do it manually by searching filenames and her own memory. She interacts with the Engagement Manager for direction on priorities, the QA Reviewer for P3 readiness feedback, and the Independent Referencer when reference check discrepancies come back for correction.

**Goals:**
- Add evidence records with type, source, date, sensitivity, and file upload without friction (F8)
- Link each evidence item to the objectives it supports and immediately see whether any objectives remain unlinked (F9)
- Create finding records and link them to supporting evidence before gate P3 submission (F10)
- Link draft statements to evidence for reference check and resolve discrepancies quickly (F12)
- Understand exactly which objectives need more evidence through a visible gap indicator (F9, F10)

**Pain Points:**
- Currently has no structured way to record which evidence supports which objective — relies on personal notes (PRD §2.1 Pain 5)
- Draft findings have no formal linkage to evidence, making reference checks manual and slow (PRD §2.1 Pain 7)
- When a discrepancy is flagged, she learns about it through email rather than a tracked record (PRD §2.1 Pain 5, 9)
- Evidence sensitivity tracking is informal — no consistent way to flag restricted items (PRD §2.1 Pain 9)

**Technical Expertise:** Intermediate — comfortable with web forms, list views, and file uploads; uses structured tools regularly; would notice if labels or workflows were unclear but does not need advanced features.

**Top Tasks:**
1. Add a new evidence item with type, source, date, sensitivity flag, and file upload (F8 — multiple times per week, critical)
2. Link evidence items to planning objectives and check the gap view for uncovered objectives (F9 — frequently, high)
3. Create finding records linked to evidence (F10 — once per objective, high)
4. Add draft statement records and link each to evidence for the reference check queue (F12 — frequently, high)
5. Resolve a discrepancy assigned back by the Independent Referencer (F12 — as needed, medium)

**Success Criteria:**
- Can add and link an evidence item to an objective in under 3 minutes
- Objective gap view clearly shows which objectives have no linked evidence without additional navigation
- Discrepancy assignments appear in her queue with the statement, failed reference status, and discrepancy note visible
- Evidence registry can be exported to CSV for external reporting in one action

---

## PER-04: James Whitfield

**Role Title:** QA Reviewer

**Role & Context:**
James is a quality assurance reviewer who sits outside the engagement team and provides independent quality oversight at two gates: P2 (planning approval) and P3 (evidence sufficiency). He typically reviews three to five engagements concurrently, cycling through them based on gate submission queue. His current workflow involves receiving a notification by email that a planning record or evidence registry is ready for review, then navigating a shared drive to locate the relevant files and building his own checklist in a Word document to verify completeness. He rarely has a clear single view of what is blocking an engagement from moving forward. His job requires him to be methodical and to clearly document his approval or return decisions so the team understands what needs to change.

**Goals:**
- Review a planning record that already shows completeness status before he begins (F6, F7)
- Approve or return the planning baseline with comments recorded in a single action (F7)
- See all engagements currently in his review queue from one view (F14, F15)
- Confirm that P3 prerequisites are met (all objectives have sufficient evidence) before approving (F10)
- Trust that his approval decisions are recorded with his name, timestamp, and rationale in the audit trail (F7, F10)

**Pain Points:**
- No centralized queue of engagements awaiting his review — learns by email or personal follow-up (PRD §2.1 Pain 8)
- Has to manually verify planning completeness against a checklist he maintains himself (PRD §2.1 Pain 4)
- Evidence-to-objective coverage is not visible in one place — must review multiple files (PRD §2.1 Pain 5)
- Return decisions with comments are not formally tracked — the team may miss them or dispute them later (PRD §2.1 Pain 9)

**Technical Expertise:** Intermediate — prefers a clear structured review interface; comfortable with web forms and approval actions; values checklists and explicit status indicators over free-form navigation.

**Top Tasks:**
1. Review a submitted planning record for completeness and approve or return with comments (F7 — several times per week, critical)
2. Review evidence coverage per objective and approve or return P3 sufficiency (F10 — several times per week, critical)
3. Check the engagements currently awaiting his review (F14, F15 — daily, high)
4. View the audit trail to confirm a gate decision was recorded correctly (F0 — as needed, medium)
5. Review objective sufficiency status and identify any remaining evidence gaps before P3 (F10 — per P3 submission, high)

**Success Criteria:**
- Can complete a P2 or P3 review and record an approval or return decision in under 15 minutes
- Gate prerequisite status (complete vs. incomplete) is visible before he begins reviewing
- Return comments are recorded and visible to the engagement team without external communication
- All his gate decisions appear in the audit trail with actor, timestamp, and rationale

---

## PER-05: Carla Voss

**Role Title:** Independent Referencer

**Role & Context:**
Carla is an independent reviewer who performs reference checks — verifying that each indexed draft statement in the product is actually supported by the evidence it cites. She is deliberately independent from the analytical team and does not contribute to evidence collection or findings. She is assigned to an engagement after Gate P3 passes, when the draft product enters the reference check phase. Her current process involves receiving a list of statements (usually in a Word document) with corresponding evidence file locations, then reviewing each item manually and recording her results in a separate spreadsheet that she emails back to the engagement manager. This workflow is fragile: statements can be added after her review, discrepancy notes are not tracked back to the analyst, and there is no single record of which statements she reviewed and when.

**Goals:**
- See all draft statements assigned for reference check, each linked to their evidence items, in a structured queue (F12)
- Mark each statement as Passed, Failed, or In Review with discrepancy notes captured in the system (F12)
- Assign failed statements back to the Analyst for correction without relying on email (F12)
- Confirm that no statements remain In Review or Failed before the engagement can move to P4 (F13)
- Access the evidence files linked to each statement to perform her review without navigating to a separate drive (F8, F12)

**Pain Points:**
- Currently works from a statement list in a Word document with no system tracking (PRD §2.1 Pain 7)
- Cannot see whether statements were added after her review began — no version control (PRD §2.1 Pain 7)
- Discrepancy notes are sent by email and may not reach the right analyst or get lost (PRD §2.1 Pain 5, 9)
- No way to confirm that all statements have been reviewed before the engagement is marked ready (PRD §2.1 Pain 6)

**Technical Expertise:** Intermediate — needs a clean, structured work queue; comfortable with per-statement review interfaces; values clear status labels (Passed/Failed/In Review) over complex navigation.

**Top Tasks:**
1. Open the reference check queue and review assigned statements linked to evidence (F12 — per engagement, critical)
2. Mark a statement as Passed after confirming it is supported by linked evidence (F12 — multiple times per engagement, critical)
3. Mark a statement as Failed, add a discrepancy note, and assign it back to the Analyst (F12 — as needed, high)
4. Confirm that all statements are Passed or explicitly waived before the engagement advances (F12, F13 — once per engagement, high)
5. Review the evidence file associated with a statement directly from the reference check interface (F8, F12 — per statement, high)

**Success Criteria:**
- Full reference check queue for an engagement is visible in a single view with statement, evidence link, and current status
- Can mark a statement Passed or Failed and add a discrepancy note in under 2 minutes per statement
- Failed statements automatically surface in the Analyst's queue without email
- Reference check completion percentage is visible to the Engagement Manager (F15)

---

## PER-06: Tom Andrade

**Role Title:** Publishing Coordinator

**Role & Context:**
Tom is a publishing coordinator who sits at the final step of the engagement workflow. His role is to verify that all final readiness conditions are satisfied — all reference checks are complete, no blockers are open, and the gate P4 prerequisites are met — and then formally mark the product ready for issuance. He is not involved in evidence collection, planning, or the analytical work; he enters the workflow only at the end. Currently, Tom receives an email from the Engagement Manager saying the engagement is ready for final review, then checks a shared spreadsheet to confirm gate statuses and calls or emails the Independent Referencer to confirm reference checks are complete. He then records his final sign-off in a shared document that is filed in the engagement folder. The informality of this step creates risk: sign-offs can be missed, and it is not always clear whether all prerequisites were actually verified.

**Goals:**
- See a final readiness checklist that shows all P4 prerequisites explicitly (F13)
- Confirm that all reference checks are Passed or waived before marking the product ready (F12, F13)
- Record a P4 final approval with his name, timestamp, and comments in a single action (F13)
- Set the engagement status to Ready for Issuance or Closed through the system (F13)
- Confirm that the P4 audit event is recorded for governance purposes (F0, F13)

**Pain Points:**
- Has no structured checklist — currently verifies readiness informally by email and spreadsheet (PRD §2.1 Pain 6)
- Cannot confirm reference check completion without contacting the Independent Referencer directly (PRD §2.1 Pain 6, 7)
- Final approval is recorded in a shared document that can be edited or lost (PRD §2.1 Pain 9)
- Engagement status is not updated automatically when he signs off — he must notify the team separately (PRD §2.1 Pain 8)

**Technical Expertise:** Intermediate — needs a straightforward final approval interface; comfortable with checklists and status fields; does not need deep system access; values clear prerequisite indicators.

**Top Tasks:**
1. Review the final readiness checklist and confirm all P4 prerequisites are satisfied (F13 — once per engagement, critical)
2. Confirm all reference checks are Passed or waived before proceeding (F12, F13 — once per engagement, critical)
3. Record a P4 approval with comments and set engagement status to Ready for Issuance (F13 — once per engagement, critical)
4. View the engagement's gate history to confirm prior gates (A1, P2, P3) are all complete (F0, F4 — per engagement, medium)
5. Confirm the P4 audit event is recorded with his name and timestamp (F0, F13 — per engagement, medium)

**Success Criteria:**
- Final readiness checklist shows all blocking conditions with explicit pass/fail indicators
- Cannot approve P4 if any reference check is Failed or In Review — system enforces this
- P4 approval sets engagement status to Ready for Issuance and creates an audit event automatically
- Entire P4 approval step is completable in under 10 minutes

---

## PER-07: Sandra Wu

**Role Title:** Read-Only Stakeholder

**Role & Context:**
Sandra is a senior program director who needs high-level visibility into the engagement portfolio without editing any records. She monitors portfolio health for executive reporting, tracks whether key engagements are on schedule, and occasionally needs to check gate status or risk level for a specific engagement ahead of a briefing. Currently, she receives status updates through weekly email summaries that the Engagement Manager compiles manually. These summaries are often 2–3 days out of date by the time they reach her, and she has no way to self-serve a current status view when a stakeholder asks an unexpected question. She accesses the system at most a few times per week and needs to find information quickly without learning complex navigation.

**Goals:**
- See current phase, owner, risk level, next milestone, and gate status for all engagements in one view (F14)
- Drill into a single engagement to check specific gate status, milestone dates, and open blockers (F15)
- Export the engagement list to CSV for external reporting and briefing preparation (F14)
- Confirm that the information she sees is current without needing to contact the Engagement Manager (F14, F15)

**Pain Points:**
- Receives status updates by email that are days out of date (PRD §2.1 Pain 8)
- Cannot self-serve a current view of any specific engagement without asking the team (PRD §2.1 Pain 6, 8)
- Has no visibility into gate decisions or their rationale — must request them from the manager (PRD §2.1 Pain 6)
- Has no way to know whether a milestone is at risk until it is already missed (PRD §2.1 Pain 8)

**Technical Expertise:** Basic to intermediate — needs simple, immediate views; not comfortable with complex navigation; values dashboard-level clarity over detailed form views; uses search to find specific engagements.

**Top Tasks:**
1. View the portfolio dashboard showing all engagements by phase, owner, risk, and gate status (F14 — multiple times per week, high)
2. Search for and open a specific engagement to check current phase, gate status, and blockers (F15, F0 — as needed, high)
3. Export the engagement list to CSV for a briefing or report (F14 — weekly, medium)
4. View milestone dates and completion status for an engagement she is monitoring (F15 — as needed, medium)

**Success Criteria:**
- Can reach the portfolio dashboard in under 30 seconds from login
- Phase, owner, risk, next milestone, and gate status are visible without any drilldown required
- Can export the engagement list to CSV in one action
- Engagement detail page answers her questions about gate status and blockers without requiring system training

---

## Persona Relationships

| Interaction | From | To | Nature |
|-------------|------|----|--------|
| Submits request for acceptance decision | PER-01 (Acceptance Lead) | — | Initiates A1 gate; creates context for PER-02 |
| Receives accepted engagement; builds on A1 output | PER-02 (Engagement Manager) | PER-01 | Downstream of A1 approval |
| Submits planning record for P2 review | PER-02 (Engagement Manager) | PER-04 (QA Reviewer) | Planning baseline handoff |
| Returns planning record with comments | PER-04 (QA Reviewer) | PER-02 (Engagement Manager) | P2 return cycle |
| Assigns evidence and analysis work | PER-02 (Engagement Manager) | PER-03 (Analyst) | Engagement direction |
| Submits evidence and findings for P3 review | PER-03 (Analyst) | PER-04 (QA Reviewer) | Evidence sufficiency handoff |
| Returns evidence gaps with comments | PER-04 (QA Reviewer) | PER-03 (Analyst) | P3 return cycle |
| Submits draft statements for reference check | PER-03 (Analyst) | PER-05 (Independent Referencer) | Indexing handoff |
| Returns failed references for correction | PER-05 (Independent Referencer) | PER-03 (Analyst) | Discrepancy assignment loop |
| Confirms reference check completion for P4 | PER-05 (Independent Referencer) | PER-06 (Publishing Coordinator) | P4 prerequisite handoff |
| Marks final readiness after P4 checklist | PER-06 (Publishing Coordinator) | PER-02 (Engagement Manager) | Final status update |
| Views all engagements and exports for reporting | PER-07 (Read-Only Stakeholder) | All | Observation only — no edits |

---

## Feature-Persona Matrix

**Key:** P = Primary user (owns or drives the feature), S = Secondary user (uses or depends on it), — = Not directly involved

| Feature | PER-01 Acceptance Lead | PER-02 Eng Manager | PER-03 Analyst | PER-04 QA Reviewer | PER-05 Ind. Referencer | PER-06 Pub. Coordinator | PER-07 Read-Only |
|---------|----------------------|---------------------|----------------|--------------------|-----------------------|------------------------|-----------------|
| **F0** Basic Application Shell | P | P | P | P | P | P | P |
| **F1** Core Data Objects | P | P | P | P | P | P | S |
| **F2** Request Intake | P | S | — | — | — | — | — |
| **F3** Acceptance Decision — Gate A1 | P | S | — | — | — | — | S |
| **F4** Engagement Shell | S | P | S | S | — | S | S |
| **F5** Team and Milestones | S | P | S | — | — | — | S |
| **F6** Lightweight Planning Record | — | P | S | S | — | — | — |
| **F7** Planning Approval — Gate P2 | — | S | — | P | — | — | — |
| **F8** Evidence Registry | — | S | P | S | S | — | — |
| **F9** Evidence-to-Objective Link | — | P | P | S | — | — | — |
| **F10** Findings and Sufficiency — Gate P3 | — | S | P | P | — | — | — |
| **F11** Draft Product Record | — | P | S | S | — | S | — |
| **F12** Basic Indexing and Reference Check | — | S | P | — | P | S | — |
| **F13** Final Readiness — Gate P4 | — | S | — | — | S | P | — |
| **F14** Portfolio Dashboard | S | P | — | S | — | — | P |
| **F15** Engagement Detail Dashboard | — | P | S | S | S | S | P |
| **F16** Persona and Journey Artifacts | P | P | P | P | P | P | P |
| **F17** Basic Acceptance Test Generation | S | S | S | S | S | S | — |

---

*Document generated: 2026-06-04*
*Derived from: PRD-EMS.md (Section 2.2, 2.3, 5, 8) and .planning/PROJECT.md*
*Downstream consumers: JTBD, User Journeys, User Stories, UX design*
