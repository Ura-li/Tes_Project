/*
  Warnings:

  - You are about to drop the column `Owner` on the `materialorder` table. All the data in the column will be lost.
  - You are about to drop the column `Owner` on the `workorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `materialorder` DROP COLUMN `Owner`,
    ADD COLUMN `OwnerID` INTEGER NULL;

-- AlterTable
ALTER TABLE `workorder` DROP COLUMN `Owner`,
    ADD COLUMN `OwnerID` INTEGER NULL;

-- CreateIndex
CREATE INDEX `materialorder_OwnerID_idx` ON `materialorder`(`OwnerID`);

-- CreateIndex
CREATE INDEX `workorder_OwnerID_idx` ON `workorder`(`OwnerID`);

-- AddForeignKey
ALTER TABLE `materialorder` ADD CONSTRAINT `materialorder_OwnerID_fkey` FOREIGN KEY (`OwnerID`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_OwnerID_fkey` FOREIGN KEY (`OwnerID`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;
