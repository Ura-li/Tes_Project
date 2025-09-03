-- AlterTable
ALTER TABLE `materialorder` MODIFY `OrderStatus` ENUM('New', 'Submitted', 'Ordered', 'Shipped', 'Closed', 'Cancelled') NOT NULL DEFAULT 'New';

-- AlterTable
ALTER TABLE `materialorderlineitems` MODIFY `Status` ENUM('New', 'Submitted', 'Ordered', 'Shipped', 'Closed', 'Cancelled', '') NOT NULL DEFAULT 'New';
