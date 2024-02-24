import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import type { Request } from 'express';

const accessKeyId = process.env.AWS_ACCESS_KEY!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
const region = process.env.S3_REGION!;
const bucket = process.env.S3_BUCKET!;

console.log('accessKeyId', accessKeyId);
console.log('secretAccessKey', secretAccessKey);
console.log('region', region);
console.log('bucket', bucket);

const s3 = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export const upload = multer({
  storage: multerS3({
    s3,
    bucket,
    metadata: function (req: Request, file, cb) {
      cb(null, Object.assign({}, req.body));
    },
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
  dest: 'uploads/',
});
