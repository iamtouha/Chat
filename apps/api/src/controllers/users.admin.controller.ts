import type { Request, Response } from 'express';
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../providers/users.provider.js';
import { auth } from '../lib/lucia.js';
import { updateUserSchema } from '../validators/auth.validator.js';
import { getExceptionType, parseZodError } from '../lib/helpers.js';

export const makeAdmin = async (req: Request, res: Response) => {
  if (!req.user) return;
  const userId = req.params.id;
  const user = await updateUser({
    where: { id: userId },
    data: { role: 'ADMIN' },
    select: { id: true, username: true, email: true, role: true },
  });
  return res.status(200).json({
    status: 'success',
    message: 'User is now an admin',
    result: user,
  });
};

export const removeAdmin = async (req: Request, res: Response) => {
  if (!req.user) return;
  if (req.user.id === req.params.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot remove your own admin privileges',
    });
  }
  const userId = req.params.id;
  const user = await updateUser({
    where: { id: userId },
    data: { role: 'USER' },
    select: { id: true, username: true, email: true, role: true },
  });
  return res.status(200).json({
    status: 'success',
    message: 'User is now an admin',
    result: user,
  });
};

export const deactivateUser = async (req: Request, res: Response) => {
  if (!req.user) return;
  const userId = req.params.id;
  if (req.user.id === userId) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot deactivate your own account',
    });
  }
  const user = await updateUser({
    where: { id: userId },
    data: { active: false },
    select: { id: true, username: true, email: true, active: true },
  });
  return res.status(200).json({
    status: 'success',
    message: 'User deactivated successfully',
    result: user,
  });
};

export const activateUser = async (req: Request, res: Response) => {
  if (!req.user) return;
  const userId = req.params.id;
  const user = await updateUser({
    where: { id: userId },
    data: { active: true },
    select: { id: true, username: true, email: true, active: true },
  });
  return res.status(200).json({
    status: 'success',
    message: 'User activated successfully',
    result: user,
  });
};

export const removeUser = async (req: Request, res: Response) => {
  if (!req.user) return;
  if (req.user.id === req.params.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot remove your own account',
    });
  }
  const user = await getUser({ where: { id: req.params.id } });
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  if (user?.role === 'ADMIN') {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot remove an admin account',
    });
  }
  await auth.deleteUser(user.id);
  return res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
    result: user,
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: "you're not authrized to perform this action",
    });
  }
  const users = await getUsers({});
  return res.status(200).json({
    status: 'success',
    message: 'Users retrieved successfully',
    result: users,
  });
};

export const getUserFromId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUser({ where: { id } });
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'User retrieved successfully',
    result: user,
  });
};

export const updateUserFromId = async (req: Request, res: Response) => {
  if (!req.params.id) return;
  if (req.user?.id === req.params.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot update your own account',
    });
  }
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload',
      result: parseZodError(result.error),
    });
  }

  try {
    const existingUser = await auth.getUser(req.params.id);
    if (result.data.password) {
      await auth.updateKeyPassword(
        'username',
        existingUser.username,
        result.data.password,
      );
      await auth.invalidateAllUserSessions(existingUser.userId);
    }
    if (result.data.email) {
      await auth.updateUserAttributes(existingUser.id, {
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
