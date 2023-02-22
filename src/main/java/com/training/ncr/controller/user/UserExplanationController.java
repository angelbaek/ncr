package com.training.ncr.controller.user;

import com.training.ncr.service.user.UserExplanationService;
import com.training.ncr.vo.UserVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.user.*;
import lombok.val;
import org.apache.catalina.User;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.*;
import java.util.List;
import java.util.Map;

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

    // 풀이 개수, 정답점수, 오답점수, 힌트점수 가져오기
    @PostMapping("/get_total_status")
    public Map<String,Object> getTotalStatus(@RequestBody ExamResultTeamVO examResultTeamVO, HttpServletRequest request){
        return userExplanationService.getTotalStatus(examResultTeamVO, request);
    };

    // 제출하기 event
    @PostMapping("/update_submit")
    public int updateSubmit(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return userExplanationService.updateSubmit(examStatTeamVO,request);
    }

    // 제출여부 event
    @PostMapping("/check_submit")
    public int checkSubmit(@RequestBody ExamStatTeamVO examStatTeamVO, HttpServletRequest request){
        return userExplanationService.checkSubmit(examStatTeamVO,request);
    }

    // 제한시간 경과 시 완료 시간 업데이트
    @PostMapping("/end_time_update_time")
    public int endTimeUpdateTime(@RequestBody ExamStatVO examStatVO, HttpServletRequest request){
        return userExplanationService.endTimeUpdateTime(examStatVO, request);
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam("filename") String filename) throws IOException {
        String filePath = "/path/to/upload/directory/" + filename; // 파일 경로를 상대 경로로 지정합니다.
        File file = new File(filePath);
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + filePath);
        }
        byte[] bytes = FileUtils.readFileToByteArray(file);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setContentLength(bytes.length);
        return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
    }
}
