package com.gomokumaster.config; // 记得改成你的包名

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class RedissonConfig {

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private String port;

    @Value("${spring.data.redis.password}")
    private String password;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();

        // 关键点在这里
        // Redisson 必须使用 "redis://
        String redisAddress = "redis://" + host + ":" + port;
        config.useSingleServer()
                .setAddress(redisAddress)
                .setPassword(password)
                .setDatabase(0); // 默认用 0 号库

        System.out.println("Redisson 正在连接: " + redisAddress); // 打印日志方便调试
        return Redisson.create(config);
    }
}