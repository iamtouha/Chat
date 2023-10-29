import { lucia } from 'lucia';
import { express } from 'lucia/middleware';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '../database.js';

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  csrfProtection: false,
  middleware: express(),
  getUserAttributes: (data) => {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      active: data.active,
      role: data.role,
    };
  },
});

export type Auth = typeof auth;
