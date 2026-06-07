import { test, expect } from '@playwright/test';

const EM_USER = { username: 'admin', password: 'Admin1234!' };

async function login(page: import('@playwright/test').Page, credentials = EM_USER) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(credentials.username);
  await page.getByLabel('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/dashboard');
}

const ENGAGEMENT_ID = 'test-engagement-id';

/**
 * Mock a GET /api/engagements/:id/draft → no draft (null)
 */
async function mockNoDraft(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/draft`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ draft: null }),
      });
    } else {
      route.continue();
    }
  });
}

/**
 * Mock a GET /api/engagements/:id/draft → returns a draft in 'drafting' state
 */
async function mockDraftExists(
  page: import('@playwright/test').Page,
  status: string = 'drafting'
) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/draft`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          draft: {
            id: 'draft-001',
            engagement_id: ENGAGEMENT_ID,
            title: 'Review of Budget Control Systems FY2026',
            version: 'v1.0',
            owner_id: 'user-001',
            owner_name: 'Priya Nair',
            status,
            file_ref: null,
            filename: null,
            file_size: null,
            created_at: '2026-04-02T00:00:00Z',
            updated_at: '2026-04-02T00:00:00Z',
          },
        }),
      });
    } else {
      route.continue();
    }
  });
}

/**
 * Mock engagement with P3 approved gate decision
 */
async function mockEngagementWithP3(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        engagement: {
          id: ENGAGEMENT_ID,
          job_code: 'ENG-2026-00001',
          title: 'Test Engagement',
          phase: 'draft',
          status: 'active',
          risk_level: 'medium',
          engagement_type: 'performance',
          manager_user_id: 'user-001',
          manager_name: 'Test Manager',
          start_date: '2026-01-01',
          target_date: '2026-12-31',
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          description: null,
        },
        gate_decisions: [
          {
            id: 'gate-p3',
            engagement_id: ENGAGEMENT_ID,
            gate_name: 'P3',
            decision: 'approved',
            decided_at: '2026-04-01T00:00:00Z',
            decided_by: 'admin',
            comment: null,
          },
        ],
        blockers: [],
      }),
    });
  });
}

/**
 * Mock draft/comments endpoint
 */
async function mockDraftComments(
  page: import('@playwright/test').Page,
  comments: object[] = []
) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/draft/comments`, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ comments }),
      });
    } else if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() || '{}');
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          comment: {
            id: 'comment-new',
            draft_product_id: 'draft-001',
            author_id: 'user-admin',
            author_name: 'Admin User',
            text: body.text,
            created_at: new Date().toISOString(),
          },
        }),
      });
    } else {
      route.continue();
    }
  });
}

/**
 * Mock statements for the engagement
 */
async function mockStatements(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/statements`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ statements: [] }),
    });
  });
}

/**
 * Mock team members for owner dropdown
 */
async function mockTeam(page: import('@playwright/test').Page) {
  await page.route(`**/api/engagements/${ENGAGEMENT_ID}/team`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        assignments: [
          {
            id: 'ta-001',
            engagement_id: ENGAGEMENT_ID,
            user_id: 'user-001',
            role: 'EM',
            assigned_at: '2026-01-01T00:00:00Z',
            user: { display_name: 'Priya Nair', email: 'priya@example.com' },
          },
        ],
      }),
    });
  });
}

/**
 * Navigate to the engagement Draft Product tab
 */
async function navigateToDraftTab(page: import('@playwright/test').Page) {
  await page.goto(`/engagements/${ENGAGEMENT_ID}`);
  await page.waitForTimeout(500);
  await page.getByRole('tab', { name: 'Draft Product' }).click();
  await page.waitForTimeout(300);
}

test.describe('Draft Product Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("shows 'No draft product record yet.' empty state when draft not yet created", async ({ page }) => {
    await mockEngagementWithP3(page);
    await mockNoDraft(page);
    await mockStatements(page);

    await navigateToDraftTab(page);

    await expect(
      page.getByText('No draft product record yet.')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Create Draft Product' })
    ).toBeVisible();
  });

  test('opens Create Draft Product dialog with title/version/owner fields', async ({ page }) => {
    await mockEngagementWithP3(page);
    await mockNoDraft(page);
    await mockStatements(page);
    await mockTeam(page);

    await navigateToDraftTab(page);

    await page.getByRole('button', { name: 'Create Draft Product' }).click();
    await page.waitForTimeout(200);

    // Dialog should be visible
    await expect(page.getByRole('dialog')).toBeVisible();

    // Check fields
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/version/i)).toBeVisible();
    await expect(page.getByLabel(/owner/i)).toBeVisible();
  });

  test('creates draft product and shows DraftStatusStepper at Drafting step', async ({ page }) => {
    await mockEngagementWithP3(page);
    await mockStatements(page);
    await mockTeam(page);
    await mockDraftComments(page);

    // Initially no draft
    let callCount = 0;
    await page.route(`**/api/engagements/${ENGAGEMENT_ID}/draft`, (route) => {
      if (route.request().method() === 'GET') {
        callCount++;
        if (callCount === 1) {
          // First GET: no draft
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ draft: null }),
          });
        } else {
          // Subsequent GETs: draft exists
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              draft: {
                id: 'draft-001',
                engagement_id: ENGAGEMENT_ID,
                title: 'Test Draft',
                version: 'v1.0',
                owner_id: 'user-001',
                owner_name: 'Priya Nair',
                status: 'drafting',
                file_ref: null,
                filename: null,
                file_size: null,
                created_at: '2026-04-02T00:00:00Z',
                updated_at: '2026-04-02T00:00:00Z',
              },
            }),
          });
        }
      } else if (route.request().method() === 'POST') {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            draft: {
              id: 'draft-001',
              engagement_id: ENGAGEMENT_ID,
              title: 'Test Draft',
              version: 'v1.0',
              owner_id: 'user-001',
              owner_name: 'Priya Nair',
              status: 'drafting',
              file_ref: null,
              filename: null,
              file_size: null,
              created_at: '2026-04-02T00:00:00Z',
              updated_at: '2026-04-02T00:00:00Z',
            },
          }),
        });
      } else {
        route.continue();
      }
    });

    await navigateToDraftTab(page);

    // Open dialog and create
    await page.getByRole('button', { name: 'Create Draft Product' }).click();
    await page.waitForTimeout(200);

    await page.getByLabel(/title/i).fill('Test Draft');
    await page.getByRole('button', { name: 'Create Draft Product' }).nth(1).click();
    await page.waitForTimeout(500);

    // Stepper should be visible after creation
    await expect(page.getByRole('list', { name: 'Draft product status' })).toBeVisible();

    // The DraftStatusBadge should show 'Drafting'
    await expect(page.getByText('Drafting').first()).toBeVisible();
  });

  test('advance button label changes per current status', async ({ page }) => {
    await mockEngagementWithP3(page);
    await mockDraftExists(page, 'drafting');
    await mockDraftComments(page);
    await mockStatements(page);

    await navigateToDraftTab(page);

    // Advance button should show correct label for "drafting" status
    await expect(
      page.getByRole('button', { name: 'Advance to Under Review →' })
    ).toBeVisible();
  });

  test('comment thread shows empty state then appends comment', async ({ page }) => {
    await mockEngagementWithP3(page);
    await mockDraftExists(page, 'drafting');
    await mockStatements(page);
    await mockDraftComments(page, []);

    await navigateToDraftTab(page);

    // Empty state
    await expect(page.getByText('No review comments yet.')).toBeVisible();

    // Type a comment
    await page.getByLabel('Review comment text').fill('Test review comment');

    // Save it
    await page.getByRole('button', { name: 'Save Comment' }).click();
    await page.waitForTimeout(300);

    // Comment should appear with author
    await expect(page.getByText('Test review comment')).toBeVisible();
    await expect(page.getByText('Admin User')).toBeVisible();
  });

  test('file section shows upload zone when no file attached', async ({ page }) => {
    await mockEngagementWithP3(page);
    await mockDraftExists(page, 'drafting');
    await mockDraftComments(page);
    await mockStatements(page);

    await navigateToDraftTab(page);

    // Should show upload zone
    await expect(page.getByRole('button', { name: 'Upload draft product file' }).or(
      page.getByText('Choose File')
    )).toBeVisible();

    // Should show allowed types
    await expect(
      page.getByText(/Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP/i)
    ).toBeVisible();
  });
});
