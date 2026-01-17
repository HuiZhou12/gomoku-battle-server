package com.gomokumaster.service;

public interface GameService {
    void startMatching(Long userId);
    void createGame(Long blackId,Long whiteId);
    void sendMessage(Long userId, String type, Object data);
}
