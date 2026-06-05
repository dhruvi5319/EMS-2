import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

// Helper: log in and navigate to dashboard
async function loginAndNavigate(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('App shell', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndNavigate(page);
  });

  test('sidebar shows all 5 nav items', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Requests' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Engagements' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Review Queue' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
  });

  test('topbar shows user display name', async ({ page }) => {
    await expect(page.getByText('System Administrator')).toBeVisible();
  });

  test('topbar shows Log Out button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Log Out' })).toBeVisible();
  });

  test('clicking Log Out returns user to login page', async ({ page }) => {
    await page.getByRole('button', { name: 'Log Out' }).click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('unauthenticated visit to /dashboard redirects to login', async ({ page }) => {
    // Log out
    await page.getByRole('button', { name: 'Log Out' }).click();
    await page.waitForURL('**/login');

    // Try to visit dashboard directly
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('navigating to a stub route shows placeholder content', async ({ page }) => {
    await page.getByRole('link', { name: 'Requests' }).click();
    await page.waitForURL('**/requests');
    await expect(page.getByText(/Phase 3/)).toBeVisible();
  });
});
