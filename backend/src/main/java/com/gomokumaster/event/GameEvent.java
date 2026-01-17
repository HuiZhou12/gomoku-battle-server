package com.gomokumaster.event;

import com.gomokumaster.proto.GamePacket;
/**
 * @param type   事件类型
 * @param packet protobuf包
 */

public record GameEvent(String userId, GameEventType type, GamePacket packet) {
}