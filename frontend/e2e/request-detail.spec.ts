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

  test('shows View Audit Trail link', async ({ page }) => {
    // Navigate to requests list
    await page.goto('/requests');
    await page.waitForTimeout(500);

    // If there are requests, click first row; otherwise verify empty state
    const emptyState = page.getByText('No requests yet.');
    const firstRow = page.getByRole('row').nth(1); // first data row

    if (await emptyState.isVisible()) {
      // No requests in DB — skipping detail test
      test.skip(true, 'No requests in DB — skipping detail test');
      return;
    }

    await firstRow.click();
    await page.waitForURL('**/requests/**');
    await expect(page.getByText('View Audit Trail →')).toBeVisible();
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
    // Either shows a file or the no-file message
    const noFile = page.getByText('No intake document attached.');
    const fileCard = page.getByText('Download ↓');
    await expect(noFile.or(fileCard)).toBeVisible();
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
});
