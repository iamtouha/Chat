import { Router } from 'express';
import {
  getAllUsers,
  getProfile,
  getUserFromId,
  makeAdmin,
} from '../controllers/users.controller';
import { isAdmin } from '../middlewares/auth.middleware';

const usersRouter: Router = Router();

usersRouter.get('/', isAdmin, getAllUsers);
usersRouter.get('/profile', getProfile);
usersRouter.post('/make-admin', makeAdmin);
usersRouter.get('/:id', isAdmin, getUserFromId);

export default usersRouter;
