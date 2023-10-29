import { Router } from 'express';
import {
  createConversation,
  fetchConversation,
  fetchConversations,
  starConversation,
  archiveConversation,
} from '../controllers/conversations.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const conversationRouter: Router = Router();

conversationRouter.get('/', isAuthenticated, fetchConversations);
conversationRouter.post('/', createConversation);
conversationRouter.get('/:id', fetchConversation);
conversationRouter.post('/:id/star', starConversation);
conversationRouter.post('/:id/archive', archiveConversation);

export default conversationRouter;
