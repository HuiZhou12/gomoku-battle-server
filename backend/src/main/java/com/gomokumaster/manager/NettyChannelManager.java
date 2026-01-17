package com.gomokumaster.manager;

import com.gomokumaster.event.GameEvent;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Component // 必须是组件，Spring
public class NettyChannelManager {

    // 全局连接池
    public static final Map<String, Channel> USER_CHANNELS = new ConcurrentHashMap<>();

    public void addChannel(String userId, Channel channel) {
        USER_CHANNELS.put(userId, channel);
    }

    public void removeChannel(String userId) {
        USER_CHANNELS.remove(userId);
    }
    public boolean isConnected(String userId) {
        return USER_CHANNELS.containsKey(userId);
    }

    // 监听 Spring 事件，向客户端发消息
    @EventListener
    public void handleGameEvent(GameEvent event) {
        Channel channel = USER_CHANNELS.get(event.userId());
        if (channel != null && channel.isActive()) {
            byte[] bytes = event.packet().toByteArray();
            ByteBuf buf = channel.alloc().buffer(bytes.length);
            buf.writeBytes(bytes);
            channel.writeAndFlush(new BinaryWebSocketFrame(buf));
        } else {
            // 用户可能掉线了
            System.out.println("发送失败，用户不在线: " + event.userId());
        }
    }
}