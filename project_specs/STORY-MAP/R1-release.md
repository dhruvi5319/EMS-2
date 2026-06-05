## Release Planning

---

### Release 1 (R1): MVP Core
**Theme:** Platform shell + request intake + Gate A1 + engagement shell
**Gate Delivered:** A1 (Acceptance)
**Journey Enabled:** J1 complete (Intake and Acceptance) — first complete end-to-end path

#### Stories in R1

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-0.1 | US-0.1: Login to the Application | All | Epic 0 |
| SM-0.2 | US-0.2: Logout of the Application | All | Epic 0 |
| SM-0.3 | US-0.3: Navigate via Main Menu | All | Epic 0 |
| SM-0.4 | US-0.4: Search for Engagements | All | Epic 0 |
| SM-0.5 | US-0.5: View Audit Trail | PER-01, PER-02 | Epic 0 |
| SM-0.6 | US-0.6: Assign User Roles (Admin) | Admin | Epic 0 |
| SM-1.1 | US-1.1: Persistent Core Records | PER-02 | Epic 1 |
| SM-1.2 | US-1.2: Enforce Allowed Values | All | Epic 1 |
| SM-2.1 | US-2.1: Create Draft Request | PER-01 | Epic 2 |
| SM-2.2 | US-2.2: Complete and Submit Request | PER-01 | Epic 2 |
| SM-2.3 | US-2.3: Upload Intake Document | PER-01 | Epic 2 |
| SM-2.4 | US-2.4: Edit Draft Request | PER-01 | Epic 2 |
| SM-2.5 | US-2.5: View Request Detail | PER-01, PER-07 | Epic 2 |
| SM-3.1 | US-3.1: Review Submitted Request for A1 | PER-01 | Epic 3 |
| SM-3.2 | US-3.2: Approve Request at Gate A1 | PER-01 | Epic 3 |
| SM-3.3 | US-3.3: Decline Request at Gate A1 | PER-01 | Epic 3 |
| SM-3.4 | US-3.4: A1 Decision Reflected Across System | PER-02, PER-07 | Epic 3 |
| SM-4.1 | US-4.1: View Engagement Shell | PER-02 | Epic 4 |

**Total: 18 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-01 Marcus Reid (AL) | Full J1 journey: create, edit, submit request; review queue; approve/decline with rationale |
| PER-02 Diana Okafor (EM) | Receives accepted engagement shell; sees A1 decision reflected |
| PER-07 Sandra Wu (RO) | Sees A1 decision status on request detail and portfolio (read-only) |
| Admin | Can assign roles to all seven user types |
| All roles | Platform access: login, logout, navigation, search, audit trail |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-01.1 | Full — complete intake record created, submitted, and documented |
| JTBD-01.2 | Full — A1 approve/decline with rationale, engagement shell auto-created, audit event written |
| JTBD-01.3 | Partial — requests visible in submitted list; full dashboard in R5 |

#### Journey Completeness
- **J1 (Intake and Acceptance):** ✓ Complete — full path from request creation to A1 decision with engagement shell auto-creation
- **J2–J5:** Not yet started — engagement shell view only, no team/planning/evidence/readiness capabilities

#### Release Rationale
R1 establishes the governing framework (login, audit, RBAC) and delivers the first complete end-to-end governance checkpoint (Gate A1). Every downstream release depends on an accepted engagement existing in the system. R1 must ship before any other release is testable.

---
