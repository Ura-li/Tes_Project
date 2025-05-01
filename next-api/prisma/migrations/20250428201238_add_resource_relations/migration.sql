-- AlterTable
ALTER TABLE `ResourceAccount` ADD COLUMN `ResourceId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `SubkTechnician` ADD COLUMN `ResourceAccountId` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `ResourceAccount` ADD CONSTRAINT `ResourceAccount_ResourceId_fkey` FOREIGN KEY (`ResourceId`) REFERENCES `Resource`(`ResourceId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubkTechnician` ADD CONSTRAINT `SubkTechnician_ResourceAccountId_fkey` FOREIGN KEY (`ResourceAccountId`) REFERENCES `ResourceAccount`(`ResourceAccountId`) ON DELETE SET NULL ON UPDATE CASCADE;
