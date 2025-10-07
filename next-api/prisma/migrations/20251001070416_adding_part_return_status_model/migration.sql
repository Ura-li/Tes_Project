-- AlterTable
ALTER TABLE `materialorder` ADD COLUMN `AWB_InCode` VARCHAR(100) NULL,
    ADD COLUMN `AWB_OutCode` VARCHAR(100) NULL,
    ADD COLUMN `RMAStatus` ENUM('InOutCE', 'ReturnLogistic', 'ReturnDHL', 'FullCharge') NULL;

-- AlterTable
ALTER TABLE `materialorderlineitems` ADD COLUMN `DOAReason` VARCHAR(100) NULL,
    ADD COLUMN `PartReturnStatusId` INTEGER NULL,
    ADD COLUMN `PhotoPartUnit` TEXT NULL,
    ADD COLUMN `QuantityUsed` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `Status` ENUM('New', 'Submitted', 'Ordered', 'Shipped', 'Closed', 'Cancelled', 'BackOrdered', '') NOT NULL DEFAULT 'New';

-- CreateTable
CREATE TABLE `PartReturnStatus` (
    `ReturnStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `StatusName` VARCHAR(191) NOT NULL,
    `StatusQuantityType` BOOLEAN NOT NULL DEFAULT true,
    `DOA` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`ReturnStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `materialorderlineitems` ADD CONSTRAINT `materialorderlineitems_PartReturnStatusId_fkey` FOREIGN KEY (`PartReturnStatusId`) REFERENCES `PartReturnStatus`(`ReturnStatusId`) ON DELETE SET NULL ON UPDATE CASCADE;
