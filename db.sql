# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: tftime
# Generation Time: 2017-04-20 02:43:15 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP DATABASE IF EXISTS `tftime`;
CREATE DATABASE tftime;
USE tftime;


# Dump of table social_oauths
# ------------------------------------------------------------

DROP TABLE IF EXISTS `social_oauths`;

CREATE TABLE `social_oauths` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site` varchar(32) DEFAULT 'WEAPP',
  `site_uid` varchar(255) DEFAULT NULL,
  `unionid` varchar(255) DEFAULT NULL,
  `site_uname` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `expire_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `social_oauths_site_uid` (`site_uid`),
  KEY `social_oauths_unionid` (`unionid`),
  CONSTRAINT `social_oauths_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `social_oauths` WRITE;
/*!40000 ALTER TABLE `social_oauths` DISABLE KEYS */;

INSERT INTO `social_oauths` (`id`, `site`, `site_uid`, `unionid`, `site_uname`, `access_token`, `refresh_token`, `expire_date`, `created_at`, `updated_at`, `userId`)
VALUES
	(1,'WEAPP',NULL,NULL,NULL,NULL,NULL,NULL,'2017-03-30 03:19:07','2017-03-30 03:19:07',1),
	(2,'WEAPP','oMrD70ETDcvj6bIdx9ky6fgTp1Ug',NULL,'Shawn',NULL,NULL,NULL,'2017-04-12 05:37:16','2017-04-12 05:37:16',2);

/*!40000 ALTER TABLE `social_oauths` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table userprofiles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userprofiles`;

CREATE TABLE `userprofiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sex` int(11) DEFAULT '0',
  `city` varchar(32) DEFAULT NULL,
  `province` varchar(32) DEFAULT NULL,
  `country` varchar(32) DEFAULT NULL,
  `about_me` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `userprofiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `userprofiles` WRITE;
/*!40000 ALTER TABLE `userprofiles` DISABLE KEYS */;

INSERT INTO `userprofiles` (`id`, `sex`, `city`, `province`, `country`, `about_me`, `created_at`, `updated_at`, `userId`)
VALUES
	(1,0,NULL,NULL,NULL,NULL,'2017-03-30 03:19:07','2017-03-30 03:19:07',1),
	(2,1,'Shenzhen','Guangdong','CN',NULL,'2017-04-12 05:37:16','2017-04-12 05:37:16',2);

/*!40000 ALTER TABLE `userprofiles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` int(11) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_name` (`name`),
  KEY `users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `avatar`, `is_active`, `created_at`, `updated_at`)
VALUES
	(1,'seasonstar','seasonstar@126.com','$2a$10$rDyURQ4pgcnVE4p3Ba8EWeHeKDOGKfJcCs4VIBb78WYGmNxnaiBzi','http://tva3.sinaimg.cn/crop.0.0.180.180.180/9e0f6abcjw1e8qgp5bmzyj2050050aa8.jpg',1,'2017-03-30 03:13:58','2017-03-30 03:13:58'),
	(2,'Shawn',NULL,'$2a$10$UqRtZzctxQW9DjWLzNjAh.gI5AwVMSDWPBRhBSukubpV1F/98iBOe','http://wx.qlogo.cn/mmopen/vi_32/SHTqNNVB9mbibgEYialHROjsty1G9fYCPYK5fYBDB1TibrHVZKgJQn0Hbo93bOwiaD1TMFK1Vo4x4WynPcfAmc12fg/0',1,'2017-04-12 05:37:16','2017-04-12 05:37:16');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
