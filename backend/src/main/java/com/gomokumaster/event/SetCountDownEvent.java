package com.gomokumaster.event;

public record SetCountDownEvent(String roomId, int currentTurnNumber, boolean isPause, int version) {
}
