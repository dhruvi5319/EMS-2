import { Router, Request, Response } from 'express';
import { login, logout, me } from './auth.service';
import { requireAuth } from '../../middleware/auth';

export const authControllerRouter = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: 200 { token, user } | 401 invalid creds | 423 account locked
 */
authControllerRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const ipAddress = req.ip || req.socket?.remoteAddress;
    const result = await login(email, password, ipAddress);

    res.json({
      token: result.token,
      user: result.user,
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string; code?: string };
    if (error.status === 423) {
      res.status(423).json({ error: error.message, code: error.code });
      return;
    }
    if (error.status === 401) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/logout
 * Requires: Authorization: Bearer <token>
 * Returns: 204
 */
authControllerRouter.post('/logout', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionHash = (req as Request & { sessionHash?: string }).sessionHash;
    if (sessionHash) {
      await logout(sessionHash);
    }
    res.status(204).end();
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Requires: Authorization: Bearer <token>
 * Returns: 200 { user } | 401
 */
authControllerRouter.get('/me', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
