import { Router } from 'express';
import {
  uploadFile,
  countSize,
  getFiles,
} from '../controllers/files.controller.js';
import { upload } from '../lib/uploader.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const filesRouter: Router = Router();

filesRouter.get('/', isAuthenticated, getFiles);
filesRouter.post('/upload', upload.single('file'), uploadFile);
filesRouter.get('/storage', isAuthenticated, countSize);

export default filesRouter;
