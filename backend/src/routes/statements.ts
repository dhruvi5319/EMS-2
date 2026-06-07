import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  listStatements,
  createStatement,
  updateStatement,
  deleteStatement,
} from '../services/statements.service';

export const statementsRouter = Router({ mergeParams: true });
statementsRouter.use(authenticateSession);

// GET /api/engagements/:id/statements — all authenticated roles
statementsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { ref_status, assigned_to, limit, offset } = req.query as Record<string, string>;
    const result = await listStatements(req.params.id, {
      ref_status: ref_status || undefined,
      assigned_to: assigned_to || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
    res.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('List statements error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/engagements/:id/statements — AN, EM, AD
statementsRouter.post(
  '/',
  requireRole('AN', 'EM', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { statement_text, evidence_ids } = req.body;
      const statement = await createStatement(
        req.params.id,
        { statement_text, evidence_ids },
        req.user!.id
      );
      res.status(201).json({ statement });
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Create statement error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PATCH /api/engagements/:id/statements/:statement_id
// AN, EM, IR, AD — IR for ref_status updates; AN for text/evidence edits; EM/AD for waiver
statementsRouter.patch(
  '/:statement_id',
  requireRole('AN', 'EM', 'IR', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const {
        statement_text,
        evidence_ids,
        ref_status,
        discrepancy_notes,
        assigned_to,
      } = req.body;
      const statement = await updateStatement(
        req.params.id,
        req.params.statement_id,
        {
          statement_text,
          evidence_ids,
          ref_status,
          discrepancy_notes,
          assigned_to,
        },
        req.user!.roles,
        req.user!.id
      );
      res.json({ statement });
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Update statement error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/engagements/:id/statements/:statement_id — AN, EM, AD
statementsRouter.delete(
  '/:statement_id',
  requireRole('AN', 'EM', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const result = await deleteStatement(req.params.id, req.params.statement_id);
      res.json(result);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status && error.status < 500) {
        res.status(error.status).json({ error: error.message });
        return;
      }
      console.error('Delete statement error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
