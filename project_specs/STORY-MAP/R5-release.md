### Release 5 (R5): Dashboards
**Theme:** Portfolio dashboard + engagement detail dashboard + acceptance tests + persona/journey artifacts
**Gate Delivered:** None (dashboards and test validation)
**Journey Enabled:** Full portfolio visibility across J1–J5; acceptance test suite

#### Stories in R5

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-14.1 | US-14.1: View Portfolio Summary Count Cards | PER-07 | Epic 14 |
| SM-14.2 | US-14.2: Filter the Engagement List | PER-02 | Epic 14 |
| SM-14.3 | US-14.3: View Engagement List with Key Columns | PER-07 | Epic 14 |
| SM-14.4 | US-14.4: Export Engagement Register to CSV | PER-07 | Epic 14 |
| SM-15.1 | US-15.1: View Phase/Status/Owner Summary | PER-02 | Epic 15 |
| SM-15.2 | US-15.2: View Gate Status Cards on Detail Dashboard | PER-02 | Epic 15 |
| SM-15.3 | US-15.3: View Milestone Timeline | PER-02 | Epic 15 |
| SM-15.4 | US-15.4: View Evidence and Objective Progress Metrics | PER-04 | Epic 15 |
| SM-15.5 | US-15.5: View Reference Check Completion Metrics | PER-06 | Epic 15 |
| SM-15.6 | US-15.6: View Open Blockers Panel | PER-02 | Epic 15 |
| SM-16.1 | US-16.1: Define and Reference Target Personas | PER-02, PER-04 | Epic 16 |
| SM-16.2 | US-16.2: Define Primary User Journeys | Dev team | Epic 16 |
| SM-16.3 | US-16.3: Map Gate Scenarios for Acceptance Tests | QA team | Epic 16 |
| SM-17.1 | US-17.1: Validate A1 Gate Tests | QA team | Epic 17 |
| SM-17.2 | US-17.2: Validate P2 Gate Tests | QA team | Epic 17 |
| SM-17.3 | US-17.3: Validate P3 Gate Tests | QA team | Epic 17 |
| SM-17.4 | US-17.4: Validate P4 Gate Tests | QA team | Epic 17 |
| SM-17.5 | US-17.5: Validate Dashboard and Export Tests | QA team | Epic 17 |

**Total: 18 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-07 Sandra Wu (RO) | Full portfolio visibility: count cards, sortable engagement list with all key columns, filters, CSV export, engagement detail page with gate history and read-only enforcement |
| PER-02 Diana Okafor (EM) | Engagement detail dashboard with consolidated gate cards, milestone timeline, evidence/reference metrics, and open blockers panel; advanced engagement list filtering |
| PER-04 James Whitfield (QA) | Evidence and objective progress metrics on detail dashboard; review queue filtering on portfolio dashboard |
| PER-06 Tom Andrade (PC) | Reference check completion metrics on detail dashboard, visible from the P4 approach page |
| QA team | Full acceptance test suite covering all gate paths (A1, P2, P3, P4), dashboard visibility, CSV exports, and RBAC enforcement |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-01.3 | Full — all pending requests visible in one filterable view; status always current |
| JTBD-04.3 | Full — single review queue shows all P2/P3 pending submissions with gate type and submission date; sortable |
| JTBD-07.1 | Full — portfolio dashboard reachable after login; all engagements listed with phase, owner, risk, milestone, gate status; CSV export in one action |
| JTBD-07.2 | Full — engagement detail page shows gate status, milestones, blockers, gate decision history; read-only enforced by role |
| JTBD-02.3 | Enhanced — engagement detail dashboard provides consolidated gate cards, milestone timeline, evidence progress metrics, and open blockers panel in one view |

#### Journey Completeness
- All five journeys (J1–J5) already complete from R1–R4
- R5 adds the observational and reporting layer: portfolio dashboard (visible to all roles), engagement detail dashboard (consolidated view for EM, QA, PC, RO), and acceptance test coverage
- R5 enables Sandra Wu (PER-07) to have a fully self-service experience that was not possible in R1–R4

#### Release Rationale
Dashboards (F14, F15) are classified as P1 (High) in the PRD and depend on engagement data from all prior releases to be meaningful. Acceptance tests (F17) validate the complete system built in R1–R4. R5 is the final release and delivers the reporting and validation layer on top of a fully operational lifecycle system.

---
