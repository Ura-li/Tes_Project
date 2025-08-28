-- AlterTable
ALTER TABLE `caseinformation` MODIFY `CaseStatus` ENUM('New', 'Open', 'InActive', 'Close', 'Active', 'Monitor', 'Pending_Customer_Action', 'Quote_Requested', 'Pending_Follow_Up', 'Pending_Order', 'Escalated', 'Quote_Approved', 'Pending_Quote', 'NEW_AssignCE', 'NEW_AssignAPO', 'NEW_AssignLeader', 'NEW_AssignPS') NOT NULL DEFAULT 'Open';
