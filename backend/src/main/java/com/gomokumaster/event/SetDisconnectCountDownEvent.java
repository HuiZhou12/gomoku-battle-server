package com.gomokumaster.event;

public record SetDisconnectCountDownEvent(String roomId, int currentTurnNumber, boolean isPause, int version) {
}
