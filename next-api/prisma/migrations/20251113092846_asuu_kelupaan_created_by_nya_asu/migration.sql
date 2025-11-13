/*
  Warnings:

  - Added the required column `CreatedBy` to the `invoicetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoicetable` ADD COLUMN `CreatedBy` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `invoicetable` ADD CONSTRAINT `invoicetable_CreatedBy_fkey` FOREIGN KEY (`CreatedBy`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;
