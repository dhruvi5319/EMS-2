# User Journey Maps
## Lightweight Engagement Management System (EMS)

| Field | Value |
|-------|-------|
| **Product Name** | Lightweight Engagement Management System (EMS) |
| **Version** | 1.0 |
| **Date** | 2026-06-04 |
| **Related Personas** | PERSONAS-EMS.md (PER-01 through PER-07) |
| **Related JTBD** | JTBD-EMS.md |
| **Related PRD** | PRD-EMS.md |
| **Related Project** | .planning/PROJECT.md |

---

## Journey Index

| JRN-ID | Persona | Scenario | Key JTBD | Stages |
|--------|---------|----------|----------|--------|
| JRN-01.1 | PER-01 Marcus Reid (Acceptance Lead) | Create and submit a new intake request from scratch | JTBD-01.1 | 5 |
| JRN-01.2 | PER-01 Marcus Reid (Acceptance Lead) | Review a submitted request and record an A1 accept or decline decision | JTBD-01.2, JTBD-01.3 | 6 |
| JRN-02.1 | PER-02 Diana Okafor (Engagement Manager) | Set up the engagement shell and planning record after A1 approval → Gate P2 | JTBD-02.1, JTBD-02.2 | 6 |
| JRN-02.2 | PER-02 Diana Okafor (Engagement Manager) | Monitor gate status and identify blockers on an active engagement | JTBD-02.3 | 4 |
| JRN-03.1 | PER-03 Priya Nair (Analyst) | Upload evidence, link to objectives, and check for gaps → Gate P3 support | JTBD-03.1, JTBD-03.2 | 6 |
| JRN-03.2 | PER-03 Priya Nair (Analyst) | Add draft statements, link to evidence, and resolve a discrepancy from the referencer | JTBD-03.3 | 5 |
| JRN-04.1 | PER-04 James Whitfield (QA Reviewer) | Review planning baseline and record P2 decision; later review evidence sufficiency for P3 | JTBD-04.1, JTBD-04.2, JTBD-04.3 | 6 |
| JRN-05.1 | PER-05 Carla Voss (Independent Referencer) | Work through the reference check queue and flag a failed statement for analyst correction | JTBD-05.1, JTBD-05.2 | 5 |
| JRN-06.1 | PER-06 Tom Andrade (Publishing Coordinator) | Verify final readiness checklist and record P4 approval → Ready for Issuance | JTBD-06.1, JTBD-06.2 | 5 |
| JRN-07.1 | PER-07 Sandra Wu (Read-Only Stakeholder) | View portfolio dashboard and drill into a specific engagement ahead of a briefing | JTBD-07.1, JTBD-07.2 | 4 |

---

## PER-01: Marcus Reid — Engagement Acceptance Lead

---

### JRN-01.1: Submitting a New Request Record

**Persona:** PER-01 (Marcus Reid, Engagement Acceptance Lead)

**Scenario:** Marcus has received a congressional request by email. He needs to capture all required fields and attach the intake document before the end of day so the decision package is on record before his weekly review session.

**Related Jobs:** JTBD-01.1

**Gate:** Gate A1 (upstream — intake precondition)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Arrive** | Logs in to EMS, navigates to Requests section | Login page → Dashboard → Requests list (F0, F14) | "Let me get this request captured before it falls through the cracks." | Neutral, slightly rushed | Remembers the last time a request sat in his email for a week with no record | Fast login with saved session; Requests link prominently in main nav |
| **2. Create** | Clicks "New Request," selects request type (Congressional Request), enters requester name and topic | New Request form (F2) | "I have all the basics from the email — let me fill these in now." | Focused | Some fields are unfamiliar — "agency/program" vs. "requester" ambiguity | Inline field labels with brief help text; auto-focus on first field |
| **3. Complete** | Enters due date, topic, agency/program, and notes; uploads intake PDF from local drive | Request form — file upload section (F2, F1) | "Is this the right file? Let me double-check before I save." | Careful, mildly anxious | File upload is slow or unclear whether it succeeded | Upload progress indicator; filename confirmation after upload |
| **4. Save Draft** | Clicks "Save as Draft" before submitting to review the record once more | Request form — draft state (F2) | "I'll save this and confirm everything looks right before I submit." | Relieved | No visual confirmation that draft was saved | Toast notification: "Draft saved" with timestamp |
| **5. Submit** | Reviews the draft, clicks "Submit," confirms all required fields are present | Request detail page — submitted state (F2) | "Done. Now it's in the queue and I can point to it." | Satisfied | Required field validation triggers late — after submit attempt | Inline real-time validation; "Ready to submit" green indicator before button click |

**Key Moments:**
- **Delight Opportunity — Step 3:** A successful file upload confirmation eliminates the anxiety of wondering whether the attachment was received.
- **Risk of Abandonment — Step 2:** If field labels are unclear (e.g., "agency/program" vs. "requester"), Marcus may fill fields incorrectly and not discover the error until the acceptance review.
- **Decision Point — Step 4:** Marcus chooses to save as Draft rather than submit immediately — the system must preserve this state reliably across sessions.

**Success Outcome:**
Marcus creates and submits a complete request record — including an attached intake document — in under 5 minutes with no fields left blank (JTBD-01.1 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Arrive | F0 (App Shell), F14 (Portfolio Dashboard — request list) |
| Create | F2 (Request Intake), F1 (Request entity) |
| Complete | F2 (Request Intake — upload), F1 (Request entity) |
| Save Draft | F2 (Draft state) |
| Submit | F2 (Submit action), F1 (Request status → Submitted) |

---

### JRN-01.2: Reviewing a Request and Recording an A1 Decision

**Persona:** PER-01 (Marcus Reid, Engagement Acceptance Lead)

**Scenario:** Three requests are now in Submitted status. Marcus opens the portfolio dashboard, picks the oldest one, reviews the intake record, decides to approve it, and records his rationale. He then checks the engagement was created automatically before moving to the next request.

**Related Jobs:** JTBD-01.2, JTBD-01.3

**Gate:** Gate A1 (primary — decision event)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Survey** | Opens Dashboard, scans the Requests list filtered by "Submitted" | Portfolio dashboard — requests section (F14, F0) | "How many are waiting on me? Which is most urgent?" | Slightly anxious, purposeful | No clear urgency indicator — all submitted requests look identical | Sort by due date by default; highlight overdue or due-soon rows |
| **2. Open Request** | Clicks oldest submitted request to open the detail page | Request detail page (F2, F1) | "Let me read through the full intake package — is everything here?" | Focused | Must scroll to verify intake document is attached | Intake document link prominently placed at top of detail page |
| **3. Review** | Reads intake fields, opens and scans the attached intake document | Request detail — intake document viewer / download (F2) | "The scope looks reasonable. Risk is moderate. I'm ready to decide." | Confident | Cannot annotate the document in-system — must do it externally | Future: inline annotation; for v1, clear field summary reduces document-dependency |
| **4. Record Risk Level** | Selects risk level (Medium) from dropdown before approving | Request detail — A1 action panel (F3) | "Medium risk is right for this one. I want that on the record." | Deliberate | Risk level field is easy to miss if not prominently surfaced | Required risk level field with explicit label before approve/decline buttons |
| **5. Decide** | Clicks "Approve," enters rationale text, confirms | A1 decision dialog (F3) | "Once I click this, the engagement should appear automatically. Let me make sure the rationale is clear." | Accountable | Rationale field has no character guidance — is one sentence enough? | Placeholder text with example rationale; minimum-character soft guidance |
| **6. Confirm** | Sees confirmation that engagement shell was created; navigates to the new engagement record to verify | Engagement shell (F4); portfolio dashboard update (F14) | "Good — there it is. Now the team can start setup without waiting for me." | Relieved, satisfied | Without an explicit link to the new engagement, he might not know where it went | Post-approval banner: "Engagement EMS-XXXX created. View it →" |

**Key Moments:**
- **Decision Point — Step 5:** The approve action is irreversible in normal workflow; the rationale text field is the primary accountability record. Poor UX here (no placeholder, no confirmation) creates governance risk.
- **Delight Opportunity — Step 6:** The automatic engagement shell creation with a direct link proves the system did the work for him — eliminating the manual follow-up step he currently performs.
- **Risk of Abandonment — Step 1:** If the request list shows no urgency signals, Marcus may delay decisions and requests age without attention.

**Success Outcome:**
A1 approval creates an engagement shell with zero manual follow-up steps; the decision is visible in the audit trail and portfolio dashboard within seconds (JTBD-01.2 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Survey | F14 (Portfolio Dashboard), F0 (App Shell — navigation, filters) |
| Open Request | F2 (Request Intake — detail), F1 (Request entity) |
| Review | F2 (Request detail — document link) |
| Record Risk Level | F3 (Gate A1 — risk field) |
| Decide | F3 (Gate A1 — approve/decline action), F0 (Audit event) |
| Confirm | F4 (Engagement Shell — auto-created), F14 (Dashboard — updated status) |

---

## PER-02: Diana Okafor — Engagement Manager

---

### JRN-02.1: Setting Up the Engagement Shell and Planning Record → Gate P2

**Persona:** PER-02 (Diana Okafor, Engagement Manager)

**Scenario:** Gate A1 was approved yesterday. Diana opens the newly created engagement shell, completes all metadata, assigns her team, sets milestone dates, builds the planning record with objectives and risk notes, and submits it for P2 review — all in a single morning session.

**Related Jobs:** JTBD-02.1, JTBD-02.2

**Gate:** Gate P2 (primary — planning baseline submission)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open Shell** | Navigates to the new engagement shell from the dashboard notification or engagements list | Engagement shell (F4) | "Good — it's already pre-populated with the request data. Let me verify and fill in the rest." | Purposeful, slightly rushed | Engagement shell is mostly empty — unclear which fields are required vs. optional | Required fields highlighted; pre-populated request data with clear "From accepted request" label |
| **2. Complete Metadata** | Enters job code, confirms title and owner, sets risk level, adds portfolio reference | Engagement shell — metadata section (F4, F1) | "Job code always comes from finance — let me grab that and paste it in." | Focused | Job code comes from a separate system — must manually copy it | v1: text field; future: job code lookup integration |
| **3. Assign Team** | Adds team members to predefined role slots (QA Reviewer, Analyst, Independent Referencer, Publishing Coordinator) | Team section (F5) | "I need to make sure James and Priya are both on this engagement before I submit anything." | Organized | Team roster is in a separate email thread — must context-switch to find names | Searchable user list; suggested assignees based on role |
| **4. Set Milestones** | Enters target dates for P2, P3, draft readiness, and P4; sets status to Not Started for each | Milestones section (F5) | "I'll work backwards from the due date. P4 four weeks out means P2 needs to be done this week." | Calculated, slightly stressed | No calendar aid — must mentally calculate dates | Date picker with "weeks from now" shortcut; auto-populate P3 and P4 from a gap formula |
| **5. Build Planning Record** | Opens the planning record tab; enters objectives (3), design approach, schedule summary, risk notes, data reliability notes; sets independence status per team member | Planning record form (F6) | "I need at least three objectives to cover the full scope. Are my notes clear enough for James to approve?" | Thorough, mildly anxious | Independence affirmation is collected via separate email right now — hard to track who has confirmed | In-system per-team-member checkbox: "Independence affirmed"; auto-populates from team assignments |
| **6. Submit for P2** | Confirms all required fields are complete (green indicators); clicks "Submit for P2 Review" | Planning record — P2 submit action (F7) | "The system is blocking submit until all fields are filled — that's actually useful." | Confident, relieved | Submit button is hidden or grayed out without explanation when fields are missing | Required field checklist visible before submit; submit button enabled only when all required fields are present; confirmation: "Submitted to QA Reviewer (James Whitfield)" |

**Key Moments:**
- **Delight Opportunity — Step 1:** Pre-populated request data (type, requester, due date) eliminates the copy-paste step she currently performs from the email thread to her spreadsheet.
- **Decision Point — Step 5:** The planning record quality determines whether P2 is approved or returned. Diana must decide whether to submit a partial record or wait — the required-field indicators are the primary signal.
- **Risk of Abandonment — Step 4:** If milestone date setting is cumbersome (no date picker, no guidance), Diana may skip it and return later — breaking the single-session goal.

**Success Outcome:**
Diana completes a full engagement shell setup with team and milestones in under 20 minutes (JTBD-02.1 success measure) and builds and submits a complete planning record for P2 in a single session (JTBD-02.2 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Open Shell | F4 (Engagement Shell), F3 (Gate A1 — pre-populated data) |
| Complete Metadata | F4 (Engagement Shell — metadata), F1 (Engagement entity) |
| Assign Team | F5 (Team and Milestones — team section) |
| Set Milestones | F5 (Team and Milestones — milestone section) |
| Build Planning Record | F6 (Lightweight Planning Record), F1 (Planning Record, Objective entities) |
| Submit for P2 | F7 (Gate P2 — submit action), F0 (Audit event) |

---

### JRN-02.2: Monitoring Gate Status and Blockers on an Active Engagement

**Persona:** PER-02 (Diana Okafor, Engagement Manager)

**Scenario:** Diana starts her morning by checking the status of her two active engagements. For one, P2 was just approved last week and she wants to confirm evidence collection is on track. For the other, P3 submission is approaching and she needs to know exactly what is blocking it before the team call at 10am.

**Related Jobs:** JTBD-02.3

**Gate:** Gates P2 / P3 (status monitoring — not a submission event)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Dashboard Scan** | Opens the portfolio dashboard; scans phase and gate status column for both engagements | Portfolio dashboard (F14) | "Quick check — where do both stand? Any surprises?" | Efficient, slightly vigilant | Dashboard shows phase but not whether anything is blocked | Add a "Blocked" indicator badge to engagements with open blockers in the list view |
| **2. Open Engagement** | Clicks into the engagement approaching P3 | Engagement detail dashboard (F15) | "This one is the one I'm worried about. Let me see what's in the way." | Focused, slightly anxious | Must navigate to a separate page to see gate detail — feels slow when checking multiple engagements | Engagement detail dashboard loads gate status cards immediately on open |
| **3. Assess Gates** | Scans the four gate status cards (A1 ✓, P2 ✓, P3 — pending, P4 — not started); reads open blockers list | Engagement detail — gate cards and blockers panel (F15, F4) | "P3 is still showing two objectives with no linked evidence. That's the blocker. I need to tell Priya before the call." | Concerned, clear-headed | Blocker descriptions are vague — "evidence gap" without naming the specific objectives | Blockers panel lists specific objective names with gap status and a quick link to the evidence tab |
| **4. Act** | Notes the two objective names and opens the evidence section to confirm the gap; prepares talking points for the 10am call | Evidence-to-objective gap view (F9) / engagement detail (F15) | "Objective 2 and Objective 3 have zero evidence. I can tell Priya exactly what to prioritize." | Determined | Getting from the blocker to the actual gap takes two extra navigation steps | Inline "View gap" link from blocker panel to the objective gap view; no extra navigation |

**Key Moments:**
- **Delight Opportunity — Step 3:** Named objectives in the blockers panel mean Diana can run her 10am team call from this single page — no spreadsheet, no chasing Priya by email.
- **Decision Point — Step 3:** Diana decides whether P3 submission is feasible this week or whether she needs to revise the milestone. This decision lives entirely on this page.
- **Risk of Abandonment — Step 1:** If the portfolio dashboard doesn't surface blocked engagements visually, Diana may not notice a developing issue until it's too late.

**Success Outcome:**
Diana identifies all current blockers and gate prerequisites on a single engagement within 60 seconds of opening the engagement detail page with no additional navigation (JTBD-02.3 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Dashboard Scan | F14 (Portfolio Dashboard) |
| Open Engagement | F15 (Engagement Detail Dashboard) |
| Assess Gates | F15 (Gate cards, blockers panel), F4 (Engagement Shell — gate status) |
| Act | F9 (Evidence-to-Objective gap view), F15 (Engagement detail) |

---

## PER-03: Priya Nair — Analyst

---

### JRN-03.1: Uploading Evidence, Linking to Objectives, and Supporting P3 Readiness

**Persona:** PER-03 (Priya Nair, Analyst)

**Scenario:** Priya has collected three new evidence items this week — two interview transcripts and one dataset. She needs to add each to the evidence registry, link them to the objectives they support, confirm there are no remaining objective gaps, and create finding records before the P3 submission deadline Friday.

**Related Jobs:** JTBD-03.1, JTBD-03.2

**Gate:** Gate P3 (support role — Priya prepares the evidence and findings; QA Reviewer approves)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Navigate to Evidence** | Opens the engagement, clicks the Evidence tab | Engagement shell → Evidence registry (F4, F8) | "I need to add the two interview transcripts first. Let me get the metadata right." | Focused, methodical | Evidence tab is not discoverable — buried in a secondary nav | Evidence tab prominently placed in the engagement shell tab bar |
| **2. Add Evidence Item** | Fills in type (Interview Note), source, date received, sensitivity flag (Standard), description; uploads transcript PDF | New evidence form (F8, F1) | "I always second-guess the date format. Is it date received or date of interview?" | Careful, mildly uncertain | Date field label is ambiguous — "date" could mean collected or created | Clear field label: "Date Received"; format hint: MM/DD/YYYY |
| **3. Link to Objective** | After saving, opens the evidence-objective link panel; selects Objective 1 and Objective 3 from the objective list | Evidence-to-objective link (F9) | "Objective 3 is the one that was flagged as a gap. Let me get this linked right now." | Purposeful, slightly urgent | Linking requires navigating away from the evidence item — breaks her flow | Inline objective selector on the evidence save confirmation screen |
| **4. Check Gap View** | Opens the Objectives tab / gap view; confirms which objectives still show zero evidence | Gap view (F9) | "Good — Objective 3 is now showing one evidence item. Objective 2 still shows zero. I need to flag that." | Alert, increasingly concerned | Gap view requires a separate navigation step from the evidence form | Auto-refresh gap view after an evidence link is saved; add summary banner: "2 of 3 objectives covered" |
| **5. Create Findings** | Opens Findings section; creates finding records for Objectives 1 and 3, linking each to the relevant evidence item | Findings form (F10, F8) | "Finding text for Objective 1 is clear. For Objective 3 I'm less sure — but I'll draft it and the QA Reviewer can comment." | Thoughtful, slightly exposed | Finding text field is free-form with no structure guidance — findings vary in quality across the team | Optional finding template or example text in the placeholder |
| **6. Verify P3 Readiness** | Checks the engagement detail dashboard to confirm P3 prerequisites before telling Diana it's ready | Engagement detail — P3 status card (F15, F10) | "Does the system show P3 as ready to submit? Or is something still blocking it?" | Cautious | No clear signal from Priya's view whether the QA Reviewer needs to take action or she still has items to resolve | Engagement detail shows P3 checklist status from analyst's perspective: what's done, what's still needed |

**Key Moments:**
- **Delight Opportunity — Step 3:** An inline objective selector directly on the evidence save screen eliminates a navigation round-trip and keeps Priya in flow.
- **Risk of Abandonment — Step 4:** If the gap view is buried or requires navigation, Priya may not notice that Objective 2 is still uncovered until James flags it during the P3 review — creating a return cycle.
- **Decision Point — Step 5:** Priya decides whether to draft findings now (potentially substandard) or wait for more evidence. The system should not block finding creation but should block P3 submission if objectives are uncovered.

**Success Outcome:**
Priya adds an evidence item, uploads a file, links it to an objective, and verifies objective gap status in under 3 minutes (JTBD-03.1 success measure). Finding records linked to evidence are visible to the QA Reviewer without offline communication (JTBD-03.2 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Navigate to Evidence | F4 (Engagement Shell), F8 (Evidence Registry) |
| Add Evidence Item | F8 (Evidence Registry — new item form), F1 (Evidence Item entity) |
| Link to Objective | F9 (Evidence-to-Objective Link) |
| Check Gap View | F9 (Gap view) |
| Create Findings | F10 (Findings and Sufficiency), F8 (evidence link in finding) |
| Verify P3 Readiness | F15 (Engagement Detail Dashboard — P3 card), F10 |

---

### JRN-03.2: Adding Draft Statements and Resolving a Reference Check Discrepancy

**Persona:** PER-03 (Priya Nair, Analyst)

**Scenario:** After Gate P3 passes, Priya adds draft statements to the indexing queue and links each to evidence. A few days later, Carla (Independent Referencer) marks one statement as Failed with a discrepancy note. Priya receives it in her queue, reviews the issue, updates the evidence link, and resubmits.

**Related Jobs:** JTBD-03.3

**Gate:** Gate P4 (prerequisite — reference checks must be resolved before Tom can approve P4)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Add Draft Statements** | Opens the Draft Statements / Indexing section; adds three statement records with statement text; links each to one or two evidence items | Indexing interface (F12, F11) | "I need to make sure every statement I enter has at least one solid evidence link. Carla will check these." | Careful, systematic | No status indicator showing which statements have been linked vs. still need linking | Inline "Linked / Not Linked" badge per statement; summary count at top of indexing view |
| **2. Monitor Reference Status** | Checks the reference check queue a day later to see whether Carla has started reviewing | Reference check queue (F12) | "Two are Passed already — that's fast. One is still In Review. And one just came back Failed." | Surprised, mildly anxious | Failed items are not surfaced proactively — must poll the queue to discover them | In-system notification or queue indicator when a statement is assigned back as Failed |
| **3. Open Discrepancy** | Clicks the Failed statement; reads the discrepancy note Carla added | Failed statement detail (F12) | "She says the evidence I linked doesn't directly support this specific claim. I need to find a better source or clarify the statement." | Focused, slightly defensive | Discrepancy note is plain text — no guidance on what kind of correction is expected | Structured discrepancy note form: category (wrong evidence / missing evidence / statement unclear) + free text |
| **4. Correct and Relink** | Returns to the evidence registry; finds a more directly supporting document; updates the evidence link on the failed statement | Evidence registry (F8) → statement edit (F12) | "This other transcript is a better match. Let me re-link it and add a correction note." | Determined | Navigating back to the statement after visiting the evidence registry loses context | Evidence registry accessible in a side panel from the statement edit view; no full page reload required |
| **5. Resubmit** | Saves the updated statement with new evidence link and a correction note; status returns to In Review | Statement edit — save action (F12) | "Done. Carla will see the new link and can re-review it. I don't need to email her." | Relieved | No confirmation that Carla has been notified of the resubmission | System notification to Carla when a previously-failed statement returns to In Review; Priya sees: "Sent back to referencer" |

**Key Moments:**
- **Delight Opportunity — Step 5:** The automatic routing to Carla's queue eliminates the email relay entirely — Priya can confirm the correction was sent without leaving the system.
- **Risk of Abandonment — Step 2:** If failed statements are not surfaced proactively (e.g., no queue indicator, no notification), Priya may not discover the failure until it is raised in a meeting — delaying the P4 timeline.
- **Decision Point — Step 3:** Priya decides whether the fix is a new evidence link or a revised statement — the discrepancy note quality is the primary input. Structured notes improve this decision.

**Success Outcome:**
When a statement is failed by the Independent Referencer, Priya receives it in her queue — with statement text, linked evidence, and discrepancy note visible — within the same session, with no email required (JTBD-03.3 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Add Draft Statements | F12 (Basic Indexing), F11 (Draft Product Record) |
| Monitor Reference Status | F12 (Reference check queue — status view) |
| Open Discrepancy | F12 (Failed statement detail — discrepancy note) |
| Correct and Relink | F8 (Evidence Registry), F12 (Statement edit) |
| Resubmit | F12 (Save — status back to In Review), F0 (Audit event) |

---

## PER-04: James Whitfield — QA Reviewer

---

### JRN-04.1: Morning Review Queue → P2 Decision → P3 Decision

**Persona:** PER-04 (James Whitfield, QA Reviewer)

**Scenario:** James opens EMS on a Tuesday morning and sees two engagements in his review queue: one awaiting P2 planning approval, one awaiting P3 evidence sufficiency review. He works through both in sequence — reviewing the planning record and recording an approval for the first, then reviewing evidence coverage and returning the second for a gap.

**Related Jobs:** JTBD-04.1, JTBD-04.2, JTBD-04.3

**Gates:** Gate P2 (approval) and Gate P3 (return decision)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Check Queue** | Opens EMS; navigates to Review Queue; sees two pending items (one P2, one P3) with engagement names and submission dates | Review Queue (F14, F15) | "Two pending. Let me do the older P2 first — that team has been waiting longest." | Efficient, organized | Previously had to track this in his personal notebook — not knowing what was queued | Review queue shows submission date and aging; sortable by date; clicking a row opens the review directly |
| **2. Open P2 Review** | Clicks the P2 item for EMS-003; lands on the planning review page showing completeness indicators for all required fields | P2 planning review page (F7, F6) | "All green. Objectives are there. Risk notes look thorough. Independence status confirmed. I'm comfortable approving this." | Confident, methodical | Previously had to build a manual checklist to verify each field — now the system pre-checks it | Completeness checklist displayed above the review fields; all fields must show "Present" before Approve is active |
| **3. Approve P2** | Clicks "Approve," enters a brief rationale comment, confirms | P2 approval dialog (F7, F0) | "Quick comment: 'Planning baseline meets all P2 requirements. Objectives are well-defined.' That's enough." | Decisive | No guidance on what constitutes an adequate approval rationale | Placeholder text in rationale field with example; minimum character soft-guidance |
| **4. Open P3 Review** | Returns to the queue; opens the P3 evidence sufficiency review for EMS-007 | P3 evidence sufficiency review (F10, F9, F8) | "Three objectives. Two are showing Sufficient. Objective 2 is still Evidence Needed. I can't approve this." | Thorough, slightly frustrated | In the old workflow, he had to count evidence files manually — often missed a gap | Objective sufficiency view shows all objectives with status (Evidence Needed / In Review / Sufficient) and evidence count |
| **5. Return P3** | Clicks "Return," enters return comment naming Objective 2 as the blocking gap, confirms | P3 return dialog (F10, F0) | "I'll name the specific objective so the team doesn't have to guess what I mean." | Clear, accountable | Return comments sometimes never reached the right analyst — now recorded in the system | Return comment visible to Engagement Manager and Analyst on the engagement detail page immediately |
| **6. Confirm Audit** | Spot-checks the audit trail to confirm both decisions were recorded with his name and timestamp | Audit trail (F0) | "Both decisions are there with my name. That's the record if there are questions later." | Satisfied, assured | Previously no durable record of his review decisions — could be disputed | Audit trail entries for P2 approval and P3 return visible; includes actor, timestamp, gate, and rationale summary |

**Key Moments:**
- **Delight Opportunity — Step 2:** The pre-built completeness checklist replaces James's manual Word document — saving 5–10 minutes per review.
- **Decision Point — Step 4:** James decides to return rather than approve. The system must make the blocking objective clearly visible so his return comment is specific and actionable.
- **Risk of Abandonment — Step 1:** If the review queue is empty or not clearly surfaced, James may delay reviews simply because he does not know submissions are waiting — a governance risk under the old email-based workflow.

**Success Outcome:**
James completes a full P2 review and records an approval in under 15 minutes; completes a P3 review and records a return decision with specific comments in under 15 minutes; all decisions are immediately visible to the team without email (JTBD-04.1, JTBD-04.2 success measures).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Check Queue | F14 (Portfolio Dashboard — review queue filter), F15 (Engagement Detail) |
| Open P2 Review | F7 (Gate P2 review page), F6 (Planning record — completeness view) |
| Approve P2 | F7 (Gate P2 — approve action), F0 (Audit event) |
| Open P3 Review | F10 (Gate P3 — evidence sufficiency view), F9 (objective-evidence links), F8 (evidence registry) |
| Return P3 | F10 (Gate P3 — return action), F0 (Audit event) |
| Confirm Audit | F0 (Audit trail view) |

---

## PER-05: Carla Voss — Independent Referencer

---

### JRN-05.1: Working Through the Reference Check Queue and Flagging a Discrepancy

**Persona:** PER-05 (Carla Voss, Independent Referencer)

**Scenario:** Gate P3 has passed. Carla opens the reference check queue for EMS-007, which has seven draft statements. She works through them methodically, marking five as Passed, one as In Review pending further reading, and one as Failed after confirming the linked evidence does not support the specific claim. She adds a discrepancy note and assigns it back to Priya.

**Related Jobs:** JTBD-05.1, JTBD-05.2

**Gate:** Gate P4 (prerequisite — all reference checks must be resolved before Tom can approve)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Open Reference Check Queue** | Navigates to the engagement (EMS-007); opens the Reference Check tab; sees all 7 statements listed with current status and linked evidence | Reference check queue (F12) | "Seven statements. All showing Not Started. Let me go through them in order — that's the most defensible approach." | Focused, methodical | Previously had to work from a Word document list with no status tracking | Structured queue with per-statement status (Not Started / In Review / Passed / Failed); progress bar at top |
| **2. Review First Statements** | Opens statement 1; reads the statement text; clicks the linked evidence file to download and review | Statement detail — evidence download (F12, F8) | "The evidence supports this claim directly. Straightforward." | Confident | Evidence file opens in a new tab — breaks her focus on the queue | In-system document viewer for common file types (PDF, DOCX); download available as fallback |
| **3. Mark Passed** | Returns to the statement; selects "Passed" from the status dropdown; saves; moves to next | Statement status action (F12) | "One down. Six to go. The system is keeping track so I don't have to." | Efficient, slightly relieved | No quick keyboard shortcut — must click through the dropdown each time | Keyboard shortcut or one-click "Pass" button for faster throughput on large queues |
| **4. Flag Failure** | On statement 5, reads the claim and opens the linked evidence; the cited document does not contain the specific data referenced in the statement | Statement 5 — evidence review (F12, F8) | "This evidence doesn't back up this specific figure. That's a real discrepancy. I need to document this precisely." | Alert, careful | Free-text discrepancy note has no structure — Carla must remember what to include | Structured discrepancy form: dropdown for discrepancy type (wrong evidence / insufficient detail / statement mismatch) + free text note |
| **5. Assign to Analyst** | Selects "Failed," fills in discrepancy note, selects assignment to Priya Nair, saves | Failed status — assign discrepancy (F12) | "Priya will see this in her queue. I don't need to email Diana or hunt down Priya's address." | Decisive, satisfied | In the old workflow, this required an email chain — risk of messages getting lost | On save, confirmation banner: "Statement assigned to Priya Nair. Reference check queue updated."; Priya's queue updated immediately |

**Key Moments:**
- **Delight Opportunity — Step 5:** Automatic routing to Priya's queue with no email is the primary value unlock for Carla — it closes the loop she had no control over in the previous workflow.
- **Decision Point — Step 4:** Carla decides whether the discrepancy is a wrong-evidence link or an overstated claim — the discrepancy note must capture this precisely so Priya can fix the right thing.
- **Risk of Abandonment — Step 2:** If the evidence file opens in a completely separate system (browser tab to a shared drive), Carla loses her place in the queue — slowing throughput and increasing error risk.

**Success Outcome:**
Carla accesses the full reference check queue, opens a linked evidence file, and marks a statement Passed or Failed in under 2 minutes per statement (JTBD-05.1 success measure). After marking a statement Failed and adding a discrepancy note, it appears in Priya's queue automatically — confirmed in-session with no email (JTBD-05.2 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Open Reference Check Queue | F12 (Indexing and Reference Check — queue view) |
| Review First Statements | F12 (Statement detail), F8 (Evidence — file access) |
| Mark Passed | F12 (Reference status action) |
| Flag Failure | F12 (Statement detail — failed status), F8 (Evidence review) |
| Assign to Analyst | F12 (Discrepancy assignment — assign action), F13 (P4 prerequisite tracking) |

---

## PER-06: Tom Andrade — Publishing Coordinator

---

### JRN-06.1: Verifying Final Readiness and Recording the P4 Approval

**Persona:** PER-06 (Tom Andrade, Publishing Coordinator)

**Scenario:** Diana sends Tom a system link indicating the engagement is ready for final review. Tom opens EMS, navigates to the P4 readiness page for EMS-007, works through the checklist, verifies all reference checks are Passed, records his approval with a comment, and sees the engagement status update to Ready for Issuance.

**Related Jobs:** JTBD-06.1, JTBD-06.2

**Gate:** Gate P4 (primary — Tom's approval is the terminal event)

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Navigate to Engagement** | Logs in; opens EMS-007 from the engagements list or follows the link Diana shared | Engagement shell (F4) | "Let me go straight to the final readiness checklist. I don't need to review the full engagement history." | Purposeful | Currently has to navigate a shared spreadsheet to find gate statuses — slow and error-prone | Direct link to P4 readiness page from the engagement detail dashboard's P4 gate card |
| **2. Review P4 Checklist** | Opens the Final Readiness tab; reads each prerequisite item with its pass/fail indicator: P3 passed ✓, no open blockers ✓, reference checks complete — pending | P4 readiness checklist (F13) | "P3 is done. No blockers. Reference checks — I need to verify this before I sign off." | Systematic, careful | Previously had to call Carla to confirm reference check completion — time-consuming | Reference check summary is inline on the checklist: "7 statements — 7 Passed, 0 Failed, 0 In Review" |
| **3. Confirm Reference Checks** | Scrolls to the reference check summary on the P4 page; confirms 7 of 7 statements are Passed | P4 readiness — reference check summary (F12, F13) | "All seven are Passed. No waivers needed. I'm confident the product is ready." | Confident, decisive | In the old workflow, confirmation required a phone call or waiting for an email — introduced delay | In-line statement count with status breakdown; system enforces the block if any statement is Failed or In Review |
| **4. Review Gate History** | Quickly scans the gate history panel to confirm A1, P2, P3 were all approved by the right people | Gate history panel (F0, F4) | "A1 approved by Marcus. P2 approved by James. P3 also James. All correct." | Assured | Gate history was scattered across email threads and separate documents — no single view | Gate history panel on the engagement shell lists each gate with approver, date, and rationale |
| **5. Approve P4** | Clicks "Approve Final Readiness," enters a brief comment, confirms; sees engagement status update to "Ready for Issuance" and an audit event confirmation | P4 approval dialog (F13, F0) | "Final approval confirmed. Status is now Ready for Issuance. No follow-up email needed." | Satisfied, authoritative | In the old workflow, Tom had to update a status field in a separate spreadsheet after signing off | P4 approval atomically sets engagement status to Ready for Issuance and creates an audit event; confirmation banner shown immediately |

**Key Moments:**
- **Delight Opportunity — Step 3:** The in-line reference check summary means Tom never has to contact Carla — the system is his verification source.
- **Decision Point — Step 2:** If any prerequisite shows a fail indicator, Tom cannot proceed. The checklist is the gate guard. Clear fail indicators eliminate ambiguity about what is blocking P4.
- **Risk of Abandonment — Step 1:** If Tom arrives at the engagement and cannot quickly find the P4 readiness section, he may use the old out-of-band sign-off process — defeating the governance goal.

**Success Outcome:**
Tom completes the entire P4 readiness review and records a final approval — with all prerequisites verified in-system — in under 10 minutes; the engagement status is automatically updated to Ready for Issuance (JTBD-06.1 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Navigate to Engagement | F4 (Engagement Shell), F15 (Engagement Detail Dashboard) |
| Review P4 Checklist | F13 (Final Readiness — checklist view) |
| Confirm Reference Checks | F12 (Reference check summary), F13 (P4 prerequisite — reference check block) |
| Review Gate History | F0 (Audit trail — gate history), F4 (Engagement Shell — gate status) |
| Approve P4 | F13 (Gate P4 — approve action), F0 (Audit event), F1 (Engagement status → Ready for Issuance) |

---

## PER-07: Sandra Wu — Read-Only Stakeholder

---

### JRN-07.1: Checking Portfolio Status and Drilling Into a Specific Engagement

**Persona:** PER-07 (Sandra Wu, Read-Only Stakeholder)

**Scenario:** Sandra has a briefing with her division director in 30 minutes. A question about the EMS-007 engagement came up unexpectedly. She logs in to EMS, checks the portfolio dashboard for overall status, searches for EMS-007 specifically, and answers the director's questions from the engagement detail page — all before the meeting starts.

**Related Jobs:** JTBD-07.1, JTBD-07.2

**Gate:** No submission event — observation across all phases

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **1. Login and Dashboard** | Logs in; lands directly on the portfolio dashboard; scans the engagement list for phase, owner, risk, and gate status | Login → Portfolio dashboard (F0, F14) | "I need to be able to answer questions about any engagement within two minutes. Where does everything stand right now?" | Slightly urgent, scanning | Previously received a weekly email that was already 2–3 days stale — frequently made her look unprepared | Portfolio dashboard is the default landing page after login; all rows show phase, owner, risk, next milestone, and gate status without drilldown |
| **2. Locate Engagement** | Scans the list; spots EMS-007 showing "Draft Readiness — P3 Passed — P4 Pending"; notes the risk level is Medium | Portfolio dashboard — list view (F14) | "EMS-007 is in draft readiness, P3 passed. That's more progress than I thought. What's blocking P4?" | Relieved, curious | Without a search function, finding a specific engagement by title among dozens is slow | Search bar at top of dashboard; type engagement ID or title to filter instantly |
| **3. Open Engagement Detail** | Clicks EMS-007; opens the engagement detail page; sees gate status cards, milestone dates, and the open blockers panel | Engagement detail dashboard (F15) | "P3 is done. P4 is pending — what's the blocker? There's one reference check still In Review. That's what to tell the director." | Informed, calm | Previously could not access this level of detail without asking Diana — created a dependency | Engagement detail page is read-only for Sandra's role; all gate status, milestones, and blockers visible in one screen |
| **4. Export for Briefing** | Returns to the portfolio dashboard; clicks "Export CSV" to download the engagement register for the briefing deck | Portfolio dashboard — CSV export (F14) | "I'll drop this in my slide deck for background context. One click and it's done." | Efficient, prepared | Export format was inconsistent or required Excel reformatting | CSV export includes all visible columns (ID, title, phase, owner, risk, milestone, gate status); consistent column headers |

**Key Moments:**
- **Delight Opportunity — Step 1:** Landing directly on the portfolio dashboard — with all columns populated — means Sandra can answer a portfolio-level question within 30 seconds of login. This is the core value for her role.
- **Decision Point — Step 3:** Sandra decides what to tell the director about P4 readiness based entirely on what she sees on the engagement detail page. If the page is unclear or requires further navigation, her answer will be incomplete.
- **Risk of Abandonment — Step 2:** If the engagement list is long and there is no search, Sandra will spend the pre-meeting minutes scrolling instead of preparing — and may revert to emailing Diana, recreating the dependency the system was meant to break.

**Success Outcome:**
Sandra can reach the portfolio dashboard and answer a question about any engagement's current phase, owner, and gate status within 60 seconds of opening the application (JTBD-07.1 success measure). Sandra opens a specific engagement and finds current gate status, milestone dates, and open blockers within 60 seconds — without asking anyone (JTBD-07.2 success measure).

**Feature Touchpoints**

| Stage | Features |
|-------|----------|
| Login and Dashboard | F0 (App Shell — login), F14 (Portfolio Dashboard — default landing) |
| Locate Engagement | F14 (Portfolio Dashboard — list view, search) |
| Open Engagement Detail | F15 (Engagement Detail Dashboard — read-only view), F4 (Engagement Shell) |
| Export for Briefing | F14 (Portfolio Dashboard — CSV export) |

---

## Cross-Journey Patterns

### CP-01: The Queue Problem (solved across PER-01, PER-04, PER-05)
All three action roles (Acceptance Lead, QA Reviewer, Independent Referencer) previously had no centralized queue of work awaiting their action. They relied on email discovery. The EMS must surface pending actions proactively for each role — through the portfolio dashboard, the review queue, or an engagement-specific task panel. **Shared opportunity:** A role-filtered action queue on the dashboard landing page benefits all three personas simultaneously.

### CP-02: The Routing Problem (solved across PER-03, PER-05)
When a discrepancy occurs between the Analyst (PER-03) and the Independent Referencer (PER-05), the correction loop currently travels by email — with no tracking, no confirmation, and risk of being lost. The EMS's automatic routing of failed statements to the Analyst's queue (F12) closes this loop. **Shared pain:** Both personas are burned by email-dependent handoffs; in-system routing is the mutual fix.

### CP-03: Audit Trail Confidence (affects PER-01, PER-04, PER-06)
Marcus, James, and Tom all need durable records of their decisions that survive organizational changes, disputes, or governance audits. All three reference the audit trail as a source of confidence in the current state of the workflow. **Shared opportunity:** Consistent audit event format (actor, gate, timestamp, rationale) across A1, P2, P3, and P4 builds a single governance record that satisfies all three personas.

### CP-04: The Status Staleness Problem (solved for PER-02, PER-07)
Diana and Sandra both struggle with status information that is out of date (Diana: scattered spreadsheets; Sandra: days-old email summaries). The EMS's real-time engagement detail dashboard (F15) and portfolio dashboard (F14) solve this for both personas. **Shared opportunity:** A single, always-current engagement record eliminates two independent manual compilation workflows.

### CP-05: Required Field Clarity at Submission Time (affects PER-01, PER-02, PER-03)
Marcus, Diana, and Priya all face the same friction: discovering a required field is missing only after attempting to submit. This late-failure experience causes re-work and erodes trust in the form. **Shared opportunity:** Inline real-time validation with a "Ready to submit" indicator before the submit button is enabled — applied consistently across F2, F6, F7, F10, and F13 — eliminates late-submission failures for all three personas.

---

## Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|--------|-------|---------|-----------------|
| JRN-01.1 | Complete + Submit | JTBD-01.1 | Complete intake record with attached document submitted; all required fields present; record persisted |
| JRN-01.2 | Decide (Step 5) | JTBD-01.2 | A1 approve action records rationale; engagement shell auto-created; audit event written with actor, timestamp, rationale |
| JRN-01.2 | Survey (Step 1) | JTBD-01.3 | All submitted requests visible in filterable list; status current; no navigation required |
| JRN-02.1 | Assign Team + Set Milestones (Steps 3–4) | JTBD-02.1 | Engagement shell fully populated with team assignments and milestone dates in under 20 min |
| JRN-02.1 | Build Planning Record + Submit for P2 (Steps 5–6) | JTBD-02.2 | Complete planning record submitted for P2 in one session; system blocks incomplete submission |
| JRN-02.2 | Assess Gates (Step 3) | JTBD-02.3 | All gate status, blockers, evidence coverage, and reference progress visible on one engagement page within 60 sec |
| JRN-03.1 | Add Evidence + Link to Objective (Steps 2–3) | JTBD-03.1 | Evidence added with metadata and file; linked to objective; gap view updated immediately |
| JRN-03.1 | Check Gap View (Step 4) | JTBD-03.1 | Uncovered objectives visible in gap view without additional navigation |
| JRN-03.1 | Create Findings (Step 5) | JTBD-03.2 | Finding records linked to evidence; objective sufficiency statuses visible to QA Reviewer |
| JRN-03.2 | Open Discrepancy + Resubmit (Steps 3–5) | JTBD-03.3 | Failed statement with discrepancy note in Analyst queue; correction made and resubmitted; no email required |
| JRN-04.1 | Open P2 Review + Approve P2 (Steps 2–3) | JTBD-04.1 | Planning completeness visible before review; P2 decision recorded in one action; audit event written |
| JRN-04.1 | Open P3 Review + Return P3 (Steps 4–5) | JTBD-04.2 | Evidence coverage per objective visible; P3 return recorded with specific comment; team notified immediately |
| JRN-04.1 | Check Queue (Step 1) | JTBD-04.3 | All P2/P3 pending submissions visible in review queue with gate type and submission date; no email dependency |
| JRN-05.1 | Open Queue + Review Statements (Steps 1–3) | JTBD-05.1 | All statements in structured queue with evidence accessible inline; status updated per statement in ≤2 min |
| JRN-05.1 | Flag Failure + Assign to Analyst (Steps 4–5) | JTBD-05.2 | Failed statement with discrepancy note routed to Analyst queue automatically; confirmed in-session |
| JRN-06.1 | Review P4 Checklist + Confirm Reference Checks (Steps 2–3) | JTBD-06.2 | Reference check completion visible on P4 page; system blocks approval while any check is Failed or In Review |
| JRN-06.1 | Approve P4 (Step 5) | JTBD-06.1 | P4 approval sets engagement status to Ready for Issuance; audit event written with actor, timestamp, comment |
| JRN-07.1 | Login and Dashboard + Locate Engagement (Steps 1–2) | JTBD-07.1 | Portfolio dashboard reachable in under 30 sec; all engagements show phase, owner, risk, milestone, gate status without drilldown |
| JRN-07.1 | Open Engagement Detail (Step 3) | JTBD-07.2 | Engagement detail page shows gate status, milestones, blockers, and gate history; read-only enforced by role |
| JRN-07.1 | Export for Briefing (Step 4) | JTBD-07.1 | Engagement list exported to CSV in one action; no reformatting required |

---

*Document generated: 2026-06-04*
*Derived from: PERSONAS-EMS.md, JTBD-EMS.md, PRD-EMS.md, .planning/PROJECT.md*
*Downstream consumers: Story Map, User Stories, NaC Generator, Acceptance Test Generator, UX Design*
