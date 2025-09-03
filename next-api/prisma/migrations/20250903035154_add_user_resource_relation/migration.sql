-- AlterTable
ALTER TABLE `User` ADD COLUMN `ResourceId` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_ResourceId_fkey` FOREIGN KEY (`ResourceId`) REFERENCES `Resource`(`ResourceId`) ON DELETE SET NULL ON UPDATE CASCADE;
