import { Router } from 'express';
import { authRouter } from './auth';
import { searchRouter } from './search';
import { usersRouter } from './users';
import { auditRouter } from './audit';

export const apiRouter = Router();

// Public routes
apiRouter.use('/auth', authRouter);

// Authenticated routes
apiRouter.use('/search', searchRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/engagements', auditRouter);
