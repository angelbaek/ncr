package com.training.ncr.controller.user;

import com.training.ncr.service.user.UserExplanationService;
import com.training.ncr.service.user.UserStaticsService;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.MatrixVO;
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
    public Object getExamResultByNumAndType(@RequestBody UserStaticsVO userStaticsVO,HttpServletRequest request){
        return userStaticsService.getExamResultByNumAndType(userStaticsVO,request);
    }

    // 훈련자 기관명 가져오기
    @PostMapping("/select_user_org_by_user_id")
    public UserVO selectUserOrgByUserId(@RequestBody Map<String,Object> stringObjectMap){
        return userStaticsService.selectUserOrgByUserId(stringObjectMap);
    }

    // 선택한 훈련자 풀이현황 가져오기
    @PostMapping("/get_user_exam_stat")
    public List<ExamResultVO> getUserExamStat(@RequestBody ExamResultVO examResultVO){
        return userStaticsService.selectExamResult(examResultVO);
    }

    // 선택한 훈련팀별 세부사항 가져오기
    @PostMapping("/static/get_exam_result_team")
    public List<ExamStatTeamVO> getExamResultTeam(@RequestBody ExamResultTeamVO examResultTeamVO){
        return userStaticsService.getExamResultTeam(examResultTeamVO);
    }

    // 선택한 팀에 해당하는 매트릭스 스탯 가져오기
    @PostMapping("/static/get_matrix_stat")
    public List<Map<String,Object>> getMatrixStat(@RequestBody MatrixStatVO matrixStatVO){
        return userStaticsService.getMatrixStat(matrixStatVO);
    }

    // 선택한 팀에 해당하는 매트릭스, 전술단계 가져오기
    @PostMapping("/static/get_matrix")
    List<Map<String,Object>> getMiterAttackMatrix(@RequestBody MatrixStatVO matrixStatVO){
        return userStaticsService.getMiterAttackMatrix(matrixStatVO);
    }

    // 해당문제 기본 시간 가져오기
    @GetMapping("/static/get_time/{tr_exam_grpid}")
    public int getTotalTime(@PathVariable int tr_exam_grpid){
        return userStaticsService.getTotalTime(tr_exam_grpid);
    }

    // 활성화된 문제 그룹 가져오기
    @GetMapping("/static/get_grpid")
    public int getGrpidByMgmtStateOn(){
        return userStaticsService.getGrpidByMgmtStateOn();
    }

    // 훈련팀 기관명 가져오기
    @PostMapping("/static/get_org")
    public List<String> getTeamOrg(@RequestBody Map<String,Object> map){
        return userStaticsService.getTeamOrg(map);
    }

    // 선택한 매트릭스 내용 가져오기
    @PostMapping("/get_tech_and_mit")
    public List<Map<String,String>> popUp(@RequestBody MatrixVO matrixVO){
        return userStaticsService.popUp(matrixVO);
    }

    // 오답 정답으로 변환
    @PostMapping("/static/false_change_true")
    public int falseToTrue(@RequestBody Map<String,Object> map){
        return userStaticsService.falseToTrue(map);
    }

    // 선택한 문항에 대한 세부사항 보여주기
    @PostMapping("/static/get_select_detail")
    public Map<String,Object> getSelectDetail(@RequestBody Map<String,Object> map){
        return userStaticsService.getSelectDetail(map);
    }
}
