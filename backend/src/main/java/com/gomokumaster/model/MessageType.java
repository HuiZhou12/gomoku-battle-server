package com.gomokumaster.model;


public enum MessageType {
    UNKNOWN,
    MATCH_REQ,       // 客户端请求匹配
    MATCH_CANCEL,   // 客户端取消匹配
    MATCH_RES,      // 服务端响应匹配成功
    MOVE_REQ,        // 客户端请求落子/技能
    BOARD_UPDATE,     // 服务端广播棋盘更新
    GAME_OVER,     // 游戏结束
    CHAT_REQ,       // 聊天请求
    CHAT_RES,       // 聊天广播
    ERROR,          // 错误消息
    GAME_RESUME,     // 用户重连
    SURRENDER,      // 用户投降
    GAME_DISCONNECT,      // 用户断线

}
