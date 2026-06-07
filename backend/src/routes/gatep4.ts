import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { checkP4Prerequisites, recordP4Decision } from '../services/gatep4.service';

// mergeParams: true so :id (engagementId) from the parent router is accessible
export const gateP4Router = Router({ mergeParams: true });

gateP4Router.use(authenticateSession);

// ─── Helper ─────────────────────────────────────────────────────────────────

function handleError(err: unknown, res: Response, context: string): void {
  const error = err as { status?: number; message?: string; blockers?: unknown };
  if (error.status && error.status < 500) {
    res.status(error.status).json({ error: error.message, blockers: error.blockers });
    return;
  }
  console.error(`Gate P4 error in ${context}:`, err);
  res.status(500).json({ error: 'Internal server error' });
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/engagements/:id/gate/p4/prerequisites — all authenticated roles
gateP4Router.get('/prerequisites', async (req: Request, res: Response) => {
  try {
    const result = await checkP4Prerequisites(req.params.id);
    res.json(result);
  } catch (err) {
    handleError(err, res, 'GET /prerequisites');
  }
});

// POST /api/engagements/:id/gate/p4 — PC, EM, AD only
gateP4Router.post(
  '/',
  requireRole('PC', 'EM', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { decision, outcome, comment } = req.body as {
        decision?: string;
        outcome?: string;
        comment?: string;
      };

      // Validate decision
      if (decision !== 'approved') {
        res.status(422).json({ error: 'Decision must be "approved".' });
        return;
      }

      // Validate outcome
      const validOutcomes = ['ready_for_issuance', 'closed'];
      if (!outcome || !validOutcomes.includes(outcome)) {
        res.status(422).json({
          error: 'Outcome must be "ready_for_issuance" or "closed".',
        });
        return;
      }

      // PC role restriction: can only set ready_for_issuance
      const userRoles: string[] = req.user!.roles;
      const isPC = userRoles.includes('PC') && !userRoles.includes('EM') && !userRoles.includes('AD');
      if (isPC && outcome === 'closed') {
        res.status(403).json({
          error: 'Publishing Coordinator can only set engagement to Ready for Issuance.',
        });
        return;
      }

      const gateDecision = await recordP4Decision(
        req.params.id,
        {
          decision: 'approved',
          outcome: outcome as 'ready_for_issuance' | 'closed',
          comment,
        },
        req.user!.id
      );

      res.json({ gate_decision: gateDecision });
    } catch (err) {
      handleError(err, res, 'POST /');
    }
  }
);
