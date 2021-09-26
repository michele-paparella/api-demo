CREATE DATABASE `api-demo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `status` (
  `idstatus` int NOT NULL,
  `description` varchar(45) NOT NULL,
  PRIMARY KEY (`idstatus`),
  UNIQUE KEY `description_UNIQUE` (`description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `creationDate` datetime NOT NULL,
  `price` varchar(45) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `statusFK_idx` (`status`),
  CONSTRAINT `statusFK` FOREIGN KEY (`status`) REFERENCES `status` (`idstatus`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `assignment` (
  `projectId` int NOT NULL,
  `jobId` int NOT NULL,
  PRIMARY KEY (`projectId`,`jobId`),
  KEY `jobFK_idx` (`jobId`),
  CONSTRAINT `jobFK` FOREIGN KEY (`jobId`) REFERENCES `job` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projectFK` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
