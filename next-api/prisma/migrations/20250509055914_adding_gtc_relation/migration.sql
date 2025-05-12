-- AlterTable
ALTER TABLE `caseinformation` ADD COLUMN `id_gtc` INTEGER NULL;

-- CreateIndex
CREATE INDEX `caseinformation_id_gtc_idx` ON `caseinformation`(`id_gtc`);

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_id_gtc_fkey` FOREIGN KEY (`id_gtc`) REFERENCES `global_trade_check`(`id_gtc`) ON DELETE RESTRICT ON UPDATE CASCADE;
