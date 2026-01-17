package com.gomokumaster.utils;

import lombok.Data;


@Data
public class Result {
    private Integer code; //编码 200成功
    private String message; // 错误信息
    private Object data;//信息


    public static Result success() {
        Result result = new Result();
        result.code = 200;
        result.message= "success";
        return result;
    }
    public static Result success(String message) {
        Result result = new Result();
        result.code = 200;
        result.message= message;
        return result;
    }

    public static Result success(Object object){
        Result result = new Result();
        result.data = object;
        result.code = 200;
        result.message= "success";
        return result;
    }

    public static Result error(String message) {
        Result result = new Result();
        result.code = 401;
        result.message= message;
        return result;

    }
    public static Result error(Integer code, String message) {
        Result result = new Result();
        result.code = code;
        result.message= message;
        return result;

    }
}

