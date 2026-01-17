package com.gomokumaster.event;

import lombok.Data;

import java.io.Serializable;

@Data
public class GameTask implements Serializable {
    private String roomId;
    private int turnNumber; //当前玩家
    private String type;   // "MOVE_TIMEOUT" (落子超时) 或 "DISCONNECT_TIMEOUT" (掉线超时)
    private String data;
    private int version; //判断是否过期

}