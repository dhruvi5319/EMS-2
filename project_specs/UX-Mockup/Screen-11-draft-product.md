# Screen-11: Draft Product (F11)

**Purpose:** Create and track the draft product through review stages; attach file; record review comments  
**User Stories:** US-11.1, US-11.2, US-11.3, US-11.4  
**Personas:** Diana Okafor (EM), Priya Nair (AN), James Whitfield (QA)  
**Journeys:** JRN-03.2

---

## Layout — Draft Product Record (Drafting state)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Engagements > ENG-2026-00001 > Draft Product                │
│        │  Status: [Drafting]         [Advance to Under Review →]      │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── DRAFT METADATA ─────────────────────────────────────── │
│        │  Title         Review of Budget Control Systems FY2026        │
│        │  Version       v1.0                                          │
│        │  Owner         Priya Nair                                    │
│        │  Created       April 2, 2026                                 │
│        │                                                              │
│        │  ── DRAFT FILE ATTACHMENT ──────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ Current file:  draft-report-v1.0.docx  (1.8 MB)  [↓]   │ │
│        │  │                                                         │ │
│        │  │ Replace file:  [📎 Choose File]  or drag & drop         │ │
│        │  │ Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP            │ │
│        │  │ Max size: 50 MB · One file per draft record              │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │                                                              │
│        │  ── REVIEW COMMENTS ────────────────────────────────────── │
│        │  ┌─────────────────────────────────────────────────────────┐ │
│        │  │ James Whitfield (QA) · April 3, 2026 09:14              │ │
│        │  │ Section 3 needs stronger evidence citation for finding  │ │
│        │  │ FD-002. Please revise before advancing to review.       │ │
│        │  ├─────────────────────────────────────────────────────────┤ │
│        │  │ Add Comment                                             │ │
│        │  │ ┌───────────────────────────────────────────────────┐  │ │
│        │  │ │                                                   │  │ │
│        │  │ └───────────────────────────────────────────────────┘  │ │
│        │  │ [Save Comment]                                         │ │
│        │  └─────────────────────────────────────────────────────────┘ │
│        │  Comments are append-only and cannot be edited after save.   │
│        │                                                              │
│        │  ── DRAFT STATEMENTS (Indexing) ──────────────────────────  │
│        │  3 statements  ·  2 linked to evidence  ·  1 unlinked 🔴    │
│        │  [View Statements / Reference Check →]                       │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Layout — Status Progression Bar

```
Drafting → Under Review → Ready for Ref. Check → Ready for Final Review
   ●─────────────○──────────────────○──────────────────────○
  [Current]   [Next step]                            [Final]
```

Status transitions permitted:
- **Drafting → Under Review** (EM action)
- **Under Review → Ready for Reference Check** (EM action; requires ≥1 statement)
- **Under Review → Drafting** (QA return action)
- **Ready for Reference Check → Ready for Final Review** (EM action)
- **Ready for Final Review → Under Review** (EM rollback)

---

## Layout — Create Draft Product Form (first-time)

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Draft Product Record                               [✕]  │
├─────────────────────────────────────────────────────────────────┤
│  ℹ Gate P3 must be approved before creating a draft product.    │
│                                                                  │
│  Title *                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ e.g., Review of Budget Control Systems FY2026           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Version *                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ v1.0                                                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Owner *                                                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Priya Nair                                          ▾   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Must be an active user assigned to this engagement              │
│                                                                  │
│  [Cancel]                          [Create Draft Product]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Status badge + status progression bar | Top of page |
| Primary | Draft file attachment (download + replace) | Upper content area |
| Secondary | Review comments thread | Middle content area |
| Secondary | Statements/indexing summary with link | Below comments |
| Tertiary | Draft metadata (title, version, owner, date) | Upper metadata block |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| No draft product yet | Empty state with create button | "No draft product record. Create one after P3 is approved." |
| P3 not yet approved | Create button disabled | "Gate P3 must be approved to create a draft product." |
| Drafting | Orange status badge; advance button available | "Advance to Under Review when ready." |
| Under Review | Blue status badge | Comments thread active; QA can return to Drafting |
| Ready for Ref Check | Teal status badge; statement count shown | "All statements must be indexed before advancing." |
| Ready for Final Review | Green status badge | "Proceed to Gate P4 checklist." |
| File uploading | Progress bar | "Uploading… 67%" |
| Comment saved | Appended to thread | Toast: "Comment saved." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Advance status button | Primary button (EM only) | Advances to next permitted status; blocked if statements missing |
| Return to Drafting | Secondary button (QA only) | Returns status from Under Review → Drafting |
| File chooser | File input | Single-file; replaces existing; drag-drop supported |
| Add Comment | Textarea + Save button | Non-empty; append-only; EM/QA/AN/AD permitted |
| View Statements link | Navigation link | Routes to reference check / indexing screen |

---
