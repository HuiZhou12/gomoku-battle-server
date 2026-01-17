package com.gomokumaster.dto.resp;

import com.gomokumaster.model.Piece;
import com.gomokumaster.model.Player;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MatchResp {
    private String matchId;
    private Player opponent;
    private String yourColor;
    private Player yourInfo;
    private String message;
    private String state;
    private Piece[][] board;
    private int currentTurnId;
    private String lastAction;

}
