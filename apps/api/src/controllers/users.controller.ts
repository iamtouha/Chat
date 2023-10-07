import type { Request, Response } from 'express';
import { getUser, updateUser } from '../providers/users.provider';

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({
      status: 'error',
      message: 'Unauthorized',
    });
  if (req.query.admin === 'true' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: "you're not authrized to perform this action",
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'User profile retrieved successfully',
    result: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      lastLogin: req.user.lastLogin,
      role: req.query.admin === 'true' ? req.user.role : undefined,
    },
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
  await updateUser({ where: { id: req.user.id }, data: { role: 'ADMIN' } });
  return res.status(200).json({
    status: 'success',
    message: 'User is now an admin',
  });
};
