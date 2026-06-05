import { Router } from 'express';
import { authRouter } from './auth';

export const apiRouter = Router();

// Public routes (no auth)
apiRouter.use('/auth', authRouter);

// All other /api routes require authentication
// Future route modules are registered here with authenticateSession applied
// Example for Phase 2+:
// apiRouter.use('/users', authenticateSession, usersRouter);
// apiRouter.use('/engagements', authenticateSession, engagementsRouter);
