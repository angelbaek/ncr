package com.training.ncr.mapper;

import com.training.ncr.vo.AdminVO;
import com.training.ncr.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Mapper
public interface LoginMapper {

    // 로그인(훈련자)
    List<UserVO> login(String id);

    // 로그인(어드민)
    List<UserVO> loginAdmin(String id);
}
