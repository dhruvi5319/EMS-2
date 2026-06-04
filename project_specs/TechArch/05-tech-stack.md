---

## 6. Technology Stack

### 6.1 Stack Summary

| Layer | Technology | Version | Purpose | Rationale |
|-------|-----------|---------|---------|-----------|
| **Frontend framework** | React | 18.x | SPA web UI | PRD-specified; mature ecosystem; excellent TypeScript support |
| **Frontend build tool** | Vite | 5.x | Dev server + production build | Fast HMR in development; minimal config |
| **Frontend router** | React Router | 6.x | Client-side routing | De-facto standard for React SPAs |
| **Frontend state** | React Query (TanStack Query) | 5.x | Server state management, caching | Simplifies async data fetching, loading states, and cache invalidation without Redux overhead |
| **Frontend styling** | Tailwind CSS | 3.x | Utility-first CSS | Fast to build; consistent spacing and typography without custom CSS overhead |
| **Frontend component kit** | Headless UI / Radix UI | Latest | Accessible UI primitives | Pre-built accessible modals, dropdowns, and dialogs |
| **Frontend language** | TypeScript | 5.x | Type safety | Catches API shape mismatches at compile time |
| **Backend runtime** | Node.js | 20 LTS | Server runtime | Large ecosystem; native async/await; JSON handling |
| **Backend framework** | Express.js | 4.x | HTTP routing + middleware | Minimal, flexible; well-understood patterns |
| **Backend language** | TypeScript | 5.x | Type safety | Shared type definitions possible between frontend and backend |
| **ORM / query builder** | Knex.js | 3.x | SQL query builder + migrations | Type-safe queries without the overhead of a full ORM; supports raw SQL for complex aggregates |
| **Database** | PostgreSQL | 15+ | Primary relational datastore | JSONB for audit snapshots; `gen_random_uuid()`; ACID guarantees; standard backup tooling |
| **File storage (dev)** | Local filesystem | — | File persistence in development | `./data/files/` directory mounted as Docker volume |
| **File storage (prod)** | S3-compatible object storage | — | File persistence in production | AWS S3, MinIO, or equivalent; configured via env vars |
| **Authentication** | bcrypt + session tokens | — | Password hashing + session management | bcrypt cost ≥ 12; sessions stored in PostgreSQL `sessions` table |
| **Password hashing** | bcryptjs | 2.x | bcrypt implementation for Node.js | Pure JS; no native binding; easy to install in Docker |
| **HTTP client (frontend)** | Axios | 1.x | API calls from React | Interceptors for auth token injection and 401 handling |
| **Validation (backend)** | Zod | 3.x | Request body validation | Schema-first validation with TypeScript inference |
| **Testing (backend)** | Jest + Supertest | Latest | Unit + integration tests | Standard Node.js testing stack |
| **Testing (frontend)** | Vitest + Testing Library | Latest | Component + integration tests | Vite-native test runner |
| **Container runtime** | Docker + docker-compose | Latest | Local dev + production container | Consistent environment; docker-compose for dev orchestration |
| **Reverse proxy** | nginx | 1.25+ | TLS termination + static file serving | Terminates HTTPS; serves React SPA static assets |
| **Linting / formatting** | ESLint + Prettier | Latest | Code quality | Consistent style across frontend and backend |
| **CSV generation** | Built-in (stream to response) | — | CSV export | No third-party library required; standard string generation |

---

### 6.2 Key Dependency Rationale

**Why React Query over Redux?**  
The EMS data model is server-authoritative. React Query handles server state (fetching, caching, background refresh, optimistic updates) without needing a client-side store. Redux would add boilerplate for no benefit in this use case.

**Why Knex over Prisma/TypeORM?**  
The FRD provides precise DDL with custom CHECK constraints, sequences, and JSONB columns. Knex gives direct control over the SQL without ORM magic obscuring the query plan. Complex dashboard aggregate queries are written as raw SQL via `knex.raw()` for clarity and performance.

**Why Express over Fastify/Hono?**  
Familiarity and ecosystem maturity. Express middleware patterns (auth, RBAC, logging) are well-understood and have a large community. The EMS API volume does not require Fastify's throughput optimizations.

**Why PostgreSQL over MySQL/SQLite?**  
- `JSONB` for `before_snapshot`/`after_snapshot` in audit events.
- `gen_random_uuid()` native in PostgreSQL 13+.
- `TIMESTAMPTZ` (timezone-aware timestamps) for correct UTC storage.
- PostgreSQL 15 recommended for improved performance and `MERGE` support.
- SQLite is excluded: concurrent write access from multiple containers requires a proper server-side database.

---

### 6.3 File Storage Configuration

| Environment | Backend | Configuration |
|------------|---------|---------------|
| Local development | `local` | Files stored at `./data/files/`; Docker volume mount |
| Production | `s3_compatible` | AWS S3, MinIO, Azure Blob (S3-compatible API), or GCS |

Storage abstraction interface:
```typescript
interface IStorageProvider {
  put(path: string, data: Buffer, mimeType: string): Promise<string>; // returns file_ref
  get(fileRef: string): Promise<{ stream: NodeJS.ReadableStream; mimeType: string }>;
  delete(fileRef: string): Promise<void>;
  exists(fileRef: string): Promise<boolean>;
}
```

---

### 6.4 Environment Variables

| Variable | Required | Default | Purpose |
|----------|---------|---------|---------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (`postgres://user:pass@host:5432/db`) |
| `SESSION_SECRET` | Yes | — | HMAC secret for session token signing |
| `STORAGE_BACKEND` | Yes | `local` | `local` or `s3_compatible` |
| `STORAGE_BUCKET` | Prod only | — | S3 bucket name |
| `STORAGE_BASE_PATH` | Yes (local) | `./data/files` | Base path for local file storage |
| `STORAGE_ENDPOINT` | S3 only | — | S3-compatible endpoint URL |
| `STORAGE_ACCESS_KEY_ID` | S3 only | — | S3 access key |
| `STORAGE_SECRET_ACCESS_KEY` | S3 only | — | S3 secret key |
| `MAX_LOGIN_ATTEMPTS` | No | `5` | Failed login threshold before lockout |
| `LOCKOUT_DURATION_MINUTES` | No | `15` | Account lockout duration |
| `SESSION_EXPIRY_HOURS` | No | `8` | Session token lifetime |
| `PORT` | No | `3000` | Backend HTTP listen port |
| `NODE_ENV` | No | `development` | `development`, `test`, `production` |
| `CORS_ORIGIN` | Prod | — | Allowed CORS origin (frontend URL) |
| `LOG_LEVEL` | No | `info` | Log verbosity: `debug`, `info`, `warn`, `error` |

