//package com.gomokumaster.controller;
//
//import com.gomokumaster.manager.GameManager;
//import com.gomokumaster.service.GameRoomService;
//import com.gomokumaster.service.MatchService;
//import com.gomokumaster.service.UserSessionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.JsonNode;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Component
//public class GameWebSocketHandler extends TextWebSocketHandler {
//    @Autowired
//    private UserSessionService userSessionService;
//    @Autowired
//    private MatchService matchService;
//    @Autowired
//    private GameRoomService gameService;
//    // 用来存放所有活跃的 Session，Key是 userId，Value是 Session
//    // 这样我们想给谁发消息，查这个表就行
//    static final Map<String, WebSocketSession> USER_SESSIONS = new ConcurrentHashMap<>();
//    // JSON 工具
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    /**
//     * 收到前端消息时触发
//     * 格式约定: { "type": "MATCH_MATCHING", "data": { ... } }
//     */
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String userId = session.getAttributes().get("userId").toString();
//        String payload = message.getPayload();
//        System.out.println("收到用户 " + userId + " 的消息: " + payload);
//
//
//        // 解析 JSON
//        JsonNode node = objectMapper.readTree(payload);
//        String type = node.get("type").asText();
//
//        System.out.println("指令: " + type);
//        switch (type) {
//            case "MATCH":
//                matchService.addToQueue(userId);
//                break;
//            case "MOVE":
//                gameService.processMove(userId, node.get("data").toString());
//                break;
//            case "CHAT":
//                gameService.chat(userId, node.get("data").toString());
//                break;
//            case "CANCEL":
//                // 取消匹配逻辑
//                matchService.removeFromQueue(userId);
//                break;
//            case "CONNECT":
//                USER_SESSIONS.put(userId, session);
//                userSessionService.saveUserSession(userId);
//                if (gameService.isInGame(userId)) {
//                    gameService.reBackToRoom(userId);
//                }
//                break;
//            case "SURRENDER":
//                gameService.surrender(userId);
//                break;
//            default:
//                System.out.println("未知指令: " + type);
//        }
//    }
//    /**
//     * 连接关闭后触发
//     */
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        String userId = session.getAttributes().get("userId").toString();
//        if (userId != null) {
//            USER_SESSIONS.remove(userId);
//            userSessionService.removeUserSession(userId);
//            System.out.println("用户下线: " + userId);
//        }
//    }
//    // 辅助方法：给指定用户发消息
//    public void sendMessageToUser(String userId, String jsonMsg) {
//        WebSocketSession session = USER_SESSIONS.get(userId);
//        if (session != null && session.isOpen()) {
//            try {
//                session.sendMessage(new TextMessage(jsonMsg));
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//        }
//    }
//}
