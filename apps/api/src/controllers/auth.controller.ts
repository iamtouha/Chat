import type { Request, Response } from 'express';
import {
  loginInputSchema,
  registerInputSchema,
} from '../validators/auth.validator.js';
import {
  createUser,
  getUser,
  updateUser,
} from '../providers/users.provider.js';
import { parseZodError, getExceptionType } from '../lib/helpers.js';
import { auth } from '../lib/lucia.js';

const COOKIE_NAME = 'AUTH_TOKEN';

export const login = async (req: Request, res: Response) => {
  const result = loginInputSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload',
      result: parseZodError(result.error),
    });
  }
  const { username, password } = result.data;

  const session = auth.useKey('username', username.toLowerCase(), password);

  const updatedUser = await updateUser({
    where: { username: username.toLowerCase() },
    data: { lastLogin: new Date() },
    select: { id: true, username: true, email: true },
  });

  return res.status(200).json({
    status: 'success',
    message: 'User logged in successfully',
    result: updatedUser,
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = registerInputSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request payload',
        result: parseZodError(result.error),
      });
    }
    const { email, password, username } = result.data;

    const user = await auth.createUser({
      attributes: { email, username, active: false, role: 'USER' },
      key: {
        providerId: 'username',
        providerUserId: username.toLowerCase(),
        password,
      },
    });
    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      result: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    const { type, status, message } = getExceptionType(error);

    return res.status(status).json({
      status: 'error',
      message,
      type,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({
    status: 'success',
    message: 'User logged out successfully',
  });
};
