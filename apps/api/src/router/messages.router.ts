import { Router } from 'express';
import {
  createMessage,
  fetchMessages,
  messageSeen,
} from '../controllers/messages.controller.js';

const messagesRouter: Router = Router();

messagesRouter.post('/', createMessage);
messagesRouter.get('/', fetchMessages);
messagesRouter.put('/:id/seen', messageSeen);

export default messagesRouter;
