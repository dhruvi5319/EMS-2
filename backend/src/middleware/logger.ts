import { Request, Response, NextFunction } from 'express';

/**
 * Simple HTTP request logger middleware.
 * Logs method, URL, status code, and response time.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    console.log(`[${level}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
}
