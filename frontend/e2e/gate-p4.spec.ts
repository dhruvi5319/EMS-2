import { test, expect } from '@playwright/test';

const ADMIN_USER = { username: 'admin', password: 'Admin1234!' };
const PC_USER = { username: 'pc_user', password: 'PC12345678!' };
const EM_USER = { username: 'em_user', password: 'EM12345678!' };

const ENGAGEMENT_ID = 'test-engagement-001';

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
 * Mock the Gate P4 prerequisites API with all-passing prerequisites.
 */
async function mockPrerequisitesPass(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements/*/gate/p4/prerequisites', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        met: true,
        blockers: [],
      }),
    });
  });
}

/**
 * Mock the Gate P4 prerequisites API with failing prerequisites.
 */
async function mockPrerequisitesFail(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements/*/gate/p4/prerequisites', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        met: false,
        blockers: [
          { type: 'has_failed_checks', message: '2 reference checks have failed status', statement_ids: ['stmt-1', 'stmt-2'] },
          { type: 'has_in_review_checks', message: '1 reference check is still in review' },
        ],
      }),
    });
  });
}

/**
 * Mock the engagement detail API.
 */
async function mockEngagementDetail(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements/test-engagement-001', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        engagement: {
          id: ENGAGEMENT_ID,
          job_code: 'ENG-2026-00001',
          title: 'Test Engagement',
          phase: 'readiness',
          status: 'active',
          risk_level: 'Medium',
          owner_id: null,
          portfolio: null,
          request_id: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          engagement_number: 1,
        },
        gate_decisions: [
          { id: 'gd-1', gate_name: 'A1', decision: 'approved', risk_level: null, rationale: null, decided_by: null, decided_at: '2026-02-01T00:00:00Z' },
          { id: 'gd-2', gate_name: 'P2', decision: 'approved', risk_level: null, rationale: null, decided_by: null, decided_at: '2026-03-01T00:00:00Z' },
          { id: 'gd-3', gate_name: 'P3', decision: 'approved', risk_level: null, rationale: null, decided_by: null, decided_at: '2026-04-01T00:00:00Z' },
        ],
        blockers: [],
      }),
    });
  });
}

/**
 * Mock the current user session as PC role.
 */
async function mockUserAsPC(page: import('@playwright/test').Page) {
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'user-pc-1',
          username: 'pc_user',
          email: 'pc@example.com',
          display_name: 'PC User',
          roles: ['PC'],
        },
      }),
    });
  });
}

/**
 * Mock the current user session as EM role.
 */
async function mockUserAsEM(page: import('@playwright/test').Page) {
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'user-em-1',
          username: 'em_user',
          email: 'em@example.com',
          display_name: 'EM User',
          roles: ['EM'],
        },
      }),
    });
  });
}

/**
 * Navigate to Gate P4 review page for the test engagement.
 */
async function navigateToP4Page(page: import('@playwright/test').Page) {
  await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
  await page.waitForLoadState('networkidle');
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Gate P4 Review Page', () => {
  test('shows prerequisites checklist with all items', async ({ page }) => {
    await mockPrerequisitesPass(page);
    await mockEngagementDetail(page);
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user-1',
            username: 'admin',
            email: 'admin@example.com',
            display_name: 'Admin',
            roles: ['AD'],
          },
        }),
      });
    });

    await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
    await page.waitForLoadState('networkidle');

    // P4PrerequisitesChecklist should be visible
    const prerequisitesList = page.getByRole('list');
    await expect(prerequisitesList.first()).toBeVisible();

    // Should have 4 list items (one per prerequisite type)
    const listItems = page.getByRole('listitem');
    await expect(listItems).toHaveCount(4);
  });

  test('Approve button is aria-disabled when prerequisites not met', async ({ page }) => {
    await mockPrerequisitesFail(page);
    await mockEngagementDetail(page);
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user-1',
            username: 'em_user',
            email: 'em@example.com',
            display_name: 'EM User',
            roles: ['EM'],
          },
        }),
      });
    });

    await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
    await page.waitForLoadState('networkidle');

    // Approve button wrapper should have aria-disabled="true"
    const approveWrapper = page.locator('[aria-disabled="true"]');
    await expect(approveWrapper.first()).toBeVisible();
  });

  test('PC only sees Ready for Issuance option (not Closed)', async ({ page }) => {
    await mockPrerequisitesPass(page);
    await mockEngagementDetail(page);
    await mockUserAsPC(page);

    await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
    await page.waitForLoadState('networkidle');

    // Should see "Ready for Issuance" radio option
    await expect(page.getByLabel('Ready for Issuance')).toBeVisible();

    // Should NOT see "Closed" radio option
    await expect(page.getByLabel('Closed')).not.toBeVisible();
  });

  test('EM sees both Ready for Issuance and Closed options', async ({ page }) => {
    await mockPrerequisitesPass(page);
    await mockEngagementDetail(page);
    await mockUserAsEM(page);

    await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
    await page.waitForLoadState('networkidle');

    // Should see both radio options
    await expect(page.getByLabel('Ready for Issuance')).toBeVisible();
    await expect(page.getByLabel('Closed')).toBeVisible();
  });

  test('comment textarea requires ≥10 chars before approve button becomes active', async ({
    page,
  }) => {
    await mockPrerequisitesPass(page);
    await mockEngagementDetail(page);
    await mockUserAsEM(page);

    await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
    await page.waitForLoadState('networkidle');

    // Type 9 chars — button should still be aria-disabled
    await page.getByLabel(/Final Approval Comment/).fill('123456789');
    const approveWrapper9 = page.locator('[aria-disabled="true"]');
    await expect(approveWrapper9.first()).toBeVisible();

    // Type 10th char — approve button should no longer be aria-disabled
    await page.getByLabel(/Final Approval Comment/).fill('1234567890');
    // The approve button should now be directly clickable (not wrapped in aria-disabled span)
    const approveBtn = page.getByRole('button', { name: /Approve Final Readiness/ });
    await expect(approveBtn).toBeVisible();
    // It should NOT be disabled (no aria-disabled parent wrapper)
    await expect(page.locator('[aria-disabled="true"]')).not.toBeVisible();
  });

  test('confirm dialog shows exact copywriting and submits P4 approval', async ({ page }) => {
    await mockPrerequisitesPass(page);
    await mockEngagementDetail(page);
    await mockUserAsEM(page);

    // Mock the P4 gate POST to return success
    await page.route('**/api/engagements/*/gate/p4', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            gate_decision: {
              id: 'gd-p4-1',
              gate_name: 'P4',
              decision: 'approved',
              decided_at: new Date().toISOString(),
            },
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto(`/engagements/${ENGAGEMENT_ID}/gates/p4`);
    await page.waitForLoadState('networkidle');

    // Fill in valid comment
    await page.getByLabel(/Final Approval Comment/).fill('This is a valid approval comment for P4.');

    // Click the approve button
    const approveBtn = page.getByRole('button', { name: /Approve Final Readiness/ });
    await approveBtn.click();

    // AlertDialog should appear with exact title
    await expect(
      page.getByText('Approve Final Readiness (Gate P4)?')
    ).toBeVisible();

    // Exact button text from spec
    await expect(page.getByRole('button', { name: 'Keep Reviewing' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm Approve P4 ✓' })).toBeVisible();

    // Click confirm
    await page.getByRole('button', { name: 'Confirm Approve P4 ✓' }).click();

    // Should redirect to engagement shell
    await page.waitForURL(`**/engagements/${ENGAGEMENT_ID}**`);
  });
});
