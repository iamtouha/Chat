import {
  newMessage,
  getMessages,
  updateMessage,
} from '../providers/messages.provider.js';
import { messageInputSchema } from '../validators/message.validator.js';
import { parseZodError } from '../lib/helpers.js';
import type { Request, Response } from 'express';

export const createMessage = async (req: Request, res: Response) => {
  try {
    const result = messageInputSchema.safeParse(req.body);
    if (!result.success)
      return res.status(400).json({
        status: 'error',
        errors: parseZodError(result.error),
        message: 'Invalid message data',
      });
    const { fileId, ...data } = result.data;
    const message = await newMessage({
      data: { ...data, file: fileId ? { connect: { id: fileId } } : undefined },
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
export const messageSeen = async (req: Request, res: Response) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message id',
      });

    const message = await updateMessage({
      where: { id: +req.params.id },
      data: { seen: true },
    });
    return res.status(200).json({
      status: 'success',
      result: message,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the message',
    });
  }
};
