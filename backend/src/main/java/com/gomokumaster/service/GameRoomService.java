package com.gomokumaster.service;
import com.gomokumaster.event.GameEvent;
import com.gomokumaster.event.GameEventType;
import com.gomokumaster.event.SetCountDownEvent;
import com.gomokumaster.event.SetDisconnectCountDownEvent;
import com.gomokumaster.model.GameStatus;
import com.gomokumaster.model.Piece;
import com.gomokumaster.model.PieceType;
import com.gomokumaster.model.Player;
import com.gomokumaster.proto.*;
import com.gomokumaster.exception.BusinessException;
import com.gomokumaster.model.*;
import com.gomokumaster.utils.SkillResult;
import org.redisson.api.RBucket;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.TimeUnit;


@Service
//以下设计还没有没有任何并发保护，后面需要完善
public class GameRoomService {
    private RedissonClient redissonClient;
    @Autowired
    public GameRoomService(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }
    @Autowired
    private ApplicationEventPublisher eventPublisher; //使用boot自带的事件发布器
    public void  createRoom(Player p1, Player p2) {
        //创建房间
        String roomId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16);
        GameRoom room = new GameRoom(roomId,p1,p2,new Piece[15][15],p1.getId(), GameStatus.STARTED,null,1,1);
        // 存入 Redis (Redisson 会自动把整个对象序列化成 JSON)
        RBucket<GameRoom> bucket = redissonClient.getBucket("game:room:" + roomId);
        //房间有效期为一个小时
        bucket.set(room, Duration.ofHours(1));
        redissonClient.getBucket("game:location:" + p1.getId())
                .set(roomId, Duration.ofHours(1));
        redissonClient.getBucket("game:location:" + p2.getId())
                .set(roomId, Duration.ofHours(1));
        //  通知黑棋
        //先进行预处理转换吧 Java 实体类 -> Protobuf 类
        GameSnapshot.Builder builder = GameSnapshot.newBuilder();
        // 转换棋盘
        for (int i = 0; i < room.getBoard().length; i++) {
            BoardRow.Builder rowBuilder =  BoardRow.newBuilder();
            for (int j = 0; j < room.getBoard()[i].length; j++) {
                com.gomokumaster.proto.Piece protoPiece = convertPieceToProto(room.getBoard()[i][j]);
                rowBuilder.addPieces(protoPiece);
            }
            builder.addBoard(rowBuilder.build()); //完成build，并且添加进 builder 中
        }

        GameSnapshot blackSnapshot = builder
                .setRoomId(roomId)
                .setYourInfo(convertPlayerToProto(p1))
                .setOpponent(convertPlayerToProto(p2))
                .setStatus(com.gomokumaster.proto.GameStatus.STARTED)
                .setYourColor("black")
                .setLastAction("GAME_STARTED")
                .setCurrentTurnId(room.getCurrentColor())
                .build();

        //构建信封
        GamePacket backPacket = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.MATCH_RES.name()))
                .setGameSnapshot(blackSnapshot)
                .build();
        //发送！
        sendMessage( p1.getId(),backPacket);
        //通知白棋
        GameSnapshot whiteSnapshot = blackSnapshot.toBuilder() //创建一个和 blackSnapshot 一样的对象,避免脏数据风险
                .setRoomId(roomId)
                .setYourInfo(convertPlayerToProto(p2))
                .setOpponent(convertPlayerToProto(p1))
                .setStatus(com.gomokumaster.proto.GameStatus.STARTED)
                .setYourColor("white")
                .setLastAction("GAME_STARTED")
                .setCurrentTurnId(room.getCurrentColor())
                .build();

        GamePacket whitePacket = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.MATCH_RES.name()))
                .setGameSnapshot(whiteSnapshot)
                .build();
        sendMessage(p2.getId(), whitePacket);
        //先发后计时
        eventPublisher.publishEvent(new SetCountDownEvent(roomId, 1,false,room.getRound()));
    }

    //转换棋子方法
    private com.gomokumaster.proto.Piece convertPieceToProto(Piece piece) {
        if (piece == null) {
            return com.gomokumaster.proto.Piece.newBuilder()
                    // 创建一个空的 Piece “对象”
                    .setPieceType(com.gomokumaster.proto.PieceType.EMPTY)
                    .build();
        }
        return com.gomokumaster.proto.Piece.newBuilder()
                .setId(piece.getId())
                .setX(piece.getX())
                .setY(piece.getY())
                .setOwnerId(piece.getOwnerId())
                .setPieceType(com.gomokumaster.proto.PieceType.valueOf(piece.getType().name()))
                .setMaxCd(piece.getMaxCd())
                .setColor(piece.getColor())
                .setIsAlive(piece.isAlive())
                .setSkillCd(piece.getSkillCd())
                .build();
    }

    //转换用户方法
    private com.gomokumaster.proto.Player convertPlayerToProto(Player player) {
        return com.gomokumaster.proto.Player.newBuilder()
                .setId(player.getId())
                .setName(player.getName())
                .setAvatar(player.getAvatar())
                .setColor(player.getCurrentColor())
                .setRemainingShieldCount(player.getRemainingShieldCount())
                .setRemainingArcherCount(player.getRemainingArcherCount())
                .setRemainingCavalryCount(player.getRemainingCavalryCount())
                .build();
    }
    public void processMove(String userId, MoveReq req) {
        try {
            // 先找用房间号找房间(反向索引)
            RBucket<String> locBucket = redissonClient.getBucket("game:location:" + userId);
            String roomId = locBucket.get();
            if (roomId == null) return;
            //禁止多个玩家在同一个时刻进行读写操作,前后端做好双重验证
            RLock lock = redissonClient.getLock("game:lock:" + roomId);
            lock.lock(5, TimeUnit.SECONDS);
            try {
                RBucket<GameRoom> bucket =
                        redissonClient.getBucket("game:room:" + roomId);

                GameRoom room = bucket.get();
                boolean updateNeeded = false; // 是否需要广播更新
                String actionResult = "";// 动作结果
                if (room == null || room.getStatus() != GameStatus.STARTED) {
                    // 游戏不存在
                    GamePacket packet = GamePacket.newBuilder()
                            .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.ERROR.name()))
                            .setNotice(com.gomokumaster.proto.ServerNotice.newBuilder()
                                    .setMessage("游戏不存在或已结束")
                                    .build())
                            .build();
                    sendMessage(userId, packet);
                    return;
                }
                // 分流处理：落子 还是 技能
                if (req.getType().name().equals("PLACE")) {
                    PieceType type = PieceType.valueOf(req.getPieceType());
                    boolean success = room.placePiece(req.getX(), req.getY(), userId, type);
                    System.out.println(success);
                    if (success) {
                        // 广播给两个人：棋盘更新了
                        updateNeeded = true;
                        actionResult = "PLACE_SUCCESS";
                        bucket.set(room, Duration.ofHours(1)); // 更新房间
                        if (room.getStatus() == GameStatus.FINISHED) {
                            broadcastGameOver(room);
                            //游戏记录异步写入数据库
                            //移除房间
                            cleanUpGame(room);
                        }
                    } else {
                        GamePacket packet = GamePacket.newBuilder()
                                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.ERROR.name()))
                                .setNotice(com.gomokumaster.proto.ServerNotice.newBuilder()
                                        .setMessage("落子失败：位置被占或库存不足")
                                        .build())
                                .build();
                        sendMessage(userId, packet);
                    }

                }
                else if ("SKILL".equals(req.getType().name())) {
                    SkillResult result = room.useSkill(req.getX(), req.getY(), req.getTargetX(), req.getTargetY(), userId);

                    if (result.isSuccess()) {
                        updateNeeded = true;
                        actionResult = "SKILL_" + result.getMessage();
                        System.out.println("技能释放成功" + result.getMessage());
                        //切换轮次
                        room.toggleTurn();
                        bucket.set(room,Duration.ofHours(1)); // 更新房间
                    } else {
                        GamePacket packet = GamePacket.newBuilder()
                                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.ERROR.name()))
                                .setNotice(com.gomokumaster.proto.ServerNotice.newBuilder()
                                        .setMessage(result.getMessage())
                                        .build())
                                .build();
                        sendMessage(userId, packet); // 比如 "超出攻击范围"
                    }
                }
                if (updateNeeded) {
                    eventPublisher.publishEvent(new SetCountDownEvent(roomId, room.getCurrentColor(),false,room.getRound()));
                    broadcastGameInfo(room, actionResult);
                }
            } finally {
                lock.unlock();
            }
        } catch (Exception e) {
            throw new BusinessException("不能同时下棋" + e.getMessage());
        }
    }

    private void broadcastGameInfo(GameRoom room, String lastAction) {
        GameSnapshot.Builder builder = GameSnapshot.newBuilder();
        // 转换棋盘
        for (int i = 0; i < room.getBoard().length; i++) {
            BoardRow.Builder rowBuilder =  BoardRow.newBuilder();
            for (int j = 0; j < room.getBoard()[i].length; j++) {
                com.gomokumaster.proto.Piece protoPiece = convertPieceToProto(room.getBoard()[i][j]);
                rowBuilder.addPieces(protoPiece);
            }
            builder.addBoard(rowBuilder.build()); //完成build，并且添加进 builder 中
        }

        GameSnapshot blackSnapshot = builder
                .setRoomId(room.getRoomId())
                .setYourInfo(convertPlayerToProto(room.getBlackPlayer()))
                .setOpponent(convertPlayerToProto(room.getWhitePlayer()))
                .setStatus(com.gomokumaster.proto.GameStatus.valueOf(room.getStatus().name()))
                .setYourColor("black")
                .setLastAction(lastAction)
                .setCurrentTurnId(room.getCurrentColor())
                .build();

        //构建信封
        GamePacket backPacket = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.BOARD_UPDATE.name()))
                .setGameSnapshot(blackSnapshot)
                .build();
        //发送！
        sendMessage(room.getBlackPlayer().getId(), backPacket);
        //通知白棋
        GameSnapshot whiteSnapshot = blackSnapshot.toBuilder()
                .setRoomId(room.getRoomId())
                .setYourInfo(convertPlayerToProto(room.getWhitePlayer()))
                .setOpponent(convertPlayerToProto(room.getBlackPlayer()))
                .setStatus(com.gomokumaster.proto.GameStatus.valueOf(room.getStatus().name()))
                .setYourColor("white")
                .setLastAction(lastAction)
                .setCurrentTurnId(room.getCurrentColor())
                .build();

        GamePacket whitePacket = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.BOARD_UPDATE.name()))
                .setGameSnapshot(whiteSnapshot)
                .build();
        sendMessage(room.getWhitePlayer().getId(), whitePacket);
    }
//    private void broadcastSkillEffect(GameRoom room, MoveReq req, SkillResult result) {
//        // 这里把 result.getEffect() 转换成简单的二维数组DTO 发给前端
//        // 前端收到后，根据 result.getEffect() 播放技能动画
//         sendMessage(room.getBlackPlayer().getId(), "SKILL_EFFECT", result.getEffect());
//         sendMessage(room.getWhitePlayer().getId(), "SKILL_EFFECT", result.getEffect());
//    }

    private void broadcastGameOver(GameRoom room){
        //先更新棋盘，后更新胜利
        GamePacket packet = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.GAME_OVER.name()))
                .setWinnerId(room.getWinnerId())
                .build();
        sendMessage(room.getBlackPlayer().getId(), packet);
        sendMessage(room.getWhitePlayer().getId(), packet);

    }

    // 发送消息
    public void  sendMessage(String userId, GamePacket data) {
        eventPublisher.publishEvent(new GameEvent(userId, GameEventType.SEND_MESSAGE, data));
    }

    private void cleanUpGame(GameRoom room) {
        String roomId = room.getRoomId();
        //  删除房间本身
        redissonClient
                .getBucket("game:room:" + roomId)
                .delete();
        //清理玩家位置索引
        if (room.getBlackPlayer() != null) {
            redissonClient
                    .getBucket("game:location:" + room.getBlackPlayer().getId())
                    .delete();
        }

        if (room.getWhitePlayer() != null) {
            redissonClient
                    .getBucket("game:location:" + room.getWhitePlayer().getId())
                    .delete();
        }
    }
    // 判断用户是否在游戏中
    public boolean isInGame(String userId){
        RBucket<String> bucket1 = redissonClient.getBucket("game:location:" + userId);
        String roomId = bucket1.get();
        if (roomId == null){
            return false;
        }
        return true;
    }
    // 查找用户在哪个房间
    public void reBackToRoom(String userId) {
        if (userId == null) return;
        RBucket<String> bucket1 = redissonClient.getBucket("game:location:" + userId);
        String roomId = bucket1.get();
        if (roomId == null){
            return;
        }
        RLock lock = redissonClient.getLock("game:lock:" + roomId);
        lock.lock(5, TimeUnit.SECONDS);
        try {
            RBucket<GameRoom> bucket = redissonClient.getBucket("game:room:" + roomId);
            GameRoom room = bucket.get();
            System.out.println("用户回到房间：" + roomId);
            if (room != null && room.getStatus() == GameStatus.PAUSED) {
                eventPublisher.publishEvent(new SetDisconnectCountDownEvent(roomId,room.getCurrentColor() ,true, room.getRound()));
                eventPublisher.publishEvent(new SetCountDownEvent(roomId,room.getCurrentColor() ,false,room.getRound()));
                room.setStatus(GameStatus.STARTED);
                Player p1 = room.getBlackPlayer();
                Player p2 = room.getWhitePlayer();
                p1.setIsConnected(true);
                p2.setIsConnected(true);
                bucket.set(room,Duration.ofHours(1));
                String blackId = p1.getId();
                String whiteId = p2.getId();
                GameSnapshot.Builder builder = GameSnapshot.newBuilder();
                // 转换棋盘
                for (int i = 0; i < room.getBoard().length; i++) {
                    BoardRow.Builder rowBuilder =  BoardRow.newBuilder();
                    for (int j = 0; j < room.getBoard()[i].length; j++) {
                        com.gomokumaster.proto.Piece protoPiece = convertPieceToProto(room.getBoard()[i][j]);
                        rowBuilder.addPieces(protoPiece);
                    }
                    builder.addBoard(rowBuilder.build()); //完成build，并且添加进 builder 中
                }
                    GameSnapshot blackSnapshot = builder
                            .setRoomId(room.getRoomId())
                            .setYourInfo(convertPlayerToProto(room.getBlackPlayer()))
                            .setOpponent(convertPlayerToProto(room.getWhitePlayer()))
                            .setStatus(com.gomokumaster.proto.GameStatus.valueOf(room.getStatus().name()))
                            .setYourColor("black")
                            .setLastAction("BLACK_BACK")
                            .setCurrentTurnId(room.getCurrentColor())
                            .build();
                    GamePacket backPacket = GamePacket.newBuilder()
                            .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.GAME_RESUME.name()))
                            .setGameSnapshot(blackSnapshot)
                            .build();
                    sendMessage(room.getBlackPlayer().getId(), backPacket);
                    GameSnapshot whiteSnapshot = builder
                            .setRoomId(room.getRoomId())
                            .setYourInfo(convertPlayerToProto(room.getWhitePlayer()))
                            .setOpponent(convertPlayerToProto(room.getBlackPlayer()))
                            .setStatus(com.gomokumaster.proto.GameStatus.valueOf(room.getStatus().name()))
                            .setYourColor("white")
                            .setLastAction("WHITE_BACK")
                            .setCurrentTurnId(room.getCurrentColor())
                            .build();

                    GamePacket whitePacket = GamePacket.newBuilder()
                            .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.GAME_RESUME.name()))
                            .setGameSnapshot(whiteSnapshot)
                            .build();
                    sendMessage(room.getWhitePlayer().getId(), whitePacket);
            } else {
                // 添加room为null的处理
                if (room == null) {
                    GamePacket packet = GamePacket.newBuilder()
                            .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.ERROR.name()))
                            .setNotice(com.gomokumaster.proto.ServerNotice.newBuilder().setMessage("房间不存在").build())
                            .build();
                    sendMessage(userId, packet);
                }
            }
        } finally {
            lock.unlock();
        }

    }

    public void chat(String userId, ChatReq chatResp) {
        RBucket<String> bucket1 = redissonClient.getBucket("game:location:" + userId);
        String roomId = bucket1.get();
        try {
            chatResp = chatResp.toBuilder()
                    .setId(UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .build();
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }
        if (roomId == null) return;
        RBucket<GameRoom> bucket = redissonClient.getBucket("game:room:" + roomId);
        GameRoom room = bucket.get();
        GamePacket blackPacket = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.CHAT_RES.name()))
                .setChatReq(chatResp)
                .build();
        GamePacket whitePacket = GamePacket.newBuilder()
                .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.CHAT_RES.name()))
                .setChatReq(chatResp)
                .build();
        sendMessage(room.getWhitePlayer().getId(), whitePacket);
        sendMessage(room.getBlackPlayer().getId(), blackPacket);
    }

    public void surrender(String userId) {
        // 找到该用户所在的房间
        RBucket<String> bucket1 = redissonClient.getBucket("game:location:" + userId);
        String roomId = bucket1.get();
        RLock lock = redissonClient.getLock("game:lock:" + roomId);
        lock.lock(5, TimeUnit.SECONDS);
        try {
            if (roomId == null) return;
            RBucket<GameRoom> bucket = redissonClient.getBucket("game:room:" + roomId);
            GameRoom room = bucket.get();
            if (room != null) {
                Player opponent = room.getBlackPlayer().getId().equals(userId) ? room.getWhitePlayer() : room.getBlackPlayer();
                room.setWinnerId(opponent.getId());
                room.setStatus(GameStatus.FINISHED);
                broadcastGameOver(room);
                cleanUpGame(room);
            }
        } finally {
            lock.unlock();
        }

    }
    // 用户断线
    public void disconnect(String userId){

        RBucket<String>  bucket = redissonClient.getBucket("game:location:" + userId);
        String roomId = bucket.get();
        if (roomId == null) return;
        RLock lock = redissonClient.getLock("game:lock:" + roomId);
        lock.lock();
        try {
            RBucket<GameRoom> bucket1 = redissonClient.getBucket("game:room:" + roomId);
            GameRoom room  = bucket1.get();
            if (room != null){
                System.out.println("用户" + userId + "断线...,游戏暂停");
                room.setStatus(GameStatus.PAUSED);
                Player currentPlayer = room.getWhitePlayer().getId().equals(userId) ? room.getWhitePlayer() : room.getBlackPlayer() ;
                currentPlayer.setIsConnected(false);
                if (!room.getWhitePlayer().getIsConnected() && !room.getBlackPlayer().getIsConnected()){
                    cleanUpGame(room);
                    return;
                }
                Player opponent = room.getBlackPlayer().getId().equals(userId) ? room.getWhitePlayer() : room.getBlackPlayer() ;
                bucket1.set(room,Duration.ofHours(1));
                eventPublisher.publishEvent(new SetDisconnectCountDownEvent(roomId,room.getCurrentColor() ,false, room.getRound()));
                eventPublisher.publishEvent(new SetCountDownEvent(roomId,room.getCurrentColor(), true, room.getRound()));
                GamePacket packet = GamePacket.newBuilder()
                        .setType(com.gomokumaster.proto.MsgType.valueOf(MessageType.GAME_DISCONNECT.name()))
                        .setOpponentColor(opponent.getCurrentColor())
                        .build();
                //发送给对手
                sendMessage(opponent.getId(), packet);
            }
        } finally {
            lock.unlock();
        }
    }


    // 处理落子超时
    public void handleTurnTimeout(String roomId, int turnColor, int version){
        RBucket<GameRoom> bucket = redissonClient.getBucket("game:room:" + roomId);
        RLock lock = redissonClient.getLock("game:lock:" + roomId);
        lock.lock(10, TimeUnit.SECONDS); //设置10秒，怕网络堵塞或者其他原因导致提前解锁
        try{

            GameRoom room = bucket.get();
            System.out.println("处理落子超时,开启自动下棋");
            if (room == null) return;
            if (room.getRound() !=  version) return; // 版本号不一致
            int count= 0;
            while (true){
                if(room.getCurrentColor() == turnColor && room.placePiece((int)(Math.random() * 15), (int)(Math.random() * 15), room.getCurrentTurnPlayerId(), PieceType.NORMAL) ){
                    bucket.set(room,Duration.ofHours(1));
                    broadcastGameInfo(room, "TURN_TIMEOUT");
                    eventPublisher.publishEvent(new SetCountDownEvent(roomId, room.getCurrentColor(), false, room.getRound()));
                    break;
                }
                if (count >= 100){
                    GamePacket packet = GamePacket.newBuilder()
                            .setType(MsgType.ERROR)
                            .setNotice(ServerNotice.newBuilder().setMessage("自动下棋失败").build())
                            .build();
                    if (turnColor == 1){
                        sendMessage(room.getBlackPlayer().getId(), packet);
                    } else if (turnColor == 2){
                        sendMessage(room.getWhitePlayer().getId(), packet);
                    }
                    break;
                }
                count++;
            }
        } finally {
            lock.unlock();
        }
    }
    // 处理掉线超时处理
    public void handleDisconnectTimeout(String roomId, int turnColor, int version) {
        RBucket<GameRoom> bucket = redissonClient.getBucket("game:room:" + roomId);
        RLock lock = redissonClient.getLock("game:lock:" + roomId);
        lock.lock(10, TimeUnit.SECONDS);
        try {
            GameRoom room = bucket.get();
            if (room == null) return;
            if (room.getRound() != version) return; // 版本号不一致,直接抛出
            Player opponent = room.getBlackPlayer().getCurrentColor() == turnColor ? room.getWhitePlayer() : room.getBlackPlayer();
            room.setWinnerId(opponent.getId());
            room.setStatus(GameStatus.FINISHED);
            broadcastGameOver(room);
            cleanUpGame(room);
        } finally {
            lock.unlock();
        }
    }
}

