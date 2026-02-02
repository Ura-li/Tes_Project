-- AlterTable
ALTER TABLE `invoicetable` ADD COLUMN `CaseID` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `invoicetable` ADD CONSTRAINT `invoicetable_CaseID_fkey` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE CASCADE;
