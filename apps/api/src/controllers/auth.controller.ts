import { Request, Response } from 'express';
import { registerInputSchema } from '../lib/schemas/register';
import { createUser, getUser } from '../providers/user.provider';
import { hashPassword, random } from '../services/auth.service';
import { parseZodError } from '../lib/helpers';

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
      select: { email: true },
    });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message:
          existingUser.email === email
            ? 'User with this email already exists.'
            : 'Username is not available.',
      });
    }
    const salt = random();
    const hashedPassword = hashPassword(salt, password);
    const user = await createUser({
      data: { username, email, password: hashedPassword, salt },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
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
