package com.gomokumaster.service.impl;

import com.gomokumaster.entity.User;
import com.gomokumaster.exception.BusinessException;
import com.gomokumaster.mapper.UserMapper;
import com.gomokumaster.service.UserService;
import com.gomokumaster.service.UserSessionService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.redisson.RedissonLock;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserServiceImpl implements UserService {
    private static final String SECRET = "my-super-secret-key-which-is-at-least-32-bytes-long";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7; // 一星期
    private UserMapper UserMapper;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.UserMapper = userMapper;
    }
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RedissonClient redissonClient;
    // 存储token和用户ID的映射
    private ConcurrentHashMap<String, String> tokenToUserId = new ConcurrentHashMap<>();
    // 存储用户ID和token的映射
    private ConcurrentHashMap<String, String> userIdToToken = new ConcurrentHashMap<>();


    public User register(String email, String password) {
        try {
            if (UserMapper.isExitEmail(email) != null) {
                throw new BusinessException("邮箱已存在");
            }
            if (password.length() < 8) {
                throw new BusinessException("密码至少 8 位");
            }
            String encodedPassword = passwordEncoder.encode(password);
            UserMapper.registerUser(email,encodedPassword);
            RBucket<User> bucket = redissonClient.getBucket("user:register:" + email);
            // 根据邮箱获取注册的用户信息
            String userId = UserMapper.getUserId(email);
            //缓存用户信息30分钟
            bucket.set(UserMapper.getUserById(userId), Duration.ofMinutes(30));

            UserMapper.updateUsername(generateUsername(),userId);
            return UserMapper.getUserInfo(userId);
        } catch (Exception e) {
            throw new BusinessException("注册失败: "+ e.getMessage());
        }
    }

    public String login(String email, String password) {
        RBucket<User> userBucket =  redissonClient.getBucket("user:register:" + email);
        User user = userBucket.get();
        if (user == null) {
            //当用户信息不存在时，才从数据库中获取
            System.out.println("用户信息不存在，从数据库中获取");
            user = UserMapper.getUserByEmail(email);
            userBucket.set(user, Duration.ofMinutes(30));
        }
        if (user == null) {
            return null; // 或抛异常：用户不存在
        }
        String encodedPassword = user.getPassword();
        if (!passwordEncoder.matches(password, encodedPassword)) {
            return null; // 或抛异常：密码错误
        }
        String userId = user.getId();
        System.out.println("用户ID：" + userId);
        // 生成 token
        String token = generateToken(userId, email);
        // 移除旧 token
        String oldToken = userIdToToken.get(userId);
        if (oldToken != null) {
            tokenToUserId.remove(oldToken);
        }
        // 存储新 token
        tokenToUserId.put(token, userId);
        userIdToToken.put(userId, token);
        return token;
    }




    public User getUserInfo(String userId) {
        DateTimeFormatter formatter =  DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        User user = UserMapper.getUserInfo(userId);
        user.setCreateTime(
                LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(UserMapper.getCreateTime(userId)),
                        ZoneId.systemDefault()
                ).format(formatter)
        );
        user.setLastLoginTime(
                LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(UserMapper.getLastLoginTime(userId)),
                        ZoneId.systemDefault()
                ).format(formatter)
        );
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return user;
    }


    public String getUserIdByToken(String token)
    {
        return tokenToUserId.get(token);
    }


    public boolean logout(String token) {
        String userId = tokenToUserId.remove(token);
        if (userId != null) {
            userIdToToken.remove(userId);
            return true;
        }
        return false;
    }


    public String generateToken(String userId, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims) // 添加自定义信息
                .setSubject(userId)  // 设置主题
                .setId(UUID.randomUUID().toString())  // 设置ID
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String generateUsername() {
        return "用户" + UUID.randomUUID().toString().substring(0, 8);
    }
}

