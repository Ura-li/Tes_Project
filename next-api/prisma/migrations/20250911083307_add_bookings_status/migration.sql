/*
  Warnings:

  - You are about to drop the column `Status` on the `BookingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `BookingStatus` on the `Bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BookingDetails` DROP COLUMN `Status`,
    ADD COLUMN `BookingStatusId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Bookings` DROP COLUMN `BookingStatus`,
    ADD COLUMN `BookingStatusId` INTEGER NULL;

-- CreateTable
CREATE TABLE `BookingStatus` (
    `BookingStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `Description` VARCHAR(100) NOT NULL,
    `CreatedOn` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`BookingStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_BookingStatusId_fkey` FOREIGN KEY (`BookingStatusId`) REFERENCES `BookingStatus`(`BookingStatusId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_BookingStatusId_fkey` FOREIGN KEY (`BookingStatusId`) REFERENCES `BookingStatus`(`BookingStatusId`) ON DELETE SET NULL ON UPDATE CASCADE;
