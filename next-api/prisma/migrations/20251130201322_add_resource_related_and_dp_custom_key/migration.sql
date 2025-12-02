/*
  Warnings:

  - A unique constraint covering the columns `[DPInvoiceNo]` on the table `down_payment_table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `DPInvoiceNo` to the `down_payment_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Resource` ADD COLUMN `AddressLine` VARCHAR(255) NULL,
    ADD COLUMN `City` VARCHAR(100) NULL,
    ADD COLUMN `Country` VARCHAR(100) NULL,
    ADD COLUMN `Email` VARCHAR(255) NULL,
    ADD COLUMN `Fax` VARCHAR(20) NULL,
    ADD COLUMN `Mobile` VARCHAR(20) NULL,
    ADD COLUMN `Phone` VARCHAR(20) NULL,
    ADD COLUMN `ResourceCode` INTEGER NULL,
    ADD COLUMN `ResourceLogo` LONGTEXT NULL,
    ADD COLUMN `ServiceCenterName` VARCHAR(255) NULL,
    ADD COLUMN `StateProvince` VARCHAR(100) NULL,
    ADD COLUMN `ZipPostalCode` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `down_payment_table` ADD COLUMN `DPInvoiceNo` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `down_payment_table_DPInvoiceNo_key` ON `down_payment_table`(`DPInvoiceNo`);
