import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { me } from '../modules/auth/auth.service';

/** Cookie name (kept for backward-compat during migration) */
export const SESSION_COOKIE = 'ems_session';

interface JwtPayload {
  sessionHash: string;
  sub: string;
}

/**
 * requireAuth — extract Bearer token from Authorization header,
 * verify JWT signature, look up session hash in DB, attach req.user.
 *
 * Returns 401 if token is missing, invalid, expired, or session is revoked.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.slice(7); // strip "Bearer "

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const { sessionHash } = payload;
  if (!sessionHash) {
    res.status(401).json({ error: 'Malformed token' });
    return;
  }

  // Attach sessionHash to request so logout can revoke it
  (req as Request & { sessionHash?: string }).sessionHash = sessionHash;

  const user = await me(sessionHash);

  if (!user) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  req.user = user;
  next();
}

/**
 * authenticateSession — legacy alias kept so existing route files compile
 * without changes until they are migrated to use requireAuth directly.
 * Both names point to the same Bearer-token implementation.
 */
export const authenticateSession = requireAuth;
