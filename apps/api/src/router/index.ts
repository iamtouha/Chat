import { Router } from 'express';
import authRouter from './auth.router';
import usersRouter from './users.router';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', isAuthenticated, usersRouter);

export default router;
