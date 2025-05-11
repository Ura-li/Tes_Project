/*
  Warnings:

  - The `readyForCloseDays` column on the `caseresolution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `caseresolution` DROP COLUMN `readyForCloseDays`,
    ADD COLUMN `readyForCloseDays` INTEGER NULL;
