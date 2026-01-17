package com.gomokumaster.runner;

import com.gomokumaster.service.GameTimerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class GameTimerRunner  implements CommandLineRunner {
    @Autowired
    private GameTimerService gameTimerService;
    @Override
    public void run(String... args) throws Exception {
        System.out.println("-----------------------------------------");
        System.out.println(">>> 游戏计时引擎正在启动 (GameTime manager Engine Starting) <<<");
        System.out.println("-----------------------------------------");
        gameTimerService.startConsumer();
    }
}
