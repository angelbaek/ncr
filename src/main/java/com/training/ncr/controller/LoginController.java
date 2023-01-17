package com.training.ncr.controller;

import com.training.ncr.service.LoginService;
import com.training.ncr.vo.UserVO;
import lombok.val;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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
    @GetMapping("/login/{id}")
    public List<UserVO> callLogin(@PathVariable String id,HttpServletRequest request){
        return loginService.loginService(id,request);
    }

    // 세션 호출하기
    @GetMapping("/user")
    public List<UserVO> callSession(HttpServletRequest request){
        return loginService.loginSession(request);
    }
}
