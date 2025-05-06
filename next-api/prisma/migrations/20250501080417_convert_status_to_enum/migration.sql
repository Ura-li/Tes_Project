/*
  Warnings:

  - Made the column `CaseStatus` on table `caseinformation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `OrderStatus` on table `materialorder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `SystemStatus` on table `workorder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `caseinformation` MODIFY `CaseStatus` ENUM('Open', 'Close') NOT NULL DEFAULT 'Open';

-- AlterTable
ALTER TABLE `materialorder` MODIFY `OrderStatus` ENUM('New', 'Submitted', 'Ordered', 'Shipped', 'Closed') NOT NULL DEFAULT 'New';

-- AlterTable
ALTER TABLE `materialorderlineitems` ADD COLUMN `Status` ENUM('New', 'Submitted', 'Ordered', 'Shipped', 'Closed', '') NOT NULL DEFAULT 'New';

-- AlterTable
ALTER TABLE `workorder` MODIFY `SystemStatus` ENUM('OPEN_UNSCHEDULED', 'OPEN_COMPLETED', 'CLOSED_POSTED') NOT NULL DEFAULT 'OPEN_UNSCHEDULED';
