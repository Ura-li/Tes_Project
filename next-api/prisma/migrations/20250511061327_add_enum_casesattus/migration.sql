-- AlterTable
ALTER TABLE `caseinformation` MODIFY `CaseStatus` ENUM('Open', 'InActive', 'Close') NOT NULL DEFAULT 'Open';

-- AlterTable
ALTER TABLE `workorder` MODIFY `SystemStatus` ENUM('OPEN_UNSCHEDULED', 'OPEN_SCHEDULED', 'OPEN_COMPLETED', 'CLOSED_POSTED') NOT NULL DEFAULT 'OPEN_UNSCHEDULED';
