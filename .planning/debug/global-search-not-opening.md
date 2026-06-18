# Debug Session: Global Search Not Opening (Ctrl+K / Click)

**Date:** 2026-06-17  
**Issue:** Cmd+K does nothing; search bar in TopBar is not clickable  
**UAT Test:** Test 4 — Phase 2 Application Shell  

---

## Investigation Steps

### Step 1: Locate GlobalSearchBar component

Found at: `frontend/src/components/search/GlobalSearchBar.tsx`

The component is fully implemented with:
- A `useEffect` that registers `document.addEventListener('keydown', handleKeyDown)` for Ctrl+K / ⌘K at line 26
- An `<input>` with `onFocus`, `onKeyDown` (Escape), and `onChange` handlers
- A `SearchResultsOverlay` child that renders when `open && query.length > 0`
- Click-outside detection via `mousedown` listener

The keyboard shortcut handler and click interaction are correctly implemented in `GlobalSearchBar`.

### Step 2: Check TopBar component (where the search bar is rendered)

Found at: `frontend/src/components/layout/TopBar.tsx`

**CRITICAL FINDING — ROOT CAUSE:**  
`TopBar.tsx` does NOT use `<GlobalSearchBar />` at all.

Instead, `TopBar.tsx` renders its own **hardcoded, disabled stub input** (lines 36–43):

```tsx
<input
  type="text"
  placeholder="Search engagements, requests..."
  disabled                          // ← disabled attribute: not clickable, not focusable
  className="... cursor-not-allowed ..."
  aria-label="Global search (coming soon)"   // ← labeled "coming soon"
/>
```

The `GlobalSearchBar` component was built and is complete, but it was **never wired into `TopBar`**. The `TopBar` still has the original placeholder stub from before the search feature was implemented.

### Step 3: Verify AppShell wiring

`frontend/src/components/layout/AppShell.tsx` imports and renders `<TopBar />` (line 3, 8).  
`GlobalSearchBar` is imported by nothing — it is a dead, unreferenced component.

```
grep results:
  AppShell.tsx imports TopBar  ✓
  TopBar.tsx  does NOT import GlobalSearchBar  ✗ (never wired)
  GlobalSearchBar.tsx — no other file imports it
```

### Step 4: Keyboard shortcut analysis

Because `<GlobalSearchBar>` is never mounted, its `useEffect` that registers the `keydown` listener **never runs**. The event listener for Ctrl+K / ⌘K is therefore never attached to `document`.

### Step 5: CSS / z-index / pointer-events

Not the issue. The stub input itself has `disabled` and `cursor-not-allowed` which explains the "can't click it" symptom exactly. There are no z-index or pointer-events issues with the real component; it simply isn't rendered.

### Step 6: SearchResultsOverlay / useSearch

Both are correctly implemented and would function properly once `GlobalSearchBar` is actually mounted. No issues found in these files.

---

## Summary

| File | Status |
|------|--------|
| `GlobalSearchBar.tsx` | Complete and correct — never rendered |
| `TopBar.tsx` | Uses a disabled stub; never imports `GlobalSearchBar` |
| `AppShell.tsx` | Renders `TopBar` correctly |
| `useSearch.ts` | Correct implementation |
| `SearchResultsOverlay.tsx` | Correct implementation |

---

## Root Cause

`TopBar.tsx` was never updated to replace its placeholder `<input disabled>` stub with the real `<GlobalSearchBar />` component. Because `GlobalSearchBar` is never mounted anywhere in the component tree:

1. The Ctrl+K / ⌘K `keydown` listener is never registered → shortcut does nothing.
2. The visible input is the disabled stub → it cannot be clicked or focused.

---

## Suggested Fix Direction

In `TopBar.tsx`:
1. Import `GlobalSearchBar` from `@/components/search/GlobalSearchBar`
2. Replace the entire `<div className="flex-1 mx-6">...</div>` center-slot block (lines 34–44) with `<GlobalSearchBar />`
