import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { recordA1Decision } from '../services/gate.service';

export const gateRouter = Router();

// All gate routes require authentication
gateRouter.use(authenticateSession);

// POST /api/requests/:id/gate/a1
// Only AL and AD can record A1 decisions
gateRouter.post(
  '/:id/gate/a1',
  requireRole('AL', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { decision, risk_level, rationale } = req.body;
      const result = await recordA1Decision(
        req.params.id,
        { decision, risk_level, rationale },
        req.user!.id,
        req.user!.roles
      );
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string; fields?: string[] };
      if (error.status === 422) {
        res.status(422).json({ error: error.message, fields: error.fields });
        return;
      }
      if (error.status === 409) {
        res.status(409).json({ error: error.message });
        return;
      }
      if (error.status === 404) {
        res.status(404).json({ error: error.message });
        return;
      }
      console.error('Gate A1 decision error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
