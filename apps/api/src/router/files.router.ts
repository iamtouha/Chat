import { Router } from 'express';
import { uploadFile } from '../controllers/files.controller';
import { upload } from '../lib/uploader';

const filesRouter: Router = Router();

filesRouter.post('/upload', upload.single('file'), uploadFile);

export default filesRouter;
