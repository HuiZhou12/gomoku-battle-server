package com.gomokumaster.manager;

import com.gomokumaster.model.GameRoom;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Data
public class GameManager {
    private final Map<String, GameRoom> activeGames = new ConcurrentHashMap<>();
    //创建房间
    public void createGame(GameRoom game) {
        activeGames.put(game.getRoomId(), game);
    }
    //获取房间
    public GameRoom getGame(String roomId) {
        return activeGames.get(roomId);
    }

    //删除房间（当游戏结束后，写入Mysql后调用）
    public void deleteGame(String roomId) {
        activeGames.remove(roomId);
    }
}
