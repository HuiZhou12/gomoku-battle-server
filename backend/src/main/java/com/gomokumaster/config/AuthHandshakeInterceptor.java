//package com.gomokumaster.config;
//
//import com.gomokumaster.exception.BusinessException;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//
//
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.http.server.ServletServerHttpRequest;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.WebSocketHandler;
//import java.util.Map;
//import com.gomokumaster.utils.JwtUtils;
//
///**
// * 握手拦截器：在连接建立之前执行
// * 作用：从 URL 参数中提取 token，验证身份，把 userId 存入 session 属性
// */
//@Component
//public class AuthHandshakeInterceptor implements HandshakeInterceptor {
//
//    @Override
//    //
//    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
//                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
//        if (request instanceof ServletServerHttpRequest) {
//            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
//            //获取 URL 中的 token 参数
//            String token = servletRequest.getServletRequest().getParameter("token");
//
//            if (token == null || token.isEmpty()) {
//                System.out.println("握手失败：未携带Token");
//                return false;
//            }
//
//            // 验证 Token
//            try {
//                Long userId = JwtUtils.getUserIdFromToken(token);
//
//                if (userId != null) {
//                    attributes.put("userId", userId);
//                    System.out.println("用户 " + userId + " 握手成功");
//                    return true;
//                }
//            } catch (Exception e) {
//                throw new BusinessException("Token验证失败: " + e.getMessage());
//            }
//        }
//        return false;
//    }
//
//    @Override
//    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
//                               WebSocketHandler wsHandler, Exception exception) {
//    }
//}
