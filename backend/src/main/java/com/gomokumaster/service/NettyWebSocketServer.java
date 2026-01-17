package com.gomokumaster.service;

import com.gomokumaster.controller.GameNettyHandler;
import com.gomokumaster.controller.WebSocketAuthHandler;
import com.gomokumaster.manager.NettyChannelManager;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.stream.ChunkedWriteHandler;
import io.netty.util.concurrent.DefaultEventExecutorGroup;
import io.netty.util.concurrent.EventExecutorGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NettyWebSocketServer {
    /**
     * epoll 发现 socket 可读（内核态）
     *  ↓
     * EventLoop 唤醒（用户态）
     *  ↓
     * Netty 读 socket → ByteBuf
     *  ↓
     * pipeline.fireChannelRead()
     *  ↓
     * Handler.channelRead(ctx, msg)
     *  ↓
     * super.channelRead(ctx, msg)
     *  ↓
     * 下一个 Handler
     */
    @Autowired
    private UserSessionService userSessionService;
    @Autowired
    private MatchService matchService;
    @Autowired
    private GameRoomService gameService;
    @Autowired
    private NettyChannelManager nettyChannelManager;


    // 端口号
    private static final int PORT = 8888;
    // 主线程组：专门处理连接请求
    private final EventLoopGroup bossGroup = new NioEventLoopGroup(1);
    // 工作线程组：专门处理IO读写
    private final EventLoopGroup workerGroup = new NioEventLoopGroup();
    // 认证线程组：防止认证失败的或者其他错误阻塞责任链
    private final EventExecutorGroup authExecutorGroup = new DefaultEventExecutorGroup(32);

    public void start() {
        new Thread(() -> {
            try {
                ServerBootstrap b = new ServerBootstrap(); //这个组件的作用是配置 Netty 服务器 / 客户端的各种配置
                b.group(bossGroup, workerGroup) //关联线程组，它的作用就是把「接收连接」和「处理 IO」这两类完全不同的工作， 分配给不同的 EventLoopGroup 来执行，从而提高并发能力和系统稳定性。
                        .channel(NioServerSocketChannel.class) // 告诉Netty，这是一个 NIO Server Channel， 用的是 IO 多路复用模型（Selector / epoll）
                        .childHandler(new ChannelInitializer<SocketChannel>() { //ChannelInitializer是一个“临时的初始化器”，专门用来在 Channel 创建时，往 Pipeline 里加 Handler
                            //ChildHandler :是给线程池 ( NioEventLoopGroup 类型 ) 设置处理器 , 该处理器需要我们自己自定义 , 它是继承 ChannelInboundHandlerAdapter 类
                            @Override
                            protected void initChannel(SocketChannel ch) {
                                /**
                                 *  socket 进入就绪队列 → epoll_wait 返回 → Netty 主动读 socket → 再执行 pipeline
                                 */
                                //创建 SocketChannel（客户端连接）之后调用 childHandler.initChannel()。initChannel() 只调用一次
                                //调用完后，ChannelInitializer 会被自动移除。此外，SocketChannel 代表的是“一个已经建立连接的客户端 TCP 连接”
                                ChannelPipeline pipeline = ch.pipeline();
                                // HTTP 编解码 (WebSocket 握手是基于 HTTP 的)
                                pipeline.addLast(new HttpServerCodec()); //HttpServerCodec 的作用是：在 TCP 字节流和 HTTP 消息对象之间做编解码。
                                /*
                                没有HttpServerCodec的话，则不能使用WebSocket，因为WebSocket是基于HTTP upgrade的
                                入站：ByteBuf → HTTP 对象
                                HttpRequest request;
                                    request.method()  // GET
                                    request.uri()     // /ws
                                    request.protocolVersion() // HTTP/1.1
                                出站：HTTP 对象 → ByteBuf
                                 */

                                // 以块方式写入
                                pipeline.addLast(new ChunkedWriteHandler()); //ChunkedWriteHandler，是 Netty 的一个出站（Outbound）Handler，用来把“无法一次性写完的大数据”拆成多个小块，逐块写入 Socket，避免内存爆炸和 EventLoop 阻塞。
                                pipeline.addLast(new HttpObjectAggregator(65536)); //把多个 HTTP 分段消息，聚合成一个完整的 FullHttpRequest，WebSocket 握手必须是完整 HTTP 请求，为了防止发送异常大小包体，最大聚合大小（64KB），超出就报异常
                                pipeline.addLast(authExecutorGroup, new WebSocketAuthHandler()); //先验证 token(使用32个线程)，后续处理 WebSocket
                                pipeline.addLast(new WebSocketServerProtocolHandler("/ws", null, false, 65536, false, true));
                                /**
                                 * WebSocketServerProtocolHandler是 WebSocket 的“核心 Handler”
                                 * | 功能                  | 是否负责 |
                                 * | ------------------- | ---- |
                                 * | HTTP → WebSocket 升级 | ✅   |
                                 * | 校验路径 `/ws`         | ✅   |
                                 * | 握手响应               | ✅   |
                                 * | Ping / Pong         |  ✅   |
                                 * | Close 帧            |  ✅   |
                                 * | Frame 转换           | ✅   |
                                 * WebSocketServerProtocolHandler 会在握手完成后，
                                 * 自动移除 HttpServerCodec / HttpObjectAggregator。
                                 * 最终 pipeline 变成：
                                 * WebSocketFrame
                                 *  → GameNettyHandler
                                 *
                                 */
                                pipeline.addLast(new GameNettyHandler(userSessionService, gameService,matchService,nettyChannelManager ));
                                /**
                                 * 当网卡收到数据后，内核协议栈将 socket 标记为可读，
                                 * epoll 通过回调把该 socket 放入就绪队列，
                                 * 用户态的 EventLoop 被唤醒后，通过 epoll_wait 获取就绪事件，
                                 * Netty 主动读取 socket 数据并在用户态触发 pipeline，
                                 * pipeline 中的 Handler 依次执行；
                                 * socket 始终保留在 epoll 的监听结构中，直到被显式移除或关闭。
                                 */
                            }
                        });
                ChannelFuture f = b.bind(PORT).sync(); //绑定端口，把异步变为同步
                /**
                 *
                 * 创建 Channel:配置的 NioServerSocketChannel.class，通过反射创建一个新的 Channel 对象
                 * 初始化 Pipeline：把你配置好的 ChildHandler装配到这个 Channel 的流水线上
                 * 注册 EventLoop： 把这个新的 Channel 注册 到 BossGroup 中的某一个 EventLoop 线程上
                 * 执行 Bind（关键）： 注意！真正的 bind 逻辑（调用 JDK 的 java.nio.channels.ServerSocketChannel.bind）是被封装成一个 Task，提交给那个 EventLoop 线程去执行的。
                 */
                f.channel().closeFuture().sync(); //阻塞主线程，确保主线程不退出
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        }).start();
    }
}