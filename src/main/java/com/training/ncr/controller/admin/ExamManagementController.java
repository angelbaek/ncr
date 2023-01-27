package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.ExamManagementService;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamHintVO;
import com.training.ncr.vo.admin.ExamVO;
import com.training.ncr.vo.admin.TacticsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class ExamManagementController {

    @Autowired
    ExamManagementService examManagementService;

    // 그룹 정보 불러오기
    @GetMapping("/admin/exam_mng_grp")
    public List<ExamGrpVO> getExamGrp(){
        return examManagementService.getExamGrp();
    }

    // 선택된 문제그룹 문항 수 가져오기
    @GetMapping("/admin/exam_mng_grp/{grpId}")
    public List<ExamGrpVO> getExamGrpCount(@PathVariable int grpId){
        return examManagementService.getExamGrpCount(grpId);
    }

    // 선택한 문제 내용 가져오기
    @PostMapping("/admin/exam_call")
    public List<ExamVO> getExam(@RequestBody ExamVO examVO){
        return examManagementService.getExam(examVO);
    };

    // 선택한 문항이 설정되지 않았을때
    @PostMapping("/admin/exam_call_none")
    public int insertNoneExam(@RequestBody ExamVO examVO){
        return examManagementService.insertNoneExam(examVO);
    }

    // 선택한 문항 문제id 가져오기
    @PostMapping("/admin/exam_id_get")
    public List<ExamVO> examIdGet(@RequestBody ExamVO examVO){
        return examManagementService.examIdGet(examVO);
    }

    // 힌트 db 추가
    @PostMapping("/admin/hint_insert")
    public int hintInsert(@RequestBody ExamHintVO examHintVO){
        return examManagementService.hintInsert(examHintVO);
    }

    // 힌트 업데이트
    @PatchMapping("/admin/hintUpdate")
    public int hintUpdate(@RequestBody ExamHintVO examHintVO){
        return examManagementService.hintUpdate(examHintVO);
    }

    // 문제 id만 가져오기
    @PostMapping("/admin/only_get_examid")
    public String getExamId(@RequestBody ExamVO examVO){
        return examManagementService.getExamId(examVO);
    }

    // 전술단계 가져오기
    @GetMapping("/admin/get_tactics")
    public List<TacticsVO> getTactics(){
        return examManagementService.getTactics();
    }

    // 전술단계 저장
    @PatchMapping("/admin/update_tactic")
    public int updateTactics(@RequestBody ExamVO examVO){
        return examManagementService.updateTactics(examVO);
    }

    // 문제 최종저장
    @PatchMapping("/admin/exam_final_save")
    public int updateExamFinal(@RequestBody ExamVO examVO){
        return examManagementService.updateExamFinal(examVO);
    }
}
