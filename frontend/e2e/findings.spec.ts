import { test, expect } from '@playwright/test';

const AN_USER = { username: 'admin', password: 'Admin1234!' };
const RO_USER = { username: 'readonly_user', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page, creds = AN_USER) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(creds.username);
  await page.getByLabel('Password').fill(creds.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

/**
 * Creates a minimal engagement with P2 approved (required for evidence phase).
 * Returns the engagement ID.
 */
async function createEngagementInEvidencePhase(
  page: import('@playwright/test').Page
): Promise<string> {
  // Create and submit a request
  const createRes = await page.evaluate(async () => {
    const r = await fetch('/api/requests', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request_type: 'congressional',
        requester_name: 'Findings Test User',
        topic: 'Findings List Test',
        agency_program: 'Test Agency Findings',
        due_date: '2027-12-31',
      }),
    });
    return r.json();
  });
  const requestId: string = createRes.request?.id;

  // Submit request
  await page.evaluate(async (id: string) => {
    await fetch(`/api/requests/${id}/submit`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  }, requestId);

  // Gate A1 approve
  const approveRes = await page.evaluate(async (id: string) => {
    const r = await fetch(`/api/requests/${id}/gate/a1`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        decision: 'approve',
        rationale: 'Approved for findings test',
        risk_level: 'medium',
      }),
    });
    return r.json();
  }, requestId);

  return approveRes.engagement?.id as string;
}

test.describe('Findings Tab', () => {
  test('findings list page loads and shows empty state for AN user', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    // Navigate to engagement
    await page.goto(`/engagements/${engagementId}`);
    await page.waitForURL(`**/engagements/${engagementId}`);

    // Mock findings API
    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ findings: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          all_pass: false,
          blockers: [{ type: 'no_findings', message: 'No findings created.' }],
        }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ objectives: [], covered: 0, total: 0, uncovered_count: 0 }),
      });
    });

    // Click Findings tab
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Reload to activate mocks
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Should show empty state OR any finding card
    const hasEmpty = await page.getByText('No findings yet.').isVisible().catch(() => false);
    const hasFindingCard = await page.getByRole('article').count() > 0;
    expect(hasEmpty || hasFindingCard).toBeTruthy();
  });

  test('objective sufficiency summary bar visible', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    await page.goto(`/engagements/${engagementId}`);

    // Mock coverage with one objective
    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          objectives: [
            {
              id: 'obj-1',
              objective_text: 'Assess adequacy of internal budget controls',
              evidence_count: 0,
              sufficiency_status: 'evidence_needed',
            },
          ],
          covered: 0,
          total: 1,
          uncovered_count: 1,
        }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ findings: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ all_pass: false, blockers: [] }),
      });
    });

    await page.getByRole('tab', { name: 'Findings' }).click();
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Sufficiency summary container should be visible
    await expect(page.getByLabel('Objective Sufficiency Summary')).toBeVisible();
    // Should contain a chip text
    await expect(page.getByText(/Evidence Needed|In Review|Sufficient/)).toBeVisible();
  });

  test('P3 prerequisites checklist visible to RO user', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    // Log in as RO user
    await login(page, RO_USER);
    await page.goto(`/engagements/${engagementId}`);

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          all_pass: false,
          blockers: [{ type: 'no_evidence', message: 'Obj 1 has no linked evidence.' }],
        }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ findings: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ objectives: [], covered: 0, total: 0, uncovered_count: 0 }),
      });
    });

    await page.getByRole('tab', { name: 'Findings' }).click();
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // P3 Gate Prerequisites checklist should be visible to RO user
    await expect(page.getByLabel('P3 Gate Prerequisites')).toBeVisible();
  });

  test('add finding dialog opens when clicking [+ Add Finding]', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    await page.goto(`/engagements/${engagementId}`);

    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ findings: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ all_pass: false, blockers: [] }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ objectives: [], covered: 0, total: 0, uncovered_count: 0 }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/evidence**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ evidence: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('tab', { name: 'Findings' }).click();
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Click the [+ Add Finding] button
    await page.getByRole('button', { name: /Add Finding/ }).click();

    // Dialog should open with "Add Finding" heading
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add Finding' })).toBeVisible();
  });

  test('save finding validates finding text required', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    await page.goto(`/engagements/${engagementId}`);

    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ findings: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ all_pass: false, blockers: [] }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ objectives: [], covered: 0, total: 0, uncovered_count: 0 }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/evidence**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ evidence: [], total: 0 }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('tab', { name: 'Findings' }).click();
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Open dialog
    await page.getByRole('button', { name: /Add Finding/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click Save without entering text — Save button should be disabled when text empty
    const saveButton = page.getByRole('button', { name: /Save Finding/ });
    await expect(saveButton).toBeDisabled();

    // Type something and then clear to trigger validation
    await page.getByLabel(/Finding Text/).fill('some text');
    await expect(saveButton).toBeEnabled();
    await page.getByLabel(/Finding Text/).fill('');
    await expect(saveButton).toBeDisabled();
  });

  test('save finding with evidence creates finding and shows toast', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    await page.goto(`/engagements/${engagementId}`);

    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ findings: [], total: 0 }),
        });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            finding: {
              id: 'fd-test-001',
              engagement_id: engagementId,
              finding_text: 'Budget controls show systematic weaknesses.',
              status: 'draft',
              created_by: 'user-1',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              evidence_ids: ['ev-001'],
              evidence_count: 1,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ all_pass: false, blockers: [] }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ objectives: [], covered: 0, total: 0, uncovered_count: 0 }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/evidence**`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            evidence: [
              {
                id: 'ev-001',
                engagement_id: engagementId,
                evidence_type: 'document',
                source: 'Agency Budget Office',
                date_received: '2026-03-05',
                sensitivity: 'standard',
                custodian: null,
                description: null,
                created_by: 'user-1',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                file_count: 0,
                objective_count: 0,
              },
            ],
            total: 1,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('tab', { name: 'Findings' }).click();
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Open dialog
    await page.getByRole('button', { name: /Add Finding/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill finding text
    await page.getByLabel(/Finding Text/).fill('Budget controls show systematic weaknesses.');

    // Click Save Finding
    await page.getByRole('button', { name: /Save Finding/ }).click();

    // Dialog should close and toast "Finding saved." should appear
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Finding saved.')).toBeVisible({ timeout: 5000 });
  });

  test('delete finding shows confirm dialog with correct text', async ({ page }) => {
    await login(page, AN_USER);
    const engagementId = await createEngagementInEvidencePhase(page);

    await page.goto(`/engagements/${engagementId}`);

    const findingId = 'fd-001-test';
    await page.route(`**/api/engagements/${engagementId}/findings`, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            findings: [
              {
                id: findingId,
                engagement_id: engagementId,
                finding_text: 'Budget controls show systematic weaknesses in quarterly reconciliation.',
                status: 'draft',
                created_by: 'user-1',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                evidence_ids: [],
                evidence_count: 0,
              },
            ],
            total: 1,
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route(`**/api/engagements/${engagementId}/gate/p3/prerequisites`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ all_pass: false, blockers: [] }),
      });
    });

    await page.route(`**/api/engagements/${engagementId}/objectives/coverage`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ objectives: [], covered: 0, total: 0, uncovered_count: 0 }),
      });
    });

    await page.getByRole('tab', { name: 'Findings' }).click();
    await page.reload();
    await page.getByRole('tab', { name: 'Findings' }).click();

    // Wait for the finding card to appear
    await expect(page.getByRole('article')).toBeVisible({ timeout: 5000 });

    // Click the ✕ delete button on the finding card
    const deleteButton = page.getByRole('button', { name: /Delete finding/ });
    await deleteButton.click();

    // AlertDialog with "Delete Finding" confirm should appear
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await expect(page.getByText(/Delete Finding/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Keep Finding/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Confirm delete finding/ })).toBeVisible();
  });
});
