package com.gomokumaster.runner;

import com.gomokumaster.service.NettyWebSocketServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class NettyWebsocketRunner implements CommandLineRunner {
    @Autowired
    private NettyWebSocketServer nettyWebSocketServer;
    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----------------------------------------");
        System.out.println(">>> Netty正在启动(Netty is starting ) <<<");
        System.out.println("-----------------------------------------");

        nettyWebSocketServer.start();
    }
}
/**
 * Spring Boot 启动顺序（简化）：
 *
 * 1. 创建 Bean
 * 2. 依赖注入
 * 3. @PostConstruct   ← 这里
 * 4. 所有 Bean 创建完成
 * 5. Spring Boot 启动完成
 * 6. CommandLineRunner.run()  ← 这里
 * 7. 应用开始对外提供服务
 */