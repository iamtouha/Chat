import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { type Express } from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import router from './router/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp: () => Express = () => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(compression())
    .use(cors())
    .use(cookieParser())
    .use(morgan('dev'))
    .use('/', express.static(path.join(__dirname, '../..', 'client', 'dist')))
    .use('/api', router);
  return app;
};

export const server = http.createServer(createApp());
export const io: Server = new Server(server, { cors: { origin: '*' } });
