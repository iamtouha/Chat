/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./lib/lucia.js').Auth;
  type DatabaseUserAttributes = Pick<
    import('@prisma/client').User,
    'username' | 'active' | 'email' | 'role'
  >;
  type DatabaseSessionAttributes = {};
}
