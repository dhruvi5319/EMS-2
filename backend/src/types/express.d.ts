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
    }
  }
}
