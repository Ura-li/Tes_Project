-- AlterTable
ALTER TABLE `warranty_services` ADD COLUMN `CaseTypeServices` VARCHAR(255) NULL,
    ADD COLUMN `WarrantyCondition` ENUM('InWarranty', 'OutWarranty') NULL;
