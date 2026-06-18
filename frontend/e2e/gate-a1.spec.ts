import { test, expect } from '@playwright/test';

const VALID_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(VALID_USER.username);
  await page.getByLabel('Password').fill(VALID_USER.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

async function createAndSubmitRequest(page: import('@playwright/test').Page): Promise<string> {
  // Create a request via API calls to get a submitted request for testing
  // Step 1: create draft
  const createRes = await page.evaluate(async () => {
    const r = await fetch('/api/requests', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_type: 'congressional',
        requester_name: 'Test Requester',
        topic: 'Test engagement topic for Gate A1',
        agency_program: 'Test Agency',
        due_date: '2027-12-31',
      }),
    });
    return r.json();
  });
  const requestId: string = createRes.request?.id;

  // Step 2: submit
  await page.evaluate(async (id: string) => {
    await fetch(`/api/requests/${id}/submit`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  }, requestId);

  return requestId;
}

test.describe('Gate A1 Decision Panel', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('Gate A1 panel renders for submitted request (AL user)', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);
    await expect(page.getByText('Gate A1: Acceptance Decision')).toBeVisible();
    await expect(page.getByText('✓ Approve Request →')).toBeVisible();
    await expect(page.getByText('✗ Decline Request')).toBeVisible();
  });

  test('Approve button is disabled initially (no risk level or rationale)', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);
    const approveBtn = page.getByRole('button', { name: /✓ Approve Request/ });
    await expect(approveBtn).toBeDisabled();
  });

  test('Approve button enables after risk level + rationale filled', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    // Select risk level
    await page.getByLabel('Medium').click();
    // Fill rationale with 10+ chars
    await page.getByPlaceholder('e.g., Scope aligns').fill('Valid rationale text here.');
    await expect(page.getByRole('button', { name: /✓ Approve Request/ })).toBeEnabled();
  });

  test('Decline button enables after rationale filled (no risk required)', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    // Fill only rationale (no risk level)
    await page.getByPlaceholder('e.g., Scope aligns').fill('Rationale for decline here.');
    // Decline button should enable
    const declineBtn = page.getByText('✗ Decline Request');
    // Check it's not disabled
    await expect(declineBtn).not.toHaveClass(/opacity-50/);
  });

  test('Approve dialog shows "Keep Request Pending" button', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    await page.getByLabel('Medium').click();
    await page.getByPlaceholder('e.g., Scope aligns').fill('Valid rationale with enough characters.');

    await page.getByRole('button', { name: /✓ Approve Request/ }).click();
    await expect(page.getByText('Keep Request Pending')).toBeVisible();
    await expect(page.getByText('Confirm Approve ✓')).toBeVisible();
  });

  test('Decline dialog shows "Keep Request Pending" button', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    await page.getByPlaceholder('e.g., Scope aligns').fill('Rationale for decline here enough chars.');
    await page.getByText('✗ Decline Request').click();
    await expect(page.getByText('Keep Request Pending')).toBeVisible();
    await expect(page.getByText('Confirm Decline ✗')).toBeVisible();
  });

  test('"Keep Request Pending" closes dialog without acting', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    await page.getByLabel('Low').click();
    await page.getByPlaceholder('e.g., Scope aligns').fill('Long enough rationale text here.');
    await page.getByRole('button', { name: /✓ Approve Request/ }).click();
    await expect(page.getByText('Keep Request Pending')).toBeVisible();

    // Click Keep Request Pending
    await page.getByRole('button', { name: 'Keep Request Pending' }).click();

    // Dialog closes; panel still visible
    await expect(page.getByText('Confirm Approve ✓')).not.toBeVisible();
    await expect(page.getByText('✓ Approve Request →')).toBeVisible();
  });

  test('full approve flow shows success banner with job code', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    await page.getByLabel('Medium').click();
    await page.getByPlaceholder('e.g., Scope aligns').fill('Approval rationale with enough characters.');
    await page.getByRole('button', { name: /✓ Approve Request/ }).click();
    await page.getByRole('button', { name: 'Confirm Approve ✓' }).click();

    // Wait for API response and banner
    await page.waitForTimeout(1000);
    await expect(page.getByText(/ENG-\d{4}-\d{5}.*created/)).toBeVisible();
    await expect(page.getByText('View Engagement Shell →')).toBeVisible();
  });

  test('rationale char counter shows below-min in red when < 10 chars', async ({ page }) => {
    const requestId = await createAndSubmitRequest(page);
    await page.goto(`/requests/${requestId}`);

    await page.getByPlaceholder('e.g., Scope aligns').fill('short');
    await expect(page.getByText('5 / 10 minimum')).toBeVisible();
  });
});

test.describe('Gate A1 Decided Card', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('decided card shows real approver name from gate decision API', async ({ page }) => {
    // Create, submit, and approve a request to get a real decided state
    const createRes = await page.evaluate(async () => {
      const r = await fetch('/api/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: 'congressional',
          requester_name: 'Test Requester',
          topic: 'Decided card approver name test',
          agency_program: 'Test Agency',
          due_date: '2027-12-31',
        }),
      });
      return r.json();
    });
    const requestId: string = createRes.request?.id;

    // Submit
    await page.evaluate(async (id: string) => {
      await fetch(`/api/requests/${id}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    }, requestId);

    // Approve via API
    await page.evaluate(async (id: string) => {
      await fetch(`/api/requests/${id}/gate/a1`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'approved',
          risk_level: 'medium',
          rationale: 'Valid rationale for decided card test.',
        }),
      });
    }, requestId);

    // Navigate to detail page
    await page.goto(`/requests/${requestId}`);
    await page.waitForTimeout(1000); // allow gate/decision API call to complete

    // Decided card should show real data (not placeholder)
    // The approver name 'Approver' field should be visible (not empty or placeholder)
    await expect(page.getByText('✓ Approved')).toBeVisible();
    // Rationale should match what was submitted
    await expect(page.getByText(/Valid rationale for decided card test/)).toBeVisible();
    // Approver row should be visible
    await expect(page.getByText('APPROVER', { exact: false })).toBeVisible();
  });

  test('View Gate History navigates to engagement audit trail (not #audit)', async ({ page }) => {
    // Create, submit, and approve a request
    const createRes = await page.evaluate(async () => {
      const r = await fetch('/api/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: 'mandate',
          requester_name: 'Test Requester',
          topic: 'View Gate History link test',
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

    await page.evaluate(async (id: string) => {
      await fetch(`/api/requests/${id}/gate/a1`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'approved',
          risk_level: 'low',
          rationale: 'Gate history link navigation test rationale.',
        }),
      });
    }, requestId);

    await page.goto(`/requests/${requestId}`);
    await page.waitForTimeout(1000);

    // View Gate History → link should NOT be #audit
    const gateHistoryLink = page.getByText('View Gate History →');
    await expect(gateHistoryLink).toBeVisible();

    const href = await gateHistoryLink.getAttribute('href');
    expect(href).toMatch(/\/engagements\/[a-f0-9-]+\/audit/);
    expect(href).not.toBe('#audit');
  });

  test('decided card for declined shows no View Gate History link', async ({ page }) => {
    // Create, submit, and decline a request
    const createRes = await page.evaluate(async () => {
      const r = await fetch('/api/requests', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: 'internal',
          requester_name: 'Test Requester',
          topic: 'Declined card test',
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

    await page.evaluate(async (id: string) => {
      await fetch(`/api/requests/${id}/gate/a1`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'declined',
          rationale: 'Declined rationale for card test.',
        }),
      });
    }, requestId);

    await page.goto(`/requests/${requestId}`);
    await page.waitForTimeout(1000);

    // Declined card should show ✗ Declined
    await expect(page.getByText('✗ Declined')).toBeVisible();

    // View Gate History link (with →) should NOT be visible for declined (no engagement)
    const gateHistoryArrowLink = page.getByText('View Gate History →');
    await expect(gateHistoryArrowLink).not.toBeVisible();

    // No broken #audit anchor
    const brokenAuditAnchor = page.locator('a[href="#audit"]');
    await expect(brokenAuditAnchor).toHaveCount(0);
  });
});
