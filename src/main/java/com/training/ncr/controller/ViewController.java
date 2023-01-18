package com.training.ncr.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 이 컨트롤러 기능은 view를 리턴하기 위해 존재함 다른 기능 없음!!!!!!!!
 */

@Controller
public class ViewController {

    @GetMapping("/")
    public String main(){
        return "/html/login";
    }

    @GetMapping(value = {"/user_group_setting.html","/html/user_group_setting.html"})
    public String userGroup1(){
        return "/html/user_group_setting.html";
    }


    @GetMapping(value = {"/admin_training.html","/html/admin_training.html"})
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
