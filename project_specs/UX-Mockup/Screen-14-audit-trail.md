# Screen-14: Audit Trail View (F0)

**Purpose:** Timestamped event log per engagement; filter by action type and date range  
**User Stories:** US-0.5  
**Personas:** Marcus Reid (AL), Diana Okafor (EM), all engagement team members  
**Journeys:** JRN-04.1 (step 6 — audit trail confirmation)

---

## Layout — Audit Trail Tab

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Audit Trail                  │
│        │  All events for this engagement · [Export CSV ↓] (Admin)     │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  FILTERS: [Action Type ▾]  [Date From _____]  [To _____]    │
│        │  [Apply]  [Clear]                                            │
│        │                                                              │
│        │  ── TIMELINE (reverse chronological) ──────────────────── │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Apr 30, 2026  14:22:07  Tom Andrade (PC)             │    │
│        │  │ GATE_P4_APPROVED                                      │    │
│        │  │ Gate P4 approved for ENG-2026-00001.                 │    │
│        │  │ Outcome: Ready for Issuance. Comment: "All reference  │    │
│        │  │ checks confirmed."                                    │    │
│        │  │ [Engagement]                                          │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Apr 28, 2026  09:15:33  Carla Voss (IR)              │    │
│        │  │ REFERENCE_STATUS_CHANGED                              │    │
│        │  │ Statement 2 status changed from Failed → Passed after │    │
│        │  │ analyst correction. Previously: wrong evidence linked. │    │
│        │  │ [Statement 2]                                         │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Apr 25, 2026  16:47:01  Priya Nair (AN)              │    │
│        │  │ REFERENCE_FAILED_DISCREPANCY                          │    │
│        │  │ Statement 2 failed — discrepancy noted. Wrong         │    │
│        │  │ evidence linked. Assigned back to Priya Nair (AN).    │    │
│        │  │ [Statement 2]                                         │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Mar 15, 2026  11:05:22  James Whitfield (QA)         │    │
│        │  │ GATE_P3_APPROVED                                      │    │
│        │  │ Gate P3 approved. All objectives marked Sufficient.   │    │
│        │  │ Engagement advances to Draft phase.                   │    │
│        │  │ [Engagement]  [Gate Decision]                         │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Mar 10, 2026  13:28:44  Priya Nair (AN)              │    │
│        │  │ EVIDENCE_OBJECTIVE_LINKED                             │    │
│        │  │ Evidence E-002 linked to Objective 2.                │    │
│        │  │ [Evidence E-002]  [Objective 2]                       │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Feb 3, 2026  10:12:55  James Whitfield (QA)          │    │
│        │  │ GATE_P2_APPROVED                                      │    │
│        │  │ Gate P2 approved. Planning baseline locked.           │    │
│        │  │ Comment: "Planning baseline meets all requirements."  │    │
│        │  │ [Planning Record]  [Gate Decision]                    │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  ┌──────────────────────────────────────────────────────┐    │
│        │  │ Jan 15, 2026  09:00:00  Marcus Reid (AL)             │    │
│        │  │ GATE_A1_APPROVED                                      │    │
│        │  │ Request REQ-00042 accepted. Engagement ENG-2026-00001 │    │
│        │  │ auto-created. Risk: Medium. Rationale: "Congressional │    │
│        │  │ request with clear mandate..."                        │    │
│        │  │ [Request REQ-00042]  [Engagement]                    │    │
│        │  └──────────────────────────────────────────────────────┘    │
│        │                                                              │
│        │  Showing events 1–20 of 47   [Load More]                     │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Individual event cards: timestamp, actor, action code, summary | Main scroll area |
| Secondary | Action type + date range filters | Top of page |
| Secondary | Linked object references (clickable) | Bottom of each event card |
| Tertiary | Export CSV (Admin only) | Top action bar |

---

## Event Card Anatomy

Each card contains:
1. **Timestamp** — ISO format, local timezone display (e.g., "Apr 30, 2026 14:22:07")
2. **Actor name + role badge** — e.g., "Tom Andrade (PC)"
3. **Action code** — machine-readable, displayed as monospace label (e.g., `GATE_P4_APPROVED`)
4. **Human-readable summary** — full sentence describing what changed
5. **Object links** — click-through to the affected record (engagement, gate decision, evidence, statement)

---

## Audit Event Action Codes (visible in UI)

| Action Code | Trigger |
|-------------|---------|
| `REQUEST_CREATED` | New request saved as draft |
| `REQUEST_SUBMITTED` | Request submitted for A1 |
| `REQUEST_DOCUMENT_UPLOADED` | Intake document attached |
| `GATE_A1_APPROVED` | A1 approval decision |
| `GATE_A1_DECLINED` | A1 decline decision |
| `ENGAGEMENT_UPDATED` | Engagement metadata edited |
| `TEAM_MEMBER_ASSIGNED` | User added to team |
| `TEAM_MEMBER_REMOVED` | User removed from team |
| `MILESTONES_UPDATED` | Milestone dates changed |
| `PLANNING_RECORD_CREATED` | Planning record initiated |
| `PLANNING_RECORD_UPDATED` | Planning record saved |
| `PLANNING_SUBMITTED_FOR_REVIEW` | Submitted to P2 queue |
| `GATE_P2_APPROVED` | P2 approval |
| `GATE_P2_RETURNED` | P2 return for revision |
| `PLANNING_RECORD_REVISED` | Post-P2 planning revision |
| `EVIDENCE_ITEM_CREATED` | Evidence record created |
| `EVIDENCE_FILE_UPLOADED` | File attached to evidence |
| `EVIDENCE_RESTRICTED` | Sensitivity changed to Restricted |
| `EVIDENCE_OBJECTIVE_LINKED` | Evidence linked to objective |
| `EVIDENCE_ITEM_DELETED` | Evidence record deleted |
| `EVIDENCE_CSV_EXPORTED` | Evidence registry exported |
| `FINDING_CREATED` | Finding record created |
| `FINDING_EVIDENCE_LINKED` | Evidence linked to finding |
| `OBJECTIVE_STATUS_UPDATED` | Objective evidence status changed |
| `GATE_P3_APPROVED` | P3 approval |
| `DRAFT_PRODUCT_CREATED` | Draft product record created |
| `DRAFT_FILE_ATTACHED` | Draft file uploaded |
| `DRAFT_COMMENT_ADDED` | Review comment added |
| `DRAFT_STATUS_CHANGED` | Draft product status advanced |
| `STATEMENT_CREATED` | Draft statement added |
| `STATEMENT_EVIDENCE_LINKED` | Statement linked to evidence |
| `REFERENCE_CHECK_ASSIGNED` | Statement assigned to IR |
| `REFERENCE_STATUS_CHANGED` | IR marks pass/fail/in-review |
| `REFERENCE_FAILED_DISCREPANCY` | Statement failed with notes |
| `REFERENCE_CHECK_WAIVED` | EM waives reference check |
| `GATE_P4_APPROVED` | P4 final approval |
| `ENGAGEMENT_CLOSED` | Engagement closed |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Chronological event cards | Latest event first |
| Filtered | Filtered event list | "Showing X events matching filter" |
| No events yet | Empty state | "No audit events recorded yet." |
| Export triggered (Admin) | Download initiated | Toast: "Audit log exported to CSV." |
| Load more | Pagination button | "Load More (showing 20 of 47)" |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Action Type filter | Multi-select dropdown | Filters by action code category |
| Date range | Date inputs (From / To) | Filters event cards by date range |
| Apply / Clear | Form buttons | Apply triggers filter; Clear resets |
| Object links in cards | Inline links | Navigate to referenced record |
| Export CSV | Action button (Admin only) | Downloads all events for engagement |
| Load More | Pagination button | Appends next 20 events |

---
