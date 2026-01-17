package com.gomokumaster.dto.req;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MoveReq {
    private String type; // PLACE OR SKILL

    //落子位置或者 技能释放源头
    private int x;
    private int y;

    //技能释放目标地点
    private Integer targetX;
    private Integer targetY;

    //棋子类型
    private String pieceType;

}
