---
status: diagnosed
trigger: "Invalid time value error when saving milestone dates on Team tab"
created: 2026-06-18T00:00:00Z
updated: 2026-06-18T00:00:00Z
symptoms_prefilled: true
---

## Current Focus

hypothesis: CONFIRMED — parseISO() in MilestoneTable.tsx receives a bare date string
  ("YYYY-MM-DD") returned from mapMilestone(), which itself does String(row.target_date).slice(0,10).
  When Postgres/knex returns a Date object for a `date` column, String(dateObj) produces something
  like "Mon Jun 16 2026 00:00:00 GMT+0000 (UTC)" and .slice(0,10) → "Mon Jun 16",
  which is NOT a valid ISO 8601 string. parseISO("Mon Jun 16") returns Invalid Date,
  and then dates[type]!.toISOString() at line 89 of MilestoneTable.tsx throws "Invalid time value".
test: Trace String(row.target_date).slice(0,10) when target_date is a JS Date object
expecting: Produces a non-ISO string like "Mon Jun 16" instead of "2026-06-16"
next_action: COMPLETE — root cause confirmed, fix identified

## Symptoms

expected: Milestone dates save successfully and panel closes/refreshes
actual: ErrorBoundary catches error and shows "Something went wrong. Invalid time value. Try again"
errors: "Invalid time value" — thrown by Date.prototype.toISOString() called on an Invalid Date
reproduction: Set milestone dates on Team tab, click Save
started: After GAP-03 fix (ErrorBoundary now catches what was previously a blank screen)

## Eliminated

- hypothesis: Error is thrown inside upsertMilestones() backend validation
  evidence: Backend validates new Date(d.target_date) which works fine for "YYYY-MM-DD" strings.
    The error message from the backend ("Invalid target_date for ...") is different from what was seen.
  timestamp: 2026-06-18

- hypothesis: toISOString() on line 89 of MilestoneTable.tsx fails because dates[type] is undefined
  evidence: The filter on line 87 (`.filter((type) => dates[type])`) guards against undefined,
    so undefined dates are excluded. The problem is the Date object is constructed from an
    invalid string, making it an Invalid Date, not undefined.
  timestamp: 2026-06-18

## Evidence

- timestamp: 2026-06-18
  checked: MilestoneTable.tsx lines 46-51 (initial date state) and lines 57-63 (refresh after save)
  found: parseISO(m.target_date) is called on every milestone that has a target_date.
    parseISO is strict — it only accepts ISO 8601 strings. If target_date is not a valid
    ISO 8601 string, parseISO returns an Invalid Date silently (no exception).
  implication: If target_date is malformed, parseISO returns Invalid Date, which stores
    as a Date object in state. Filter on line 87 passes it (it's truthy), then line 89
    calls .toISOString() which throws "Invalid time value".

- timestamp: 2026-06-18
  checked: team.service.ts mapMilestone() lines 92-106
  found: Line 96: `const target_date = row.target_date ? String(row.target_date).slice(0, 10) : null;`
    When Postgres returns a `date` column through knex, the value is a JavaScript Date object,
    NOT a string. String(new Date("2026-06-16")) → "Mon Jun 16 2026 00:00:00 GMT+0000 (UTC)".
    .slice(0,10) → "Mon Jun 16" — NOT a valid ISO date string.
  implication: The target_date returned from the API is "Mon Jun 16" or similar, which
    parseISO in MilestoneTable.tsx cannot parse → Invalid Date stored in state.

- timestamp: 2026-06-18
  checked: upsertMilestones() lines 332-342 — what is INSERTED into the DB
  found: d.target_date is the raw string "YYYY-MM-DD" sent from the frontend.
    Postgres stores it in a `date` column and returns it as a JS Date object via knex.
    The isoDate() helper (line 73-76) handles this correctly for timestamps (checks instanceof Date),
    but mapMilestone() bypasses isoDate() and uses String().slice() instead.
  implication: The fix must make mapMilestone() handle both the case where target_date is a
    Date object AND where it's already a string. The correct approach is:
    `val instanceof Date ? val.toISOString().split('T')[0] : String(val).slice(0, 10)`
    — or use the isoDate() helper then slice to 10 chars.

- timestamp: 2026-06-18
  checked: Why the save path produces the error (not the load path)
  found: On load, parseISO("Mon Jun 16") → Invalid Date stored in `dates` state.
    On save click, MilestoneTable.tsx line 87-90:
      .filter((type) => dates[type])  ← Invalid Date is truthy, passes filter
      dates[type]!.toISOString()      ← throws "Invalid time value"
    The error is thrown SYNCHRONOUSLY inside handleSave() before the API call.
    It propagates up as an unhandled throw into the React tree → ErrorBoundary catches it.
  implication: This confirms GAP-03 (ErrorBoundary) was masking this pre-existing bug.
    The blank screen before GAP-03 was caused by the same unhandled throw crashing React.

## Resolution

root_cause: |
  backend/src/services/team.service.ts line 96, inside mapMilestone():
    `const target_date = row.target_date ? String(row.target_date).slice(0, 10) : null;`
  
  Knex returns `date` column values as JavaScript Date objects. String(dateObj) produces
  a locale/timezone-dependent string like "Mon Jun 16 2026 00:00:00 GMT+0000 (UTC)".
  .slice(0, 10) on that gives "Mon Jun 16" — not a valid ISO 8601 date string.
  
  This malformed string is returned in the API response as target_date. In MilestoneTable.tsx,
  parseISO("Mon Jun 16") returns an Invalid Date. On Save, Invalid Date is truthy so it
  passes the filter on line 87, then .toISOString() on an Invalid Date throws "Invalid time value".
  The throw propagates out of handleSave() and is caught by the ErrorBoundary.

fix: |
  In backend/src/services/team.service.ts, line 96, change mapMilestone() to correctly
  handle a Date object:
  
  BEFORE:
    const target_date = row.target_date ? String(row.target_date).slice(0, 10) : null;
  
  AFTER:
    const target_date = row.target_date
      ? (row.target_date instanceof Date
          ? row.target_date.toISOString().split('T')[0]
          : String(row.target_date).slice(0, 10))
      : null;
  
  This ensures that whether knex returns a Date object or a string, the output is always
  a valid "YYYY-MM-DD" string.

verification: empty
files_changed:
  - backend/src/services/team.service.ts
