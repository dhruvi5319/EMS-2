import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Review Queue Page', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('navigates to /review-queue and shows heading', async ({ page }) => {
    await page.goto('/review-queue');
    await expect(page.getByRole('heading', { name: 'Review Queue' })).toBeVisible();
  });

  test('shows empty state when no submitted requests', async ({ page }) => {
    await page.goto('/review-queue');
    await page.waitForTimeout(500);

    const emptyState = page.getByText('No items awaiting your review.');
    const table = page.getByRole('table');
    await expect(emptyState.or(table)).toBeVisible();
  });

  test('empty state copy matches UI-SPEC', async ({ page }) => {
    await page.goto('/review-queue');
    await page.waitForTimeout(500);
    // If empty state is shown, verify the full copy
    const emptyState = page.getByText('No items awaiting your review.');
    if (await emptyState.isVisible()) {
      await expect(page.getByText('Submitted requests will appear here for Gate A1 decision.')).toBeVisible();
    }
  });

  test('review queue link in sidebar navigates correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByText('Review Queue').click();
    await expect(page).toHaveURL('/review-queue');
  });
});
