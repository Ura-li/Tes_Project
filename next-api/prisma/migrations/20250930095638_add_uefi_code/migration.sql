-- AlterTable
ALTER TABLE `materialorderlineitems` ADD COLUMN `UEFICode` ENUM('DHU', 'FID', 'MPS', 'PND', 'PPR') NULL,
    ADD COLUMN `UEFI_NO` VARCHAR(100) NULL;
