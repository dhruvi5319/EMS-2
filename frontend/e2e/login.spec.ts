import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };
const INVALID_CREDS = { username: 'admin', password: 'wrongpassword' };

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('renders login page with correct heading and fields', async ({ page }) => {
    await expect(page.getByText('Sign in to your account')).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('username field is focused on page load', async ({ page }) => {
    const usernameInput = page.getByLabel('Username');
    await expect(usernameInput).toBeFocused();
  });

  test('shows field error when submitting empty username', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Username is required.')).toBeVisible();
  });

  test('shows field error when submitting empty password', async ({ page }) => {
    await page.getByLabel('Username').fill('admin');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Password is required.')).toBeVisible();
  });

  test('shows generic error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Username').fill(INVALID_CREDS.username);
    await page.getByLabel('Password').fill(INVALID_CREDS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('Invalid username or password.')).toBeVisible();
  });

  test('show/hide password toggle works', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    await passwordInput.fill('mypassword');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await page.getByLabel('Show password').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await page.getByLabel('Hide password').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('successful login redirects to /dashboard', async ({ page }) => {
    await page.getByLabel('Username').fill(VALID_USER.username);
    await page.getByLabel('Password').fill(VALID_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('authenticated user visiting /login is redirected to /dashboard', async ({ page }) => {
    // First, log in
    await page.getByLabel('Username').fill(VALID_USER.username);
    await page.getByLabel('Password').fill(VALID_USER.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/dashboard');

    // Then visit /login again
    await page.goto('/login');
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });
});
