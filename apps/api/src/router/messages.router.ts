import { Router } from 'express';
import {
  createMessage,
  fetchMessages,
} from '../controllers/messages.controller';

const messagesRouter = Router();

messagesRouter.post('/', createMessage);
messagesRouter.get('/', fetchMessages);

export default messagesRouter;
