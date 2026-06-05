# Screen-03: Request Intake Form (F2)

**Purpose:** Create/edit a request record; upload intake document; submit for A1 review  
**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5  
**Personas:** Marcus Reid (AL)  
**Journeys:** JRN-01.1

---

## Layout — New / Edit Form

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Requests > New Request                    [Save as Draft]   │
│        ├──────────────────────────────────────────────────────────────┤
│        │                                                              │
│        │  ── REQUEST DETAILS ──────────────────────────────────────  │
│        │                                                              │
│        │  Request Type *                                              │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │ Congressional Request                             ▾  │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  (Options: Congressional Request / Mandate / Internal Proposal)│
│        │                                                              │
│        │  Requester *               Agency / Program *               │
│        │  ┌─────────────────────┐   ┌──────────────────────────┐    │
│        │  │ Name or organization│   │ Agency or program name   │    │
│        │  └─────────────────────┘   └──────────────────────────┘    │
│        │                                                              │
│        │  Topic *                                                     │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │ Brief description of the engagement topic           │    │
│        │  │                                                     │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  500 characters max                                          │
│        │                                                              │
│        │  Due Date *                                                  │
│        │  ┌─────────────────────┐                                    │
│        │  │ MM/DD/YYYY     [📅] │                                    │
│        │  └─────────────────────┘                                    │
│        │  ⚠ Past date warning (non-blocking): "Due date is in the    │
│        │    past. Permitted for retrospective mandates."              │
│        │                                                              │
│        │  Notes                                                       │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │ Optional — additional context or background         │    │
│        │  │                                                     │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  5000 characters max                                         │
│        │                                                              │
│        │  ── INTAKE DOCUMENT ──────────────────────────────────────  │
│        │                                                              │
│        │  ┌─────────────────────────────────────────────────────┐    │
│        │  │  📄 Drag and drop intake document here              │    │
│        │  │     or  [Browse files]                              │    │
│        │  │     PDF, DOCX, DOC, XLSX, XLS, TXT, PNG, JPG        │    │
│        │  │     Max file size: 25 MB                            │    │
│        │  └─────────────────────────────────────────────────────┘    │
│        │  [File uploaded: congressional-letter-2026.pdf  ✓  ✕]      │
│        │                                                              │
│        │  ── ACTIONS ──────────────────────────────────────────────  │
│        │  [Save as Draft]                [Submit Request →]          │
│        │  (requires request_type only)   (requires all * fields)     │
│        │                                                              │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Request Detail Page (View Mode)

```
┌────────┬──────────────────────────────────────────────────────────────┐
│ NAV    │  Requests > REQ-2026-00003                                   │
│        │  Congressional Request · [Submitted] · Submitted Jan 15, 2026│
│        ├──────────────────────────────────────────────────────────────┤
│        │  ┌────────────────────────────────────────────────────────┐  │
│        │  │ INTAKE DOCUMENT                                        │  │
│        │  │ 📄 congressional-letter-2026.pdf  [Download ↓]        │  │
│        │  └────────────────────────────────────────────────────────┘  │
│        │                                                              │
│        │  Request Type: Congressional Request                        │
│        │  Requester: Senate Committee on Finance                     │
│        │  Topic: Agency Budget Review 2026                           │
│        │  Agency/Program: Office of Budget Management                │
│        │  Due Date: April 30, 2026                                   │
│        │  Notes: [notes text]                                        │
│        │  Submitted: January 15, 2026 at 2:34 PM by Marcus Reid     │
│        │                                                              │
│        │  ── GATE A1 DECISION ─────────────────────────────────────  │
│        │  [Not decided yet]   — A1 decision controls shown here      │
│        │                         when status = submitted AND role=AL  │
│        │                                                              │
│        │  [View Audit Trail →]                                        │
│        │                                                              │
│        │  (Edit button visible if status=draft AND role=AL)          │
└────────┴──────────────────────────────────────────────────────────────┘
```

---

## Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | Request type, requester, topic | Top of form |
| Primary | Submit / Save as Draft actions | Bottom of form; also sticky footer on scroll |
| Secondary | Intake document upload | Mid-form; prominent drag-drop zone |
| Secondary | Due date with warning | Mid-form |
| Tertiary | Notes | Near bottom |

---

## States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| New (empty) | All fields blank; only request_type required for save | — |
| Draft | Status badge "Draft"; Edit button shown; Submit available | Toast on save: "Draft saved [time]" |
| Saving (draft) | Save button: spinner + "Saving..." | "Saving..." |
| File uploading | Progress bar per file | "Uploading filename.pdf..." → "✓ filename.pdf" |
| File error (type) | Red error under drop zone | "File type not permitted. Allowed: PDF, DOCX, ..." |
| File error (size) | Red error under drop zone | "File exceeds maximum size of 25 MB." |
| Validation errors (submit) | Red border + message per field | Per-field messages |
| Submitted | Status badge "Submitted"; all fields read-only; Edit removed | Toast: "Request submitted successfully." |
| Past due date | Yellow warning banner | "Due date is in the past. Permitted for retrospective mandates." |

---

## Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Request Type | Dropdown (required) | Enables "Save as Draft" |
| Requester / Topic / Agency / Due Date | Text / date inputs | Required for Submit; optional for Draft |
| Notes | Textarea | Optional; char count shown |
| File upload zone | Drag-drop + browse | Single file; replaces existing on re-upload |
| Save as Draft | Secondary button | Saves with status=draft; redirects to detail |
| Submit Request | Primary button | Full validation; redirects to detail (submitted) |

---
