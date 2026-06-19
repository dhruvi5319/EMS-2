---
status: diagnosed
trigger: "After uploading a draft file on the Draft Product page, the page reverts to empty state (no draft visible). Refreshing restores it."
created: 2026-06-19T00:00:00Z
updated: 2026-06-19T00:00:00Z
---

## Current Focus

hypothesis: Backend upload route returns `{ file_ref, filename, size }` but frontend expects `{ draft: DraftProduct }` — so `data.draft` is `undefined` and `setDraft(undefined)` triggers empty state.
test: Compared `uploadDraftFile` return type in `backend/src/services/draft.service.ts` (line 296) against frontend assumption in `useDraftProduct.ts` (line 105).
expecting: Mismatch confirmed — backend returns `{ file_ref, filename, size }`, frontend reads `.draft` which is `undefined`.
next_action: DIAGNOSED — root cause confirmed, no fix applied per task instructions.

## Symptoms

expected: After uploading a file, the Draft Product page continues to show the draft with the uploaded file name.
actual: As soon as the file is uploaded, the Draft Product tab reverts to its initial empty state (no draft visible).
errors: No explicit error shown — silent state corruption.
reproduction: Upload any file on the Draft Product tab (Phase 6 UAT Test 3).
started: Discovered during UAT for Phase 6.

## Eliminated

- hypothesis: Component remount due to Radix TabsContent unmounting inactive tabs
  evidence: User stays on the Draft Product tab throughout — no tab switch occurs. Also, no `forceMount` is used but the user never leaves the tab.
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: fetchDraft being re-triggered after upload causing 404 to set draft=null
  evidence: fetchDraft's useCallback dependency is only [engagementId] which doesn't change; useEffect only fires when fetchDraft identity changes. No evidence fetchDraft is called after upload.
  timestamp: 2026-06-19T00:00:00Z

- hypothesis: Race condition between upload response and fetchDraft
  evidence: No concurrent fetchDraft call is triggered by the upload path.
  timestamp: 2026-06-19T00:00:00Z

## Evidence

- timestamp: 2026-06-19T00:00:00Z
  checked: backend/src/routes/draft.ts line 128
  found: `res.json(result)` where `result` is the return value of `uploadDraftFile()`
  implication: The backend response JSON shape is whatever `uploadDraftFile` returns.

- timestamp: 2026-06-19T00:00:00Z
  checked: backend/src/services/draft.service.ts line 249-296
  found: `uploadDraftFile` has return type `Promise<{ file_ref: string; filename: string; size: number }>` and returns `{ file_ref, filename: file.originalname, size: file.size }` at line 296. There is NO `draft` property.
  implication: The backend POST /draft/file response body is `{ file_ref, filename, size }`, NOT `{ draft: DraftProduct }`.

- timestamp: 2026-06-19T00:00:00Z
  checked: frontend/src/hooks/useDraftProduct.ts lines 87-108
  found: `uploadFile` uses raw `fetch` and reads `const data = await res.json() as { draft: DraftProduct }` at line 105, then calls `setDraft(data.draft)` at line 106. Since `data.draft` is `undefined` (the property doesn't exist in the response), `setDraft(undefined)` is called.
  implication: The `draft` state is set to `undefined` after every successful upload.

- timestamp: 2026-06-19T00:00:00Z
  checked: frontend/src/pages/DraftProductPage.tsx lines 131-171
  found: `if (!draft) { return <empty state JSX> }` — since `!undefined === true`, the empty state is rendered after upload completes.
  implication: The page shows "No draft product record yet" immediately after upload because `draft` state became `undefined`.

- timestamp: 2026-06-19T00:00:00Z
  checked: Refresh behavior
  found: On refresh, `fetchDraft()` is called which fetches from the server. The server has the correct data (filename was saved to DB at draft.service.ts line 288-294). So the draft with filename is shown after refresh.
  implication: Confirms this is a pure frontend state bug — data is correctly persisted to DB, only the in-memory state is wrong after upload.

## Resolution

root_cause: API response shape mismatch. The backend `POST /api/engagements/:id/draft/file` route returns `{ file_ref, filename, size }` (from `uploadDraftFile` service, `draft.service.ts:296`), but the frontend `uploadFile` function in `useDraftProduct.ts:105` casts the response as `{ draft: DraftProduct }` and calls `setDraft(data.draft)`. Since `data.draft` is `undefined`, the draft state is set to `undefined`, causing `DraftProductPage`'s guard `if (!draft)` to show the empty state.
fix: (Not applied — diagnose-only mode)
verification: (Not applied)
files_changed: []
