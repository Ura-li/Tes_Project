-- AlterTable
ALTER TABLE `workorder` ADD COLUMN `CancelReason` TEXT NULL,
    ADD COLUMN `IsCancel` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `invoicetable` (
    `InvoiceNo` VARCHAR(8) NOT NULL,
    `QuotationNo` VARCHAR(8) NOT NULL,
    `AmountReceive` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `AmountDiff` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `AmountDiffReason` TEXT NULL,
    `PaymentType` VARCHAR(20) NULL,
    `AmountReceiveDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `AmountReceiveNote` TEXT NULL,
    `SendWa` BOOLEAN NOT NULL DEFAULT false,
    `SendEmail` BOOLEAN NOT NULL DEFAULT false,
    `SendInvoice` BOOLEAN NOT NULL DEFAULT false,
    `SendERF` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`InvoiceNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `invoicetable` ADD CONSTRAINT `invoicetable_QuotationNo_fkey` FOREIGN KEY (`QuotationNo`) REFERENCES `quotationtable`(`QuotationNo`) ON DELETE RESTRICT ON UPDATE CASCADE;
