-- AlterTable
ALTER TABLE `caseinformation` ADD COLUMN `id_csr` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `caseinformation_id_csr_idx` ON `caseinformation`(`id_csr`);

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_id_csr_fkey` FOREIGN KEY (`id_csr`) REFERENCES `caseresolution`(`id_csr`) ON DELETE RESTRICT ON UPDATE CASCADE;
