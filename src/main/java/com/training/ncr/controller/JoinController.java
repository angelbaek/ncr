package com.training.ncr.controller;

import com.training.ncr.service.JoinService;
import com.training.ncr.vo.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 회원가입 컨트롤러
 */
@RestController
@CrossOrigin
public class JoinController {

    @Autowired
    JoinService joinService;

    // 회원가입
    @PostMapping("/user/join")
    public int callJoin(@RequestBody UserVO userVO){
        return joinService.callJoin(userVO);
    }
}
