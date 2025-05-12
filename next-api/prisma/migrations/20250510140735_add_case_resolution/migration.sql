-- CreateTable
CREATE TABLE `caseresolution` (
    `id_csr` VARCHAR(5) NOT NULL,
    `caseResolutionCode` VARCHAR(100) NOT NULL,
    `autoClose` VARCHAR(100) NOT NULL,
    `caseReadyForClosure` VARCHAR(100) NOT NULL,
    `readyForCloseDays` DATETIME(3) NULL,
    `readyForClosureDate` DATETIME(3) NULL,
    `pendingCustomerAction` DATETIME(3) NULL,
    `customerRequestedCloseDate` DATETIME(3) NULL,

    PRIMARY KEY (`id_csr`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
