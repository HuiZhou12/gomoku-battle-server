package com.gomokumaster.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Piece {
    private String id;        // 棋子唯一ID
    private int x;            // 坐标 X
    private int y;            // 坐标 Y
    private String ownerId;     // 是谁的棋子
    private PieceType type;   // 棋子类型
    private int maxCd;       // 技能最大冷却回合数
    private int color;       // 棋子颜色 黑色1， 白色2
    private boolean isAlive = true; // 状态属性
    private int skillCd = 0;           // 当前技能冷却回合数

    public Piece(String ownerId, int x, int y, PieceType type) {
        this.id = type.name() + "_" + x + "_" + y + "_" + System.currentTimeMillis();
        this.ownerId = ownerId;
        this.x = x;
        this.y = y;
        this.type = type;
        this.skillCd = 0; // 初始无冷却
    }
    public void decreaseCd() {
        if(skillCd > 0)
            skillCd--;
    }

}
