package com.training.ncr.controller.admin;

import com.training.ncr.service.admin.ExamManagementService;
import com.training.ncr.vo.admin.ExamGrpVO;
import com.training.ncr.vo.admin.ExamVO;
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
}
