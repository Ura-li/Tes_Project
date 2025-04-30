/*
  Warnings:

  - You are about to drop the column `SubkTechnicianLearnerId` on the `BookingDetails` table. All the data in the column will be lost.
  - The primary key for the `ResourceAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubkTechnician` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `SubkTechnicianLearner` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BookingDetails` DROP FOREIGN KEY `BookingDetails_ResourceAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `BookingDetails` DROP FOREIGN KEY `BookingDetails_SubkTechnicianId_fkey`;

-- DropForeignKey
ALTER TABLE `BookingDetails` DROP FOREIGN KEY `BookingDetails_SubkTechnicianLearnerId_fkey`;

-- DropIndex
DROP INDEX `BookingDetails_ResourceAccountId_fkey` ON `BookingDetails`;

-- DropIndex
DROP INDEX `BookingDetails_SubkTechnicianId_fkey` ON `BookingDetails`;

-- DropIndex
DROP INDEX `BookingDetails_SubkTechnicianLearnerId_fkey` ON `BookingDetails`;

-- AlterTable
ALTER TABLE `BookingDetails` DROP COLUMN `SubkTechnicianLearnerId`,
    MODIFY `ResourceAccountId` VARCHAR(191) NOT NULL,
    MODIFY `SubkTechnicianId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ResourceAccount` DROP PRIMARY KEY,
    MODIFY `ResourceAccountId` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`ResourceAccountId`);

-- AlterTable
ALTER TABLE `SubkTechnician` DROP PRIMARY KEY,
    MODIFY `SubkTechnicianId` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`SubkTechnicianId`);

-- DropTable
DROP TABLE `SubkTechnicianLearner`;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_ResourceAccountId_fkey` FOREIGN KEY (`ResourceAccountId`) REFERENCES `ResourceAccount`(`ResourceAccountId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_SubkTechnicianId_fkey` FOREIGN KEY (`SubkTechnicianId`) REFERENCES `SubkTechnician`(`SubkTechnicianId`) ON DELETE RESTRICT ON UPDATE CASCADE;
