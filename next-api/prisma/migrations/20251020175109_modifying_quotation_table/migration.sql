/*
  Warnings:

  - A unique constraint covering the columns `[QuotationNo,LineItemID]` on the table `quotation_lineitem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `quotationtable` ADD COLUMN `QuoteDecision` ENUM('Approved', 'Rejected') NULL,
    ADD COLUMN `SendEmail` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `SendWa` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `QuotationApprovedDate` DATETIME(0) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `quotation_lineitem_QuotationNo_LineItemID_key` ON `quotation_lineitem`(`QuotationNo`, `LineItemID`);
