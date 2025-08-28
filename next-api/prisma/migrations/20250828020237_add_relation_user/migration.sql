-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_Owner_fkey` FOREIGN KEY (`Owner`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;
