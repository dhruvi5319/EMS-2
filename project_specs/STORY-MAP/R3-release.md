### Release 3 (R3): Evidence
**Theme:** Evidence registry + objective linking + findings + Gate P3
**Gate Delivered:** P3 (Evidence Sufficiency)
**Journey Enabled:** J3 complete (Evidence Readiness) — third complete end-to-end gate

#### Stories in R3

| SM-ID | Story | Persona | Epic |
|-------|-------|---------|------|
| SM-8.1 | US-8.1: Add an Evidence Record | PER-03 | Epic 8 |
| SM-8.2 | US-8.2: Upload Files to Evidence Record | PER-03 | Epic 8 |
| SM-8.3 | US-8.3: Mark Evidence as Restricted | PER-03 | Epic 8 |
| SM-8.4 | US-8.4: View and Filter Evidence List | PER-03, PER-04 | Epic 8 |
| SM-8.5 | US-8.5: Delete Evidence Record | PER-03 | Epic 8 |
| SM-9.1 | US-9.1: Link Evidence to Objectives | PER-03 | Epic 9 |
| SM-9.2 | US-9.2: View Linked Evidence Per Objective | PER-03, PER-04 | Epic 9 |
| SM-9.3 | US-9.3: Identify Evidence Gaps | PER-03, PER-04 | Epic 9 |
| SM-9.4 | US-9.4: Export Evidence Registry to CSV | PER-03, PER-02 | Epic 9 |
| SM-10.1 | US-10.1: Create Finding Record | PER-03 | Epic 10 |
| SM-10.2 | US-10.2: Link Finding to Evidence | PER-03 | Epic 10 |
| SM-10.3 | US-10.3: Mark Objective Evidence Status | PER-04 | Epic 10 |
| SM-10.4 | US-10.4: Approve Evidence Sufficiency at P3 | PER-04 | Epic 10 |

**Total: 13 stories**

#### Personas Served
| Persona | How Served |
|---------|-----------|
| PER-03 Priya Nair (AN) | Full J3 analyst journey: add evidence with metadata, upload files, set sensitivity, link to objectives, check gap view, create findings linked to evidence, export evidence registry to CSV |
| PER-04 James Whitfield (QA) | Full P3 review workflow: view evidence coverage per objective, mark objective evidence status, approve or return P3; evidence sufficiency view with gap indicators |
| PER-02 Diana Okafor (EM) | Can export evidence registry to CSV; sees evidence coverage gaps reflected in open blockers (from R2 blocker logic) |

#### JTBD Addressed
| JTBD-ID | Coverage |
|---------|---------|
| JTBD-03.1 | Full — evidence added with metadata, uploaded, linked to objective, gap view updated; export in one action |
| JTBD-03.2 | Full — findings created and linked to evidence; P3 blocked on evidence gaps; QA sees sufficiency status |
| JTBD-04.2 | Full — evidence coverage per objective visible; P3 blocks on Evidence Needed objectives; P3 decision recorded with audit event |

#### Journey Completeness
- **J3 (Evidence Readiness):** ✓ Complete — full path from evidence upload through objective linking, findings creation, gap identification, and P3 approval
- **J1, J2:** Already complete from R1, R2
- **J4–J5:** Not yet started — draft product and reference checks in R4

#### Release Rationale
R3 delivers the third governance gate (P3) and the full evidence traceability foundation. The draft product and reference check features (R4) depend on evidence items existing and P3 being approved. R3 must ship before R4.

---
