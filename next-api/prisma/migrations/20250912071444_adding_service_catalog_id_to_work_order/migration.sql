/*
  Warnings:

  - A unique constraint covering the columns `[ServiceCatalogID]` on the table `workorder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `workorder` ADD COLUMN `ServiceCatalogID` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `workorder_ServiceCatalogID_key` ON `workorder`(`ServiceCatalogID`);

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_ServiceCatalogID_fkey` FOREIGN KEY (`ServiceCatalogID`) REFERENCES `servicecatalog`(`ServiceCatalogID`) ON DELETE SET NULL ON UPDATE CASCADE;
