-- AlterTable
ALTER TABLE `materialorder` MODIFY `OrderStatus` ENUM('New', 'Submitted', 'Ordered', 'Shipped', 'Closed', 'Cancelled', 'BackOrdered') NOT NULL DEFAULT 'New';
