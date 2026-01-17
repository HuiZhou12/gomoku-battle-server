package com.gomokumaster.model;

import com.gomokumaster.utils.SkillResult;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameRoom {
    private String roomId;
    private Player blackPlayer;
    private Player whitePlayer;
    private Piece[][] board;
    private String currentTurnPlayerId;
    private GameStatus status = GameStatus.WAITING;
    private String winnerId;
    private int currentColor;
    private int round;


    /**
     * 普通落子逻辑
     */
    public boolean placePiece(int x, int y, String userId, PieceType type) {
        System.out.println("落子：" + userId + " " + x + " " + y);
        if (x < 0 || x >= 15 || y < 0 || y >= 15) return false;
        if (board[x][y] != null) return false;
        if (!userId.equals(currentTurnPlayerId)) return false;

        //获取玩家并扣除库存
        Player currentPlayer = userId.equals(blackPlayer.getId()) ? blackPlayer : whitePlayer;
        if (!currentPlayer.useStock(type)) {
            // 库存不足，返回false
            return false;
        }

        // 执行落子
        Piece piece = new Piece(userId, x, y, type);
        piece.setColor(userId.equals(blackPlayer.getId()) ? 1 : 2);
        //如果是特殊棋子，设置技能CD
        if(!piece.getType().name().equals("NORMAL")) {
          piece.setMaxCd(piece.getType().getMaxCd());
        }
        board[x][y] = piece;

        // 胜负判定 )
        if (checkWin(x, y, userId)) {
            this.status = GameStatus.FINISHED;
            this.winnerId = userId;
            System.out.println("游戏结束！获胜者: " + userId);
        } else {
            // 没赢，切换回合
            toggleTurn();
        }

        return true;
    }


    // 技能逻辑
    public SkillResult useSkill(int startX, int startY, int targetX, int targetY, String userId) {
        Piece attacker = board[startX][startY];
        Piece target = board[targetX][targetY];

        // 基础校验
        if (attacker == null || !attacker.getOwnerId().equals(userId)) {
            return new SkillResult(false, "这不是你的棋子");
        }
        if (attacker.getSkillCd() > 0) {
            return new SkillResult(false, "技能冷却中");
        }
        switch (attacker.getType()) {
            case ARCHER:
                return handleArcherSkill(attacker, targetX, targetY);
            case CAVALRY:
                return handleCavalrySkill(attacker, targetX, targetY);
            case SHIELD:
                return new SkillResult(false, "盾兵是被动技能，无需主动释放");
            default:
                return new SkillResult(false, "该棋子没有技能");
        }
    }

    //弓兵逻辑
    private SkillResult handleArcherSkill(Piece archer, int tx, int ty) {
        // 逻辑：Math.abs(x - x0) + Math.abs(y - y0)
        int distance = Math.abs(archer.getX() - tx) + Math.abs(archer.getY() - ty);
        if (distance > 2) { // 假设射程是 2
            return new SkillResult(false, "超出攻击范围");
        }
        Piece target = board[tx][ty];
        if (target == null) {
            return new SkillResult(false, "目标位置为空");
        }
        if (target.getOwnerId().equals(archer.getOwnerId())) {
            return new SkillResult(false, "不能攻击友军");
        }
        // 判定伤害 (检查盾)
        boolean killed = tryKillPiece(tx, ty);
        // 设定冷却
        archer.setSkillCd(archer.getMaxCd());

        return new SkillResult(true, killed ? "KILL" : "BLOCKED"); // 返回给前端播放对应音效
    }

    //冲锋棋逻辑
    private SkillResult handleCavalrySkill(Piece cavalry, int tx, int ty) {
        int cx = cavalry.getX();
        int cy = cavalry.getY();

        // 直线检查
        if (cx != tx && cy != ty) {
            return new SkillResult(false, "必须直线冲锋");
        }
        //路径阻挡检查
        if (!isPathClear(cx, cy, tx, ty)) {
            return new SkillResult(false, "路径上有阻挡");
        }
        Piece target = board[tx][ty];
        if (target == null) {
            //单纯移动：
            movePieceInternal(cavalry, tx, ty);
            cavalry.setSkillCd(6);
            return new SkillResult(true, "MOVE");
        }

        if (target.getOwnerId().equals(cavalry.getOwnerId())) {
            return new SkillResult(false, "不能冲撞友军");
        }
        // 攻击判定
        boolean killed = tryKillPiece(tx, ty);
        // 如果杀死了对方，冲锋棋位移过去；如果被盾挡了，原地不动
        if (killed) {
            movePieceInternal(cavalry, tx, ty);
        }

        cavalry.setSkillCd(cavalry.getMaxCd());
        return new SkillResult(true, killed ? "KILL_AND_MOVE" : "BLOCKED");
    }

    //盾兵的核心判定
    // 这是所有技能生效前必须调用的
    private boolean tryKillPiece(int x, int y) {
        Piece target = board[x][y];
        if (target == null) return false;

        // 检查周围 8 格有没有己方的盾兵
        if (isProtectedByShield(x, y, target.getOwnerId())) {
            // 被保护了！无法击杀，盾也不消失
            return false;
        }
        // 没保护，直接移除
        board[x][y] = null;
        target.setAlive(false);
        return true;
    }

    private boolean isProtectedByShield(int x, int y, String ownerId) {
        int[] dx = {-1, -1, -1, 0, 0, 1, 1, 1};
        int[] dy = {-1, 0, 1, -1, 1, -1, 0, 1};

        for (int i = 0; i < 8; i++) {
            int nx = x + dx[i];
            int ny = y + dy[i];
            if (nx >= 0 && nx < 15 && ny >= 0 && ny < 15) {
                Piece p = board[nx][ny];
                if (p != null && p.getType() == PieceType.SHIELD && p.getOwnerId().equals(ownerId)) {
                    //有盾，盾进入冷却
                    p.setSkillCd(p.getMaxCd());
                    return true; // 找到了大哥！
                }
            }
        }
        return false;
    }
    // 检查路径是否通畅
    private boolean isPathClear(int x1, int y1, int x2, int y2) {
        if (x1 == x2) { // 纵向
            int min = Math.min(y1, y2);
            int max = Math.max(y1, y2);
            for (int i = min + 1; i < max; i++) {
                if (board[x1][i] != null) return false;
            }
        } else { // 横向
            int min = Math.min(x1, x2);
            int max = Math.max(x1, x2);
            for (int i = min + 1; i < max; i++) {
                if (board[i][y1] != null) return false;
            }
        }
        return true;
    }

    private void movePieceInternal(Piece p, int nx, int ny) {
        board[p.getX()][p.getY()] = null; // 原地置空
        p.setX(nx);
        p.setY(ny);
        board[nx][ny] = p; // 新地落位
    }

    public void toggleTurn() {
        // 结算当前回合玩家的所有棋子冷却时间
        decreaseCooldowns(currentTurnPlayerId);
        // 切换操作权
        this.currentTurnPlayerId = this.currentTurnPlayerId.equals(blackPlayer.getId()) ?
                whitePlayer.getId() : blackPlayer.getId();
        this.currentColor = 3 - this.currentColor;
        this.round++;
    }
    // 遍历整个棋盘，把归属于 userId 的棋子 CD - 1
    private void decreaseCooldowns(String userId) {
        for (int i = 0; i < 15; i++) {
            for (int j = 0; j < 15; j++) {
                Piece p = board[i][j];
                if (p != null && p.getOwnerId().equals(userId)) {
                    p.decreaseCd();
                }
            }
        }
    }

    private boolean checkWin(int x, int y, String ownerId) {
        // 如果当前落下的这颗子本身就是特殊棋子，那它绝不可能触发胜利
        if (board[x][y].getType() != PieceType.NORMAL) {
            return false;
        }

        // 检查四个方向：横、竖、左斜、右斜
        return checkDirection(x, y, 1, 0, ownerId)  // 横向 (-)
                || checkDirection(x, y, 0, 1, ownerId)  // 纵向 (|)
                || checkDirection(x, y, 1, 1, ownerId)  // 主对角 (\)
                || checkDirection(x, y, 1, -1, ownerId); // 副对角 (/)
    }
    //检查连珠
    private boolean checkDirection(int x, int y, int dx, int dy, String ownerId) {
        int count = 1; // 包含当前落下的这颗子
        // 向正方向寻找 (dx, dy)
        count += countConsecutiveNormal(x, y, dx, dy, ownerId);
        // 向反方向寻找 (-dx, -dy)
        count += countConsecutiveNormal(x, y, -dx, -dy, ownerId);
        return count >= 5;
    }
    //计数逻辑
    private int countConsecutiveNormal(int x, int y, int dx, int dy, String ownerId) {
        int count = 0;
        int tempX = x + dx;
        int tempY = y + dy;

        while (tempX >= 0 && tempX < 15 && tempY >= 0 && tempY < 15) {
            Piece p = board[tempX][tempY];

            //普通棋计数
            if (p != null && p.getOwnerId().equals(ownerId) && p.getType() == PieceType.NORMAL) {
                count++;
            } else {
                break;
            }
            // 继续向前
            tempX += dx;
            tempY += dy;
        }
        return count;
    }
}

