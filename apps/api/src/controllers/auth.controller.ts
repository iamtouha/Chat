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
import { hashPassword, random, parseZodError } from '../lib/helpers.js';

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
  const { email, password } = result.data;
  const user = await getUser({ where: { email } });
  if (!user) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }
  const expectedHash = hashPassword(user.salt, password);
  if (expectedHash !== user.password) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }

  const sessionToken = hashPassword(random(), user.id);
  const updatedUser = await updateUser({
    where: { email },
    data: {
      lastLogin: new Date(),
      sessionToken,
    },
    select: { id: true, username: true, email: true, sessionToken: true },
  });
  res.cookie(COOKIE_NAME, sessionToken, {
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
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
    const existingUser = await getUser({
      where: { OR: [{ email }, { username }] },
      select: { username: true },
    });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message:
          existingUser.username === username
            ? 'Username is not available.'
            : 'User with this email already exists.',
      });
    }
    const salt = random();
    const hashedPassword = hashPassword(salt, password);
    const user = await createUser({
      data: { username, email, password: hashedPassword, salt },
      select: { id: true, username: true, email: true },
    });
    return res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      result: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME);
  return res.json({
    status: 'success',
    message: 'User logged out successfully',
  });
};
