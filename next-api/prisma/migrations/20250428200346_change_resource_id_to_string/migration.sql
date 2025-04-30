/*
  Warnings:

  - The primary key for the `Resource` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `BookingDetails` DROP FOREIGN KEY `BookingDetails_ResourceId_fkey`;

-- DropIndex
DROP INDEX `BookingDetails_ResourceId_fkey` ON `BookingDetails`;

-- AlterTable
ALTER TABLE `BookingDetails` MODIFY `ResourceId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Resource` DROP PRIMARY KEY,
    MODIFY `ResourceId` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`ResourceId`);

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_ResourceId_fkey` FOREIGN KEY (`ResourceId`) REFERENCES `Resource`(`ResourceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
