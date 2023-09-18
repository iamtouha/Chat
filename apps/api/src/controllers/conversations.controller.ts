import { Request, Response } from 'express';
import {
  getConversation,
  newConversation,
  getConversations,
} from '../providers/conversations.provider';
import { createConversationSchema } from '../validators/conversation.validator';
import { parseZodError } from '../lib/helpers';

export const createConversation = async (req: Request, res: Response) => {
  const result = createConversationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload',
      result: parseZodError(result.error),
    });
  }

  const conversation = await newConversation({
    data: {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      userId: result.data.clientId,
      lastActive: new Date(),
    },
  });
  return res.status(200).json({
    status: 'success',
    message: 'Conversation created successfully',
    result: { ...conversation, messages: [] },
  });
};
export const fetchConversations = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  const conversations = await getConversations({
    where: { userId: req.user?.id },
    orderBy: { createdAt: 'desc' },
    include: {
      messages: {
        select: {
          type: true,
          content: true,
          contentType: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
  return res.status(200).json({
    status: 'success',
    message: 'Conversations fetched successfully',
    result: conversations,
  });
};

export const fetchConversation = async (req: Request, res: Response) => {
  const conversation = await getConversation({
    where: { id: req.params.id },
    include: {
      messages: {
        select: {
          type: true,
          content: true,
          contentType: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!conversation) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Conversation not found' });
  }
  return res.status(200).json({
    status: 'success',
    message: 'Conversation fetched successfully',
    result: conversation,
  });
};
