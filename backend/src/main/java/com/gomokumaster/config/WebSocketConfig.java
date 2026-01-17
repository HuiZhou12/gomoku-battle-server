//package com.gomokumaster.config;
//
//import com.gomokumaster.controller.NewGameWebsocketHandler;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.config.annotation.*;
//
//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    private NewGameWebsocketHandler gameWebSocketHandler;
//
//    private AuthHandshakeInterceptor authHandshakeInterceptor;
//
//    @Autowired
//    public WebSocketConfig(NewGameWebsocketHandler gameWebSocketHandler, AuthHandshakeInterceptor authHandshakeInterceptor) {
//        this.gameWebSocketHandler = gameWebSocketHandler;
//        this.authHandshakeInterceptor = authHandshakeInterceptor;
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(gameWebSocketHandler, "/ws") // 路径是 ws://localhost:8080/ws
//                .addInterceptors(authHandshakeInterceptor) // 挂载鉴权拦截器
//                .setAllowedOrigins("*"); // 允许跨域
//    }
//}
//
