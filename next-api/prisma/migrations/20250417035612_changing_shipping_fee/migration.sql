/*
  Warnings:

  - Added the required column `Shipping_Fee` to the `servicecatalog_parts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicecatalog_parts` ADD COLUMN `Shipping_Fee` DECIMAL(10, 2) NOT NULL;
