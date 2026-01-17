package com.gomokumaster.service;

import com.gomokumaster.entity.User;
import com.gomokumaster.event.GameEvent;
import com.gomokumaster.event.GameEventType;
import com.gomokumaster.mapper.UserMapper;
import com.gomokumaster.proto.GamePacket;
import com.gomokumaster.proto.MsgType;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import io.netty.channel.Channel;


import java.time.Duration;

@Service
public class UserSessionService {
    @Autowired
    private RedissonClient redissonClient;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ApplicationEventPublisher eventPublisher; //使用boot自带的事件发布器

    // 保存用户上线信息
    public void saveUserSession(String userId) {
        // RBucket 就像是一个引用，指向 Redis 里的一个 String/Object
        // Key 格式建议： "app名字:模块:id" -> "game:user:1001"
        RBucket<User> bucket = redissonClient.getBucket("game:user:" + userId);
        // 创建一个 User 对象，存储用户信息
        User userInfo = userInfoIsSaved(userId);
        // 存进去，并设置过期时间 24 小时 (防止僵尸数据)
        bucket.set(userInfo, Duration.ofHours(24));
    }
    // 获取线上用户信息
    public User getUserSession(String userId) {
        RBucket<User> bucket = redissonClient.getBucket("game:user:" + userId);
        return bucket.get(); //GET 命令，获取值
    }
    // 用户下线/断开连接
    public void removeUserSession(String userId) {
        RBucket<User> bucket = redissonClient.getBucket("game:user:" + userId);
        bucket.delete(); //DEL 命令，删除键
    }
    //保存用户信息
    private User userInfoIsSaved(String userId) {
        RBucket<User> bucket = redissonClient.getBucket("game:user:" + userId);
        User user = bucket.get();
        if (user != null) {
            return user; //如果存在，就不需要触碰数据库了
        }
        return userMapper.getUserInfo(userId); //如果不存在，就去数据库里查
    }

    // 处理心跳逻辑
    public void handleHeartbeat(String userId, Channel session) {
        // Redis 里的在线状态续命 (30秒过期)
        // 如果 30秒 没收到下一个心跳，Redis 会自动删掉这个 Key，视为掉线
        RBucket<String> onlineBucket = redissonClient.getBucket("game:online:" + userId);
        onlineBucket.set("online", Duration.ofSeconds(30));
        //回复前端一个 HEARTBEAT 包
        GamePacket pong = GamePacket.newBuilder()
                .setType(MsgType.HEARTBEAT)
                .build();
        //发送心跳包
        eventPublisher.publishEvent(new GameEvent(userId, GameEventType.SEND_MESSAGE, pong));
    }
}
