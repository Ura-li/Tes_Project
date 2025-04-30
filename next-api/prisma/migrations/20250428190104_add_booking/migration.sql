-- CreateTable
CREATE TABLE `Resource` (
    `ResourceId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`ResourceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResourceAccount` (
    `ResourceAccountId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`ResourceAccountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubkTechnician` (
    `SubkTechnicianId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`SubkTechnicianId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubkTechnicianLearner` (
    `SubkTechnicianLearnerId` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`SubkTechnicianLearnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookings` (
    `BookingId` INTEGER NOT NULL AUTO_INCREMENT,
    `BookingStatus` VARCHAR(100) NULL,
    `WOID` VARCHAR(191) NOT NULL,
    `ScheduleJeopardy` BOOLEAN NULL,
    `ScheduleJeopardyTime` DATETIME(3) NULL,
    `DoNotDisturb` BOOLEAN NULL,
    `CeScheduleChange` BOOLEAN NULL,
    `CreatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `CreatedBy` INTEGER NOT NULL,
    `TotalBillableDurationInMinutes` INTEGER NULL,
    `TotalInProgressDurationInMinutes` INTEGER NULL,
    `TotalBreakDurationInMinutes` INTEGER NULL,

    INDEX `fk_address_workorder`(`WOID`),
    PRIMARY KEY (`BookingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingDetails` (
    `BookingDetailId` INTEGER NOT NULL AUTO_INCREMENT,
    `BookingId` INTEGER NOT NULL,
    `ResourceId` INTEGER NOT NULL,
    `ResourceAccountId` INTEGER NOT NULL,
    `SubkTechnicianId` INTEGER NOT NULL,
    `SubkTechnicianLearnerId` INTEGER NOT NULL,
    `Name` VARCHAR(255) NOT NULL,
    `Status` VARCHAR(50) NOT NULL,
    `StartTimeCustomerTime` DATETIME(3) NULL,
    `EndTimeCustomerTime` DATETIME(3) NULL,
    `EstimatedArrivalTimeCustomerTime` DATETIME(3) NULL,
    `ActualArrivalTimeCustomerTime` DATETIME(3) NULL,
    `StartTimeUserTime` DATETIME(3) NULL,
    `EndTimeUserTime` DATETIME(3) NULL,
    `DurationInMinutesUserTime` INTEGER NULL,
    `EstimatedArrivalTimeUserTime` DATETIME(3) NULL,
    `ActualArrivalTimeUserTime` DATETIME(3) NULL,
    `ChangedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ChangedBy` INTEGER NOT NULL,

    PRIMARY KEY (`BookingDetailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_WOID_fkey` FOREIGN KEY (`WOID`) REFERENCES `workorder`(`WOID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_ResourceId_fkey` FOREIGN KEY (`ResourceId`) REFERENCES `Resource`(`ResourceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_ResourceAccountId_fkey` FOREIGN KEY (`ResourceAccountId`) REFERENCES `ResourceAccount`(`ResourceAccountId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_SubkTechnicianId_fkey` FOREIGN KEY (`SubkTechnicianId`) REFERENCES `SubkTechnician`(`SubkTechnicianId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_SubkTechnicianLearnerId_fkey` FOREIGN KEY (`SubkTechnicianLearnerId`) REFERENCES `SubkTechnicianLearner`(`SubkTechnicianLearnerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetails` ADD CONSTRAINT `BookingDetails_BookingId_fkey` FOREIGN KEY (`BookingId`) REFERENCES `Bookings`(`BookingId`) ON DELETE CASCADE ON UPDATE CASCADE;
