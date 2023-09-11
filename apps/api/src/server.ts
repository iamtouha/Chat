import { json, urlencoded } from 'body-parser';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import router from './router';

export const createServer = () => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(urlencoded({ extended: true }))
    .use(compression())
    .use(json())
    .use(cors())
    .use('/api', router)
    .use(express.static('../client/dist'));

  return app;
};
