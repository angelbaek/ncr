package com.training.ncr.controller.user;

import com.training.ncr.service.user.UserExplanationService;
import com.training.ncr.vo.user.ExamStatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static com.training.ncr.vo.UserVO.session;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserExplanationController {

    @Autowired
    UserExplanationService userExplanationService;

    // 유저 세션id로 userGRP, TEAM_CD 구하기
    @PostMapping("/insert_train_exam_stat")
    public int getUserGrpAndTeamCD(@RequestBody ExamStatVO examStatVO){
        return userExplanationService.getUserGrpAndTeamCD(examStatVO);
    }
}
