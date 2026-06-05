import { Request, Response, NextFunction } from 'express';
import { validateSession } from '../services/auth.service';

export const SESSION_COOKIE = 'ems_session';

export async function authenticateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  const sessionHash = req.cookies[SESSION_COOKIE];

  if (!sessionHash) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const user = await validateSession(sessionHash);

  if (!user) {
    res.clearCookie(SESSION_COOKIE);
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  req.user = user;
  next();
}
