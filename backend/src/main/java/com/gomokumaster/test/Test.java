package com.gomokumaster.test;

import com.gomokumaster.proto.GamePacket;
import com.gomokumaster.proto.MsgType;

public class Test {
    public static void main(String[] args) {
        GamePacket p = GamePacket.newBuilder()
                .setType(MsgType.CONNECT)
                .build();
        byte[] bytes = p.toByteArray();
        for (byte b : bytes) {
            System.out.printf("%02x", b);
        }
    }
}
