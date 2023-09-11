import { ZodError } from 'zod';

export const parseZodError = (error: ZodError) => {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    return { path, message: err.message };
  });
};
