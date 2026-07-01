/**
 * auth.spec.ts — Authentication E2E smoke tests (Plan 01-04).
 *
 * These three tests are the canonical smoke gate for the auth + app-shell:
 *   1. Unauthenticated root visit redirects to /login
 *   2. Valid login navigates to /dashboard (AppShell rendered)
 *   3. Logout returns to /login and clears the session
 *
 * More exhaustive login-form and app-shell tests live in:
 *   - e2e/login.spec.ts
 *   - e2e/app-shell.spec.ts
 */
import { test, expect } from '@playwright/test';

const ADMIN = { username: 'admin', password: 'Admin1234!' };

test.describe('Auth smoke tests', () => {
  test('unauthenticated visit to / redirects to /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('login with admin credentials navigates to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(ADMIN.username);
    await page.getByLabel('Password').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
    // AppShell is present
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });

  test('logout returns to login page', async ({ page }) => {
    // Log in first
    await page.goto('/login');
    await page.getByLabel('Username').fill(ADMIN.username);
    await page.getByLabel('Password').fill(ADMIN.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard');

    // Log out via TopBar button
    await page.getByRole('button', { name: /log out/i }).click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');

    // Confirm session cleared: going to /dashboard should redirect to /login
    await page.goto('/dashboard');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });
});
