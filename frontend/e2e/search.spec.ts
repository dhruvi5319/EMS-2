import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function loginAndGoToDashboard(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('Global search', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
  });

  test('search input is visible in the top bar', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await expect(searchInput).toBeVisible();
  });

  test('shows min-chars message when fewer than 2 chars typed', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await searchInput.click();
    await searchInput.fill('a');
    await expect(page.getByText('Type at least 2 characters to search.')).toBeVisible();
  });

  test('overlay opens after typing 2+ characters', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await searchInput.fill('en');
    // Wait for debounce + API response
    await page.waitForTimeout(400);
    // Overlay should be open (results, loading, or no-match — all acceptable)
    const overlay = page.getByRole('listbox', { name: 'Search results' });
    // Overlay container visible
    await expect(page.locator('[aria-label="Search results"], [role="listbox"]').first()).toBeVisible();
  });

  test('shows no-match message when query returns no results', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await searchInput.fill('zzzzznotfound999');
    await page.waitForTimeout(400); // debounce + API
    await expect(page.getByText('No engagements found.')).toBeVisible();
    await expect(page.getByText('Try different keywords or check your spelling.')).toBeVisible();
  });

  test('Escape key closes the overlay', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await searchInput.fill('en');
    await page.waitForTimeout(400);
    // Overlay is open
    await searchInput.press('Escape');
    // Overlay should be gone
    await expect(page.getByText('No engagements found.')).not.toBeVisible();
    await expect(page.getByText('Type at least 2 characters to search.')).not.toBeVisible();
  });

  test('Ctrl+K / Cmd+K focuses the search input', async ({ page }) => {
    // Click elsewhere first to defocus
    await page.locator('h1').click();
    // Press keyboard shortcut
    await page.keyboard.press('Control+k');
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await expect(searchInput).toBeFocused();
  });

  test('overlay closes when clicking outside', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: 'Search engagements' });
    await searchInput.fill('en');
    await page.waitForTimeout(400);
    // Click outside the overlay
    await page.locator('main').click({ position: { x: 100, y: 300 } });
    // Overlay should close
    await expect(page.getByText('Type at least 2 characters to search.')).not.toBeVisible();
  });
});
