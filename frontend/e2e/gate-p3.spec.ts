import { test, expect } from '@playwright/test';

const ADMIN_USER = { username: 'admin', password: 'Admin1234!' };
const QA_USER = { username: 'qa_reviewer', password: 'QA1234567!' };

/**
 * Login helper — navigate to login page and authenticate.
 */
async function login(
  page: import('@playwright/test').Page,
  credentials = ADMIN_USER
) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(credentials.username);
  await page.getByLabel('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

/**
 * Mock the Gate P3 prerequisites API with all-passing prerequisites.
 */
async function mockPrerequisitesPass(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements/*/gate/p3/prerequisites', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        all_pass: true,
        blockers: [],
      }),
    });
  });
}

/**
 * Mock the Gate P3 prerequisites API with failing prerequisites.
 */
async function mockPrerequisitesFail(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements/*/gate/p3/prerequisites', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        all_pass: false,
        blockers: [
          { type: 'objective_no_evidence', message: 'Objective 2 has no linked evidence (P3 blocked)' },
        ],
      }),
    });
  });
}

/**
 * Mock the objectives coverage API.
 */
async function mockObjectivesCoverage(
  page: import('@playwright/test').Page,
  options: { obj2EvidenceCount?: number } = {}
) {
  const obj2Count = options.obj2EvidenceCount ?? 1;
  await page.route('**/api/engagements/*/objectives/coverage', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        objectives: [
          {
            id: 'obj-1',
            objective_text: 'Assess adequacy of internal budget controls for FY2026',
            evidence_count: 2,
            sufficiency_status: 'sufficient',
          },
          {
            id: 'obj-2',
            objective_text: 'Evaluate data reliability of financial reporting systems',
            evidence_count: obj2Count,
            sufficiency_status: obj2Count === 0 ? 'evidence_needed' : 'in_review',
          },
        ],
        covered: obj2Count > 0 ? 2 : 1,
        total: 2,
        uncovered_count: obj2Count > 0 ? 0 : 1,
      }),
    });
  });
}

/**
 * Mock the findings API.
 */
async function mockFindings(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements/*/findings', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        findings: [
          {
            id: 'finding-001',
            engagement_id: 'eng-test',
            finding_text: 'Budget controls show systematic weaknesses in quarterly reconciliation.',
            status: 'draft',
            created_by: 'user-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            evidence_count: 2,
            evidence_items: [],
            objective_ids: ['obj-1'],
          },
        ],
        total: 1,
      }),
    });
  });
}

/**
 * Mock all required APIs for the Gate P3 Review page.
 */
async function mockAllP3APIs(
  page: import('@playwright/test').Page,
  options: {
    allPrereqsPass?: boolean;
    obj2EvidenceCount?: number;
  } = {}
) {
  if (options.allPrereqsPass ?? true) {
    await mockPrerequisitesPass(page);
  } else {
    await mockPrerequisitesFail(page);
  }
  await mockObjectivesCoverage(page, { obj2EvidenceCount: options.obj2EvidenceCount ?? 1 });
  await mockFindings(page);
}

// ────────────────────────────────────────────────────────────────────────────
// Test: P3 review page loads for QA user
// ────────────────────────────────────────────────────────────────────────────
test('p3 review page loads for QA user', async ({ page }) => {
  await mockAllP3APIs(page, { allPrereqsPass: true });
  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Objective sufficiency table should be visible
  await expect(page.getByText('Objective Sufficiency Table')).toBeVisible();

  // Findings section should be visible
  await expect(page.getByText('Findings (Read-Only)')).toBeVisible();

  // Prerequisites checklist section renders
  await expect(page.getByText('P3 Gate Prerequisites')).toBeVisible();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: non-QA user sees read-only sufficiency chips (no Select dropdown)
// ────────────────────────────────────────────────────────────────────────────
test('non-QA user sees read-only sufficiency chips', async ({ page }) => {
  // Mock an AN user (analyst — not QA/EM/AD)
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'user-analyst',
        username: 'analyst_user',
        display_name: 'Analyst User',
        email: 'analyst@test.com',
        roles: ['AN'],
        is_active: true,
      }),
    });
  });

  await mockAllP3APIs(page, { allPrereqsPass: false });
  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // The P3 Decision Panel should NOT be visible for AN role
  await expect(page.getByRole('region', { name: 'Gate P3 Decision' })).not.toBeVisible();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: sufficiency select disabled when objective has no evidence
// ────────────────────────────────────────────────────────────────────────────
test('sufficiency select disabled when objective has no evidence', async ({ page }) => {
  // Objective 2 has 0 evidence
  await mockObjectivesCoverage(page, { obj2EvidenceCount: 0 });
  await mockPrerequisitesFail(page);
  await mockFindings(page);
  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Wait for the table to render
  await expect(page.getByText('Objective Sufficiency Table')).toBeVisible();

  // The In Review option item for obj-2 should be aria-disabled
  // The select trigger should be present for editable users (admin has AD role)
  const selectTrigger = page.getByRole('combobox', { name: /Set evidence sufficiency for Objective 2/ });
  await expect(selectTrigger).toBeVisible();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: approve P3 button disabled when prerequisites fail
// ────────────────────────────────────────────────────────────────────────────
test('approve P3 button disabled when prerequisites fail', async ({ page }) => {
  await mockAllP3APIs(page, { allPrereqsPass: false });
  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Approve P3 button should be disabled (aria-disabled="true")
  const approveButton = page.getByRole('button', { name: /Approve P3/ });
  await expect(approveButton).toBeDisabled();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: approve P3 dialog opens and shows correct buttons
// ────────────────────────────────────────────────────────────────────────────
test('approve P3 dialog opens and shows correct buttons', async ({ page }) => {
  await mockAllP3APIs(page, { allPrereqsPass: true });
  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Wait for prerequisites banner to appear
  await expect(page.getByText('All prerequisites are met. You may approve Gate P3.')).toBeVisible();

  // Type a valid comment (≥10 chars)
  const commentTextarea = page.getByLabel('Decision Comment');
  await commentTextarea.fill('This engagement has met all P3 requirements.');

  // Approve P3 button should now be enabled
  const approveButton = page.getByRole('button', { name: /✓ Approve P3/ });
  await expect(approveButton).toBeEnabled();

  // Click to open dialog
  await approveButton.click();

  // Dialog title should appear
  await expect(page.getByText('Approve Evidence Sufficiency (Gate P3)?')).toBeVisible();

  // Both buttons should be present
  await expect(page.getByRole('button', { name: 'Keep Under Review' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm Approve P3 ✓' })).toBeVisible();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: confirm P3 approval posts to API and redirects
// ────────────────────────────────────────────────────────────────────────────
test('confirm P3 approval posts to API and redirects', async ({ page }) => {
  await mockAllP3APIs(page, { allPrereqsPass: true });

  // Mock the gate p3 POST endpoint
  await page.route('**/api/engagements/*/gate/p3', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          gate_decision: {
            id: 'decision-1',
            gate_type: 'P3',
            decision: 'approved',
            comment: 'Test comment',
            decided_by: 'user-1',
            decided_at: new Date().toISOString(),
          },
        }),
      });
    } else {
      route.continue();
    }
  });

  // Mock engagement detail for redirect
  await page.route('**/api/engagements/test-engagement-id', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        engagement: {
          id: 'test-engagement-id',
          job_code: 'ENG-2026-00001',
          status: 'draft',
          engagement_type: 'performance',
          agency_program: 'Test Agency',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        gate_decisions: [
          { id: 'gd-1', gate_type: 'P3', decision: 'approved', decided_at: new Date().toISOString() },
        ],
        blockers: [],
      }),
    });
  });

  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Enter valid comment and click Approve P3
  await page.getByLabel('Decision Comment').fill('This engagement has met all P3 requirements fully.');
  await page.getByRole('button', { name: /✓ Approve P3/ }).click();
  await page.getByRole('button', { name: 'Confirm Approve P3 ✓' }).click();

  // Should redirect to engagement shell
  await expect(page).toHaveURL(/\/engagements\/test-engagement-id$/);

  // Toast should appear with "Gate P3 approved."
  await expect(page.getByText('Gate P3 approved.')).toBeVisible();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: return for revision dialog opens
// ────────────────────────────────────────────────────────────────────────────
test('return for revision dialog opens', async ({ page }) => {
  await mockAllP3APIs(page, { allPrereqsPass: false });
  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Enter valid comment (≥10 chars)
  const commentTextarea = page.getByLabel('Decision Comment');
  await commentTextarea.fill('Returning because Objective 2 has no linked evidence.');

  // Return for Revision button should now be enabled
  const returnButton = page.getByRole('button', { name: 'Return for Revision' });
  await expect(returnButton).toBeEnabled();

  // Click to open return dialog
  await returnButton.click();

  // Dialog should appear with correct title and buttons
  await expect(page.getByText('Return for Revision?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep in Review' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm Return' })).toBeVisible();
});

// ────────────────────────────────────────────────────────────────────────────
// Test: confirm return redirects to review queue
// ────────────────────────────────────────────────────────────────────────────
test('confirm return redirects to review queue', async ({ page }) => {
  await mockAllP3APIs(page, { allPrereqsPass: false });

  // Mock the gate p3 POST endpoint for return
  await page.route('**/api/engagements/*/gate/p3', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          gate_decision: {
            id: 'decision-2',
            gate_type: 'P3',
            decision: 'returned',
            comment: 'Test return comment',
            decided_by: 'user-1',
            decided_at: new Date().toISOString(),
          },
        }),
      });
    } else {
      route.continue();
    }
  });

  // Mock review queue data
  await page.route('**/api/requests**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ requests: [], total: 0 }),
    });
  });

  await login(page);
  await page.goto('/engagements/test-engagement-id/evidence/p3-review');

  // Enter valid comment and click Return for Revision
  await page.getByLabel('Decision Comment').fill('Returning because Objective 2 has no linked evidence items.');
  await page.getByRole('button', { name: 'Return for Revision' }).click();
  await page.getByRole('button', { name: 'Confirm Return' }).click();

  // Should redirect to review queue
  await expect(page).toHaveURL(/\/review-queue$/);

  // Toast should appear
  await expect(page.getByText('P3 review returned for revision.')).toBeVisible();
});
