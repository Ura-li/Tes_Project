/*
  Warnings:

  - You are about to drop the column `OTCCode` on the `workorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `caseinformation` ADD COLUMN `OTCCode` VARCHAR(5) NULL;

-- AlterTable
ALTER TABLE `workorder` DROP COLUMN `OTCCode`;

-- CreateTable
CREATE TABLE `OTCCodeTable` (
    `OTCCode` VARCHAR(5) NOT NULL,
    `Description` VARCHAR(100) NOT NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`OTCCode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `caseinformation_OTCCode_idx` ON `caseinformation`(`OTCCode`);

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_OTCCode_fkey` FOREIGN KEY (`OTCCode`) REFERENCES `OTCCodeTable`(`OTCCode`) ON DELETE SET NULL ON UPDATE CASCADE;
