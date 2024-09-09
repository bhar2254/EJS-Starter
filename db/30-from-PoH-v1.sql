-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 05, 2023 at 09:53 PM
-- Server version: 8.0.34
-- PHP Version: 7.4.33

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- START TRANSACTION;
-- SET time_zone = "+00:00";

-- DROP DATABASE IF EXISTS dev;
-- CREATE DATABASE IF NOT EXISTS dev;
-- USE dev;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS tickets;
CREATE TABLE `tickets` (
  `tickets_id` int NOT NULL,
  `users_id` int DEFAULT '0',
  `displayName` text,
  `ticket_type` text,
  `ticket_note` text,
  `vehicles_id` int DEFAULT '0',
  `vehicle_title` text NOT NULL,
  `permits_id` int DEFAULT '0',
  `plate` text,
  `status` text,
  `state` text,
  `VIN` text,
  `fine` int NOT NULL DEFAULT '0',
  `created_id` int NOT NULL,
  `updated_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`tickets_id`, `users_id`, `displayName`, `ticket_type`, `ticket_note`, `vehicles_id`, `vehicle_title`, `permits_id`, `plate`, `status`, `state`, `VIN`, `fine`, `created_id`, `updated_id`) VALUES
(0, 0, 'System', 'Other - System', 'Test Ticket for System. \r\nVisible only and to all admin.', 0, 'Not Applied to Vehicle', 0, '', 'Active/Unpaid', 'AL', '', 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `history_id` int NOT NULL,
  `update_primary_id` text,
  `saved_record` text,
  `timestamp` datetime DEFAULT NULL,
  `update_table` text,
  `update_user_id` int DEFAULT NULL,
  `update_displayName` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `updates`;
CREATE TABLE `updates` (
  `updates_id` int NOT NULL,
  `update_primary_id` text,
  `saved_record` text,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_table` text,
  `update_user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meta`
--

DROP TABLE IF EXISTS meta;
CREATE TABLE `meta` (
  `meta_id` int NOT NULL,
  `meta_key` text,
  `meta_value` text,
  `created_id` int NOT NULL,
  `updated_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `meta`
--

INSERT INTO `meta` (`meta_id`, `meta_key`, `meta_value`) VALUES
(1, 'active', '[\"Active\",\"Inactive\",\"Marked for Delete\"]'),
(2, 'bool', '[\"false\",\"true\"]'),
(3, 'color', '[\"White\",\"Black\",\"Gray\",\"Silver\",\"Blue\",\"Red\",\"Brown\",\"Green\",\"Orange\",\"Beige\",\"Purple\",\"Gold\",\"Yellow\",\"Other\"]'),
(4, 'ticket_type', '[\"Permit - Counterfeit Permit\",\"Permit - Failure to Purchase\",\"Permit - Improper Display\",\"Permit - Failure to Display\",\"Other - Late Fee\",\"Parking - General\",\"Parking - R\",\"Parking - Service\",\"Parking - Loading Zone\",\"Parking - Disabled\",\"Parking - Fire\",\"Parking - Snow Removal A/B\",\"Parking - Snow Removal C\",\"Other - Repeat Offender\",\"Other - Improper skating\",\"Moving - Driving in unauthorized areas\",\"Moving - Moving or circumventing a barricade\",\"Moving - Speeding\",\"Moving - Failure to comply with traffic signs\",\"Moving - Other\",\"Other - Towed\",\"Other - Warning\",\"Other\"]'),
(5, 'permit_type', '[\"NO PERMIT\",\"APPLICATION\",\"EMP/A\",\"COM/B\",\"RES/R\",\"EXPIRED\",\"DELETED\",\"REVOKED\"]'),
(6, 'state', '[\"AL\",\"AK\",\"AS\",\"AZ\",\"AR\",\"CA\",\"CO\",\"CT\",\"DE\",\"DC\",\"FM\",\"FL\",\"GA\",\"GU\",\"HI\",\"ID\",\"IL\",\"IN\",\"IA\",\"KS\",\"KY\",\"LA\",\"ME\",\"MH\",\"MD\",\"MA\",\"MI\",\"MN\",\"MS\",\"MO\",\"MT\",\"NE\",\"NV\",\"NH\",\"NJ\",\"NM\",\"NY\",\"NC\",\"ND\",\"MP\",\"OH\",\"OK\",\"OR\",\"PW\",\"PA\",\"PR\",\"RI\",\"SC\",\"SD\",\"TN\",\"TX\",\"UT\",\"VT\",\"VI\",\"VA\",\"WA\",\"WV\",\"WI\",\"WY\"]'),
(7, 'status', '[\"Pending Review\",\"Active/Unpaid\",\"Inactive\",\"Paid\",\"Deleted\",\"Appealing\",\"Appeal Denied\",\"Appeal Affirmed\",\"Warning\"]'),
(8, 'role', '[\"Default\",\"Standard\",\"Staff\",\"Admin\",\"Super\",\"Dir. of Security\"]'),
(9, 'make', '[\"Acura\",\"Afeela\",\"Alfa Romeo\",\"Audi\",\"BMW\",\"Bentley\",\"Buick\",\"Cadillac\",\"Chevrolet\",\"Chrysler\",\"Dodge\",\"Fiat\",\"Ford\",\"GMC\",\"Harley Davidson\",\"Honda\",\"Hyundai\",\"Infiniti\",\"Jaguar\",\"Jeep\",\"Kawasaki\",\"Kia\",\"Land Rover\",\"Lexus\",\"Lincoln\",\"Lotus\",\"Maserati\",\"Mazda\",\"Mercedes-Benz\",\"Mercury\",\"Mini\",\"Mitsubishi\",\"Nissan\",\"Pontiac\",\"Porsche\",\"Ram\",\"Saab\",\"Saturn\",\"Scion\",\"Smart\",\"Subaru\",\"Suzuki\",\"Tesla\",\"Toyota\",\"Volkswagen\",\"Volvo\",\"Yamaha\",\"Other\"]'),
(10, 'expire', '[\"2025-08-31\"]'),
(11, 'fine_values', '[0,50,15,5,5,5,15,25,30,20,50,50,25,25,0,25,40,40,20,20,20,0]'),
(12, 'required_fields', '[\"plate\",\"permit_num\",\"year\",\"model\",\"displayName\",\"user_id\"]'),
(13, 'scopes', '{\"users\":{\r\n        \"user_id\":\"ro_all\",\r\n        \"sso_id\":\"ro_all\",\r\n        \"displayName\":\"ro_all\",\r\n        \"ticket_count\":\"ro_all\",\r\n        \"unres_ticket\":\"ro_all\",\r\n        \"vehicle_count\":\"ro_all\",\r\n        \"permit_count\":\"ro_all\",\r\n        \"role\":\"r_staff_w_admin\",\r\n        \"mail\":\"ro_all\",\r\n        \"department\":\"ro_staff\",\r\n        \"phone\":\"rw_all\",\r\n        \"create_time\":\"ro_admin\",\r\n        \"create_user_id\":\"ro_admin\",\r\n        \"create_displayName\":\"ro_admin\",\r\n        \"update_time\":\"ro_admin\",\r\n        \"update_user_id\":\"ro_admin\",\r\n        \"update_displayName\":\"ro_admin\"\r\n    },\r\n    \"vehicles\":{\r\n        \"vehicles_id\":\"rw_all\",\r\n        \"vehicle_title\":\"ro_staff\",\r\n        \"user_id\":\"ro_all\",\r\n        \"displayName\":\"ro_staff\",\r\n        \"color\":\"rw_all\",\r\n        \"make\":\"rw_all\",\r\n        \"model\":\"rw_all\",\r\n        \"year\":\"rw_all\",\r\n        \"plate\":\"rw_all\",\r\n        \"state\":\"rw_all\",\r\n        \"VIN\":\"rw_all\",\r\n        \"permit_id\":\"rw_all\",\r\n        \"permit_num\":\"r_all_w_staff\",\r\n        \"permit_type\":\"r_all_w_admin\",\r\n        \"active\":\"rw_all\",\r\n        \"create_time\":\"ro_admin\",\r\n        \"create_user_id\":\"ro_admin\",\r\n        \"create_displayName\":\"ro_admin\",\r\n        \"update_time\":\"ro_admin\",\r\n        \"update_user_id\":\"ro_admin\",\r\n        \"update_displayName\":\"ro_admin\"\r\n    },\r\n    \"permit\":{\r\n        \"permit_id\":\"ro_all\",\r\n        \"permit_num\":\"r_all_w_staff\",\r\n        \"permit_type\":\"r_all_w_staff\",\r\n        \"expire\":\"r_all_w_staff\",\r\n        \"user_id\":\"ro_all\",\r\n        \"displayName\":\"ro_staff\",\r\n        \"vehicles_id\":\"ro_all\",\r\n        \"vehicle_title\":\"ro_staff\",\r\n        \"create_time\":\"ro_admin\",\r\n        \"create_user_id\":\"ro_admin\",\r\n        \"create_displayName\":\"ro_admin\",\r\n        \"update_time\":\"ro_admin\",\r\n        \"update_user_id\":\"ro_admin\",\r\n        \"update_displayName\":\"ro_admin\"\r\n    },\r\n    \"tickets\":{\r\n        \"ticket_id\":\"ro_all\",\r\n        \"ticket_type\":\"r_all_w_admin\",\r\n        \"user_id\":\"ro_all\",\r\n        \"displayName\":\"ro_all\",\r\n        \"ticket_note\":\"r_all_w_admin\",\r\n        \"vehicles_id\":\"ro_staff\",\r\n        \"vehicle_title\":\"r_all_w_staff\",\r\n        \"permit_num\":\"ro_all\",\r\n        \"permit_id\":\"r_staff_w_admin\",\r\n        \"plate\":\"r_all_w_staff\",\r\n        \"status\":\"r_all_w_staff\",\r\n        \"state\":\"r_all_w_admin\",\r\n        \"VIN\":\"r_all_w_staff\",\r\n        \"fine\":\"r_all_w_admin\",\r\n        \"create_time\":\"ro_admin\",\r\n        \"create_user_id\":\"ro_admin\",\r\n        \"create_displayName\":\"ro_admin\",\r\n        \"update_time\":\"ro_admin\",\r\n        \"update_user_id\":\"ro_admin\",\r\n        \"update_displayName\":\"ro_admin\"\r\n    },\r\n    \"history\":{\r\n        \"hist_id\":\"ro_admin\",\r\n        \"timestamp\":\"ro_admin\",\r\n        \"saved_record\":\"ro_admin\",\r\n        \"update_table\":\"ro_admin\",\r\n        \"update_primary_id\":\"ro_admin\",\r\n        \"update_time\":\"ro_admin\",\r\n        \"update_user_id\":\"ro_admin\",\r\n        \"update_displayName\":\"ro_admin\"\r\n    }\r\n}'),
(14, 'datatables', '{\r\n	\"columns\":{\r\n		\"users\":		[\"displayName\", \"user_id\", \"role\", \"ticket_count\", \"unres_ticket\", \"vehicle_count\"],\r\n		\"vehicles\":		[\"permit_num\",\"permit_type\",\"user_id\",\"displayName\",\"vehicle_title\",\"color\",\"state\",\"plate\",\"active\"],\r\n		\"permit\":			[\"user_id\",\"permit_num\",\"permit_type\",\"vehicle_title\",\"expire\"],\r\n		\"tickets\":	[\"update_displayName\", \"update_user_id\", \"update_table\",\"saved_record\", \"timestamp\"]\r\n	}\r\n}'),
(15, 'forms', '{\r\n	\"id\":					{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Local ID\"},\r\n	\"permit_count\":					{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"number\",\"label\":\"Permits and Applications\"},\r\n	\"year\":					{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"year\",\"label\":\"Year\"},\r\n	\"sso_id\":				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"SSO ID\"},\r\n	\"fine\":					{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"number\",\"label\":\"Fine\"},\r\n	\"mail\":					{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"E-mail\"},\r\n	\"make\":					{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Make\"},\r\n	\"model\":				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Model\"},\r\n	\"plate\": 				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Plate\"},\r\n	\"phone\": 				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"tel\",\"label\":\"Phone <span style=\\\"font-size:x-small;color:var(--poh-dark-grey)\\\">(641-123-4567)</span>\"},\r\n	\"role\": 				{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Role\"},\r\n	\"color\":				{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Color\"},\r\n	\"state\": 				{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"State\"},\r\n	\"surname\":				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Surname\"},\r\n	\"user_id\":				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"number\",\"label\":\"IHCC ID\"},\r\n	\"status\":				{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Status\"},\r\n	\"permit_id\":				{\"default\":\"0\",\"system\":false,\"format\":\"input\",\"type\":\"number\",\"label\":\"Permit ID\"},\r\n	\"VIN\": 					{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"VIN <span style=\\\"font-size:x-small;color:var(--poh-dark-grey)\\\">(Optional)</span>\"},\r\n	\"active\": 				{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Status\"},\r\n	\"expire\":				{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"date\",\"label\":\"Expiration\"},\r\n	\"shortname\":			{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Short Name\"},\r\n	\"department\":			{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Department\"},\r\n	\"permit_num\":				{\"default\":\"NO PERMIT\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Permit Number\"},\r\n	\"givenName\":			{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Given Name\"},\r\n	\"permit_type\":			{\"default\":\"NO PERMIT\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Permit Type\"},\r\n	\"vehicles_id\":			{\"default\":\"0\",\"system\":false,\"format\":\"input\",\"type\":\"number\",\"label\":\"Vehicle ID\"},\r\n	\"update_time\":			{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"datetime-local\",\"label\":\"Updated on\"},\r\n	\"ticket_id\":			{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"number\",\"label\":\"Ticket ID\"},\r\n	\"vehicle_title\": 		{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Vehicle\"},\r\n	\"displayName\":			{\"default\":\"\",\"system\":false,\"format\":\"input\",\"type\":\"text\",\"label\":\"Display Name\"},\r\n	\"ticket_note\":		{\"default\":\"\",\"system\":false,\"format\":\"textarea\",\"type\":\"text\",\"label\":\"Ticket Note\"},\r\n	\"vehicle_count\":		{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"number\",\"label\":\"Registered Vehicles\"},\r\n	\"create_time\":			{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"datetime-local\",\"label\":\"Created on\"},\r\n	\"create_displayName\":	{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Created by\"},\r\n	\"create_user_id\":		{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Creator ID\"},\r\n	\"ticket_type\":		{\"default\":\"\",\"system\":false,\"format\":\"select\",\"type\":\"select\",\"label\":\"Ticket Reason\"},\r\n	\"ticket_count\":		{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"number\",\"label\":\"Tickets\"},\r\n	\"update_displayName\":	{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Updated by\"},\r\n	\"update_user_id\":		{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Updated ID\"},\r\n	\"update_table\":			{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Record Table\"},\r\n	\"update_primary_id\":	{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"text\",\"label\":\"Record ID\"},\r\n	\"saved_record\":			{\"default\":\"\",\"system\":true,\"format\":\"textarea\",\"type\":\"text\",\"label\":\"Record\"},\r\n	\"timestamp\":			{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"datetime-local\",\"label\":\"Timestamp\"},\r\n	\"hist_id\":				{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"number\",\"label\":\"History ID\"},\r\n	\"unres_ticket\":		{\"default\":\"\",\"system\":true,\"format\":\"input\",\"type\":\"number\",\"label\":\"Open Tickets\"}\r\n}'),
(16, 'scopeTypes', '{\r\n	\"system_r_all\":[10,1,10,10],\r\n	\"system_r_staff\":[10,2,10,10],\r\n	\"system_r_admin\":[10,3,10,10],\r\n	\"system_r_super\":[10,4,10,10],\r\n	\"system_r_dir\":[10,5,10,10],\r\n	\"rw_all\":[2,1,1,3],\r\n	\"r_all_w_dir\":[2,1,5,5],\r\n	\"r_staff_w_dir\":[2,2,5,5],\r\n	\"r_admin_w_dir\":[2,3,5,5],\r\n	\"r_super_w_dir\":[2,4,5,5],\r\n	\"rw_dir\":[2,5,5,5],\r\n	\"r_all_w_super\":[2,1,4,4],\r\n	\"r_staff_w_super\":[2,2,4,4],\r\n	\"r_admin_w_super\":[2,3,4,4],\r\n	\"rw_super\":[2,4,4,4],\r\n	\"r_all_w_admin\":[2,1,3,3],\r\n	\"r_staff_w_admin\":[2,2,3,3],\r\n	\"rw_admin\":[2,1,3,3],\r\n	\"r_all_w_staff\":[2,1,2,3],\r\n	\"rw_staff\":[2,2,2,3],\r\n	\"ro_all\":[2,1,10,10],\r\n	\"ro_staff\":[2,2,10,10],\r\n	\"ro_admin\":[2,3,10,10],\r\n	\"ro_super\":[2,4,10,10],\r\n	\"ro_dir\":[2,5,10,10],\r\n	\"no_all\":[2,0,10,10]\r\n}'),
(17, 'consoleColors', '{\r\n	\"Reset\": \"\\\\x1b[0m\",\r\n	\"Bright\": \"\\\\x1b[1m\",\r\n	\"Dim\": \"\\\\x1b[2m\",\r\n	\"Underscore\": \"\\\\x1b[4m\",\r\n	\"Blink\": \"\\\\x1b[5m\",\r\n	\"Reverse\": \"\\\\x1b[7m\",\r\n	\"Hidden\": \"\\\\x1b[8m\",\r\n	\"FgBlack\": \"\\\\x1b[30m\",\r\n	\"FgRed\": \"\\\\x1b[31m\",\r\n	\"FgGreen\": \"\\\\x1b[32m\",\r\n	\"FgYellow\": \"\\\\x1b[33m\",\r\n	\"FgBlue\": \"\\\\x1b[34m\",\r\n	\"FgMagenta\": \"\\\\x1b[35m\",\r\n	\"FgCyan\": \"\\\\x1b[36m\",\r\n	\"FgWhite\": \"\\\\x1b[37m\",\r\n	\"FgGray\": \"\\\\x1b[90m\",\r\n	\"BgBlack\": \"\\\\x1b[40m\",\r\n	\"BgRed\": \"\\\\x1b[41m\",\r\n	\"BgGreen\": \"\\\\x1b[42m\",\r\n	\"BgYellow\": \"\\\\x1b[43m\",\r\n	\"BgBlue\": \"\\\\x1b[44m\",\r\n	\"BgMagenta\": \"\\\\x1b[45m\",\r\n	\"BgCyan\": \"\\\\x1b[46m\",\r\n	\"BgWhite\": \"\\\\x1b[47m\",\r\n	\"BgGray\": \"\\\\x1b[100m\"\r\n}');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS notifications;
CREATE TABLE `notifications` (
  `notifications_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `guid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `users_id` int DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `read` tinyint DEFAULT 0,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `notifications` (`users_id`, `message`) VALUES
(0,'This is a test message!!!'),
(1,'This is a test message!!!'),
(2,'This is a test message!!!'),
(3,'This is a test message!!!'),
(4,'This is a test message!!!'),
(5,'This is a test message!!!'),
(6,'This is a test message!!!');
-- --------------------------------------------------------

--
-- Table structure for table `permits`
--

DROP TABLE IF EXISTS permits;
CREATE TABLE `permits` (
  `permits_id` int NOT NULL,
  `users_id` int DEFAULT '0',
  `permit_num` text NOT NULL,
  `permit_type` text,
  `expire` date DEFAULT NULL,
  `vehicles_id` int DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `create_user_id` int DEFAULT '0',
  `updates_id` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `permit`
--

INSERT INTO `permits` (`permits_id`, `users_id`, `permit_num`, `permit_type`, `expire`, `vehicles_id`, `create_user_id`, `updates_id`) VALUES
(0, 0, 'NO PERMIT', 'NO PERMIT', '2025-08-31', 0, 0, 0);
-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS payments;
CREATE TABLE `payments` (
  `payments_id` int NOT NULL,
  `timestamp` datetime DEFAULT NULL,
  `record_id` int DEFAULT NULL,
  `updates_id` int DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS users;
CREATE TABLE `users` (
  `users_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `guid` CHAR(36) NOT NULL DEFAULT (UUID()),
  `sso_id` varchar(64) NOT NULL,
  `campus_id` int NOT NULL,
  `displayName` text NOT NULL,
  `role` int DEFAULT NULL,
  `mail` text,
  `phone` text,
  `department` text,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` int DEFAULT '0',
  `updates_user_id` int DEFAULT '0',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DELIMITER //

CREATE TRIGGER set_default_refresh_before_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.update_time = CURRENT_TIMESTAMP;
END;
//

DELIMITER ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`sso_id`, `users_id`, `displayName`, `role`, `mail`, `phone`, `department`, `create_time`, `create_user_id`, `create_displayName`, `update_time`, `update_user_id`, `update_displayName`) VALUES
('', -1, 'Unknown', 0, NULL, NULL, 'Information Technology', '2023-08-10 12:00:00', 0, NULL, '2023-08-10 12:00:00', 0, 'System'),
('', 0, 'System', 0, NULL, NULL, 'Information Technology', '2023-08-10 12:00:00', 0, NULL, '2023-08-10 12:00:00', 0, 'System');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS vehicles;
CREATE TABLE `vehicles` (
  `vehicles_id` int NOT NULL,
  `users_id` int DEFAULT '0',
  `vehicle_title` text,
  `color` text,
  `make` text,
  `model` text,
  `year` int DEFAULT '1886',
  `plate` text,
  `state` text,
  `VIN` text,
  `permits_id` int DEFAULT '0',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `create_user_id` int DEFAULT '0',
  `updates_id` int DEFAULT '0',
  `active` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT (_utf8mb4'Active')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicles_id`, `users_id`, `vehicle_title`, `color`, `make`, `model`, `year`, `plate`, `state`, `VIN`, `permits_id`, `create_time`, `create_user_id`, `update_time`, `update_user_id`, `active`) VALUES
(0, 0, 'Not Applied To Vehicle', 'Grey', 'System', 'Placeholder', 1969, 'SYSTEM', 'IA', 'SYSTEMPLACEHOLDER', 0, '1970-01-01 00:00:00', 0, '1970-01-01 00:00:00', 0, 'Actvive');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`tickets_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `meta`
--
ALTER TABLE `meta`
  ADD PRIMARY KEY (`meta_id`);

--
-- Indexes for table `permit`
--
ALTER TABLE `permit`
  ADD PRIMARY KEY (`permits_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payments_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicles_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `tickets_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `meta`
--
ALTER TABLE `meta`
  MODIFY `meta_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `permit`
--
ALTER TABLE `permit`
  MODIFY `permits_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payments_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `users_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicles_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
