import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  listFindings,
  createFinding,
  updateFinding,
  deleteFinding,
} from '../services/findings.service';

export const findingsRouter = Router({ mergeParams: true });
findingsRouter.use(authenticateSession);

// GET /api/engagements/:id/findings — all authenticated roles
findingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const viewerRoles = req.user!.roles;
    const result = await listFindings(req.params.id, viewerRoles);
    res.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('List findings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/engagements/:id/findings — AN, AD only
findingsRouter.post('/', requireRole('AN', 'AD'), async (req: Request, res: Response) => {
  try {
    const { finding_text, evidence_ids } = req.body;
    const finding = await createFinding(
      req.params.id,
      { finding_text, evidence_ids },
      req.user!.id
    );
    res.status(201).json({ finding });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Create finding error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/engagements/:id/findings/:finding_id — AN, AD only
findingsRouter.patch('/:finding_id', requireRole('AN', 'AD'), async (req: Request, res: Response) => {
  try {
    const { finding_text, evidence_ids, status } = req.body;
    const finding = await updateFinding(
      req.params.id,
      req.params.finding_id,
      { finding_text, evidence_ids, status },
      req.user!.id
    );
    res.json({ finding });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Update finding error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/engagements/:id/findings/:finding_id — AN, AD only
findingsRouter.delete('/:finding_id', requireRole('AN', 'AD'), async (req: Request, res: Response) => {
  try {
    const result = await deleteFinding(req.params.id, req.params.finding_id);
    res.json(result);
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string };
    if (error.status && error.status < 500) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    console.error('Delete finding error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
