import type { Request, Response, NextFunction } from 'express';
import { getUser } from '../providers/users.provider.js';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const sessionToken = req.cookies['AUTH_TOKEN'];

  // if (!sessionToken) {
  //   return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  // }
  // const user = await getUser({ where: { sessionToken } });

  // if (!user) {
  //   return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  // }
  // req.user = user;
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }
  next();
};
