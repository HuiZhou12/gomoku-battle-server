package com.gomokumaster.runner;

import com.gomokumaster.exception.BusinessException;
import com.gomokumaster.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MatchTaskRunner implements CommandLineRunner {

    @Autowired
    private MatchService matchService;

    @Override
    public void run(String... args) throws BusinessException {
        System.out.println("-----------------------------------------");
        System.out.println(">>> 匹配引擎正在启动 (Match Engine Starting) <<<");
        System.out.println("-----------------------------------------");

        // 启动的死循环线程
        matchService.startMatchingTask();
    }
}