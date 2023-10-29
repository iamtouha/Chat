/*
  Warnings:

  - You are about to drop the `RevokedToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Conversation` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `starred` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Session` ADD COLUMN `device` VARCHAR(191) NULL,
    ADD COLUMN `location` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `RevokedToken`;
