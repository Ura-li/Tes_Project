/*
  Warnings:

  - The primary key for the `invoicetable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `QuotationNo` on the `invoicetable` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `materialorder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `QuotationNo` on the `quotation_lineitem` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `quotationtable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `QuotationNo` on the `quotationtable` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - The primary key for the `workorder` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/

-- Drop self-referencing FK (MISSING!)
ALTER TABLE `materialorder`
  DROP FOREIGN KEY `materialorder_ParentMOID_fkey`;


-- DropForeignKey
ALTER TABLE `materialorder` DROP FOREIGN KEY `materialorder_ibfk_1`;

-- DropForeignKey
ALTER TABLE `materialorderlineitems` DROP FOREIGN KEY `materialorderlineitems_ibfk_1`;

-- DropForeignKey
ALTER TABLE `quotation_lineitem` DROP FOREIGN KEY `quotation_lineitem_QuotationNo_fkey`;

-- DropIndex
-- DROP INDEX `invoicetable_QuotationNo_fkey` ON `invoicetable`;
ALTER TABLE `invoicetable` DROP FOREIGN KEY `invoice_QuotationNo_fkey`;

ALTER TABLE `Bookings` DROP FOREIGN KEY `Bookings_WOID_fkey`;
-- AlterTable
ALTER TABLE `invoicetable` DROP PRIMARY KEY,
    MODIFY `InvoiceNo` VARCHAR(191) NOT NULL,
    MODIFY `QuotationNo` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`InvoiceNo`);

-- AlterTable
ALTER TABLE `materialorder` DROP PRIMARY KEY,
    MODIFY `MOID` VARCHAR(191) NOT NULL,
    MODIFY `WOID` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`MOID`);

-- AlterTable
ALTER TABLE `materialorderlineitems` MODIFY `MOID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `quotation_lineitem` MODIFY `QuotationNo` VARCHAR(191) NOT NULL;

ALTER TABLE `Bookings` MODIFY `WOID` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `quotationtable` DROP PRIMARY KEY,
    MODIFY `QuotationNo` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`QuotationNo`);

-- AlterTable
ALTER TABLE `workorder` DROP PRIMARY KEY,
    MODIFY `WOID` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`WOID`);

-- AlterTable
ALTER TABLE `workorder_service_delivery` MODIFY `WOID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workorder_service_delivery_address` MODIFY `WOID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workorder_service_delivery_skillset` MODIFY `WOID` VARCHAR(191) NULL;

-- Re-add self-referencing FK
ALTER TABLE `materialorder`
  ADD CONSTRAINT `materialorder_ParentMOID_fkey`
  FOREIGN KEY (`ParentMOID`)
  REFERENCES `materialorder`(`MOID`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE `invoicetable` ADD CONSTRAINT `invoicetable_QuotationNo_fkey` FOREIGN KEY (`QuotationNo`) REFERENCES `quotationtable`(`QuotationNo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_lineitem` ADD CONSTRAINT `quotation_lineitem_QuotationNo_fkey` FOREIGN KEY (`QuotationNo`) REFERENCES `quotationtable`(`QuotationNo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materialorder` ADD CONSTRAINT `materialorder_ibfk_1` FOREIGN KEY (`WOID`) REFERENCES `workorder`(`WOID`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_WOID_fkey` FOREIGN KEY (`WOID`) REFERENCES `workorder`(`WOID`) ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE `materialorderlineitems` ADD CONSTRAINT `materialorderlineitems_ibfk_1` FOREIGN KEY (`MOID`) REFERENCES `materialorder`(`MOID`) ON DELETE RESTRICT ON UPDATE CASCADE;
