# Interaction Patterns (EMS)

---

## Pattern: Gate Decision Panel

**When to use:** Any screen where a gate approval or return action occurs (A1, P2, P3, P4)  
**Behavior:**
1. Decision panel is rendered at the bottom of the review page (sticky on scroll if page is long)
2. Comment/rationale textarea is required; real-time character counter shows current/minimum
3. Primary action button (Approve/Accept) is disabled until:
   - All prerequisite checklist items show ✓
   - Comment meets minimum character requirement
4. Destructive action (Return/Decline) uses secondary button styling; triggers a confirmation modal
5. On success: API call → success toast → redirect to next appropriate page

**Confirmation modal for irreversible gate actions:**
```
┌─────────────────────────────────────────────────────────────┐
│  Confirm Gate P2 Approval                                    │
├─────────────────────────────────────────────────────────────┤
│  You are about to approve the planning baseline for         │
│  ENG-2026-00001. This will lock the planning record and     │
│  advance the engagement to the Evidence phase.              │
│                                                             │
│  This action cannot be undone.                              │
│                                                             │
│  [Cancel]                      [Confirm Approval]           │
└─────────────────────────────────────────────────────────────┘
```

**Used in:** Screen-04 (A1), Screen-08 (P2), Screen-10 (P3), Screen-13 (P4)

---

## Pattern: Prerequisites / Readiness Checklist

**When to use:** Before any gate submission or approval  
**Behavior:**
- Checklist computed in real-time from backend state
- Each item shows: ✓ (green, pass) or 🔴 (red, fail) with brief description
- Failing items include a link to the blocking record
- "Submit" or "Approve" button disabled while any item shows 🔴
- On all-pass: summary message "All prerequisites met." appears above the action button

**Visual states:**
```
✓  [Item label — pass state]          ← green text
🔴 [Item label — fail state]          ← red text + link to fix
   [→ View affected record]
```

**Used in:** Screen-07 (P2 submission readiness), Screen-08 (P2 approval checklist), Screen-10 (P3 checklist), Screen-13 (P4 checklist)

---

## Pattern: Inline Required Field Validation

**When to use:** All forms with required fields (request intake, planning record, gate decision panels)  
**Behavior:**
- Validation triggers on field blur (not on keystroke) to avoid premature error messages
- Error message appears immediately below the invalid field in red
- Field border turns red on invalid; green on valid
- Form submit button disabled until all required fields are valid
- Soft warnings (e.g., past due date) use amber styling and do not block submission

**Field states:**
```
┌─────────────────────────────────────┐
│ Field Label *                       │  ← asterisk = required
│ [field value                      ] │  ← border: default grey
└─────────────────────────────────────┘
                                          (valid: green border)
                                          (invalid: red border + error below)
  ⚠ "This field is required."            ← error text below
```

**Used in:** Screen-03 (request intake), Screen-07 (planning record), all gate decision panels

---

## Pattern: File Upload with Progress Feedback

**When to use:** Intake document upload (F2), evidence file upload (F8), draft file attachment (F11)  
**Behavior:**
1. Drop zone or "Choose Files" button opens file picker
2. On selection: immediate type/size validation before upload begins
3. Type error: red inline message listing allowed types
4. Size error: red inline message with limit
5. Valid file: upload begins with progress bar (0–100%)
6. Upload success: filename + size displayed with ✓; remove button available
7. Upload error: red inline message with retry option

**Upload area states:**
```
IDLE:
┌─────────────────────────────────────────┐
│  [📎 Choose File]  or drag & drop here  │
│  Allowed: PDF, DOCX, ...  Max: 25 MB    │
└─────────────────────────────────────────┘

UPLOADING:
┌─────────────────────────────────────────┐
│  report-v1.pdf                          │
│  ████████████░░░░░░  65%               │
└─────────────────────────────────────────┘

SUCCESS:
┌─────────────────────────────────────────┐
│  ✓ report-v1.pdf (2.1 MB)  [✕ Remove]  │
└─────────────────────────────────────────┘

ERROR:
┌─────────────────────────────────────────┐
│  ⚠ File exceeds maximum size of 25 MB. │
│  [Choose a different file]              │
└─────────────────────────────────────────┘
```

**Used in:** Screen-03 (intake document), Screen-09 (evidence files), Screen-11 (draft file)

---

## Pattern: Toast Notifications

**When to use:** Non-blocking success and informational feedback after actions  
**Behavior:**
- Toast appears top-right, slides in, auto-dismisses after 4 seconds
- User can manually dismiss with ✕
- Colors: green = success, amber = warning, red = error (for non-inline errors)
- Multiple toasts stack vertically

**Examples:**
- "Draft saved." (green)
- "Request submitted." (green)
- "Evidence item saved." (green)
- "Comment saved." (green)
- "Statement assigned to Priya Nair." (green)
- "File storage unavailable. Please try again." (red)

---

## Pattern: Status Badges

**When to use:** Phase, gate status, sensitivity, and milestone status indicators across all screens  
**Consistent badge colors:**

| Status / Value | Badge Color |
|----------------|-------------|
| Draft | Grey |
| Submitted | Blue |
| Accepted / Active | Green |
| Declined / Closed | Red |
| Planning phase | Purple |
| Evidence phase | Teal |
| Draft phase | Orange |
| Readiness phase | Indigo |
| Ready for Issuance | Green (strong) |
| Approved (gate) | Green |
| Returned (gate) | Amber |
| Not Started (gate/milestone) | Grey |
| On Track (milestone) | Green |
| At Risk (milestone) | Amber |
| Overdue (milestone) | Red |
| Complete (milestone) | Green (strong) |
| Standard (sensitivity) | Grey |
| Restricted (sensitivity) | Red |
| Evidence Needed | Red |
| In Review | Amber |
| Sufficient | Green |
| Passed (ref check) | Green |
| Failed (ref check) | Red |
| Waived (ref check) | Grey |

---

## Pattern: Empty States

**When to use:** Lists with no items yet  
**Behavior:** Show a centered illustration + message + primary action button (if user has permission)

**Standard empty state structure:**
```
         [  icon / illustration  ]

         No [items] yet.
         [Brief context sentence.]

         [Primary Action Button]
```

**Examples by screen:**
- Evidence list: "No evidence added yet. Add your first evidence item." + [+ Add Evidence]
- Findings list: "No findings yet. Create findings after uploading evidence." + [+ Add Finding]
- Team: "No team members assigned. Add team members to get started." + [+ Add Team Member]
- Audit trail: "No audit events recorded yet."
- Review queue: "No items awaiting your review." (no action button for empty state)

---

## Pattern: Confirmation Dialogs

**When to use:** Destructive or irreversible actions (gate returns, declines, evidence deletion, team removal)  
**Behavior:**
- Modal overlay, cannot be dismissed by clicking outside (intentional — prevents accidental dismissal)
- Clear title naming the action
- Brief consequence description
- Cancel (left, secondary) and Confirm (right, destructive/primary) buttons
- Confirm button uses the action's label (e.g., "Delete Evidence", "Decline Request") not generic "OK"

---

## Pattern: Review Queue

**When to use:** Review Queue page for AL, QA, IR, PC; also surfaced as a badge count in sidebar navigation  
**Behavior:**
- Shows all items pending the current user's action across all engagements
- Columns: Type (gate/reference check), Engagement ID, Submitted date, Days waiting
- Items ≥3 days old flagged with ⚠ indicator
- Sorted by submitted_at ascending (oldest first) by default
- Clicking any row opens the review page directly

**Sidebar badge:**
```
Review Queue  [3]   ← badge shows count of pending items for this role
```

---

## Pattern: Sensitive Data Handling (Restricted Evidence)

**When to use:** Any page that can display evidence items  
**Behavior:**
- Restricted evidence items are not returned in API responses for AL and RO users
- Restricted items do not appear as empty rows — they are fully absent
- If a user navigates directly to a restricted evidence URL, they receive HTTP 403 and a friendly "Not authorized" page
- Evidence lists show a count only for items the user can see; no indication of hidden items

---
