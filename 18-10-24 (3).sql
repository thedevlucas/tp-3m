-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.24-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para fabrica-galletitas
CREATE DATABASE IF NOT EXISTS `fabrica-galletitas` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `fabrica-galletitas`;

-- Volcando estructura para tabla fabrica-galletitas.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `store` int(11) NOT NULL,
  `order` mediumtext NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL DEFAULT 0,
  `code` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK__stores` (`store`),
  CONSTRAINT `FK__stores` FOREIGN KEY (`store`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.orders: ~0 rows (aproximadamente)

-- Volcando estructura para tabla fabrica-galletitas.orders_logs
CREATE TABLE IF NOT EXISTS `orders_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `newStatus` int(11) NOT NULL,
  `comments` mediumtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orders_logs_orders` (`order`),
  KEY `FK_orders_logs_users` (`user`),
  CONSTRAINT `FK_orders_logs_orders` FOREIGN KEY (`order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_orders_logs_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.orders_logs: ~0 rows (aproximadamente)

-- Volcando estructura para tabla fabrica-galletitas.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `device` varchar(50) NOT NULL DEFAULT 'Unknown',
  `application` varchar(50) NOT NULL DEFAULT 'Unknown',
  `ip` varchar(50) NOT NULL DEFAULT 'Unknown',
  `logged` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_session_users` (`userId`),
  CONSTRAINT `FK_session_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.sessions: ~0 rows (aproximadamente)

-- Volcando estructura para tabla fabrica-galletitas.stores
CREATE TABLE IF NOT EXISTS `stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_stores_users` (`user`),
  CONSTRAINT `FK_stores_users` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.stores: ~1 rows (aproximadamente)
REPLACE INTO `stores` (`id`, `user`, `name`, `address`) VALUES
	(2, 10, 'Tussy Warriors', 'Av. Cabildo 3185');

-- Volcando estructura para tabla fabrica-galletitas.trips
CREATE TABLE IF NOT EXISTS `trips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order` int(11) NOT NULL,
  `vehicle` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_trips_orders` (`order`),
  KEY `FK_trips_vehicles` (`vehicle`),
  CONSTRAINT `FK_trips_orders` FOREIGN KEY (`order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_trips_vehicles` FOREIGN KEY (`vehicle`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.trips: ~0 rows (aproximadamente)

-- Volcando estructura para tabla fabrica-galletitas.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` enum('admin','cliente','conductor','logistica','paletizador') NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` longtext NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.users: ~5 rows (aproximadamente)
REPLACE INTO `users` (`id`, `group`, `username`, `password`, `name`, `lastname`, `phone`) VALUES
	(2, 'admin', 'admin', '$2b$10$OmEPBW3oVkurumKEfiin6OL4orH40vqWijSivRYvPsa4OzpCCCTcG', 'admin', 'admin', '0'),
	(10, 'cliente', 'cliente', '$2a$10$hGvC.x1qeoc4zFarGgTJIeh/I0O0cpOtFcdoJOANZKcBZxm9EfeOK', 'Juan', 'Antonio', '11548759487'),
	(11, 'paletizador', 'paletizador', '$2a$10$kzUNCv.qW3rGqPgc5I1p3e/ynBfyLozGuYybmgY62m167sPNiIA6a', 'Paletizador', 'Paletizado', '116485488'),
	(12, 'logistica', 'logistica', '$2a$10$Y341iJmi3UT88NzIaBQIRuR7skSay3ros0nZqS/hxclLJM0o.uHqe', 'Logistica', 'Logiscosa', '1157486545'),
	(13, 'conductor', 'conductor', '$2a$10$BK.2OYBDgWt614IZafPJLe20cJUoOHiaBHjV8B5W1Zuics1ysF5a2', 'Conductor', 'Conducido', '1154875684');

-- Volcando estructura para tabla fabrica-galletitas.vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patent` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Volcando datos para la tabla fabrica-galletitas.vehicles: ~2 rows (aproximadamente)
REPLACE INTO `vehicles` (`id`, `patent`) VALUES
	(1, 'HBX321'),
	(2, 'CUY372');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
