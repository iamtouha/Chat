import { Router } from 'express';
import { createConversation } from '../controllers/conversations.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const conversationRouter = Router();

conversationRouter.post('/', createConversation);

export default conversationRouter;
