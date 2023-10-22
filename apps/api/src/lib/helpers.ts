import { Prisma } from '@prisma/client';
import { LuciaError } from 'lucia';
import { ZodError } from 'zod';

export const parseZodError = (error: ZodError) => {
  return error.errors.map((err) => {
    const path = err.path.join('.');
    return { path, message: err.message };
  });
};

export const getExceptionType = (error: unknown) => {
  const UnknownException = {
    type: 'UnknownException',
    status: 500,
    message: 'An unknown exception occurred',
  };

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const target = error.meta?.target as string[] | undefined;
    switch (error.code) {
      case 'P2002':
        return {
          type: 'UniqueConstraintViolationException',
          status: 400,
          message: `user with given ${target?.join?.(', ')} already exists.`,
        };

      default:
        return UnknownException;
    }
  }
  if (error instanceof LuciaError) {
    switch (error.message) {
      case 'AUTH_INVALID_KEY_ID':
      case 'AUTH_INVALID_PASSWORD':
        return {
          type: 'InvalidCredentialException',
          status: 400,
          message: 'Username or password is incorrect',
        };
      default:
        return UnknownException;
    }
  }

  return UnknownException;
};
