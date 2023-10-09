import { z } from 'zod';

export const messageInputSchema = z.object({
  content: z.string(),
  type: z.enum(['INBOUND', 'OUTBOUND']),
  conversationId: z.string(),
  contentType: z.enum(['TEXT', 'IMAGE', 'FILE', 'VIDEO', 'AUDIO']),
  fileId: z.number().int().optional(),
});

export type MessageInput = z.infer<typeof messageInputSchema>;
