import { Router } from 'express';
import {
  createConversation,
  fetchConversation,
  fetchConversations,
} from '../controllers/conversations.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const conversationRouter: Router = Router();

conversationRouter.get('/', isAuthenticated, fetchConversations);
conversationRouter.post('/', createConversation);
conversationRouter.get('/:id', fetchConversation);

export default conversationRouter;
