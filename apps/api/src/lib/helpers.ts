import crypto from 'crypto';
import { ZodError } from 'zod';

export const parseZodError = (error: ZodError) => {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    return { path, message: err.message };
  });
};

export const random = () => crypto.randomBytes(128).toString('base64');
export const hashPassword = (salt: string, password: string) =>
  crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(process.env.TOKEN_SECRET!)
    .digest('hex');
