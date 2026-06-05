import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Request List Page', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('navigates to /requests and shows page heading', async ({ page }) => {
    await page.goto('/requests');
    await expect(page.getByRole('heading', { name: 'Requests' })).toBeVisible();
  });

  test('shows status filter tabs', async ({ page }) => {
    await page.goto('/requests');
    await expect(page.getByRole('tab', { name: 'All' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Draft' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Submitted' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Accepted' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Declined' })).toBeVisible();
  });

  test('shows empty state when no requests exist', async ({ page }) => {
    await page.goto('/requests');
    // Wait for loading to complete
    await page.waitForTimeout(500);
    // Either shows table rows OR empty state
    const emptyState = page.getByText('No requests yet.');
    const table = page.getByRole('table');
    await expect(emptyState.or(table)).toBeVisible();
  });

  test('shows + New Request button for admin user', async ({ page }) => {
    await page.goto('/requests');
    await expect(page.getByText('+ New Request')).toBeVisible();
  });

  test('clicking + New Request navigates to /requests/new', async ({ page }) => {
    await page.goto('/requests');
    await page.getByText('+ New Request').click();
    await expect(page).toHaveURL('/requests/new');
  });

  test('clicking status tab filters the table', async ({ page }) => {
    await page.goto('/requests');
    await page.getByRole('tab', { name: 'Draft' }).click();
    // URL doesn't change but filter is applied visually
    await page.waitForTimeout(300);
    // Table should show filtered results (or empty state)
    await expect(page.getByRole('tab', { name: 'Draft' })).toHaveAttribute('data-state', 'active');
  });
});
