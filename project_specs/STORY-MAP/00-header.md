# Story Map
## Lightweight Engagement Management System (EMS)

| Field | Value |
|-------|-------|
| **Product Name** | Lightweight Engagement Management System (EMS) |
| **Version** | 1.0 |
| **Date** | 2026-06-04 |
| **Related PRD** | PRD-EMS.md |
| **Related Personas** | PERSONAS-EMS.md |
| **Related JTBD** | JTBD-EMS.md |
| **Related Journeys** | JOURNEYS-EMS.md |
| **Related User Stories** | UserStories-EMS.md |
| **Total Stories Mapped** | 79 (US-0.1 through US-17.5) |
| **Total Epics** | 18 (Epic 0 — Epic 17) |
| **Releases Defined** | 5 (R1–R5) |

---

## Overview

This Story Map organizes all 79 EMS user stories onto a two-dimensional grid:

- **X-axis (columns):** Journey stages, derived from JOURNEYS-EMS.md — the five primary journeys J1–J5 plus cross-cutting platform concerns
- **Y-axis (rows):** Activities and epics within each journey stage, ordered from foundational (top) to advanced detail (bottom)
- **NaC column:** Natural Acceptance Criteria derived from JTBD outcomes — each NaC is traceable to a specific JTBD-ID and journey stage
- **Release column:** Increment assignment based on the gate-sequenced workflow: A1 → P2 → P3 → P4

### Gate Sequence and Release Structure

The EMS workflow is gate-sequenced. Releases follow the logical gate order to ensure each release delivers a complete, testable end-to-end slice:

| Release | Theme | Gates Covered | Key Capabilities |
|---------|-------|--------------|-----------------|
| **R1 — MVP Core** | Platform shell + intake + Gate A1 + engagement shell | A1 | Login, navigation, request intake, A1 decision, engagement shell creation |
| **R2 — Planning** | Team/milestones + planning record + Gate P2 | P2 | Team assignments, milestones, planning baseline, P2 approval |
| **R3 — Evidence** | Evidence registry + objective linking + findings + Gate P3 | P3 | Evidence upload, evidence-to-objective links, gap view, findings, P3 approval |
| **R4 — Readiness** | Draft product + indexing + reference check + Gate P4 | P4 | Draft product, statement indexing, reference checks, P4 final approval |
| **R5 — Dashboards** | Portfolio dashboard + engagement detail dashboard + acceptance tests | — | Portfolio dashboard, engagement detail dashboard, CSV exports, acceptance tests |

### NaC Concept

**Natural Acceptance Criteria (NaC)** bridge JTBD outcomes to testable story criteria. Each NaC is derived from the intersection of:
1. A JTBD outcome (the "what matters" — e.g., "Minimize time to start work")
2. A journey stage context (the "when/where" — e.g., Intake, Planning Setup)
3. A user story (the "what is built")

NaC are **not invented** — they are derived from the JTBD NaC Preview table in JTBD-EMS.md, contextualized for the specific journey stage and story. They serve as the primary bridge between user intent (JTBD) and implementation verification (acceptance criteria).

### Map Entry ID Convention

Story map entries are referenced as **SM-{Epic}.{NN}** (e.g., SM-0.1, SM-2.1). These IDs correspond 1:1 with UserStory IDs (SM-2.1 = US-2.1 mapped to the story map).

---
