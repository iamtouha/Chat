import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const authRouter: Router = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', isAuthenticated, logout);

export default authRouter;
