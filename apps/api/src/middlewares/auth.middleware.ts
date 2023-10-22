import type { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/lucia.js';
import { getUser } from '../providers/users.provider.js';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validate();
  if (!session) {
    return res.sendStatus(401);
  }
  req.user = session.user;

  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }
  next();
};
