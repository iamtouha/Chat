import { z } from 'zod';

export const messageInputSchema = z.object({
  content: z.string(),
  type: z.enum(['INBOUND', 'OUTBOUND']),
  conversationId: z.string(),
});

export type MessageInput = z.infer<typeof messageInputSchema>;
