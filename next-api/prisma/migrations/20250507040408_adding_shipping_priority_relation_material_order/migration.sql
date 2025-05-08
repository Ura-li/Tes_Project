-- AlterTable
ALTER TABLE `materialorder` ADD COLUMN `AccidentalDamageProtection` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `CollectionRequestedDate` DATETIME(0) NULL,
    ADD COLUMN `CustomerInducedDamage` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `DefectiveMediaRetention` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `DeliveryRequestedDate` DATETIME(0) NULL,
    ADD COLUMN `EOTOrderNumber` VARCHAR(50) NULL,
    ADD COLUMN `IsBCPOrder` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `MaterialOrderType` VARCHAR(50) NULL,
    ADD COLUMN `NotificationNumber` VARCHAR(100) NULL,
    ADD COLUMN `ParentMOID` VARCHAR(13) NULL,
    ADD COLUMN `PromoCode` VARCHAR(50) NULL,
    ADD COLUMN `ResourceId` VARCHAR(255) NULL,
    ADD COLUMN `ShippingPriority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NULL DEFAULT 'MEDIUM';

-- CreateIndex
CREATE INDEX `ResourceId` ON `materialorder`(`ResourceId`);

-- AddForeignKey
ALTER TABLE `materialorder` ADD CONSTRAINT `materialorder_ParentMOID_fkey` FOREIGN KEY (`ParentMOID`) REFERENCES `materialorder`(`MOID`) ON DELETE RESTRICT ON UPDATE CASCADE;
