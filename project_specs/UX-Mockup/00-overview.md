# UX Mockup — Lightweight Engagement Management System (EMS)

**Project:** EMS — Lightweight Engagement Management System  
**Generated:** 2026-06-04  
**Based on:** UserStories-EMS.md, JOURNEYS-EMS.md, PRD-EMS.md, FRD-EMS.md, PROJECT.md  
**Version:** 1.0

---

## Overview

### UX Approach

The EMS is a governance-first workflow tool, not a collaborative document editor. Every design decision prioritizes:

1. **Governance clarity** — Gate status, approver, date, and rationale must always be visible and unambiguous.
2. **Role-oriented action surfaces** — Each role sees only their permitted actions; no cluttered UI with disabled controls.
3. **Proactive status** — Users should never have to ask "what is blocking this?" — blockers are surfaced automatically.
4. **Required-field clarity before submission** — Inline validation with a "ready to submit" indicator prevents late-failure rework.
5. **Audit trail confidence** — Every action writes a durable, visible record; users trust the system as the source of truth.

### Design Principles

| Principle | Application |
|-----------|-------------|
| **Single source of truth** | Engagement Shell is the hub; all artifacts navigate back to it |
| **Gates are visible** | A1/P2/P3/P4 status cards appear on every engagement-related page |
| **Blockers are named** | Blocker messages name specific records (objective text, statement prefix), not vague categories |
| **Submit-readiness signaling** | Required-field checklist with green/red indicators appears before every gate submission |
| **Minimal navigation depth** | Maximum 2 clicks from dashboard to any action; key sections in persistent sidebar |
| **Role isolation** | Decision controls (Approve/Decline/Return) render only for the permitted role |

### Information Architecture

```
App
├── Login
├── Dashboard (Portfolio) [default landing]
├── Requests
│   ├── New Request
│   └── Request Detail
├── Engagements
│   └── Engagement Shell [hub]
│       ├── Team & Milestones
│       ├── Planning Record
│       ├── Evidence
│       │   └── Evidence Detail
│       ├── Findings
│       ├── Draft Product
│       │   └── Reference Check (Indexing)
│       ├── Gate History
│       └── Audit Trail
└── Review Queue
```

### Engagement Lifecycle Flow

```
Request (draft) → Request (submitted) → [Gate A1: AL approves/declines]
    │
    ▼ Approved
Engagement Shell (phase: planning)
    │
    ├── Team assigned + Milestones set
    ├── Planning Record (draft → ready_for_review)
    │       ↓
    │   [Gate P2: QA approves/returns]
    │       ↓ Approved → phase: evidence
    │
    ├── Evidence uploaded + linked to objectives
    ├── Findings created + linked to evidence
    │       ↓
    │   [Gate P3: QA approves/returns]
    │       ↓ Approved → phase: draft
    │
    ├── Draft Product created
    ├── Statements indexed + linked to evidence
    ├── Reference checks (IR: pass/fail)
    │       ↓
    │   [Gate P4: PC/EM approves]
    │       ↓ Approved → status: ready_for_issuance / closed
    │
    └── [Read-only — engagement closed]
```

### Role Color Coding (used across wireframes)

| Role | Abbreviation | Primary Action |
|------|--------------|----------------|
| Engagement Acceptance Lead | AL | Gate A1 approve/decline |
| Engagement Manager | EM | Setup, planning, metadata |
| Analyst | AN | Evidence, findings, statements |
| QA Reviewer | QA | Gates P2, P3 review |
| Independent Referencer | IR | Reference check pass/fail |
| Publishing Coordinator | PC | Gate P4 final approval |
| Read-Only Stakeholder | RO | View only |
| Admin | AD | User/role management |

### Layout Shell

All authenticated pages share this outer shell:

```
┌──────────────────────────────────────────────────────────────────┐
│ [≡ EMS]  [Global Search ___________________]  [User ▾] [Logout] │
├────────┬─────────────────────────────────────────────────────────┤
│ NAV    │                                                          │
│        │   PAGE CONTENT AREA                                      │
│ Dash   │                                                          │
│ Requests│                                                         │
│ Engage-│                                                          │
│ ments  │                                                          │
│ Review │                                                          │
│ Queue  │                                                          │
│ Reports│                                                          │
│        │                                                          │
│ [Role] │                                                          │
└────────┴─────────────────────────────────────────────────────────┘
```

- Sidebar: 220px fixed; collapses to icon-only on tablet/mobile
- Content area: responsive fluid, max-width 1280px centered
- Active nav item: highlighted with accent border + bold
- Role badge shown at bottom of sidebar

---
