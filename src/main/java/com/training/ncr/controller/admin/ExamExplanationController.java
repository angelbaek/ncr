package com.training.ncr.controller.admin;

import com.training.ncr.mapper.admin.ExamExplanationMapper;
import com.training.ncr.service.admin.ExamExplanationService;
import com.training.ncr.vo.NowExamVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.MgmtVO;
import com.training.ncr.vo.user.ExamResultTeamVO;
import com.training.ncr.vo.user.ExamResultVO;
import com.training.ncr.vo.user.ExamStatTeamVO;
import com.training.ncr.vo.user.ExamStatVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/admin")
public class ExamExplanationController {

    @Autowired
    ExamExplanationService examExplanationService;

    // 문제 풀이 그룹 조회
    @GetMapping("/exam_explanation")
    public List<MgmtVO> searchMgmtState(){
        return examExplanationService.searchMgmtState();
    };

    // 훈련 시작한 문항과 문제그룹정보 가져오기
    @GetMapping("/exam_explanation_sel/{grpName}")
    public List<NowExamVO> getStartExamAndGrp(@PathVariable String grpName){
        return examExplanationService.getStartExamAndGrp(grpName);
    }

    // 해당 힌트 가져오기
    @PostMapping("/exam_hint_get")
    public List<ExamHintVO> getHintFunc(@RequestBody ExamHintVO examHintVO){
        return examExplanationService.getHintFunc(examHintVO);
    }

    // 첫 사용자 훈련 진입 시 db insert
    @PostMapping("/insert_train_exam_team_stat")
    public int insertUserTrainExamStat(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return examExplanationService.insertExamstatTeam(examStatTeamVO,request);
    }

    // 훈련자별, 훈련팀별 db 첫 진입시 insert
    @PostMapping("/insert_train_examresult_and_team")
    public int insertTrainExamResultAndTeam(@RequestBody ExamResultVO examResultVO, HttpServletRequest request){
        return examExplanationService.insertTrainExamResultAndTeam(examResultVO,request);
    }

    // 힌트 using 메소드
    @PostMapping("/using_hint")
    public int hintUsing(@RequestBody ExamResultVO examResultVO, HttpServletRequest request){
        return examExplanationService.hintUsing(examResultVO,request);
    }

    // 해당 힌트 가져오기
    @PostMapping("/get_hint")
    public List<ExamHintVO> getHint(@RequestBody ExamHintVO examHintVO){
        return examExplanationService.getHint(examHintVO);
    }

    // 정답확인 메소드( 객관식{복수정답 포함} )
    @PostMapping("/using_answer_multi")
    public int inputAnswerMuiltiple(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return examExplanationService.inputAnswerMuiltiple(examResultTeamVO,request);
    }

    // 정답확인 메소드( 주관식 )
    @PostMapping("/using_answer_short_form")
    public int inputAnswerShortForm(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return examExplanationService.inputAnswerShortForm(examResultTeamVO,request);
    }

    // 풀이 중인 훈련자 팀 가져오기
    @PostMapping("/get_exam_result_team")
    public List<ExamResultTeamVO> getExamResultTeamInfo(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return examExplanationService.getExamResultTeamInfo(examResultTeamVO,request);
    }

    // 훈련 시작한 시간 가져오기
    @PostMapping("/get_start_training_get_time")
    public List<String> startTrainingGetTime(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return examExplanationService.startTrainingGetTime(examStatTeamVO, request);
    }

    // 훈련팀별 풀이 현황정보 정답 수 update
    @PostMapping("/count_ans_exam_result_team")
    public int countAnsExamResultTeam(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return examExplanationService.countAnsExamResultTeam(examResultTeamVO,request);
    }

    // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
    @PostMapping("/get_total_status")
    public Map<String,Object> getTotalStatus(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return examExplanationService.getTotalStatus(examResultTeamVO, request);
    };

    // 제출하기 event
    @PostMapping("/update_submit")
    public int updateSubmit(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return examExplanationService.updateSubmit(examStatTeamVO,request);
    }

    // 제출여부 event
    @PostMapping("/check_submit")
    public int checkSubmit(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return examExplanationService.checkSubmit(examStatTeamVO,request);
    }

    // 제한시간 경과 시 완료 시간 업데이트
    @PostMapping("/end_time_update_time")
    public int endTimeUpdateTime(@RequestBody ExamStatVO examStatVO, HttpServletRequest request){
        return examExplanationService.endTimeUpdateTime(examStatVO, request);
    }
}
