package com.gomokumaster.service;

import com.gomokumaster.entity.User;

public interface UserService {
    User register (String username, String password);
    String login (String username, String password);
    User getUserInfo (String userId);
    String getUserIdByToken(String token);
    boolean logout(String token);
    String generateToken(String userId, String username);
}
