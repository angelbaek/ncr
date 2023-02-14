package com.training.ncr.controller.user;

import com.training.ncr.service.user.UserExplanationService;
import com.training.ncr.service.user.UserStaticsService;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserStaticsController {

    @Autowired
    UserStaticsService userStaticsService;

    // 선택한 차시, 유형으로 뿌려주기
    @PostMapping("/get_exam_result_by_num_and_type")
    public Object getExamResultByNumAndType(@RequestBody UserStaticsVO userStaticsVO){
        return userStaticsService.getExamResultByNumAndType(userStaticsVO);
    }

    // 훈련자 기관명 가져오기
    @PostMapping("/select_user_org_by_user_id")
    public UserVO selectUserOrgByUserId(@RequestBody Map<String,Object> stringObjectMap){
        return userStaticsService.selectUserOrgByUserId(stringObjectMap);
    }

    // 선택한 훈련자 풀이현황 가져오기
    @PostMapping("/get_user_exam_stat")
    public ExamStatVO getUserExamStat(@RequestBody ExamStatVO examStatVO){
        return userStaticsService.getUserExamStat(examStatVO);
    }
}
