import { Router } from 'express';
import { login, logout, register } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', isAuthenticated, logout);

export default authRouter;
