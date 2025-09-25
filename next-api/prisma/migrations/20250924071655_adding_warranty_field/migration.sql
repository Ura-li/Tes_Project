-- AlterTable
ALTER TABLE `asset_warranty` ADD COLUMN `EndUserAddress` VARCHAR(191) NULL,
    ADD COLUMN `EndUserName` VARCHAR(191) NULL,
    ADD COLUMN `EndUserPhone` VARCHAR(191) NULL,
    ADD COLUMN `POPDocument` VARCHAR(191) NULL,
    ADD COLUMN `PhotoUnit` VARCHAR(191) NULL,
    ADD COLUMN `PurchaseDate` DATETIME(3) NULL,
    ADD COLUMN `WarrantyApprovalStatus` VARCHAR(191) NULL,
    ADD COLUMN `WarrantyCard` VARCHAR(191) NULL,
    ADD COLUMN `WarrantyCardDate` DATETIME(3) NULL;
