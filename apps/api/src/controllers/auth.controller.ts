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

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginInputSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid request payload',
        result: parseZodError(result.error),
      });
    }
    const { username, password } = result.data;

    const key = await auth.useKey('username', username.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);

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
  } catch (error) {
    const { type, status, message } = getExceptionType(error);

    return res.status(status).json({
      status: 'error',
      message,
      type,
    });
  }
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
      key: {
        providerId: 'username',
        providerUserId: username.toLowerCase(),
        password,
      },
      attributes: {
        email,
        username: username.toLowerCase(),
        active: false,
        role: 'USER',
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      result: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    const { type, status, message } = getExceptionType(error);

    return res.status(status).json({
      status: 'error',
      message,
      type,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();
  if (!session) {
    return res.sendStatus(401);
  }
  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);

  return res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
};
