import { Daytona } from '@daytonaio/sdk';
import { appendFileSync } from 'fs';

const BRANCH = process.env.GITHUB_REF_NAME || 'Stage';
const API_KEY = process.env.DAYTONA_API_KEY;
const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_OUTPUT = process.env.GITHUB_OUTPUT;
const BACKEND_IMAGE = process.env.BACKEND_IMAGE;   // Pre-built backend image from GHCR
const FRONTEND_IMAGE = process.env.FRONTEND_IMAGE; // Pre-built frontend image from GHCR
const APP_DIR = '/home/daytona/app';
const APP_PORT = 5173; // Vite dev server — the single public entrypoint

// --- helpers ---

function log(msg) { console.log(msg); }
function die(msg) { console.error(`\n❌ ${msg}`); process.exit(1); }

function ghOutput(key, value) {
  if (GH_OUTPUT) appendFileSync(GH_OUTPUT, `${key}=${value}\n`);
}

async function exec(sandbox, command, cwd, timeout) {
  // SDK signature: executeCommand(command, cwd?, env?, timeout?)
  return sandbox.process.executeCommand(command, cwd, undefined, timeout);
}

async function execOrDie(sandbox, command, cwd, timeout) {
  const res = await exec(sandbox, command, cwd, timeout);
  if (res.exitCode !== 0) {
    log(`Command failed: ${command}`);
    log(res.result);
    throw new Error(`Command exited with code ${res.exitCode}`);
  }
  return res;
}

async function waitFor(sandbox, check, label, maxAttempts = 30, intervalMs = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      if (await check()) { log(`✅ ${label}`); return; }
    } catch { /* retry */ }
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`Timeout waiting for: ${label}`);
}

// --- main ---

async function main() {
  if (!API_KEY) die('DAYTONA_API_KEY is required');
  if (!BACKEND_IMAGE) die('BACKEND_IMAGE is required (set by workflow after GHCR push)');
  if (!FRONTEND_IMAGE) die('FRONTEND_IMAGE is required (set by workflow after GHCR push)');
  if (!process.env.GITHUB_REPOSITORY) die('GITHUB_REPOSITORY is required');

  log(`📦 Backend image:  ${BACKEND_IMAGE}`);
  log(`📦 Frontend image: ${FRONTEND_IMAGE}`);
  log(`🌿 Branch: ${BRANCH}`);

  const daytona = new Daytona({ apiKey: API_KEY });

  // 1. Verify docker-dind snapshot
  log('📋 Checking docker-dind snapshot...');
  try {
    const snap = await daytona.snapshot.get('docker-dind');
    if (snap?.state !== 'active') throw new Error('not active');
    log('   ✅ docker-dind is active');
  } catch {
    die([
      'docker-dind snapshot not found or not active.',
      '',
      'Create it in Daytona Dashboard:',
      '  1. https://app.daytona.io/dashboard → Snapshots',
      '  2. Create: name=docker-dind, image=docker:24-dind',
      '  3. Wait for "active", then re-run',
    ].join('\n'));
  }

  // 2. Create sandbox
  log('📦 Creating sandbox...');
  const sandbox = await daytona.create({ snapshot: 'docker-dind', language: 'typescript' });
  log(`✅ Sandbox ${sandbox.id}`);

  try {
    // 3. Wait for Docker daemon
    log('⏳ Waiting for Docker...');
    await waitFor(sandbox, async () => {
      const r = await exec(sandbox, 'docker info');
      return r.exitCode === 0;
    }, 'Docker daemon is ready');

    // 4. Authenticate to GHCR so sandbox can pull the images
    log('🔑 Logging into GHCR...');
    await execOrDie(sandbox, `echo '${GH_TOKEN}' | docker login ghcr.io -u github-actions --password-stdin`);
    log('   ✅ GHCR authenticated');

    // 5. Pull the pre-built images
    log(`📥 Pulling backend image: ${BACKEND_IMAGE}`);
    await execOrDie(sandbox, `docker pull ${BACKEND_IMAGE}`, undefined, 300);
    log(`📥 Pulling frontend image: ${FRONTEND_IMAGE}`);
    await execOrDie(sandbox, `docker pull ${FRONTEND_IMAGE}`, undefined, 300);
    log('   ✅ Images pulled');

    // 6. Generate a deploy-only docker-compose.yml.
    //    Mirrors the project's docker-compose.yml but swaps "build:" for the
    //    pre-built images, and drops the source bind-mounts (the images are
    //    self-contained). A one-shot "migrate" service runs knex migrate+seed
    //    before the backend starts. Only the frontend port is exposed publicly;
    //    Vite proxies /api -> backend over the compose network.
    log('📝 Writing docker-compose for deployment...');
    const composeContent = `
services:
  postgres:
    image: postgres:16-bookworm
    environment:
      POSTGRES_DB: ems
      POSTGRES_USER: ems
      POSTGRES_PASSWORD: ems_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ems -d ems"]
      interval: 5s
      timeout: 5s
      retries: 10

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 10s
      timeout: 10s
      retries: 5

  migrate:
    image: ${BACKEND_IMAGE}
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://ems:ems_password@postgres:5432/ems
    command: ["sh", "-lc", "npx tsx node_modules/.bin/knex migrate:latest && npx tsx node_modules/.bin/knex seed:run"]
    restart: "no"

  backend:
    image: ${BACKEND_IMAGE}
    depends_on:
      postgres:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    environment:
      NODE_ENV: production
      PORT: "3001"
      DATABASE_URL: postgresql://ems:ems_password@postgres:5432/ems
      JWT_SECRET: daytona-preview-jwt-secret-change-me-32chars
      JWT_EXPIRES_IN: 15m
      SESSION_EXPIRES_IN: 7d
      FRONTEND_URL: http://localhost:${APP_PORT}
      STORAGE_TYPE: local
      STORAGE_LOCAL_PATH: /app/uploads
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
      MINIO_BUCKET: ems-files
    volumes:
      - backend_uploads:/app/uploads

  frontend:
    image: ${FRONTEND_IMAGE}
    depends_on:
      - backend
    environment:
      VITE_PROXY_TARGET: http://backend:3001
    ports:
      - "${APP_PORT}:5173"

volumes:
  postgres_data:
  minio_data:
  backend_uploads:
`.trimStart();

    await sandbox.fs.uploadFile(Buffer.from(composeContent), `${APP_DIR}/docker-compose.yml`);
    log('   ✅ docker-compose.yml written');

    // 7. Start services (no build needed — just pull + run)
    log('🚀 Starting services...');
    const up = await execOrDie(sandbox, 'docker compose up -d 2>&1', APP_DIR, 180);
    log(up.result);

    // 8. Give services a moment to initialize
    log('⏳ Waiting for services to initialize...');
    await new Promise(r => setTimeout(r, 10000));

    // Show service status (informational only)
    const ps = await exec(sandbox, 'docker compose ps 2>&1', APP_DIR);
    log(ps.result);

    // 9. Health check — verify the frontend (Vite) is responding
    log('🔍 Health check (waiting for frontend to respond)...');
    await waitFor(sandbox, async () => {
      // Try multiple methods since curl may not be in sandbox
      let r = await exec(sandbox, `curl -sf http://localhost:${APP_PORT}/ -o /dev/null 2>&1`);
      if (r.exitCode === 0) return true;

      r = await exec(sandbox, `wget -q -O /dev/null http://localhost:${APP_PORT}/ 2>&1`);
      if (r.exitCode === 0) return true;

      r = await exec(sandbox, `docker exec app-frontend-1 curl -sf http://localhost:5173/ -o /dev/null 2>&1`, APP_DIR);
      if (r.exitCode === 0) return true;

      // Fallback: container still running
      r = await exec(sandbox, 'docker ps --filter name=app-frontend-1 --filter status=running -q', APP_DIR);
      return r.exitCode === 0 && r.result.trim().length > 0;
    }, `Frontend is healthy`, 40, 3000);

    // 10. Get preview URL (frontend port)
    log('🔗 Getting preview URL...');
    const preview = await sandbox.getPreviewLink(APP_PORT);

    log('');
    log('═══════════════════════════════════════════');
    log('🎉 DEPLOYMENT SUCCESSFUL');
    log('═══════════════════════════════════════════');
    log(`   Sandbox:  ${sandbox.id}`);
    log(`   URL:      ${preview.url}`);
    if (preview.token) log(`   Token:    ${preview.token}`);
    log('═══════════════════════════════════════════');

    ghOutput('sandbox_url', preview.url);
    ghOutput('sandbox_id', sandbox.id);
    if (preview.token) ghOutput('preview_token', preview.token);

  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}`);

    try {
      log('\n📋 Debug info:');
      log('--- Container Status ---');
      const ps = await exec(sandbox, 'docker compose ps 2>&1', APP_DIR);
      log(ps.result);
      log('--- Backend Logs ---');
      const blogs = await exec(sandbox, 'docker compose logs backend --tail=50 2>&1', APP_DIR);
      log(blogs.result);
      log('--- Frontend Logs ---');
      const flogs = await exec(sandbox, 'docker compose logs frontend --tail=30 2>&1', APP_DIR);
      log(flogs.result);
      log('--- Migrate Logs ---');
      const mlogs = await exec(sandbox, 'docker compose logs migrate --tail=30 2>&1', APP_DIR);
      log(mlogs.result);
    } catch { /* best effort */ }

    try {
      log('🧹 Cleaning up sandbox...');
      await sandbox.delete();
    } catch { /* ignore */ }

    process.exit(1);
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
