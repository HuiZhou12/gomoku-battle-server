package com.gomokumaster.dto.resp;

import com.gomokumaster.model.Piece;
import com.gomokumaster.model.Player;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameInfoResp {
    private String type;
    private Piece[][] board;
    private Long currentTurnId;
    private Player blackPlayer;
    private Player whitePlayer;
    private String lastAction;
}