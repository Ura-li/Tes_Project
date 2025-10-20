-- CreateTable
CREATE TABLE `ServiceType` (
    `ServiceTypeId` INTEGER NOT NULL AUTO_INCREMENT,
    `ServiceTypeName` VARCHAR(255) NULL,
    `ProblemCategory` ENUM('Hardware', 'Software') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ServiceTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
