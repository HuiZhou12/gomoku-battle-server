package com.gomokumaster.dto.resp;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatResp {
    private String id;
    private int senderColor;
    private String text;
    private String time;

}
