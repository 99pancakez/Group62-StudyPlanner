-- MySQL dump 10.13  Distrib 26.7.0, for Win64 (x86_64)
--
-- Host: localhost    Database: cs
-- ------------------------------------------------------
-- Server version	26.7.0
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8mb4 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
-- SET @@SESSION.SQL_LOG_BIN= 0;
--
-- GTID state at the beginning of the backup 
--
-- SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'f2e142f1-a341-11f1-b22e-80fa5b7bcae0:1-483';
--
-- Table structure for table `admin`
--
DROP TABLE IF EXISTS `admin`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `admin` (
    `admin_id` int NOT NULL AUTO_INCREMENT,
    `admin_name` varchar(100) NOT NULL,
    `admin_email` varchar(254) NOT NULL,
    `password` varchar(200) NOT NULL,
    PRIMARY KEY (`admin_id`),
    UNIQUE KEY `admin_email` (`admin_email`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--
LOCK TABLES `admin` WRITE;

/*!40000 ALTER TABLE `admin` DISABLE KEYS */;

INSERT INTO
  `admin`
VALUES
  (
    1,
    'Son Hoang Dau',
    'sonhoang.dau@rmit.edu.au',
    '$argon2id$v=19$m=65536,t=3,p=4$Ei2LEOkI6bzv7uIyHVyeOg$kIk/roRPl6+IPnRm2vKJrgJ13XG6gV0jIV2S2THEnr8'
  );

/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `availability`
--
DROP TABLE IF EXISTS `availability`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `availability` (
    `semester_id` int NOT NULL AUTO_INCREMENT,
    `semester_name` varchar(50) NOT NULL,
    PRIMARY KEY (`semester_id`),
    UNIQUE KEY `semester_name` (`semester_name`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--
LOCK TABLES `availability` WRITE;

/*!40000 ALTER TABLE `availability` DISABLE KEYS */;

INSERT INTO
  `availability`
VALUES
  (1, 'Semester 1'),
  (2, 'Semester 2');

/*!40000 ALTER TABLE `availability` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `combination`
--
DROP TABLE IF EXISTS `combination`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `combination` (
    `combination_id` int NOT NULL AUTO_INCREMENT,
    `combination_name` varchar(255) NOT NULL,
    `program_code` varchar(50) NOT NULL,
    PRIMARY KEY (`combination_id`),
    KEY `program_code` (`program_code`),
    CONSTRAINT `combination_ibfk_1` FOREIGN KEY (`program_code`) REFERENCES `program_plan` (`program_code`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combination`
--
LOCK TABLES `combination` WRITE;

/*!40000 ALTER TABLE `combination` DISABLE KEYS */;

INSERT INTO
  `combination`
VALUES
  (1, 'CS Major', 'BP094P23'),
  (2, 'CS Minor + CS / non-CS Minor', 'BP094P23'),
  (
    3,
    'CS Minor + CS Option / University Elective',
    'BP094P23'
  ),
  (4, 'CS Option + University Elective', 'BP094P23');

/*!40000 ALTER TABLE `combination` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `combination_group`
--
DROP TABLE IF EXISTS `combination_group`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `combination_group` (
    `combo_group_id` int NOT NULL AUTO_INCREMENT,
    `combo_group_label` varchar(100) NOT NULL,
    PRIMARY KEY (`combo_group_id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combination_group`
--
LOCK TABLES `combination_group` WRITE;

/*!40000 ALTER TABLE `combination_group` DISABLE KEYS */;

INSERT INTO
  `combination_group`
VALUES
  (1, 'CS Major'),
  (2, 'CS Minor'),
  (3, 'CS Option'),
  (4, 'CS / non-CS Minor'),
  (5, 'CS Option / University Elective'),
  (6, 'University Electives');

/*!40000 ALTER TABLE `combination_group` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `combination_group_mapping`
--
DROP TABLE IF EXISTS `combination_group_mapping`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `combination_group_mapping` (
    `combination_id` int NOT NULL,
    `combo_group_id` int NOT NULL,
    `total_credit` int NOT NULL,
    PRIMARY KEY (`combination_id`, `combo_group_id`),
    KEY `combo_group_id` (`combo_group_id`),
    CONSTRAINT `combination_group_mapping_ibfk_1` FOREIGN KEY (`combination_id`) REFERENCES `combination` (`combination_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `combination_group_mapping_ibfk_2` FOREIGN KEY (`combo_group_id`) REFERENCES `combination_group` (`combo_group_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combination_group_mapping`
--
LOCK TABLES `combination_group_mapping` WRITE;

/*!40000 ALTER TABLE `combination_group_mapping` DISABLE KEYS */;

INSERT INTO
  `combination_group_mapping`
VALUES
  (1, 1, 96),
  (2, 2, 48),
  (2, 4, 48),
  (3, 2, 48),
  (3, 5, 48),
  (4, 3, 48),
  (4, 6, 48);

/*!40000 ALTER TABLE `combination_group_mapping` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `combo_group_type_mapping`
--
DROP TABLE IF EXISTS `combo_group_type_mapping`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `combo_group_type_mapping` (
    `combo_group_id` int NOT NULL,
    `course_type_id` int NOT NULL,
    PRIMARY KEY (`combo_group_id`, `course_type_id`),
    KEY `course_type_id` (`course_type_id`),
    CONSTRAINT `combo_group_type_mapping_ibfk_1` FOREIGN KEY (`combo_group_id`) REFERENCES `combination_group` (`combo_group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `combo_group_type_mapping_ibfk_2` FOREIGN KEY (`course_type_id`) REFERENCES `type` (`course_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_group_type_mapping`
--
LOCK TABLES `combo_group_type_mapping` WRITE;

/*!40000 ALTER TABLE `combo_group_type_mapping` DISABLE KEYS */;

INSERT INTO
  `combo_group_type_mapping`
VALUES
  (1, 2),
  (3, 2),
  (5, 2),
  (2, 3),
  (3, 3),
  (4, 3),
  (5, 3),
  (4, 4),
  (5, 5),
  (6, 5);

/*!40000 ALTER TABLE `combo_group_type_mapping` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `course`
--
DROP TABLE IF EXISTS `course`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `course` (
    `course_id` varchar(50) NOT NULL,
    `course_code` varchar(50) NOT NULL,
    `course_title` varchar(100) NOT NULL,
    `course_credit` int NOT NULL DEFAULT '0',
    `web_url` varchar(2048) DEFAULT NULL,
    `prerequisite` tinyint (1) NOT NULL DEFAULT '0',
    `year` int DEFAULT NULL,
    PRIMARY KEY (`course_id`),
    UNIQUE KEY `course_id` (`course_id`),
    UNIQUE KEY `course_code` (`course_code`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--
LOCK TABLES `course` WRITE;

/*!40000 ALTER TABLE `course` DISABLE KEYS */;

INSERT INTO
  `course`
VALUES
  (
    '004108',
    'COSC1107',
    'Computing Theory',
    12,
    'https://www1.rmit.edu.au/courses/004108',
    1,
    2
  ),
  (
    '004110',
    'COSC1111',
    'Data Communication and Net-Centric Computing',
    12,
    'https://www1.rmit.edu.au/courses/004110',
    0,
    2
  ),
  (
    '004111',
    'COSC1114',
    'Operating Systems Principles',
    12,
    'https://www1.rmit.edu.au/courses/004111',
    1,
    2
  ),
  (
    '004123',
    'COSC1127',
    'Artificial Intelligence',
    12,
    'https://www1.rmit.edu.au/courses/004123',
    1,
    3
  ),
  (
    '004175',
    'ISYS1079',
    'Managing Semi-structured and Unstructured Data',
    12,
    'https://www1.rmit.edu.au/courses/004175',
    1,
    2
  ),
  (
    '004178',
    'INTE1071',
    'Secure Electronic Commerce',
    12,
    'https://www1.rmit.edu.au/courses/004178',
    1,
    2
  ),
  (
    '004186',
    'ISYS1087',
    'Software Testing',
    12,
    'https://www1.rmit.edu.au/courses/004186',
    1,
    2
  ),
  (
    '004199',
    'COSC1183',
    'Usability Engineering',
    12,
    'http://www1.rmit.edu.au/courses/004199',
    1,
    3
  ),
  (
    '004218',
    'ISYS1102',
    'Database Applications',
    12,
    'https://www1.rmit.edu.au/courses/004218',
    1,
    2
  ),
  (
    '004302',
    'COSC2123',
    'Algorithms and Analysis',
    12,
    'http://www1.rmit.edu.au/courses/004302',
    1,
    2
  ),
  (
    '004309',
    'ISYS1118',
    'Software Engineering Fundamentals',
    12,
    'https://www1.rmit.edu.au/courses/004309',
    1,
    2
  ),
  (
    '014049',
    'COSC2299',
    'Software Engineering: Process and Tools',
    12,
    'https://www1.rmit.edu.au/courses/014049',
    1,
    3
  ),
  (
    '014052',
    'COSC2391',
    'Further Programming',
    12,
    'https://www1.rmit.edu.au/courses/014052',
    1,
    2
  ),
  (
    '014749',
    'BIOL2146',
    'Cell Biology and Biochemistry',
    12,
    'https://www1.rmit.edu.au/courses/014749',
    0,
    2
  ),
  (
    '015442',
    'MATH2055',
    'Optimisation for Decision Making',
    12,
    'https://www1.rmit.edu.au/courses/015442',
    0,
    2
  ),
  (
    '035217',
    'COSC2274',
    'Software Requirements Engineering',
    12,
    'https://www1.rmit.edu.au/courses/035217',
    1,
    2
  ),
  (
    '035218',
    'COSC2276',
    'Web Development Technologies',
    12,
    'https://www1.rmit.edu.au/courses/035218',
    1,
    2
  ),
  (
    '036671',
    'COSC2301',
    'Computer and Internet Forensics',
    12,
    'https://www1.rmit.edu.au/courses/036671',
    1,
    2
  ),
  (
    '037016',
    'COSC2349',
    'Games Studio 2',
    12,
    'http://www1.rmit.edu.au/courses/037016',
    0,
    3
  ),
  (
    '037889',
    'MATH2142',
    'Multivariate Analysis',
    12,
    'https://www1.rmit.edu.au/courses/037889',
    1,
    2
  ),
  (
    '038096',
    'BIOL2262',
    'Genetics and Molecular Biology',
    12,
    'https://www1.rmit.edu.au/courses/038096',
    0,
    2
  ),
  (
    '038407',
    'INTE2402',
    'Cloud Security',
    12,
    'https://www1.rmit.edu.au/courses/038407',
    1,
    2
  ),
  (
    '039985',
    'COSC2408',
    'Programming Project 1',
    12,
    'https://www1.rmit.edu.au/courses/039985',
    1,
    3
  ),
  (
    '044231',
    'MATH2201',
    'Statistical Methodologies',
    12,
    'https://www1.rmit.edu.au/courses/044231',
    0,
    1
  ),
  (
    '044233',
    'MATH2203',
    'Linear Models and Experimental Design',
    12,
    'https://www1.rmit.edu.au/courses/044233',
    1,
    2
  ),
  (
    '044272',
    'MATH2204',
    'Time Series and Forecasting',
    12,
    'https://www1.rmit.edu.au/courses/044272',
    1,
    2
  ),
  (
    '044450',
    'COSC2471',
    'iPhone Software Engineering',
    12,
    'https://www1.rmit.edu.au/courses/044450',
    1,
    2
  ),
  (
    '044481',
    'COSC2476',
    'Mixed Reality',
    12,
    'https://www1.rmit.edu.au/courses/044481',
    1,
    2
  ),
  (
    '045680',
    'COSC2527',
    'Games and Artificial Intelligence Techniques',
    12,
    'https://www1.rmit.edu.au/courses/045680',
    1,
    2
  ),
  (
    '045940',
    'COSC2536',
    'Security in Computing and Information Technology',
    12,
    'https://www1.rmit.edu.au/courses/045940',
    1,
    2
  ),
  (
    '048558',
    'MATH2237',
    'Data Visualisation with R',
    12,
    'http://www1.rmit.edu.au/courses/048558',
    1,
    2
  ),
  (
    '049803',
    'COSC2626',
    'Cloud Computing',
    12,
    'https://www1.rmit.edu.au/courses/049803',
    1,
    2
  ),
  (
    '050775',
    'MATH2305',
    'Applied Bayesian Statistics',
    12,
    'https://www1.rmit.edu.au/courses/050775',
    0,
    2
  ),
  (
    '051831',
    'COSC2673',
    'Machine Learning',
    12,
    'https://www1.rmit.edu.au/courses/051831',
    1,
    3
  ),
  (
    '051832',
    'COSC2674',
    'Programming Internet of Things',
    12,
    'https://www1.rmit.edu.au/courses/051832',
    1,
    2
  ),
  (
    '052739',
    'COSC2738',
    'Practical Data Science',
    12,
    'https://www1.rmit.edu.au/courses/052739',
    0,
    2
  ),
  (
    '053170',
    'INTE2547',
    'Security Testing',
    12,
    'https://www1.rmit.edu.au/courses/053170',
    1,
    2
  ),
  (
    '053171',
    'COSC2757',
    'Cloud Foundations',
    12,
    'https://www1.rmit.edu.au/courses/053171',
    1,
    2
  ),
  (
    '053172',
    'COSC2758',
    'Full Stack Development',
    12,
    'https://www1.rmit.edu.au/courses/053172',
    1,
    2
  ),
  (
    '053404',
    'INTE2554',
    'Digital Economy and Blockchain Applications',
    12,
    'https://www1.rmit.edu.au/courses/053404',
    0,
    3
  ),
  (
    '053407',
    'ECON1349',
    'Frontiers of the Digital Economy',
    12,
    'https://www1.rmit.edu.au/courses/053407',
    0,
    3
  ),
  (
    '054076',
    'MATH2411',
    'Mathematics for Computing 1',
    12,
    'https://www1.rmit.edu.au/courses/054076',
    1,
    1
  ),
  (
    '054077',
    'MATH2412',
    'Practical Statistics',
    12,
    'http://www1.rmit.edu.au/courses/054077',
    0,
    2
  ),
  (
    '054079',
    'COSC2801',
    'Java Programming Bootcamp',
    12,
    'https://www1.rmit.edu.au/courses/054079',
    0,
    1
  ),
  (
    '054080',
    'COSC2802',
    'C++ Programming Bootcamp',
    12,
    'https://www1.rmit.edu.au/courses/054080',
    1,
    1
  ),
  (
    '054081',
    'COSC2803',
    'Java Programming Studio',
    24,
    'https://www1.rmit.edu.au/courses/054081',
    0,
    1
  ),
  (
    '054082',
    'COSC2804',
    'C++ Programming Studio',
    24,
    'https://www1.rmit.edu.au/courses/054082',
    0,
    1
  ),
  (
    '054114',
    'COSC2814',
    'Programming Autonomous Robots',
    12,
    'https://www1.rmit.edu.au/courses/054114',
    1,
    2
  ),
  (
    '054117',
    'COSC2815',
    'Advanced Programming for Data Science',
    12,
    'https://www1.rmit.edu.au/courses/054117',
    1,
    2
  ),
  (
    '054118',
    'COSC2816',
    'Case Studies in Data Science',
    12,
    'https://www1.rmit.edu.au/courses/054118',
    1,
    2
  ),
  (
    '054120',
    'COSC2818',
    'The Data Science Professional',
    12,
    'https://www1.rmit.edu.au/courses/054120',
    0,
    2
  ),
  (
    '054140',
    'COSC2821',
    'Cloud Developing',
    12,
    'https://www1.rmit.edu.au/courses/054140',
    1,
    2
  ),
  (
    '054141',
    'COSC2824',
    'Cloud Operations',
    12,
    'https://www1.rmit.edu.au/courses/054141',
    1,
    3
  ),
  (
    '054142',
    'COSC2829',
    'Cloud Architecting',
    12,
    'http://www1.rmit.edu.au/courses/054142',
    1,
    3
  ),
  (
    '054229',
    'COSC2960',
    'Foundations of Artificial Intelligence for STEM',
    12,
    'https://www1.rmit.edu.au/courses/054229',
    0,
    2
  ),
  (
    '054230',
    'BIOL2512',
    'Systems Biology',
    12,
    'https://www1.rmit.edu.au/courses/054230',
    0,
    2
  ),
  (
    '054381',
    'INTE2584',
    'Introduction to Cybersecurity Governance',
    12,
    'https://www1.rmit.edu.au/courses/054381',
    0,
    2
  ),
  (
    '054478',
    'COSC2972',
    'Deep Learning',
    12,
    'https://www1.rmit.edu.au/courses/054478',
    1,
    2
  ),
  (
    '054479',
    'COSC2973',
    'Intelligent Decision Making',
    12,
    'https://www1.rmit.edu.au/courses/054479',
    1,
    3
  ),
  (
    '054910',
    'OENG1235',
    'Innovation Ecosystem and the Future of Work',
    12,
    NULL,
    0,
    3
  ),
  (
    '054986',
    'INTE2625',
    'Introduction to Cyber Security',
    12,
    'https://www1.rmit.edu.au/courses/054986',
    0,
    2
  ),
  (
    '054989',
    'COSC3045',
    'Essentials of Computing',
    12,
    'https://www1.rmit.edu.au/courses/054989',
    1,
    2
  ),
  (
    '054991',
    'ISYS3459',
    'Systems Architecture and Design',
    12,
    'https://www1.rmit.edu.au/courses/054991',
    1,
    3
  ),
  (
    '054992',
    'INTE2626',
    'Cyber Security Attack Analysis and Incidence Response',
    12,
    'https://www1.rmit.edu.au/courses/054992',
    1,
    2
  ),
  (
    '054993',
    'INTE2627',
    'Blockchain Technology Fundamentals',
    12,
    'https://www1.rmit.edu.au/courses/054993',
    1,
    2
  ),
  (
    '054995',
    'INTE2628',
    'Developing Blockchain Applications',
    12,
    'https://www1.rmit.edu.au/courses/054995',
    1,
    3
  ),
  (
    '054996',
    'INTE2629',
    'Blockchain Innovations and Case Studies',
    12,
    'http://www1.rmit.edu.au/courses/054996',
    1,
    2
  ),
  (
    '054997',
    'COSC3047',
    'Social Media and Networks Analytics',
    12,
    'https://www1.rmit.edu.au/courses/054997',
    1,
    2
  ),
  (
    '055001',
    'BIOL2526',
    'Computational Biology',
    12,
    'https://www1.rmit.edu.au/courses/055001',
    0,
    2
  ),
  (
    '055925',
    'MATH2466',
    'Introduction to Mathematics for Computing',
    12,
    'https://www1.rmit.edu.au/courses/055925',
    0,
    1
  ),
  (
    '056543',
    'COSC3099',
    'UI and UX for Apple Platform',
    12,
    'https://www1.rmit.edu.au/courses/056543',
    0,
    2
  ),
  (
    '056544',
    'COSC3100',
    'Getting Started with iOS App Development',
    12,
    'https://www1.rmit.edu.au/courses/056544',
    1,
    2
  ),
  (
    '056545',
    'COSC3101',
    'Human-Centred Development with Apple Platform Technologies',
    12,
    'https://www1.rmit.edu.au/courses/056545',
    1,
    2
  ),
  (
    '056546',
    'COSC3102',
    'Apple Platform Project',
    12,
    'https://www1.rmit.edu.au/courses/056546',
    1,
    2
  ),
  (
    '056547',
    'INTE2686',
    'Mixed Reality Technologies',
    12,
    'https://www1.rmit.edu.au/courses/056547',
    0,
    2
  ),
  (
    '056548',
    'COSC1119',
    'Digital Fluency',
    12,
    'https://www1.rmit.edu.au/courses/056548',
    0,
    2
  ),
  (
    '056549',
    'COSC2222',
    'Digital Innovation Project',
    12,
    'https://www1.rmit.edu.au/courses/056549',
    0,
    3
  );

/*!40000 ALTER TABLE `course` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `course_availability`
--
DROP TABLE IF EXISTS `course_availability`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `course_availability` (
    `course_id` varchar(50) NOT NULL,
    `semester_id` int NOT NULL,
    PRIMARY KEY (`course_id`, `semester_id`),
    KEY `semester_id` (`semester_id`),
    CONSTRAINT `course_availability_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `course_availability_ibfk_2` FOREIGN KEY (`semester_id`) REFERENCES `availability` (`semester_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_availability`
--
LOCK TABLES `course_availability` WRITE;

/*!40000 ALTER TABLE `course_availability` DISABLE KEYS */;

INSERT INTO
  `course_availability`
VALUES
  ('004110', 1),
  ('004218', 1),
  ('004302', 1),
  ('004309', 1),
  ('014052', 1),
  ('015442', 1),
  ('037889', 1),
  ('038096', 1),
  ('038407', 1),
  ('039985', 1),
  ('044231', 1),
  ('044233', 1),
  ('044272', 1),
  ('045680', 1),
  ('048558', 1),
  ('049803', 1),
  ('051831', 1),
  ('051832', 1),
  ('052739', 1),
  ('053171', 1),
  ('053172', 1),
  ('053404', 1),
  ('053407', 1),
  ('054079', 1),
  ('054080', 1),
  ('054081', 1),
  ('054082', 1),
  ('054114', 1),
  ('054117', 1),
  ('054120', 1),
  ('054141', 1),
  ('054229', 1),
  ('054381', 1),
  ('054479', 1),
  ('054910', 1),
  ('054986', 1),
  ('054992', 1),
  ('054993', 1),
  ('054997', 1),
  ('055001', 1),
  ('055925', 1),
  ('056543', 1),
  ('056546', 1),
  ('056548', 1),
  ('004108', 2),
  ('004110', 2),
  ('004111', 2),
  ('004123', 2),
  ('004175', 2),
  ('004178', 2),
  ('004186', 2),
  ('004199', 2),
  ('004302', 2),
  ('004309', 2),
  ('014049', 2),
  ('014052', 2),
  ('014749', 2),
  ('035217', 2),
  ('035218', 2),
  ('036671', 2),
  ('037016', 2),
  ('039985', 2),
  ('044231', 2),
  ('044450', 2),
  ('044481', 2),
  ('045940', 2),
  ('048558', 2),
  ('050775', 2),
  ('052739', 2),
  ('053170', 2),
  ('053407', 2),
  ('054076', 2),
  ('054077', 2),
  ('054079', 2),
  ('054080', 2),
  ('054081', 2),
  ('054082', 2),
  ('054117', 2),
  ('054118', 2),
  ('054140', 2),
  ('054142', 2),
  ('054229', 2),
  ('054230', 2),
  ('054478', 2),
  ('054910', 2),
  ('054986', 2),
  ('054989', 2),
  ('054991', 2),
  ('054995', 2),
  ('054996', 2),
  ('056544', 2),
  ('056547', 2),
  ('056549', 2);

/*!40000 ALTER TABLE `course_availability` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `course_type`
--
DROP TABLE IF EXISTS `course_type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `course_type` (
    `course_id` varchar(50) NOT NULL,
    `sub_type_id` int NOT NULL,
    PRIMARY KEY (`course_id`, `sub_type_id`),
    KEY `sub_type_id` (`sub_type_id`),
    CONSTRAINT `course_type_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `course_type_ibfk_2` FOREIGN KEY (`sub_type_id`) REFERENCES `sub_type` (`sub_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_type`
--
LOCK TABLES `course_type` WRITE;

/*!40000 ALTER TABLE `course_type` DISABLE KEYS */;

INSERT INTO
  `course_type`
VALUES
  ('004302', 1),
  ('004309', 1),
  ('039985', 1),
  ('054076', 1),
  ('054079', 1),
  ('054080', 1),
  ('054081', 1),
  ('054082', 1),
  ('054229', 1),
  ('054910', 1),
  ('054986', 1),
  ('054989', 1),
  ('055925', 1),
  ('004108', 2),
  ('004111', 2),
  ('004123', 2),
  ('004175', 2),
  ('049803', 2),
  ('051831', 2),
  ('054478', 2),
  ('054479', 2),
  ('054997', 2),
  ('004110', 3),
  ('004178', 3),
  ('036671', 3),
  ('038407', 3),
  ('045940', 3),
  ('053170', 3),
  ('054381', 3),
  ('054992', 3),
  ('054993', 3),
  ('054995', 3),
  ('004186', 4),
  ('004199', 4),
  ('004218', 4),
  ('014049', 4),
  ('014052', 4),
  ('035217', 4),
  ('035218', 4),
  ('044450', 4),
  ('051832', 4),
  ('053172', 4),
  ('054991', 4),
  ('004123', 5),
  ('004175', 5),
  ('045680', 5),
  ('051831', 5),
  ('054114', 5),
  ('054478', 5),
  ('054997', 5),
  ('053404', 6),
  ('053407', 6),
  ('054993', 6),
  ('054995', 6),
  ('054996', 6),
  ('038407', 7),
  ('049803', 7),
  ('053171', 7),
  ('054140', 7),
  ('054141', 7),
  ('054142', 7),
  ('037016', 8),
  ('044481', 8),
  ('045680', 8),
  ('056543', 8),
  ('004110', 9),
  ('036671', 9),
  ('038407', 9),
  ('045940', 9),
  ('053170', 9),
  ('054992', 9),
  ('048558', 10),
  ('052739', 10),
  ('054077', 10),
  ('054117', 10),
  ('054118', 10),
  ('054120', 10),
  ('056543', 11),
  ('056544', 11),
  ('056545', 11),
  ('056546', 11),
  ('004186', 12),
  ('004218', 12),
  ('014049', 12),
  ('014052', 12),
  ('035218', 12),
  ('044450', 12),
  ('051832', 12),
  ('053172', 12),
  ('014749', 13),
  ('038096', 13),
  ('054230', 13),
  ('055001', 13),
  ('015442', 14),
  ('037889', 14),
  ('044233', 14),
  ('044272', 14),
  ('050775', 14),
  ('054229', 15),
  ('056547', 15),
  ('056548', 15),
  ('056549', 15),
  ('044231', 16),
  ('004123', 17),
  ('014049', 17),
  ('051831', 17);

/*!40000 ALTER TABLE `course_type` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `history`
--
DROP TABLE IF EXISTS `history`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `history` (
    `history_id` int NOT NULL AUTO_INCREMENT,
    `course_id` varchar(50) DEFAULT NULL,
    `program_code` varchar(50) DEFAULT NULL,
    `admin_id` int NOT NULL,
    `time_stamp` datetime NOT NULL,
    `field_name` varchar(50) NOT NULL,
    `old_value` text NOT NULL,
    `new_value` text NOT NULL,
    PRIMARY KEY (`history_id`),
    KEY `course_id` (`course_id`),
    KEY `program_code` (`program_code`),
    KEY `admin_id` (`admin_id`),
    CONSTRAINT `history_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `history_ibfk_2` FOREIGN KEY (`program_code`) REFERENCES `program_plan` (`program_code`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `history_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 1306 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `history`
--
LOCK TABLES `history` WRITE;

/*!40000 ALTER TABLE `history` DISABLE KEYS */;

INSERT INTO
  `history`
VALUES
  (
    1,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:37',
    'Course Type',
    '',
    'Core'
  ),
  (
    2,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:41',
    'Course Type',
    'Core',
    ''
  ),
  (
    3,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:41',
    'sub_type',
    'Core',
    ''
  ),
  (
    4,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:43',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    5,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:47',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    6,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:47',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    7,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:47',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    8,
    NULL,
    NULL,
    1,
    '2025-06-25 04:48:47',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    9,
    '056549',
    NULL,
    1,
    '2025-06-25 04:49:08',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    10,
    NULL,
    NULL,
    1,
    '2025-06-25 04:49:17',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    11,
    '035218',
    NULL,
    1,
    '2025-06-25 04:49:35',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    12,
    '014052',
    NULL,
    1,
    '2025-06-25 04:49:45',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    13,
    NULL,
    NULL,
    1,
    '2025-06-25 04:52:17',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    14,
    NULL,
    NULL,
    1,
    '2025-06-25 04:52:35',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    15,
    NULL,
    NULL,
    1,
    '2025-06-25 04:52:35',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    16,
    NULL,
    NULL,
    1,
    '2025-06-25 04:52:35',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    17,
    NULL,
    NULL,
    1,
    '2025-06-25 04:52:35',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    18,
    NULL,
    NULL,
    1,
    '2025-06-25 04:52:38',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    19,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    20,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    21,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    22,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    23,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    24,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    25,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    26,
    NULL,
    NULL,
    1,
    '2025-06-25 04:53:57',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    27,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    28,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    29,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    30,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    31,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    32,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    33,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    34,
    '056549',
    NULL,
    1,
    '2025-06-25 04:55:33',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    35,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    36,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    37,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    38,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    39,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    40,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    41,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    42,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    43,
    NULL,
    NULL,
    1,
    '2025-06-25 04:55:37',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    44,
    '014052',
    NULL,
    1,
    '2025-06-25 04:55:42',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    45,
    '014052',
    NULL,
    1,
    '2025-06-25 04:55:42',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    46,
    '014052',
    NULL,
    1,
    '2025-06-25 04:55:42',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    47,
    '035218',
    NULL,
    1,
    '2025-06-25 04:55:45',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    48,
    '035218',
    NULL,
    1,
    '2025-06-25 04:55:45',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    49,
    '035218',
    NULL,
    1,
    '2025-06-25 04:55:45',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    50,
    '035218',
    NULL,
    1,
    '2025-06-25 04:55:45',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    51,
    '056544',
    NULL,
    1,
    '2025-06-25 04:55:55',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    52,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:02',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    53,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:02',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    54,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:02',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    55,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:02',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    56,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:04',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    57,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    58,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    59,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    60,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    61,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    62,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    63,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:06',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    64,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:21',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    65,
    '056544',
    NULL,
    1,
    '2025-06-25 04:56:21',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    66,
    '054079',
    NULL,
    1,
    '2025-06-25 07:51:05',
    'credit_points',
    '12',
    '24'
  ),
  (
    67,
    '054079',
    NULL,
    1,
    '2025-06-25 07:51:36',
    'credit_points',
    '24',
    '12'
  ),
  (
    68,
    NULL,
    NULL,
    1,
    '2025-06-25 11:22:12',
    'year',
    '1',
    '2'
  ),
  (
    69,
    NULL,
    NULL,
    1,
    '2025-06-25 11:24:04',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    70,
    NULL,
    NULL,
    1,
    '2025-06-25 11:25:16',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    71,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:03',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    72,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:26',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    73,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:26',
    'Course Type',
    '',
    'Core'
  ),
  (
    74,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:33',
    'Course Type',
    'University Elective',
    ''
  ),
  (
    75,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:33',
    'sub_type',
    'University Elective',
    ''
  ),
  (
    76,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:52',
    'Course Type',
    'University Elective',
    ''
  ),
  (
    77,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:53',
    'Course Type',
    'Core',
    ''
  ),
  (
    78,
    NULL,
    NULL,
    1,
    '2025-06-25 11:26:53',
    'sub_type',
    'Core',
    ''
  ),
  (
    79,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:00',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    80,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:22',
    'Course Type',
    'University Elective',
    ''
  ),
  (
    81,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:22',
    'sub_type',
    'University Elective',
    ''
  ),
  (
    82,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:33',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    83,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:36',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    84,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:36',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    85,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:36',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    86,
    NULL,
    NULL,
    1,
    '2025-06-25 11:27:36',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    87,
    NULL,
    NULL,
    1,
    '2025-06-25 11:28:14',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    88,
    NULL,
    NULL,
    1,
    '2025-06-25 11:28:33',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    89,
    NULL,
    NULL,
    1,
    '2025-06-25 11:28:46',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    90,
    NULL,
    NULL,
    1,
    '2025-06-25 11:28:55',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    91,
    NULL,
    NULL,
    1,
    '2025-06-25 11:29:07',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    92,
    NULL,
    NULL,
    1,
    '2025-06-25 11:29:14',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    93,
    '004108',
    NULL,
    1,
    '2025-06-25 11:29:56',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    94,
    '004108',
    NULL,
    1,
    '2025-06-25 11:29:59',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    95,
    '004108',
    NULL,
    1,
    '2025-06-25 11:29:59',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    96,
    '004108',
    NULL,
    1,
    '2025-06-25 11:30:26',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    97,
    '004108',
    NULL,
    1,
    '2025-06-25 11:30:32',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    98,
    NULL,
    NULL,
    1,
    '2025-06-25 11:32:41',
    'structured_prerequisites',
    '',
    'COSC2801 OR COSC2799'
  ),
  (
    99,
    '004108',
    NULL,
    1,
    '2025-06-25 11:34:38',
    'structured_prerequisites',
    '',
    'COSC2123 AND MATH2411'
  ),
  (
    100,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:12',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    101,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:26',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    102,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:26',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    103,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:31',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    104,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    105,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    106,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    107,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    108,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    109,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    110,
    '004110',
    NULL,
    1,
    '2025-06-25 11:35:37',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    111,
    '004110',
    NULL,
    1,
    '2025-06-25 11:36:20',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    112,
    '004111',
    NULL,
    1,
    '2025-06-25 11:36:48',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    113,
    '004111',
    NULL,
    1,
    '2025-06-25 11:36:51',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    114,
    '004111',
    NULL,
    1,
    '2025-06-25 11:36:51',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    115,
    '004111',
    NULL,
    1,
    '2025-06-25 11:37:11',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    116,
    '004111',
    NULL,
    1,
    '2025-06-25 11:38:13',
    'structured_prerequisites',
    '',
    'COSC1076 OR EEET2250 OR COSC2804'
  ),
  (
    117,
    '004123',
    NULL,
    1,
    '2025-06-25 11:38:41',
    'Course Type',
    '',
    'Core'
  ),
  (
    118,
    '004123',
    NULL,
    1,
    '2025-06-25 11:38:55',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    119,
    '004123',
    NULL,
    1,
    '2025-06-25 11:38:57',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    120,
    '004123',
    NULL,
    1,
    '2025-06-25 11:38:57',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    121,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:10',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    122,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:12',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    123,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:12',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    124,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:13',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    125,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:13',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    126,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:13',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    127,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:13',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    128,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:13',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    129,
    '004123',
    NULL,
    1,
    '2025-06-25 11:39:54',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    130,
    '004123',
    NULL,
    1,
    '2025-06-25 11:40:43',
    'structured_prerequisites',
    '',
    'COSC2123'
  ),
  (
    131,
    '004175',
    NULL,
    1,
    '2025-06-25 11:41:31',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    132,
    '004175',
    NULL,
    1,
    '2025-06-25 11:41:33',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    133,
    '004175',
    NULL,
    1,
    '2025-06-25 11:41:33',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    134,
    '004175',
    NULL,
    1,
    '2025-06-25 11:41:37',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    135,
    '004175',
    NULL,
    1,
    '2025-06-25 11:41:57',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    136,
    '004178',
    NULL,
    1,
    '2025-06-25 11:42:18',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    137,
    '004178',
    NULL,
    1,
    '2025-06-25 11:42:20',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    138,
    '004178',
    NULL,
    1,
    '2025-06-25 11:42:20',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    139,
    '004178',
    NULL,
    1,
    '2025-06-25 11:42:40',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    140,
    '004178',
    NULL,
    1,
    '2025-06-25 11:43:01',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    141,
    '004186',
    NULL,
    1,
    '2025-06-25 11:43:22',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    142,
    '004186',
    NULL,
    1,
    '2025-06-25 11:43:24',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    143,
    '004186',
    NULL,
    1,
    '2025-06-25 11:43:24',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    144,
    '004186',
    NULL,
    1,
    '2025-06-25 11:43:24',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    145,
    '004186',
    NULL,
    1,
    '2025-06-25 11:45:28',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    146,
    '004186',
    NULL,
    1,
    '2025-06-25 11:45:41',
    'structured_prerequisites',
    '',
    'ISYS1118'
  ),
  (
    147,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:02',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    148,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    149,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    150,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    151,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    152,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    153,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    154,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:07',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    155,
    NULL,
    NULL,
    1,
    '2025-06-25 11:46:23',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    156,
    NULL,
    NULL,
    1,
    '2025-06-25 11:47:31',
    'structured_prerequisites',
    '',
    'COSC1076 OR EEET2250 OR COSC2803'
  ),
  (
    157,
    '004218',
    NULL,
    1,
    '2025-06-25 11:48:05',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    158,
    '004218',
    NULL,
    1,
    '2025-06-25 11:48:07',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    159,
    '004218',
    NULL,
    1,
    '2025-06-25 11:48:07',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    160,
    '004218',
    NULL,
    1,
    '2025-06-25 11:48:07',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    161,
    '004218',
    NULL,
    1,
    '2025-06-25 11:48:54',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    162,
    '004218',
    NULL,
    1,
    '2025-06-25 11:49:06',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    163,
    NULL,
    NULL,
    1,
    '2025-06-25 11:51:00',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    164,
    NULL,
    NULL,
    1,
    '2025-06-25 11:51:28',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    165,
    NULL,
    NULL,
    1,
    '2025-06-25 11:51:54',
    'Course Type',
    '',
    'Core'
  ),
  (
    166,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:01',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    167,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:03',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    168,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:03',
    'sub_type',
    'Core',
    ''
  ),
  (
    169,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:03',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    170,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:03',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    171,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:14',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    172,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:14',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    173,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:16',
    'Course Type',
    '',
    'Core'
  ),
  (
    174,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:22',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    175,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:24',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    176,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:24',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    177,
    NULL,
    NULL,
    1,
    '2025-06-25 11:52:24',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    178,
    NULL,
    NULL,
    1,
    '2025-06-25 11:53:05',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    179,
    NULL,
    NULL,
    1,
    '2025-06-25 11:55:05',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2802 OR COSC1076 OR COSC2800 OR EEET2250'
  ),
  (
    180,
    '004309',
    NULL,
    1,
    '2025-06-25 11:55:24',
    'Course Type',
    '',
    'Core'
  ),
  (
    181,
    '004309',
    NULL,
    1,
    '2025-06-25 11:55:51',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    182,
    '004309',
    NULL,
    1,
    '2025-06-25 11:56:17',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    183,
    '014049',
    NULL,
    1,
    '2025-06-25 11:56:30',
    'Course Type',
    '',
    'Core'
  ),
  (
    184,
    '014049',
    NULL,
    1,
    '2025-06-25 11:56:57',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    185,
    '014049',
    NULL,
    1,
    '2025-06-25 11:56:59',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    186,
    '014049',
    NULL,
    1,
    '2025-06-25 11:56:59',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    187,
    '014049',
    NULL,
    1,
    '2025-06-25 11:56:59',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    188,
    '014049',
    NULL,
    1,
    '2025-06-25 11:57:22',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    189,
    '014049',
    NULL,
    1,
    '2025-06-25 11:58:47',
    'structured_prerequisites',
    '',
    'ISYS1118 AND COSC2391 OR COSC2802 OR COSC2800 OR EEET2250'
  ),
  (
    190,
    '014052',
    NULL,
    1,
    '2025-06-25 11:59:02',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    191,
    '014052',
    NULL,
    1,
    '2025-06-25 11:59:04',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    192,
    '014052',
    NULL,
    1,
    '2025-06-25 11:59:04',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    193,
    '014052',
    NULL,
    1,
    '2025-06-25 11:59:04',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    194,
    '014052',
    NULL,
    1,
    '2025-06-25 11:59:21',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    195,
    '014052',
    NULL,
    1,
    '2025-06-25 12:00:42',
    'structured_prerequisites',
    '',
    'EEET2250 OR COSC2803'
  ),
  (
    196,
    '014749',
    NULL,
    1,
    '2025-06-25 12:01:04',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    197,
    '014749',
    NULL,
    1,
    '2025-06-25 12:01:06',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    198,
    '014749',
    NULL,
    1,
    '2025-06-25 12:01:06',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    199,
    '014749',
    NULL,
    1,
    '2025-06-25 12:01:23',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    200,
    '015442',
    NULL,
    1,
    '2025-06-25 12:01:37',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    201,
    '015442',
    NULL,
    1,
    '2025-06-25 12:02:00',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    202,
    '015442',
    NULL,
    1,
    '2025-06-25 12:02:01',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    203,
    '015442',
    NULL,
    1,
    '2025-06-25 12:02:03',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    204,
    '015442',
    NULL,
    1,
    '2025-06-25 12:02:03',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    205,
    '015442',
    NULL,
    1,
    '2025-06-25 12:02:15',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    206,
    '035218',
    NULL,
    1,
    '2025-06-25 12:02:44',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    207,
    '035218',
    NULL,
    1,
    '2025-06-25 12:02:46',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    208,
    '035218',
    NULL,
    1,
    '2025-06-25 12:02:46',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    209,
    '035218',
    NULL,
    1,
    '2025-06-25 12:02:46',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    210,
    '035218',
    NULL,
    1,
    '2025-06-25 12:03:22',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    211,
    '035218',
    NULL,
    1,
    '2025-06-25 12:04:00',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2815'
  ),
  (
    212,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:17',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    213,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:19',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    214,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:19',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    215,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:21',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    216,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    217,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    218,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    219,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    220,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    221,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    222,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:25',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    223,
    '036671',
    NULL,
    1,
    '2025-06-25 12:04:43',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    224,
    '036671',
    NULL,
    1,
    '2025-06-25 12:05:46',
    'structured_prerequisites',
    '',
    'INTE2625 OR COSC2391'
  ),
  (
    225,
    NULL,
    NULL,
    1,
    '2025-06-25 12:06:06',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    226,
    NULL,
    NULL,
    1,
    '2025-06-25 12:06:08',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    227,
    NULL,
    NULL,
    1,
    '2025-06-25 12:06:08',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    228,
    NULL,
    NULL,
    1,
    '2025-06-25 12:06:08',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    229,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:22',
    'structured_prerequisites',
    '',
    'COSC2804'
  ),
  (
    230,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:40',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    231,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    232,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    233,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    234,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    235,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    236,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    237,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:43',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    238,
    NULL,
    NULL,
    1,
    '2025-06-25 12:07:52',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    239,
    '037889',
    NULL,
    1,
    '2025-06-25 12:08:11',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    240,
    '037889',
    NULL,
    1,
    '2025-06-25 12:08:14',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    241,
    '037889',
    NULL,
    1,
    '2025-06-25 12:08:14',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    242,
    '037889',
    NULL,
    1,
    '2025-06-25 12:08:43',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    243,
    '038096',
    NULL,
    1,
    '2025-06-25 12:09:56',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    244,
    '038096',
    NULL,
    1,
    '2025-06-25 12:09:58',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    245,
    '038096',
    NULL,
    1,
    '2025-06-25 12:09:58',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    246,
    '038096',
    NULL,
    1,
    '2025-06-25 12:10:05',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    247,
    NULL,
    NULL,
    1,
    '2025-06-25 12:10:30',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    248,
    NULL,
    NULL,
    1,
    '2025-06-25 12:10:45',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    249,
    NULL,
    NULL,
    1,
    '2025-06-25 12:11:03',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    250,
    NULL,
    NULL,
    1,
    '2025-06-25 12:11:09',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    251,
    NULL,
    NULL,
    1,
    '2025-06-25 12:11:37',
    'structured_prerequisites',
    '',
    'EEET2246'
  ),
  (
    252,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:02',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    253,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:04',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    254,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:04',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    255,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:13',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    256,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    257,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    258,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    259,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    260,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    261,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    262,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:16',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    263,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:29',
    'sub_type',
    '',
    'Cyber Assurance'
  ),
  (
    264,
    '038407',
    NULL,
    1,
    '2025-06-25 12:12:58',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    265,
    '038407',
    NULL,
    1,
    '2025-06-25 12:14:25',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    266,
    NULL,
    NULL,
    1,
    '2025-06-25 12:14:39',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    267,
    NULL,
    NULL,
    1,
    '2025-06-25 12:14:42',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    268,
    NULL,
    NULL,
    1,
    '2025-06-25 12:14:42',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    269,
    NULL,
    NULL,
    1,
    '2025-06-25 12:14:55',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    270,
    NULL,
    NULL,
    1,
    '2025-06-25 12:15:34',
    'structured_prerequisites',
    '',
    'COSC2123 AND COSC2804'
  ),
  (
    271,
    '039985',
    NULL,
    1,
    '2025-06-25 12:15:51',
    'Course Type',
    '',
    'Core'
  ),
  (
    272,
    '039985',
    NULL,
    1,
    '2025-06-25 12:16:06',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    273,
    '039985',
    NULL,
    1,
    '2025-06-25 12:17:20',
    'structured_prerequisites',
    '',
    'COSC2804 OR ISYS1118 OR COSC2299'
  ),
  (
    274,
    '044233',
    NULL,
    1,
    '2025-06-25 12:17:38',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    275,
    '044233',
    NULL,
    1,
    '2025-06-25 12:17:40',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    276,
    '044233',
    NULL,
    1,
    '2025-06-25 12:17:40',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    277,
    '044233',
    NULL,
    1,
    '2025-06-25 12:17:58',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    278,
    '044272',
    NULL,
    1,
    '2025-06-25 12:18:25',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    279,
    '044272',
    NULL,
    1,
    '2025-06-25 12:18:27',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    280,
    '044272',
    NULL,
    1,
    '2025-06-25 12:18:27',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    281,
    '044272',
    NULL,
    1,
    '2025-06-25 12:18:58',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    282,
    '044450',
    NULL,
    1,
    '2025-06-25 12:19:33',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    283,
    '044450',
    NULL,
    1,
    '2025-06-25 12:19:35',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    284,
    '044450',
    NULL,
    1,
    '2025-06-25 12:19:35',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    285,
    '044450',
    NULL,
    1,
    '2025-06-25 12:19:35',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    286,
    '044450',
    NULL,
    1,
    '2025-06-25 12:20:01',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    287,
    '044450',
    NULL,
    1,
    '2025-06-25 12:21:44',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    288,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:40',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    289,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    290,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    291,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    292,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    293,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    294,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    295,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:43',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    296,
    '044481',
    NULL,
    1,
    '2025-06-25 12:22:59',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    297,
    '044481',
    NULL,
    1,
    '2025-06-25 12:23:26',
    'structured_prerequisites',
    '',
    'COSC2803 OR COSC2123'
  ),
  (
    298,
    '045680',
    NULL,
    1,
    '2025-06-25 12:23:59',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    299,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    300,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    301,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    302,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    303,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    304,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    305,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:01',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    306,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:03',
    'sub_type',
    '',
    'Creative Computing'
  ),
  (
    307,
    '045680',
    NULL,
    1,
    '2025-06-25 12:24:22',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    308,
    '045680',
    NULL,
    1,
    '2025-06-25 12:26:05',
    'structured_prerequisites',
    '',
    'COSC2123 OR COSC1076 OR COSC2391 OR COSC2802 OR COSC2800 OR COSC2803'
  ),
  (
    309,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:22',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    310,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:24',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    311,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:24',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    312,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:26',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    313,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    314,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    315,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    316,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    317,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    318,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    319,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:29',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    320,
    '045940',
    NULL,
    1,
    '2025-06-25 12:26:48',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    321,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:03',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    322,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:08',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    323,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:08',
    'Course Type',
    'Cross-disciplinary Minor',
    ''
  ),
  (
    324,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:08',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    325,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:08',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    326,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:10',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    327,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    328,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    329,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    330,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    331,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    332,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    333,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:13',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    334,
    '048558',
    NULL,
    1,
    '2025-06-25 12:27:51',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    335,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:11',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    336,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:14',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    337,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:14',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    338,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:20',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    339,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    340,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    341,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    342,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    343,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    344,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    345,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:23',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    346,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:36',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    347,
    '049803',
    NULL,
    1,
    '2025-06-25 12:28:58',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    348,
    '049803',
    NULL,
    1,
    '2025-06-25 12:29:30',
    'structured_prerequisites',
    '',
    'COSC2803 OR COSC2391 OR COSC1076'
  ),
  (
    349,
    NULL,
    NULL,
    1,
    '2025-06-25 12:30:10',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    350,
    NULL,
    NULL,
    1,
    '2025-06-25 12:30:12',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    351,
    NULL,
    NULL,
    1,
    '2025-06-25 12:30:12',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    352,
    NULL,
    NULL,
    1,
    '2025-06-25 12:30:22',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    353,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:22',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    354,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    355,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    356,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    357,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    358,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    359,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    360,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    361,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    362,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:24',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    363,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:26',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    364,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:27',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    365,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:27',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    366,
    '050775',
    NULL,
    1,
    '2025-06-25 12:31:36',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    367,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:21',
    'Course Type',
    '',
    'Core'
  ),
  (
    368,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:29',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    369,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:32',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    370,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:32',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    371,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:42',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    372,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    373,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    374,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    375,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    376,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    377,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    378,
    '051831',
    NULL,
    1,
    '2025-06-25 12:32:44',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    379,
    '051831',
    NULL,
    1,
    '2025-06-25 12:33:31',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    380,
    '051831',
    NULL,
    1,
    '2025-06-25 12:34:50',
    'structured_prerequisites',
    '',
    'MATH2411 AND COSC2803 OR EEET2250'
  ),
  (
    381,
    '051832',
    NULL,
    1,
    '2025-06-25 12:35:06',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    382,
    '051832',
    NULL,
    1,
    '2025-06-25 12:35:08',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    383,
    '051832',
    NULL,
    1,
    '2025-06-25 12:35:08',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    384,
    '051832',
    NULL,
    1,
    '2025-06-25 12:35:08',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    385,
    '051832',
    NULL,
    1,
    '2025-06-25 12:35:29',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    386,
    '051832',
    NULL,
    1,
    '2025-06-25 12:35:37',
    'structured_prerequisites',
    '',
    'COSC2391'
  ),
  (
    387,
    NULL,
    NULL,
    1,
    '2025-06-25 12:36:04',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    388,
    NULL,
    NULL,
    1,
    '2025-06-25 12:36:06',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    389,
    NULL,
    NULL,
    1,
    '2025-06-25 12:36:06',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    390,
    NULL,
    NULL,
    1,
    '2025-06-25 12:36:06',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    391,
    NULL,
    NULL,
    1,
    '2025-06-25 12:36:15',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    392,
    NULL,
    NULL,
    1,
    '2025-06-25 12:36:52',
    'structured_prerequisites',
    '',
    'COSC2758 OR COSC2803'
  ),
  (
    393,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:11',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    394,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    395,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    396,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    397,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    398,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    399,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    400,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:14',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    401,
    '052739',
    NULL,
    1,
    '2025-06-25 12:37:20',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    402,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:37',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    403,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:39',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    404,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:39',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    405,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:40',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    406,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    407,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    408,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    409,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    410,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    411,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    412,
    '053170',
    NULL,
    1,
    '2025-06-25 12:37:43',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    413,
    '053170',
    NULL,
    1,
    '2025-06-25 12:38:06',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    414,
    '053170',
    NULL,
    1,
    '2025-06-25 12:38:31',
    'structured_prerequisites',
    '',
    'COSC2803 AND INTE2625'
  ),
  (
    415,
    '053171',
    NULL,
    1,
    '2025-06-25 12:38:59',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    416,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    417,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    418,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    419,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    420,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    421,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    422,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:00',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    423,
    '053171',
    NULL,
    1,
    '2025-06-25 12:39:09',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    424,
    '053171',
    NULL,
    1,
    '2025-06-25 12:40:47',
    'structured_prerequisites',
    '',
    'COSC2803 OR EEET2250'
  ),
  (
    425,
    '053172',
    NULL,
    1,
    '2025-06-25 12:41:12',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    426,
    '053172',
    NULL,
    1,
    '2025-06-25 12:41:13',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    427,
    '053172',
    NULL,
    1,
    '2025-06-25 12:41:13',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    428,
    '053172',
    NULL,
    1,
    '2025-06-25 12:41:13',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    429,
    '053172',
    NULL,
    1,
    '2025-06-25 12:41:26',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    430,
    '053172',
    NULL,
    1,
    '2025-06-25 12:41:46',
    'structured_prerequisites',
    '',
    'COSC2803 OR EEET2250'
  ),
  (
    431,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:18',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    432,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    433,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    434,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    435,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    436,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    437,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    438,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:20',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    439,
    '053407',
    NULL,
    1,
    '2025-06-25 12:42:27',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    440,
    NULL,
    NULL,
    1,
    '2025-06-25 12:42:35',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    441,
    NULL,
    NULL,
    1,
    '2025-06-25 12:43:06',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    442,
    NULL,
    NULL,
    1,
    '2025-06-25 12:43:07',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    443,
    NULL,
    NULL,
    1,
    '2025-06-25 12:45:13',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    444,
    NULL,
    NULL,
    1,
    '2025-06-25 12:45:15',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    445,
    NULL,
    NULL,
    1,
    '2025-06-25 12:45:42',
    'structured_prerequisites',
    '',
    'COSC2799 OR COSC2801'
  ),
  (
    446,
    NULL,
    NULL,
    1,
    '2025-06-25 12:45:47',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    447,
    NULL,
    NULL,
    1,
    '2025-06-25 12:45:51',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    448,
    '054076',
    NULL,
    1,
    '2025-06-25 12:46:30',
    'Course Type',
    '',
    'Core'
  ),
  (
    449,
    '054079',
    NULL,
    1,
    '2025-06-25 12:47:29',
    'Course Type',
    '',
    'Core'
  ),
  (
    450,
    '054079',
    NULL,
    1,
    '2025-06-25 12:47:40',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    451,
    '054080',
    NULL,
    1,
    '2025-06-25 12:48:05',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    452,
    '054080',
    NULL,
    1,
    '2025-06-25 12:48:06',
    'Course Type',
    '',
    'Core'
  ),
  (
    453,
    '054081',
    NULL,
    1,
    '2025-06-25 12:49:41',
    'Course Type',
    '',
    'Core'
  ),
  (
    454,
    '054082',
    NULL,
    1,
    '2025-06-25 12:49:58',
    'Course Type',
    '',
    'Core'
  ),
  (
    455,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:35',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    456,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:37',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    457,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:37',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    458,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:37',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    459,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:37',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    460,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:38',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    461,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    462,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    463,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    464,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    465,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    466,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    467,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:39',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    468,
    '054114',
    NULL,
    1,
    '2025-06-25 12:50:50',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    469,
    '054114',
    NULL,
    1,
    '2025-06-25 12:51:01',
    'structured_prerequisites',
    '',
    'COSC1127'
  ),
  (
    470,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:20',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    471,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    472,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    473,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    474,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    475,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    476,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    477,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:22',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    478,
    '054117',
    NULL,
    1,
    '2025-06-25 12:51:31',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    479,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:49',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    480,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    481,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    482,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    483,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    484,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    485,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    486,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:52',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    487,
    '054120',
    NULL,
    1,
    '2025-06-25 12:51:58',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    488,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:16',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    489,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    490,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    491,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    492,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    493,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    494,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    495,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:18',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    496,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:33',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    497,
    '054140',
    NULL,
    1,
    '2025-06-25 12:52:49',
    'structured_prerequisites',
    '',
    'COSC2757'
  ),
  (
    498,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:08',
    'Course Type',
    '',
    'Core'
  ),
  (
    499,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:13',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    500,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:15',
    'sub_type',
    'Core',
    ''
  ),
  (
    501,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:15',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    502,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:15',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    503,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:15',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    504,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:16',
    'sub_type',
    '',
    'Core'
  ),
  (
    505,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:27',
    'sub_type',
    '',
    'Digital Innovation'
  ),
  (
    506,
    '054229',
    NULL,
    1,
    '2025-06-25 12:53:41',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    507,
    '054230',
    NULL,
    1,
    '2025-06-25 12:54:04',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    508,
    '054230',
    NULL,
    1,
    '2025-06-25 12:54:06',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    509,
    '054230',
    NULL,
    1,
    '2025-06-25 12:54:06',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    510,
    '054230',
    NULL,
    1,
    '2025-06-25 12:54:12',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    511,
    '054381',
    NULL,
    1,
    '2025-06-25 12:54:26',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    512,
    '054381',
    NULL,
    1,
    '2025-06-25 12:54:28',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    513,
    '054381',
    NULL,
    1,
    '2025-06-25 12:54:28',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    514,
    '054381',
    NULL,
    1,
    '2025-06-25 12:54:34',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    515,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:50',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    516,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    517,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    518,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    519,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    520,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    521,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    522,
    '054478',
    NULL,
    1,
    '2025-06-25 12:54:51',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    523,
    '054478',
    NULL,
    1,
    '2025-06-25 12:55:00',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    524,
    '054478',
    NULL,
    1,
    '2025-06-25 12:55:11',
    'structured_prerequisites',
    '',
    'COSC2673'
  ),
  (
    525,
    '054986',
    NULL,
    1,
    '2025-06-25 12:55:36',
    'Course Type',
    '',
    'Core'
  ),
  (
    526,
    '054989',
    NULL,
    1,
    '2025-06-25 12:56:32',
    'Course Type',
    '',
    'Core'
  ),
  (
    527,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:06',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    528,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:09',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    529,
    '054989',
    NULL,
    1,
    '2025-06-25 12:57:10',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    530,
    '054989',
    NULL,
    1,
    '2025-06-25 12:57:40',
    'structured_prerequisites',
    '',
    'COSC2123 AND MATH2411'
  ),
  (
    531,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:51',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    532,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:53',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    533,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:53',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    534,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:55',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    535,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    536,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    537,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    538,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    539,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    540,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    541,
    '054992',
    NULL,
    1,
    '2025-06-25 12:57:58',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    542,
    '054992',
    NULL,
    1,
    '2025-06-25 12:58:12',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    543,
    '054992',
    NULL,
    1,
    '2025-06-25 12:58:22',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    544,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:41',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    545,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:42',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    546,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:42',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    547,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:44',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    548,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    549,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    550,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    551,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    552,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    553,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    554,
    '054993',
    NULL,
    1,
    '2025-06-25 12:58:46',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    555,
    '054993',
    NULL,
    1,
    '2025-06-25 12:59:03',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    556,
    '054993',
    NULL,
    1,
    '2025-06-25 12:59:23',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    557,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:44',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    558,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    559,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    560,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    561,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    562,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    563,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    564,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:46',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    565,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:47',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    566,
    '054995',
    NULL,
    1,
    '2025-06-25 12:59:48',
    'sub_type',
    '',
    'Blockchain Technologies'
  ),
  (
    567,
    '054995',
    NULL,
    1,
    '2025-06-25 13:01:06',
    'structured_prerequisites',
    '',
    'INTE2625 OR COSC2801'
  ),
  (
    568,
    '054995',
    NULL,
    1,
    '2025-06-25 13:01:23',
    'structured_prerequisites',
    '',
    'COSC2801 AND INTE2625'
  ),
  (
    569,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:16',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    570,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    571,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    572,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    573,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    574,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    575,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    576,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:18',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    577,
    NULL,
    NULL,
    1,
    '2025-06-25 13:02:25',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    578,
    '054997',
    NULL,
    1,
    '2025-06-25 13:02:42',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    579,
    '054997',
    NULL,
    1,
    '2025-06-25 13:02:44',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    580,
    '054997',
    NULL,
    1,
    '2025-06-25 13:02:44',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    581,
    '054997',
    NULL,
    1,
    '2025-06-25 13:02:48',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    582,
    '054997',
    NULL,
    1,
    '2025-06-25 13:03:30',
    'structured_prerequisites',
    '',
    'COSC2738 OR COSC2802'
  ),
  (
    583,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:44',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    584,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    585,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    586,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    587,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    588,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    589,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    590,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    591,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    592,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:46',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    593,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:47',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    594,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:49',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    595,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:49',
    'sub_type',
    'Digital Innovation',
    ''
  ),
  (
    596,
    '055001',
    NULL,
    1,
    '2025-06-25 13:03:55',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    597,
    '055925',
    NULL,
    1,
    '2025-06-25 13:04:17',
    'Course Type',
    '',
    'Core'
  ),
  (
    598,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:00',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    599,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    600,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    601,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    602,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    603,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    604,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    605,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:02',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    606,
    '056543',
    NULL,
    1,
    '2025-06-25 13:05:09',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    607,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:42',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    608,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    609,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    610,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    611,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    612,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    613,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    614,
    '056544',
    NULL,
    1,
    '2025-06-25 13:05:44',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    615,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:37',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    616,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    617,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    618,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    619,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    620,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    621,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    622,
    '056545',
    NULL,
    1,
    '2025-06-25 13:06:39',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    623,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:01',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    624,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    625,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    626,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    627,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    628,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    629,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    630,
    '056546',
    NULL,
    1,
    '2025-06-25 13:07:03',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    631,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:10',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    632,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    633,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    634,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    635,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    636,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    637,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    638,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    639,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    640,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:18',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    641,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:19',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    642,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:21',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    643,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:21',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    644,
    '056547',
    NULL,
    1,
    '2025-06-25 13:08:29',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    645,
    '056548',
    NULL,
    1,
    '2025-06-25 13:09:04',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    646,
    '056548',
    NULL,
    1,
    '2025-06-25 13:09:06',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    647,
    '056548',
    NULL,
    1,
    '2025-06-25 13:09:06',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    648,
    '056549',
    NULL,
    1,
    '2025-06-25 13:09:54',
    'Course Type',
    '',
    'Cross-disciplinary Minor'
  ),
  (
    649,
    '056549',
    NULL,
    1,
    '2025-06-25 13:09:56',
    'sub_type',
    'Bioinformatics',
    ''
  ),
  (
    650,
    '056549',
    NULL,
    1,
    '2025-06-25 13:09:56',
    'sub_type',
    'Data Analysis',
    ''
  ),
  (
    651,
    '054076',
    NULL,
    1,
    '2025-06-25 14:19:07',
    'Flex Term Availability',
    'Not Available',
    'Available'
  ),
  (
    652,
    '004186',
    NULL,
    1,
    '2025-06-25 14:20:44',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    653,
    '004186',
    NULL,
    1,
    '2025-06-25 14:20:46',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    654,
    '004186',
    NULL,
    1,
    '2025-06-25 14:20:46',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    655,
    '004186',
    NULL,
    1,
    '2025-06-25 14:20:50',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    656,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    657,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    658,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    659,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    660,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    661,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    662,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    663,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    664,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:00',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    665,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:02',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    666,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:05',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    667,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:05',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    668,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:05',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    669,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:30',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    670,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:30',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    671,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:33',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    672,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:42',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    673,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:42',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    674,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:42',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    675,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:43',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    676,
    '004186',
    NULL,
    1,
    '2025-06-25 14:21:45',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    677,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:10',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    678,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    679,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    680,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    681,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    682,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    683,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    684,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    685,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    686,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:17',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    687,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:29',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    688,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:29',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    689,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:33',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    690,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:33',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    691,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:37',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    692,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:37',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    693,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:42',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    694,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:44',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    695,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:44',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    696,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:44',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    697,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:47',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    698,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:47',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    699,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:47',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    700,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:47',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    701,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:49',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    702,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:52',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    703,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:52',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    704,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:52',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    705,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:55',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    706,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:55',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    707,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:55',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    708,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:55',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    709,
    '004186',
    NULL,
    1,
    '2025-06-25 14:23:58',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    710,
    '004186',
    NULL,
    1,
    '2025-06-25 14:24:01',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    711,
    '004186',
    NULL,
    1,
    '2025-06-25 14:24:01',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    712,
    '004186',
    NULL,
    1,
    '2025-06-25 14:24:01',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    713,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:14',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    714,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:24',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    715,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:24',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    716,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:32',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    717,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:34',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    718,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:34',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    719,
    '004186',
    NULL,
    1,
    '2025-06-25 14:25:34',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    720,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'course_code',
    '',
    'TEST1234'
  ),
  (
    721,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'course_title',
    '',
    'Test 1'
  ),
  (
    722,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'web_url',
    '',
    ''
  ),
  (
    723,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'course_credit',
    '',
    '12'
  ),
  (
    724,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'year',
    '',
    '1'
  ),
  (
    725,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'prerequisite',
    '',
    'true'
  ),
  (
    726,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'course_type',
    '',
    'Core'
  ),
  (
    727,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'course_type',
    '',
    'CS Major'
  ),
  (
    728,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'sub_type',
    '',
    'Advanced Computer Science'
  ),
  (
    729,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'semester_2',
    '',
    'Available'
  ),
  (
    730,
    NULL,
    NULL,
    1,
    '2025-06-25 14:34:48',
    'structured_prerequisites',
    '',
    'MATH2305 AND BIOL2526 OR COSC2348'
  ),
  (
    731,
    NULL,
    NULL,
    1,
    '2025-06-25 14:36:08',
    'course_code',
    'TEST1234',
    ''
  ),
  (
    732,
    NULL,
    NULL,
    1,
    '2025-06-25 14:36:08',
    'course_title',
    'Test 1',
    ''
  ),
  (
    733,
    NULL,
    NULL,
    1,
    '2025-06-25 14:36:08',
    'web_url',
    '',
    ''
  ),
  (
    734,
    NULL,
    NULL,
    1,
    '2025-06-25 14:36:08',
    'course_credit',
    '12',
    ''
  ),
  (
    735,
    NULL,
    NULL,
    1,
    '2025-06-25 14:36:08',
    'year',
    '1',
    ''
  ),
  (
    736,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'course_code',
    '',
    'COSC3106'
  ),
  (
    737,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'course_title',
    '',
    'Python Programming Studio'
  ),
  (
    738,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/056558'
  ),
  (
    739,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'course_credit',
    '',
    '24'
  ),
  (
    740,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'year',
    '',
    '1'
  ),
  (
    741,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'prerequisite',
    '',
    'false'
  ),
  (
    742,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'course_type',
    '',
    'University Elective'
  ),
  (
    743,
    NULL,
    NULL,
    1,
    '2025-06-26 02:06:47',
    'sub_type',
    '',
    'University Elective'
  ),
  (
    744,
    '045680',
    NULL,
    1,
    '2025-06-26 02:08:11',
    'structured_prerequisites',
    '',
    'COSC1076 OR COSC2123 OR COSC2391 OR COSC2800 OR COSC2802 OR COSC2803 OR COSC3106'
  ),
  (
    745,
    '049803',
    NULL,
    1,
    '2025-06-26 02:08:44',
    'structured_prerequisites',
    '',
    'COSC1076 OR COSC2391 OR COSC2803 OR COSC3106'
  ),
  (
    746,
    '044450',
    NULL,
    1,
    '2025-06-26 02:09:26',
    'structured_prerequisites',
    '',
    'COSC2803 OR COSC3106'
  ),
  (
    747,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'course_code',
    '',
    'MATH2201'
  ),
  (
    748,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'course_title',
    '',
    'Statistical Methodologies'
  ),
  (
    749,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/044231'
  ),
  (
    750,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'course_credit',
    '',
    '12'
  ),
  (
    751,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'year',
    '',
    '1'
  ),
  (
    752,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'prerequisite',
    '',
    'false'
  ),
  (
    753,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'course_type',
    '',
    'University Elective'
  ),
  (
    754,
    '044231',
    NULL,
    1,
    '2025-06-26 02:12:12',
    'sub_type',
    '',
    'University Elective'
  ),
  (
    755,
    '044272',
    NULL,
    1,
    '2025-06-26 02:13:03',
    'structured_prerequisites',
    '',
    'MATH2201'
  ),
  (
    756,
    NULL,
    NULL,
    1,
    '2025-06-26 02:13:47',
    'structured_prerequisites',
    '',
    'MATH2201'
  ),
  (
    757,
    '054229',
    NULL,
    1,
    '2025-07-07 06:56:49',
    'credit_points',
    '12',
    '24'
  ),
  (
    758,
    '054229',
    NULL,
    1,
    '2025-07-07 06:57:07',
    'credit_points',
    '24',
    '12'
  ),
  (
    759,
    '054081',
    NULL,
    1,
    '2025-07-09 02:01:56',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    760,
    '055925',
    NULL,
    1,
    '2025-07-09 02:02:14',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    761,
    '054080',
    NULL,
    1,
    '2025-07-09 02:02:19',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    762,
    '054080',
    NULL,
    1,
    '2025-07-09 02:02:21',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    763,
    '054082',
    NULL,
    1,
    '2025-07-09 02:02:25',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    764,
    '054076',
    NULL,
    1,
    '2025-07-09 02:02:32',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    765,
    NULL,
    NULL,
    1,
    '2025-07-09 02:02:44',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    766,
    NULL,
    NULL,
    1,
    '2025-07-09 02:02:46',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    767,
    '044231',
    NULL,
    1,
    '2025-07-09 02:02:48',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    768,
    '044231',
    NULL,
    1,
    '2025-07-09 02:02:49',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    769,
    '054986',
    NULL,
    1,
    '2025-07-09 02:03:06',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    770,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'course_code',
    '',
    'OENG1235'
  ),
  (
    771,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'course_title',
    '',
    'Innovation Ecosystem and the Future of Work'
  ),
  (
    772,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'web_url',
    '',
    ''
  ),
  (
    773,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'course_credit',
    '',
    '12'
  ),
  (
    774,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'year',
    '',
    '3'
  ),
  (
    775,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'prerequisite',
    '',
    'false'
  ),
  (
    776,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'course_type',
    '',
    'Core'
  ),
  (
    777,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'sub_type',
    '',
    'Core'
  ),
  (
    778,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'semester_1',
    '',
    'Available'
  ),
  (
    779,
    '054910',
    NULL,
    1,
    '2025-07-09 02:05:30',
    'semester_2',
    '',
    'Available'
  ),
  (
    780,
    NULL,
    NULL,
    1,
    '2025-07-09 02:06:40',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    781,
    NULL,
    NULL,
    1,
    '2025-07-09 02:06:41',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    782,
    NULL,
    NULL,
    1,
    '2025-07-09 02:06:58',
    'Course Type',
    'University Elective',
    ''
  ),
  (
    783,
    NULL,
    NULL,
    1,
    '2025-07-09 02:06:58',
    'sub_type',
    'University Elective',
    ''
  ),
  (
    784,
    NULL,
    NULL,
    1,
    '2025-07-09 02:10:18',
    'Course Type',
    '',
    'University Elective'
  ),
  (
    785,
    NULL,
    NULL,
    1,
    '2025-07-09 02:11:42',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    786,
    NULL,
    NULL,
    1,
    '2025-07-09 02:11:43',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    787,
    NULL,
    NULL,
    1,
    '2025-07-09 02:12:00',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    788,
    NULL,
    NULL,
    1,
    '2025-07-09 02:12:03',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    789,
    NULL,
    NULL,
    1,
    '2025-07-09 02:12:11',
    'year',
    '1',
    '2'
  ),
  (
    790,
    '054995',
    NULL,
    1,
    '2025-07-09 02:12:31',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    791,
    '054995',
    NULL,
    1,
    '2025-07-09 02:12:34',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    792,
    NULL,
    NULL,
    1,
    '2025-07-09 02:12:35',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    793,
    NULL,
    NULL,
    1,
    '2025-07-09 02:12:35',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    794,
    '056544',
    NULL,
    1,
    '2025-07-09 02:12:57',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    795,
    '056544',
    NULL,
    1,
    '2025-07-09 02:12:58',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    796,
    '056545',
    NULL,
    1,
    '2025-07-09 02:13:00',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    797,
    '056545',
    NULL,
    1,
    '2025-07-09 02:13:01',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    798,
    '056546',
    NULL,
    1,
    '2025-07-09 02:13:03',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    799,
    '056546',
    NULL,
    1,
    '2025-07-09 02:13:04',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    800,
    '056544',
    NULL,
    1,
    '2025-07-09 02:13:07',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    801,
    '056548',
    NULL,
    1,
    '2025-07-09 02:13:34',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    802,
    '056548',
    NULL,
    1,
    '2025-07-09 02:13:35',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    803,
    '056549',
    NULL,
    1,
    '2025-07-09 02:13:42',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    804,
    '056549',
    NULL,
    1,
    '2025-07-09 02:13:44',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    805,
    NULL,
    NULL,
    1,
    '2025-07-09 03:01:36',
    'year',
    '1',
    '3'
  ),
  (
    806,
    NULL,
    NULL,
    1,
    '2025-07-09 03:01:50',
    'year',
    '3',
    '1'
  ),
  (
    807,
    '004123',
    NULL,
    1,
    '2025-07-15 05:37:33',
    'Course Type',
    '',
    'Program Course'
  ),
  (
    808,
    '051831',
    NULL,
    1,
    '2025-07-15 05:38:13',
    'Course Type',
    '',
    'Program Course'
  ),
  (
    809,
    '014049',
    NULL,
    1,
    '2025-07-15 05:38:45',
    'Course Type',
    '',
    'Program Course'
  ),
  (
    810,
    '004123',
    NULL,
    1,
    '2025-07-15 05:39:06',
    'Course Type',
    'Core',
    ''
  ),
  (
    811,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:21',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    812,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:21',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    813,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:21',
    'Course Type',
    '',
    'Program Course'
  ),
  (
    814,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:21',
    'Course Type',
    '',
    'Core'
  ),
  (
    815,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:21',
    'Course Type',
    'University Elective',
    ''
  ),
  (
    816,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:55',
    'course_code',
    'COSC1076',
    ''
  ),
  (
    817,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:55',
    'course_title',
    'Advanced Programming Techniques',
    ''
  ),
  (
    818,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:55',
    'web_url',
    'https://www1.rmit.edu.au/courses/004068',
    ''
  ),
  (
    819,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:55',
    'course_credit',
    '12',
    ''
  ),
  (
    820,
    NULL,
    NULL,
    1,
    '2025-07-15 05:39:55',
    'year',
    '2',
    ''
  ),
  (
    821,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'course_code',
    '',
    'COSC1076'
  ),
  (
    822,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'course_title',
    '',
    'Advanced Programming Techniques'
  ),
  (
    823,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'web_url',
    '',
    ''
  ),
  (
    824,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'course_credit',
    '',
    '12'
  ),
  (
    825,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'year',
    '',
    '2'
  ),
  (
    826,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'prerequisite',
    '',
    'true'
  ),
  (
    827,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'course_type',
    '',
    'University Elective'
  ),
  (
    828,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'sub_type',
    '',
    'University Elective'
  ),
  (
    829,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'semester_1',
    '',
    'Available'
  ),
  (
    830,
    NULL,
    NULL,
    1,
    '2025-07-15 05:41:29',
    'structured_prerequisites',
    '',
    'COSC2799 OR COSC2801'
  ),
  (
    831,
    '051831',
    NULL,
    1,
    '2025-07-15 05:43:22',
    'sub_type',
    'Core',
    ''
  ),
  (
    832,
    '014049',
    NULL,
    1,
    '2025-07-15 05:44:58',
    'Course Type',
    'Core',
    ''
  ),
  (
    833,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'course_code',
    '',
    'COSC1234'
  ),
  (
    834,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'course_title',
    '',
    'TEST1'
  ),
  (
    835,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'web_url',
    '',
    ''
  ),
  (
    836,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'course_credit',
    '',
    '12'
  ),
  (
    837,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'year',
    '',
    '1'
  ),
  (
    838,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'prerequisite',
    '',
    'true'
  ),
  (
    839,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'course_type',
    '',
    'CS Major'
  ),
  (
    840,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    841,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'course_type',
    '',
    'Program Course'
  ),
  (
    842,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'sub_type',
    '',
    'Cyber Security'
  ),
  (
    843,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'sub_type',
    '',
    'Creative Computing'
  ),
  (
    844,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'sub_type',
    '',
    'Program Course'
  ),
  (
    845,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'semester_1',
    '',
    'Available'
  ),
  (
    846,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'semester_2',
    '',
    'Available'
  ),
  (
    847,
    NULL,
    NULL,
    1,
    '2025-07-15 09:00:53',
    'structured_prerequisites',
    '',
    'BIOL2512 OR COSC3106'
  ),
  (
    848,
    NULL,
    NULL,
    1,
    '2025-07-15 09:01:05',
    'Course Title',
    'TEST1',
    'TEST2'
  ),
  (
    849,
    NULL,
    NULL,
    1,
    '2025-07-15 09:03:57',
    'course_code',
    'COSC1234',
    ''
  ),
  (
    850,
    NULL,
    NULL,
    1,
    '2025-07-15 09:03:57',
    'course_title',
    'TEST2',
    ''
  ),
  (
    851,
    NULL,
    NULL,
    1,
    '2025-07-15 09:03:57',
    'web_url',
    '',
    ''
  ),
  (
    852,
    NULL,
    NULL,
    1,
    '2025-07-15 09:03:57',
    'course_credit',
    '12',
    ''
  ),
  (
    853,
    NULL,
    NULL,
    1,
    '2025-07-15 09:03:57',
    'year',
    '1',
    ''
  ),
  (
    854,
    '054079',
    NULL,
    1,
    '2025-07-19 08:46:20',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    855,
    '054079',
    NULL,
    1,
    '2025-07-19 08:46:34',
    'structured_prerequisites',
    '',
    ''
  ),
  (
    856,
    '054081',
    NULL,
    1,
    '2025-07-19 08:47:10',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    857,
    '054081',
    NULL,
    1,
    '2025-07-19 08:47:13',
    'structured_prerequisites',
    '',
    ''
  ),
  (
    858,
    '054080',
    NULL,
    1,
    '2025-07-19 08:58:10',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    859,
    '054082',
    NULL,
    1,
    '2025-07-19 08:58:11',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    860,
    '054080',
    NULL,
    1,
    '2025-07-19 08:58:41',
    'structured_prerequisites',
    '',
    'COSC2801'
  ),
  (
    861,
    '054076',
    NULL,
    1,
    '2025-07-19 09:00:06',
    'structured_prerequisites',
    '',
    'MATH2466'
  ),
  (
    862,
    '004309',
    NULL,
    1,
    '2025-07-19 09:00:57',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    863,
    NULL,
    NULL,
    1,
    '2025-07-19 09:01:37',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    864,
    NULL,
    NULL,
    1,
    '2025-07-19 09:02:37',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2802'
  ),
  (
    865,
    '039985',
    NULL,
    1,
    '2025-07-19 09:17:43',
    'structured_prerequisites',
    '',
    'COSC2299 OR COSC2804'
  ),
  (
    866,
    '039985',
    NULL,
    1,
    '2025-07-19 09:17:46',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    867,
    '054986',
    NULL,
    1,
    '2025-07-19 09:18:48',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    868,
    '054229',
    NULL,
    1,
    '2025-07-19 09:19:22',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    869,
    '014049',
    NULL,
    1,
    '2025-07-19 09:20:56',
    'structured_prerequisites',
    '',
    'ISYS1118 AND COSC2391 OR COSC2802'
  ),
  (
    870,
    '051831',
    NULL,
    1,
    '2025-07-19 09:23:36',
    'structured_prerequisites',
    '',
    'MATH2411 AND COSC2803'
  ),
  (
    871,
    '004111',
    NULL,
    1,
    '2025-07-19 09:24:32',
    'structured_prerequisites',
    '',
    'COSC2804'
  ),
  (
    872,
    '049803',
    NULL,
    1,
    '2025-07-19 09:26:02',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2803 OR COSC3106'
  ),
  (
    873,
    '049803',
    NULL,
    1,
    '2025-07-19 09:27:04',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2803'
  ),
  (
    874,
    NULL,
    NULL,
    1,
    '2025-07-19 09:28:19',
    'course_code',
    'COSC2406',
    ''
  ),
  (
    875,
    NULL,
    NULL,
    1,
    '2025-07-19 09:28:19',
    'course_title',
    'Database Systems',
    ''
  ),
  (
    876,
    NULL,
    NULL,
    1,
    '2025-07-19 09:28:19',
    'web_url',
    'https://www1.rmit.edu.au/courses/039983',
    ''
  ),
  (
    877,
    NULL,
    NULL,
    1,
    '2025-07-19 09:28:19',
    'course_credit',
    '12',
    ''
  ),
  (
    878,
    NULL,
    NULL,
    1,
    '2025-07-19 09:28:19',
    'year',
    '2',
    ''
  ),
  (
    879,
    '054997',
    NULL,
    1,
    '2025-07-19 09:29:28',
    'structured_prerequisites',
    '',
    'COSC2738 OR COSC2802'
  ),
  (
    880,
    '054997',
    NULL,
    1,
    '2025-07-19 22:02:20',
    'structured_prerequisites',
    '',
    'COSC2804 AND COSC2123'
  ),
  (
    881,
    '054997',
    NULL,
    1,
    '2025-07-19 22:03:15',
    'structured_prerequisites',
    '',
    'COSC2738 OR COSC2802'
  ),
  (
    882,
    '004175',
    NULL,
    1,
    '2025-07-19 22:03:53',
    'structured_prerequisites',
    '',
    'COSC2123 AND COSC2804'
  ),
  (
    883,
    '014049',
    NULL,
    1,
    '2025-07-19 22:04:32',
    'structured_prerequisites',
    '',
    'ISYS1118 AND COSC2391 OR COSC2802'
  ),
  (
    884,
    '039985',
    NULL,
    1,
    '2025-07-19 22:05:51',
    'structured_prerequisites',
    '',
    'COSC2299 OR COSC2804 AND ISYS1118'
  ),
  (
    885,
    '045940',
    NULL,
    1,
    '2025-07-23 06:31:13',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    886,
    '054381',
    NULL,
    1,
    '2025-07-23 06:32:43',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    887,
    '054992',
    NULL,
    1,
    '2025-07-23 06:35:04',
    'structured_prerequisites',
    '',
    'INTE2625 OR COSC2536'
  ),
  (
    888,
    '054992',
    NULL,
    1,
    '2025-07-23 06:35:28',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    889,
    '004178',
    NULL,
    1,
    '2025-07-23 06:36:21',
    'structured_prerequisites',
    '',
    'INTE2625 OR COSC2536'
  ),
  (
    890,
    '053170',
    NULL,
    1,
    '2025-07-23 06:37:54',
    'structured_prerequisites',
    '',
    'COSC2803 AND INTE2625 OR COSC2536'
  ),
  (
    891,
    '054993',
    NULL,
    1,
    '2025-07-23 06:40:27',
    'structured_prerequisites',
    '',
    'INTE2625 OR COSC2536'
  ),
  (
    892,
    '036671',
    NULL,
    1,
    '2025-07-23 06:45:12',
    'structured_prerequisites',
    '',
    'INTE2625'
  ),
  (
    893,
    '036671',
    NULL,
    1,
    '2025-07-23 06:45:22',
    'Course Code',
    'COSC2302',
    'COSC2301'
  ),
  (
    894,
    '014052',
    NULL,
    1,
    '2025-07-23 07:03:37',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    895,
    '014052',
    NULL,
    1,
    '2025-07-23 07:04:07',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    896,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:51',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    897,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:52',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    898,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:52',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    899,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:53',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    900,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:53',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    901,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:54',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    902,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:54',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    903,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:57',
    'Course Type',
    'Core',
    ''
  ),
  (
    904,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:57',
    'sub_type',
    'Core',
    ''
  ),
  (
    905,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:57',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    906,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:57',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    907,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:57',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    908,
    NULL,
    NULL,
    1,
    '2025-07-23 07:04:57',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    909,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:01',
    'Course Type',
    '',
    'Core'
  ),
  (
    910,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:01',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    911,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:45',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    912,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:48',
    'Course Type',
    'Core',
    ''
  ),
  (
    913,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:48',
    'sub_type',
    'Core',
    ''
  ),
  (
    914,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:50',
    'Course Type',
    '',
    'Core'
  ),
  (
    915,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:56',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    916,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:56',
    'Course Type',
    'Core',
    ''
  ),
  (
    917,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:59',
    'sub_type',
    '',
    'Core'
  ),
  (
    918,
    NULL,
    NULL,
    1,
    '2025-07-23 07:05:59',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    919,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:00',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    920,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:00',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    921,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:00',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    922,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:01',
    'sub_type',
    'Core',
    ''
  ),
  (
    923,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:01',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    924,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:01',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    925,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:01',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    926,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:20',
    'Course Type',
    '',
    'Core'
  ),
  (
    927,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:22',
    'Course Type',
    'Core',
    ''
  ),
  (
    928,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:22',
    'sub_type',
    'Core',
    ''
  ),
  (
    929,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:33',
    'course_code',
    'COSC2123',
    ''
  ),
  (
    930,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:33',
    'course_title',
    'Algorithms and Analysis',
    ''
  ),
  (
    931,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:33',
    'web_url',
    'https://www1.rmit.edu.au/courses/004302',
    ''
  ),
  (
    932,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:33',
    'course_credit',
    '12',
    ''
  ),
  (
    933,
    NULL,
    NULL,
    1,
    '2025-07-23 07:06:33',
    'year',
    '2',
    ''
  ),
  (
    934,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'course_code',
    '',
    'COSC2123'
  ),
  (
    935,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'course_title',
    '',
    'Algorithms and Analysis'
  ),
  (
    936,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'web_url',
    '',
    'http://www1.rmit.edu.au/courses/004302'
  ),
  (
    937,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'course_credit',
    '',
    '12'
  ),
  (
    938,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'year',
    '',
    '2'
  ),
  (
    939,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'prerequisite',
    '',
    'true'
  ),
  (
    940,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'course_type',
    '',
    'Core'
  ),
  (
    941,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'sub_type',
    '',
    'Core'
  ),
  (
    942,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'semester_1',
    '',
    'Available'
  ),
  (
    943,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'semester_2',
    '',
    'Available'
  ),
  (
    944,
    '004302',
    NULL,
    1,
    '2025-07-23 07:08:02',
    'structured_prerequisites',
    '',
    'COSC2802 OR COSC2391'
  ),
  (
    945,
    '053172',
    NULL,
    1,
    '2025-07-23 07:10:21',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    946,
    '035218',
    NULL,
    1,
    '2025-07-23 07:14:09',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2804'
  ),
  (
    947,
    '035218',
    NULL,
    1,
    '2025-07-23 07:14:30',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    948,
    '035218',
    NULL,
    1,
    '2025-07-23 07:14:30',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    949,
    '044450',
    NULL,
    1,
    '2025-07-23 08:29:42',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    950,
    NULL,
    NULL,
    1,
    '2025-07-23 08:30:17',
    'course_code',
    'COSC2675',
    ''
  ),
  (
    951,
    NULL,
    NULL,
    1,
    '2025-07-23 08:30:17',
    'course_title',
    'Rapid Application Development',
    ''
  ),
  (
    952,
    NULL,
    NULL,
    1,
    '2025-07-23 08:30:17',
    'web_url',
    'https://www1.rmit.edu.au/courses/051833',
    ''
  ),
  (
    953,
    NULL,
    NULL,
    1,
    '2025-07-23 08:30:17',
    'course_credit',
    '12',
    ''
  ),
  (
    954,
    NULL,
    NULL,
    1,
    '2025-07-23 08:30:17',
    'year',
    '2',
    ''
  ),
  (
    955,
    '014049',
    NULL,
    1,
    '2025-07-23 08:30:50',
    'structured_prerequisites',
    '',
    'ISYS1118 AND COSC2391 OR COSC2802'
  ),
  (
    956,
    '051832',
    NULL,
    1,
    '2025-07-23 08:32:57',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2804'
  ),
  (
    957,
    '045680',
    NULL,
    1,
    '2025-07-23 08:36:07',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2802 OR COSC2803 OR COSC2123'
  ),
  (
    958,
    NULL,
    NULL,
    1,
    '2025-07-23 08:36:21',
    'course_code',
    'COSC3106',
    ''
  ),
  (
    959,
    NULL,
    NULL,
    1,
    '2025-07-23 08:36:21',
    'course_title',
    'Python Programming Studio',
    ''
  ),
  (
    960,
    NULL,
    NULL,
    1,
    '2025-07-23 08:36:21',
    'web_url',
    'https://www1.rmit.edu.au/courses/056558',
    ''
  ),
  (
    961,
    NULL,
    NULL,
    1,
    '2025-07-23 08:36:21',
    'course_credit',
    '24',
    ''
  ),
  (
    962,
    NULL,
    NULL,
    1,
    '2025-07-23 08:36:21',
    'year',
    '1',
    ''
  ),
  (
    963,
    '054995',
    NULL,
    1,
    '2025-07-23 08:38:37',
    'Course Code',
    'COSC4444',
    'INTE2628'
  ),
  (
    964,
    '054995',
    NULL,
    1,
    '2025-07-23 08:38:56',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    965,
    '053407',
    NULL,
    1,
    '2025-07-23 08:40:02',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    966,
    NULL,
    NULL,
    1,
    '2025-07-23 08:40:51',
    'Course Code',
    'COSC4445',
    'INTE2628'
  ),
  (
    967,
    NULL,
    NULL,
    1,
    '2025-07-23 08:41:07',
    'Course Code',
    'COSC4445',
    'INTE2628'
  ),
  (
    968,
    NULL,
    NULL,
    1,
    '2025-07-23 08:42:00',
    'Course Code',
    'COSC4445',
    'INTE2628'
  ),
  (
    969,
    NULL,
    NULL,
    1,
    '2025-07-23 08:42:22',
    'course_code',
    'COSC4445',
    ''
  ),
  (
    970,
    NULL,
    NULL,
    1,
    '2025-07-23 08:42:22',
    'course_title',
    'Blockchain Innovations and Case Studies',
    ''
  ),
  (
    971,
    NULL,
    NULL,
    1,
    '2025-07-23 08:42:22',
    'web_url',
    'https://www1.rmit.edu.au/courses/054996',
    ''
  ),
  (
    972,
    NULL,
    NULL,
    1,
    '2025-07-23 08:42:22',
    'course_credit',
    '12',
    ''
  ),
  (
    973,
    NULL,
    NULL,
    1,
    '2025-07-23 08:42:22',
    'year',
    '2',
    ''
  ),
  (
    974,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'course_code',
    '',
    'INTE2629'
  ),
  (
    975,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'course_title',
    '',
    'Blockchain Innovations and Case Studies'
  ),
  (
    976,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'web_url',
    '',
    'http://www1.rmit.edu.au/courses/054996'
  ),
  (
    977,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'course_credit',
    '',
    '12'
  ),
  (
    978,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'year',
    '',
    '3'
  ),
  (
    979,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'prerequisite',
    '',
    'true'
  ),
  (
    980,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    981,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'sub_type',
    '',
    'Blockchain Technologies'
  ),
  (
    982,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'semester_2',
    '',
    'Available'
  ),
  (
    983,
    '054996',
    NULL,
    1,
    '2025-07-23 08:46:50',
    'structured_prerequisites',
    '',
    'COSC2801 OR COSC2960'
  ),
  (
    984,
    '053171',
    NULL,
    1,
    '2025-07-23 08:47:35',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    985,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'course_code',
    '',
    'COSC2829'
  ),
  (
    986,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'course_title',
    '',
    'Cloud Architecting'
  ),
  (
    987,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'web_url',
    '',
    'http://www1.rmit.edu.au/courses/054142'
  ),
  (
    988,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'course_credit',
    '',
    '12'
  ),
  (
    989,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'year',
    '',
    '3'
  ),
  (
    990,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'prerequisite',
    '',
    'true'
  ),
  (
    991,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    992,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'sub_type',
    '',
    'Cloud Computing'
  ),
  (
    993,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'semester_2',
    '',
    'Available'
  ),
  (
    994,
    '054142',
    NULL,
    1,
    '2025-07-23 08:50:02',
    'structured_prerequisites',
    '',
    'COSC2757'
  ),
  (
    995,
    '044481',
    NULL,
    1,
    '2025-07-23 08:51:34',
    'structured_prerequisites',
    '',
    'COSC2803 OR COSC2123'
  ),
  (
    996,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'course_code',
    '',
    'COSC2349'
  ),
  (
    997,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'course_title',
    '',
    'Games Studio 2'
  ),
  (
    998,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'web_url',
    '',
    'http://www1.rmit.edu.au/courses/037016'
  ),
  (
    999,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'course_credit',
    '',
    '12'
  ),
  (
    1000,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'year',
    '',
    '3'
  ),
  (
    1001,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'prerequisite',
    '',
    'true'
  ),
  (
    1002,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    1003,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'sub_type',
    '',
    'Creative Computing'
  ),
  (
    1004,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'semester_2',
    '',
    'Available'
  ),
  (
    1005,
    '037016',
    NULL,
    1,
    '2025-07-23 08:55:18',
    'structured_prerequisites',
    '',
    'ISYS1118'
  ),
  (
    1006,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'course_code',
    '',
    'COSC1183'
  ),
  (
    1007,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'course_title',
    '',
    'Usability Engineering'
  ),
  (
    1008,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'web_url',
    '',
    'http://www1.rmit.edu.au/courses/004199'
  ),
  (
    1009,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'course_credit',
    '',
    '12'
  ),
  (
    1010,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'year',
    '',
    '3'
  ),
  (
    1011,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'prerequisite',
    '',
    'true'
  ),
  (
    1012,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    1013,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'sub_type',
    '',
    'Creative Computing'
  ),
  (
    1014,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'semester_2',
    '',
    'Available'
  ),
  (
    1015,
    '004199',
    NULL,
    1,
    '2025-07-23 08:57:18',
    'structured_prerequisites',
    '',
    'ISYS1118'
  ),
  (
    1016,
    '052739',
    NULL,
    1,
    '2025-07-23 08:58:23',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    1017,
    '054117',
    NULL,
    1,
    '2025-07-23 08:59:00',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    1018,
    '054117',
    NULL,
    1,
    '2025-07-23 08:59:20',
    'structured_prerequisites',
    '',
    'COSC2801'
  ),
  (
    1019,
    '048558',
    NULL,
    1,
    '2025-07-23 08:59:56',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    1020,
    '048558',
    NULL,
    1,
    '2025-07-23 09:01:23',
    'structured_prerequisites',
    '',
    ''
  ),
  (
    1021,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'course_code',
    '',
    'MATH2412'
  ),
  (
    1022,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'course_title',
    '',
    'Practical Statistics'
  ),
  (
    1023,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'web_url',
    '',
    'http://www1.rmit.edu.au/courses/054077'
  ),
  (
    1024,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'course_credit',
    '',
    '12'
  ),
  (
    1025,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'year',
    '',
    '2'
  ),
  (
    1026,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'prerequisite',
    '',
    'false'
  ),
  (
    1027,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'course_type',
    '',
    'University Elective'
  ),
  (
    1028,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'sub_type',
    '',
    'University Elective'
  ),
  (
    1029,
    '054077',
    NULL,
    1,
    '2025-07-23 09:03:24',
    'semester_2',
    '',
    'Available'
  ),
  (
    1030,
    '048558',
    NULL,
    1,
    '2025-07-23 09:03:57',
    'structured_prerequisites',
    '',
    'MATH2412'
  ),
  (
    1031,
    '056544',
    NULL,
    1,
    '2025-07-23 09:05:08',
    'Course Code',
    'COSC3333',
    'COSC3100'
  ),
  (
    1032,
    '056544',
    NULL,
    1,
    '2025-07-23 09:05:36',
    'structured_prerequisites',
    '',
    'COSC3099'
  ),
  (
    1033,
    '056545',
    NULL,
    1,
    '2025-07-23 09:06:01',
    'Course Code',
    'COSC5555',
    'COSC3101'
  ),
  (
    1034,
    '056545',
    NULL,
    1,
    '2025-07-23 09:06:34',
    'structured_prerequisites',
    '',
    'COSC3099'
  ),
  (
    1035,
    '056545',
    NULL,
    1,
    '2025-07-23 09:07:05',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    1036,
    '056545',
    NULL,
    1,
    '2025-07-23 09:07:06',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    1037,
    '056546',
    NULL,
    1,
    '2025-07-23 09:08:12',
    'Course Code',
    'COSC5556',
    'COSC3102'
  ),
  (
    1038,
    '056546',
    NULL,
    1,
    '2025-07-23 09:13:31',
    'structured_prerequisites',
    '',
    ''
  ),
  (
    1039,
    '056546',
    NULL,
    1,
    '2025-07-23 09:14:06',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    1040,
    '056546',
    NULL,
    1,
    '2025-07-23 09:14:40',
    'structured_prerequisites',
    '',
    'COSC3099 AND COSC3100 AND COSC3101'
  ),
  (
    1041,
    '056545',
    NULL,
    1,
    '2025-07-23 09:14:48',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    1042,
    '004175',
    NULL,
    1,
    '2025-07-23 11:29:37',
    'structured_prerequisites',
    '',
    'COSC2123 AND COSC2804'
  ),
  (
    1043,
    '004108',
    NULL,
    1,
    '2025-07-23 11:30:02',
    'structured_prerequisites',
    '',
    'COSC2123 AND MATH2411'
  ),
  (
    1044,
    '004123',
    NULL,
    1,
    '2025-07-23 11:30:27',
    'structured_prerequisites',
    '',
    'COSC2123'
  ),
  (
    1045,
    NULL,
    NULL,
    1,
    '2025-07-23 11:30:45',
    'course_code',
    'COSC1187',
    ''
  ),
  (
    1046,
    NULL,
    NULL,
    1,
    '2025-07-23 11:30:45',
    'course_title',
    'Interactive 3D Graphics and Animation',
    ''
  ),
  (
    1047,
    NULL,
    NULL,
    1,
    '2025-07-23 11:30:45',
    'web_url',
    'https://www1.rmit.edu.au/courses/004201',
    ''
  ),
  (
    1048,
    NULL,
    NULL,
    1,
    '2025-07-23 11:30:45',
    'course_credit',
    '12',
    ''
  ),
  (
    1049,
    NULL,
    NULL,
    1,
    '2025-07-23 11:30:45',
    'year',
    '2',
    ''
  ),
  (
    1050,
    '004218',
    NULL,
    1,
    '2025-07-23 11:38:22',
    'sub_type',
    '',
    'Advanced Computer Science'
  ),
  (
    1051,
    '004175',
    NULL,
    1,
    '2025-07-23 12:05:51',
    'structured_prerequisites',
    '',
    'COSC2804'
  ),
  (
    1052,
    '054996',
    NULL,
    1,
    '2025-07-23 12:47:27',
    'year',
    '3',
    '2'
  ),
  (
    1053,
    '054995',
    NULL,
    1,
    '2025-07-23 12:47:31',
    'year',
    '2',
    '3'
  ),
  (
    1054,
    '053407',
    NULL,
    1,
    '2025-07-23 12:47:41',
    'year',
    '2',
    '3'
  ),
  (
    1055,
    NULL,
    NULL,
    1,
    '2025-07-23 12:50:39',
    'course_code',
    'COSC2347',
    ''
  ),
  (
    1056,
    NULL,
    NULL,
    1,
    '2025-07-23 12:50:39',
    'course_title',
    'Mobile Application Development',
    ''
  ),
  (
    1057,
    NULL,
    NULL,
    1,
    '2025-07-23 12:50:39',
    'web_url',
    'https://www1.rmit.edu.au/courses/036687',
    ''
  ),
  (
    1058,
    NULL,
    NULL,
    1,
    '2025-07-23 12:50:39',
    'course_credit',
    '12',
    ''
  ),
  (
    1059,
    NULL,
    NULL,
    1,
    '2025-07-23 12:50:39',
    'year',
    '2',
    ''
  ),
  (
    1060,
    '004302',
    NULL,
    1,
    '2025-07-23 13:07:14',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2802'
  ),
  (
    1061,
    '004108',
    NULL,
    1,
    '2025-07-24 05:20:35',
    'structured_prerequisites',
    '',
    'COSC2123 AND MATH2411'
  ),
  (
    1062,
    '054989',
    NULL,
    1,
    '2025-07-24 05:54:54',
    'structured_prerequisites',
    '',
    'COSC2123 AND MATH2411'
  ),
  (
    1063,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'course_code',
    '',
    'COSC2973'
  ),
  (
    1064,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'course_title',
    '',
    'Intelligent Decision Making'
  ),
  (
    1065,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/054479'
  ),
  (
    1066,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'course_credit',
    '',
    '12'
  ),
  (
    1067,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'year',
    '',
    '3'
  ),
  (
    1068,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'prerequisite',
    '',
    'true'
  ),
  (
    1069,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'course_type',
    '',
    'CS Major'
  ),
  (
    1070,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'sub_type',
    '',
    'Advanced Computer Science'
  ),
  (
    1071,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'semester_1',
    '',
    'Available'
  ),
  (
    1072,
    '054479',
    NULL,
    1,
    '2025-11-08 06:47:01',
    'structured_prerequisites',
    '',
    'COSC2123'
  ),
  (
    1073,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:21',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1074,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1075,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1076,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1077,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1078,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1079,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1080,
    '054997',
    NULL,
    1,
    '2025-11-08 06:50:25',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1081,
    '054478',
    NULL,
    1,
    '2025-11-08 06:51:35',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    1082,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:00',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    1083,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:01',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    1084,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:01',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    1085,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:01',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    1086,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:01',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1087,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:03',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    1088,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:05',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1089,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    1090,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1091,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    1092,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1093,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1094,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1095,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1096,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1097,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1098,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:28',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1099,
    '054478',
    NULL,
    1,
    '2025-11-08 06:52:32',
    'sub_type',
    '',
    'Artificial Intelligence & Machine Learning'
  ),
  (
    1100,
    '004110',
    NULL,
    1,
    '2025-11-08 06:53:15',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    1101,
    '054381',
    NULL,
    1,
    '2025-11-08 06:55:45',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    1102,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:04',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    1103,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:17',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    1104,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:17',
    'Course Type',
    'CS Major',
    ''
  ),
  (
    1105,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:17',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    1106,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:17',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1107,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:17',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1108,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:17',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    1109,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:23',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    1110,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:26',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1111,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    1112,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1113,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    1114,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1115,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1116,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1117,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1118,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1119,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1120,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:32',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1121,
    '054995',
    NULL,
    1,
    '2025-11-08 06:57:35',
    'sub_type',
    '',
    'Cyber Assurance'
  ),
  (
    1122,
    '054995',
    NULL,
    1,
    '2025-11-08 06:58:09',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    1123,
    '054995',
    NULL,
    1,
    '2025-11-08 06:58:09',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1124,
    '054995',
    NULL,
    1,
    '2025-11-08 06:58:15',
    'sub_type',
    '',
    'Cyber Security'
  ),
  (
    1125,
    '054995',
    NULL,
    1,
    '2025-11-08 06:58:19',
    'sub_type',
    '',
    'Blockchain Technologies'
  ),
  (
    1126,
    '004218',
    NULL,
    1,
    '2025-11-08 07:01:16',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    1127,
    '051832',
    NULL,
    1,
    '2025-11-08 07:02:13',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    1128,
    '051832',
    NULL,
    1,
    '2025-11-08 07:02:14',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    1129,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'course_code',
    '',
    'ISYS3459'
  ),
  (
    1130,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'course_title',
    '',
    'Systems Architecture and Design'
  ),
  (
    1131,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/054991'
  ),
  (
    1132,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'course_credit',
    '',
    '12'
  ),
  (
    1133,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'year',
    '',
    '3'
  ),
  (
    1134,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'prerequisite',
    '',
    'true'
  ),
  (
    1135,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'course_type',
    '',
    'CS Major'
  ),
  (
    1136,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    1137,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'semester_2',
    '',
    'Available'
  ),
  (
    1138,
    '054991',
    NULL,
    1,
    '2025-11-08 07:05:18',
    'structured_prerequisites',
    '',
    'ISYS1118'
  ),
  (
    1139,
    '004199',
    NULL,
    1,
    '2025-11-08 07:05:55',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1140,
    '004199',
    NULL,
    1,
    '2025-11-08 07:05:55',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    1141,
    '004199',
    NULL,
    1,
    '2025-11-08 07:05:58',
    'Course Type',
    '',
    'CS Major'
  ),
  (
    1142,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:00',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1143,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Advanced Computer Science',
    ''
  ),
  (
    1144,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Cyber Security',
    ''
  ),
  (
    1145,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    1146,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1147,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1148,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1149,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1150,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1151,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:13',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1152,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:38',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    1153,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:44',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1154,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1155,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    1156,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1157,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1158,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1159,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1160,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1161,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1162,
    '004199',
    NULL,
    1,
    '2025-11-08 07:06:55',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1163,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:01',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    1164,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:01',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    1165,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:17',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1166,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:17',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1167,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:20',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    1168,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:20',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    1169,
    '004199',
    NULL,
    1,
    '2025-11-08 07:07:29',
    'Course Type',
    'CS Minor',
    ''
  ),
  (
    1170,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'course_code',
    '',
    'COSC2274'
  ),
  (
    1171,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'course_title',
    '',
    'Software Requirements Engineering'
  ),
  (
    1172,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/035217'
  ),
  (
    1173,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'course_credit',
    '',
    '12'
  ),
  (
    1174,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'year',
    '',
    '2'
  ),
  (
    1175,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'prerequisite',
    '',
    'true'
  ),
  (
    1176,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'course_type',
    '',
    'CS Major'
  ),
  (
    1177,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'sub_type',
    '',
    'Enterprise Systems Development'
  ),
  (
    1178,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'semester_2',
    '',
    'Available'
  ),
  (
    1179,
    '035217',
    NULL,
    1,
    '2025-11-08 07:09:53',
    'structured_prerequisites',
    '',
    'ISYS1118'
  ),
  (
    1180,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:33',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1181,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1182,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1183,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1184,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1185,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1186,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1187,
    '004175',
    NULL,
    1,
    '2025-11-08 07:24:43',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1188,
    '054993',
    NULL,
    1,
    '2025-11-08 07:28:04',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    1189,
    '054995',
    NULL,
    1,
    '2025-11-08 07:28:56',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    1190,
    '054996',
    NULL,
    1,
    '2025-11-08 07:30:28',
    'structured_prerequisites',
    '',
    ''
  ),
  (
    1191,
    '053407',
    NULL,
    1,
    '2025-11-08 07:33:51',
    'Course Title',
    'The Blockchain Economy',
    'Frontiers of the Digital Economy'
  ),
  (
    1192,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'course_code',
    '',
    'INTE2554'
  ),
  (
    1193,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'course_title',
    '',
    'Digital Economy and Blockchain Applications'
  ),
  (
    1194,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/053404'
  ),
  (
    1195,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'course_credit',
    '',
    '12'
  ),
  (
    1196,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'year',
    '',
    '1'
  ),
  (
    1197,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'prerequisite',
    '',
    'false'
  ),
  (
    1198,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    1199,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'sub_type',
    '',
    'Blockchain Technologies'
  ),
  (
    1200,
    '053404',
    NULL,
    1,
    '2025-11-08 07:37:56',
    'semester_1',
    '',
    'Available'
  ),
  (
    1201,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:54',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1202,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    1203,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1204,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1205,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1206,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Data Science',
    ''
  ),
  (
    1207,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1208,
    '049803',
    NULL,
    1,
    '2025-11-08 07:39:58',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1209,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'course_code',
    '',
    'COSC2824'
  ),
  (
    1210,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'course_title',
    '',
    'Cloud Operations'
  ),
  (
    1211,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/054141'
  ),
  (
    1212,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'course_credit',
    '',
    '12'
  ),
  (
    1213,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'year',
    '',
    '3'
  ),
  (
    1214,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'prerequisite',
    '',
    'true'
  ),
  (
    1215,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    1216,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'sub_type',
    '',
    'Cloud Computing'
  ),
  (
    1217,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'semester_1',
    '',
    'Available'
  ),
  (
    1218,
    '054141',
    NULL,
    1,
    '2025-11-08 07:44:30',
    'structured_prerequisites',
    '',
    'COSC2757'
  ),
  (
    1219,
    NULL,
    NULL,
    1,
    '2025-11-08 07:45:38',
    'course_code',
    'COSC2348',
    ''
  ),
  (
    1220,
    NULL,
    NULL,
    1,
    '2025-11-08 07:45:38',
    'course_title',
    'Games Studio 1',
    ''
  ),
  (
    1221,
    NULL,
    NULL,
    1,
    '2025-11-08 07:45:38',
    'web_url',
    'https://www1.rmit.edu.au/courses/037015',
    ''
  ),
  (
    1222,
    NULL,
    NULL,
    1,
    '2025-11-08 07:45:38',
    'course_credit',
    '12',
    ''
  ),
  (
    1223,
    NULL,
    NULL,
    1,
    '2025-11-08 07:45:38',
    'year',
    '2',
    ''
  ),
  (
    1224,
    '037016',
    NULL,
    1,
    '2025-11-08 07:47:24',
    'structured_prerequisites',
    '',
    ''
  ),
  (
    1225,
    '056543',
    NULL,
    1,
    '2025-11-08 07:49:09',
    'sub_type',
    '',
    'Creative Computing'
  ),
  (
    1226,
    NULL,
    NULL,
    1,
    '2025-11-08 07:51:50',
    'course_code',
    'COSC1076',
    ''
  ),
  (
    1227,
    NULL,
    NULL,
    1,
    '2025-11-08 07:51:50',
    'course_title',
    'Advanced Programming Techniques',
    ''
  ),
  (
    1228,
    NULL,
    NULL,
    1,
    '2025-11-08 07:51:50',
    'web_url',
    '',
    ''
  ),
  (
    1229,
    NULL,
    NULL,
    1,
    '2025-11-08 07:51:50',
    'course_credit',
    '12',
    ''
  ),
  (
    1230,
    NULL,
    NULL,
    1,
    '2025-11-08 07:51:50',
    'year',
    '2',
    ''
  ),
  (
    1231,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:01',
    'sub_type',
    'University Elective',
    ''
  ),
  (
    1232,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:01',
    'Course Type',
    'University Elective',
    ''
  ),
  (
    1233,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:05',
    'Course Type',
    '',
    'CS Minor'
  ),
  (
    1234,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Artificial Intelligence & Machine Learning',
    ''
  ),
  (
    1235,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Blockchain Technologies',
    ''
  ),
  (
    1236,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Cloud Computing',
    ''
  ),
  (
    1237,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Creative Computing',
    ''
  ),
  (
    1238,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Cyber Assurance',
    ''
  ),
  (
    1239,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Design & Develop for Apple Platform',
    ''
  ),
  (
    1240,
    '054077',
    NULL,
    1,
    '2025-11-08 07:53:13',
    'sub_type',
    'Enterprise Systems Development',
    ''
  ),
  (
    1241,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'course_code',
    '',
    'COSC2816'
  ),
  (
    1242,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'course_title',
    '',
    'Case Studies in Data Science'
  ),
  (
    1243,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'web_url',
    '',
    'https://www1.rmit.edu.au/courses/054118'
  ),
  (
    1244,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'course_credit',
    '',
    '12'
  ),
  (
    1245,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'year',
    '',
    '2'
  ),
  (
    1246,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'prerequisite',
    '',
    'true'
  ),
  (
    1247,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'course_type',
    '',
    'CS Minor'
  ),
  (
    1248,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'sub_type',
    '',
    'Data Science'
  ),
  (
    1249,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'semester_2',
    '',
    'Available'
  ),
  (
    1250,
    '054118',
    NULL,
    1,
    '2025-11-08 07:55:05',
    'structured_prerequisites',
    '',
    'COSC2738'
  ),
  (
    1251,
    '056545',
    NULL,
    1,
    '2025-11-08 08:00:34',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    1252,
    '053404',
    NULL,
    1,
    '2025-11-08 08:01:40',
    'year',
    '1',
    '3'
  ),
  (
    1253,
    '056546',
    NULL,
    1,
    '2025-11-08 08:04:03',
    'Semester 1 Availability',
    'Not Available',
    'Available'
  ),
  (
    1254,
    '056546',
    NULL,
    1,
    '2025-11-08 08:04:04',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    1255,
    '056546',
    NULL,
    1,
    '2025-11-08 08:11:01',
    'structured_prerequisites',
    '',
    'COSC3099 AND COSC3100'
  ),
  (
    1256,
    '054230',
    NULL,
    1,
    '2025-11-08 11:44:58',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    1257,
    '054230',
    NULL,
    1,
    '2025-11-08 11:45:00',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    1258,
    '056547',
    NULL,
    1,
    '2025-11-08 11:49:00',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    1259,
    '056547',
    NULL,
    1,
    '2025-11-08 11:49:01',
    'Semester 2 Availability',
    'Not Available',
    'Available'
  ),
  (
    1260,
    '056548',
    NULL,
    1,
    '2025-11-08 11:49:14',
    'Semester 2 Availability',
    'Available',
    'Not Available'
  ),
  (
    1261,
    '056549',
    NULL,
    1,
    '2025-11-08 11:49:50',
    'year',
    '2',
    '3'
  ),
  (
    1262,
    '056549',
    NULL,
    1,
    '2025-11-08 11:50:10',
    'Semester 1 Availability',
    'Available',
    'Not Available'
  ),
  (
    1263,
    '004175',
    NULL,
    1,
    '2025-11-08 11:55:01',
    'structured_prerequisites',
    '',
    'COSC2803'
  ),
  (
    1264,
    NULL,
    NULL,
    1,
    '2025-11-08 11:57:33',
    'course_code',
    'ISYS1108',
    ''
  ),
  (
    1265,
    NULL,
    NULL,
    1,
    '2025-11-08 11:57:33',
    'course_title',
    'Software Engineering Project Management',
    ''
  ),
  (
    1266,
    NULL,
    NULL,
    1,
    '2025-11-08 11:57:33',
    'web_url',
    'https://www1.rmit.edu.au/courses/004245',
    ''
  ),
  (
    1267,
    NULL,
    NULL,
    1,
    '2025-11-08 11:57:33',
    'course_credit',
    '12',
    ''
  ),
  (
    1268,
    NULL,
    NULL,
    1,
    '2025-11-08 11:57:33',
    'year',
    '2',
    ''
  ),
  (
    1269,
    '036671',
    NULL,
    1,
    '2025-11-08 20:12:40',
    'structured_prerequisites',
    '',
    'INTE2625 AND COSC2803'
  ),
  (
    1270,
    NULL,
    NULL,
    1,
    '2025-11-08 20:19:55',
    'course_code',
    'EEET2246',
    ''
  ),
  (
    1271,
    NULL,
    NULL,
    1,
    '2025-11-08 20:19:55',
    'course_title',
    'Engineering Computing 1',
    ''
  ),
  (
    1272,
    NULL,
    NULL,
    1,
    '2025-11-08 20:19:55',
    'web_url',
    'https://www1.rmit.edu.au/courses/038292',
    ''
  ),
  (
    1273,
    NULL,
    NULL,
    1,
    '2025-11-08 20:19:55',
    'course_credit',
    '12',
    ''
  ),
  (
    1274,
    NULL,
    NULL,
    1,
    '2025-11-08 20:19:55',
    'year',
    '2',
    ''
  ),
  (
    1275,
    NULL,
    NULL,
    1,
    '2025-11-08 20:20:20',
    'course_code',
    'EEET2250',
    ''
  ),
  (
    1276,
    NULL,
    NULL,
    1,
    '2025-11-08 20:20:20',
    'course_title',
    'Software Engineering Design',
    ''
  ),
  (
    1277,
    NULL,
    NULL,
    1,
    '2025-11-08 20:20:20',
    'web_url',
    'https://www1.rmit.edu.au/courses/038296',
    ''
  ),
  (
    1278,
    NULL,
    NULL,
    1,
    '2025-11-08 20:20:20',
    'course_credit',
    '12',
    ''
  ),
  (
    1279,
    NULL,
    NULL,
    1,
    '2025-11-08 20:20:20',
    'year',
    '2',
    ''
  ),
  (
    1280,
    '044233',
    NULL,
    1,
    '2025-11-08 20:23:21',
    'structured_prerequisites',
    '',
    'MATH2201'
  ),
  (
    1281,
    '044272',
    NULL,
    1,
    '2025-11-08 20:25:09',
    'structured_prerequisites',
    '',
    'MATH2201 AND MATH2203'
  ),
  (
    1282,
    '049803',
    NULL,
    1,
    '2025-11-08 20:28:45',
    'structured_prerequisites',
    '',
    'COSC2391 OR COSC2803 OR COSC2804'
  ),
  (
    1283,
    NULL,
    NULL,
    1,
    '2025-11-08 20:29:55',
    'course_code',
    'MATH2300',
    ''
  ),
  (
    1284,
    NULL,
    NULL,
    1,
    '2025-11-08 20:29:55',
    'course_title',
    'Analysis of Categorical Data',
    ''
  ),
  (
    1285,
    NULL,
    NULL,
    1,
    '2025-11-08 20:29:55',
    'web_url',
    'https://www1.rmit.edu.au/courses/050770',
    ''
  ),
  (
    1286,
    NULL,
    NULL,
    1,
    '2025-11-08 20:29:55',
    'course_credit',
    '12',
    ''
  ),
  (
    1287,
    NULL,
    NULL,
    1,
    '2025-11-08 20:29:55',
    'year',
    '2',
    ''
  ),
  (
    1288,
    NULL,
    NULL,
    1,
    '2025-11-08 20:34:52',
    'course_code',
    'MATH2393',
    ''
  ),
  (
    1289,
    NULL,
    NULL,
    1,
    '2025-11-08 20:34:52',
    'course_title',
    'Engineering Mathematics',
    ''
  ),
  (
    1290,
    NULL,
    NULL,
    1,
    '2025-11-08 20:34:52',
    'web_url',
    'https://www1.rmit.edu.au/courses/053543',
    ''
  ),
  (
    1291,
    NULL,
    NULL,
    1,
    '2025-11-08 20:34:52',
    'course_credit',
    '12',
    ''
  ),
  (
    1292,
    NULL,
    NULL,
    1,
    '2025-11-08 20:34:52',
    'year',
    '2',
    ''
  ),
  (
    1293,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'course_code',
    'COSC2799',
    ''
  ),
  (
    1294,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'course_title',
    'IT Studio 1',
    ''
  ),
  (
    1295,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'web_url',
    'https://www1.rmit.edu.au/courses/054074',
    ''
  ),
  (
    1296,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'course_credit',
    '24',
    ''
  ),
  (
    1297,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'year',
    '2',
    ''
  ),
  (
    1298,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'course_code',
    'COSC2800',
    ''
  ),
  (
    1299,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'course_title',
    'IT Studio 2',
    ''
  ),
  (
    1300,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'web_url',
    'https://www1.rmit.edu.au/courses/054075',
    ''
  ),
  (
    1301,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'course_credit',
    '24',
    ''
  ),
  (
    1302,
    NULL,
    NULL,
    1,
    '2025-11-08 20:35:26',
    'year',
    '2',
    ''
  ),
  (
    1303,
    '054996',
    NULL,
    1,
    '2025-11-08 20:49:08',
    'structured_prerequisites',
    '',
    'COSC2801'
  ),
  (
    1304,
    '037889',
    NULL,
    1,
    '2025-11-08 20:54:52',
    'structured_prerequisites',
    '',
    'MATH2201'
  ),
  (
    1305,
    '037889',
    NULL,
    1,
    '2025-11-08 20:55:33',
    'structured_prerequisites',
    '',
    'MATH2201 AND MATH2203'
  );

/*!40000 ALTER TABLE `history` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `program_course`
--
DROP TABLE IF EXISTS `program_course`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `program_course` (
    `program_code` varchar(50) NOT NULL,
    `course_id` varchar(50) NOT NULL,
    PRIMARY KEY (`program_code`, `course_id`),
    KEY `course_id` (`course_id`),
    CONSTRAINT `program_course_ibfk_1` FOREIGN KEY (`program_code`) REFERENCES `program_plan` (`program_code`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `program_course_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_course`
--
LOCK TABLES `program_course` WRITE;

/*!40000 ALTER TABLE `program_course` DISABLE KEYS */;

INSERT INTO
  `program_course`
VALUES
  ('BP094P23', '004108'),
  ('BP094P23', '004110'),
  ('BP094P23', '004111'),
  ('BP094P23', '004123'),
  ('BP094P23', '004175'),
  ('BP094P23', '004178'),
  ('BP094P23', '004186'),
  ('BP094P23', '004199'),
  ('BP094P23', '004218'),
  ('BP094P23', '004302'),
  ('BP094P23', '004309'),
  ('BP094P23', '014049'),
  ('BP094P23', '014052'),
  ('BP094P23', '014749'),
  ('BP094P23', '015442'),
  ('BP094P23', '035217'),
  ('BP094P23', '035218'),
  ('BP094P23', '036671'),
  ('BP094P23', '037016'),
  ('BP094P23', '037889'),
  ('BP094P23', '038096'),
  ('BP094P23', '038407'),
  ('BP094P23', '039985'),
  ('BP094P23', '044231'),
  ('BP094P23', '044233'),
  ('BP094P23', '044272'),
  ('BP094P23', '044450'),
  ('BP094P23', '044481'),
  ('BP094P23', '045680'),
  ('BP094P23', '045940'),
  ('BP094P23', '048558'),
  ('BP094P23', '049803'),
  ('BP094P23', '050775'),
  ('BP094P23', '051831'),
  ('BP094P23', '051832'),
  ('BP094P23', '052739'),
  ('BP094P23', '053170'),
  ('BP094P23', '053171'),
  ('BP094P23', '053172'),
  ('BP094P23', '053404'),
  ('BP094P23', '053407'),
  ('BP094P23', '054076'),
  ('BP094P23', '054077'),
  ('BP094P23', '054079'),
  ('BP094P23', '054080'),
  ('BP094P23', '054081'),
  ('BP094P23', '054082'),
  ('BP094P23', '054114'),
  ('BP094P23', '054117'),
  ('BP094P23', '054118'),
  ('BP094P23', '054120'),
  ('BP094P23', '054140'),
  ('BP094P23', '054141'),
  ('BP094P23', '054142'),
  ('BP094P23', '054229'),
  ('BP094P23', '054230'),
  ('BP094P23', '054381'),
  ('BP094P23', '054478'),
  ('BP094P23', '054479'),
  ('BP094P23', '054910'),
  ('BP094P23', '054986'),
  ('BP094P23', '054989'),
  ('BP094P23', '054991'),
  ('BP094P23', '054992'),
  ('BP094P23', '054993'),
  ('BP094P23', '054995'),
  ('BP094P23', '054996'),
  ('BP094P23', '054997'),
  ('BP094P23', '055001'),
  ('BP094P23', '055925'),
  ('BP094P23', '056543'),
  ('BP094P23', '056544'),
  ('BP094P23', '056545'),
  ('BP094P23', '056546'),
  ('BP094P23', '056547'),
  ('BP094P23', '056548'),
  ('BP094P23', '056549');

/*!40000 ALTER TABLE `program_course` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `program_plan`
--
DROP TABLE IF EXISTS `program_plan`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `program_plan` (
    `program_code` varchar(50) NOT NULL,
    `admin_id` int NOT NULL,
    PRIMARY KEY (`program_code`),
    KEY `admin_id` (`admin_id`),
    CONSTRAINT `program_plan_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_plan`
--
LOCK TABLES `program_plan` WRITE;

/*!40000 ALTER TABLE `program_plan` DISABLE KEYS */;

INSERT INTO
  `program_plan`
VALUES
  ('BP094P23', 1);

/*!40000 ALTER TABLE `program_plan` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `requisite`
--
DROP TABLE IF EXISTS `requisite`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `requisite` (
    `group_id` int NOT NULL,
    `course_id` varchar(50) NOT NULL,
    `relation` varchar(50) NOT NULL,
    `sort_order` int NOT NULL DEFAULT '0',
    PRIMARY KEY (`group_id`, `course_id`),
    KEY `course_id` (`course_id`),
    CONSTRAINT `requisite_ibfk_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `requisite_ibfk_group` FOREIGN KEY (`group_id`) REFERENCES `requisite_group` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisite`
--
LOCK TABLES `requisite` WRITE;

/*!40000 ALTER TABLE `requisite` DISABLE KEYS */;

INSERT INTO
  `requisite`
VALUES
  (8, '004309', 'prerequisite', 1),
  (10, '054081', 'prerequisite', 1),
  (12, '054081', 'prerequisite', 1),
  (20, '054081', 'prerequisite', 1),
  (38, '004123', 'prerequisite', 1),
  (39, '053171', 'prerequisite', 1),
  (40, '051831', 'prerequisite', 1),
  (59, '054079', 'prerequisite', 1),
  (60, '055925', 'prerequisite', 1),
  (65, '054076', 'prerequisite', 1),
  (66, '054081', 'prerequisite', 1),
  (67, '054082', 'prerequisite', 1),
  (73, '052739', 'prerequisite', 1),
  (73, '054080', 'prerequisite', 2),
  (78, '014049', 'prerequisite', 1),
  (78, '054082', 'prerequisite', 2),
  (79, '004309', 'prerequisite', 1),
  (80, '054986', 'prerequisite', 1),
  (82, '054986', 'prerequisite', 1),
  (83, '045940', 'prerequisite', 1),
  (83, '054986', 'prerequisite', 2),
  (84, '054081', 'prerequisite', 1),
  (85, '045940', 'prerequisite', 1),
  (85, '054986', 'prerequisite', 2),
  (88, '054081', 'prerequisite', 1),
  (90, '054081', 'prerequisite', 1),
  (91, '014052', 'prerequisite', 1),
  (91, '054082', 'prerequisite', 2),
  (92, '054081', 'prerequisite', 1),
  (93, '004309', 'prerequisite', 1),
  (94, '014052', 'prerequisite', 1),
  (94, '054080', 'prerequisite', 2),
  (95, '014052', 'prerequisite', 1),
  (95, '054082', 'prerequisite', 2),
  (96, '004302', 'prerequisite', 1),
  (96, '014052', 'prerequisite', 2),
  (96, '054080', 'prerequisite', 3),
  (96, '054081', 'prerequisite', 4),
  (98, '054081', 'prerequisite', 1),
  (99, '053171', 'prerequisite', 1),
  (100, '004302', 'prerequisite', 1),
  (100, '054081', 'prerequisite', 2),
  (102, '004309', 'prerequisite', 1),
  (103, '054079', 'prerequisite', 1),
  (104, '054077', 'prerequisite', 1),
  (105, '056543', 'prerequisite', 1),
  (106, '056543', 'prerequisite', 1),
  (114, '004302', 'prerequisite', 1),
  (116, '014052', 'prerequisite', 1),
  (116, '054080', 'prerequisite', 2),
  (117, '004302', 'prerequisite', 1),
  (118, '054076', 'prerequisite', 1),
  (119, '004302', 'prerequisite', 1),
  (120, '054076', 'prerequisite', 1),
  (121, '004302', 'prerequisite', 1),
  (122, '004309', 'prerequisite', 1),
  (123, '004309', 'prerequisite', 1),
  (124, '054081', 'prerequisite', 1),
  (125, '054081', 'prerequisite', 1),
  (126, '053171', 'prerequisite', 1),
  (127, '052739', 'prerequisite', 1),
  (128, '056543', 'prerequisite', 1),
  (129, '056544', 'prerequisite', 1),
  (130, '054081', 'prerequisite', 1),
  (131, '054986', 'prerequisite', 1),
  (132, '054081', 'prerequisite', 1),
  (133, '044231', 'prerequisite', 1),
  (134, '044231', 'prerequisite', 1),
  (135, '044233', 'prerequisite', 1),
  (136, '014052', 'prerequisite', 1),
  (136, '054081', 'prerequisite', 2),
  (136, '054082', 'prerequisite', 3),
  (137, '054079', 'prerequisite', 1),
  (139, '044231', 'prerequisite', 1),
  (140, '044233', 'prerequisite', 1),
  (1066, '054079', 'corequisite', 1),
  (1067, '054080', 'corequisite', 1);

/*!40000 ALTER TABLE `requisite` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `requisite_group`
--
DROP TABLE IF EXISTS `requisite_group`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `requisite_group` (
    `group_id` int NOT NULL AUTO_INCREMENT,
    `rule_id` int NOT NULL,
    `parent_group_id` int DEFAULT NULL,
    `operator` varchar(50) NOT NULL,
    PRIMARY KEY (`group_id`),
    KEY `rule_id` (`rule_id`),
    KEY `parent_group_id` (`parent_group_id`),
    CONSTRAINT `requisite_group_ibfk_parent` FOREIGN KEY (`parent_group_id`) REFERENCES `requisite_group` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `requisite_group_ibfk_rule` FOREIGN KEY (`rule_id`) REFERENCES `requisite_rule` (`rule_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 1069 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisite_group`
--
LOCK TABLES `requisite_group` WRITE;

/*!40000 ALTER TABLE `requisite_group` DISABLE KEYS */;

INSERT INTO
  `requisite_group`
VALUES
  (8, 6, 1005, 'OR'),
  (10, 8, 1007, 'OR'),
  (12, 10, 1009, 'OR'),
  (20, 17, 1016, 'OR'),
  (38, 34, 1033, 'OR'),
  (39, 37, 1036, 'OR'),
  (40, 40, 1039, 'OR'),
  (59, 33, 1032, 'OR'),
  (60, 32, 1031, 'OR'),
  (65, 27, 1026, 'OR'),
  (66, 27, 1026, 'OR'),
  (67, 2, 1001, 'OR'),
  (73, 48, 1047, 'OR'),
  (78, 18, 1017, 'OR'),
  (79, 18, 1017, 'OR'),
  (80, 24, 1023, 'OR'),
  (82, 44, 1043, 'OR'),
  (83, 5, 1004, 'OR'),
  (84, 29, 1028, 'OR'),
  (85, 29, 1028, 'OR'),
  (88, 12, 1011, 'OR'),
  (90, 31, 1030, 'OR'),
  (91, 14, 1013, 'OR'),
  (92, 21, 1020, 'OR'),
  (93, 11, 1010, 'OR'),
  (94, 11, 1010, 'OR'),
  (95, 28, 1027, 'OR'),
  (96, 23, 1022, 'OR'),
  (98, 30, 1029, 'OR'),
  (99, 39, 1038, 'OR'),
  (100, 22, 1021, 'OR'),
  (102, 7, 1006, 'OR'),
  (103, 35, 1034, 'OR'),
  (104, 25, 1024, 'OR'),
  (105, 49, 1048, 'OR'),
  (106, 50, 1049, 'OR'),
  (114, 3, 1002, 'OR'),
  (116, 9, 1008, 'OR'),
  (117, 1, 1000, 'OR'),
  (118, 1, 1000, 'OR'),
  (119, 42, 1041, 'OR'),
  (120, 42, 1041, 'OR'),
  (121, 41, 1040, 'OR'),
  (122, 43, 1042, 'OR'),
  (123, 13, 1012, 'OR'),
  (124, 45, 1044, 'OR'),
  (125, 46, 1045, 'OR'),
  (126, 38, 1037, 'OR'),
  (127, 36, 1035, 'OR'),
  (128, 51, 1050, 'OR'),
  (129, 51, 1050, 'OR'),
  (130, 4, 1003, 'OR'),
  (131, 15, 1014, 'OR'),
  (132, 15, 1014, 'OR'),
  (133, 19, 1018, 'OR'),
  (134, 20, 1019, 'OR'),
  (135, 20, 1019, 'OR'),
  (136, 26, 1025, 'OR'),
  (137, 47, 1046, 'OR'),
  (139, 16, 1015, 'OR'),
  (140, 16, 1015, 'OR'),
  (1000, 1, NULL, 'AND'),
  (1001, 2, NULL, 'AND'),
  (1002, 3, NULL, 'AND'),
  (1003, 4, NULL, 'AND'),
  (1004, 5, NULL, 'AND'),
  (1005, 6, NULL, 'AND'),
  (1006, 7, NULL, 'AND'),
  (1007, 8, NULL, 'AND'),
  (1008, 9, NULL, 'AND'),
  (1009, 10, NULL, 'AND'),
  (1010, 11, NULL, 'AND'),
  (1011, 12, NULL, 'AND'),
  (1012, 13, NULL, 'AND'),
  (1013, 14, NULL, 'AND'),
  (1014, 15, NULL, 'AND'),
  (1015, 16, NULL, 'AND'),
  (1016, 17, NULL, 'AND'),
  (1017, 18, NULL, 'AND'),
  (1018, 19, NULL, 'AND'),
  (1019, 20, NULL, 'AND'),
  (1020, 21, NULL, 'AND'),
  (1021, 22, NULL, 'AND'),
  (1022, 23, NULL, 'AND'),
  (1023, 24, NULL, 'AND'),
  (1024, 25, NULL, 'AND'),
  (1025, 26, NULL, 'AND'),
  (1026, 27, NULL, 'AND'),
  (1027, 28, NULL, 'AND'),
  (1028, 29, NULL, 'AND'),
  (1029, 30, NULL, 'AND'),
  (1030, 31, NULL, 'AND'),
  (1031, 32, NULL, 'AND'),
  (1032, 33, NULL, 'AND'),
  (1033, 34, NULL, 'AND'),
  (1034, 35, NULL, 'AND'),
  (1035, 36, NULL, 'AND'),
  (1036, 37, NULL, 'AND'),
  (1037, 38, NULL, 'AND'),
  (1038, 39, NULL, 'AND'),
  (1039, 40, NULL, 'AND'),
  (1040, 41, NULL, 'AND'),
  (1041, 42, NULL, 'AND'),
  (1042, 43, NULL, 'AND'),
  (1043, 44, NULL, 'AND'),
  (1044, 45, NULL, 'AND'),
  (1045, 46, NULL, 'AND'),
  (1046, 47, NULL, 'AND'),
  (1047, 48, NULL, 'AND'),
  (1048, 49, NULL, 'AND'),
  (1049, 50, NULL, 'AND'),
  (1050, 51, NULL, 'AND'),
  (1063, 64, NULL, 'AND'),
  (1064, 65, NULL, 'AND'),
  (1066, 64, 1063, 'OR'),
  (1067, 65, 1064, 'OR');

/*!40000 ALTER TABLE `requisite_group` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `requisite_rule`
--
DROP TABLE IF EXISTS `requisite_rule`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `requisite_rule` (
    `rule_id` int NOT NULL AUTO_INCREMENT,
    `target_course_id` varchar(50) NOT NULL,
    `enabled` tinyint (1) NOT NULL DEFAULT '1',
    PRIMARY KEY (`rule_id`),
    KEY `target_course_id` (`target_course_id`),
    CONSTRAINT `requisite_rule_ibfk` FOREIGN KEY (`target_course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 67 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisite_rule`
--
LOCK TABLES `requisite_rule` WRITE;

/*!40000 ALTER TABLE `requisite_rule` DISABLE KEYS */;

INSERT INTO
  `requisite_rule`
VALUES
  (1, '004108', 1),
  (2, '004111', 1),
  (3, '004123', 1),
  (4, '004175', 1),
  (5, '004178', 1),
  (6, '004186', 1),
  (7, '004199', 1),
  (8, '004218', 1),
  (9, '004302', 1),
  (10, '004309', 1),
  (11, '014049', 1),
  (12, '014052', 1),
  (13, '035217', 1),
  (14, '035218', 1),
  (15, '036671', 1),
  (16, '037889', 1),
  (17, '038407', 1),
  (18, '039985', 1),
  (19, '044233', 1),
  (20, '044272', 1),
  (21, '044450', 1),
  (22, '044481', 1),
  (23, '045680', 1),
  (24, '045940', 1),
  (25, '048558', 1),
  (26, '049803', 1),
  (27, '051831', 1),
  (28, '051832', 1),
  (29, '053170', 1),
  (30, '053171', 1),
  (31, '053172', 1),
  (32, '054076', 1),
  (33, '054080', 1),
  (34, '054114', 1),
  (35, '054117', 1),
  (36, '054118', 1),
  (37, '054140', 1),
  (38, '054141', 1),
  (39, '054142', 1),
  (40, '054478', 1),
  (41, '054479', 1),
  (42, '054989', 1),
  (43, '054991', 1),
  (44, '054992', 1),
  (45, '054993', 1),
  (46, '054995', 1),
  (47, '054996', 1),
  (48, '054997', 1),
  (49, '056544', 1),
  (50, '056545', 1),
  (51, '056546', 1),
  (64, '054081', 1),
  (65, '054082', 1);

/*!40000 ALTER TABLE `requisite_rule` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `sub_type`
--
DROP TABLE IF EXISTS `sub_type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `sub_type` (
    `sub_type_id` int NOT NULL AUTO_INCREMENT,
    `sub_type_name` varchar(50) NOT NULL,
    `course_type_id` int NOT NULL,
    PRIMARY KEY (`sub_type_id`),
    KEY `course_type_id` (`course_type_id`),
    CONSTRAINT `sub_type_ibfk_1` FOREIGN KEY (`course_type_id`) REFERENCES `type` (`course_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_type`
--
LOCK TABLES `sub_type` WRITE;

/*!40000 ALTER TABLE `sub_type` DISABLE KEYS */;

INSERT INTO
  `sub_type`
VALUES
  (1, 'Core', 1),
  (2, 'Advanced Computer Science', 2),
  (3, 'Cyber Security', 2),
  (4, 'Enterprise Systems Development', 2),
  (
    5,
    'Artificial Intelligence & Machine Learning',
    3
  ),
  (6, 'Blockchain Technologies', 3),
  (7, 'Cloud Computing', 3),
  (8, 'Creative Computing', 3),
  (9, 'Cyber Assurance', 3),
  (10, 'Data Science', 3),
  (11, 'Design & Develop for Apple Platform', 3),
  (12, 'Enterprise Systems Development', 3),
  (13, 'Bioinformatics', 4),
  (14, 'Data Analysis', 4),
  (15, 'Digital Innovation', 4),
  (16, 'University Elective', 5),
  (17, 'Program Course', 6);

/*!40000 ALTER TABLE `sub_type` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `type`
--
DROP TABLE IF EXISTS `type`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `type` (
    `course_type_id` int NOT NULL AUTO_INCREMENT,
    `course_type` varchar(50) NOT NULL,
    PRIMARY KEY (`course_type_id`),
    UNIQUE KEY `course_type` (`course_type`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type`
--
LOCK TABLES `type` WRITE;

/*!40000 ALTER TABLE `type` DISABLE KEYS */;

INSERT INTO
  `type`
VALUES
  (1, 'Core'),
  (4, 'Cross-disciplinary Minor'),
  (2, 'CS Major'),
  (3, 'CS Minor'),
  (6, 'Program Course'),
  (5, 'University Elective');

/*!40000 ALTER TABLE `type` ENABLE KEYS */;

UNLOCK TABLES;

-- SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-19 17:59:22