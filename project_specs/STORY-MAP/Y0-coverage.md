## Coverage Analysis

---

### Persona Coverage by Release

| Persona | R1 MVP Core | R2 Planning | R3 Evidence | R4 Readiness | R5 Dashboards |
|---------|-------------|-------------|-------------|--------------|---------------|
| **PER-01** Marcus Reid (AL) | ✓ Primary (J1 complete) | — | — | — | ✓ Extended (dashboard view) |
| **PER-02** Diana Okafor (EM) | ✓ Receives shell | ✓ Primary (J2 complete) | ✓ Evidence export | ✓ Primary (J4, J5) | ✓ Extended (detail dashboard) |
| **PER-03** Priya Nair (AN) | — | ✓ Planning contributions | ✓ Primary (J3 complete) | ✓ Primary (indexing, discrepancy) | — |
| **PER-04** James Whitfield (QA) | — | ✓ Primary (P2 review) | ✓ Primary (P3 review) | ✓ Draft comments | ✓ Extended (metrics) |
| **PER-05** Carla Voss (IR) | — | — | — | ✓ Primary (J4 reference check) | — |
| **PER-06** Tom Andrade (PC) | — | — | — | ✓ Primary (J5 complete) | ✓ Extended (ref check metrics) |
| **PER-07** Sandra Wu (RO) | ✓ Partial (request detail) | ✓ Milestone status | — | ✓ P4 status visible | ✓ Primary (full dashboard) |
| **Admin** | ✓ User management | — | — | — | — |

**All 7 personas are served by R4.** R5 enhances the experience for PER-07 (primary dashboard consumer) and all monitoring personas.

---

### JTBD Coverage by Release

| JTBD-ID | Summary | R1 | R2 | R3 | R4 | R5 |
|---------|---------|----|----|----|----|-----|
| JTBD-01.1 | Complete intake in ≤5 min | ✓ Full | — | — | — | — |
| JTBD-01.2 | A1 decision with rationale, auto engagement shell | ✓ Full | — | — | — | — |
| JTBD-01.3 | All pending requests in one view | Partial | — | — | — | ✓ Full |
| JTBD-02.1 | Engagement shell set up ≤20 min | Partial (shell created) | ✓ Full | — | — | — |
| JTBD-02.2 | Planning baseline submitted for P2 in one session | — | ✓ Full | — | — | — |
| JTBD-02.3 | Gate status and blockers visible on one page | Partial (shell) | Partial (blocker logic) | Partial | Partial | ✓ Full (detail dashboard) |
| JTBD-03.1 | Evidence added and linked in ≤3 min; gap view | — | — | ✓ Full | — | — |
| JTBD-03.2 | Findings linked to evidence; P3 blocked on gaps | — | — | ✓ Full | — | — |
| JTBD-03.3 | Discrepancy in Analyst queue without email | — | — | — | ✓ Full | — |
| JTBD-04.1 | P2 review and decision ≤15 min, one action | — | ✓ Full | — | — | — |
| JTBD-04.2 | P3 blocked if any objective Evidence Needed | — | — | ✓ Full | — | — |
| JTBD-04.3 | Review queue without email discovery | — | Partial | Partial | — | ✓ Full |
| JTBD-05.1 | Full reference check queue with evidence inline | — | — | — | ✓ Full | — |
| JTBD-05.2 | Failed statement routes to Analyst queue automatically | — | — | — | ✓ Full | — |
| JTBD-06.1 | P4 approved with status set automatically | — | — | — | ✓ Full | — |
| JTBD-06.2 | P4 blocked while ref check Failed or In Review | — | — | — | ✓ Full | — |
| JTBD-07.1 | Portfolio dashboard reachable ≤30 sec | — | — | — | — | ✓ Full |
| JTBD-07.2 | Engagement detail answers questions without training | — | — | — | — | ✓ Full |

**All 18 JTBD outcomes are fully addressed by the end of R5.**

---

### Gap Analysis

#### Journey Stages Without Coverage

No journey stages are without coverage. All five primary journeys (J1–J5) are fully mapped:
- **J1 (Intake and Acceptance):** 9 stories — fully covered in R1
- **J2 (Planning Setup):** 16 stories — fully covered in R2
- **J3 (Evidence Readiness):** 13 stories — fully covered in R3
- **J4 (Draft Readiness):** 11 stories — fully covered in R4
- **J5 (Final Readiness):** 4 stories — fully covered in R4
- **Platform (Cross-cutting):** 8 stories — covered in R1
- **Dashboards (Cross-cutting):** 10 stories — covered in R5
- **Artifacts/Tests (Cross-cutting):** 8 stories — covered in R5

#### JTBD Without Stories

No JTBD outcomes are without associated stories. All 18 JTBD outcomes from JTBD-EMS.md map to at least one NaC derivation and are governed by at least two user stories.

#### Orphan Stories (Stories Not Mapped to a Journey Stage)

**No orphan stories.** All 79 user stories (US-0.1 through US-17.5) are placed in the story map matrix in one of the following sections:
- Section A (Platform Foundation): 8 stories (US-0.1–0.6, US-1.1–1.2)
- Section B (J1 Intake and Acceptance): 9 stories (US-2.1–2.5, US-3.1–3.4)
- Section C (J2 Planning Setup): 16 stories (US-4.1–4.4, US-5.1–5.4, US-6.1–6.5, US-7.1–7.4)
- Section D (J3 Evidence Readiness): 13 stories (US-8.1–8.5, US-9.1–9.4, US-10.1–10.4)
- Section E (J4 Draft Readiness): 11 stories (US-11.1–11.4, US-12.1–12.7)
- Section F (J5 Final Readiness): 4 stories (US-13.1–13.4)
- Section G (Dashboards): 10 stories (US-14.1–14.4, US-15.1–15.6)
- Section H (Artifacts/Tests): 8 stories (US-16.1–16.3, US-17.1–17.5)
- **Total: 79 stories ✓**

#### JTBD Outcomes That Are Partially Addressed in Early Releases

The following outcomes have partial coverage in early releases and reach full coverage in a later release:
- **JTBD-01.3** (pending requests in one view): Partial in R1 (request list view); Full in R5 (portfolio dashboard with filters)
- **JTBD-02.3** (gate status and blockers visible): Partial in R1 (shell view) and R2 (blocker logic); Full in R5 (engagement detail dashboard with all metrics)
- **JTBD-04.3** (review queue without email): Partial in R2/R3 (separate review queue per gate); Full in R5 (unified portfolio dashboard with review queue filter)

This is expected and acceptable — each release delivers a complete gate journey while the dashboard layer accumulates data across all prior releases.

---
