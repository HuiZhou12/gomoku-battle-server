package com.gomokumaster.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String id;
    private String username;
    @JsonIgnore //防止服务器响应时把密码返回给客户端
    private String password;
    private String avatar;
    private String createTime;
    private String lastLoginTime;
    private String nickname;  //网名
    private String email;
    private int winCount;
    private int loseCount;


}
