package com.gomokumaster.model;

import lombok.Getter;

@Getter
//一组“提前创建好的、唯一的、不可再 new 的对象”。
public enum PieceType {
    NORMAL(0),   // 普通棋
    ARCHER(4),   // 弓兵 (最大冷却4)
    CAVALRY(5),  // 骑兵
    SHIELD(6);   // 盾兵

    private final int maxCd;

    PieceType(int maxCd) {
        this.maxCd = maxCd;
    }
}
