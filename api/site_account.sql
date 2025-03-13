-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2025 at 10:24 PM
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
-- Database: `db_cdax_testing`
--

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
(1, 'Miku21 Store', 'mikucomunity21@gmail.com', '6287731137512', 'Virtual 1', '', 'Virtual World', 'Virtual World', 'Virtual', '13413');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `site_account`
--
ALTER TABLE `site_account`
  ADD PRIMARY KEY (`SiteAccountID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `site_account`
--
ALTER TABLE `site_account`
  MODIFY `SiteAccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
