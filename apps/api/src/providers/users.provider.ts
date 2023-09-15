import { prisma } from '../database';

export const getUser = prisma.user.findFirst;
export const getUsers = prisma.user.findMany;
export const createUser = prisma.user.create;
export const updateUser = prisma.user.update;
export const deleteUser = prisma.user.delete;
