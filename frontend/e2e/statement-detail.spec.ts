import { test, expect } from '@playwright/test';

/**
 * E2E tests for StatementDetailPage (F12)
 * Route: /engagements/:id/draft/statements/:statementId
 *
 * Tests:
 * 1. IR can view statement text and linked evidence
 * 2. IR decision panel shows radio group with In Review / Passed / Failed options
 * 3. Selecting Failed reveals discrepancy type and notes fields
 * 4. Save Status fails when Failed selected but discrepancy notes empty
 * 5. IR can save Passed status and see toast
 * 6. AN correction view shows AnalystCorrectionNotice panel
 */

const IR_USER = { username: 'ir_user', password: 'IR12345678!' };
const AN_USER = { username: 'analyst_user', password: 'AN12345678!' };
const ADMIN_USER = { username: 'admin', password: 'Admin1234!' };

const ENGAGEMENT_ID = 'test-engagement-001';
const STATEMENT_ID = 'test-statement-001';
const AN_STATEMENT_ID = 'test-statement-002';

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
 * Mock statements API for IR view — returns a statement assigned to current IR user.
 */
async function mockIRStatement(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/statements`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        statements: [
          {
            id: STATEMENT_ID,
            engagement_id: ENGAGEMENT_ID,
            draft_product_id: 'dp-001',
            statement_text:
              'Agency lacks documented data validation procedures for financial reporting systems.',
            ref_status: 'in_review',
            display_order: 2,
            assigned_to: 'ir-user-id',
            assigned_ir_name: 'Carla Voss',
            assigned_back_to: null,
            discrepancy_type: null,
            discrepancy_notes: null,
            evidence_ids: ['ev-001', 'ev-002'],
            evidence_count: 2,
            created_by: 'admin',
            created_at: '2026-03-15T10:00:00Z',
            updated_at: '2026-03-20T14:30:00Z',
          },
        ],
        total: 1,
      }),
    });
  });
}

/**
 * Mock evidence API.
 */
async function mockEvidence(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/evidence`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        evidence: [
          {
            id: 'ev-001',
            evidence_type: 'interview_note',
            source: 'Agency Budget Office',
            sensitivity: 'standard',
            sequence: 1,
          },
          {
            id: 'ev-002',
            evidence_type: 'dataset',
            source: 'OMB Budget Office',
            sensitivity: 'restricted',
            sequence: 2,
          },
        ],
        total: 2,
      }),
    });
  });
}

/**
 * Mock team API.
 */
async function mockTeam(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/team`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        assignments: [
          {
            id: 'ta-001',
            engagement_id: ENGAGEMENT_ID,
            user_id: 'an-user-id',
            role: 'AN',
            assigned_at: '2026-03-01T00:00:00Z',
            user: { display_name: 'Priya Nair', email: 'priya@example.com' },
          },
          {
            id: 'ta-002',
            engagement_id: ENGAGEMENT_ID,
            user_id: 'ir-user-id',
            role: 'IR',
            assigned_at: '2026-03-01T00:00:00Z',
            user: { display_name: 'Carla Voss', email: 'carla@example.com' },
          },
        ],
      }),
    });
  });
}

/**
 * Mock auth/me for IR user.
 */
async function mockAuthAsIR(page: import('@playwright/test').Page) {
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'ir-user-id',
          username: 'ir_user',
          email: 'carla@example.com',
          display_name: 'Carla Voss',
          roles: ['IR'],
        },
      }),
    });
  });
}

/**
 * Mock auth/me for AN user.
 */
async function mockAuthAsAN(page: import('@playwright/test').Page) {
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'an-user-id',
          username: 'analyst_user',
          email: 'priya@example.com',
          display_name: 'Priya Nair',
          roles: ['AN'],
        },
      }),
    });
  });
}

/**
 * Mock statements API for AN correction view — returns a statement assigned back to current AN user.
 */
async function mockANStatement(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/statements`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        statements: [
          {
            id: AN_STATEMENT_ID,
            engagement_id: ENGAGEMENT_ID,
            draft_product_id: 'dp-001',
            statement_text:
              'Agency lacks documented data validation procedures for financial reporting systems.',
            ref_status: 'failed',
            display_order: 2,
            assigned_to: 'ir-user-id',
            assigned_ir_name: 'Carla Voss',
            assigned_back_to: 'an-user-id',
            discrepancy_type: 'wrong_evidence_linked',
            discrepancy_notes:
              'The cited interview transcript does not contain the specific figure.',
            evidence_ids: ['ev-001'],
            evidence_count: 1,
            created_by: 'admin',
            created_at: '2026-03-15T10:00:00Z',
            updated_at: '2026-03-20T14:30:00Z',
          },
        ],
        total: 1,
      }),
    });
  });
}

// ─── Test 1: IR can view statement text and linked evidence ─────────────────────

test('IR can view statement text and linked evidence', async ({ page }) => {
  await mockAuthAsIR(page);
  await mockIRStatement(page);
  await mockEvidence(page);
  await mockTeam(page);

  await page.goto(`/engagements/${ENGAGEMENT_ID}/draft/statements/${STATEMENT_ID}`);

  // Statement text visible
  await expect(
    page.getByText(
      'Agency lacks documented data validation procedures for financial reporting systems.'
    )
  ).toBeVisible();

  // Evidence list visible with items
  await expect(page.getByText('Interview Note')).toBeVisible();
  await expect(page.getByText('Agency Budget Office')).toBeVisible();
});

// ─── Test 2: IR decision panel shows radio group ────────────────────────────────

test('IR decision panel shows radio group with In Review / Passed / Failed options', async ({ page }) => {
  await mockAuthAsIR(page);
  await mockIRStatement(page);
  await mockEvidence(page);
  await mockTeam(page);

  await page.goto(`/engagements/${ENGAGEMENT_ID}/draft/statements/${STATEMENT_ID}`);

  // Decision panel heading
  await expect(page.getByText('Reference Check Decision')).toBeVisible();

  // Radio group with 3 options
  await expect(page.getByRole('radio', { name: 'In Review' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Passed' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Failed' })).toBeVisible();
});

// ─── Test 3: Selecting Failed reveals discrepancy type and notes fields ──────────

test('Selecting Failed reveals discrepancy type and notes fields', async ({ page }) => {
  await mockAuthAsIR(page);
  await mockIRStatement(page);
  await mockEvidence(page);
  await mockTeam(page);

  await page.goto(`/engagements/${ENGAGEMENT_ID}/draft/statements/${STATEMENT_ID}`);

  // Initially discrepancy fields should not be visible
  await expect(page.getByLabel('Discrepancy type')).not.toBeVisible();

  // Click Failed radio
  await page.getByRole('radio', { name: 'Failed' }).click();

  // Discrepancy Type select should appear
  await expect(page.getByLabel('Discrepancy type')).toBeVisible();

  // Notes textarea should appear
  await expect(
    page.getByPlaceholder('Describe the discrepancy...')
  ).toBeVisible();
});

// ─── Test 4: Save fails when Failed + empty notes ────────────────────────────────

test('Save Status fails when Failed selected but discrepancy notes empty', async ({ page }) => {
  await mockAuthAsIR(page);
  await mockIRStatement(page);
  await mockEvidence(page);
  await mockTeam(page);

  await page.goto(`/engagements/${ENGAGEMENT_ID}/draft/statements/${STATEMENT_ID}`);

  // Select Failed
  await page.getByRole('radio', { name: 'Failed' }).click();

  // Click Save Status without filling notes
  await page.getByRole('button', { name: 'Save Status' }).click();

  // Error message should appear
  await expect(
    page.getByText(
      'Discrepancy notes are required when reference status is Failed.'
    )
  ).toBeVisible();
});

// ─── Test 5: IR can save Passed status and see toast ────────────────────────────

test('IR can save Passed status and see toast', async ({ page }) => {
  await mockAuthAsIR(page);
  await mockIRStatement(page);
  await mockEvidence(page);
  await mockTeam(page);

  // Mock PATCH statement endpoint
  await page.route(
    `**/api/engagements/${ENGAGEMENT_ID}/statements/${STATEMENT_ID}`,
    (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            statement: {
              id: STATEMENT_ID,
              ref_status: 'passed',
            },
          }),
        });
      } else {
        route.continue();
      }
    }
  );

  await page.goto(`/engagements/${ENGAGEMENT_ID}/draft/statements/${STATEMENT_ID}`);

  // Select Passed
  await page.getByRole('radio', { name: 'Passed' }).click();

  // Click Save Status
  await page.getByRole('button', { name: 'Save Status' }).click();

  // Toast should appear
  await expect(page.getByText('Statement passed.')).toBeVisible({ timeout: 5000 });
});

// ─── Test 6: AN correction view shows AnalystCorrectionNotice ──────────────────

test('AN correction view shows AnalystCorrectionNotice panel', async ({ page }) => {
  await mockAuthAsAN(page);
  await mockANStatement(page);
  await mockEvidence(page);
  await mockTeam(page);

  await page.goto(
    `/engagements/${ENGAGEMENT_ID}/draft/statements/${AN_STATEMENT_ID}`
  );

  // AnalystCorrectionNotice should be visible with amber styling
  const notice = page.getByRole('region', {
    name: 'Discrepancy notice from Independent Referencer',
  });
  await expect(notice).toBeVisible();

  // Check amber styling
  await expect(notice).toHaveClass(/bg-amber-50/);
  await expect(notice).toHaveClass(/border-amber-500/);

  // Mark as Revision Ready checkbox visible
  await expect(
    page.getByRole('checkbox', {
      name: /Mark as revision ready/i,
    })
  ).toBeVisible();
});
