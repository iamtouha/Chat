import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware.js';
import authRouter from './auth.router.js';
import usersRouter from './users.router.js';
import conversationRouter from './conversations.router.js';
import messagesRouter from './messages.router.js';
import filesRouter from './files.router.js';

const router: Router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', isAuthenticated, usersRouter);
router.use('/v1/conversations', conversationRouter);
router.use('/v1/messages', messagesRouter);
router.use('/v1/files', filesRouter);

export default router;
