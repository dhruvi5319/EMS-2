# Accessibility Notes (EMS)

---

## Standards Target

WCAG 2.1 Level AA compliance. The system is a governance tool used by professional staff; AA is appropriate and sufficient.

---

## Color and Contrast

| Requirement | Implementation |
|-------------|----------------|
| Minimum 4.5:1 contrast ratio for normal text | All text on white/light backgrounds must meet this threshold |
| Minimum 3:1 contrast for large text (18pt+) | Section headings and status badge text |
| Status communication must not rely on color alone | Every status badge includes text label (not color-only dots) |
| Error states | Red border + red icon + error text (not border color alone) |
| Success states | Green border + ✓ icon + description text |
| Required field indicators | Asterisk (*) + "Required" in ARIA label |

**Status badge example (color + text always paired):**
```
[● Approved]   not just  [●]
[🔴 Evidence Needed]   not just a red dot
```

---

## Keyboard Navigation

All interactive elements must be operable with keyboard only:

| Element | Keyboard Behavior |
|---------|------------------|
| Navigation sidebar | Tab through items; Enter to navigate; focus ring visible |
| Dropdown menus | Enter/Space to open; arrow keys to navigate options; Escape to close |
| Modals | Focus trapped inside modal when open; Escape closes modal; focus returns to trigger element |
| Tables | Tab navigates cells; row actions accessible via keyboard |
| File upload | Enter on "Choose File" button opens native file picker |
| Date pickers | Standard keyboard input (YYYY-MM-DD); native date input on mobile |
| Form submission | Enter in last field or Tab to submit button; button is focusable |
| Gate decision buttons | Tab to button; focus ring visible; disabled buttons excluded from tab order |
| Accordion / expand rows | Enter/Space to toggle expand; arrow keys for next/previous |

**Focus ring:** Never suppressed (no `outline: none` without replacement). Use a clearly visible 2px solid focus indicator with sufficient contrast.

---

## Screen Reader Considerations

### Page Structure

- Each page has a single `<h1>` matching the breadcrumb page title
- Section headings use `<h2>` / `<h3>` hierarchy (not styled `<div>` elements)
- Landmark regions: `<nav>`, `<main>`, `<aside>` (for side panels), `<footer>`
- Skip navigation link at top of every page: "Skip to main content"

### Forms

- All form labels use `<label>` with `for` attribute pointing to input `id`
- Required fields: `aria-required="true"` on input + asterisk (*) in label
- Error messages: `aria-describedby` linking input to its error message element; `aria-invalid="true"` on invalid inputs
- Fieldsets with `<legend>` for grouped inputs (radio buttons for gate outcomes, objective selectors)

### Status and Live Regions

- Gate prerequisite checklist: `role="status"` or `aria-live="polite"` so updates are announced when prerequisites change
- Toast notifications: `role="alert"` with `aria-live="assertive"` for errors; `aria-live="polite"` for success toasts
- File upload progress: `role="progressbar"` with `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Loading states: `aria-busy="true"` on the container while loading

### Tables

- Evidence list, portfolio dashboard list, audit trail, reference check queue: use `<table>` with proper `<th scope="col">` headers
- Row-level actions use `aria-label` including the row identifier (e.g., "Edit evidence item E-001")
- Sortable columns use `aria-sort="ascending"` / `aria-sort="descending"`

### Buttons and Icons

- Icon-only buttons (close ✕, remove ×, download ↓): `aria-label` describing the action and target (e.g., `aria-label="Remove team member Priya Nair"`)
- Disabled buttons: `disabled` attribute (not just visual styling) so screen readers skip them; add `aria-disabled="true"` for informational context when needed
- "Approve P4" when disabled: tooltip or `aria-describedby` pointing to text "Resolve failing prerequisites to enable approval"

### Navigation

- Active navigation item: `aria-current="page"` on the active `<a>` element
- Review Queue badge count: `aria-label="Review Queue, 3 items pending"` on the nav item
- Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>` structure; current page has `aria-current="page"`

---

## ARIA Labels Reference (Key Elements)

| Element | ARIA Pattern |
|---------|-------------|
| Main navigation | `<nav aria-label="Main navigation">` |
| Breadcrumb | `<nav aria-label="Breadcrumb">` |
| Gate status cards section | `<section aria-label="Gate status">` |
| Prerequisite checklist | `<ul role="list" aria-label="P2 prerequisites checklist">` |
| Evidence list table | `<table aria-label="Evidence items for ENG-2026-00001">` |
| File upload drop zone | `role="region" aria-label="File upload area"` |
| Toast container | `role="alert" aria-live="polite"` |
| Progress bar | `role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Reference check progress"` |
| Status badge | `<span aria-label="Status: Approved">` |
| Comment thread | `<section aria-label="Review comments" aria-live="polite">` |

---

## Form Accessibility Patterns

### Required Field with Error State
```html
<label for="rationale">
  Decision Rationale <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<textarea
  id="rationale"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="rationale-error"
></textarea>
<p id="rationale-error" role="alert">
  Rationale must be at least 10 characters.
</p>
```

### Gate Decision Radio Group
```html
<fieldset>
  <legend>Outcome</legend>
  <label><input type="radio" name="outcome" value="ready_for_issuance"> Ready for Issuance</label>
  <label><input type="radio" name="outcome" value="closed"> Closed</label>
</fieldset>
```

---

## Restricted Evidence Accessibility

- Restricted evidence items are fully absent from the DOM for unauthorized users (not hidden with CSS)
- No "X items hidden" count is shown to AL/RO — absence is silent and intentional
- Evidence detail pages for restricted items return a 403 page with a readable error message: "You are not authorized to view this evidence item."

---

## Motion and Animation

- No essential information is conveyed through animation alone
- Progress bar updates are also announced via `aria-valuenow` changes
- Transitions (slide-in panel, modal appear) use `prefers-reduced-motion` media query to disable animation for users who have requested reduced motion
- Toast auto-dismiss timer is paused when user has focus on the toast

---

## Testing Checklist

Before release, each screen should be verified with:
- [ ] Keyboard-only navigation (no mouse)
- [ ] Screen reader (NVDA + Firefox, VoiceOver + Safari)
- [ ] Browser zoom to 200% — no content clipped or lost
- [ ] Contrast checker on all text elements (4.5:1 minimum)
- [ ] Color-blind simulation (protanopia, deuteranopia) — status still distinguishable by text
- [ ] Mobile tap target size ≥ 44×44px on all interactive elements

---
