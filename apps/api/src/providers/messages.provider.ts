import { prisma } from '../database';

export const newMessage = prisma.message.create;
export const getMessage = prisma.message.findUnique;
export const getMessages = prisma.message.findMany;
export const updateMessage = prisma.message.update;
export const deleteMessage = prisma.message.delete;
