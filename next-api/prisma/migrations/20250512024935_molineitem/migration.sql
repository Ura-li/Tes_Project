-- AlterTable
ALTER TABLE `materialorderlineitems` ADD COLUMN `FailureId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Failure` (
    `FailureId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NULL,

    PRIMARY KEY (`FailureId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `materialorderlineitems` ADD CONSTRAINT `materialorderlineitems_FailureId_fkey` FOREIGN KEY (`FailureId`) REFERENCES `Failure`(`FailureId`) ON DELETE SET NULL ON UPDATE CASCADE;
