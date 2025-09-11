/*
  Warnings:

  - You are about to drop the column `NPWP` on the `contact_information` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BookingDetails` ADD COLUMN `EngineerId` INTEGER NULL;

-- AlterTable
ALTER TABLE `contact_information` DROP COLUMN `NPWP`,
    ADD COLUMN `NIK` VARCHAR(25) NULL;

-- AlterTable
ALTER TABLE `site_account` ADD COLUMN `NPWP` VARCHAR(25) NULL;

-- CreateIndex
CREATE INDEX `BookingDetails_EngineerId_idx` ON `BookingDetails`(`EngineerId`);

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_EngineerId_fkey` FOREIGN KEY (`EngineerId`) REFERENCES `User`(`IDUser`) ON DELETE SET NULL ON UPDATE CASCADE;
