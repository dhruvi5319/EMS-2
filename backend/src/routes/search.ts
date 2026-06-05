import { Router, Request, Response } from 'express';
import { authenticateSession } from '../middleware/auth';
import { searchEngagements } from '../services/search.service';

export const searchRouter = Router();

// GET /api/search?q={query}&limit=10
searchRouter.get('/', authenticateSession, async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) ?? '';
    const limit = Math.min(parseInt((req.query.limit as string) ?? '10', 10) || 10, 50);

    if (q.length < 2) {
      res.status(400).json({ error: 'Query must be at least 2 characters' });
      return;
    }

    const results = await searchEngagements(
      q,
      req.user!.id,
      req.user!.roles,
      limit
    );

    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
