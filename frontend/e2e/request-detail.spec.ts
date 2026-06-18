import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Request Detail Page', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  // Fix F: Updated test — audit trail link only present for accepted requests with engagement
  test('shows View Audit Trail link only for accepted requests', async ({ page }) => {
    await page.goto('/requests');
    await page.waitForTimeout(500);

    const emptyState = page.getByText('No requests yet.');
    if (await emptyState.isVisible()) {
      test.skip(true, 'No requests in DB — skipping detail test');
      return;
    }

    await page.getByRole('row').nth(1).click();
    await page.waitForURL('**/requests/**');

    // View Audit Trail link is only present for accepted requests that have an engagement.
    // For non-accepted requests, the link is intentionally absent — verify the page loaded OK instead.
    const auditLink = page.getByText('View Audit Trail →');
    const requestTitle = page.getByText('Request Details');
    await expect(requestTitle).toBeVisible(); // page loaded
    // If the first request happens to be accepted, also assert the link exists
    const statusBadge = page.getByText('Accepted');
    if (await statusBadge.isVisible()) {
      await expect(auditLink).toBeVisible();
    } else {
      // For non-accepted requests, the audit trail link should NOT be present
      await expect(auditLink).not.toBeVisible();
    }
  });

  test('request detail URL is /requests/:id', async ({ page }) => {
    await page.goto('/requests');
    await page.waitForTimeout(500);

    const emptyState = page.getByText('No requests yet.');
    if (await emptyState.isVisible()) {
      test.skip(true, 'No requests — skipping');
      return;
    }

    await page.getByRole('row').nth(1).click();
    await expect(page).toHaveURL(/\/requests\/[a-f0-9-]{36}/);
  });

  test('shows No intake document attached when no file', async ({ page }) => {
    await page.goto('/requests');
    await page.waitForTimeout(500);
    const emptyState = page.getByText('No requests yet.');
    if (await emptyState.isVisible()) {
      test.skip(true, 'No requests — skipping');
      return;
    }
    await page.getByRole('row').nth(1).click();
    await page.waitForURL('**/requests/**');
    // Either shows a file, the upload zone, or the no-file message
    const noFile = page.getByText('No intake document attached.');
    const fileCard = page.getByText('Download ↓');
    const uploadZone = page.getByText('Drag and drop intake document here');
    await expect(noFile.or(fileCard).or(uploadZone)).toBeVisible();
  });

  test('shows request detail section headers', async ({ page }) => {
    await page.goto('/requests');
    await page.waitForTimeout(500);
    const emptyState = page.getByText('No requests yet.');
    if (await emptyState.isVisible()) {
      test.skip(true, 'No requests — skipping');
      return;
    }
    await page.getByRole('row').nth(1).click();
    await page.waitForURL('**/requests/**');
    await expect(page.getByText('Intake Document')).toBeVisible();
    await expect(page.getByText('Request Details')).toBeVisible();
    await expect(page.getByText('Gate A1 Decision')).toBeVisible();
  });

  test('IntakeFileUpload visible on draft detail page for AL user', async ({ page }) => {
    // Create a draft request and navigate to it as AL user (admin has AL role)
    const createRes = await page.evaluate(async () => {
      const r = await fetch('/api/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: 'congressional',
          requester_name: 'Test Requester',
          topic: 'Draft request for IntakeFileUpload test',
          agency_program: 'Test Agency',
          due_date: '2027-12-31',
        }),
      });
      return r.json();
    });
    const requestId: string = createRes.request?.id;

    await page.goto(`/requests/${requestId}`);
    await page.waitForURL(`**/requests/${requestId}`);
    await page.waitForTimeout(500);

    // IntakeFileUpload should be visible for draft + AL user
    await expect(page.getByText('Drag and drop intake document here')).toBeVisible();
  });

  test('no page reload on approval — URL stays on request detail', async ({ page }) => {
    // Create and submit a request
    const createRes = await page.evaluate(async () => {
      const r = await fetch('/api/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: 'congressional',
          requester_name: 'Test Requester',
          topic: 'Approve no-reload test request',
          agency_program: 'Test Agency',
          due_date: '2027-12-31',
        }),
      });
      return r.json();
    });
    const requestId: string = createRes.request?.id;
    await page.evaluate(async (id: string) => {
      await fetch(`/api/requests/${id}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    }, requestId);

    await page.goto(`/requests/${requestId}`);
    await page.waitForTimeout(500);

    // Approve the request
    await page.getByLabel('Low').click();
    await page.getByPlaceholder('e.g., Scope aligns').fill('Valid rationale for no-reload test.');
    await page.getByRole('button', { name: /✓ Approve Request/ }).click();
    await page.getByRole('button', { name: 'Confirm Approve ✓' }).click();
    await page.waitForTimeout(1000);

    // URL should still contain /requests/:id — no navigation
    await expect(page).toHaveURL(new RegExp(`/requests/${requestId}`));
    // Banner with job code should be visible
    await expect(page.getByText(/ENG-\d{4}-\d{5}.*created/)).toBeVisible();
    await expect(page.getByText('View Engagement Shell →')).toBeVisible();
  });
});
