-- CreateTable
CREATE TABLE `quotationtable` (
    `QuotationNo` VARCHAR(8) NOT NULL,
    `QuotationType` ENUM('Standard', 'Simple') NOT NULL DEFAULT 'Simple',
    `Currency` VARCHAR(8) NOT NULL DEFAULT 'IDR',
    `LaborFee` INTEGER NOT NULL DEFAULT 0,
    `VatValue` INTEGER NULL,
    `Subtotal` DECIMAL(10, 2) NULL,
    `VATAmount` DECIMAL(10, 2) NULL,
    `QuotationDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `QuotationApprovedDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UserAssign` INTEGER NOT NULL,
    `QuotationNote` TEXT NULL,
    `GrandTotal` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`QuotationNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quotation_lineitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `QuotationNo` VARCHAR(8) NOT NULL,
    `LineItemID` INTEGER NOT NULL,
    `Price` DECIMAL(10, 2) NOT NULL,
    `Approved` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quotationtable` ADD CONSTRAINT `quotationtable_UserAssign_fkey` FOREIGN KEY (`UserAssign`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_lineitem` ADD CONSTRAINT `quotation_lineitem_QuotationNo_fkey` FOREIGN KEY (`QuotationNo`) REFERENCES `quotationtable`(`QuotationNo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotation_lineitem` ADD CONSTRAINT `quotation_lineitem_LineItemID_fkey` FOREIGN KEY (`LineItemID`) REFERENCES `materialorderlineitems`(`LineItemID`) ON DELETE CASCADE ON UPDATE CASCADE;
