-- AlterTable
ALTER TABLE `caseinformation` ADD COLUMN `StorageLocationStore` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `product_information` ADD COLUMN `HWPC` VARCHAR(50) NULL;

-- CreateTable
CREATE TABLE `casephotos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CaseID` VARCHAR(191) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `filename` VARCHAR(255) NULL,
    `size` INTEGER NOT NULL,
    `mimeType` VARCHAR(100) NULL,
    `uploadedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `casephotos_CaseID_idx`(`CaseID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `casephotos` ADD CONSTRAINT `casephotos_CaseID_fkey` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE CASCADE ON UPDATE CASCADE;
