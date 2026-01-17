package com.gomokumaster.dto.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaseReq {
    private String type; //数据类型：MATCH, MOVE, SKILL, CHAT
    private String data; //具体的JSON字符串
}
