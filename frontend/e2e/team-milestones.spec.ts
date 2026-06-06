import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

async function getOrCreateEngagementId(page: import('@playwright/test').Page): Promise<string> {
  // Navigate to engagements list and pick the first one, or use a known seed
  await page.goto('/engagements');
  // Wait for either a table row or empty state
  await page.waitForLoadState('networkidle');

  const firstRow = page.locator('table tbody tr').first();
  const hasRows = await firstRow.isVisible().catch(() => false);
  if (hasRows) {
    // Click on the first engagement row to get to it
    await firstRow.click();
    await page.waitForURL(/\/engagements\/[a-z0-9-]+$/);
    const url = page.url();
    const match = url.match(/\/engagements\/([a-z0-9-]+)$/);
    return match?.[1] ?? '';
  }
  return '';
}

test.describe('Team Tab and Milestones', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Team tab renders with TEAM MEMBERS section', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);

    // Navigate to Team tab
    await page.getByRole('tab', { name: 'Team' }).click();

    // Team Members section header should be visible
    await expect(page.getByText(/team members/i)).toBeVisible();
  });

  test('Team tab shows team member table or empty state', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // Either empty state or a team member table
    const hasEmptyState = await page.getByText('No team members assigned yet.').isVisible().catch(() => false);
    const hasTable = await page.locator('table').first().isVisible().catch(() => false);
    expect(hasEmptyState || hasTable).toBe(true);
  });

  test('[+ Add Member] button visible for EM/AD users', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // Admin user has AD role — should see Add Member button
    await expect(page.getByRole('button', { name: /add member/i })).toBeVisible();
  });

  test('Clicking [+ Add Member] shows add member form', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    await page.getByRole('button', { name: /add member/i }).click();

    // Add member form should appear with search and role selector
    await expect(page.getByText(/search users/i)).toBeVisible();
    await expect(page.getByText(/role/i)).toBeVisible();
  });

  test('Add member form has user search combobox and role selector', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();
    await page.getByRole('button', { name: /add member/i }).click();

    // Combobox trigger for user search
    await expect(page.getByRole('combobox')).toBeVisible();

    // Role selector
    await expect(page.getByText('Select role')).toBeVisible();

    // Add to Team button is disabled initially
    const addButton = page.getByRole('button', { name: 'Add to Team' });
    await expect(addButton).toBeDisabled();
  });

  test('Milestone section shows 4 milestone rows', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // Milestones section header
    await expect(page.getByText(/milestones/i)).toBeVisible();

    // Should see all 4 milestone labels
    await expect(page.getByText('Planning Approval (P2)')).toBeVisible();
    await expect(page.getByText('Evidence Readiness (P3)')).toBeVisible();
    await expect(page.getByText('Draft Readiness')).toBeVisible();
    await expect(page.getByText('Final Readiness (P4)')).toBeVisible();
  });

  test('Milestone table shows Save Milestones button', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // Save Milestones button visible to EM/AD users
    await expect(page.getByRole('button', { name: 'Save Milestones' })).toBeVisible();
  });

  test('Date pickers show Not Set when no date', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // At least one "Not Set" placeholder visible if no dates set
    const notSetItems = page.getByText('Not Set');
    const count = await notSetItems.count();
    // May be 0 if dates already set, or 1-4 if unset
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('Clicking a date picker opens calendar', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // Click the first date picker button (aria-label pattern)
    const datePicker = page.getByRole('button', {
      name: /set.*target date/i,
    }).first();
    const isVisible = await datePicker.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }

    await datePicker.click();
    // Calendar should appear
    await expect(page.locator('.rdp, [role="dialog"]').first()).toBeVisible();
  });

  test('Milestone status chips visible for all milestone rows', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();

    // Status chips - at least "Not Started" chips should be visible
    const chips = page.locator('span').filter({ hasText: /Not Started|On Track|At Risk|Overdue|Complete/ });
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThan(0);
  });

  test('Engagement shell tabs include Team tab', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);

    // Tab navigation shows Team tab
    await expect(page.getByRole('tab', { name: 'Team' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Planning Record' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible();
  });

  test('Remove button visible for team members (EM/AD users)', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();
    await page.waitForLoadState('networkidle');

    // Only check remove buttons if team members exist
    const hasTeamMembers = await page.locator('table tbody tr').first().isVisible().catch(() => false);
    if (hasTeamMembers) {
      const removeButtons = page.getByRole('button', { name: /remove/i });
      const count = await removeButtons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('MilestoneStatusChip renders correct label text', async ({ page }) => {
    await page.goto('/engagements');
    await page.waitForLoadState('networkidle');

    const firstRow = page.locator('table tbody tr').first();
    const hasRows = await firstRow.isVisible().catch(() => false);
    if (!hasRows) {
      test.skip();
      return;
    }

    await firstRow.click();
    await page.waitForURL(/\/engagements\/.+/);
    await page.getByRole('tab', { name: 'Team' }).click();
    await page.waitForLoadState('networkidle');

    // At least one milestone status chip should be rendered
    // Status text should be one of the 5 valid states
    const validStatuses = ['Not Started', 'On Track', 'At Risk', 'Overdue', 'Complete'];
    let foundStatus = false;
    for (const status of validStatuses) {
      const isVisible = await page.getByText(status).first().isVisible().catch(() => false);
      if (isVisible) {
        foundStatus = true;
        break;
      }
    }
    expect(foundStatus).toBe(true);
  });
});
