import { Router } from 'express';
import { uploadFile, countSize } from '../controllers/files.controller';
import { upload } from '../lib/uploader';

const filesRouter: Router = Router();

filesRouter.post('/upload', upload.single('file'), uploadFile);
filesRouter.get('/storage', countSize);

export default filesRouter;
