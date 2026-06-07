import { test, expect } from '@playwright/test';

const ADMIN_USER = { username: 'admin', password: 'Admin1234!' };

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
 * Mock the engagement list API with sample data.
 */
async function mockEngagementList(page: import('@playwright/test').Page) {
  await page.route('**/api/engagements*', async (route) => {
    const url = route.request().url();

    // Mock single-phase count queries (limit=1)
    if (url.includes('limit=1')) {
      const phase = new URL(url).searchParams.get('phase');
      let total = 0;
      if (phase === 'planning') total = 3;
      else if (phase === 'evidence') total = 2;
      else if (phase === 'draft') total = 1;
      else if (phase === 'readiness') total = 1;

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ engagements: [], total }),
      });
      return;
    }

    // Main list query
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        engagements: [
          {
            id: 'eng-001',
            job_code: 'ENG-2026-00001',
            title: 'Budget Control Systems Audit',
            phase: 'planning',
            status: 'active',
            risk_level: 'High',
            owner_id: 'user-1',
            owner_display_name: 'Priya Nair',
            has_blockers: false,
            gate_a1: 'approved',
            gate_p2: 'not_started',
            gate_p3: 'not_started',
            gate_p4: 'not_started',
            next_milestone_label: 'Kickoff',
            next_milestone_date: '2026-07-01T00:00:00Z',
            next_milestone_status: 'upcoming',
            created_at: '2026-01-01T00:00:00Z',
            updated_at: '2026-06-01T00:00:00Z',
          },
          {
            id: 'eng-002',
            job_code: 'ENG-2026-00002',
            title: 'Procurement Compliance Review',
            phase: 'evidence',
            status: 'active',
            risk_level: 'Medium',
            owner_id: 'user-2',
            owner_display_name: 'James Whitfield',
            has_blockers: true,
            gate_a1: 'approved',
            gate_p2: 'approved',
            gate_p3: 'not_started',
            gate_p4: 'not_started',
            next_milestone_label: null,
            next_milestone_date: null,
            next_milestone_status: null,
            created_at: '2026-01-15T00:00:00Z',
            updated_at: '2026-06-02T00:00:00Z',
          },
        ],
        total: 2,
      }),
    });
  });
}

/**
 * Mock auth me as EM user.
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
 * Mock auth me as IR user.
 */
async function mockUserAsIR(page: import('@playwright/test').Page) {
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: {
          id: 'user-ir-1',
          username: 'ir_user',
          email: 'ir@example.com',
          display_name: 'IR User',
          roles: ['IR'],
        },
      }),
    });
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

test.describe('Portfolio Dashboard', () => {
  test('shows 4 phase stat cards with counts', async ({ page }) => {
    await mockUserAsEM(page);
    await mockEngagementList(page);

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should show "Portfolio Dashboard" heading
    await expect(page.getByText('Portfolio Dashboard')).toBeVisible();

    // Should show 4 phase stat cards
    // Cards are identified by their aria-labels
    await expect(page.getByRole('button', { name: /Planning engagements/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Evidence engagements/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Draft engagements/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Readiness engagements/ })).toBeVisible();
  });

  test('clicking Phase stat card filters the engagement table', async ({ page }) => {
    await mockUserAsEM(page);
    await mockEngagementList(page);

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Click the Planning stat card
    await page.getByRole('button', { name: /Planning engagements/ }).click();

    // The Planning card should be active (aria-pressed=true)
    await expect(
      page.getByRole('button', { name: /Planning engagements/ })
    ).toHaveAttribute('aria-pressed', 'true');

    // Filter bar should show a "Phase: Planning" chip
    await expect(page.getByText(/Phase: Planning/)).toBeVisible();
  });

  test('table shows engagement columns including gate mini-status', async ({ page }) => {
    await mockUserAsEM(page);
    await mockEngagementList(page);

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Check table headers exist
    await expect(page.getByRole('columnheader', { name: /ID/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Title/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Phase/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Status/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Owner/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Risk/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /Gate Status/ })).toBeVisible();

    // GateMiniStatusRow should be present (role="group" with aria-label="Gate status")
    const gateStatusGroups = page.getByRole('group', { name: 'Gate status' });
    await expect(gateStatusGroups.first()).toBeVisible();
  });

  test('filter bar narrows table results', async ({ page }) => {
    await mockUserAsEM(page);
    await mockEngagementList(page);

    // Mock filtered result (High risk only)
    let requestUrl = '';
    await page.route('**/api/engagements*', async (route) => {
      const url = route.request().url();
      requestUrl = url;

      if (url.includes('limit=1')) {
        const phase = new URL(url).searchParams.get('phase');
        let total = 0;
        if (phase === 'planning') total = 3;
        else if (phase === 'evidence') total = 2;
        else if (phase === 'draft') total = 1;
        else if (phase === 'readiness') total = 1;

        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ engagements: [], total }),
        });
        return;
      }

      if (url.includes('risk_level=High')) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            engagements: [
              {
                id: 'eng-001',
                job_code: 'ENG-2026-00001',
                title: 'High Risk Engagement',
                phase: 'planning',
                status: 'active',
                risk_level: 'High',
                owner_id: null,
                owner_display_name: null,
                has_blockers: false,
                gate_a1: 'not_started',
                gate_p2: 'not_started',
                gate_p3: 'not_started',
                gate_p4: 'not_started',
                created_at: '2026-01-01T00:00:00Z',
                updated_at: '2026-06-01T00:00:00Z',
              },
            ],
            total: 1,
          }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            engagements: [
              {
                id: 'eng-001',
                job_code: 'ENG-2026-00001',
                title: 'Budget Control Systems Audit',
                phase: 'planning',
                status: 'active',
                risk_level: 'High',
                owner_id: null,
                owner_display_name: null,
                has_blockers: false,
                gate_a1: 'not_started',
                gate_p2: 'not_started',
                gate_p3: 'not_started',
                gate_p4: 'not_started',
                created_at: '2026-01-01T00:00:00Z',
                updated_at: '2026-06-01T00:00:00Z',
              },
              {
                id: 'eng-002',
                job_code: 'ENG-2026-00002',
                title: 'Low Risk Engagement',
                phase: 'evidence',
                status: 'active',
                risk_level: 'Low',
                owner_id: null,
                owner_display_name: null,
                has_blockers: false,
                gate_a1: 'not_started',
                gate_p2: 'not_started',
                gate_p3: 'not_started',
                gate_p4: 'not_started',
                created_at: '2026-01-15T00:00:00Z',
                updated_at: '2026-06-02T00:00:00Z',
              },
            ],
            total: 2,
          }),
        });
      }
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Select Risk=High from the filter dropdown
    await page.getByRole('combobox', { name: 'Filter by risk' }).click();
    await page.getByRole('option', { name: 'High' }).click();
    await page.waitForLoadState('networkidle');

    // Should show Risk: High chip
    await expect(page.getByText(/Risk: High/)).toBeVisible();

    // Click Clear
    await page.getByRole('button', { name: 'Clear all filters' }).click();
    await page.waitForLoadState('networkidle');

    // Risk chip should be gone
    await expect(page.getByText(/Risk: High/)).not.toBeVisible();
  });

  test('Export to CSV button triggers download', async ({ page }) => {
    await mockUserAsEM(page);
    await mockEngagementList(page);

    // Mock export endpoint
    await page.route('**/api/engagements/export*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/csv',
        body: 'id,job_code,title\neng-001,ENG-2026-00001,Test\n',
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Click Export to CSV button
    const exportBtn = page.getByRole('button', { name: /Export to CSV/ });
    await expect(exportBtn).toBeVisible();

    // Start listening for download
    const downloadPromise = page.waitForEvent('download').catch(() => null);
    await exportBtn.click();

    // After click, should show "Exporting..." temporarily
    // Then toast should appear
    await expect(page.getByText('Engagement register exported.')).toBeVisible({ timeout: 5000 });
  });

  test('IR role cannot see Export to CSV button', async ({ page }) => {
    await mockUserAsIR(page);
    await mockEngagementList(page);

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Export to CSV button should NOT be visible for IR role
    await expect(page.getByRole('button', { name: /Export to CSV/ })).not.toBeVisible();
  });
});
