-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2025 at 07:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hp`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset_information`
--

CREATE TABLE `asset_information` (
  `AssetID` int(11) NOT NULL,
  `SerialNumber` varchar(100) NOT NULL,
  `ProductNumber` varchar(100) DEFAULT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `ContactID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asset_information`
--

INSERT INTO `asset_information` (`AssetID`, `SerialNumber`, `ProductNumber`, `SiteAccountID`, `ContactID`) VALUES
(202, 'SN-789012', 'SVU-500', NULL, 11),
(203, 'SN-345678', 'SPE-200', 7, 1),
(204, 'SN-901234', 'IPR-800', NULL, 11);

-- --------------------------------------------------------

--
-- Table structure for table `caseinformation`
--

CREATE TABLE `caseinformation` (
  `CaseID` int(11) NOT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `ContactID` int(11) DEFAULT NULL,
  `AssetID` int(11) DEFAULT NULL,
  `CaseSubject` varchar(255) DEFAULT NULL,
  `CaseType` varchar(100) DEFAULT NULL,
  `KCI_Flag` tinyint(1) DEFAULT 0,
  `IncomingChannel` varchar(100) DEFAULT NULL,
  `CaseStatus` varchar(50) DEFAULT NULL,
  `CasePriority` varchar(50) DEFAULT NULL,
  `CustomerSeverity` varchar(50) DEFAULT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `CaseClosedDate` datetime DEFAULT NULL,
  `CaseNote` text DEFAULT NULL,
  `SymptomCode` varchar(50) DEFAULT NULL,
  `CaseResolution` text DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `Owner` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `caseinformation`
--

INSERT INTO `caseinformation` (`CaseID`, `SiteAccountID`, `ContactID`, `AssetID`, `CaseSubject`, `CaseType`, `KCI_Flag`, `IncomingChannel`, `CaseStatus`, `CasePriority`, `CustomerSeverity`, `CreatedOn`, `CaseClosedDate`, `CaseNote`, `SymptomCode`, `CaseResolution`, `CreatedBy`, `Owner`) VALUES
(1, 7, 1, 203, NULL, NULL, 0, NULL, NULL, NULL, NULL, '2025-04-16 05:54:50', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `casenotes`
--

CREATE TABLE `casenotes` (
  `NoteID` int(11) NOT NULL,
  `CaseID` int(11) DEFAULT NULL,
  `LogType` varchar(50) DEFAULT NULL,
  `ActionType` varchar(50) DEFAULT NULL,
  `Template` varchar(100) DEFAULT NULL,
  `VisibleExternally` tinyint(1) DEFAULT 0,
  `MinutesSpent` int(11) DEFAULT NULL,
  `Note` text DEFAULT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `confirm_service`
--

CREATE TABLE `confirm_service` (
  `id_confirmService` int(5) NOT NULL,
  `AssetID` int(11) NOT NULL,
  `Service_offerID` varchar(8) NOT NULL,
  `PartID` int(11) NOT NULL,
  `sub_total` float NOT NULL,
  `total` float NOT NULL,
  `Incident_Type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_information`
--

CREATE TABLE `contact_information` (
  `ContactID` int(11) NOT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `Salutation` varchar(20) DEFAULT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PreferredLanguage` varchar(50) DEFAULT NULL,
  `Phone` varchar(50) DEFAULT NULL,
  `Mobile` varchar(50) DEFAULT NULL,
  `WorkPhone` varchar(50) DEFAULT NULL,
  `WorkExtension` varchar(10) DEFAULT NULL,
  `OtherPhone` varchar(50) DEFAULT NULL,
  `OtherExtension` varchar(10) DEFAULT NULL,
  `Fax` varchar(50) DEFAULT NULL,
  `AddressLine1` varchar(255) DEFAULT NULL,
  `AddressLine2` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `StateProvince` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `ZipPostalCode` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_information`
--

INSERT INTO `contact_information` (`ContactID`, `SiteAccountID`, `Salutation`, `FirstName`, `LastName`, `Email`, `PreferredLanguage`, `Phone`, `Mobile`, `WorkPhone`, `WorkExtension`, `OtherPhone`, `OtherExtension`, `Fax`, `AddressLine1`, `AddressLine2`, `City`, `StateProvince`, `Country`, `ZipPostalCode`) VALUES
(1, 7, 'Mr.', 'John', 'Doe', 'john.doe@example.com', 'English', '123-456-7890', '987-654-3210', '555-1234', '101', '444-5678', '202', '999-888-7777', '123 Main St', 'Apt 4B', 'New York', 'NY', 'USA', '10001'),
(2, NULL, 'Ms.', 'Jane', 'Smith', 'jane.smith@example.com', 'English', '222-333-4444', '666-777-8888', '555-5678', '102', '333-222-1111', '203', '888-777-6666', '456 Elm St', NULL, 'Los Angeles', 'CA', 'USA', '90001'),
(3, NULL, 'Dr.', 'Alice', 'Brown', 'alice.brown@example.com', 'French', '333-444-5555', '777-888-9999', '555-6789', '103', '444-555-6666', '204', '777-666-5555', '789 Oak St', 'Suite 500', 'Chicago', 'IL', 'USA', '60601'),
(4, NULL, 'Mr.', 'Bob', 'Johnson', 'bob.johnson@example.com', 'Spanish', '444-555-6666', '888-999-0000', '555-7890', '104', '555-666-7777', '205', '666-555-4444', '159 Pine St', NULL, 'Houston', 'TX', 'USA', '77001'),
(5, NULL, 'Ms.', 'Emily', 'Davis', 'emily.davis@example.com', 'German', '555-666-7777', '999-000-1111', '555-8901', '105', '666-777-8888', '206', '555-444-3333', '753 Maple St', 'Floor 2', 'San Francisco', 'CA', 'USA', '94101'),
(6, NULL, 'Dr.', 'Michael', 'Wilson', 'michael.wilson@example.com', 'English', '666-777-8888', '000-111-2222', '555-9012', '106', '777-888-9999', '207', '444-333-2222', '852 Birch St', NULL, 'Miami', 'FL', 'USA', '33101'),
(7, NULL, 'Mrs.', 'Laura', 'Martinez', 'laura.martinez@example.com', 'Spanish', '777-888-9999', '111-222-3333', '555-0123', '107', '888-999-0000', '208', '333-222-1111', '951 Cedar St', 'Apt 7C', 'Seattle', 'WA', 'USA', '98101'),
(8, NULL, 'Mr.', 'David', 'Anderson', 'david.anderson@example.com', 'English', '888-999-0000', '222-333-4444', '555-1234', '108', '999-000-1111', '209', '222-111-0000', '357 Willow St', 'Unit 9', 'Boston', 'MA', 'USA', '02101'),
(9, NULL, 'Ms.', 'Sophia', 'Thomas', 'sophia.thomas@example.com', 'French', '999-000-1111', '333-444-5555', '555-2345', '109', '000-111-2222', '210', '111-000-9999', '654 Chestnut St', 'Suite 300', 'Denver', 'CO', 'USA', '80201'),
(10, NULL, 'Dr.', 'Chris', 'Harris', 'chris.harris@example.com', 'German', '000-111-2222', '444-555-6666', '555-3456', '110', '111-222-3333', '211', '000-999-8888', '852 Redwood St', NULL, 'Austin', 'TX', 'USA', '73301'),
(11, 4, 'Mr. ', 'Asgo', 'Farh', 'hello1@aiinnovators.ai', 'Bahasa Indonesia', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(12, 7, 'Mr. ', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', 'Spanish', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(13, 7, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(18, 7, 'Mr. ', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', 'Spanish', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(19, 7, '', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', '', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(20, 7, 'Mrs. ', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', 'English', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(21, 7, '', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', '', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(22, 7, 'Mr. ', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', 'Spanish', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(23, 7, 'Mr. ', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', 'Spanish', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(24, 7, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(25, 7, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''),
(26, 7, '', 'SN-789012', 'Farh', 'hello1@aiinnovators.ai', '', '03098765432', '', '', '', '', '', '', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', '', '10117'),
(27, 7, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `global_trade_check`
--

CREATE TABLE `global_trade_check` (
  `id_gtc` int(25) NOT NULL,
  `global_trade_status` varchar(30) NOT NULL,
  `embargoed_country` varchar(30) NOT NULL,
  `gt_override_reason` varchar(30) NOT NULL,
  `gt_details` varchar(50) NOT NULL,
  `screening_id` varchar(25) NOT NULL,
  `gt_active_listening` varchar(30) NOT NULL,
  `gt_al_comments` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materialorder`
--

CREATE TABLE `materialorder` (
  `MOID` int(11) NOT NULL,
  `WOID` int(11) DEFAULT NULL,
  `OrderNumber` varchar(100) DEFAULT NULL,
  `OrderStatus` varchar(50) DEFAULT NULL,
  `OrderType` varchar(50) DEFAULT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp(),
  `SalesOrderNumber` varchar(100) DEFAULT NULL,
  `RMANumber` varchar(100) DEFAULT NULL,
  `ReadyForClosureDate` datetime DEFAULT NULL,
  `Owner` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `materialorderlineitems`
--

CREATE TABLE `materialorderlineitems` (
  `LineItemID` int(11) NOT NULL,
  `MOID` int(11) DEFAULT NULL,
  `LineNumber` int(11) DEFAULT NULL,
  `PartNumber` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ATPStatus` varchar(50) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_information`
--

CREATE TABLE `product_information` (
  `ProductNumber` varchar(11) NOT NULL,
  `ProductLine` varchar(3) NOT NULL,
  `ProductName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_information`
--

INSERT INTO `product_information` (`ProductNumber`, `ProductLine`, `ProductName`) VALUES
('483R7PA', 'KV', 'HP 14s-cf2500TX'),
('6G1L7PA', 'M7', 'Victus by HP 15.6 inch Gaming Laptop 15-fb0000 (598V1AV)'),
('IPR-800', 'IPR', 'Printer 3D'),
('SPE-200', 'Lap', 'Laptop Gaming'),
('SVU-500', 'Pri', 'Printer 2D');

-- --------------------------------------------------------

--
-- Table structure for table `product_type`
--

CREATE TABLE `product_type` (
  `ProductTypeID` int(11) NOT NULL,
  `ProductType` varchar(50) NOT NULL,
  `ProductTower` enum('PSG','IPG','') DEFAULT NULL,
  `ProductGroup` enum('Commercial','Consumer','') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_type`
--

INSERT INTO `product_type` (`ProductTypeID`, `ProductType`, `ProductTower`, `ProductGroup`) VALUES
(1, 'Notebook/Laptop', 'PSG', 'Consumer'),
(2, 'Deskjet', 'IPG', 'Consumer');

-- --------------------------------------------------------

--
-- Table structure for table `servicecatalog`
--

CREATE TABLE `servicecatalog` (
  `ServiceCatalogID` int(11) NOT NULL,
  `ProductNumber` varchar(100) DEFAULT NULL,
  `ProductName` varchar(255) DEFAULT NULL,
  `SerialNumber` varchar(100) DEFAULT NULL,
  `WarrantyStatus` varchar(50) DEFAULT NULL,
  `Currency` varchar(10) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicecatalog`
--

INSERT INTO `servicecatalog` (`ServiceCatalogID`, `ProductNumber`, `ProductName`, `SerialNumber`, `WarrantyStatus`, `Currency`, `Price`, `Tax`, `Total`) VALUES
(1, '12', 'asddd', 'ew231', 'a', 'idr', 10.00, 1.00, 11.00);

-- --------------------------------------------------------

--
-- Table structure for table `servicecatalog_parts`
--

CREATE TABLE `servicecatalog_parts` (
  `PartID` int(11) NOT NULL,
  `ServiceCatalogID` int(11) DEFAULT NULL,
  `PartNumber` varchar(100) DEFAULT NULL,
  `Keyword` varchar(100) DEFAULT NULL,
  `PartDescription` text DEFAULT NULL,
  `Orderability` varchar(50) DEFAULT NULL,
  `RestrictionReason` text DEFAULT NULL,
  `CSR_Flag` tinyint(1) DEFAULT 0,
  `ROHS_Flag` tinyint(1) DEFAULT 0,
  `Returnable_Flag` tinyint(1) DEFAULT 0,
  `HardRoll_Flag` tinyint(1) DEFAULT 0,
  `DangerousGoods_Flag` tinyint(1) DEFAULT 0,
  `LithiumBattery_Flag` tinyint(1) DEFAULT 0,
  `Oversize_Flag` tinyint(1) DEFAULT 0,
  `Heavy_Flag` tinyint(1) DEFAULT 0,
  `Price` decimal(10,2) DEFAULT NULL,
  `FreightPrice` decimal(10,2) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_account`
--

CREATE TABLE `site_account` (
  `SiteAccountID` int(11) NOT NULL,
  `Company` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PrimaryPhone` varchar(50) DEFAULT NULL,
  `AddressLine1` varchar(255) NOT NULL,
  `AddressLine2` varchar(255) DEFAULT NULL,
  `City` varchar(100) NOT NULL,
  `StateProvince` varchar(100) DEFAULT NULL,
  `Country` varchar(100) NOT NULL,
  `ZipPostalCode` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_account`
--

INSERT INTO `site_account` (`SiteAccountID`, `Company`, `Email`, `PrimaryPhone`, `AddressLine1`, `AddressLine2`, `City`, `StateProvince`, `Country`, `ZipPostalCode`) VALUES
(1, 'Miku21 Store', 'mikucomunity21@gmail.com', '6287731137512', 'Virtual 1', '', 'Virtual World', 'Virtual World', 'Virtual', '13413'),
(2, 'PT. Kapal Api', 'kapalapi@gmail.com', '6287731137512', 'Jakarta Pusat', '', 'Jakarta', 'DKI Jakarta', 'Indonesia', '13413'),
(4, 'Tech Solutions Inc.', 'contact@techsolutions.com', '+1-800-555-1234', '123 Innovation Street', 'Suite 200', 'San Francisco', 'California', 'United States', '94105'),
(5, 'Global Corp', 'info@globalcorp.com', '+44-20-7946-0958', '456 Business Ave', NULL, 'London', 'Greater London', 'United Kingdom', 'EC1A 1BB'),
(6, 'Futuristic Systems', 'support@futuresys.io', '+81-3-1234-5678', '789 Tech Park', 'Building A', 'Tokyo', 'Tokyo Metropolis', 'Japan', '100-0001'),
(7, 'Neo AI Innovators', 'hello@aiinnovators.ai', '+49-30-9876-5432', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', 'Germany', '10117'),
(8, 'NextGen Robotics', 'contact@nextgenrobotics.com', '+33-1-2345-6789', '99 Cybernetic Lane', 'Floor 5', 'Paris', 'Île-de-France', 'France', '75008');

-- --------------------------------------------------------

--
-- Table structure for table `warranty_services`
--

CREATE TABLE `warranty_services` (
  `Service_offerID` varchar(8) NOT NULL,
  `Service_description` varchar(255) NOT NULL,
  `CTat_RTime` varchar(5) NOT NULL,
  `Price` float NOT NULL,
  `Shipping_Fee` float NOT NULL,
  `qty_ws` int(3) NOT NULL,
  `Tax` float NOT NULL,
  `Total` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workorder`
--

CREATE TABLE `workorder` (
  `WOID` int(11) NOT NULL,
  `CaseID` int(11) DEFAULT NULL,
  `ServiceCatalogID` int(11) DEFAULT NULL,
  `WorkOrderNumber` varchar(100) DEFAULT NULL,
  `WorkOrderType` varchar(50) DEFAULT NULL,
  `Priority` varchar(50) DEFAULT NULL,
  `SystemStatus` varchar(50) DEFAULT NULL,
  `SubStatus` varchar(50) DEFAULT NULL,
  `PreferredDay` date DEFAULT NULL,
  `PreferredTime` time DEFAULT NULL,
  `ShipmentCountry` varchar(50) DEFAULT NULL,
  `ShipmentState` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `Owner` varchar(100) DEFAULT NULL,
  `SLAJeopardy` varchar(50) DEFAULT NULL,
  `DueDateCustomer` datetime DEFAULT NULL,
  `CoverageWindow` varchar(100) DEFAULT NULL,
  `Response` varchar(100) DEFAULT NULL,
  `OTCCode` varchar(50) DEFAULT NULL,
  `RequestedDateTimeCustomer` datetime DEFAULT NULL,
  `GuaranteedFixTimeCustomer` datetime DEFAULT NULL,
  `EarlyStartDateTimeCustomer` datetime DEFAULT NULL,
  `LatestStartDateTimeCustomer` datetime DEFAULT NULL,
  `SLAReschedule` varchar(50) DEFAULT NULL,
  `ActiveScheduleDate` datetime DEFAULT NULL,
  `SLAErrorDescription` text DEFAULT NULL,
  `CasePriorityIndex` int(11) DEFAULT NULL,
  `PartnerStatus` varchar(50) DEFAULT NULL,
  `WorkOrderDescription` text DEFAULT NULL,
  `PartnerNotes` text DEFAULT NULL,
  `IncomingChannel` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workorder`
--

INSERT INTO `workorder` (`WOID`, `CaseID`, `ServiceCatalogID`, `WorkOrderNumber`, `WorkOrderType`, `Priority`, `SystemStatus`, `SubStatus`, `PreferredDay`, `PreferredTime`, `ShipmentCountry`, `ShipmentState`, `CreatedOn`, `Owner`, `SLAJeopardy`, `DueDateCustomer`, `CoverageWindow`, `Response`, `OTCCode`, `RequestedDateTimeCustomer`, `GuaranteedFixTimeCustomer`, `EarlyStartDateTimeCustomer`, `LatestStartDateTimeCustomer`, `SLAReschedule`, `ActiveScheduleDate`, `SLAErrorDescription`, `CasePriorityIndex`, `PartnerStatus`, `WorkOrderDescription`, `PartnerNotes`, `IncomingChannel`) VALUES
(1, 1, 1, 's11', 'Type Laptop', 'low', '?', 'Schedule', NULL, NULL, NULL, NULL, '2025-04-18 10:38:15', NULL, 'ASD', '2025-04-19 11:36:56', 'IDK', 'QWR', 'A55A', '2025-04-19 05:37:00', '2025-04-19 11:36:56', '2025-04-19 11:36:56', '2025-04-19 11:36:56', 'wdw', '2025-04-25 11:36:56', 'Qfddf aevfdyk', 1, 'Unknown person', 'Null', '...', 'Channel A');

-- --------------------------------------------------------

--
-- Table structure for table `workorder_service_delivery`
--

CREATE TABLE `workorder_service_delivery` (
  `ServiceDeliveryID` int(11) NOT NULL,
  `WOID` int(11) DEFAULT NULL,
  `ServiceType` varchar(100) DEFAULT NULL,
  `StartDateTime` datetime DEFAULT NULL,
  `EndDateTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workorder_service_delivery_address`
--

CREATE TABLE `workorder_service_delivery_address` (
  `AddressID` int(11) NOT NULL,
  `WOID` int(11) DEFAULT NULL,
  `CompanyName` varchar(100) DEFAULT NULL,
  `ContactFirstName` varchar(100) DEFAULT NULL,
  `ContactLastName` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `AddressLine1` varchar(200) DEFAULT NULL,
  `AddressLine2` varchar(200) DEFAULT NULL,
  `AddressLine3` varchar(200) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `StateOrProvince` varchar(100) DEFAULT NULL,
  `CountryOrRegion` varchar(100) DEFAULT NULL,
  `PostalCode` varchar(20) DEFAULT NULL,
  `TimeZone` varchar(50) DEFAULT NULL,
  `ServiceTerritory` varchar(100) DEFAULT NULL,
  `BusinessSegment` varchar(100) DEFAULT NULL,
  `Longitude` float(10,7) DEFAULT NULL,
  `Latitude` float(10,7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `workorder_service_delivery_address`
--

INSERT INTO `workorder_service_delivery_address` (`AddressID`, `WOID`, `CompanyName`, `ContactFirstName`, `ContactLastName`, `PhoneNumber`, `Email`, `AddressLine1`, `AddressLine2`, `AddressLine3`, `City`, `StateOrProvince`, `CountryOrRegion`, `PostalCode`, `TimeZone`, `ServiceTerritory`, `BusinessSegment`, `Longitude`, `Latitude`) VALUES
(1, 1, 'Neosantara', 'Sepa', 'Ntar', '0987654321', 'Address@mail', 'Jl. Ad', 'gc', 'af', 'Tea', 'Jate', 'ID', '5634', '?', 'Asean', '?', 0.0000000, 0.0000000);

-- --------------------------------------------------------

--
-- Table structure for table `workorder_service_delivery_skillset`
--

CREATE TABLE `workorder_service_delivery_skillset` (
  `SkillSetID` int(11) NOT NULL,
  `WOID` int(11) DEFAULT NULL,
  `SkillCode` varchar(50) DEFAULT NULL,
  `SkillLevel` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset_information`
--
ALTER TABLE `asset_information`
  ADD PRIMARY KEY (`AssetID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`),
  ADD KEY `ProductNumber` (`ProductNumber`);

--
-- Indexes for table `caseinformation`
--
ALTER TABLE `caseinformation`
  ADD PRIMARY KEY (`CaseID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`),
  ADD KEY `ContactID` (`ContactID`),
  ADD KEY `AssetID` (`AssetID`);

--
-- Indexes for table `casenotes`
--
ALTER TABLE `casenotes`
  ADD PRIMARY KEY (`NoteID`),
  ADD KEY `CaseID` (`CaseID`);

--
-- Indexes for table `confirm_service`
--
ALTER TABLE `confirm_service`
  ADD PRIMARY KEY (`id_confirmService`),
  ADD KEY `asset_information` (`AssetID`),
  ADD KEY `warranty_services` (`Service_offerID`),
  ADD KEY `servicecatalog_parts` (`PartID`);

--
-- Indexes for table `contact_information`
--
ALTER TABLE `contact_information`
  ADD PRIMARY KEY (`ContactID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`);

--
-- Indexes for table `global_trade_check`
--
ALTER TABLE `global_trade_check`
  ADD PRIMARY KEY (`id_gtc`);

--
-- Indexes for table `materialorder`
--
ALTER TABLE `materialorder`
  ADD PRIMARY KEY (`MOID`),
  ADD KEY `WOID` (`WOID`);

--
-- Indexes for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  ADD PRIMARY KEY (`LineItemID`),
  ADD KEY `MOID` (`MOID`);

--
-- Indexes for table `product_information`
--
ALTER TABLE `product_information`
  ADD PRIMARY KEY (`ProductNumber`);

--
-- Indexes for table `product_type`
--
ALTER TABLE `product_type`
  ADD PRIMARY KEY (`ProductTypeID`);

--
-- Indexes for table `servicecatalog`
--
ALTER TABLE `servicecatalog`
  ADD PRIMARY KEY (`ServiceCatalogID`);

--
-- Indexes for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  ADD PRIMARY KEY (`PartID`),
  ADD KEY `ServiceCatalogID` (`ServiceCatalogID`);

--
-- Indexes for table `site_account`
--
ALTER TABLE `site_account`
  ADD PRIMARY KEY (`SiteAccountID`);

--
-- Indexes for table `warranty_services`
--
ALTER TABLE `warranty_services`
  ADD PRIMARY KEY (`Service_offerID`);

--
-- Indexes for table `workorder`
--
ALTER TABLE `workorder`
  ADD PRIMARY KEY (`WOID`),
  ADD KEY `CaseID` (`CaseID`);

--
-- Indexes for table `workorder_service_delivery`
--
ALTER TABLE `workorder_service_delivery`
  ADD PRIMARY KEY (`ServiceDeliveryID`),
  ADD KEY `fk_service_workorder` (`WOID`);

--
-- Indexes for table `workorder_service_delivery_address`
--
ALTER TABLE `workorder_service_delivery_address`
  ADD PRIMARY KEY (`AddressID`),
  ADD KEY `fk_address_workorder` (`WOID`);

--
-- Indexes for table `workorder_service_delivery_skillset`
--
ALTER TABLE `workorder_service_delivery_skillset`
  ADD PRIMARY KEY (`SkillSetID`),
  ADD KEY `fk_skillset_workorder` (`WOID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asset_information`
--
ALTER TABLE `asset_information`
  MODIFY `AssetID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT for table `caseinformation`
--
ALTER TABLE `caseinformation`
  MODIFY `CaseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `casenotes`
--
ALTER TABLE `casenotes`
  MODIFY `NoteID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_information`
--
ALTER TABLE `contact_information`
  MODIFY `ContactID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `global_trade_check`
--
ALTER TABLE `global_trade_check`
  MODIFY `id_gtc` int(25) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materialorder`
--
ALTER TABLE `materialorder`
  MODIFY `MOID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  MODIFY `LineItemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `ProductTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `servicecatalog`
--
ALTER TABLE `servicecatalog`
  MODIFY `ServiceCatalogID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  MODIFY `PartID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_account`
--
ALTER TABLE `site_account`
  MODIFY `SiteAccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `workorder`
--
ALTER TABLE `workorder`
  MODIFY `WOID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `workorder_service_delivery`
--
ALTER TABLE `workorder_service_delivery`
  MODIFY `ServiceDeliveryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workorder_service_delivery_address`
--
ALTER TABLE `workorder_service_delivery_address`
  MODIFY `AddressID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `workorder_service_delivery_skillset`
--
ALTER TABLE `workorder_service_delivery_skillset`
  MODIFY `SkillSetID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asset_information`
--
ALTER TABLE `asset_information`
  ADD CONSTRAINT `asset_information_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`),
  ADD CONSTRAINT `asset_information_ibfk_2` FOREIGN KEY (`ProductNumber`) REFERENCES `product_information` (`ProductNumber`);

--
-- Constraints for table `caseinformation`
--
ALTER TABLE `caseinformation`
  ADD CONSTRAINT `caseinformation_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`),
  ADD CONSTRAINT `caseinformation_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information` (`ContactID`),
  ADD CONSTRAINT `caseinformation_ibfk_3` FOREIGN KEY (`AssetID`) REFERENCES `asset_information` (`AssetID`);

--
-- Constraints for table `casenotes`
--
ALTER TABLE `casenotes`
  ADD CONSTRAINT `casenotes_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation` (`CaseID`);

--
-- Constraints for table `contact_information`
--
ALTER TABLE `contact_information`
  ADD CONSTRAINT `contact_information_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`);

--
-- Constraints for table `materialorder`
--
ALTER TABLE `materialorder`
  ADD CONSTRAINT `materialorder_ibfk_1` FOREIGN KEY (`WOID`) REFERENCES `workorder` (`WOID`);

--
-- Constraints for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  ADD CONSTRAINT `materialorderlineitems_ibfk_1` FOREIGN KEY (`MOID`) REFERENCES `materialorder` (`MOID`);

--
-- Constraints for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  ADD CONSTRAINT `servicecatalog_parts_ibfk_1` FOREIGN KEY (`ServiceCatalogID`) REFERENCES `servicecatalog` (`ServiceCatalogID`);

--
-- Constraints for table `workorder`
--
ALTER TABLE `workorder`
  ADD CONSTRAINT `fk_workorder_case` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation` (`CaseID`),
  ADD CONSTRAINT `workorder_ibfk_1` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation` (`CaseID`);

--
-- Constraints for table `workorder_service_delivery`
--
ALTER TABLE `workorder_service_delivery`
  ADD CONSTRAINT `fk_service_workorder` FOREIGN KEY (`WOID`) REFERENCES `workorder` (`WOID`);

--
-- Constraints for table `workorder_service_delivery_address`
--
ALTER TABLE `workorder_service_delivery_address`
  ADD CONSTRAINT `fk_address_workorder` FOREIGN KEY (`WOID`) REFERENCES `workorder` (`WOID`);

--
-- Constraints for table `workorder_service_delivery_skillset`
--
ALTER TABLE `workorder_service_delivery_skillset`
  ADD CONSTRAINT `fk_skillset_workorder` FOREIGN KEY (`WOID`) REFERENCES `workorder` (`WOID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
