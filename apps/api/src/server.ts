import http from 'http';
import express, { type Express } from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './router';

export const createApp: () => Express = () => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(urlencoded({ extended: true }))
    .use(compression())
    .use(json())
    .use(cors())
    .use(cookieParser())
    .use(morgan('dev'))
    .use('/', express.static('../client/dist'))
    .use('/api', router);
  return app;
};

export const server = http.createServer(createApp());
export const io = new Server(server, { cors: { origin: '*' } });
