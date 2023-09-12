import { Router } from 'express';
import authRouter from './auth';
import usersRouter from './users';
import { isAdmin, isAuthenticated } from '../middlewares/auth';

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', isAuthenticated, usersRouter);

export default router;
