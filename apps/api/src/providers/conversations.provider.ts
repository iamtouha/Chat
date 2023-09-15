import { prisma } from '../database';

export const newConversation = prisma.conversation.create;
export const getConversation = prisma.conversation.findUnique;
export const getConversations = prisma.conversation.findMany;
export const updateConversation = prisma.conversation.update;
export const deleteConversation = prisma.conversation.delete;
