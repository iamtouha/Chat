import dotenv from 'dotenv';
dotenv.config();

import { User } from '@prisma/client';
import { server, io } from './server';
import { initializeSocket } from './sockets';

const port = parseInt(process.env.PORT ?? '') || 3000;

console.log(process.env.COOKIE_DOMAIN);

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
initializeSocket(io);

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
