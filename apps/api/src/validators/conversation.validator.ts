import { z } from 'zod';

export const createConversationSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  apiKey: z.string().uuid(),
});

export type createConversationBody = z.infer<typeof createConversationSchema>;
