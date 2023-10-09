import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';
import authRouter from './auth.router';
import usersRouter from './users.router';
import conversationRouter from './conversations.router';
import messagesRouter from './messages.router';
import filesRouter from './files.router';

const router: Router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', isAuthenticated, usersRouter);
router.use('/v1/conversations', conversationRouter);
router.use('/v1/messages', messagesRouter);
router.use('/v1/files', filesRouter);

export default router;
