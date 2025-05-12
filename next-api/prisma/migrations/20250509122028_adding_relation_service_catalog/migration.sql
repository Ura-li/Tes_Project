-- AlterTable
ALTER TABLE `casenotes` MODIFY `ActionType` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ServiceCatalogManytoMany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ServiceCatalogID` INTEGER NOT NULL,
    `PartNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ServiceCatalogManytoMany_ServiceCatalogID_PartNumber_key`(`ServiceCatalogID`, `PartNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ServiceCatalogManytoMany` ADD CONSTRAINT `ServiceCatalogManytoMany_ServiceCatalogID_fkey` FOREIGN KEY (`ServiceCatalogID`) REFERENCES `servicecatalog`(`ServiceCatalogID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceCatalogManytoMany` ADD CONSTRAINT `ServiceCatalogManytoMany_PartNumber_fkey` FOREIGN KEY (`PartNumber`) REFERENCES `servicecatalog_parts`(`PartNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
