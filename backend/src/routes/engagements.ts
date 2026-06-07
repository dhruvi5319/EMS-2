import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { getEngagement, updateEngagement } from '../services/engagements.service';
import { checkP3Prerequisites, recordP3Decision } from '../services/findings.service';
import { listEngagements, exportEngagements } from '../services/gatep4.service';
import { findingsRouter } from './findings';
import { evidenceRouter } from './evidence';
import { objectiveCoverageRouter } from './objectivecoverage';
import { statementsRouter } from './statements';
import { draftRouter } from './draft';
import { gateP4Router } from './gatep4';

export const engagementsRouter = Router();
engagementsRouter.use(authenticateSession);

// GET /api/engagements — all authenticated roles; full F14 filter/sort/pagination
engagementsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { phase, status, owner_id, risk_level, due_date_before, sort_by, sort_dir, limit, offset } =
      req.query as Record<string, string>;
    const result = await listEngagements({
      phase: phase || undefined,
      status: status || undefined,
      owner_id: owner_id || undefined,
      risk_level: risk_level || undefined,
      due_date_before: due_date_before || undefined,
      sort_by: (sort_by as string) || 'updated_at',
      sort_dir: (sort_dir as 'asc' | 'desc') || 'desc',
      limit: parseInt(limit as string) || 25,
      offset: parseInt(offset as string) || 0,
    });
    res.json(result);
  } catch (err) {
    console.error('List engagements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// IMPORTANT: /export must be registered BEFORE /:id to avoid Express param capture
// GET /api/engagements/export — all roles except IR (F14.4)
engagementsRouter.get(
  '/export',
  requireRole('AL', 'EM', 'AN', 'QA', 'PC', 'RO', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { phase, status, owner_id, risk_level } = req.query as Record<string, string>;
      const csvString = await exportEngagements({
        phase: phase || undefined,
        status: status || undefined,
        owner_id: owner_id || undefined,
        risk_level: risk_level || undefined,
      });
      const date = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="engagement-register-${date}.csv"`);
      res.send(csvString);
    } catch (err) {
      console.error('Export engagements error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

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

// Mount Gate P4 sub-router — /api/engagements/:id/gate/p4
// Provides: GET /:id/gate/p4/prerequisites, POST /:id/gate/p4
engagementsRouter.use('/:id/gate/p4', gateP4Router);

// Mount statements sub-router — /api/engagements/:id/statements
engagementsRouter.use('/:id/statements', statementsRouter);

// Mount findings sub-router — /api/engagements/:id/findings
engagementsRouter.use('/:id/findings', findingsRouter);

// Mount evidence sub-router — /api/engagements/:id/evidence
engagementsRouter.use('/:id/evidence', evidenceRouter);

// Mount draft sub-router — /api/engagements/:id/draft
engagementsRouter.use('/:id/draft', draftRouter);

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
