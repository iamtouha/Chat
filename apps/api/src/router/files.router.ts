import { Router } from 'express';
import { uploadFile, countSize } from '../controllers/files.controller.js';
import { upload } from '../lib/uploader.js';

const filesRouter: Router = Router();

filesRouter.post('/upload', upload.single('file'), uploadFile);
filesRouter.get('/storage', countSize);

export default filesRouter;
