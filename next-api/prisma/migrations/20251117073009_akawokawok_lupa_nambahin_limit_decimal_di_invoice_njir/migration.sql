/*
  Warnings:

  - You are about to alter the column `AmountReceive` on the `invoicetable` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.
  - You are about to alter the column `AmountDiff` on the `invoicetable` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE `invoicetable` MODIFY `AmountReceive` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    MODIFY `AmountDiff` DECIMAL(12, 2) NOT NULL DEFAULT 0;
