-- AlterTable
ALTER TABLE `materialorderlineitems` MODIFY `CollectionInstructions` ENUM('None', 'Pickup', 'DropOff', 'ThirdParty') NULL DEFAULT 'None';

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(100) NOT NULL,
    `operation` VARCHAR(10) NOT NULL,
    `userId` INTEGER NULL,
    `dataOld` JSON NULL,
    `dataNew` JSON NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
