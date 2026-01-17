package com.gomokumaster.controller;

import com.gomokumaster.entity.User;
import com.gomokumaster.exception.BusinessException;
import com.gomokumaster.service.impl.UserServiceImpl;
import com.gomokumaster.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    private UserServiceImpl userServiceImpl;
    @Autowired
    public void UserService(UserServiceImpl userServiceImpl){
        this.userServiceImpl = userServiceImpl;
    }
    //用户注册
    @PostMapping("/api/register")
    public Result register(@RequestBody Map<String, String> request) {
        try {
            //验证信息是否有效
            String email = request.get("email");
            String password = request.get("password");
            if (email == null || password == null) {
                return Result.error("用户名和密码不能为空");
            }
            Object user = userServiceImpl.register(email, password);
            return Result.success(user);
        } catch (RuntimeException e) {
            throw new BusinessException(e.getMessage());
        }
    }
    //用户登录
    @PostMapping("/api/login")
    public Result login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            if (email == null || password == null) {
                return Result.error("用户名和密码不能为空");
            }
            String token = userServiceImpl.login(email, password);
            if (token == null){
                return Result.error("用户名或密码错误");
            }
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            String userId = userServiceImpl.getUserIdByToken(token);
            responseData.put("userinfo", userServiceImpl.getUserInfo(userId));
            return Result.success(responseData);
        } catch (RuntimeException e) {
            throw new BusinessException(e.getMessage());
        }
    }

    @GetMapping("/api/user/profile")
    public Result getCurrentUserProfile(@RequestHeader("Authorization") String token) {
        try {
            //验证token有效性
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String userId = userServiceImpl.getUserIdByToken(token);
            if (userId == null) {
                return Result.error(401, "无效的令牌");
            }
            User user = userServiceImpl.getUserInfo(userId);
            return Result.success(user);
        } catch (RuntimeException e) {
            throw new BusinessException(e.getMessage());
        }
    }

    @GetMapping("/api/user/{userid}/profile")
    public Result getSpecifiedUserProfile(
            @PathVariable("userid") String userId,
            @RequestHeader("Authorization") String token) {
        try {
            // 验证token有效性
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            String currentUserId = userServiceImpl.getUserIdByToken(token);
            if (currentUserId == null) {
                throw new BusinessException("无效的令牌");
            }
            User user = userServiceImpl.getUserInfo(userId);
            return Result.success(user);
        } catch (RuntimeException e) {
            throw new BusinessException(e.getMessage());
        }
    }

    @PostMapping("/api/user/logout")
    public Result logout(@RequestHeader("Authorization") String token) {
        try {
            // 移除Bearer前缀
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            boolean success = userServiceImpl.logout(token);
            if (success) {
                return Result.success("注销成功");
            } else {
                return Result.error("退出失败，无效的令牌");
            }
        } catch (RuntimeException e) {
            throw new BusinessException(e.getMessage());
        }
    }
}