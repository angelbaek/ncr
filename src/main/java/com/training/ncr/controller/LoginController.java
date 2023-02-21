package com.training.ncr.controller;

import com.training.ncr.service.LoginService;
import com.training.ncr.vo.LoginVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 로그인 처리를 위한 컨트롤러
 */
@RestController
@CrossOrigin
public class LoginController {

    @Autowired
    LoginService loginService;

    // 로그인(세션 생성)
    @PostMapping("/login")
    public int callLogin(@RequestBody LoginVO loginVO,HttpServletRequest request){
        // 훈련자 아이디
        String id = loginVO.getId();
        String pw = loginVO.getPw();
        // 계정 체크
        if (loginService.loginAdmin(loginVO).size() != 0){ // 관리자 계정이다
            HttpSession session = request.getSession();
            session.setAttribute("ADMIN",loginService.loginAdmin(loginVO));
            session.setAttribute("ADMINID", id);
            System.out.println("ID: "+id+" 관리자 로그인...");
            return 1;
        } else if (loginService.login(loginVO).size() != 0) { // 일반 사용자다
            HttpSession session = request.getSession();
            session.setAttribute("USER",loginService.login(loginVO));
            session.setAttribute("USERID", id);
            System.out.println("ID: "+id+" 훈련자 로그인...");
            return 2;
        }
        // 없는 계정
        return 0;
    }

    // 세션 호출하기
    @GetMapping("/sessionCheck")
    public Object sessionCheck(HttpServletRequest request){
        HttpSession session = request.getSession();
        if(session.getAttribute("ADMIN")!=null){
         return session.getAttribute("ADMIN");
        } else if (session.getAttribute("USER")!=null) {
            return session.getAttribute("USER");
        }
        boolean isNotUser = true;
        return isNotUser;
    }

    // 세션 만료
    @GetMapping("/logout")
    public int logout(HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if(session!=null){
            String id = (String) session.getAttribute("USERID");
            if(id!=null){
                System.out.println("ID: "+id+" 훈련자 로그아웃...");
            }else{
                System.out.println( "관리자 로그아웃...");
            }
            session.invalidate();
            return 1;
        }
        return 0;
    }

    @GetMapping("/get_user_teamcode_view")
    public List<String> getUserTeamcodeView(HttpServletRequest request){
        HttpSession session = request.getSession();
        String id = (String) session.getAttribute("USERID");
        System.out.println("아이디:"+id);
        return loginService.getUserTeamcodeView(id);
    }
}
