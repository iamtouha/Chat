import { Router } from 'express';
import {
  getProfile,
  makeInitialAdmin,
  updateUserData,
} from '../controllers/users.controller';
import {
  makeAdmin,
  removeAdmin,
  deactivateUser,
  activateUser,
  getAllUsers,
  getUserFromId,
  removeUser,
} from '../controllers/users.admin.controller';
import { isAdmin } from '../middlewares/auth.middleware';

const usersRouter: Router = Router();

usersRouter.get('/profile', getProfile);
usersRouter.post('/make-admin', makeInitialAdmin);
usersRouter.put('/:id', updateUserData);

/**
 * Admin routes
 */
usersRouter.get('/', isAdmin, getAllUsers);
usersRouter.get('/:id', isAdmin, getUserFromId);
usersRouter.delete('/:id', isAdmin, removeUser);
usersRouter.put('/:id/make-admin', isAdmin, makeAdmin);
usersRouter.put('/:id/remove-admin', isAdmin, removeAdmin);
usersRouter.put('/:id/activate', isAdmin, activateUser);
usersRouter.put('/:id/deactivate', isAdmin, deactivateUser);

export default usersRouter;
