package com.training.ncr.mapper;

import com.training.ncr.vo.AdminVO;
import com.training.ncr.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface JoinMapper {

    //회원가입
    int join(UserVO userVO);

    //회원 체크
    UserVO userCheck(String tr_user_id);

    //어드민 체크
    AdminVO checkAdmin(String tr_user_id);
}
