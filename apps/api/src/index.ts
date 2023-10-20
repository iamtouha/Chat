import { User } from '@prisma/client';
import { server, io } from './server';
import dotenv from 'dotenv';
import { initializeSocket } from './sockets';

dotenv.config();

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
