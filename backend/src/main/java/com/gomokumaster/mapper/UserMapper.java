package com.gomokumaster.mapper;

import com.gomokumaster.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper {

    @Insert("INSERT INTO user (email, password, create_time, last_login_time) VALUES (#{email}, #{password}, NOW(), NOW())")
    void registerUser(String email, String password);

    @Select("SELECT id FROM user WHERE email = #{email} ")
    String getUserId(String email);

    @Select("SELECT id, username, nickname, avatar, email, win_count, lose_count, create_time, last_login_time FROM user WHERE id = #{userId}")
    User getUserInfo(String userId);

    @Select("SELECT password FROM user WHERE email = #{email}")
    String validateUser(String email);

    @Select("SELECT * FROM user WHERE email = #{email}")
    User getUserByEmail(String email);

    @Select("SELECT COUNT(*) > 0 FROM user WHERE username = #{username}")
    boolean existsByUsername(String username);

    @Update("UPDATE user SET password=#{password} WHERE id=#{id}")
    void updatePassword(User user);

    @Select("SELECT email FROM user WHERE email = #{email}")
    String isExitEmail(String email);

    @Select("SELECT create_time FROM user WHERE id = #{userId}")
    Long getCreateTime(String userId);

    @Select("SELECT last_login_time FROM user WHERE id = #{userId}")
    Long getLastLoginTime(String userId);
    @Update("UPDATE user SET username=#{username} WHERE id= #{userId}")
    void updateUsername(String username, String userId);

    @Select("SELECT * FROM user WHERE id = #{userId}")
    User getUserById(String userId);
}
