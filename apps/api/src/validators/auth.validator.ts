import { z } from 'zod';

export const registerInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(2).max(100),
});

export const loginInputSchema = z.object({
  username: z.string(),
  password: z.string().min(8).max(100),
});
export const updateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
export const updateAccountSchema = z.object({
  email: z.string().email(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
