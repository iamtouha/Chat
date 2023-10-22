import type { Request, Response } from 'express';
import { getUser } from '../providers/users.provider.js';
import { updateUserSchema } from '../validators/auth.validator.js';
import { getExceptionType, parseZodError } from '../lib/helpers.js';
import { auth } from '../lib/lucia.js';

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({
      status: 'error',
      message: 'Unauthorized',
    });
  const user = await getUser({
    where: { id: req.user.id },
    select: {
      id: true,
      clientId: true,
      username: true,
      email: true,
      active: true,
      role: true,
      lastLogin: true,
      createdAt: true,
    },
  });
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'User profile retrieved successfully',
    result: user,
  });
};

export const makeInitialAdmin = async (req: Request, res: Response) => {
  if (!req.user) return;
  const existingAdmin = await getUser({ where: { role: 'ADMIN' } });
  if (existingAdmin) {
    return res.status(400).json({
      status: 'error',
      message: 'Admin already exists',
    });
  }
  await auth.updateUserAttributes(req.user.userId, { role: 'ADMIN' });
  await auth.invalidateAllUserSessions(req.user.userId);
  const session = await auth.createSession({
    userId: req.user.userId,
    attributes: {},
  });
  const authRequest = auth.handleRequest(req, res);
  authRequest.setSession(session);

  return res.status(200).json({
    status: 'success',
    message: 'User is now an admin',
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload',
      result: parseZodError(result.error),
    });
  }
  if (!req.user) return;

  try {
    if (result.data.password) {
      await auth.updateKeyPassword(
        'username',
        req.user.username,
        result.data.password,
      );
      await auth.invalidateAllUserSessions(req.user.userId);
      const session = await auth.createSession({
        userId: req.user.userId,
        attributes: {},
      });
      const authRequest = auth.handleRequest(req, res);
      authRequest.setSession(session);
    }
    if (result.data.email) {
      await auth.updateUserAttributes(req.user.userId, {
        email: result.data.email,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
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
