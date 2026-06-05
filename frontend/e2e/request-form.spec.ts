import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

test.describe('New Request Form', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('navigates to /requests/new and shows form', async ({ page }) => {
    await page.goto('/requests/new');
    await expect(page.getByRole('heading', { name: 'New Request' })).toBeVisible();
  });

  test('Save as Draft is disabled until request type is selected', async ({ page }) => {
    await page.goto('/requests/new');
    await expect(page.getByRole('button', { name: /Save as Draft|Save Changes/ })).toBeDisabled();
  });

  test('selecting request type enables Save as Draft', async ({ page }) => {
    await page.goto('/requests/new');
    // Open select dropdown and choose Congressional Request
    await page.getByRole('combobox').click();
    await page.getByText('Congressional Request').click();
    await expect(page.getByRole('button', { name: /Save as Draft/ })).toBeEnabled();
  });

  test('Submit is disabled until all required fields are filled', async ({ page }) => {
    await page.goto('/requests/new');
    await expect(page.getByRole('button', { name: /Submit Request/ })).toBeDisabled();
  });

  test('shows validation errors when submitting empty form', async ({ page }) => {
    await page.goto('/requests/new');
    // Fill required field to enable submit button
    await page.getByRole('combobox').click();
    await page.getByText('Congressional Request').click();
    await page.getByPlaceholder('Name or organization').fill('Test');
    await page.getByPlaceholder('Brief description of the engagement topic').fill('Test topic for engagement');
    await page.getByPlaceholder('Agency or program name').fill('GAO');
    // Don't fill due date — submit should show error
    // Submit button still disabled without due date
    await expect(page.getByRole('button', { name: /Submit Request/ })).toBeDisabled();
  });

  test('shows past due date warning (non-blocking)', async ({ page }) => {
    await page.goto('/requests/new');
    // Open calendar
    await page.getByRole('button', { name: /MM\/DD\/YYYY/ }).click();
    // Navigate to previous month and select a past date
    await page.getByRole('button', { name: 'Go to previous month' }).click();
    await page.getByRole('gridcell', { name: '1' }).first().click();
    // Warning should appear
    await expect(page.getByText('Due date is in the past. Permitted for retrospective mandates.')).toBeVisible();
  });

  test('topic character counter updates as user types', async ({ page }) => {
    await page.goto('/requests/new');
    const topicField = page.getByPlaceholder('Brief description of the engagement topic');
    await topicField.fill('Hello');
    await expect(page.getByText('5 / 500')).toBeVisible();
  });

  test('breadcrumb shows Requests > New Request', async ({ page }) => {
    await page.goto('/requests/new');
    await expect(page.getByText('Requests > New Request')).toBeVisible();
  });
});
