-- AlterTable
ALTER TABLE `workorder` ADD COLUMN `ServiceTypeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_ServiceTypeId_fkey` FOREIGN KEY (`ServiceTypeId`) REFERENCES `ServiceType`(`ServiceTypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
