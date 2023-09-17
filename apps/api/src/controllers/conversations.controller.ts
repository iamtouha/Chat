import { Request, Response } from 'express';
import { newConversation } from '../providers/conversations.provider';
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
    select: { id: true, user: { select: { username: true } } },
  });
  return res.status(200).json({
    status: 'success',
    message: 'Conversation created successfully',
    result: { conversationId: conversation.id },
  });
};
