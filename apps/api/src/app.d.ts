/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./lib/lucia.js').Auth;
  type DatabaseUserAttributes = {
    username: string;
    email: string;
    active: boolean;
    role: import('@prisma/client').USER_ROLE;
  };
  type DatabaseSessionAttributes = {};
}
