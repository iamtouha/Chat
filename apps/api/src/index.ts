import dotenv from 'dotenv';
dotenv.config();

import { server, io } from './server.js';
import { initializeSocket } from './sockets/index.js';
import type { User } from 'lucia';

const port = parseInt(process.env.PORT ?? '') || 3000;

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
