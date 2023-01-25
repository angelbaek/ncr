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

    HttpSession session;

    //  메인페이지 로그인 구현
    public List<UserVO> loginService(String id,HttpServletRequest request){
        List<UserVO> test =loginMapper.loginAdmin(id);
        System.out.println("어드민 계정에 있나? 사이즈: "+test.size());
        // 훈련자 계정이 없을 경우 관리자 계정인지 확인 로직
        if(test.size()!=0){
            System.out.println("어드민 계정으로 로그인 요청합니다.");
//            HttpSession session = request.getSession();
            session = request.getSession();
            System.out.println("세션 등록: "+session);
            session.setAttribute(UserSessionVO.LOGIN_MEMBER,id);
            return loginMapper.loginAdmin(id);
        } else{
            //훈련자 계정 로그인 로직
            System.out.println("일반 계정으로 로그인 요청합니다.");
//            HttpSession session = request.getSession();
            session = request.getSession();
            System.out.println("세션 등록: "+session);
            session.setAttribute(UserSessionVO.LOGIN_MEMBER,id);
            return loginMapper.login(id);
        }

    }

    //  session login 구현
    public List<UserVO> loginSession(HttpServletRequest request){
//        session = request.getSession(false);
        System.out.println("세션 불러오기: "+session);
//        loginMapper.login(session.getId());
        try {
            session.getAttribute(UserSessionVO.LOGIN_MEMBER);
        }catch (NullPointerException e){
            return null;
        }
//        if(session.getAttribute(UserSessionVO.LOGIN_MEMBER)==null){
//            return null;
//        }
        String sessionId = (String) session.getAttribute(UserSessionVO.LOGIN_MEMBER);

        List<UserVO> test = loginMapper.login(sessionId);
        System.out.println(test.size());
        if (loginMapper.login(sessionId).size()==0){
            System.out.println("어드민 정보: "+loginMapper.loginAdmin(sessionId));
            return loginMapper.loginAdmin(sessionId);
        }else {
            System.out.println("유저 정보: "+loginMapper.login(sessionId));
            return loginMapper.login(sessionId);
        }
    }
}
