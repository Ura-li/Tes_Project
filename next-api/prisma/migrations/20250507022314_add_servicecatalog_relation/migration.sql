-- AlterTable
ALTER TABLE `caseinformation` ADD COLUMN `ServiceCatalogID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_ServiceCatalogID_fkey` FOREIGN KEY (`ServiceCatalogID`) REFERENCES `servicecatalog`(`ServiceCatalogID`) ON DELETE RESTRICT ON UPDATE CASCADE;
