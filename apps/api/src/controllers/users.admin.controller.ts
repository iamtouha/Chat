import type { Request, Response } from 'express';
import {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../providers/users.provider.js';

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
  const user = await deleteUser({ where: { id: req.params.id } });
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
  const users = await getUsers({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      active: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return res.status(200).json({
    status: 'success',
    message: 'Users retrieved successfully',
    result: users,
  });
};

export const getUserFromId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await getUser({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      active: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
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
    message: 'User retrieved successfully',
    result: user,
  });
};
