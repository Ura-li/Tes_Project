-- CreateTable
CREATE TABLE `asset_information` (
    `AssetID` INTEGER NOT NULL AUTO_INCREMENT,
    `SerialNumber` VARCHAR(20) NOT NULL,
    `ProductNumber` VARCHAR(11) NOT NULL,
    `SiteAccountID` INTEGER NULL,
    `ContactID` INTEGER NULL,

    INDEX `ContactID`(`ContactID`),
    INDEX `ProductNumber`(`ProductNumber`),
    INDEX `SiteAccountID`(`SiteAccountID`),
    PRIMARY KEY (`AssetID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `caseinformation` (
    `CaseID` INTEGER NOT NULL,
    `SiteAccountID` INTEGER NULL,
    `ContactID` INTEGER NULL,
    `AssetID` INTEGER NULL,
    `CaseSubject` VARCHAR(255) NULL,
    `CaseType` VARCHAR(100) NULL,
    `KCI_Flag` BOOLEAN NULL DEFAULT false,
    `IncomingChannel` VARCHAR(100) NULL,
    `CaseStatus` VARCHAR(50) NULL,
    `CasePriority` VARCHAR(50) NULL,
    `CustomerSeverity` VARCHAR(50) NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `CaseClosedDate` DATETIME(0) NULL,
    `CaseNote` INTEGER NULL,
    `SymptomCode` INTEGER NULL,
    `CaseResolution` TEXT NULL,
    `CreatedBy` INTEGER NULL,
    `Owner` INTEGER NULL,
    `WorkGround` INTEGER NULL,

    INDEX `AssetID`(`AssetID`),
    INDEX `CaseNote`(`CaseNote`),
    INDEX `ContactID`(`ContactID`),
    INDEX `SiteAccountID`(`SiteAccountID`),
    INDEX `SymptomCode`(`SymptomCode`),
    PRIMARY KEY (`CaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casenotes` (
    `NoteID` INTEGER NOT NULL AUTO_INCREMENT,
    `CaseID` INTEGER NULL,
    `LogType` VARCHAR(50) NULL,
    `ActionType` VARCHAR(50) NULL,
    `Template` VARCHAR(100) NULL,
    `VisibleExternally` BOOLEAN NULL DEFAULT false,
    `MinutesSpent` INTEGER NULL,
    `Note` TEXT NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CaseID`(`CaseID`),
    PRIMARY KEY (`NoteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_information` (
    `ContactID` INTEGER NOT NULL AUTO_INCREMENT,
    `SiteAccountID` INTEGER NULL,
    `Salutation` VARCHAR(20) NULL,
    `FirstName` VARCHAR(100) NOT NULL,
    `LastName` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(255) NULL,
    `PreferredLanguage` VARCHAR(50) NULL,
    `Phone` VARCHAR(50) NULL,
    `Mobile` VARCHAR(50) NULL,
    `WorkPhone` VARCHAR(50) NULL,
    `WorkExtension` VARCHAR(10) NULL,
    `OtherPhone` VARCHAR(50) NULL,
    `OtherExtension` VARCHAR(10) NULL,
    `Fax` VARCHAR(50) NULL,
    `AddressLine1` VARCHAR(255) NULL,
    `AddressLine2` VARCHAR(255) NULL,
    `City` VARCHAR(100) NULL,
    `StateProvince` VARCHAR(100) NULL,
    `Country` VARCHAR(100) NULL,
    `ZipPostalCode` VARCHAR(20) NULL,

    INDEX `SiteAccountID`(`SiteAccountID`),
    PRIMARY KEY (`ContactID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `global_trade_check` (
    `id_gtc` INTEGER NOT NULL AUTO_INCREMENT,
    `global_trade_status` VARCHAR(30) NOT NULL,
    `embargoed_country` VARCHAR(30) NOT NULL,
    `gt_override_reason` VARCHAR(30) NOT NULL,
    `gt_details` VARCHAR(50) NOT NULL,
    `screening_id` VARCHAR(25) NOT NULL,
    `gt_active_listening` VARCHAR(30) NOT NULL,
    `gt_al_comments` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_gtc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materialorder` (
    `MOID` VARCHAR(13) NOT NULL,
    `WOID` VARCHAR(13) NULL,
    `OrderNumber` VARCHAR(100) NULL,
    `OrderStatus` VARCHAR(50) NULL,
    `OrderType` VARCHAR(50) NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SalesOrderNumber` VARCHAR(100) NULL,
    `RMANumber` VARCHAR(100) NULL,
    `ReadyForClosureDate` DATETIME(0) NULL,
    `Owner` VARCHAR(100) NULL,

    INDEX `WOID`(`WOID`),
    PRIMARY KEY (`MOID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materialorderlineitems` (
    `LineItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `MOID` VARCHAR(13) NULL,
    `LineNumber` INTEGER NULL,
    `PartNumber` VARCHAR(100) NULL,
    `Description` TEXT NULL,
    `ATPStatus` VARCHAR(50) NULL,
    `Price` DECIMAL(10, 2) NULL,
    `Quantity` INTEGER NULL,

    INDEX `MOID`(`MOID`),
    INDEX `PartNumber`(`PartNumber`),
    PRIMARY KEY (`LineItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_information` (
    `ProductNumber` VARCHAR(11) NOT NULL,
    `ProductLine` VARCHAR(3) NOT NULL,
    `ProductName` VARCHAR(255) NOT NULL,
    `ProductTypeID` INTEGER NOT NULL,
    `end_of_sales_date` DATE NULL,
    `end_of_support_date` DATE NULL,
    `vendor` VARCHAR(50) NULL,

    INDEX `ProductTypeID`(`ProductTypeID`),
    PRIMARY KEY (`ProductNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_type` (
    `ProductTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductType` VARCHAR(50) NOT NULL,
    `ProductTower` ENUM('PSG', 'IPG', '') NULL,
    `ProductGroup` ENUM('Commercial', 'Consumer', '') NULL,

    PRIMARY KEY (`ProductTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicecatalog` (
    `ServiceCatalogID` INTEGER NOT NULL AUTO_INCREMENT,
    `AssetID` INTEGER NOT NULL,
    `Service_offerID` VARCHAR(8) NOT NULL,
    `PartNumber` VARCHAR(100) NULL,
    `WarrantyStatus` VARCHAR(50) NULL,
    `Currency` VARCHAR(10) NULL,
    `Price` DECIMAL(10, 2) NULL,
    `Tax` DECIMAL(10, 2) NULL,
    `Total` DECIMAL(10, 2) NULL,

    INDEX `AssetID`(`AssetID`),
    INDEX `PartNumber`(`PartNumber`),
    INDEX `Service_offerID`(`Service_offerID`),
    PRIMARY KEY (`ServiceCatalogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicecatalog_parts` (
    `PartNumber` VARCHAR(100) NOT NULL,
    `Keyword` VARCHAR(100) NULL,
    `PartDescription` TEXT NULL,
    `Orderability` BOOLEAN NULL,
    `RestrictionReason` TEXT NULL,
    `CSR_Flag` BOOLEAN NULL DEFAULT false,
    `ROHS_Flag` BOOLEAN NULL DEFAULT false,
    `Returnable_Flag` BOOLEAN NULL DEFAULT false,
    `HardRoll_Flag` BOOLEAN NULL DEFAULT false,
    `DangerousGoods_Flag` BOOLEAN NULL DEFAULT false,
    `LithiumBattery_Flag` BOOLEAN NULL DEFAULT false,
    `Oversize_Flag` BOOLEAN NULL DEFAULT false,
    `Heavy_Flag` BOOLEAN NULL DEFAULT false,
    `Price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `FreightPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Total` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Shipping_Fee` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`PartNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_account` (
    `SiteAccountID` INTEGER NOT NULL AUTO_INCREMENT,
    `Company` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NULL,
    `PrimaryPhone` VARCHAR(50) NULL,
    `AddressLine1` VARCHAR(255) NOT NULL,
    `AddressLine2` VARCHAR(255) NULL,
    `City` VARCHAR(100) NOT NULL,
    `StateProvince` VARCHAR(100) NULL,
    `Country` VARCHAR(100) NOT NULL,
    `ZipPostalCode` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`SiteAccountID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `symptom_codes` (
    `SymptomCodeID` INTEGER NOT NULL AUTO_INCREMENT,
    `SymptomCode` VARCHAR(50) NOT NULL,
    `TopCategory` VARCHAR(50) NOT NULL,
    `SubCategory` VARCHAR(50) NOT NULL,
    `QualityCodes` VARCHAR(50) NULL,
    `CreatedOn` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`SymptomCodeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test-table-without-migration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(12) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test_table` (
    `MOID` INTEGER NOT NULL AUTO_INCREMENT,
    `WOID` INTEGER NULL,
    `OrderNumber` VARCHAR(100) NULL,
    `OrderStatus` VARCHAR(50) NULL,
    `OrderType` VARCHAR(50) NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SalesOrderNumber` VARCHAR(100) NULL,
    `RMANumber` VARCHAR(100) NULL,
    `ReadyForClosureDate` DATETIME(0) NULL,
    `Owner` VARCHAR(100) NULL,

    INDEX `WOID`(`WOID`),
    PRIMARY KEY (`MOID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warranty_services` (
    `Service_offerID` VARCHAR(8) NOT NULL,
    `Service_description` VARCHAR(255) NOT NULL,
    `CTat_RTime` VARCHAR(5) NULL,
    `Price` FLOAT NOT NULL DEFAULT 0,
    `Shipping_Fee` FLOAT NOT NULL DEFAULT 0,
    `qty_ws` INTEGER NOT NULL DEFAULT 0,
    `Tax` FLOAT NOT NULL DEFAULT 0,
    `Total` FLOAT NOT NULL DEFAULT 0,

    PRIMARY KEY (`Service_offerID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workorder` (
    `WOID` VARCHAR(13) NOT NULL,
    `CaseID` INTEGER NULL,
    `WorkOrderNumber` VARCHAR(100) NULL,
    `WorkOrderType` VARCHAR(50) NULL,
    `Priority` VARCHAR(50) NULL,
    `SystemStatus` VARCHAR(50) NULL,
    `SubStatus` VARCHAR(50) NULL,
    `PreferredDay` DATE NULL,
    `PreferredTime` TIME(0) NULL,
    `ShipmentCountry` VARCHAR(50) NULL,
    `ShipmentState` VARCHAR(50) NULL,
    `CreatedOn` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Owner` VARCHAR(100) NULL,
    `SLAJeopardy` VARCHAR(50) NULL,
    `DueDateCustomer` DATETIME(0) NULL,
    `CoverageWindow` VARCHAR(100) NULL,
    `Response` VARCHAR(100) NULL,
    `OTCCode` VARCHAR(50) NULL,
    `RequestedDateTimeCustomer` DATETIME(0) NULL,
    `GuaranteedFixTimeCustomer` DATETIME(0) NULL,
    `EarlyStartDateTimeCustomer` DATETIME(0) NULL,
    `LatestStartDateTimeCustomer` DATETIME(0) NULL,
    `SLAReschedule` VARCHAR(50) NULL,
    `ActiveScheduleDate` DATETIME(0) NULL,
    `SLAErrorDescription` TEXT NULL,
    `CasePriorityIndex` INTEGER NULL,
    `PartnerStatus` VARCHAR(50) NULL,
    `WorkOrderDescription` TEXT NULL,
    `PartnerNotes` TEXT NULL,
    `IncomingChannel` VARCHAR(50) NULL,

    INDEX `CaseID`(`CaseID`),
    PRIMARY KEY (`WOID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workorder_service_delivery` (
    `ServiceDeliveryID` INTEGER NOT NULL AUTO_INCREMENT,
    `WOID` VARCHAR(13) NULL,
    `ServiceType` VARCHAR(100) NULL,
    `StartDateTime` DATETIME(0) NULL,
    `EndDateTime` DATETIME(0) NULL,

    INDEX `fk_service_workorder`(`WOID`),
    PRIMARY KEY (`ServiceDeliveryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workorder_service_delivery_address` (
    `AddressID` INTEGER NOT NULL AUTO_INCREMENT,
    `WOID` VARCHAR(13) NULL,
    `CompanyName` VARCHAR(100) NULL,
    `ContactFirstName` VARCHAR(100) NULL,
    `ContactLastName` VARCHAR(100) NULL,
    `PhoneNumber` VARCHAR(50) NULL,
    `Email` VARCHAR(100) NULL,
    `AddressLine1` VARCHAR(200) NULL,
    `AddressLine2` VARCHAR(200) NULL,
    `AddressLine3` VARCHAR(200) NULL,
    `City` VARCHAR(100) NULL,
    `StateOrProvince` VARCHAR(100) NULL,
    `CountryOrRegion` VARCHAR(100) NULL,
    `PostalCode` VARCHAR(20) NULL,
    `TimeZone` VARCHAR(50) NULL,
    `ServiceTerritory` VARCHAR(100) NULL,
    `BusinessSegment` VARCHAR(100) NULL,
    `Longitude` FLOAT NULL,
    `Latitude` FLOAT NULL,

    INDEX `fk_address_workorder`(`WOID`),
    PRIMARY KEY (`AddressID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workorder_service_delivery_skillset` (
    `SkillSetID` INTEGER NOT NULL AUTO_INCREMENT,
    `WOID` VARCHAR(13) NULL,
    `SkillCode` VARCHAR(50) NULL,
    `SkillLevel` VARCHAR(50) NULL,

    INDEX `fk_skillset_workorder`(`WOID`),
    PRIMARY KEY (`SkillSetID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_information` ADD CONSTRAINT `asset_information_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account`(`SiteAccountID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `asset_information` ADD CONSTRAINT `asset_information_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information`(`ContactID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `asset_information` ADD CONSTRAINT `asset_information_ibfk_3` FOREIGN KEY (`ProductNumber`) REFERENCES `product_information`(`ProductNumber`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account`(`SiteAccountID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information`(`ContactID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_ibfk_3` FOREIGN KEY (`AssetID`) REFERENCES `asset_information`(`AssetID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_ibfk_4` FOREIGN KEY (`CaseNote`) REFERENCES `casenotes`(`NoteID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `caseinformation` ADD CONSTRAINT `caseinformation_ibfk_5` FOREIGN KEY (`SymptomCode`) REFERENCES `symptom_codes`(`SymptomCodeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `casenotes` ADD CONSTRAINT `casenotes_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `contact_information` ADD CONSTRAINT `contact_information_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account`(`SiteAccountID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `materialorder` ADD CONSTRAINT `materialorder_ibfk_1` FOREIGN KEY (`WOID`) REFERENCES `workorder`(`WOID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materialorderlineitems` ADD CONSTRAINT `materialorderlineitems_ibfk_1` FOREIGN KEY (`MOID`) REFERENCES `materialorder`(`MOID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materialorderlineitems` ADD CONSTRAINT `materialorderlineitems_ibfk_2` FOREIGN KEY (`PartNumber`) REFERENCES `servicecatalog_parts`(`PartNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_information` ADD CONSTRAINT `product_information_ibfk_1` FOREIGN KEY (`ProductTypeID`) REFERENCES `product_type`(`ProductTypeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `servicecatalog` ADD CONSTRAINT `servicecatalog_ibfk_1` FOREIGN KEY (`AssetID`) REFERENCES `asset_information`(`AssetID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicecatalog` ADD CONSTRAINT `servicecatalog_ibfk_2` FOREIGN KEY (`PartNumber`) REFERENCES `servicecatalog_parts`(`PartNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicecatalog` ADD CONSTRAINT `servicecatalog_ibfk_3` FOREIGN KEY (`Service_offerID`) REFERENCES `warranty_services`(`Service_offerID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workorder` ADD CONSTRAINT `workorder_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE CASCADE;
