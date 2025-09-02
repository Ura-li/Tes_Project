-- CreateTable
CREATE TABLE `asset_warranty` (
    `WarrantyID` INTEGER NOT NULL AUTO_INCREMENT,
    `AssetID` INTEGER NULL,

    INDEX `AssetID`(`AssetID`),
    PRIMARY KEY (`WarrantyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_warranty` ADD CONSTRAINT `asset_warranty_ibfk_1` FOREIGN KEY (`AssetID`) REFERENCES `asset_information`(`AssetID`) ON DELETE RESTRICT ON UPDATE CASCADE;
