package com.training.ncr.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 이 컨트롤러 기능은 view를 리턴하기 위해 존재함 다른 기능 없음!!!!!!!!
 */

@Controller
public class ViewController {

    @GetMapping(value = {"/user_group_setting"})
    public String userGroup1(){
        return "html/user_group_setting";
    }


    @GetMapping(value = {"/admin_training"})
    public String admin(){
        return "html/admin_training";
    }

    @GetMapping(value = {"/join"})
    public String join(){
        return "html/join";
    }

    @GetMapping(value = {"/","/login"})
    public String login(){
        return "html/login";
    }

    @GetMapping(value = {"/admin_exam_group"})
    public String adminExamGroup(){
        return "html/admin_exam_group";
    }

    @GetMapping(value = {"/admin_exam_management"})
    public String adminExam(){
        return "html/admin_exam_management";
    }

    @GetMapping(value = {"admin_exam_explanation"})
    public String adminExamTraining(){
        return "html/admin_exam_explanation.html";
    }

    @GetMapping(value = {"/user_exam_explanation"})
    public String userExamExplanation(){
        return "html/user_exam_explanation.html";
    }
    @GetMapping(value = {"user_exam_statics"})
    public String userExamStatics(){
        return "html/user_exam_statics.html";
    }
}
