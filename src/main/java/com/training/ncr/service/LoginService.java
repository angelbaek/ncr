package com.training.ncr.service;

import com.training.ncr.mapper.LoginMapper;
import com.training.ncr.vo.AdminVO;
import com.training.ncr.vo.UserSessionVO;
import com.training.ncr.vo.UserVO;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Service
public class LoginService {

    @Autowired
    LoginMapper loginMapper;

    // 일반 사용자 로그인
    public List<UserVO> login(String id,String pw){
        return loginMapper.login(id,pw);
    }

    // 관리자 계정 로그인
    public List<AdminVO> loginAdmin(String id,String pw){
        return loginMapper.loginAdmin(id, pw);
    }

}
