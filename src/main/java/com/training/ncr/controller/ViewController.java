package com.training.ncr.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 이 컨트롤러는 오로지 view를 리턴하기 위해 존재함 다른 기능 없음!!!!!!!!
 */

@Controller
public class ViewController {

    @GetMapping("/")
    public String main(){
        return "/html/login";
    }

    @GetMapping("/user_group_setting.html")
    public String userGroup(){
        return "/html/user_group_setting.html";
    }

    @GetMapping("/admin_training.html")
    public String admin(){
        return "/html/admin_training.html";
    }

    @GetMapping("/html/join.html")
    public String join(){
        return "/html/join.html";
    }

    @GetMapping("/html/login.html")
    public String login(){
        return "/html/login.html";
    }
}
