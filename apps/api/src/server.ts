import { json, urlencoded } from 'body-parser';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router';
import morgan from 'morgan';

export const createServer = () => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(urlencoded({ extended: true }))
    .use(compression())
    .use(json())
    .use(cors())
    .use(cookieParser())
    .use(morgan('dev'))
    .use('/api', router)
    .use(express.static('../client/dist'));

  return app;
};
