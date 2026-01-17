package com.gomokumaster.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class Player {
    private String id;
    String name; //黑棋还是白棋
    String avatar; //头像
    boolean isConnected; //在房间是否处于在线状态
    int currentColor; //1 黑棋，2 白棋
    int remainingShieldCount; //剩余的盾棋数
    int remainingArcherCount; //剩余的弓棋数
    int remainingCavalryCount;//剩余的冲刺棋数

    public boolean useStock(PieceType type) {
        switch (type) {
            case NORMAL:
                return true; // 普通棋无限
            case ARCHER:
                if (remainingArcherCount > 0) {
                    remainingArcherCount--;
                    return true;
                }
                return false;
            case CAVALRY:
                if (remainingCavalryCount > 0) {
                    remainingCavalryCount--;
                    return true;
                }
                return false;
            case SHIELD:
                if (remainingShieldCount > 0) {
                    remainingShieldCount--;
                    return true;
                }
                return false;
            default:
                return false;
        }
    }
    public boolean getIsConnected() {
        return isConnected;
    }

    public void setIsConnected(boolean isConnected) {
        this.isConnected = isConnected;
    }
}
