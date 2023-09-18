import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './router';

export const createApp = () => {
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

export const server = http.createServer(createApp());
export const io = new Server(server, { cors: { origin: '*' } });
