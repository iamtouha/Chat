import { Router } from 'express';
import {
  createMessage,
  fetchMessages,
} from '../controllers/messages.controller';

const messagesRouter: Router = Router();

messagesRouter.post('/', createMessage);
messagesRouter.get('/', fetchMessages);

export default messagesRouter;
