//package com.gomokumaster.service.impl;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.gomokumaster.controller.GameWebSocketHandler;
//import com.gomokumaster.dto.req.MoveReq;
//import com.gomokumaster.dto.resp.ChatResp;
//import com.gomokumaster.dto.resp.GameInfoResp;
//import com.gomokumaster.dto.resp.MatchResp;
//import com.gomokumaster.entity.User;
//import com.gomokumaster.manager.GameManager;
//import com.gomokumaster.mapper.UserMapper;
//import com.gomokumaster.model.*;
//import com.gomokumaster.service.GameService;
//import com.gomokumaster.utils.SkillResult;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Lazy;
//import org.springframework.stereotype.Service;
//
//
//import java.util.LinkedList;
//import java.util.Map;
//import java.util.Queue;
//import java.util.UUID;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//public class GameServiceImpl  implements GameService {
//    @Autowired
//    private GameManager gameManager;
//    @Autowired
//    private UserMapper userMapper;
//    @Autowired
//    @Lazy //出现了两个bean对象互相引用的情况，这里暂时懒加载
//    private GameWebSocketHandler webSocketHandler;
//
//    /**
//     * ObjectMapper 的作用
//     * Java 对象 ⇄ JSON 字符串
//     * String json = objectMapper.writeValueAsString(obj);
//     * MyDto dto = objectMapper.readValue(json, MyDto.class);
//     */
//    private final ObjectMapper objectMapper = new ObjectMapper();
//    private final Queue<Long> matchingQueue = new LinkedList<>();
//    private final Map<Long, String> userRoomMap = new ConcurrentHashMap<>();
//
//    @Override
//    //开始匹配
//    public void startMatching(Long userId) {
//        System.out.println("用户 " + userId + " 开始匹配...");
//        //防止重复加入
//        if (matchingQueue.contains(userId)){
//            return;
//        }
//        //检查队列有没有人
//        /**
//         * poll() 的意思是：
//         * 从队列里“取出并删除队头元素”，
//         * 如果队列是空的，返回 null。
//         */
//        Long opponentId = matchingQueue.poll();
//        if (opponentId == null) {
//            // 没人？自己进去等...
//            matchingQueue.offer(userId);
//            sendMessage(userId, "status", "正在匹配中，请稍候...");
//        } else {
//            // 有人？直接启动！
//            createGame(opponentId, userId);
//        }
//
//    }
//    public void stopMatching(Long userId) {
//        System.out.println("用户 " + userId + " 中断匹配...");
//        matchingQueue.remove(userId);
//        sendMessage(userId, "status", "已取消匹配");
//    }
//
//    @Override
//    public void createGame(Long blackId, Long whiteId) {
//        System.out.println("匹配成功: " + blackId + " vs " + whiteId);
//        //创建玩家对象
//        User blackUser = userMapper.getUserInfo(blackId);
//        Player p1 = new Player(blackId, blackUser.getUsername(), blackUser.getAvatar(), 5, 5, 5);
//        User whiteUser = userMapper.getUserInfo(whiteId);
//        Player p2 = new Player(whiteId, whiteUser.getUsername(), whiteUser.getAvatar(), 5, 5, 5);
//
//        //创建房间
//        String roomId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16);
//        GameRoom room = new GameRoom(roomId,p1,p2,new Piece[19][19],blackId, GameStatus.STARTED,null,1);
//
//        //转入内存中
//        gameManager.createGame(room);
//        //添加到游戏房间队列中
//        userRoomMap.put(blackId, roomId);
//        userRoomMap.put(whiteId, roomId);
//
//        //  通知黑棋
//        MatchResp resp1 = MatchResp.builder()
//                .matchId(room.getRoomId())
//                .board(room.getBoard())
//                .opponent(p2)
//                .yourColor("black")
//                .yourInfo(p1)
//                .state(room.getStatus().name())
//                .currentTurnId(room.getCurrentColor())
//                .build();
//        sendMessage(blackId, "MATCH_SUCCESS", resp1);
//
//        //通知白棋
//        MatchResp resp2 = MatchResp.builder()
//                .matchId(room.getRoomId())
//                .board(room.getBoard())
//                .opponent(p1)
//                .yourColor("white")
//                .yourInfo(p2)
//                .state(room.getStatus().name())
//                .currentTurnId(room.getCurrentColor())
//                .build();
//        sendMessage(whiteId, "MATCH_SUCCESS", resp2);
//
//    }
//
//
//
//    // 在 Service 接口里定义，实现类里实现
//    public void processMove(Long userId, String dataJson) {
//        try {
//            MoveReq req = objectMapper.readValue(dataJson, MoveReq.class);
//            // 先找用房间号找房间
//            String roomId = userRoomMap.get(userId);
//            if (roomId == null) return;
//            GameRoom room = gameManager.getGame(roomId);
//            boolean updateNeeded = false; // 是否需要广播更新
//            String actionResult = "";// 动作结果
//            if (room == null || room.getStatus() != GameStatus.STARTED) {
//                sendMessage(userId, "ERROR", "游戏不存在或已结束");
//                return;
//            }
//
//            // 分流处理：落子 还是 技能
//            if ("PLACE".equals(req.getType())) {
//                PieceType type = PieceType.valueOf(req.getPieceType());
//                boolean success = room.placePiece(req.getX(), req.getY(), userId, type);
//
//                if (success) {
//                    // 广播给两个人：棋盘更新了
//                    updateNeeded = true;
//                    actionResult = "PLACE_SUCCESS";
//                    if (room.getStatus() == GameStatus.FINISHED) {
//                        broadcastGameOver(room);
//                        //游戏记录异步写入数据库
//                        //移除房间
//                        cleanUpGame(room);
//                    }
//                } else {
//                    sendMessage(userId, "ERROR", "落子失败：位置被占或库存不足");
//                }
//            }
//            else if ("SKILL".equals(req.getType())) {
//                SkillResult result = room.useSkill(req.getX(), req.getY(), req.getTargetX(), req.getTargetY(), userId);
//
//                if (result.isSuccess()) {
//                    updateNeeded = true;
//                    actionResult = "SKILL_" + result.getMessage();
//                    //切换轮次
//                    room.toggleTurn();
//                } else {
//                    sendMessage(userId, "ERROR", result.getMessage()); // 比如 "超出攻击范围"
//                }
//            }
//            if (updateNeeded){
//                broadcastGameInfo(room, actionResult);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//
//
//    private void broadcastGameInfo(GameRoom room, String lastAction) {
//        MatchResp blackResp = MatchResp.builder()
//                .matchId(room.getRoomId())
//                .board(room.getBoard())
//                .currentTurnId(room.getCurrentColor())
//                .yourInfo(room.getBlackPlayer()) // 包含了剩余库存
//                .opponent(room.getWhitePlayer())
//                .yourColor("black")
//                .state(room.getStatus().name())
//                .lastAction(lastAction)
//                .build();
//        MatchResp whiteResp = MatchResp.builder()
//                .matchId(room.getRoomId())
//                .board(room.getBoard())
//                .currentTurnId(room.getCurrentColor())
//                .opponent(room.getBlackPlayer()) // 包含了剩余库存
//                .yourInfo(room.getWhitePlayer())
//                .yourColor("white")
//                .state(room.getStatus().name())
//                .lastAction(lastAction)
//                .build();
//        sendMessage(room.getBlackPlayer().getId(), "BOARD_UPDATE", blackResp);
//        sendMessage(room.getWhitePlayer().getId(), "BOARD_UPDATE", whiteResp);
//    }
////    private void broadcastSkillEffect(GameRoom room, MoveReq req, SkillResult result) {
////        // 这里把 result.getEffect() 转换成简单的二维数组DTO 发给前端
////        // 前端收到后，根据 result.getEffect() 播放技能动画
////         sendMessage(room.getBlackPlayer().getId(), "SKILL_EFFECT", result.getEffect());
////         sendMessage(room.getWhitePlayer().getId(), "SKILL_EFFECT", result.getEffect());
////    }
//
//    private void broadcastGameOver(GameRoom room){
//        //先更新棋盘，后更新胜利
//        sendMessage(room.getBlackPlayer().getId(), "GAME_OVER", room.getWinnerId());
//        sendMessage(room.getWhitePlayer().getId(), "GAME_OVER", room.getWinnerId());
//
//    }
//
//
//    @Override
//// 辅助发送方法
//    public void sendMessage(Long userId, String type, Object data) {
//        try {
//            String json = objectMapper.writeValueAsString(data);
//            // 保持统一格式
//            String finalMsg = String.format("{\"type\":\"%s\", \"data\":%s}", type, json);
//            webSocketHandler.sendMessageToUser(userId, finalMsg);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//    }
//
//    private void cleanUpGame(GameRoom room) {
//        // 清理黑白双方
//        if (room.getBlackPlayer() != null) {
//            userRoomMap.remove(room.getBlackPlayer().getId());
//        }
//        if (room.getWhitePlayer() != null) {
//            userRoomMap.remove(room.getWhitePlayer().getId());
//        }
//        // 从内存管理器中移除房间
//        gameManager.deleteGame(room.getRoomId());
//
//    }
//    // 判断用户是否在游戏中
//    public boolean isInGame(Long userId){
//        if (userRoomMap.containsKey(userId)){
//            return true;
//        }
//        return false;
//    }
//    // 查找用户在哪个房间
//// 修复后的reBackToRoom方法
//    public void reBackToRoom(Long userId) {
//        GameRoom room = gameManager.getGame(userRoomMap.get(userId));
//        System.out.println("用户回到房间：" + room.getRoomId());
//        if (room != null && room.getStatus() == GameStatus.STARTED) {
//            Player p1 = room.getBlackPlayer();
//            Player p2 = room.getWhitePlayer();
//            Long blackId = p1.getId();
//            Long whiteId = p2.getId();
//
//            // 判断当前用户是白棋还是黑棋
//            if (userId.equals(blackId)) {
//                MatchResp resp = MatchResp.builder()
//                        .matchId(room.getRoomId())
//                        .board(room.getBoard())
//                        .currentTurnId(room.getCurrentColor())
//                        .yourInfo(room.getBlackPlayer()) // 包含了剩余库存
//                        .opponent(room.getWhitePlayer())
//                        .yourColor("black")
//                        .state(room.getStatus().name())
//                        .build();
//                sendMessage(blackId, "GAME_RESUME", resp);
//            } else if (userId.equals(whiteId)) {
//                MatchResp resp = MatchResp.builder()
//                        .matchId(room.getRoomId())
//                        .board(room.getBoard())
//                        .currentTurnId(room.getCurrentColor())
//                        .opponent(room.getBlackPlayer()) // 包含了剩余库存
//                        .yourInfo(room.getWhitePlayer())
//                        .yourColor("white")
//                        .state(room.getStatus().name())
//                        .build();
//                sendMessage(whiteId, "GAME_RESUME", resp);
//            }
//        } else {
//            // 添加room为null的处理
//            if (room == null) {
//                sendMessage(userId, "ERROR", "房间不存在");
//            }
//        }
//    }
//
//    public void chat(Long userId, String dataJson) {
//        String roomId = userRoomMap.get(userId);
//        ChatResp chatResp = null;
//        try {
//            chatResp = objectMapper.readValue(dataJson, ChatResp.class);
//            chatResp.setId(UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16));
//        } catch (JsonProcessingException e) {
//            throw new RuntimeException(e);
//        }
//        if (roomId == null) return;
//        GameRoom room = gameManager.getGame(roomId);
//        sendMessage(room.getBlackPlayer().getId(), "CHAT", chatResp);
//        sendMessage(room.getWhitePlayer().getId(), "CHAT", chatResp);
//    }
//
//    public void surrender(Long userId) {
//        // 找到该用户所在的房间
//        String roomId = userRoomMap.get(userId);
//        if (roomId == null) return;
//        GameRoom room = gameManager.getGame(roomId);
//        if (room != null) {
//            // 修复：将基本类型转换为包装类型进行比较
//            Player opponent = room.getBlackPlayer().getId().equals(userId) ? room.getWhitePlayer() : room.getBlackPlayer();
//            room.setWinnerId(opponent.getId());
//            room.setStatus(GameStatus.FINISHED);
//            broadcastGameOver(room);
//            cleanUpGame(room);
//        }
//    }
//    }
//
