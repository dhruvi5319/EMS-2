import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        display_name: string;
        roles: string[];
      };
      /** Session hash extracted from JWT payload — set by requireAuth middleware */
      sessionHash?: string;
    }
  }
}
