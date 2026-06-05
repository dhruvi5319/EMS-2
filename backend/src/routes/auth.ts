import { Router, Request, Response } from 'express';
import { login, logout } from '../services/auth.service';
import { authenticateSession, SESSION_COOKIE } from '../middleware/auth';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const result = await login(username, password);

    // Set httpOnly session cookie
    res.cookie(SESSION_COOKIE, result.sessionHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: result.expiresAt,
      path: '/',
    });

    res.json({
      user: result.user,
    });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string; code?: string };
    if (error.status === 423) {
      res.status(423).json({ error: error.message, code: error.code });
      return;
    }
    if (error.status === 401) {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', authenticateSession, async (req: Request, res: Response) => {
  try {
    const sessionHash = req.cookies[SESSION_COOKIE];
    await logout(sessionHash);
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
authRouter.get('/me', authenticateSession, (req: Request, res: Response) => {
  res.json({ user: req.user });
});
