import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { recordA1Decision } from '../services/gate.service';
import { db } from '../db';

export const gateRouter = Router();

// All gate routes require authentication
gateRouter.use(authenticateSession);

// GET /api/requests/:id/gate/decision
// Returns the gate A1 decision for a request (approved or declined)
gateRouter.get(
  '/:id/gate/decision',
  async (req: Request, res: Response) => {
    try {
      const requestId = req.params.id;

      // Check if request has an engagement (approved path)
      const engagement = await db('engagements').where({ request_id: requestId }).first();

      if (engagement) {
        // Approved path: query gate_decisions joined with users
        const gateDecisionRow = await db('gate_decisions as gd')
          .join('users as u', 'gd.decided_by', 'u.id')
          .where({ 'gd.engagement_id': engagement.id, 'gd.gate_type': 'A1' })
          .select('gd.*', 'u.full_name as decided_by_name')
          .first();

        if (gateDecisionRow) {
          // Parse risk_level from comment column (stored as "risk_level:low" etc.)
          const risk_level = gateDecisionRow.comment
            ? (gateDecisionRow.comment as string).split(':')[1] ?? null
            : null;

          return res.json({
            gate_decision: {
              id: gateDecisionRow.id,
              decision: 'approved' as const,
              risk_level,
              rationale: gateDecisionRow.rationale,
              decided_by_name: gateDecisionRow.decided_by_name,
              decided_at: gateDecisionRow.decided_at instanceof Date
                ? gateDecisionRow.decided_at.toISOString()
                : gateDecisionRow.decided_at,
              engagement_id: engagement.id,
            },
          });
        }
      }

      // Declined path (no engagement): query audit_events for GATE_A1_DECLINED
      const auditEvent = await db('audit_events as ae')
        .join('users as u', 'ae.actor_id', 'u.id')
        .where({ 'ae.request_id': requestId, 'ae.action': 'GATE_A1_DECLINED' })
        .select('ae.*', 'u.full_name as decided_by_name')
        .orderBy('ae.created_at', 'desc')
        .first();

      if (auditEvent) {
        let rationale: string = '';
        try {
          const afterState = typeof auditEvent.after_state === 'string'
            ? JSON.parse(auditEvent.after_state)
            : auditEvent.after_state;
          rationale = afterState?.rationale ?? '';
        } catch {
          rationale = '';
        }

        return res.json({
          gate_decision: {
            id: auditEvent.id,
            decision: 'declined' as const,
            risk_level: null,
            rationale,
            decided_by_name: auditEvent.decided_by_name,
            decided_at: auditEvent.created_at instanceof Date
              ? auditEvent.created_at.toISOString()
              : auditEvent.created_at,
            engagement_id: null,
          },
        });
      }

      // Neither found
      return res.status(404).json({ error: 'No gate decision found for this request' });
    } catch (err) {
      console.error('Gate decision fetch error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

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
