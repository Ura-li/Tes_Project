/*
  Warnings:

  - The values [PSG,IPG,] on the enum `repairClassCode_PaymentEligibility` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `repairClassCode` MODIFY `PaymentEligibility` ENUM('Eligible', 'Not_Eligible') NOT NULL;
