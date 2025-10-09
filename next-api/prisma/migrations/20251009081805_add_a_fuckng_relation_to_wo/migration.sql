/*
  Warnings:

  - You are about to drop the column `NMU` on the `workorder` table. All the data in the column will be lost.
  - You are about to drop the column `NMUItem` on the `workorder` table. All the data in the column will be lost.
  - You are about to alter the column `DelayCode` on the `workorder` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(13))`.

*/
-- AlterTable
ALTER TABLE `workorder` DROP COLUMN `NMU`,
    DROP COLUMN `NMUItem`,
    ADD COLUMN `NMUId` INTEGER NULL,
    ADD COLUMN `NMUItemId` INTEGER NULL,
    MODIFY `DelayCode` ENUM('PartBackOrder', 'IntermittentCase', 'CustomerCausedDelay', 'MultipleIssue', 'WarrantySalesDelayApproval', 'EscalationComplexIssue', 'WrongPartOrderorAnalysis', 'CaseHandlingDelay', 'PartDOA', 'NOCEAvailable', 'CutOffTime', 'HPSystemDown', 'ADPInvestigation', 'RecoveryOS', 'UpdateWindows', 'OfficeClosure', 'AMRMonitor', 'TravelDelay') NULL;

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_NMUId_fkey` FOREIGN KEY (`NMUId`) REFERENCES `NMU`(`NMUId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_NMUItemId_fkey` FOREIGN KEY (`NMUItemId`) REFERENCES `NMUItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
