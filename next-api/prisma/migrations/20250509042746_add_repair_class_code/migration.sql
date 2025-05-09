-- CreateTable
CREATE TABLE `repairClassCode` (
    `Code` VARCHAR(3) NOT NULL,
    `Description` VARCHAR(100) NOT NULL,
    `Definition` VARCHAR(255) NOT NULL,
    `PaymentEligibility` ENUM('PSG', 'IPG', '') NOT NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`Code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
