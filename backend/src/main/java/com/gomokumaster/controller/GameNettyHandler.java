package com.gomokumaster.controller;

import com.gomokumaster.manager.NettyChannelManager;
import com.gomokumaster.proto.GamePacket;
import com.gomokumaster.service.GameRoomService;
import com.gomokumaster.service.MatchService;
import com.gomokumaster.service.UserSessionService;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.websocketx.BinaryWebSocketFrame;
import io.netty.util.AttributeKey;



public class GameNettyHandler extends SimpleChannelInboundHandler<BinaryWebSocketFrame> {
    private final UserSessionService userSessionService;
    private final GameRoomService gameService;
    private final MatchService matchService;
    private final NettyChannelManager nettyChannelManager;
    private static final AttributeKey<String> USER_ID_KEY =
            AttributeKey.valueOf("userId");

    /**
     *SimpleChannelInboundHandler 是“帮你自动管理内存的专用型 Handler”，
     *ChannelInboundHandlerAdapter 是“什么都不管的通用型 Handler”。
     * SimpleChannelInboundHandler 本身就是继承自 ChannelInboundHandlerAdapter
     */
    // 构造函数注入
    public GameNettyHandler(UserSessionService userSessionService, GameRoomService gameService, MatchService matchService, NettyChannelManager nettyChannelManager) {
        this.userSessionService = userSessionService;
        this.gameService = gameService;
        this.matchService = matchService;
        this.nettyChannelManager = nettyChannelManager;
    }
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, BinaryWebSocketFrame frame) throws Exception {
        ByteBuf content = frame.content();
        byte[] bytes = new byte[content.readableBytes()];
        /**
         * Netty 的 ByteBuf 内部有 3 个核心概念：
         * readerIndex	下一个要读的位置
         * writerIndex	下一个要写的位置
         * capacity	底层数组容量
         * | 方法                | 含义      |
         * | ----------------- | ------- |
         * | `readableBytes()` | 还能读多少   |
         * | `writableBytes()` | 还能写多少   |
         * | `capacity()`      | 当前容量    |
         * | `maxCapacity()`   | 最大可扩展容量 |
         **/
        content.readBytes(bytes);// 从 ByteBuf 读数据到 byte[],一次性读完
        GamePacket packet = GamePacket.parseFrom(bytes); //解析 Protobuf
        String userId = ctx.channel().attr(USER_ID_KEY).get(); //获取 userId
        if (userId == null) {
            ctx.close();
            return;
        }
        Channel session  = ctx.channel(); //在 Netty 里，Channel 就是 WebSocket 的“会话（Session）”。
        //一个客户端连接 = 一个 Channel
        dispatch(userId, packet, session);
    }

    // 处理断开连接
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        try {
            // 安全获取 userId
            AttributeKey<String> userIdKey = USER_ID_KEY;
            String userId = ctx.channel().attr(userIdKey).get();

            if (userId != null && !userId.toString().trim().isEmpty()) {
                userId = userId.toString().trim();
                System.out.println("连接断开：" + ctx.channel().remoteAddress() + ", 用户ID: " + userId);
                nettyChannelManager.removeChannel(userId);
                userSessionService.removeUserSession(userId);
                gameService.disconnect(userId);
            } else {
                System.out.println("匿名连接断开：" + ctx.channel().remoteAddress());
            }
        } catch (Exception e) {
            System.err.println("处理连接断开时出现异常: " + e.getMessage());
        } finally {
            super.channelInactive(ctx);
        }
    }

    // 异常处理
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
    //指令分发
    public void dispatch(String userId, GamePacket packet, Channel session) {
//        System.out.println("收到用户: " + userId + " 的指令: " + packet.getType());
        switch (packet.getType().name()) {
            case "MATCH_REQ":
                matchService.addToQueue(userId);
                break;
            case "MOVE_REQ":
                gameService.processMove(userId, packet.getMoveReq());
                break;
            case "CHAT_REQ":
                gameService.chat(userId, packet.getChatReq());
                break;
            case "MATCH_CANCEL":
                // 取消匹配逻辑
                matchService.removeFromQueue(userId);
                break;
            case "CONNECT":
                 //连接逻辑,如果已经连接过了，则返回
                if (nettyChannelManager.isConnected(userId)){
                    return;
                }
                userSessionService.saveUserSession(userId);
                nettyChannelManager.addChannel(userId, session);
                if (gameService.isInGame(userId)) {
                    gameService.reBackToRoom(userId);
                }
                break;
            case "SURRENDER":
                gameService.surrender(userId);
                break;
            case "HEARTBEAT":
                userSessionService.handleHeartbeat(userId,session);
                break;
            default:
                System.out.println("未知指令: " + packet.getType());
        }
    }
    /**
     * 对于 WebSocketAuthHandler (中间站)： 推荐用 ctx.fireChannelRead(msg)。语义清晰：验证通过，放行给下一个。
     * 对于 GameNettyHandler (终点站)： 啥都别调。在 channelRead0 里处理完业务就结束。
     */
}