package com.training.ncr.service;

import com.training.ncr.mapper.LoginMapper;
import com.training.ncr.vo.AdminVO;
import com.training.ncr.vo.LoginVO;
import com.training.ncr.vo.UserSessionVO;
import com.training.ncr.vo.UserVO;
import org.apache.catalina.User;
import org.apache.ibatis.annotations.Param;
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
    public List<UserVO> login(LoginVO loginVO){
        return loginMapper.login(loginVO);
    }

    // 관리자 계정 로그인
    public List<AdminVO> loginAdmin(LoginVO loginVO){
        return loginMapper.loginAdmin(loginVO);
    }

    public List<String> getUserTeamcodeView(String id) {
        System.out.println("팀코드:"+loginMapper.getUserTeamcodeView(id));
        return loginMapper.getUserTeamcodeView(id);
    }
}
