### Release 4 (R4): Readiness
**Theme:** Draft product + statement indexing + reference check + Gate P4
**Gate Delivered:** P4 (Final Readiness)
**Journey Enabled:** J4 and J5 complete (Draft Readiness + Final Readiness) — completes the full end-to-end engagement lifecycle

#### Stories in R4

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-11.1 | US-11.1: Create Draft Product Record | PER-02 | Epic 11 |
| SM-11.2 | US-11.2: Attach Draft File | PER-03, PER-02 | Epic 11 |
| SM-11.3 | US-11.3: Record Review Comments on Draft | PER-04, PER-02 | Epic 11 |
| SM-11.4 | US-11.4: Advance Draft Status Through Review Stages | PER-02 | Epic 11 |
| SM-12.1 | US-12.1: Create Draft Statements (Indexing) | PER-03 | Epic 12 |
| SM-12.2 | US-12.2: Link Statements to Evidence | PER-03 | Epic 12 |
| SM-12.3 | US-12.3: Assign Statement for Reference Check | PER-02 | Epic 12 |
| SM-12.4 | US-12.4: Perform Reference Check (Pass or Fail) | PER-05 | Epic 12 |
| SM-12.5 | US-12.5: Assign Failed Statement Back to Analyst | PER-05 | Epic 12 |
| SM-12.6 | US-12.6: Waive a Reference Check | PER-02 | Epic 12 |
| SM-12.7 | US-12.7: View Reference Check Progress | PER-02, PER-06 | Epic 12 |
| SM-13.1 | US-13.1: View Final Readiness Checklist | PER-06 | Epic 13 |
| SM-13.2 | US-13.2: Approve Final Readiness at P4 | PER-06, PER-02 | Epic 13 |
| SM-13.3 | US-13.3: Close Engagement Without Issuance | PER-02 | Epic 13 |
| SM-13.4 | US-13.4: P4 Decision Reflected Across System | PER-07, PER-02 | Epic 13 |

**Total: 15 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-02 Diana Okafor (EM) | Full J4/J5 EM journey: create draft product, advance draft status, assign statements for reference check, waive reference checks, view reference check progress, approve P4, close engagement |
| PER-03 Priya Nair (AN) | Full J4 analyst journey: create draft statements, link to evidence, resolve discrepancy assignments from IR queue |
| PER-04 James Whitfield (QA) | Can add review comments to draft; reviews draft status (QA can return draft to Drafting status) |
| PER-05 Carla Voss (IR) | Full J4 referencer journey: structured reference check queue with evidence inline, mark Passed/Failed/In Review, add discrepancy notes, assign failed statements back to Analyst |
| PER-06 Tom Andrade (PC) | Full J5 journey: view final readiness checklist, confirm reference check completion, approve P4 with comments, see engagement status update to Ready for Issuance |
| PER-07 Sandra Wu (RO) | Sees P4 decision reflected on portfolio dashboard and engagement detail (read-only) |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-03.3 | Full — draft statements linked to evidence in system; discrepancy assignments surface in Analyst queue automatically; no email required |
| JTBD-05.1 | Full — full reference check queue with evidence accessible inline; status updated per statement in ≤2 minutes |
| JTBD-05.2 | Full — failed statement with discrepancy note routed to Analyst queue automatically; Carla can confirm routing in-session |
| JTBD-06.1 | Full — P4 checklist shows all prerequisites; approval sets status to Ready for Issuance and writes audit event automatically |
| JTBD-06.2 | Full — reference check completion visible on P4 page; system blocks approval while any check is Failed or In Review |

#### Journey Completeness
- **J4 (Draft Readiness):** ✓ Complete — full path from draft product creation through statement indexing, reference check assignment, pass/fail/waive, and discrepancy resolution
- **J5 (Final Readiness):** ✓ Complete — full path from P4 checklist review through final approval and status update to Ready for Issuance
- **J1, J2, J3:** Already complete from R1–R3

After R4, the full engagement lifecycle (A1 → P2 → P3 → P4) is operational. All 5 primary journeys are completable.

#### Release Rationale
R4 completes the engagement lifecycle by delivering the terminal governance gate (P4). The reference check workflow (F12) requires evidence items (from R3) and a draft product. Gate P4 requires P3 to be approved. R4 depends on R3 and cannot ship before it.

---
