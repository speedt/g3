/*
Navicat MySQL Data Transfer

Source Server         : 118.190.149.221
Source Server Version : 50623
Source Host           : 118.190.149.221:12306
Source Database       : emag2

Target Server Type    : MYSQL
Target Server Version : 50623
File Encoding         : 65001

Date: 2017-09-25 17:15:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `g_group`
-- ----------------------------
DROP TABLE IF EXISTS `g_group`;
CREATE TABLE `g_group` (
  `id` varchar(32) NOT NULL,
  `group_name` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of g_group
-- ----------------------------

-- ----------------------------
-- Table structure for `g_group_balance`
-- ----------------------------
DROP TABLE IF EXISTS `g_group_balance`;
CREATE TABLE `g_group_balance` (
  `create_time` int(11) NOT NULL DEFAULT '0',
  `group_id` varchar(32) DEFAULT '',
  `room_owner` varchar(32) DEFAULT '',
  `user_id` varchar(32) DEFAULT NULL,
  `seat` int(2) DEFAULT '0',
  `user_fund` int(11) DEFAULT NULL,
  `user_score` int(11) DEFAULT NULL,
  PRIMARY KEY (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of g_group_balance
-- ----------------------------

-- ----------------------------
-- Table structure for `s_cfg`
-- ----------------------------
DROP TABLE IF EXISTS `s_cfg`;
CREATE TABLE `s_cfg` (
  `type_` varchar(32) NOT NULL DEFAULT '',
  `key_` varchar(64) NOT NULL DEFAULT '',
  `value_` varchar(32) DEFAULT NULL,
  `title` varchar(64) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `status` int(2) DEFAULT NULL,
  PRIMARY KEY (`key_`,`type_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_cfg
-- ----------------------------
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'fund_max', '999999', '组类型：pushCake：基金（最大）', null, null, '1');
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'fund_min', '999', '组类型：pushCake：基金（最小）', null, null, '1');
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'player_count', '4', '组类型：pushCake：玩家数', null, null, '1');
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'round_count_max', '41', '组类型：pushCake：圈数（最大）', null, null, '1');
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'round_count_min', '11', '组类型：pushCake：圈数（最小）', null, null, '1');
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'visitor_count_max', '6', '组类型：pushCake：游客数（最大）', null, null, '1');
INSERT INTO `s_cfg` VALUES ('group_type_pushCake', 'visitor_count_min', '0', '组类型：pushCake：游客数（最小）', null, null, '1');

-- ----------------------------
-- Table structure for `s_manager`
-- ----------------------------
DROP TABLE IF EXISTS `s_manager`;
CREATE TABLE `s_manager` (
  `id` varchar(32) NOT NULL,
  `user_name` varchar(32) DEFAULT NULL,
  `user_pass` varchar(32) DEFAULT NULL,
  `status` int(2) DEFAULT NULL,
  `sex` int(2) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `mobile` varchar(32) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_manager
-- ----------------------------
INSERT INTO `s_manager` VALUES ('1', 'admin', 'c4ca4238a0b923820dcc509a6f75849b', '1', null, '2017-07-25 11:40:57', null, null);
INSERT INTO `s_manager` VALUES ('9c012a33aa8b4ecc8aaf20ea149a6f25', 'mega', 'e10adc3949ba59abbe56e057f20f883e', '1', null, '2017-07-25 11:41:00', null, null);

-- ----------------------------
-- Table structure for `s_user`
-- ----------------------------
DROP TABLE IF EXISTS `s_user`;
CREATE TABLE `s_user` (
  `id` varchar(32) NOT NULL,
  `user_name` varchar(32) DEFAULT NULL,
  `user_pass` varchar(32) DEFAULT NULL,
  `server_id` varchar(32) DEFAULT NULL,
  `channel_id` varchar(128) DEFAULT NULL,
  `backend_id` varchar(32) DEFAULT NULL,
  `group_id` varchar(6) DEFAULT NULL COMMENT '群组id',
  `group_entry_time` varchar(32) DEFAULT NULL,
  `status` int(2) DEFAULT NULL,
  `status_time` datetime DEFAULT NULL,
  `nickname` varchar(32) DEFAULT NULL,
  `sex` int(2) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `mobile` varchar(32) DEFAULT NULL,
  `qq` varchar(32) DEFAULT NULL,
  `weixin` varchar(128) DEFAULT NULL,
  `weixin_avatar` varchar(1024) DEFAULT NULL COMMENT '头像',
  `email` varchar(128) DEFAULT NULL,
  `current_score` int(11) DEFAULT NULL COMMENT '现有积分',
  `tool_1` int(11) DEFAULT NULL,
  `tool_2` int(11) DEFAULT NULL,
  `tool_3` int(11) DEFAULT NULL,
  `tool_4` int(11) DEFAULT NULL,
  `tool_5` int(11) DEFAULT NULL,
  `tool_6` int(11) DEFAULT NULL,
  `tool_7` int(11) DEFAULT NULL,
  `tool_8` int(11) DEFAULT NULL,
  `tool_9` int(11) DEFAULT NULL,
  `vip` int(2) DEFAULT NULL,
  `consume_count` int(11) DEFAULT NULL COMMENT '消费（¥）',
  `win_count` int(11) DEFAULT NULL COMMENT '胜利（次数）',
  `lose_count` int(11) DEFAULT NULL COMMENT '失败（次数）',
  `win_score_count` int(11) DEFAULT NULL COMMENT '胜利（总分）',
  `lose_score_count` int(11) DEFAULT NULL COMMENT '失败（总分）',
  `line_gone_count` int(11) DEFAULT NULL COMMENT '掉线（次数）',
  `gold_count` int(11) DEFAULT NULL COMMENT '元宝',
  `original_data` text,
  `user_code` varchar(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_user
-- ----------------------------
INSERT INTO `s_user` VALUES ('0525822071ab11e7a481015d0a4c1d9e', '吴老肥', '96e79218965eb72c92a549dd5a330112', null, null, null, '', null, '1', null, '吴老肥', '1', '2017-07-26 10:35:00', '', '', '', null, '', '20066', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('1', 'hx', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001f4-62da4ba5eb1fb042-88ef3b98', '1', '472416', '1506329174256', '1', null, '张三', null, null, null, '1234', null, 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoDA8HqHL3ZNz3jcQhf6aAryIdZ1j8Bh75TPTpoScMpODMsBa3mVBbQGDFxoajZiaF2JV9p8JHQXBQ/0', null, '7015', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('2', 'wupeng  ', 'e10adc3949ba59abbe56e057f20f883e', null, null, null, '', null, '1', null, '李四', null, null, null, null, null, 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505119468585&di=8d3106f641a831639f8f1f925cbd1b6d&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dshijue1%252C0%252C0%252C294%252C40%2Fsign%3Ddef685c2db00baa1ae214ff82f79d367%2Fcc11728b4710b9128937bed0c9fdfc039245222d.jpg', null, '998832792', '31231', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('2c730630708011e78e22ffc0f87ffa5a', '猫1', '96e79218965eb72c92a549dd5a330112', null, null, null, '', null, '1', null, '', '1', '2017-07-24 22:55:46', '', '', '', null, '', '30000', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('3', 'lixiang', 'e10adc3949ba59abbe56e057f20f883e', null, null, null, '', null, '1', null, '王五', null, null, null, null, null, null, null, '999989930', '123123', '0', '0', '0', '0', '0', '0', '0', '0', '1', null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('4', 'wy', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-0000016e-746e56e04155d614-f351fdf2', '1', '', '1506082028548', '1', null, '哈哈', null, null, null, null, null, null, null, '901228843', '1233123', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('5', 't11', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001f1-2839c534d401743d-6dffee50', '1', '', '1506328582169', '1', null, 't1', null, null, null, null, null, null, null, '19394', '123', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '106', null, null);
INSERT INTO `s_user` VALUES ('6', 't2', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001f5-96ea40308b1f4af1-6b733c01', '1', '', '1506330658650', '1', '2017-08-24 19:42:39', 't2', null, null, null, null, null, null, null, '41600', '89', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '106', null, null);
INSERT INTO `s_user` VALUES ('7', 't3', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001f6-9aa07df8b31f0ceb-0bb82c82', '1', '472416', '1506329185519', '1', null, 't3', null, null, null, null, null, null, null, '122862147', '87', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('9c012a33aa8b4ecc8aaf20ea149a6f25', 'mega', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001ee-79bfd34158dd235e-7ffa3ce7', '1', '', '1506327597632', '1', null, '马六', null, '2017-08-08 10:18:43', null, '12341', null, null, null, '0', '123123', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('9fe2a410777c11e7bdc4fd3c0cd2bc87', 't4', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000163-bcac9fce0fa1a41a-4f6abb41', '1', '', '1506081434264', '1', null, '猫4123123', '1', '2017-08-02 20:18:00', '', '', '', null, '', '10065', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('b5780670775f11e7831c0d095411373b', '猫2', '96e79218965eb72c92a549dd5a330112', null, null, null, '', null, '1', null, '猫2', '1', '2017-08-02 16:51:01', '', '', '', null, '', '43280', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('c2fe9bb076ba11e7ad1a29fa785dd421', '雪箭轩', 'bde0814411dcea94c5e0d9b29e635510', null, null, null, '', null, '1', null, '雪箭轩', '1', '2017-08-01 21:10:17', '', '', '', null, '', '9570499', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('e5e252b0776011e7831c0d095411373b', '猫3', 'e10adc3949ba59abbe56e057f20f883e', null, null, null, '', null, '1', null, '猫34', '1', '2017-08-02 16:59:32', '', '', '', null, '', '1800023', '0', '0', '0', '0', '0', '0', '0', '0', '0', null, null, null, null, null, null, null, '111', null, null);
INSERT INTO `s_user` VALUES ('oGYue1ADZZuScg6o6WVVdM4ajpUc', 'oGYue1ADZZuScg6o6WVVdM4ajpUc', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000132-a41a0a6021c02397-930a1821', '1', '', '1505984172800', '1', null, '桑', '1', '2017-09-21 14:51:05', null, null, 'o_Kvsv6edf3s0L_OHK2ECPFmW3-U', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLfysOLphYvmT55YSDBTl5VxKibghIRD4oS8DDzU1aW6IuESOZ5GuyXzCtGlzXcuoNpr5ZmC51rzAA/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '10200', '{\"openid\":\"oGYue1ADZZuScg6o6WVVdM4ajpUc\",\"nickname\":\"桑\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLfysOLphYvmT55YSDBTl5VxKibghIRD4oS8DDzU1aW6IuESOZ5GuyXzCtGlzXcuoNpr5ZmC51rzAA/0\",\"privilege\":[],\"unionid\":\"o_Kvsv6edf3s0L_OHK2ECPFmW3-U\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1ARCTucIpEp2KfLeRwv-ZnE', 'oGYue1ARCTucIpEp2KfLeRwv-ZnE', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000023-6a9c27333d90b22c-79a1b61b', '1', '', '1505458071117', '1', null, '王千万', '1', '2017-09-13 15:20:00', null, null, 'o_Kvsv5eWOaMu2Qjk6BluDtqBQzM', 'http://wx.qlogo.cn/mmopen/vi_32/OjTCnlMeg9tBt8stiaGJ3zibYBgoohJX5Qnq7Yrt7qz1uT523gqTAxnM0iaHpthNLon0j0RYJOia5AymTgKoeyibOXg/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1ARCTucIpEp2KfLeRwv-ZnE\",\"nickname\":\"王千万\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kaifeng\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/OjTCnlMeg9tBt8stiaGJ3zibYBgoohJX5Qnq7Yrt7qz1uT523gqTAxnM0iaHpthNLon0j0RYJOia5AymTgKoeyibOXg/0\",\"privilege\":[],\"unionid\":\"o_Kvsv5eWOaMu2Qjk6BluDtqBQzM\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1AVo7kPNxpm7GksWGe4M0rs', 'oGYue1AVo7kPNxpm7GksWGe4M0rs', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c5-a9b7794cb3e70d11-43ca08cf', '1', '', '1506170729041', '1', null, '-', null, '2017-09-23 20:44:14', null, null, 'o_KvsvwH2ghjG_R1vEqxLKVpPH78', 'http://wx.qlogo.cn/mmopen/vi_32/znCkp3AX54X5YicKCyBNgq8V6aHN5icm8VDKWl1hp7fMd2ibQ73P6sUoI6uexAWIELP5mogqQ8kDXOmckiafb8fK3g/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1AVo7kPNxpm7GksWGe4M0rs\",\"nickname\":\"-\",\"sex\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/znCkp3AX54X5YicKCyBNgq8V6aHN5icm8VDKWl1hp7fMd2ibQ73P6sUoI6uexAWIELP5mogqQ8kDXOmckiafb8fK3g/0\",\"privilege\":[],\"unionid\":\"o_KvsvwH2ghjG_R1vEqxLKVpPH78\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1BFCFBSiutgSA3EYkWsR9qw', 'oGYue1BFCFBSiutgSA3EYkWsR9qw', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c6-8b2418f5d87303cb-d2f47071', '1', '', '1505488863822', '1', null, 'L龙', '0', '2017-09-15 22:46:28', null, null, 'o_Kvsv4DjeHcP4gH6nUggyf-TNqY', '/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1BFCFBSiutgSA3EYkWsR9qw\",\"nickname\":\"L龙\",\"sex\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"headimgurl\":\"/0\",\"privilege\":[],\"unionid\":\"o_Kvsv4DjeHcP4gH6nUggyf-TNqY\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1Cl1xAUjk9hghWsV9Pu6lLA', 'oGYue1Cl1xAUjk9hghWsV9Pu6lLA', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c4-0219e47a77e12434-39caed70', '1', '', '1506170659084', '1', null, '豌豆的秘密', '1', '2017-09-14 11:14:00', null, null, 'o_Kvsv-gK_PPdXkT-kTwCqcKw9TY', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLsKiag370r0iaLzjZJ5guunFRUgqAA5Z5zjzjn9TlATtVr2YwxXdTFicoW8bEa7ahGhEbEQbC4vQ4MQ/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1Cl1xAUjk9hghWsV9Pu6lLA\",\"nickname\":\"豌豆的秘密\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kaifeng\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLsKiag370r0iaLzjZJ5guunFRUgqAA5Z5zjzjn9TlATtVr2YwxXdTFicoW8bEa7ahGhEbEQbC4vQ4MQ/0\",\"privilege\":[],\"unionid\":\"o_Kvsv-gK_PPdXkT-kTwCqcKw9TY\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1DcXxvRLQjEqQJy9Y_QkW2g', 'oGYue1DcXxvRLQjEqQJy9Y_QkW2g', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000000e6-4c161d254f59ca77-ba1c3ead', '1', '', '1505567926383', '1', null, '吳 鵬®', '1', '2017-09-16 20:50:11', null, null, 'o_Kvsv6RuTBJ3UJzgmlkbD3jKqh4', 'http://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJcrtEibwTToyblITIE4Dou4bl6dO0dhf4Njsh95HmUW8LlQJ9ibmGTak6cCPNI8uMfZdoLruQXZX2g/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1DcXxvRLQjEqQJy9Y_QkW2g\",\"nickname\":\"吳 鵬®\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"St.Gallen\",\"country\":\"CH\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJcrtEibwTToyblITIE4Dou4bl6dO0dhf4Njsh95HmUW8LlQJ9ibmGTak6cCPNI8uMfZdoLruQXZX2g/0\",\"privilege\":[],\"unionid\":\"o_Kvsv6RuTBJ3UJzgmlkbD3jKqh4\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1DDoVKB9BceQy6716nRSV38', 'oGYue1DDoVKB9BceQy6716nRSV38', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004c19-00000070-090232d938b7d123-5428977b', null, '', null, '1', null, '破晓', null, '2017-09-14 13:49:10', null, null, 'o_Kvsv0CFU8FheWYHonuZzeAY_bQ', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKYJ9tfDB8ibpQpOEmR0hibCNqBpemIuaicaibYqvuKsvyNlZYEApjibtNuv5TPQSWxC2130VDwk52EicIQ/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1DDoVKB9BceQy6716nRSV38\",\"nickname\":\"破晓\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"BM\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKYJ9tfDB8ibpQpOEmR0hibCNqBpemIuaicaibYqvuKsvyNlZYEApjibtNuv5TPQSWxC2130VDwk52EicIQ/0\",\"privilege\":[],\"unionid\":\"o_Kvsv0CFU8FheWYHonuZzeAY_bQ\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1EMCLETAEWPrHg6Cvw5s0sY', 'oGYue1EMCLETAEWPrHg6Cvw5s0sY', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000186-7134341febdfc3ae-d902b03e', '1', '', '1506087104304', '1', null, '小T', '0', '2017-09-15 14:49:43', null, null, 'o_Kvsv6UBrFi3xdpYaMgimYlLUQM', '/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1EMCLETAEWPrHg6Cvw5s0sY\",\"nickname\":\"小T\",\"sex\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"headimgurl\":\"/0\",\"privilege\":[],\"unionid\":\"o_Kvsv6UBrFi3xdpYaMgimYlLUQM\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1H6yH7HtkI4IVh7W6MqZYaE', 'oGYue1H6yH7HtkI4IVh7W6MqZYaE', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000021-4042f44728e8e0b1-e7c5e8fb', null, '', null, '1', null, '娄延奇，寓悦居租赁', '1', '2017-09-15 14:58:16', null, null, 'o_Kvsv8Y_d8pxPWtiLKDujqrBJW0', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eraFeNIAV4njEdM5iaVtsQiafPyo8ibbwyeqtAT4B9qXmMgiawHNnMJSxdANQKlxsrPcVUynNH3kibnibaQ/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1H6yH7HtkI4IVh7W6MqZYaE\",\"nickname\":\"娄延奇，寓悦居租赁\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eraFeNIAV4njEdM5iaVtsQiafPyo8ibbwyeqtAT4B9qXmMgiawHNnMJSxdANQKlxsrPcVUynNH3kibnibaQ/0\",\"privilege\":[],\"unionid\":\"o_Kvsv8Y_d8pxPWtiLKDujqrBJW0\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1I8remmP1HmUBvgQ-LP2qAg', 'oGYue1I8remmP1HmUBvgQ-LP2qAg', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000197-386ad62a0dc7d2e2-d6980443', '1', '', '1505569674192', '1', null, '唄唲', '2', '2017-09-16 20:55:32', null, null, 'o_Kvsv0DtuTTNusKUUtlqEyVxJP0', 'http://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKUHunKeUtnLJcKOiajyiaR2D5ScYicLkH6tVd1ezuWDXDepUI1icmng4Od18Ya9KgRhSGyicPdIYFueyg/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1I8remmP1HmUBvgQ-LP2qAg\",\"nickname\":\"唄唲\",\"sex\":2,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKUHunKeUtnLJcKOiajyiaR2D5ScYicLkH6tVd1ezuWDXDepUI1icmng4Od18Ya9KgRhSGyicPdIYFueyg/0\",\"privilege\":[],\"unionid\":\"o_Kvsv0DtuTTNusKUUtlqEyVxJP0\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1Jk_WEhOAETgkOofci29-2w', 'oGYue1Jk_WEhOAETgkOofci29-2w', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c1-fa434afda09cdd58-f4e3b8f1', '1', '', '1506171874067', '1', null, 'ICAC', '1', '2017-09-13 16:10:56', null, null, 'o_Kvsv8OwQNky6g8RpGNsvgIHUa0', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJIx5lQo0MyLlKW7GeTic9Hfjwiblp7e990aTWlarIXywco9SGHQDd6HPNGdHYVUwuvHnhM1U0iaUuOw/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1Jk_WEhOAETgkOofci29-2w\",\"nickname\":\"ICAC\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"Amsterdam\",\"country\":\"NL\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJIx5lQo0MyLlKW7GeTic9Hfjwiblp7e990aTWlarIXywco9SGHQDd6HPNGdHYVUwuvHnhM1U0iaUuOw/0\",\"privilege\":[],\"unionid\":\"o_Kvsv8OwQNky6g8RpGNsvgIHUa0\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1Jv57YFOOiWtq4BzvM7GvqQ', 'oGYue1Jv57YFOOiWtq4BzvM7GvqQ', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-0000000e-7757ad05f29bd89d-0e2f00ee', '1', '', '1505443259023', '1', null, '平凡人生', '1', '2017-09-15 10:22:31', null, null, 'o_Kvsv1nN9OoY96mwGDvEiD7wZpw', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJZ2cfo2cDUMVVqLmA4nOaepXJRrH9WqHNTumwCkasZeouwvbFFqjRMT9icDNhBHyIKTMfmT4bI8CA/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1Jv57YFOOiWtq4BzvM7GvqQ\",\"nickname\":\"平凡人生\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"AD\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJZ2cfo2cDUMVVqLmA4nOaepXJRrH9WqHNTumwCkasZeouwvbFFqjRMT9icDNhBHyIKTMfmT4bI8CA/0\",\"privilege\":[],\"unionid\":\"o_Kvsv1nN9OoY96mwGDvEiD7wZpw\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1K-m9q_0TDsOHDIa3OXaIgM', 'oGYue1K-m9q_0TDsOHDIa3OXaIgM', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000095-82c3603985db18e5-ddb36a1f', '1', '', '1505569674190', '1', null, '将军Rip', '1', '2017-09-16 20:55:31', null, null, 'o_KvsvzDnSVq_E4ewFoaSKvxM-S4', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIhzbKW5MfDDibyM7cniayMadsLXskyTb3ZMLWkN0ucN1wOVaHKCWdznk9CYMVXf4AvYbxRd7LIcriaw/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1K-m9q_0TDsOHDIa3OXaIgM\",\"nickname\":\"将军Rip\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"KR\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIhzbKW5MfDDibyM7cniayMadsLXskyTb3ZMLWkN0ucN1wOVaHKCWdznk9CYMVXf4AvYbxRd7LIcriaw/0\",\"privilege\":[],\"unionid\":\"o_KvsvzDnSVq_E4ewFoaSKvxM-S4\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1LK1U5DPUyslPSSl_JpIGvE', 'oGYue1LK1U5DPUyslPSSl_JpIGvE', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001f3-39de52e8cd19530e-5657ff4f', '1', '', '1506329566464', '1', null, '☆喵星纳粹元首希特喵☆', '1', '2017-09-13 14:53:11', null, null, 'o_Kvsv7qZbLl8kFuTLrVDhMRMF4U', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoDA8HqHL3ZNz3jcQhf6aAryIdZ1j8Bh75TPTpoScMpODMsBa3mVBbQGDFxoajZiaF2JV9p8JHQXBQ/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '994', '{\"openid\":\"oGYue1LK1U5DPUyslPSSl_JpIGvE\",\"nickname\":\"☆喵星纳粹元首希特喵☆\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoDA8HqHL3ZNz3jcQhf6aAryIdZ1j8Bh75TPTpoScMpODMsBa3mVBbQGDFxoajZiaF2JV9p8JHQXBQ/0\",\"privilege\":[],\"unionid\":\"o_Kvsv7qZbLl8kFuTLrVDhMRMF4U\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1LSBqtBCSbOUYlbcYbSL6c8', 'oGYue1LSBqtBCSbOUYlbcYbSL6c8', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000183-6b533ac2485b7d91-3779ffc9', '1', '230879', '1506086589822', '1', null, '-', '1', '2017-09-16 15:57:33', null, null, 'o_KvsvxlZ0XLo6bH3_Sc3TJEAtY0', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ1gKY1NCmxhagkATAMVU9iblYoXNnUl4N3Y3rp2JAq8tNWjL0s3iaGnWm59tCD3pmLtFMk1tweRCGg/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1LSBqtBCSbOUYlbcYbSL6c8\",\"nickname\":\"-\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Shenzhen\",\"province\":\"Guangdong\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ1gKY1NCmxhagkATAMVU9iblYoXNnUl4N3Y3rp2JAq8tNWjL0s3iaGnWm59tCD3pmLtFMk1tweRCGg/0\",\"privilege\":[],\"unionid\":\"o_KvsvxlZ0XLo6bH3_Sc3TJEAtY0\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1LxvLkSA-u5BcO5xxoxyado', 'oGYue1LxvLkSA-u5BcO5xxoxyado', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000189-80e5ac3e1f18d11d-3c7c5746', '1', '', '1506136676569', '1', null, '黄新', '1', '2017-09-15 10:11:46', null, null, 'o_Kvsv0HkZ5N3etFJC-z2FLXK_Pw', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqQocafoppW1VZyD9WolSV1TZn0ic9BUiahAGplV1BicNauHFGp0m4FBddiadP8znjvWwObezzF6Ha6bA/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '95', '{\"openid\":\"oGYue1LxvLkSA-u5BcO5xxoxyado\",\"nickname\":\"黄新\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqQocafoppW1VZyD9WolSV1TZn0ic9BUiahAGplV1BicNauHFGp0m4FBddiadP8znjvWwObezzF6Ha6bA/0\",\"privilege\":[],\"unionid\":\"o_Kvsv0HkZ5N3etFJC-z2FLXK_Pw\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1MmSOunYc6kAPuo3dZsg6DI', 'oGYue1MmSOunYc6kAPuo3dZsg6DI', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c0-574d114b389c65f4-38d16ae3', '1', '', '1506171952684', '1', null, '寇嵩', '1', '2017-09-14 11:16:08', null, null, 'o_KvsvxmTazueXSNeis9g-mn4kPI', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqL9DvvQMiaZng19ghbgZe259c6KOnh2ia8xz6JOvkBuOGvM80bAyCdmERZIdxQMLpNRpVVF1o9BMSg/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1MmSOunYc6kAPuo3dZsg6DI\",\"nickname\":\"寇嵩\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kaifeng\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqL9DvvQMiaZng19ghbgZe259c6KOnh2ia8xz6JOvkBuOGvM80bAyCdmERZIdxQMLpNRpVVF1o9BMSg/0\",\"privilege\":[],\"unionid\":\"o_KvsvxmTazueXSNeis9g-mn4kPI\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1Njl5P7Gam2HWejaeNtpw-c', 'oGYue1Njl5P7Gam2HWejaeNtpw-c', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004c19-00000039-a5adc77be4860325-fcd4a01f', '1', '', '1505291419343', '1', null, 'You-are beautiful', '1', '2017-09-13 16:28:19', null, null, 'o_Kvsvyx5eZLDxC4Fmb-KQQ523kg', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJP05RJ5icJkUmlJHyXHSnNLop9RDL9bISicbz2oLJzezYYSctj8VYbSv6pJgnc0PxOIFA8seZ6763w/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1Njl5P7Gam2HWejaeNtpw-c\",\"nickname\":\"You-are beautiful\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJP05RJ5icJkUmlJHyXHSnNLop9RDL9bISicbz2oLJzezYYSctj8VYbSv6pJgnc0PxOIFA8seZ6763w/0\",\"privilege\":[],\"unionid\":\"o_Kvsvyx5eZLDxC4Fmb-KQQ523kg\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1NQ15zVXEuOLf_e6A7kbclU', 'oGYue1NQ15zVXEuOLf_e6A7kbclU', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c9-a8477830cdb7488f-3890b6ed', '1', '', '1506171892638', '1', null, '王百万', '1', '2017-09-13 15:36:14', null, null, 'o_Kvsv4p-NZWYOlQspg0SxqmacVU', 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epVQ8FdNhFJka4wQvUysEAAX07N7w7yt0bcL2nMGuBG4Jcibjw2HOzu14a9x7mlcFsEUr8xNAJbRVg/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '90', '{\"openid\":\"oGYue1NQ15zVXEuOLf_e6A7kbclU\",\"nickname\":\"王百万\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kaifeng\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epVQ8FdNhFJka4wQvUysEAAX07N7w7yt0bcL2nMGuBG4Jcibjw2HOzu14a9x7mlcFsEUr8xNAJbRVg/0\",\"privilege\":[],\"unionid\":\"o_Kvsv4p-NZWYOlQspg0SxqmacVU\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1NSrUwsexLArz_m_wccoaSY', 'oGYue1NSrUwsexLArz_m_wccoaSY', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c7-bbd38cffc2ca3a1c-d68a6716', '1', '', '1506087113422', '1', null, '〖龍仔仔〗', '1', '2017-09-17 15:48:36', null, null, 'o_Kvsv-KJ-jj5-2Jc-8xI1tbRWe4', 'http://wx.qlogo.cn/mmopen/vi_32/iaPp7ClZOGcqkjwOMCN7DgO3WMia9IdgeFXwguWL9YAY8sTFic023KyIQUkhYEyT3t2ZIJjlwSdP9GPj92aj3xLsw/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1NSrUwsexLArz_m_wccoaSY\",\"nickname\":\"〖龍仔仔〗\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kunming\",\"province\":\"Yunnan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/iaPp7ClZOGcqkjwOMCN7DgO3WMia9IdgeFXwguWL9YAY8sTFic023KyIQUkhYEyT3t2ZIJjlwSdP9GPj92aj3xLsw/0\",\"privilege\":[],\"unionid\":\"o_Kvsv-KJ-jj5-2Jc-8xI1tbRWe4\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1OfeNxxdkwyz98hV5d21PxQ', 'oGYue1OfeNxxdkwyz98hV5d21PxQ', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-00000182-dcca2d87085b6264-c319b40c', '1', '', '1506087100899', '1', null, 'A谷其士食品有限公司', '0', '2017-09-15 13:12:40', null, null, 'o_Kvsv_p1JmqZa5wbUKMxO7m-DEg', 'http://wx.qlogo.cn/mmopen/vi_32/xgrwBRgjFoEMba6ibxicY1pqI2pagFOjb68mxmyhAMUNxHc4NloBQ67jKtoFW86Yb8XUiaX81oo9MwRAdD4WugX4Q/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1OfeNxxdkwyz98hV5d21PxQ\",\"nickname\":\"A谷其士食品有限公司\",\"sex\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/xgrwBRgjFoEMba6ibxicY1pqI2pagFOjb68mxmyhAMUNxHc4NloBQ67jKtoFW86Yb8XUiaX81oo9MwRAdD4WugX4Q/0\",\"privilege\":[],\"unionid\":\"o_Kvsv_p1JmqZa5wbUKMxO7m-DEg\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1OmR1VRE8Qg28JwDxxqBBWk', 'oGYue1OmR1VRE8Qg28JwDxxqBBWk', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c2-2f83664d209cee53-c3e29e5f', '1', '', '1506171870902', '1', null, '宥玮', '1', '2017-09-23 20:08:02', null, null, 'o_Kvsv5nXfwyuF6gpQuBXS3uzju4', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKXGpIC5JiaJ7GgNKb1zN1L2MfZeSRnQFuhwID2Uk0LaJQSQaM8qibZMX4AZfIySibCnnQLttdEBIGwg/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1OmR1VRE8Qg28JwDxxqBBWk\",\"nickname\":\"宥玮\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kaifeng\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKXGpIC5JiaJ7GgNKb1zN1L2MfZeSRnQFuhwID2Uk0LaJQSQaM8qibZMX4AZfIySibCnnQLttdEBIGwg/0\",\"privilege\":[],\"unionid\":\"o_Kvsv5nXfwyuF6gpQuBXS3uzju4\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1P-rdNsmxes3BxhT2OXtZNU', 'oGYue1P-rdNsmxes3BxhT2OXtZNU', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001df-2c2b92105fe59f2f-bcfd9e24', '1', '', '1506251484716', '1', null, '胡音', '2', '2017-09-24 19:08:43', null, null, 'o_KvsvyxBuaLNj639M48gVlX0tzc', 'http://wx.qlogo.cn/mmopen/vi_32/VUxfjagx5wia2Cz9QpeMSLQDpglxo6EzibAfkhyro52ibe6N2O2xBwEOHBbE9lWa9IQH98gpibPIJxx6mC6G2b6TNA/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1P-rdNsmxes3BxhT2OXtZNU\",\"nickname\":\"胡音\",\"sex\":2,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"IS\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/VUxfjagx5wia2Cz9QpeMSLQDpglxo6EzibAfkhyro52ibe6N2O2xBwEOHBbE9lWa9IQH98gpibPIJxx6mC6G2b6TNA/0\",\"privilege\":[],\"unionid\":\"o_KvsvyxBuaLNj639M48gVlX0tzc\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1PKO2_Ah72itiPiBA-3QAps', 'oGYue1PKO2_Ah72itiPiBA-3QAps', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-000001c3-e8c288c5209cef6b-72e08e26', '1', '', '1506171648716', '1', null, 'Bond', '1', '2017-09-13 18:26:09', null, null, 'o_Kvsv6Nc0Z6enA0x1Y0FDJ5DbEo', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcTxicN4IntjfaiaByzQnjrqPYHN6942PW0FdnZOTQVycWPNERtfUJ2hjk7ibrVZth7qnqibewme2ribw/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '95', '{\"openid\":\"oGYue1PKO2_Ah72itiPiBA-3QAps\",\"nickname\":\"Bond\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Zhengzhou\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcTxicN4IntjfaiaByzQnjrqPYHN6942PW0FdnZOTQVycWPNERtfUJ2hjk7ibrVZth7qnqibewme2ribw/0\",\"privilege\":[],\"unionid\":\"o_Kvsv6Nc0Z6enA0x1Y0FDJ5DbEo\"}', null);
INSERT INTO `s_user` VALUES ('oGYue1PUJRwYy5FjZ1sk7uD89lCU', 'oGYue1PUJRwYy5FjZ1sk7uD89lCU', 'e10adc3949ba59abbe56e057f20f883e', 'bbe1c450365b4bbd839d02411167cdea', '00163efffe05f4bb-00004ded-0000013f-9e41b30c681cb22a-fe05dda4', '1', '', '1506007979927', '1', null, '别人笑我太疯癫', '1', '2017-09-14 14:31:51', null, null, 'o_Kvsv7Rc6cMBLQzcRsBjW1XCqJk', 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKibqX2nPhYJDS5xQ1ibVFIyjNqbU2iaQzB9XKduIkMQHIMefmuxtiaE2dmFrUibdxFkZ66T3GLZGsj9eA/0', null, '0', null, null, null, null, null, null, null, null, null, '0', '0', '0', '0', '0', '0', '0', '100', '{\"openid\":\"oGYue1PUJRwYy5FjZ1sk7uD89lCU\",\"nickname\":\"别人笑我太疯癫\",\"sex\":1,\"language\":\"zh_CN\",\"city\":\"Kaifeng\",\"province\":\"Henan\",\"country\":\"CN\",\"headimgurl\":\"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKibqX2nPhYJDS5xQ1ibVFIyjNqbU2iaQzB9XKduIkMQHIMefmuxtiaE2dmFrUibdxFkZ66T3GLZGsj9eA/0\",\"privilege\":[],\"unionid\":\"o_Kvsv7Rc6cMBLQzcRsBjW1XCqJk\"}', null);

-- ----------------------------
-- Table structure for `s_user_log`
-- ----------------------------
DROP TABLE IF EXISTS `s_user_log`;
CREATE TABLE `s_user_log` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `log_desc` varchar(4000) DEFAULT NULL,
  `log_type` int(2) DEFAULT NULL COMMENT '1登陆 2退出',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_user_log
-- ----------------------------

-- ----------------------------
-- Table structure for `s_user_payment`
-- ----------------------------
DROP TABLE IF EXISTS `s_user_payment`;
CREATE TABLE `s_user_payment` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `goods_id` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `order_id` varchar(64) DEFAULT NULL,
  `original_data` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of s_user_payment
-- ----------------------------
INSERT INTO `s_user_payment` VALUES ('1bc8e9407a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '4', '2017-08-06 15:37:33', 'PB15552017080611424675675', null);
INSERT INTO `s_user_payment` VALUES ('1d18c1d07a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '3', '2017-08-06 15:37:35', 'PB15552017080611424675675', null);
INSERT INTO `s_user_payment` VALUES ('9fd3f8707a7911e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '3', '2017-08-06 15:34:05', 'PB15552017080611424675675', null);

-- ----------------------------
-- Table structure for `w_game_prop`
-- ----------------------------
DROP TABLE IF EXISTS `w_game_prop`;
CREATE TABLE `w_game_prop` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `prop_name` varchar(32) DEFAULT NULL,
  `prop_desc` varchar(4000) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_game_prop
-- ----------------------------
INSERT INTO `w_game_prop` VALUES ('1', '冰冻', null, '2017-07-11 17:49:43');
INSERT INTO `w_game_prop` VALUES ('2', '锁定', null, '2017-06-06 10:29:31');
INSERT INTO `w_game_prop` VALUES ('3', '金币', '以个为单位', '2017-08-07 20:28:35');
INSERT INTO `w_game_prop` VALUES ('4', '元宝', null, '2017-09-09 13:46:48');

-- ----------------------------
-- Table structure for `w_gift`
-- ----------------------------
DROP TABLE IF EXISTS `w_gift`;
CREATE TABLE `w_gift` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `receive_time` datetime DEFAULT NULL COMMENT '领取时间',
  `goods_id` int(11) DEFAULT NULL COMMENT '商品id',
  `gift_type` int(11) DEFAULT NULL,
  `game_prop_id` varchar(32) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `user_vip` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_gift
-- ----------------------------
INSERT INTO `w_gift` VALUES ('5ff876807a8411e7bed62189316c9a34', '9c012a33aa8b4ecc8aaf20ea149a6f25', '2017-08-06 16:51:02', null, '3', '1', '2', '1', '2');
INSERT INTO `w_gift` VALUES ('60b526e07a7011e7a2ac09d69666beda', '9c012a33aa8b4ecc8aaf20ea149a6f25', '2017-08-06 14:27:54', null, '2', '1', '3', '2123123', '2');

-- ----------------------------
-- Table structure for `w_gift_type`
-- ----------------------------
DROP TABLE IF EXISTS `w_gift_type`;
CREATE TABLE `w_gift_type` (
  `id` varchar(32) NOT NULL,
  `type_name` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_gift_type
-- ----------------------------
INSERT INTO `w_gift_type` VALUES ('1', '每日登陆');
INSERT INTO `w_gift_type` VALUES ('2', '退出');

-- ----------------------------
-- Table structure for `w_goods`
-- ----------------------------
DROP TABLE IF EXISTS `w_goods`;
CREATE TABLE `w_goods` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `goods_name` varchar(32) DEFAULT NULL,
  `goods_desc` varchar(4000) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `cost` int(11) DEFAULT NULL COMMENT '人民币',
  `payment_id` varchar(128) DEFAULT NULL COMMENT '支付平台的商品id',
  `disposable` int(1) DEFAULT NULL COMMENT '一次性的',
  `interval_time` int(2) DEFAULT NULL COMMENT '购买的间隔时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_goods
-- ----------------------------
INSERT INTO `w_goods` VALUES ('0618ba207bcf11e784627dd159406629', '商品7', '商品7', '2017-08-08 08:17:55', '7', '7', '1', '7');
INSERT INTO `w_goods` VALUES ('1', '商品3', '商品3', '2017-07-11 17:49:43', '3', '3', '1', '3');
INSERT INTO `w_goods` VALUES ('170f87f07bcf11e784627dd159406629', '商品8', '商品8', '2017-08-08 08:18:23', '8', '8', '1', '8');
INSERT INTO `w_goods` VALUES ('2', '商品1', '商品1', '2017-06-06 10:29:31', '1', '1', '1', '1');
INSERT INTO `w_goods` VALUES ('3', '100', '商品2', '2017-07-11 17:47:41', '100', '2', '0', '1');
INSERT INTO `w_goods` VALUES ('4', '1,000', '商品4', '2017-08-01 21:39:34', '500', 'sdfafasdf', '0', '4');
INSERT INTO `w_goods` VALUES ('5020b6507bce11e784627dd159406629', '商品5', '商品5', '2017-08-08 08:12:50', '5', '5', '1', '5');
INSERT INTO `w_goods` VALUES ('587a29d07bce11e784627dd159406629', '商品6', '商品6', '2017-08-08 08:13:04', '6', '6', '1', '6');
INSERT INTO `w_goods` VALUES ('6f738960994711e7b3315d878c407a53', '12', '1', '2017-09-14 20:22:55', '0', '1', '0', '0');
INSERT INTO `w_goods` VALUES ('baa2bff07bd811e78b655f61f9095a9f', '登陆奖励', '登陆奖励', '2017-08-08 09:27:23', '10', '33', '0', '34');

-- ----------------------------
-- Table structure for `w_goods_detail`
-- ----------------------------
DROP TABLE IF EXISTS `w_goods_detail`;
CREATE TABLE `w_goods_detail` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `goods_id` varchar(32) DEFAULT NULL,
  `game_prop_id` varchar(32) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_goods_detail
-- ----------------------------
INSERT INTO `w_goods_detail` VALUES ('1', '1', '1', '1', '2017-08-07 17:16:58');
INSERT INTO `w_goods_detail` VALUES ('10', '0618ba207bcf11e784627dd159406629', '3', '77', '2017-08-08 08:18:07');
INSERT INTO `w_goods_detail` VALUES ('11', '170f87f07bcf11e784627dd159406629', '3', '88', '2017-08-08 08:18:45');
INSERT INTO `w_goods_detail` VALUES ('12', 'baa2bff07bd811e78b655f61f9095a9f', '3', '10000', '2017-08-08 09:27:55');
INSERT INTO `w_goods_detail` VALUES ('13', 'baa2bff07bd811e78b655f61f9095a9f', '2', '3', '2017-08-08 09:28:18');
INSERT INTO `w_goods_detail` VALUES ('2', '1', '2', '2', '2017-08-07 17:17:01');
INSERT INTO `w_goods_detail` VALUES ('3', '2', '1', '3', '2017-08-07 17:17:03');
INSERT INTO `w_goods_detail` VALUES ('4', '4', '4', '1000', '2017-08-07 17:17:06');
INSERT INTO `w_goods_detail` VALUES ('5', '1', '3', '5', '2017-08-07 20:30:30');
INSERT INTO `w_goods_detail` VALUES ('6', '3', '4', '100', '2017-08-08 08:15:57');
INSERT INTO `w_goods_detail` VALUES ('7', '3', '3', '5', '2017-08-08 08:16:34');
INSERT INTO `w_goods_detail` VALUES ('8', '5020b6507bce11e784627dd159406629', '3', '55', '2017-08-08 08:17:13');
INSERT INTO `w_goods_detail` VALUES ('9', '587a29d07bce11e784627dd159406629', '3', '66', '2017-08-08 08:17:31');

-- ----------------------------
-- Table structure for `w_notice`
-- ----------------------------
DROP TABLE IF EXISTS `w_notice`;
CREATE TABLE `w_notice` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `title` varchar(32) DEFAULT NULL,
  `content` varchar(4000) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `last_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_notice
-- ----------------------------
INSERT INTO `w_notice` VALUES ('484f7e607cba11e7bd9e93d29c1332a2', '力量1', '了<font color=\"#9fe1e7\">反反复复2</font>', '2017-08-09 12:21:58', '1', null);
INSERT INTO `w_notice` VALUES ('bullet_level_consume', '10', '子弹消耗倍数', '2017-07-11 17:49:43', '1', '2017-07-27 20:03:45');
INSERT INTO `w_notice` VALUES ('bullet_level_max', '100', '子弹最大等级', '2017-06-06 10:29:31', '1', null);
INSERT INTO `w_notice` VALUES ('bullet_level_min', '1', '子弹最小等级', '2017-07-11 17:47:41', '1', null);
INSERT INTO `w_notice` VALUES ('da426e6076be11e7ad1a29fa785dd421', '111', '杨光在游戏<b><font color=\"#fbe983\">中已充值99</font></b>99<strike><font color=\"#f83a22\">999</font></strike>', '2017-08-01 21:39:34', '1', null);

-- ----------------------------
-- Table structure for `w_order`
-- ----------------------------
DROP TABLE IF EXISTS `w_order`;
CREATE TABLE `w_order` (
  `id` varchar(32) NOT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `goods_id` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `order_id` varchar(64) DEFAULT NULL,
  `status` int(11) DEFAULT NULL COMMENT '0未领取 1领取',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of w_order
-- ----------------------------
INSERT INTO `w_order` VALUES ('03f24fa07a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:36:53', 'PB15552017080611424675675', '1');
INSERT INTO `w_order` VALUES ('0c3b96807a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:07', 'PB15552017080611424675675', '1');
INSERT INTO `w_order` VALUES ('151843c07a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:22', 'PB15552017080611424675675', '1');
INSERT INTO `w_order` VALUES ('1b163b107a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:32', 'PB15552017080611424675675', '1');
INSERT INTO `w_order` VALUES ('1bc8e9407a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:33', 'PB15552017080611424675675', '1');
INSERT INTO `w_order` VALUES ('1d18c1d07a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:35', 'PB15552017080611424675675', '0');
INSERT INTO `w_order` VALUES ('1e6258d07a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:37', 'PB15552017080611424675675', '0');
INSERT INTO `w_order` VALUES ('1efc00c07a7a11e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:37:38', 'PB15552017080611424675675', '0');
INSERT INTO `w_order` VALUES ('9fd3f8707a7911e7ae301facf754df8a', '9c012a33aa8b4ecc8aaf20ea149a6f25', '1', '2017-08-06 15:34:05', 'PB15552017080611424675675', '1');
