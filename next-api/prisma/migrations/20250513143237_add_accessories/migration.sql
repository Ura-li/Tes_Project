-- CreateTable
CREATE TABLE `accessory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CaseID` VARCHAR(191) NOT NULL,
    `Accessories` VARCHAR(191) NOT NULL,
    `Note` VARCHAR(191) NULL,
    `CT_SNCode` VARCHAR(191) NULL,

    INDEX `accessory_CaseID_idx`(`CaseID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accessory` ADD CONSTRAINT `accessory_CaseID_fkey` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE CASCADE ON UPDATE CASCADE;
