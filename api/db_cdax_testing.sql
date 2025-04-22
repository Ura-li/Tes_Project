-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2025 at 08:03 AM
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
  `SerialNumber` varchar(20) NOT NULL,
  `ProductNumber` varchar(11) NOT NULL,
  `SiteAccountID` int(11) DEFAULT NULL,
  `ContactID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `asset_information`
--

INSERT INTO `asset_information` (`AssetID`, `SerialNumber`, `ProductNumber`, `SiteAccountID`, `ContactID`) VALUES
(2, '5CG1329SV6', '572GH1', 2, 2),
(3, '5B213', '8712', NULL, 3),
(4, '5GC', '882', 3, 4),
(5, 'GT544', '7676', NULL, 5),
(9, '5CG1329SV7', '6G1L7PA', 4, 17),
(10, '23', '12', 9, 18);

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
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `CaseClosedDate` datetime DEFAULT NULL,
  `CaseNote` int(11) DEFAULT NULL,
  `SymptomCode` int(11) DEFAULT NULL,
  `CaseResolution` text DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `Owner` int(11) DEFAULT NULL,
  `WorkGround` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `caseinformation`
--

INSERT INTO `caseinformation` (`CaseID`, `SiteAccountID`, `ContactID`, `AssetID`, `CaseSubject`, `CaseType`, `KCI_Flag`, `IncomingChannel`, `CaseStatus`, `CasePriority`, `CustomerSeverity`, `CreatedOn`, `CaseClosedDate`, `CaseNote`, `SymptomCode`, `CaseResolution`, `CreatedBy`, `Owner`, `WorkGround`) VALUES
(15715, 4, 17, 9, 'wesad', 'Depot Repair', 0, 'Email', 'Open', 'Medium', 'Normal', '2025-04-15 13:54:31', NULL, 5, 2, '', NULL, NULL, NULL),
(19081, 4, 17, 9, 'Victus Cleaning', 'Depot Repair', 0, 'Email', 'Open', 'Medium', 'Normal', '2025-04-21 03:03:07', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
  `CreatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `casenotes`
--

INSERT INTO `casenotes` (`NoteID`, `CaseID`, `LogType`, `ActionType`, `Template`, `VisibleExternally`, `MinutesSpent`, `Note`, `CreatedOn`) VALUES
(5, 15715, 'NotesLog', '', '', 1, 0, ' Product \nSerial no.	:	5CD2355XDD\nProduct tower	:	PSG\nProduct group	:	Consumer\nProduct type	:	Notebook/Laptop\nProduct line	:	M7\nProduct no.	:	6G1L2PA\nProduct name	:	Victus by HP 15.6 inch Gaming Laptop 15-fa0000 (599K1AV)\nEnd of sales date	:	31 Aug 2023\nEnd of support date	:	31 Aug 2026\n\n***********************\nProblem desc.	:	Laptop mati\nCase note	:	\n \nCase type	:	Bench\n\n\n\n**************\nasdasda', '2025-04-16 08:28:47');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_information`
--

INSERT INTO `contact_information` (`ContactID`, `SiteAccountID`, `Salutation`, `FirstName`, `LastName`, `Email`, `PreferredLanguage`, `Phone`, `Mobile`, `WorkPhone`, `WorkExtension`, `OtherPhone`, `OtherExtension`, `Fax`, `AddressLine1`, `AddressLine2`, `City`, `StateProvince`, `Country`, `ZipPostalCode`) VALUES
(2, 2, 'Mr. ', 'Gunawan', 'Gun', 'gunawan@gmail.com', 'Bahasa Indonesia', '08878287', '08878287', '08878287', '', '', '', '', 'Jln Kebun jeruk', '', 'Jakarta', 'DKI Jakarta', 'Indonesia', '4444'),
(3, NULL, 'Mr. ', 'Hanny', 'niyah', 'hanny@gmail.com', 'Bahasa Indonesia', '08654321', '08654321', '08654321', '', '', '', '', 'Jln Duren', '', 'Brebes', 'Jawa Tengah', 'Indonesia', '4022'),
(4, 3, 'Mr. ', 'Hanny', 'kyuga', 'hanny@gmail.com', 'Bahasa Indonesia', '98772', '98772', '', '', '', '', '', 'jln kebun jeruk', '', 'Jakarta', 'DKI Jakart', 'Indonesia', '454545'),
(5, NULL, 'Mr. ', 'Friska', 'Latuconsina', 'Friska@gmail.com', 'Bahasa Indonesia', '0896', '', '', '', '', '', '', 'Jl Sutomo', '', 'Kediri', 'Jawa Timur', 'Indonesia', '6565'),
(8, 6, 'Mr. ', 'Joshua', 'Harmes', 'joshuaharmes@gmai.com', 'Spanish', '1872923', '', '', '', '', '', '', 'Jln Kerupuk', '', 'Jambi', 'Jambi', 'Indonesia', '88928'),
(16, 4, 'Mrs. ', 'Mey', 'Almasya', 'mey-miku21@gmail.com', 'English', '085755162771', '085755162771', '', '', '', '', '', 'Solo', '', 'Surakarta', 'Jawa Tengah', 'Indonesia', '40611'),
(17, 4, 'Mr. ', 'Miku21', 'Margareth', 'mikucomunity21@gmail.com', 'Spanish', '087731137512', '087731137512', '', '', '', '', '', 'Virtual Reality', '', 'Virtual World', 'Virtual', 'Indonesia', '12312'),
(18, 9, 'Mr. ', 'RAFA', 'ELFARIZI', 'poo@gmail.com', 'Spanish', '222', '', '', '', '', '', '', 'Dukuh Cenang Desa Cenggini RT 03 RW 04', '', 'Kabupaten tegal', 'Jawa Tengah', '', '40511');

-- --------------------------------------------------------

--
-- Table structure for table `global_trade_check`
--

CREATE TABLE `global_trade_check` (
  `id_gtc` int(11) NOT NULL,
  `global_trade_status` varchar(30) NOT NULL,
  `embargoed_country` varchar(30) NOT NULL,
  `gt_override_reason` varchar(30) NOT NULL,
  `gt_details` varchar(50) NOT NULL,
  `screening_id` varchar(25) NOT NULL,
  `gt_active_listening` varchar(30) NOT NULL,
  `gt_al_comments` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `MOID` varchar(13) NOT NULL,
  `WOID` varchar(13) DEFAULT NULL,
  `OrderNumber` varchar(100) DEFAULT NULL,
  `OrderStatus` varchar(50) DEFAULT NULL,
  `OrderType` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `SalesOrderNumber` varchar(100) DEFAULT NULL,
  `RMANumber` varchar(100) DEFAULT NULL,
  `ReadyForClosureDate` datetime DEFAULT NULL,
  `Owner` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `materialorder`
--

INSERT INTO `materialorder` (`MOID`, `WOID`, `OrderNumber`, `OrderStatus`, `OrderType`, `CreatedOn`, `SalesOrderNumber`, `RMANumber`, `ReadyForClosureDate`, `Owner`) VALUES
('MO-0001', 'WO-0001', NULL, 'Created', 'Repair', '2025-04-20 21:01:42', NULL, NULL, NULL, 'Miku21'),
('MO-0002', 'WO-0002', NULL, 'Created', 'Repair', '2025-04-21 03:03:25', NULL, NULL, NULL, 'Miku21');

-- --------------------------------------------------------

--
-- Table structure for table `materialorderlineitems`
--

CREATE TABLE `materialorderlineitems` (
  `LineItemID` int(11) NOT NULL,
  `MOID` varchar(13) DEFAULT NULL,
  `LineNumber` int(11) DEFAULT NULL,
  `PartNumber` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `ATPStatus` varchar(50) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `materialorderlineitems`
--

INSERT INTO `materialorderlineitems` (`LineItemID`, `MOID`, `LineNumber`, `PartNumber`, `Description`, `ATPStatus`, `Price`, `Quantity`) VALUES
(3, 'MO-0001', 1, 'M91238-005', 'SKO-WLAN 6 RTK ax 2x2+BT RTL88', NULL, 500000.00, 1),
(4, 'MO-0001', 2, 'N42547-001', 'SPS-CABLE LCD FHD 40P', NULL, 120000.00, 1),
(7, 'MO-0002', 1, 'M91238-005', 'SKO-WLAN 6 RTK ax 2x2+BT RTL88', NULL, 500000.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_information`
--

CREATE TABLE `product_information` (
  `ProductNumber` varchar(11) NOT NULL,
  `ProductLine` varchar(3) NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `ProductTypeID` int(11) NOT NULL,
  `end_of_sales_date` date DEFAULT NULL,
  `end_of_support_date` date DEFAULT NULL,
  `vendor` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_information`
--

INSERT INTO `product_information` (`ProductNumber`, `ProductLine`, `ProductName`, `ProductTypeID`, `end_of_sales_date`, `end_of_support_date`, `vendor`) VALUES
('12', '12', '44', 7, NULL, NULL, NULL),
('2LB19A', 'GC', 'HP Ink Tank 115', 2, NULL, NULL, NULL),
('483R7PA', 'KV', 'HP 14s-cf2500TX', 5, NULL, NULL, 'HP'),
('572GH1', 'LP', 'HP Elite Book G3 ', 2, NULL, NULL, NULL),
('61G62PA', '6U', 'HP 245 G8', 5, NULL, NULL, 'HP'),
('6G1L7PA', 'M7', 'Victus by HP 15.6 inch Gaming Laptop 15-fb0000 (598V1AV)', 5, NULL, NULL, 'HP'),
('7676', 'JK', 'HP 14s-cf2500TX', 2, NULL, NULL, NULL),
('8712', 'KJ', 'HP 14s-cf2500TX', 2, NULL, NULL, NULL),
('882', 'gc', 'HP Elite Book G3 ', 2, NULL, NULL, NULL),
('8988', 'LP', 'HP Elite Book G3 ', 2, NULL, NULL, NULL);

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
(1, 'Accessories', 'PSG', 'Commercial'),
(2, 'Desktop', 'PSG', 'Consumer'),
(3, 'Tablet', 'PSG', 'Consumer'),
(4, 'Monitor', 'PSG', 'Consumer'),
(5, 'Notebook/Laptop', 'PSG', 'Consumer'),
(6, 'Desktop - C ', 'PSG', 'Consumer'),
(7, 'Calculator', 'PSG', 'Consumer');

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
  `AssetID` int(11) NOT NULL,
  `Service_offerID` varchar(8) NOT NULL,
  `PartNumber` varchar(100) DEFAULT NULL,
  `WarrantyStatus` varchar(50) DEFAULT NULL,
  `Currency` varchar(10) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `Tax` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `servicecatalog`
--

INSERT INTO `servicecatalog` (`ServiceCatalogID`, `AssetID`, `Service_offerID`, `PartNumber`, `WarrantyStatus`, `Currency`, `Price`, `Tax`, `Total`) VALUES
(6, 9, 'DEPOT1', NULL, NULL, NULL, 1200.00, 0.00, 0.00),
(9, 9, 'DEPOT1', NULL, NULL, NULL, 1200.00, 0.00, 0.00);

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
  `PartNumber` varchar(100) NOT NULL,
  `Keyword` varchar(100) DEFAULT NULL,
  `PartDescription` text DEFAULT NULL,
  `Orderability` tinyint(1) DEFAULT NULL,
  `RestrictionReason` text DEFAULT NULL,
  `CSR_Flag` tinyint(1) DEFAULT 0,
  `ROHS_Flag` tinyint(1) DEFAULT 0,
  `Returnable_Flag` tinyint(1) DEFAULT 0,
  `HardRoll_Flag` tinyint(1) DEFAULT 0,
  `DangerousGoods_Flag` tinyint(1) DEFAULT 0,
  `LithiumBattery_Flag` tinyint(1) DEFAULT 0,
  `Oversize_Flag` tinyint(1) DEFAULT 0,
  `Heavy_Flag` tinyint(1) DEFAULT 0,
  `Price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `FreightPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `Shipping_Fee` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `servicecatalog_parts`
--

INSERT INTO `servicecatalog_parts` (`PartNumber`, `Keyword`, `PartDescription`, `Orderability`, `RestrictionReason`, `CSR_Flag`, `ROHS_Flag`, `Returnable_Flag`, `HardRoll_Flag`, `DangerousGoods_Flag`, `LithiumBattery_Flag`, `Oversize_Flag`, `Heavy_Flag`, `Price`, `FreightPrice`, `Tax`, `Total`, `Shipping_Fee`) VALUES
('M91238-005', 'WLAN WIRELESS ACCESS NETWORK', 'SKO-WLAN 6 RTK ax 2x2+BT RTL88', 1, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 500000.00, 0.00, 0.00, 0.00, 0.00),
('N42547-001', 'INTER CONNECT CABLE', 'SPS-CABLE LCD FHD 40P', 1, NULL, 0, 0, 1, 0, 0, 0, 0, 0, 120000.00, 0.00, 0.00, 0.00, 0.00);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_account`
--

INSERT INTO `site_account` (`SiteAccountID`, `Company`, `Email`, `PrimaryPhone`, `AddressLine1`, `AddressLine2`, `City`, `StateProvince`, `Country`, `ZipPostalCode`) VALUES
(2, 'PT Angin Ribut', 'anginribut@gmail.com', '0877723818', 'Jln Merbabu', '', 'Tegal', 'jawa tengah', 'Indonesia', '5555'),
(3, 'PT Teh hijau', 'tehhijau@gmail.com', '0865424162', 'Jl Sutomo', '', 'Gresik', 'Jawa Tengah', 'Indonesia', '454545'),
(4, 'Miku21 Store', 'mikucomunity21@gmail.com', '087731137512', 'Virtual Reality', '', 'Virtual World', 'Virtual', 'Indonesia', '12312'),
(6, 'PT Bango', 'bangsejahtera@gmail.com', '88729', 'Jln Kemangi', '', 'Surakarta', 'Jawa ', '', '87291'),
(8, 'AFM Company', 'afmcompany@gmail.com', '083834685279', 'Jakarta Selatan', '', 'Jakarta', 'DKI Jakarta', 'Inggris', '12343'),
(9, 'PT. Kapal Api', 'kapalapi@gmail.com', '6287731137512', 'Jakarta Pusat', '', 'Jakarta', 'DKI Jakarta', 'Indonesia', '13413'),
(10, 'Tech Solutions Inc.', 'contact@techsolutions.com', '+1-800-555-1234', '123 Innovation Street', 'Suite 200', 'San Francisco', 'California', 'United States', '94105'),
(11, 'Global Corp', 'info@globalcorp.com', '+44-20-7946-0958', '456 Business Ave', NULL, 'London', 'Greater London', 'United Kingdom', 'EC1A 1BB'),
(12, 'Futuristic Systems', 'support@futuresys.io', '+81-3-1234-5678', '789 Tech Park', 'Building A', 'Tokyo', 'Tokyo Metropolis', 'Japan', '100-0001'),
(13, 'Neo AI Innovators', 'hello@aiinnovators.ai', '+49-30-9876-5432', '12 Machine Learning Blvd', '', 'Berlin', 'Berlin', 'Germany', '10117'),
(14, 'NextGen Robotics', 'contact@nextgenrobotics.com', '+33-1-2345-6789', '99 Cybernetic Lane', 'Floor 5', 'Paris', 'Île-de-France', 'France', '75008');;

-- --------------------------------------------------------

--
-- Table structure for table `symptom_codes`
--

CREATE TABLE `symptom_codes` (
  `SymptomCodeID` int(11) NOT NULL,
  `SymptomCode` varchar(50) NOT NULL,
  `TopCategory` varchar(50) NOT NULL,
  `SubCategory` varchar(50) NOT NULL,
  `QualityCodes` varchar(50) DEFAULT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `symptom_codes`
--

INSERT INTO `symptom_codes` (`SymptomCodeID`, `SymptomCode`, `TopCategory`, `SubCategory`, `QualityCodes`, `CreatedOn`) VALUES
(1, 'No Boot', 'HyperX Memory', 'Memory Defective Product', '', '2025-04-15 19:44:25'),
(2, 'Module Fails Memtest', 'HyperX Memory', 'Memory Defective Product', '', '2025-04-15 19:44:25');

-- --------------------------------------------------------

--
-- Table structure for table `test-table-without-migration`
--

CREATE TABLE `test-table-without-migration` (
  `id` int(11) NOT NULL,
  `name` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test_table`
--

CREATE TABLE `test_table` (
  `MOID` int(11) NOT NULL,
  `WOID` int(11) DEFAULT NULL,
  `OrderNumber` varchar(100) DEFAULT NULL,
  `OrderStatus` varchar(50) DEFAULT NULL,
  `OrderType` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `SalesOrderNumber` varchar(100) DEFAULT NULL,
  `RMANumber` varchar(100) DEFAULT NULL,
  `ReadyForClosureDate` datetime DEFAULT NULL,
  `Owner` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warranty_services`
--

CREATE TABLE `warranty_services` (
  `Service_offerID` varchar(8) NOT NULL,
  `Service_description` varchar(255) NOT NULL,
  `CTat_RTime` varchar(5) DEFAULT NULL,
  `Price` float NOT NULL DEFAULT 0,
  `Shipping_Fee` float NOT NULL DEFAULT 0,
  `qty_ws` int(11) NOT NULL DEFAULT 0,
  `Tax` float NOT NULL DEFAULT 0,
  `Total` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warranty_services`
--

INSERT INTO `warranty_services` (`Service_offerID`, `Service_description`, `CTat_RTime`, `Price`, `Shipping_Fee`, `qty_ws`, `Tax`, `Total`) VALUES
('APBPRP', 'SRS/CREW 1WDW DEF RETURN', '003', 0, 0, 0, 0, 0),
('DEPOT1', 'DEPOT REPAIR', '001', 1200, 0, 0, 0, 0),
('DEPOT2', 'DEPOT REPAIR - 2DAY', '002', 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `workorder`
--

CREATE TABLE `workorder` (
  `WOID` varchar(13) NOT NULL,
  `CaseID` int(11) DEFAULT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `workorder`
--

INSERT INTO `workorder` (`WOID`, `CaseID`, `WorkOrderNumber`, `WorkOrderType`, `Priority`, `SystemStatus`, `SubStatus`, `PreferredDay`, `PreferredTime`, `ShipmentCountry`, `ShipmentState`, `CreatedOn`, `Owner`) VALUES
('WO-0001', 15715, 'WO-0001', 'DepotRepair', NULL, 'Open', NULL, NULL, NULL, NULL, NULL, '2025-04-20 21:01:42', 'Miku21'),
('WO-0002', 19081, 'WO-0002', 'DepotRepair', NULL, 'Open', NULL, NULL, NULL, NULL, NULL, '2025-04-21 03:03:25', 'Miku21');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('6894c1ec-8231-47ad-8af3-38fa7e684900', 'd1ed88b4fa1681ee2da26d68858fbab7ba5d8aba7321410cee789acc839f4afe', '2025-04-18 15:19:31.276', '20250418151931_adding_test_without_schema', NULL, NULL, '2025-04-18 15:19:31.265', 1),
('93d80a0c-2535-4df1-a666-ae4e460264a6', '2942465357dc57e57a8ed5fbe306ecc078839a4e3f00d2996235394b23472016', '2025-04-18 14:42:32.762', '20250418144232_adding_test_table', NULL, NULL, '2025-04-18 14:42:32.743', 1),
('a1cd3d92-9c84-4bc9-ad38-d2f47b544ccc', 'bebaf6e104b14963411ec4c7600ab6febfa8d86ba3cceea93d6891ff7255dc61', '2025-04-17 03:56:12.205', '20250417035612_changing_shipping_fee', NULL, NULL, '2025-04-17 03:56:12.192', 1),
('f7e5376b-15f3-4548-b308-5f102afa8d0b', 'a9161b38b3a2072a5439ff3f2d7b1feaf85c7c236302ba465e4d7b0f928854e6', '2025-04-17 03:56:09.334', '20250417033130_init', NULL, NULL, '2025-04-17 03:56:08.047', 1);

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
  ADD KEY `ContactID` (`ContactID`),
  ADD KEY `ProductNumber` (`ProductNumber`);

--
-- Indexes for table `caseinformation`
--
ALTER TABLE `caseinformation`
  ADD PRIMARY KEY (`CaseID`),
  ADD KEY `AssetID` (`AssetID`),
  ADD KEY `ContactID` (`ContactID`),
  ADD KEY `SiteAccountID` (`SiteAccountID`),
  ADD KEY `CaseNote` (`CaseNote`),
  ADD KEY `SymptomCode` (`SymptomCode`);

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
  ADD KEY `MOID` (`MOID`),
  ADD KEY `PartNumber` (`PartNumber`);

--
-- Indexes for table `product_information`
--
ALTER TABLE `product_information`
  ADD PRIMARY KEY (`ProductNumber`),
  ADD KEY `ProductTypeID` (`ProductTypeID`);

--
-- Indexes for table `product_type`
--
ALTER TABLE `product_type`
  ADD PRIMARY KEY (`ProductTypeID`);

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
  ADD PRIMARY KEY (`ServiceCatalogID`),
  ADD KEY `AssetID` (`AssetID`),
  ADD KEY `PartNumber` (`PartNumber`),
  ADD KEY `Service_offerID` (`Service_offerID`);

--
-- Indexes for table `servicecatalog_parts`
--
ALTER TABLE `servicecatalog_parts`
  ADD PRIMARY KEY (`PartNumber`);

--
-- Indexes for table `site_account`
--
ALTER TABLE `site_account`
  ADD PRIMARY KEY (`SiteAccountID`);

--
-- Indexes for table `symptom_codes`
--
ALTER TABLE `symptom_codes`
  ADD PRIMARY KEY (`SymptomCodeID`);

--
-- Indexes for table `test-table-without-migration`
--
ALTER TABLE `test-table-without-migration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`MOID`),
  ADD KEY `WOID` (`WOID`);

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
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);
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
  MODIFY `NoteID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- AUTO_INCREMENT for table `global_trade_check`
--
ALTER TABLE `global_trade_check`
  MODIFY `id_gtc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  MODIFY `LineItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `ProductTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- AUTO_INCREMENT for table `site_account`
--
ALTER TABLE `site_account`
  MODIFY `SiteAccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `symptom_codes`
--
ALTER TABLE `symptom_codes`
  MODIFY `SymptomCodeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `test-table-without-migration`
--
ALTER TABLE `test-table-without-migration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_table`
--
ALTER TABLE `test_table`
  MODIFY `MOID` int(11) NOT NULL AUTO_INCREMENT;
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
  ADD CONSTRAINT `asset_information_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information` (`ContactID`),
  ADD CONSTRAINT `asset_information_ibfk_3` FOREIGN KEY (`ProductNumber`) REFERENCES `product_information` (`ProductNumber`);

--
-- Constraints for table `caseinformation`
--
ALTER TABLE `caseinformation`
  ADD CONSTRAINT `caseinformation_ibfk_1` FOREIGN KEY (`SiteAccountID`) REFERENCES `site_account` (`SiteAccountID`),
  ADD CONSTRAINT `caseinformation_ibfk_2` FOREIGN KEY (`ContactID`) REFERENCES `contact_information` (`ContactID`),
  ADD CONSTRAINT `caseinformation_ibfk_3` FOREIGN KEY (`AssetID`) REFERENCES `asset_information` (`AssetID`),
  ADD CONSTRAINT `caseinformation_ibfk_4` FOREIGN KEY (`CaseNote`) REFERENCES `casenotes` (`NoteID`),
  ADD CONSTRAINT `caseinformation_ibfk_5` FOREIGN KEY (`SymptomCode`) REFERENCES `symptom_codes` (`SymptomCodeID`);

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
  ADD CONSTRAINT `materialorder_ibfk_1` FOREIGN KEY (`WOID`) REFERENCES `workorder` (`WOID`) ON UPDATE CASCADE;

--
-- Constraints for table `materialorderlineitems`
--
ALTER TABLE `materialorderlineitems`
  ADD CONSTRAINT `materialorderlineitems_ibfk_1` FOREIGN KEY (`MOID`) REFERENCES `materialorder` (`MOID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `materialorderlineitems_ibfk_2` FOREIGN KEY (`PartNumber`) REFERENCES `servicecatalog_parts` (`PartNumber`) ON UPDATE CASCADE;

--
-- Constraints for table `product_information`
--
ALTER TABLE `product_information`
  ADD CONSTRAINT `product_information_ibfk_1` FOREIGN KEY (`ProductTypeID`) REFERENCES `product_type` (`ProductTypeID`);

--
-- Constraints for table `servicecatalog`
--
ALTER TABLE `servicecatalog`
  ADD CONSTRAINT `servicecatalog_ibfk_1` FOREIGN KEY (`AssetID`) REFERENCES `asset_information` (`AssetID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicecatalog_ibfk_2` FOREIGN KEY (`PartNumber`) REFERENCES `servicecatalog_parts` (`PartNumber`) ON UPDATE CASCADE,
  ADD CONSTRAINT `servicecatalog_ibfk_3` FOREIGN KEY (`Service_offerID`) REFERENCES `warranty_services` (`Service_offerID`) ON UPDATE CASCADE;

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
