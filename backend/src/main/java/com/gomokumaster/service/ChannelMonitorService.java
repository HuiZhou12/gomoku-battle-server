//package com.gomokumaster.service;
//
//import org.springframework.stereotype.Service;
//
//import java.nio.charset.StandardCharsets;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardOpenOption;
//import java.time.LocalDateTime;
//import java.util.concurrent.Executors;
//import java.util.concurrent.ScheduledExecutorService;
//import java.util.concurrent.TimeUnit;
//
//import static com.gomokumaster.manager.NettyChannelManager.USER_CHANNELS;
//
//public class ChannelMonitorService {
//    /**
//     * ScheduledExecutorService: 这是一个专门用于处理“定时任务”或“周期性任务”的线程池。
//     * newSingleThreadScheduledExecutor: 因为写日志是顺序操作，不需要并发，单线程足以，且能避免多线程写文件时的锁竞争。
//     * setDaemon(true) (守护线程)
//     * 非守护线程 (User Thread): JVM 会等待所有非守护线程结束才会退出。
//     * 守护线程 (Daemon Thread): 如果主程序（比如 Spring Boot 或 Netty 主线程）结束了，JVM 不会管守护线程还在不在跑，直接强制关闭。
//     * 作用: 防止因为这个监控线程还在跑，导致你按 Ctrl+C 关闭服务器时关不掉。
//     */
//    private static final ScheduledExecutorService MONITOR_EXECUTOR =
//            Executors.newSingleThreadScheduledExecutor(r -> {
//                Thread t = new Thread(r, "ChannelMonitor-Thread");
//                t.setDaemon(true);
//                return t;
//            });
//    private static final Path MONITOR_FILE =
//            Paths.get("C:/Users/伊人为郁/Desktop/网易雷火面试/benchmark/tests/ws-long-connection/jmeter/online_channels.log");
//    public static void startChannelMonitor() {
//        MONITOR_EXECUTOR.scheduleAtFixedRate(() -> {
//            try {
//                String line = String.format(
//                        "%s onlineChannels=%d%n",
//                        LocalDateTime.now(),
//                        USER_CHANNELS.size()
//                );
//
//                Files.write(
//                        MONITOR_FILE,
//                        line.getBytes(StandardCharsets.UTF_8),
//                        StandardOpenOption.CREATE, // 如果文件不存在，创建它
//                        StandardOpenOption.APPEND  // 如果文件存在，追加在后面（不覆盖）
//                );
//                System.out.println(USER_CHANNELS.size());
//            } catch (Exception e) {
//                // 记录异常但不抛出，避免异常风暴
//                System.err.println("Failed to write monitor data: " + e.getMessage());
//            }
//        }, 0, 5, TimeUnit.SECONDS);
//    }
//
//    /**
//     * 关闭监控服务，释放资源
//     */
//    public static void shutdown() {
//        MONITOR_EXECUTOR.shutdown(); // 停止接收新任务
//        try {
//            // 等待最多 5 秒让正在执行的任务写完
//            if (!MONITOR_EXECUTOR.awaitTermination(5, TimeUnit.SECONDS)) {
//                MONITOR_EXECUTOR.shutdownNow(); // 超时强杀
//            }
//        } catch (InterruptedException e) {
//            MONITOR_EXECUTOR.shutdownNow();
//            Thread.currentThread().interrupt(); // 恢复中断状态
//        }
//    }
//}
