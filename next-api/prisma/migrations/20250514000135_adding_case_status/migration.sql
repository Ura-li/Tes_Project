-- AlterTable
ALTER TABLE `caseinformation` MODIFY `CaseStatus` ENUM('Open', 'InActive', 'Close', 'Active', 'Monitor', 'Pending_Customer_Action', 'Quote_Requested', 'Pending_Follow_Up', 'Pending_Order', 'Escalated', 'Quote_Approved', 'Pending_Quote') NOT NULL DEFAULT 'Open';
