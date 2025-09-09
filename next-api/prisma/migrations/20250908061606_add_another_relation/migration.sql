-- AlterTable
ALTER TABLE `asset_information` ADD COLUMN `EOW_Date` DATETIME(0) NULL,
    ADD COLUMN `Warranty_Status` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `caseinformation` ADD COLUMN `CaseID_Manual` VARCHAR(191) NULL,
    ADD COLUMN `CaseID_Manual_Date` DATETIME(0) NULL,
    ADD COLUMN `ReferenceCase` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `contact_information` ADD COLUMN `PIC_Email` VARCHAR(100) NULL,
    ADD COLUMN `PIC_Name` VARCHAR(100) NULL,
    ADD COLUMN `PIC_Phone` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `asset_information` ADD CONSTRAINT `asset_information_Warranty_Status_fkey` FOREIGN KEY (`Warranty_Status`) REFERENCES `OTCCodeTable`(`OTCCode`) ON DELETE SET NULL ON UPDATE CASCADE;
