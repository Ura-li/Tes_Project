/*
  Warnings:

  - The primary key for the `caseinformation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `casenotes` DROP FOREIGN KEY `casenotes_ibfk_1`;

-- DropForeignKey
ALTER TABLE `workorder` DROP FOREIGN KEY `workorder_ibfk_1`;

-- AlterTable
ALTER TABLE `caseinformation` DROP PRIMARY KEY,
    MODIFY `CaseID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`CaseID`);

-- AlterTable
ALTER TABLE `casenotes` MODIFY `CaseID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workorder` MODIFY `CaseID` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `caseinformation_CreatedBy_idx` ON `caseinformation`(`CreatedBy`);

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_CreatedBy_fkey` FOREIGN KEY (`CreatedBy`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casenotes` ADD CONSTRAINT `casenotes_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE CASCADE;
