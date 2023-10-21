import type { Request, Response } from 'express';
import { getUser, updateUser } from '../providers/users.provider.js';
import { updateUserSchema } from '../validators/auth.validator.js';
import { parseZodError } from '../lib/helpers.js';

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({
      status: 'error',
      message: 'Unauthorized',
    });

  return res.status(200).json({
    status: 'success',
    message: 'User profile retrieved successfully',
    result: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      lastLogin: req.user.lastLogin,
      active: req.user.active,
      role: req.user.role,
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

export const updateUserData = async (req: Request, res: Response) => {
  const result = updateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid request payload',
      result: parseZodError(result.error),
    });
  }
  if (req.user?.role !== 'ADMIN' && req.user?.id !== req.params.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }
  const existingUser = await getUser({
    where: {
      OR: [{ email: result.data.email }, { username: result.data.username }],
      NOT: { id: req.params.id },
    },
    select: { username: true, id: true },
  });
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message:
        existingUser.username === result.data.username
          ? 'Cannot use this username'
          : 'Cannot use this email',
    });
  }

  let salt: string | undefined;
  let hashedPassword: string | undefined;

  if (result.data.password) {
  }
  // const user = await updateUser({
  //   where: { id: req.params.id },
  //   data: result.data.password
  //     ? {
  //         username: result.data.username,
  //         email: result.data.email,
  //         salt,
  //         password: hashedPassword,
  //         sessionToken: null,
  //       }
  //     : {
  //         username: result.data.username,
  //         email: result.data.email,
  //       },
  // });

  return res.status(200).json({
    status: 'success',
    message: 'User profile updated successfully',
    result: {
      // id: user.id,
      // username: user.username,
      // email: user.email,
      // lastLogin: user.lastLogin,
      // role: user.role,
    },
  });
};
