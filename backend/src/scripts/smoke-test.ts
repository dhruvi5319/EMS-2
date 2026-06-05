/**
 * Auth smoke test — run with: npx tsx src/scripts/smoke-test.ts
 * Requires: backend running on localhost:3001 with seeded admin user
 */

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function fetchApi(path: string, opts: RequestInit = {}): Promise<{ status: number; body: unknown; setCookie?: string }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body, setCookie: res.headers.get('set-cookie') || undefined };
}

async function run(): Promise<void> {
  let passed = 0;
  let failed = 0;

  function assert(label: string, condition: boolean, detail?: string): void {
    if (condition) {
      console.log(`  ✓ ${label}`);
      passed++;
    } else {
      console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  // 1. Health check
  console.log('\n[1] Health check');
  const health = await fetchApi('/health');
  assert('GET /health → 200', health.status === 200, `got ${health.status}`);
  assert('Health body has status:ok', (health.body as { status?: string })?.status === 'ok');

  // 2. Login with bad credentials
  console.log('\n[2] Login with invalid credentials');
  const badLogin = await fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'wrong' }),
  });
  assert('POST /api/auth/login bad creds → 401', badLogin.status === 401, `got ${badLogin.status}`);

  // 3. Unauthenticated request to protected route
  console.log('\n[3] Unauthenticated access');
  const noAuth = await fetchApi('/api/auth/me');
  assert('GET /api/auth/me without cookie → 401', noAuth.status === 401, `got ${noAuth.status}`);

  // 4. Valid login
  console.log('\n[4] Login with valid credentials');
  const goodLogin = await fetchApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: 'Admin1234!' }),
  });
  assert('POST /api/auth/login valid creds → 200', goodLogin.status === 200, `got ${goodLogin.status}`);
  assert('Response has user object', !!(goodLogin.body as { user?: unknown })?.user);
  assert('Response sets Set-Cookie header', !!goodLogin.setCookie, 'no Set-Cookie header');

  const cookieHeader = goodLogin.setCookie || '';
  const sessionCookie = cookieHeader.split(';')[0]; // ems_session=<hash>

  // 5. Authenticated /me
  console.log('\n[5] Authenticated access');
  const me = await fetchApi('/api/auth/me', {
    headers: { Cookie: sessionCookie },
  });
  assert('GET /api/auth/me with cookie → 200', me.status === 200, `got ${me.status}`);
  assert('Me response has user.username=admin', (me.body as { user?: { username?: string } })?.user?.username === 'admin');

  // 6. Logout
  console.log('\n[6] Logout');
  const logoutRes = await fetchApi('/api/auth/logout', {
    method: 'POST',
    headers: { Cookie: sessionCookie },
  });
  assert('POST /api/auth/logout → 200', logoutRes.status === 200, `got ${logoutRes.status}`);

  // 7. Session invalidated after logout
  console.log('\n[7] Session invalidated after logout');
  const afterLogout = await fetchApi('/api/auth/me', {
    headers: { Cookie: sessionCookie },
  });
  assert('GET /api/auth/me after logout → 401', afterLogout.status === 401, `got ${afterLogout.status}`);

  console.log(`\nSmoke test: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Smoke test error:', err);
  process.exit(1);
});
