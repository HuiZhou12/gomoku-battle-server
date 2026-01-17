//package com.gomokumaster.controller;
//
//import com.gomokumaster.event.GameEvent;
//import com.gomokumaster.exception.BusinessException;
//import com.gomokumaster.proto.GamePacket;
//import com.gomokumaster.service.GameRoomService;
//import com.gomokumaster.service.MatchService;
//import com.gomokumaster.service.UserSessionService;
//import io.micrometer.common.lang.NonNull;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.event.EventListener;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.BinaryMessage;
//import org.springframework.web.socket.CloseStatus;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.AbstractWebSocketHandler;
//
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//
//@Component
//public class NewGameWebsocketHandler extends AbstractWebSocketHandler {
//    @Autowired
//    private UserSessionService userSessionService;
//    @Autowired
//    private MatchService matchService;
//    @Autowired
//    private GameRoomService gameService;
//    // 用来存放所有活跃的 Session，Key是 userId，Value是 Session
//    static final Map<String, WebSocketSession> USER_SESSIONS = new ConcurrentHashMap<>();
//    @Override
//    protected void handleBinaryMessage (
//            @NonNull WebSocketSession session,
//            @NonNull BinaryMessage message) throws Exception {
//       try{
//           //获得字节数组
//           byte[] bytes = message.getPayload().array();
//           //序列化！吧二进制转换成对象
//           GamePacket packet = GamePacket.parseFrom(bytes);
//           String userId = session.getAttributes().get("userId").toString();
//           System.out.println("收到用户: " + userId + " 的指令: " + packet.getType());
//           switch (packet.getType().name()) {
//               case "MATCH_REQ":
//                   matchService.addToQueue(userId);
//                   break;
//               case "MOVE_REQ":
//                   gameService.processMove(userId, packet.getMoveReq());
//                   break;
//               case "CHAT_REQ":
//                   gameService.chat(userId, packet.getChatReq());
//                   break;
//               case "MATCH_CANCEL":
//                   // 取消匹配逻辑
//                   matchService.removeFromQueue(userId);
//                   break;
//               case "CONNECT":
//                   // 连接逻辑,如果已经连接过了，则返回
//                   if (USER_SESSIONS.containsKey(userId)){
//                       return;
//                   }
//                   userSessionService.saveUserSession(userId);
//                   USER_SESSIONS.put(userId, session);
//                   if (gameService.isInGame(userId)) {
//                       gameService.reBackToRoom(userId);
//                   }
//                   break;
//               case "SURRENDER":
//                   gameService.surrender(userId);
//                   break;
//               case "HEARTBEAT":
//                    userSessionService.handleHeartbeat(userId,session);
//                    break;
//               default:
//                   System.out.println("未知指令: " + packet.getType());
//           }
//       } catch (Exception e){
//           throw new BusinessException(e.getMessage());
//       }
//    }
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        String userId = session.getAttributes().get("userId").toString();
//        if (userId != null) {
//            USER_SESSIONS.remove(userId);
//            userSessionService.removeUserSession(userId);
//            gameService.disconnect(userId);
//            System.out.println("用户下线: " + userId);
//        }
//    }
//    // 辅助方法：给指定用户发消息
//    public void sendMessageToUser(String userId, GamePacket packetMessage) {
//        WebSocketSession session = USER_SESSIONS.get(userId);
//        if (session != null && session.isOpen()) {
//            try {
//                // 序列化,启动！
//                byte[] bytes = packetMessage.toByteArray();
//                session.sendMessage(new BinaryMessage(bytes));
//            } catch (Exception e) {
//                throw  new BusinessException(e.getMessage());
//            }
//        }
//    }
//    // 监听事件
//    @EventListener
//    public void handleSendEvent(GameEvent event) {
//        sendMessageToUser(event.userId(), event.packet());
//    }
//}
