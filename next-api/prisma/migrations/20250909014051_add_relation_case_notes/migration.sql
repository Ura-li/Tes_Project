-- CreateIndex
CREATE INDEX `casenotes_CreatedBy_idx` ON `casenotes`(`CreatedBy`);

-- AddForeignKey
ALTER TABLE `casenotes` ADD CONSTRAINT `casenotes_CreatedBy_fkey` FOREIGN KEY (`CreatedBy`) REFERENCES `User`(`IDUser`) ON DELETE SET NULL ON UPDATE CASCADE;
