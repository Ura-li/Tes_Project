-- AlterTable
ALTER TABLE `caseinformation` MODIFY `CaseStatus` ENUM('New', 'Open', 'InActive', 'Close', 'Active', 'Monitor', 'Pending_Customer_Action', 'Quote_Requested', 'Pending_Follow_Up', 'Pending_Order', 'Escalated', 'Quote_Approved', 'Quote_Rejected', 'Pending_Quote', 'NEW_AssignCE', 'NEW_AssignAPO', 'NEW_AssignLeader', 'NEW_AssignPS', 'NEW_POPDoc', 'NEW_Warranty', 'AssignCE', 'AssignAPO', 'AssignLeader', 'AssignPS', 'PartOrder', 'PartRequest', 'PartRequestLog', 'PartAvailable', 'RepairProgress', 'FinishRepair', 'CancelRepair') NOT NULL DEFAULT 'Open';

-- AlterTable
ALTER TABLE `workorder` MODIFY `SystemStatus` ENUM('OPEN_UNSCHEDULED', 'OPEN_SCHEDULED', 'OPEN_COMPLETED', 'REPAIR_PROGRESS', 'CLOSED_POSTED', 'CLOSED_CANCELLED') NOT NULL DEFAULT 'OPEN_UNSCHEDULED';
