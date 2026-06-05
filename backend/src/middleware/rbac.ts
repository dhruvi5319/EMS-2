import { Request, Response, NextFunction, RequestHandler } from 'express';

export function requireRole(...roles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const hasRole = roles.some((role) => req.user!.roles.includes(role));
    if (!hasRole) {
      res.status(403).json({ error: 'Insufficient permissions', required: roles });
      return;
    }

    next();
  };
}
