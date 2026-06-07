import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { listEngagements, getEngagement, updateEngagement } from '../services/engagements.service';
import { checkP3Prerequisites, recordP3Decision } from '../services/findings.service';
import { findingsRouter } from './findings';
import { evidenceRouter } from './evidence';
import { objectiveCoverageRouter } from './objectivecoverage';

export const engagementsRouter = Router();
engagementsRouter.use(authenticateSession);

// GET /api/engagements — all authenticated roles; role-scoped
engagementsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { phase, status, owner_id, limit, offset } = req.query as Record<string, string>;
    const isAdmin = req.user!.roles.includes('AD');
    const result = await listEngagements({
      phase: phase || undefined,
      status: status || undefined,
      owner_id: owner_id || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
      userId: req.user!.id,
      isAdmin,
    });
    res.json(result);
  } catch (err) {
    console.error('List engagements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/engagements/:id — all authenticated roles
engagementsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await getEngagement(req.params.id);
    if (!result) { res.status(404).json({ error: 'Engagement not found' }); return; }
    res.json(result);
  } catch (err) {
    console.error('Get engagement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/engagements/:id — EM and AD only
engagementsRouter.patch('/:id', requireRole('EM', 'AD'), async (req: Request, res: Response) => {
  try {
    const { title, risk_level, owner_id, portfolio } = req.body;
    const engagement = await updateEngagement(req.params.id, { title, risk_level, owner_id, portfolio }, req.user!.id);
    res.json({ engagement });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string; fields?: string[] };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Update engagement error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mount findings sub-router — /api/engagements/:id/findings
engagementsRouter.use('/:id/findings', findingsRouter);

// Mount evidence sub-router — /api/engagements/:id/evidence
engagementsRouter.use('/:id/evidence', evidenceRouter);

// Mount objective coverage sub-router at /:id
// Provides: POST /:id/evidence/:evidence_id/objectives (link)
//           DELETE /:id/evidence/:evidence_id/objectives/:objective_id (unlink)
//           GET /:id/objectives/coverage
//           PUT /:id/objectives/sufficiency
engagementsRouter.use('/:id', objectiveCoverageRouter);

// GET /api/engagements/:id/gate/p3/prerequisites — all authenticated roles
engagementsRouter.get('/:id/gate/p3/prerequisites', async (req: Request, res: Response) => {
  try {
    const result = await checkP3Prerequisites(req.params.id);
    res.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('P3 prerequisites error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/engagements/:id/gate/p3 — QA, AD only
engagementsRouter.post(
  '/:id/gate/p3',
  requireRole('QA', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { decision, comment } = req.body;
      const result = await recordP3Decision(
        req.params.id,
        { decision, comment },
        req.user!.id
      );
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; blockers?: unknown };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message, blockers: error.blockers });
        return;
      }
      console.error('Gate P3 decision error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
