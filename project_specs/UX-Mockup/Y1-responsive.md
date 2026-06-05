# Responsive Considerations (EMS)

---

## Breakpoints

| Breakpoint | Width | Layout Mode |
|------------|-------|-------------|
| Desktop | > 1024px | Full sidebar + content area |
| Tablet | 768px – 1024px | Collapsed icon-only sidebar + content area |
| Mobile | < 768px | Hamburger menu overlay + stacked content |

---

## Desktop (> 1024px)

**Sidebar:** 220px fixed left; always visible; full text labels + role badge at bottom  
**Content area:** Fluid, max-width 1280px, centered with 32px horizontal padding  
**Tables:** All columns visible; horizontal scroll not needed at standard engagement scale  
**Forms:** Two-column layout for short fields (e.g., date + type side-by-side); single-column for long text areas  
**Modals:** Centered, max-width 600px, backdrop blur  
**Gate status cards:** Horizontal row of 4 cards (A1, P2, P3, P4) across the top of the engagement shell  

```
┌────────────────────────────────────────────────────────────────────┐
│ [A1: Approved ✓]  [P2: Approved ✓]  [P3: In Progress]  [P4: —]    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Tablet (768px – 1024px)

**Sidebar:** Collapses to 56px icon-only rail; hover/tap reveals full labels in tooltip  
**Content area:** Fluid, 16px horizontal padding  
**Tables:** Horizontal scroll enabled; priority columns (ID, Status, Phase) pinned left; secondary columns (Owner, Due Date) scroll off-screen to right  
**Forms:** Single-column layout for all fields  
**Modals:** Full-width with 16px margins  
**Gate status cards:** Wrap to 2×2 grid  

```
┌─────────────────────────────────────────┐
│ [A1: Approved ✓]  [P2: Approved ✓]     │
│ [P3: In Progress] [P4: —]              │
└─────────────────────────────────────────┘
```

**Navigation:**
```
[≡]  Dashboard  Requests  Engagements  Queue  Reports
  ↑ icon-only rail (56px) — tap to expand
```

---

## Mobile (< 768px)

**Navigation:** Hamburger (≡) button in top bar opens full overlay menu; menu closes on item tap or ✕  
**Content area:** 100% width, 12px horizontal padding  
**Tables (Portfolio Dashboard list):**  
- Column priority order: Engagement ID, Title, Phase, Status — other columns collapsed into expandable detail row
- Each row expands on tap to show: Owner, Risk Level, Next Milestone, Gate Status  
**Forms:** Single-column; date pickers use native mobile date input  
**Gate status cards:** Vertically stacked, full-width, collapsible  
**File upload:** Uses native file picker; drag-drop disabled (no desktop drag support)  
**Modals / panels:** Full-screen takeover with back arrow instead of modal overlay  
**Review comments:** Collapsed by default; "Show Comments (3)" tap to expand  

```
┌──────────────────────────────┐
│ [≡ EMS]           [🔍][User] │
├──────────────────────────────┤
│                              │
│  ENG-2026-00001              │
│  Budget Review   [Planning]  │
│                              │
│  ▼ (tap to expand)          │
│  Owner: Diana Okafor         │
│  Risk: Medium                │
│  Next: P2 — Feb 2            │
│  A1 ✓ P2 ○ P3 ○ P4 ○       │
└──────────────────────────────┘
```

---

## Priority Rules for Responsive Degradation

When screen space is reduced, the following elements take priority in this order:

1. **Action controls** — Gate decision buttons, submit buttons, primary CTAs always visible without scroll
2. **Status indicators** — Phase, gate status, blocker badges always visible
3. **Required field errors** — Inline validation never hidden by layout
4. **Secondary metadata** — Portfolio, custodian, audit timestamps can collapse/hide
5. **Column data in tables** — Non-critical columns hide at smaller breakpoints

---

## Touch Targets

All interactive elements must meet a minimum 44×44px touch target on mobile and tablet (per WCAG 2.5.5 Target Size guideline). This applies to:
- Navigation items
- Table row actions (Edit, Delete, View)
- Radio buttons and checkboxes (expanded tap area)
- Form submit and cancel buttons
- Badge/status dropdowns

---

## Sidebar Navigation Responsive Behavior

```
Desktop                Tablet                 Mobile
┌────────┐             ┌──┐                   ┌──────────────────────┐
│ NAV    │             │  │                   │  [≡ EMS]          [✕]│
│ Dash   │             │🏠│                   │  Dashboard           │
│ Request│             │📋│                   │  Requests            │
│ Engage │ ──────────▶ │🏢│ ──────────────▶   │  Engagements         │
│ Review │             │📥│                   │  Review Queue    [3] │
│ Reports│             │📊│                   │  Reports             │
│ [Role] │             │  │                   │  [Logout]            │
└────────┘             └──┘                   └──────────────────────┘
220px fixed          56px icons             Full-screen overlay
```

---
