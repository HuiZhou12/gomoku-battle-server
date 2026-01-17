package com.gomokumaster.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private  String secretKey;
    private static final String SECRET = "my-super-secret-key-which-is-at-least-32-bytes-long";
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    @Value("${jwt.expiration}")
    private Long expiration;

    public static Claims validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException("JWT不能为空");
        }

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT已过期");
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("不支持的JWT格式");
        } catch (MalformedJwtException e) {
            throw new RuntimeException("JWT格式错误");
        } catch (SignatureException e) {
            throw new RuntimeException("JWT签名验证失败");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("JWT参数错误");
        } catch (JwtException e) {
            throw new RuntimeException("JWT解析异常: " + e.getMessage());
        }
    }


    public static Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        return Long.parseLong(claims.getSubject());
    }

    public String getUsernameFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.get("email", String.class);
    }

    public Date getExpirationDateFromToken(String token) {
        Claims claims = validateToken(token);
        return claims.getExpiration();
    }
}