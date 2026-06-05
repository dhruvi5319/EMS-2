import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { getAuditEvents } from '../services/audit.service';

export const auditRouter = Router();

// GET /api/engagements/:id/audit
auditRouter.get('/:id/audit', authenticateSession, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      action_type,
      date_from,
      date_to,
      limit,
      offset,
    } = req.query as Record<string, string>;

    const result = await getAuditEvents(id, {
      action_type: action_type || undefined,
      date_from: date_from || undefined,
      date_to: date_to || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    res.json(result);
  } catch (err) {
    console.error('Audit trail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
