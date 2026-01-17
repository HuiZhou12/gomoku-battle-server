package com.gomokumaster.service;

import com.gomokumaster.event.GameTask;
import com.gomokumaster.event.SetCountDownEvent;
import com.gomokumaster.event.SetDisconnectCountDownEvent;
import org.redisson.api.RBlockingQueue;
import org.redisson.api.RDelayedQueue;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class GameTimerService {

    @Autowired
    private RedissonClient redissonClient;
    @Autowired
    private GameRoomService gameRoomService;// 你的业务Service
    private static final String TIMER_QUEUE = "game:timer:queue";
    public void startConsumer() {
        new Thread(() -> {
            RBlockingQueue<GameTask> blockingQueue = redissonClient.getBlockingQueue(TIMER_QUEUE);
            // 让延时队列生效
            redissonClient.getDelayedQueue(blockingQueue);
            while (true) {
                try {
                    // 阻塞等待，直到有任务到期
                    GameTask task = blockingQueue.take();
                    handleTask(task);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    // 处理到期任务
    private void handleTask(GameTask task) {
        if ("MOVE_TIMEOUT".equals(task.getType())) {
            gameRoomService.handleTurnTimeout(task.getRoomId(), task.getTurnNumber(), task.getVersion());
        } else if ("DISCONNECT_TIMEOUT".equals(task.getType())) {
            //暂停落子倒计时
            gameRoomService.handleDisconnectTimeout(task.getRoomId(),task.getTurnNumber(), task.getVersion());
        }
    }

    // 发布一个落子倒计时 (30秒)
    public void scheduleMoveTimeout(String roomId, int currentTurnNumber, boolean isPause, int version) {
        System.out.println("落子倒计时" + roomId + "当前玩家" + currentTurnNumber);
        RBlockingQueue<GameTask> blockingQueue = redissonClient.getBlockingQueue(TIMER_QUEUE);
        RDelayedQueue<GameTask> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);
        GameTask task = new GameTask();
        task.setRoomId(roomId);
        task.setTurnNumber(currentTurnNumber);
        task.setType("MOVE_TIMEOUT");
        task.setVersion(version);

        // 放入Zset，设置45秒后到期
        if (!isPause){
            delayedQueue.offer(task, 45,TimeUnit.SECONDS);
        }else {
            delayedQueue.remove(task); // 移除当前任务
        }

    }

    // 发布一个掉线倒计时
    public void scheduleDisconnectTimeout(String roomId, int currentTurnNumber, boolean isPause,int  version) {
        System.out.println("掉线倒计时" + roomId + "当前玩家" + currentTurnNumber);
        RBlockingQueue<GameTask> blockingQueue = redissonClient.getBlockingQueue(TIMER_QUEUE);
        RDelayedQueue<GameTask> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);
        GameTask task = new GameTask();
        task.setRoomId(roomId);
        task.setTurnNumber(currentTurnNumber);
        task.setType("DISCONNECT_TIMEOUT");
        task.setVersion(version);
        System.out.println(isPause);
        if (!isPause){
            delayedQueue.offer(task, 2,TimeUnit.MINUTES);
        } else {
            delayedQueue.remove(task); // 移除当前任务
        }

    }
    //监听事件
    @EventListener
    public void scheduleMove(SetCountDownEvent task) {
        scheduleMoveTimeout(task.roomId(), task.currentTurnNumber(), task.isPause(), task.version());
    }
    @EventListener
    public void scheduleDisconnect(SetDisconnectCountDownEvent task) {
        scheduleDisconnectTimeout(task.roomId(), task.currentTurnNumber(), task.isPause(),task.version());
    }
}