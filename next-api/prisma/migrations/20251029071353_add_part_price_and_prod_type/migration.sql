/*
  Warnings:

  - A unique constraint covering the columns `[VendorPartNumber]` on the table `servicecatalog_parts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `servicecatalog_parts` ADD COLUMN `ODMOriginalPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `ODMPatnerPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `ODMUserPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `PartLaborToPatner` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `ProductType` ENUM('PSG', 'IPG', '') NULL,
    ADD COLUMN `VendorPartNumber` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `servicecatalog_parts_VendorPartNumber_key` ON `servicecatalog_parts`(`VendorPartNumber`);
