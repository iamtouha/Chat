import { Request, Response } from 'express';
import { newMessage, getMessages } from '../providers/messages.provider';
import { messageInputSchema } from '../validators/message.validator';
import { parseZodError } from '../lib/helpers';
import { CONTENT_TYPE } from '@prisma/client';

export const createMessage = async (req: Request, res: Response) => {
  try {
    const result = messageInputSchema.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        errors: parseZodError(result.error),
        message: 'Invalid message data',
      });
    const message = await newMessage({
      data: { ...result.data, contentType: CONTENT_TYPE.TEXT },
    });
    return res.status(201).json({
      status: 'success',
      result: message,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the message',
    });
  }
};

export const fetchMessages = async (req: Request, res: Response) => {
  if (!req.query.convId)
    return res.status(400).json({
      status: 'error',
      message: 'Invalid conversation id',
    });
  try {
    const messages = await getMessages({
      where: { conversationId: req.query.convId as string },
    });
    return res.status(200).json({
      status: 'success',
      result: messages,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the messages',
    });
  }
};
