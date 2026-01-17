package com.gomokumaster.service;

import com.gomokumaster.entity.User;
import com.gomokumaster.mapper.UserMapper;
import com.gomokumaster.model.Player;
import org.redisson.api.RBlockingDeque;
import org.redisson.api.RBlockingQueue;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class MatchService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private RedissonClient redissonClient;
    private static final String MATCH_QUEUE_KEY= "game:queue:normal";

    @Autowired
    GameRoomService gameRoomService;
    @Autowired
    private RedissonClient redisson;

    // 玩家加入匹配队列
    public void addToQueue(String userId) {
        System.out.println("用户 " + userId + " 加入匹配队列...");
        setPlayerStatus(userId,"MATCHING");
        // 获取阻塞队列
        /**
         * 普通队列：没数据就“立刻返回”
         * 阻塞队列：没数据就“原地等着”
         * RQueue-->List + LPOP
         * RBlockingQueue-->List + BLPOP
         */
        RBlockingDeque<String> queue = redissonClient.getBlockingDeque(MATCH_QUEUE_KEY);
        // Redis 的 RPUSH
        if (!queue.contains(userId)) { //LRANGE match:queue 0 -1 获取队列中的所有元素, 在java内部进行遍历比较
            queue.offer(userId); // RPUSH match:queue userId 在链表的右边添加元素
        }
    }
    public void removeFromQueue(String userId) {
        System.out.println("用户 " + userId + " 退出匹配队列...");
        setPlayerStatus(userId, "IDLE");
        RBlockingDeque<String> queue = redissonClient.getBlockingDeque(MATCH_QUEUE_KEY);
        queue.remove(userId);
    }

    //匹配逻辑
    public void startMatchingTask() {
        new Thread(() -> {
            //底层为双端队列
            RBlockingDeque<String> queue = redissonClient.getBlockingDeque(MATCH_QUEUE_KEY);
            while (true) {
                try {
                    //寻找 P1
                    String player1 = null;
                    while (player1 == null) {
                        // 阻塞获取 P1
                        String candidate = queue.takeFirst();
                        // 查 Redis 状态
                        if (isPlayerMatching(candidate)) {
                            player1 = candidate; // 状态正常，确认为 P1
                        } else {
                            // 如果状态是 IDLE，说明他在被后端 take 出来的前后取消
                            System.out.println("玩家 " + candidate + " 已取消，丢弃，寻找下一个 P1...");
                            candidate = null; // 直接丢掉p1，等待java自动垃圾回收
                        }
                    }
                    //寻找 P2
                    String player2 = null;
                    while (player2 == null) {
                        // 等待对手，最多等 10 秒
                        String candidate = queue.poll(3, TimeUnit.SECONDS);
                        if (candidate == null) {
                            // 超时了也没人来
                            // 把 P1 放回队头
                            if (isPlayerMatching(player1)) {
                                queue.addFirst(player1);
                            }
                            player1 = null; // 放弃这轮匹配，重新开始大循环
                            break;
                        }
                        // 二次确认：检查 P2 状态
                        if (isPlayerMatching(candidate)) {
                            // 防止 P1 和 P2 是同一个人
                            if (candidate.equals(player1)) {
                                continue;
                            }
                            player2 = candidate; // 状态正常，确认为 P2
                        } else {
                            System.out.println("玩家 " + candidate + " 已取消，丢弃，继续给 P1 找对手...");
                        }
                    }
                    //匹配成功
                    if (player1 != null && player2 != null) {
                        // 最后再检查一次 P1 (防止在等 P2 的 10秒内 P1 取消了)
                        if (!isPlayerMatching(player1)) {
                            // P1 跑路了，P2 变成新的 P1，重回队列或者直接处理
                            // 简单处理：把 P2 放回队头，重新循环
                            if (isPlayerMatching(player2)) queue.addFirst(player2);
                            continue;
                        }

                        // 真正的创建房间
                        createGameRoom(player1, player2);
                        // 移除匹配状态
                        removePlayerStatus(player1);
                        removePlayerStatus(player2);
                    }

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
    private void createGameRoom(String p1, String p2) {
        System.out.println("匹配成功: " + p1 + " vs " + p2);
        //先去redis中获取用户信息，如果为空，则去数据库中获取
        RBucket<User> bucket = redissonClient.getBucket("game:user:" + p1);
        User blackUser = bucket.get();
        if (blackUser == null){
            blackUser = userMapper.getUserInfo(p1);
            bucket.set(blackUser, Duration.ofHours(24)); //再防备一手，缓存用户信息
        }
        bucket = redissonClient.getBucket("game:user:" + p2);
        User whiteUser = bucket.get();
        if (whiteUser == null){
            whiteUser = userMapper.getUserInfo(p2);
            bucket.set(whiteUser, Duration.ofHours(24));
        }
        Player blackPlayer = new Player(p1, blackUser.getUsername(), blackUser.getAvatar(),true,1, 5, 5, 5);
        Player whitePlayer = new Player(p2, whiteUser.getUsername(), whiteUser.getAvatar(),true,2, 5, 5, 5);
        gameRoomService.createRoom(blackPlayer, whitePlayer);
    }
    // 检查玩家状态是否处于匹配状态
    private boolean isPlayerMatching(String userId) {
        RBucket<String> statusBucket = redissonClient.getBucket("player:status:" + userId);
        String status = statusBucket
                .get();
        return "MATCHING".equals(status);
    }
    private void setPlayerStatus(String userId, String status) {
        redissonClient.getBucket("player:status:" + userId)
                .set(status, Duration.ofMinutes(30));
    }
    //只有在匹配成功时才移除玩家的匹配状态
    private void removePlayerStatus(String userId) {
        redissonClient.getBucket("player:status:" + userId)
                .delete();
    }
}
