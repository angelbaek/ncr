package com.training.ncr.mapper;

import com.training.ncr.vo.AdminVO;
import com.training.ncr.vo.LoginVO;
import com.training.ncr.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Mapper
public interface LoginMapper {

    // 로그인(훈련자)
    List<UserVO> login(LoginVO loginVO);

    // 로그인(어드민)
    List<AdminVO> loginAdmin(LoginVO loginVO);
}
