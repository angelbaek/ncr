package com.training.ncr.controller.user;

import com.training.ncr.service.user.UserExplanationService;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.user.ExamResultTeamVO;
import com.training.ncr.vo.user.ExamResultVO;
import com.training.ncr.vo.user.ExamStatTeamVO;
import com.training.ncr.vo.user.ExamStatVO;
import lombok.val;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import java.util.List;

import static com.training.ncr.vo.UserVO.session;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserExplanationController {

    @Autowired
    UserExplanationService userExplanationService;

    // 첫 사용자 훈련 진입 시 db insert
    @PostMapping("/insert_train_exam_stat")
    public int insertUserTrainExamStat(@RequestBody ExamStatVO examStatVO, HttpServletRequest request){
        return userExplanationService.insertUserTrainExamStat(examStatVO,request);
    }

    // 첫 사용자 훈련 진입 시 db insert
    @PostMapping("/insert_train_exam_team_stat")
    public int insertUserTrainExamStat(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return userExplanationService.insertExamstatTeam(examStatTeamVO,request);
    }

    // 훈련자별, 훈련팀별 db 첫 진입시 insert
    @PostMapping("/insert_train_examresult_and_team")
    public int insertTrainExamResultAndTeam(@RequestBody ExamResultVO examResultVO, HttpServletRequest request){
        return userExplanationService.insertTrainExamResultAndTeam(examResultVO,request);
    }

    // 힌트 using 메소드
    @PostMapping("/using_hint")
    public int hintUsing(@RequestBody ExamResultVO examResultVO, HttpServletRequest request){
        return userExplanationService.hintUsing(examResultVO,request);
    }

    // 해당 힌트 가져오기
    @PostMapping("/get_hint")
    public List<ExamHintVO> getHint(@RequestBody ExamHintVO examHintVO){
        return userExplanationService.getHint(examHintVO);
    }

    // 정답확인 메소드( 객관식{복수정답 포함} )
    @PostMapping("/using_answer_multi")
    public int inputAnswerMuiltiple(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return userExplanationService.inputAnswerMuiltiple(examResultTeamVO,request);
    }

    // 정답확인 메소드( 주관식 )
    @PostMapping("/using_answer_short_form")
    public int inputAnswerShortForm(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return userExplanationService.inputAnswerShortForm(examResultTeamVO,request);
    }

    // 풀이 중인 훈련자 팀 가져오기
    @PostMapping("/get_exam_result_team")
    public List<ExamResultTeamVO> getExamResultTeamInfo(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return userExplanationService.getExamResultTeamInfo(examResultTeamVO,request);
    }

    // 훈련 시작한 시간 가져오기
    @PostMapping("/get_start_training_get_time")
    public List<String> startTrainingGetTime(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return userExplanationService.startTrainingGetTime(examStatTeamVO, request);
    }

    // 훈련팀별 풀이 현황정보 정답 수 update
    @PostMapping("/count_ans_exam_result_team")
    public int countAnsExamResultTeam(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return userExplanationService.countAnsExamResultTeam(examResultTeamVO,request);
    }
}
