/*
  Warnings:

  - You are about to alter the column `id_csr` on the `caseinformation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `caseresolution` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id_csr` on the `caseresolution` table. The data in that column could be lost. The data in that column will be cast from `VarChar(5)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `caseinformation` DROP FOREIGN KEY `caseinformation_id_csr_fkey`;

-- AlterTable
ALTER TABLE `caseinformation` MODIFY `id_csr` INTEGER NULL;

-- AlterTable
ALTER TABLE `caseresolution` DROP PRIMARY KEY,
    MODIFY `id_csr` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id_csr`);

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_id_csr_fkey` FOREIGN KEY (`id_csr`) REFERENCES `caseresolution`(`id_csr`) ON DELETE RESTRICT ON UPDATE CASCADE;
