CREATE DATABASE  IF NOT EXISTS `livelyshelfsdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `livelyshelfsdb`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: livelyshelfsdb
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accountmember`
--

DROP TABLE IF EXISTS `accountmember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountmember` (
  `AccountID` int NOT NULL AUTO_INCREMENT,
  `AccountName` varchar(45) DEFAULT NULL,
  `AccessLevel` varchar(45) DEFAULT NULL,
  `ExpiryDate` datetime DEFAULT NULL,
  `HouseHoldID` int NOT NULL,
  PRIMARY KEY (`AccountID`),
  KEY `fk_householdID_account_idx` (`HouseHoldID`),
  CONSTRAINT `fk_householdID_account` FOREIGN KEY (`HouseHoldID`) REFERENCES `household` (`HouseHoldID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountmember`
--

LOCK TABLES `accountmember` WRITE;
/*!40000 ALTER TABLE `accountmember` DISABLE KEYS */;
/*!40000 ALTER TABLE `accountmember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `analytics` (
  `UserID` int DEFAULT NULL,
  `FoodItemID` int DEFAULT NULL,
  `ExpirationStatus` varchar(45) DEFAULT NULL,
  `Quantity` varchar(45) DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  `DateExpired` date DEFAULT NULL,
  KEY `InventoryID_idx` (`UserID`),
  KEY `fk_foodItem_analytics_idx` (`FoodItemID`),
  CONSTRAINT `fk_foodItem_analytics` FOREIGN KEY (`FoodItemID`) REFERENCES `food_item` (`FoodItemID`),
  CONSTRAINT `Fk_user_analytics` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
INSERT INTO `analytics` VALUES (1,2,'expired','4','unshared','2025-01-25'),(1,3,'expired','2','unshared','2025-01-25'),(1,5,'expired','6','unshared','2025-03-25'),(1,8,'consumed','2','unshared',NULL),(1,6,'consumed','5','unshared',NULL),(1,2,'consumed','3','unshared',NULL),(1,10,'expired','1','unshared','2025-03-25'),(1,9,'expired','8','unshared','2025-03-25'),(3,8,'expired','4','unshared','2025-04-26'),(3,11,'expired','2','unshared','2025-03-25'),(3,6,'expired','9','unshared','2025-02-11'),(3,4,'expired','5','unshared','2025-01-15'),(3,3,'expired','7','unshared','2025-01-25'),(3,7,'consumed','6','unshared',NULL),(3,9,'consumed','3','unshared',NULL),(3,1,'expired','5','unshared','2025-03-25'),(3,2,'expired','2','unshared','2025-01-16'),(3,5,'expired','2','unshared','2025-05-04'),(3,10,'expired','1','unshared','2025-06-07');
/*!40000 ALTER TABLE `analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_item`
--

DROP TABLE IF EXISTS `food_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_item` (
  `FoodItemID` int NOT NULL AUTO_INCREMENT,
  `FoodName` varchar(45) DEFAULT NULL,
  `DefaultShelfLife` int DEFAULT NULL,
  `DefaultUnit` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`FoodItemID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_item`
--

LOCK TABLES `food_item` WRITE;
/*!40000 ALTER TABLE `food_item` DISABLE KEYS */;
INSERT INTO `food_item` VALUES (1,'apple',7,'number'),(2,'banana',7,'number'),(3,'tomato',14,'number'),(4,'carrot',21,'nuumber'),(5,'broccoli',5,'oz'),(6,'spinach',7,'oz'),(7,'potato',84,'number'),(8,'orange',28,'number'),(9,'strawberries',7,'oz'),(10,'blueberries',14,'oz'),(11,'cucumber',14,'number');
/*!40000 ALTER TABLE `food_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `household`
--

DROP TABLE IF EXISTS `household`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `household` (
  `HouseHoldID` int NOT NULL AUTO_INCREMENT,
  `HouseHoldName` varchar(45) DEFAULT NULL,
  `UserID` int NOT NULL,
  PRIMARY KEY (`HouseHoldID`),
  KEY `fk_userID_household_idx` (`UserID`),
  CONSTRAINT `fk_userID_household` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `household`
--

LOCK TABLES `household` WRITE;
/*!40000 ALTER TABLE `household` DISABLE KEYS */;
/*!40000 ALTER TABLE `household` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `InventoryID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `FoodItemID` int NOT NULL,
  `PurchaseDate` date DEFAULT NULL,
  `ExpirationStatus` varchar(45) DEFAULT NULL,
  `Quantity` varchar(45) DEFAULT NULL,
  `Storage` varchar(45) DEFAULT NULL,
  `Expiration` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`InventoryID`),
  KEY `fk_userID_inv_idx` (`UserID`),
  CONSTRAINT `fk_userID_inv` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (33,1,3,'2025-02-26','fresh','6','refrigerator','2025-03-07'),(34,2,6,'2025-02-27','fresh','6','refrigerator','2025-03-03'),(35,1,7,'2025-02-27','fresh','10','shelf','2025-03-03'),(36,1,10,'2025-02-26','fresh','16','refrigerator','2025-03-01'),(37,2,4,'2025-02-26','fresh','4','shelf','2025-03-01'),(38,4,6,'2025-02-26','fresh','6400','refrigerator','2025-03-01'),(39,4,10,'2025-02-26','fresh','16','refrigerator','2025-03-01'),(41,1,1,'2025-03-23','fresh','5','refrigerator','2025-01-01'),(43,1,2,'2025-03-23','fresh','8','refrigerator','2025-03-30'),(53,3,5,'2025-06-08','fresh','5','refrigerator','2025-06-13'),(54,3,6,'2025-06-08','fresh','4','refrigerator','2025-06-15'),(55,3,11,'2025-06-08','fresh','2','refrigerator','2025-06-22'),(56,3,2,'2025-06-03','fresh','0','shelf','2025-06-10'),(60,3,3,'2025-06-09','fresh','4','refrigerator','2025-06-23'),(61,3,2,'2025-06-08','fresh','3','shelf','2025-06-15');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reactive_information`
--

DROP TABLE IF EXISTS `reactive_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reactive_information` (
  `InformationID` int NOT NULL AUTO_INCREMENT,
  `InformationName` varchar(45) DEFAULT NULL,
  `FoodItemID` int NOT NULL,
  PRIMARY KEY (`InformationID`),
  KEY `fk_foodItemID_react_idx` (`FoodItemID`),
  CONSTRAINT `fk_foodItemID_react` FOREIGN KEY (`FoodItemID`) REFERENCES `food_item` (`FoodItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactive_information`
--

LOCK TABLES `reactive_information` WRITE;
/*!40000 ALTER TABLE `reactive_information` DISABLE KEYS */;
/*!40000 ALTER TABLE `reactive_information` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe` (
  `RecipeID` int NOT NULL AUTO_INCREMENT,
  `RecipeName` varchar(45) DEFAULT NULL,
  `Instructions` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`RecipeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_rec`
--

DROP TABLE IF EXISTS `recipe_rec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_rec` (
  `FoodItemID` int NOT NULL,
  `QuantityRequired` int DEFAULT NULL,
  `RecipeID` int NOT NULL,
  PRIMARY KEY (`FoodItemID`,`RecipeID`),
  KEY `RecipeID_idx` (`RecipeID`),
  CONSTRAINT `fk_foodItemID_recp` FOREIGN KEY (`FoodItemID`) REFERENCES `food_item` (`FoodItemID`),
  CONSTRAINT `fk_recipeID_recp` FOREIGN KEY (`RecipeID`) REFERENCES `recipe` (`RecipeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_rec`
--

LOCK TABLES `recipe_rec` WRITE;
/*!40000 ALTER TABLE `recipe_rec` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_rec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1R7ryxL1WCd6mNZ8nqTFMlnsQUQQfOsI',1740604041,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:07:20.634Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":1,\"username\":\"Xx_Andrew_xX\",\"firstName\":\"Andrew\",\"lastName\":\"Benham\"}}'),('1e7URH_oHqCMAgkQjP-Ve7LB4xJnzyNR',1740604025,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:07:05.166Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('1w7fIE8KIcLYdxF2pEFwfG39YCTAF60E',1740603970,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:06:10.450Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('3fplVnLxFVOu6vlu8q8BAkZ2_ypz53gi',1740703478,'{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-02-28T00:44:37.892Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"UserID\":2,\"userName\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\",\"passwordHash\":\"coolPassword\",\"email\":\"jaylen.wheeler@gmail.com\",\"lastLogin\":\"2025-02-28T00:33:07.000Z\"}}'),('7ow8pkav2caq3vzXTRmkLE_6yHjUhffT',1740703388,'{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-02-28T00:43:07.589Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"UserID\":2,\"userName\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\",\"passwordHash\":\"coolPassword\",\"email\":\"jaylen.wheeler@gmail.com\",\"lastLogin\":\"2025-02-28T00:24:20.000Z\"}}'),('89wg95w9a7bBM9YmpeRvCnGiy5qLbkGd',1740702860,'{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-02-28T00:34:20.176Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"UserID\":2,\"userName\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\",\"passwordHash\":\"coolPassword\",\"email\":\"jaylen.wheeler@gmail.com\",\"lastLogin\":\"2025-02-27T23:37:19.000Z\"}}'),('GKg__T833hzPh-n6d-bp0AgfpUcHJh23',1740604320,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:12:00.113Z\",\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('H0-m5D5QjEGcaCeLdV3-ZtMntpMGri-8',1740599526,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T19:52:06.425Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"firstName\":\"Andrew\",\"lastName\":\"Benham\"}}'),('KpEG1CRWy-vsEG6x8foeUu5bELd1D9Zu',1740599367,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T19:49:26.794Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('KprbCSL5zRMh7ZnxmAPMii8VHVzSrTZt',1740603348,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T20:55:47.518Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"firstName\":\"Andrew\",\"lastName\":\"Benham\"}}'),('OAvZiRfGULJnYfo_tnFjSKMUkQiLlH_A',1740605127,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:25:27.195Z\",\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('T0XB6eYAYjWFPpbs0DwuOAG8rewnhr9H',1740604089,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:08:08.929Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('VAt39v3LPbqLlpXQou1fj-o4n3jXrUX9',1740604813,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:20:13.237Z\",\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('Xu8t1fUeIJm-gDAkqSX_9eEbdPUCztkN',1740703486,'{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-02-28T00:44:45.988Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"UserID\":2,\"userName\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\",\"passwordHash\":\"coolPassword\",\"email\":\"jaylen.wheeler@gmail.com\",\"lastLogin\":\"2025-02-28T00:34:37.000Z\"}}'),('Xu_G87Gb3GkGOSqZJSLIL6pmESyLdtS_',1740604988,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:23:08.467Z\",\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('_Ll5DasbnJmFkHq7aadUxKIFkESrIHW6',1740603019,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T20:50:18.791Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('hWTQpw_-Ds7ur11aP8SacHjbQjlGSgcl',1740703507,'{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-02-28T00:45:07.029Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"UserID\":2,\"userName\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\",\"passwordHash\":\"coolPassword\",\"email\":\"jaylen.wheeler@gmail.com\",\"lastLogin\":\"2025-02-28T00:34:51.000Z\"}}'),('jeDMUmWHClXFZbI6wSlvGXKeU6vqQ_-o',1740603503,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T20:58:22.758Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('o0nLmxaQqz6bcA2Hc42-J5W0Zkm2j5QC',1740703492,'{\"cookie\":{\"originalMaxAge\":600000,\"expires\":\"2025-02-28T00:44:51.884Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"UserID\":2,\"userName\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\",\"passwordHash\":\"coolPassword\",\"email\":\"jaylen.wheeler@gmail.com\",\"lastLogin\":\"2025-02-28T00:34:45.000Z\"}}'),('ofc8kwBD9ep5tKGoMrj83iOsfWvqSmyz',1740599375,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T19:49:34.673Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('ok3e5CAjq62E47zy5wiJixSu1HEI1_XO',1740604718,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T21:18:38.040Z\",\"httpOnly\":false,\"path\":\"/\",\"sameSite\":\"lax\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}'),('ymjRn09IsD-aj8n9xCYU4ejxvUypUFLp',1740603395,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-26T20:56:35.435Z\",\"httpOnly\":true,\"path\":\"/\"},\"user\":{\"id\":2,\"username\":\"XX_UrDone\",\"firstName\":\"Jaylen\",\"lastName\":\"Wheeler\"}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `share_request`
--

DROP TABLE IF EXISTS `share_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `share_request` (
  `RequestID` int NOT NULL AUTO_INCREMENT,
  `SharedItemID` int NOT NULL,
  `RequestorUserID` int NOT NULL,
  `RequestDate` datetime DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `fk_invetoryItem_shared_idx` (`SharedItemID`),
  KEY `fk_userID_shared_idx` (`RequestorUserID`),
  CONSTRAINT `fk_requserID_shared` FOREIGN KEY (`RequestorUserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `fk_shareditem_req` FOREIGN KEY (`SharedItemID`) REFERENCES `shared_item` (`SharedItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `share_request`
--

LOCK TABLES `share_request` WRITE;
/*!40000 ALTER TABLE `share_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `share_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shared_item`
--

DROP TABLE IF EXISTS `shared_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shared_item` (
  `SharedItemID` int NOT NULL AUTO_INCREMENT,
  `InventoryItemID` int DEFAULT NULL,
  `OwnerUserID` int NOT NULL,
  `AvailableQuantity` int DEFAULT NULL,
  `Status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`SharedItemID`),
  KEY `fk_inventoryID_shared_idx` (`InventoryItemID`),
  KEY `fk_userId_shared_idx` (`OwnerUserID`),
  CONSTRAINT `fk_userId_sharing` FOREIGN KEY (`OwnerUserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shared_item`
--

LOCK TABLES `shared_item` WRITE;
/*!40000 ALTER TABLE `shared_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `shared_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shelf_friend`
--

DROP TABLE IF EXISTS `shelf_friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shelf_friend` (
  `FriendID` int NOT NULL AUTO_INCREMENT,
  `UserID_1` int NOT NULL,
  `UserID_2` int NOT NULL,
  `DateConnected` datetime DEFAULT NULL,
  `FriendStatus` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`FriendID`),
  KEY `fk_userID_friend1_idx` (`UserID_1`),
  KEY `fk_userID_friend2_idx` (`UserID_2`),
  CONSTRAINT `fk_userID_friend1` FOREIGN KEY (`UserID_1`) REFERENCES `user` (`UserID`),
  CONSTRAINT `fk_userID_friend2` FOREIGN KEY (`UserID_2`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shelf_friend`
--

LOCK TABLES `shelf_friend` WRITE;
/*!40000 ALTER TABLE `shelf_friend` DISABLE KEYS */;
/*!40000 ALTER TABLE `shelf_friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(45) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `passwordHash` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `lastLogin` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Xx_Andrew_xX','Andrew','Benham','54321','abenham@gmail.com','2025-03-24 19:53:10'),(2,'XX_UrDone','Jaylen','Wheeler','coolPassword','jaylen.wheeler@gmail.com','2025-03-26 13:58:16'),(3,'demo2_user','Edward','Elric','password12','equivalentExchange@yahoo.com','2025-03-26 13:42:37'),(4,'B1gman_Blastoise','Brock','Harison','DryingPan','indigo.league@hotmail.com','2025-03-24 19:54:08');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'livelyshelfsdb'
--

--
-- Dumping routines for database 'livelyshelfsdb'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 18:01:22
