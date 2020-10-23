/*
Navicat MySQL Data Transfer

Source Server         : 3306
Source Server Version : 100125
Source Host           : localhost:3306
Source Database       : yy_wechat

Target Server Type    : MYSQL
Target Server Version : 100125
File Encoding         : 65001

Date: 2019-12-12 16:15:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for test
-- ----------------------------
DROP TABLE IF EXISTS `test`;
CREATE TABLE `test` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of test
-- ----------------------------
INSERT INTO `test` VALUES ('1', '23', '1', '3');
INSERT INTO `test` VALUES ('2', '34', '0', '4');
INSERT INTO `test` VALUES ('3', '46', '0', '5');

-- ----------------------------
-- Table structure for wechat_access_token
-- ----------------------------
DROP TABLE IF EXISTS `wechat_access_token`;
CREATE TABLE `wechat_access_token` (
  `AccessToken` varchar(255) NOT NULL,
  PRIMARY KEY (`AccessToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wechat_access_token
-- ----------------------------
INSERT INTO `wechat_access_token` VALUES ('{\"accessToken\":\"28_xQ5qg5Y6Ywlz2Cyb5EWRz8Sq4IwBd3_IoUnHFw_Z1AtXNvkq5mzxp24uNVpLyl6uQdkP5NsnxgrvlwXx5HZPsgyehMFjLECMBBaFTgsQHKDI5Et4BJE3WwxS_A2iiK1t1bDXlxDmk58ukfksTOHcAAAZUN\",\"expireTime\":1576139969817}');

-- ----------------------------
-- Table structure for wechat_config
-- ----------------------------
DROP TABLE IF EXISTS `wechat_config`;
CREATE TABLE `wechat_config` (
  `appid` varchar(255) NOT NULL,
  `secret` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`appid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wechat_config
-- ----------------------------
INSERT INTO `wechat_config` VALUES ('wx7ffa52dd91d16e07', '1a102b86343c1118c23efdb67a64553d', 'yanyanxw');

-- ----------------------------
-- Table structure for wechat_ticket
-- ----------------------------
DROP TABLE IF EXISTS `wechat_ticket`;
CREATE TABLE `wechat_ticket` (
  `type` varchar(255) DEFAULT NULL,
  `Ticket` varchar(255) NOT NULL,
  PRIMARY KEY (`Ticket`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wechat_ticket
-- ----------------------------
INSERT INTO `wechat_ticket` VALUES ('wx_card', '{\"ticket\":\"IpK_1T69hDhZkLQTlwsAX79qDodu2yD8i9nD_bA_HaRiUX40Nx-_tCeygqzMzOm9Cc1CrPJQPQXHXLXX_XGPoQ\",\"expireTime\":1576041380365}');
