import { Router } from 'express';
import authRouter from './auth.router';
import usersRouter from './users.router';
import conversationRouter from './conversations.router';
import messagesRouter from './messages.router';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', isAuthenticated, usersRouter);
router.use('/v1/conversations', conversationRouter);
router.use('/v1/messages', messagesRouter);

export default router;
