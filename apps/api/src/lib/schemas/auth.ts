import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  username: z.string().min(2).max(100),
});

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
