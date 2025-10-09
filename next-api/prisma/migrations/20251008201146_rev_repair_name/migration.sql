/*
  Warnings:

  - You are about to drop the column `Repair` on the `workorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `workorder` DROP COLUMN `Repair`,
    ADD COLUMN `RepairAction` VARCHAR(191) NULL;
