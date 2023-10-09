import { prisma } from '../database';

export const newFileData = prisma.file.create;
export const getFileData = prisma.file.findUnique;
export const getFileDatas = prisma.file.findMany;
export const updateFileData = prisma.file.update;
export const deleteFileData = prisma.file.delete;
export const aggregateFileData = prisma.file.aggregate;
