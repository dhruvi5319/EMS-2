import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { authControllerRouter } from '../modules/auth/auth.controller';
import { searchRouter } from './search';
import { usersRouter } from './users';
import { auditRouter } from './audit';
import { requestsRouter } from './requests';
import { gateRouter } from './gate';
import { engagementsRouter } from './engagements';
import { teamRouter } from './team';
import { planningRouter } from './planning';

export const apiRouter = Router();

// ── Public routes (no auth) ──────────────────────────────────────────────────
// Auth endpoints (/api/auth/login) are public — no requireAuth here
apiRouter.use('/auth', authControllerRouter);

// ── Global authentication guard ──────────────────────────────────────────────
// All routes mounted below this line require a valid Bearer token.
// /api/health is handled before this router in app.ts, so it is excluded.
// /api/auth/* is mounted above, so it is excluded.
apiRouter.use(requireAuth);

// ── Protected routes ─────────────────────────────────────────────────────────
apiRouter.use('/search', searchRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/engagements', auditRouter);

// Phase 3: Request intake
apiRouter.use('/requests', requestsRouter);

// Phase 3: Gate A1 decisions — mounted at /requests so full path is /api/requests/:id/gate/a1
apiRouter.use('/requests', gateRouter);

// Phase 4: Engagement list/detail/update
apiRouter.use('/engagements', engagementsRouter);

// Phase 4: Team assignments, milestones, and P2 prerequisites
// teamRouter uses mergeParams:true so :id from /engagements/:id is accessible
apiRouter.use('/engagements/:id', teamRouter);

// Phase 4: Planning record, objectives, Gate P2 decision, and revision workflow
// planningRouter uses mergeParams:true so :id from /engagements/:id is accessible
apiRouter.use('/engagements/:id', planningRouter);
