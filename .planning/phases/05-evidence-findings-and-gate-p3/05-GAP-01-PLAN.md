---
phase: 05-evidence-findings-and-gate-p3
plan: GAP-01
type: execute
wave: 1
depends_on: []
files_modified:
  - backend/src/routes/evidence.ts
  - backend/src/services/findings.service.ts
autonomous: true
gap_closure: true

features:
  implements: ["F8", "F10"]
  depends_on: []
  enables: []

must_haves:
  truths:
    - "GET /api/engagements/:id/evidence/:evidence_id/files returns the list of files for an evidence item"
    - "POST /api/engagements/:id/gate/p3 returns 409 when P3 has already been approved for the engagement"
  artifacts:
    - path: "backend/src/routes/evidence.ts"
      provides: "GET /:evidence_id/files endpoint returns { files: EvidenceFile[] }"
    - path: "backend/src/services/findings.service.ts"
      provides: "recordP3Decision throws 409 on duplicate P3 approval"
  key_links:
    - from: "backend/src/routes/evidence.ts"
      to: "backend/src/services/evidence.service.ts"
      via: "GET /:evidence_id/files queries evidence_files table"
      pattern: "evidence_files.*evidence_id"
    - from: "backend/src/services/findings.service.ts"
      to: "backend/src/db"
      via: "SELECT gate_decisions WHERE gate_name=P3 AND decision=approved before writing"
      pattern: "gate_decisions.*P3.*approved|409"

integration_contracts:
  requires: []
  provides:
    - artifact: "backend/src/routes/evidence.ts"
      exports: ["GET /:evidence_id/files"]
      shape: |
        GET /api/engagements/:id/evidence/:evidence_id/files
        Response 200: { files: EvidenceFile[] }
        // Each file: { id, evidence_item_id, original_filename, file_size, mime_type, storage_key, uploaded_by, created_at }
        // 403 if evidence is RESTRICTED and caller is AL/RO
      verify: "grep -n 'GET.*evidence_id.*files\\|files.*GET' backend/src/routes/evidence.ts | head -3 && echo CONTRACT_OK"
    - artifact: "backend/src/services/findings.service.ts"
      exports: ["recordP3Decision"]
      shape: |
        recordP3Decision throws { status: 409, message: 'Gate P3 has already been approved...' }
        when gate_decisions already contains an approved P3 for the engagement
      verify: "grep -n '409' backend/src/services/findings.service.ts && echo CONTRACT_OK"
---

<objective>
Gap closure: fix two backend issues found during UAT.

1. **Missing GET files endpoint (UAT Test 2):** `EvidenceDetailPage` fetched `GET /api/engagements/:id/evidence/:evidenceId/files` to display uploaded filenames, but that route did not exist — only POST and DELETE were registered. Added the missing GET endpoint to `backend/src/routes/evidence.ts`.

2. **P3 re-approval not blocked (UAT Test 13):** After Gate P3 was approved, navigating back to the P3 Review page and clicking Approve again would succeed — the backend accepted duplicate approvals. Added a 409 idempotency guard to `recordP3Decision()` in `findings.service.ts` that queries for an existing approved P3 decision and throws before processing a duplicate.

Output: Both backend gaps closed. Evidence file list returns correct data. Gate P3 cannot be approved twice.
</objective>

<feature_dependencies>
Implements: F8 (evidence file list endpoint), F10 (Gate P3 idempotency)
Depends on: None
Enables: None (fixes only)
</feature_dependencies>

<execution_context>
@.planning/phases/05-evidence-findings-and-gate-p3/05-01-SUMMARY.md
@.planning/phases/05-evidence-findings-and-gate-p3/05-03-SUMMARY.md
</execution_context>

<context>
@backend/src/routes/evidence.ts
@backend/src/services/findings.service.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add GET /:evidence_id/files endpoint to evidence router</name>
  <files>backend/src/routes/evidence.ts</files>
  <action>
In `backend/src/routes/evidence.ts`, add the missing GET endpoint for listing files attached to an evidence item.

Register it AFTER `GET /:evidence_id` (the single evidence detail endpoint) and BEFORE `POST /:evidence_id/files`:

```typescript
// GET /api/engagements/:id/evidence/:evidence_id/files — all authenticated roles (with sensitivity check)
evidenceRouter.get(
  '/:evidence_id/files',
  async (req: Request, res: Response) => {
    try {
      const { id: engagementId, evidence_id } = req.params;

      // Sensitivity check — fetch evidence item first
      const evidenceItem = await db('evidence_items')
        .where({ id: evidence_id, engagement_id: engagementId })
        .first();

      if (!evidenceItem) {
        res.status(404).json({ error: 'Evidence item not found.' });
        return;
      }

      if (evidenceItem.sensitivity === 'restricted') {
        const PRIVILEGED = new Set(['AN', 'EM', 'QA', 'IR', 'PC', 'AD']);
        if (!req.user!.roles.some((r: string) => PRIVILEGED.has(r))) {
          res.status(403).json({ error: 'Access denied — restricted evidence.' });
          return;
        }
      }

      const rows = await db('evidence_files')
        .where({ evidence_id })
        .orderBy('uploaded_at', 'asc')
        .select('*');

      const files = rows.map((row: Record<string, unknown>) => ({
        id: row.id,
        evidence_item_id: row.evidence_id,
        original_filename: row.filename ?? row.original_filename,
        file_size: row.file_size,
        mime_type: row.mime_type,
        storage_key: row.file_ref ?? row.storage_key,
        uploaded_by: row.uploaded_by,
        created_at: row.uploaded_at instanceof Date
          ? (row.uploaded_at as Date).toISOString()
          : row.uploaded_at,
      }));

      res.json({ files });
    } catch (err) {
      handleError(err, res, 'GET /evidence/:evidence_id/files');
    }
  }
);
```
  </action>
  <verify>
grep -n "GET.*evidence_id.*files" backend/src/routes/evidence.ts && echo "GET_FILES_ROUTE_OK"
  </verify>
  <done>GET /:evidence_id/files endpoint registered and returns { files: EvidenceFile[] } with sensitivity check.</done>
</task>

<task type="auto">
  <name>Task 2: Add 409 idempotency guard to recordP3Decision()</name>
  <files>backend/src/services/findings.service.ts</files>
  <action>
In `backend/src/services/findings.service.ts`, inside `recordP3Decision()`, add a check before the db.transaction() that queries for an existing approved P3 gate decision for the engagement and throws 409 if found:

```typescript
// Prevent duplicate P3 approval — only one approved P3 decision per engagement
const existingApproval = await db('gate_decisions')
  .where({ engagement_id: engagementId, gate_name: 'P3', decision: 'approved' })
  .first();

if (existingApproval && data.decision === 'approved') {
  const err = new Error('Gate P3 has already been approved for this engagement.');
  (err as any).status = 409;
  throw err;
}
```

Place this check after the comment validation and before the `checkP3Prerequisites` re-run.
  </action>
  <verify>
grep -n "409\|duplicate\|already.*approved" backend/src/services/findings.service.ts && echo "IDEMPOTENCY_GUARD_OK"
  </verify>
  <done>recordP3Decision() throws 409 when an approved P3 gate decision already exists for the engagement, preventing duplicate approvals.</done>
</task>

</tasks>

<verification>
```bash
# 1. GET files route registered
grep 'GET.*evidence_id.*files' backend/src/routes/evidence.ts && echo PASS

# 2. 409 guard in findings service
grep '409\|already.*approved\|duplicate' backend/src/services/findings.service.ts && echo PASS

# 3. TypeScript clean
cd backend && npx tsc --noEmit 2>&1 | tail -5 && echo TYPESCRIPT_OK
```
</verification>

<success_criteria>
- `GET /api/engagements/:id/evidence/:evidence_id/files` returns `{ files: [...] }` with 200
- `GET /api/engagements/:id/evidence/:evidence_id/files` returns 403 for AL/RO on RESTRICTED evidence
- `POST /api/engagements/:id/gate/p3` with `decision=approved` on an already-approved engagement returns 409
- TypeScript compiles without errors
</success_criteria>

<output>
After completion, create `.planning/phases/05-evidence-findings-and-gate-p3/05-GAP-01-SUMMARY.md`
</output>
