package com.gomokumaster.controller;


import com.gomokumaster.utils.JwtUtils;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.QueryStringDecoder;
import io.netty.util.AttributeKey;

import java.util.List;
import java.util.UUID;

public class WebSocketAuthHandler extends ChannelInboundHandlerAdapter {

    /**
     * ChannelInboundHandlerAdapter 是 Netty 提供的入站事件处理器基类，
     * 用于处理连接生命周期事件和入站数据事件
     * 常用
     * | 方法                | 作用   |
     * | ----------------- | ---- |
     * | `channelRead`     | 收到数据 |
     * | `channelActive`   | 连接建立 |
     * | `channelInactive` | 连接断开 |
     * | `exceptionCaught` | 异常处理 |
     * 常用但不是每次都用
     * | 方法                    | 作用              |
     * | --------------------- | --------------- |
     * | `channelReadComplete` | 本次读完            |
     * | `userEventTriggered`  | 用户事件（心跳 / Idle） |
     **/

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        //是“当前 Handler 在 Pipeline 中的上下文对象”，它是用户与 Netty 框架交互的主要入口。
        /**
         * ChannelHandlerContext 同时持有：
         * 当前 Channel
         * 当前 Handler
         * 当前 EventLoop
         * Pipeline 中的 前后节点
         */

        if (msg instanceof FullHttpRequest) {
            FullHttpRequest req = (FullHttpRequest) msg;
            QueryStringDecoder decoder = new QueryStringDecoder(req.uri());
            /**假设客户端发来的请求就是：GET /ws?token=abc123&roomId=1001 HTTP/1.1
            * QueryStringDecoder的作用就是拆路径
             * decoder.parameters()
             * 返回类型：Map<String, List<String>>
             * 例如：
             * {
             *   "token": ["abc123"],
             *   "roomId": ["1001"]
             * }
             * */

            // 检查路径是否正确
            if (!"/ws".equals(decoder.path())) {
                ctx.close();
                return;
            }
            // 尝试从 Header 中取 Token
            String token = req.headers().get("Authorization");
            if (token == null) {
                // 如果没有，尝试从 URL 参数取
                List<String> params = decoder.parameters().get("token");
                if (params != null && !params.isEmpty()) {
                    token = params.get(0);
                }
            }
            if (token == null) {
                ctx.close();
                return;
            }
            // 验证 Token
            try {
                String userId = JwtUtils.getUserIdFromToken(token).toString();
                if (userId != null) {
                    ctx.channel().attr(AttributeKey.valueOf("userId")).set(userId);
                    /**
                     * AttributeKey 是一个“强类型的 Key”，
                     * 用字符串 "userId" 做唯一标识
                     * 在 JVM 全局缓存中查找
                     * 确保同名 key 是 同一个对象
                     **/
                    // 验证通过后，必须把请求“放行”给下一个 Handler (处理握手)
                    // 还要移除 Request 的引用计数 (如果不调用 super.channelRead)
                    // 但这里最简单的就是调用 super，让 pipeline 继续
                    ctx.fireChannelRead(msg);
                    // 握手认证只需一次，验证通过后移除当前 Handler，节省性能
                    ctx.pipeline().remove(this);
                    return;
                }
            } catch (Exception e) {
                ctx.close();
                return;
            }
            ctx.close();
        }
        super.channelRead(ctx, msg); //把当前收到的消息，继续往 Pipeline 的“下一个 Handler”传递。
        //如果不调用它，消息会在当前 Handler 被“截断”

    }
}