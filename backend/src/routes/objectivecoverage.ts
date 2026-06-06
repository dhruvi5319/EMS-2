import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  linkEvidenceToObjectives,
  unlinkEvidenceFromObjective,
  getObjectiveCoverage,
  getLinkedObjectivesForEvidence,
  setSufficiency,
} from '../services/objectivecoverage.service';

export const objectiveCoverageRouter = Router({ mergeParams: true });
objectiveCoverageRouter.use(authenticateSession);

// GET /evidence/:evidence_id/objectives — get objectives linked to this evidence item
// Full path: GET /api/engagements/:id/evidence/:evidence_id/objectives
// Role access: all authenticated roles
objectiveCoverageRouter.get(
  '/evidence/:evidence_id/objectives',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const objectives = await getLinkedObjectivesForEvidence(
        req.params.id,
        req.params.evidence_id
      );
      res.json({ objectives });
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Get linked objectives error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /evidence/:evidence_id/objectives — link evidence to one or more objectives
// Full path (mounted at /:id): POST /api/engagements/:id/evidence/:evidence_id/objectives
// Role access: AN, EM, AD (analysts and managers can link)
objectiveCoverageRouter.post(
  '/evidence/:evidence_id/objectives',
  requireRole('AN', 'EM', 'AD'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { objective_ids } = req.body;
      if (!Array.isArray(objective_ids) || objective_ids.length === 0) {
        res.status(422).json({ error: 'objective_ids must be a non-empty array.' });
        return;
      }
      const result = await linkEvidenceToObjectives(
        req.params.id,
        req.params.evidence_id,
        objective_ids,
        req.user!.id
      );
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Link objectives error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /evidence/:evidence_id/objectives/:objective_id — unlink evidence from an objective
// Full path: DELETE /api/engagements/:id/evidence/:evidence_id/objectives/:objective_id
// Role access: AN, EM, AD
objectiveCoverageRouter.delete(
  '/evidence/:evidence_id/objectives/:objective_id',
  requireRole('AN', 'EM', 'AD'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await unlinkEvidenceFromObjective(
        req.params.id,
        req.params.evidence_id,
        req.params.objective_id
      );
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Unlink objective error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /objectives/coverage — objective coverage summary (gap view data)
// Full path: GET /api/engagements/:id/objectives/coverage
// Role access: all authenticated roles
objectiveCoverageRouter.get(
  '/objectives/coverage',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await getObjectiveCoverage(req.params.id);
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Get coverage error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /objectives/sufficiency — set sufficiency for multiple objectives
// Full path: PUT /api/engagements/:id/objectives/sufficiency
// Role access: QA, EM, AD only (per US-10.2)
objectiveCoverageRouter.put(
  '/objectives/sufficiency',
  requireRole('QA', 'EM', 'AD'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updates = req.body; // array of { objective_id, sufficiency }
      if (!Array.isArray(updates) || updates.length === 0) {
        res.status(422).json({
          error: 'Body must be a non-empty array of { objective_id, sufficiency } objects.',
        });
        return;
      }
      const result = await setSufficiency(req.params.id, updates, req.user!.id);
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Set sufficiency error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
