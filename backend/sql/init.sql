DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
                        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户UID (游戏ID)',
                        `username` VARCHAR(50) NOT NULL DEFAULT '用户' COMMENT '登录用户名',
                        `password` VARCHAR(255) NOT NULL COMMENT '密码（建议存hash）',
                        `nickname` VARCHAR(50) DEFAULT NULL COMMENT '网名/昵称',
                        `avatar` VARCHAR(255) DEFAULT 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png' COMMENT '头像URL',
                        `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
                        `win_count` INT NOT NULL DEFAULT 0 COMMENT '胜场数',
                        `lose_count` INT NOT NULL DEFAULT 0 COMMENT '负场数',
                        `create_time` BIGINT NOT NULL COMMENT '创建时间（时间戳）',
                        `last_login_time` BIGINT NOT NULL COMMENT '最后登录时间（时间戳）',
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `uk_username` (`username`),
                        UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=100001 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
delete from user where id = '100005';

delete from user where id = '10000';